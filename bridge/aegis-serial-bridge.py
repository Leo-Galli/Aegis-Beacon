#!/usr/bin/env python3
"""
aegis-serial-bridge.py - Aegis-Beacon serial bridge (Windows / macOS / Linux)

Reads the machine-readable "AEGIS:" lines the firmware prints over USB serial
and forwards GPS positions to the official website:

  1. It auto-detects the serial port (or you can pass --port).
  2. When the beacon reports a position (AEGIS:POS:lat=..;lng=..;fix=..;age=..), the
     bridge builds a link with the coordinates:
     https://aegis-beacon.vercel.app/report-position?lat=..&lng=..
  3. If the /report-position page is already open in a browser, this bridge's
     tiny loopback HTTP endpoint is being polled by that page, so the bridge
     knows not to open new tabs and the page updates live instead.
     If the page is not open, the bridge opens it, already filled in.

No API keys, no accounts, no cloud: everything stays on 127.0.0.1 except the
page you choose to open.

Requires Python 3.8+ and pyserial:
    pip install pyserial          (or: py -m pip install pyserial on Windows)

The bridge ships with a live terminal dashboard (TUI): device status, latest
position, page state and a scrolling log. It auto-enables when stdout is a
terminal, or can be forced with --tui / disabled with --no-tui.

Examples:
    python bridge/aegis-serial-bridge.py
    python bridge/aegis-serial-bridge.py --list
    python bridge/aegis-serial-bridge.py --port COM3
    python bridge/aegis-serial-bridge.py --port /dev/ttyUSB0 --no-open
    python bridge/aegis-serial-bridge.py --no-tui          # plain log lines
    python bridge/aegis-serial-bridge.py --http-port 9123 --site http://localhost:4321
"""

import argparse
import datetime
import json
import os
import shutil
import sys
import threading
import time
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlencode, urlsplit

try:
    import serial
    import serial.tools.list_ports
except ImportError:  # pragma: no cover
    sys.exit(
        "pyserial is required. Install it with:\n"
        "    pip install pyserial\n"
        "or on Windows:  py -m pip install pyserial"
    )

DEFAULT_BAUD = 115200
DEFAULT_HTTP_PORT = 8765
DEFAULT_SITE = "https://aegis-beacon.vercel.app"
PAGE_OPEN_WINDOW_S = 10.0  # a page heartbeat newer than this counts as "open"
POS_PATH = "/report-position"

# Well-known USB serial chips used by ESP32 dev boards.
PREFERRED_VIDS = {0x10C4, 0x1A86, 0x0403, 0x303A}  # CP210x, CH340, FTDI, ESP32-S3 native
PREFERRED_HINTS = ("cp210", "ch340", "silicon", "ftdi", "ft232", "usb serial", "usbserial", "usbmodem")


# ---------------------------------------------------------------------------
# Bridge state
# ---------------------------------------------------------------------------
class BridgeState:
    def __init__(self):
        self.lock = threading.Lock()
        self.latest = None      # dict of the most recent AEGIS:POS: data
        self.ts = 0             # increments only when the position actually changes
        self.page_heartbeat = 0.0  # time.monotonic() of last page poll

    def page_is_open(self):
        with self.lock:
            return (time.monotonic() - self.page_heartbeat) < PAGE_OPEN_WINDOW_S

    def note_page_ping(self):
        with self.lock:
            self.page_heartbeat = time.monotonic()

    _SIGNIFICANT_KEYS = ("lat", "lng", "alt", "sats", "freq", "mode", "payload", "fix")

    def set_position(self, data):
        """Store a position; bump the stream counter only when something real
        changed, so the page draws a track of movement, not repeated dots."""
        with self.lock:
            changed = self.latest is None
            if not changed:
                for key in self._SIGNIFICANT_KEYS:
                    if self.latest.get(key) != data.get(key):
                        changed = True
                        break
            if changed:
                self.latest = data
                self.ts += 1
            return self.ts


STATE = BridgeState()


# ---------------------------------------------------------------------------
# Terminal UI (TUI)
# ---------------------------------------------------------------------------
# A small live dashboard rendered with ANSI escapes. Every draw is protected
# by TUI.lock so log lines from other threads cannot interleave mid-frame.
# Falls back to plain line logging automatically when stdout is not a TTY.
TRACK_MAX = 8  # how many recent fixes the dashboard keeps on screen


class TUI:
    def __init__(self):
        self.lock = threading.Lock()
        self.enabled = sys.stdout.isatty()
        self.lines = []          # rolling log lines (newest last)
        self.last_status = ""
        self.last_pos = "no position received yet"
        self.last_page = "not detected"
        self.last_url = ""      # public site link for the latest fix (shareable)
        self.track = []          # recent fixes: (time, lat, lng, url), newest last
        self.started = time.time()

    def _clear(self):
        # Move to home, clear the screen and the scrollback buffer.
        sys.stdout.write("\x1b[2J\x1b[H\x1b[3J")

    def _bar(self, label, value, width=34):
        return f"{label:<10} {value}".ljust(width)

    def set_share(self, url):
        """Remember the latest fix's public link and push it onto the on-screen
        track so the user always has the current shareable URL and the path."""
        with self.lock:
            self.last_url = url
            if self.last_pos and self.last_pos != "no position received yet":
                now = datetime.datetime.now().strftime("%H:%M:%S")
                self.track.append((now, self.last_pos, url))
                if len(self.track) > TRACK_MAX:
                    del self.track[: len(self.track) - TRACK_MAX]
            self.draw()

    def draw(self):
        if not self.enabled:
            return
        with self.lock:
            width = min(shutil.get_terminal_size((80, 24)).columns, 96)
            now = datetime.datetime.now().strftime("%H:%M:%S")
            uptime = int(time.time() - self.started)
            lines = []
            lines.append("")
            lines.append(f"  AEGIS-BEACON SERIAL BRIDGE   {now}   uptime {uptime}s".ljust(width))
            lines.append("  " + "-" * (width - 2))
            lines.append("  " + self._bar("Device", self.last_status))
            lines.append("  " + self._bar("Position", self.last_pos))
            lines.append("  " + self._bar("Share", self.last_url or "(public link appears on first fix)"))
            lines.append("  " + self._bar("Page", self.last_page))
            if self.track:
                lines.append("  " + "-" * (width - 2))
                lines.append("  Local track (path taken, newest last):")
                for ts, pos, _url in self.track:
                    lines.append(f"    {ts}  {pos}")
            lines.append("  " + "-" * (width - 2))
            lines.append("  Live log:")
            body = self.lines[- (width // 2) - 8:]  # keep the newest lines
            for line in body:
                lines.append("  " + line[: width - 2])
            frame = "\n".join(lines)
            self._clear()
            sys.stdout.write(frame + "\n")
            sys.stdout.flush()

    def log(self, msg):
        if not self.enabled:
            print(msg)
            return
        with self.lock:
            self.lines.append(msg)
            self.draw()

    def set_status(self, status):
        with self.lock:
            self.last_status = status
            self.draw()

    def set_position(self, text):
        with self.lock:
            self.last_pos = text
            self.draw()

    def set_page(self, text):
        with self.lock:
            self.last_page = text
            self.draw()


TUI_UI = TUI()


# ---------------------------------------------------------------------------
# Serial reading
# ---------------------------------------------------------------------------
def score_port(port):
    """Higher is better. Prefer USB serial adapters over bluetooth/other."""
    desc = ((port.description or "") + " " + (port.device or "")).lower()
    score = 0
    if port.vid in PREFERRED_VIDS:
        score += 3
    for hint in PREFERRED_HINTS:
        if hint in desc:
            score += 2
            break
    if port.device and ("bluetooth" in desc or "ble" in desc):
        score -= 4
    return score


def detect_port(explicit=None):
    if explicit:
        return explicit
    ports = sorted(serial.tools.list_ports.comports(), key=score_port, reverse=True)
    if not ports:
        return None
    best = ports[0]
    if score_port(best) <= 0:
        return None
    return best.device


def parse_pos_line(line):
    """Parse an AEGIS:POS:lat=..;lng=..;... line into a dict of floats/strs."""
    body = line.strip()
    prefix = "AEGIS:POS:"
    if body.upper().startswith(prefix):
        body = body[len(prefix):]
    data = {}
    for pair in body.split(";"):
        pair = pair.strip()
        if "=" not in pair:
            continue
        key, _, value = pair.partition("=")
        key = key.strip().lower()
        value = value.strip()
        if not key or not value:
            continue
        if key in ("lat", "lng", "alt", "sats", "freq", "fix", "age"):
            try:
                data[key] = float(value)
            except ValueError:
                continue
        else:
            data[key] = value
    if "lng" not in data and "lon" in data:
        data["lng"] = data.pop("lon")
    # Sanity clamps: never trust a coordinate outside the real world, and cap
    # free-form fields so a corrupt line cannot grow into a huge payload.
    if "lat" in data and not (-90.0 <= data["lat"] <= 90.0):
        data.pop("lat")
    if "lng" in data and not (-180.0 <= data["lng"] <= 180.0):
        data.pop("lng")
    if "payload" in data:
        data["payload"] = str(data["payload"])[:128]
    if "mode" in data:
        data["mode"] = str(data["mode"])[:32]
    return data


def build_site_url(site, data):
    params = {}
    for key in ("lat", "lng", "alt", "sats", "freq", "mode", "payload"):
        if key in data and data[key] not in (None, ""):
            params[key] = data[key]
    qs = urlencode(params)
    return site.rstrip("/") + POS_PATH + ("?" + qs if qs else "")


# Last browser-open (lat, lng, monotonic time) so repeated identical fixes
# do not spawn a new tab every few seconds.
_LAST_OPEN = [None, None, 0.0]
_OPEN_MOVE_DEG = 0.00025   # ~25 m at the equator
_OPEN_MIN_INTERVAL_S = 120.0


def should_open_browser(data):
    """True when the page is not open and the fix is worth a new tab: first fix,
    a real move, or a periodic refresh so a stale tab is re-raised."""
    lat, lng = data["lat"], data["lng"]
    now = time.monotonic()
    if _LAST_OPEN[2] == 0.0:
        _LAST_OPEN[0], _LAST_OPEN[1], _LAST_OPEN[2] = lat, lng, now
        return True
    moved = abs(lat - _LAST_OPEN[0]) > _OPEN_MOVE_DEG or abs(lng - _LAST_OPEN[1]) > _OPEN_MOVE_DEG
    stale = (now - _LAST_OPEN[2]) > _OPEN_MIN_INTERVAL_S
    if moved or stale:
        _LAST_OPEN[0], _LAST_OPEN[1], _LAST_OPEN[2] = lat, lng, now
        return True
    return False


def _forward_stdin(ser_ref, stop):
    """Background thread: read lines from the terminal and write them to the
    device as serial commands (FREQ, WPM, MODE, POS, STATUS, HELP)."""
    try:
        while not stop.is_set():
            try:
                line = input()
            except EOFError:
                return
            except KeyboardInterrupt:
                return
            line = line.strip()
            if not line:
                continue
            if line.lower() in ("quit", "exit"):
                TUI_UI.log("[bridge] bye")
                stop.set()
                return
            ser = ser_ref[0]
            if ser is not None and ser.is_open:
                try:
                    ser.write((line + "\r\n").encode("utf-8"))
                    TUI_UI.log(f"[bridge] -> device: {line}")
                except serial.SerialException as exc:
                    TUI_UI.log(f"[bridge] cannot send command ({exc})")
            else:
                TUI_UI.log("[bridge] device not connected, command ignored")
    except Exception:  # noqa: BLE001
        pass


def handle_serial(device, baud, site, no_open, verbose):
    """Open the port (with reconnect), process AEGIS: lines forever and forward
    terminal commands to the device."""
    ser_ref = [None]
    stop = threading.Event()
    stdin_thread = threading.Thread(target=_forward_stdin, args=(ser_ref, stop), daemon=True)
    stdin_thread.start()
    while True:
        try:
            ser = serial.Serial(device, baud, timeout=0.2)
        except serial.SerialException as exc:
            TUI_UI.log(f"[bridge] cannot open {device}: {exc}")
            TUI_UI.log("[bridge] retrying in 2 s... (plug the device in? try --list)")
            time.sleep(2)
            continue
        ser_ref[0] = ser
        TUI_UI.set_status(f"{device} @ {baud} baud (connected)")
        TUI_UI.log(f"[bridge] connected to {device} @ {baud} baud")
        try:
            while True:
                raw = ser.readline()
                if not raw:
                    continue
                line = raw.decode("utf-8", errors="replace").strip()
                if not line:
                    continue
                upper = line.upper()
                if upper.startswith("AEGIS:"):
                    TUI_UI.log(f"[device] {line}")
                    if upper.startswith("AEGIS:POS:"):
                        data = parse_pos_line(line)
                        if "lat" in data and "lng" in data:
                            STATE.set_position(data)
                            url = build_site_url(site, data)
                            TUI_UI.set_position(f"{data['lat']:.6f}, {data['lng']:.6f}")
                            TUI_UI.set_share(url)
                            TUI_UI.log(f"[bridge] share link: {url}")
                            if no_open:
                                TUI_UI.log(f"[bridge] position captured: {data['lat']:.6f}, {data['lng']:.6f}")
                                continue
                            if STATE.page_is_open():
                                TUI_UI.log("[bridge] page is open, streaming update to it")
                            elif should_open_browser(data):
                                TUI_UI.log(f"[bridge] opening page with position: {url}")
                                try:
                                    webbrowser.open(url, new=2)
                                except Exception as exc:  # noqa: BLE001
                                    TUI_UI.log(f"[bridge] could not open browser ({exc}); paste this link manually:\n  {url}")
                            else:
                                TUI_UI.log("[bridge] position unchanged, not opening a new tab")
                        else:
                            TUI_UI.log("[bridge] AEGIS:POS: line without usable coordinates, ignoring")
                    elif upper.startswith("AEGIS:HELLO:"):
                        TUI_UI.log("[device] firmware handshake received")
                    elif verbose:
                        TUI_UI.log(f"[bridge] (ignored) {line}")
                elif verbose:
                    TUI_UI.log(f"[serial]  {line}")
        except serial.SerialException as exc:
            TUI_UI.log(f"[bridge] serial error ({exc}); reconnecting...")
            time.sleep(2)
        finally:
            try:
                ser.close()
            except Exception:  # noqa: BLE001
                pass
            TUI_UI.log(f"[bridge] disconnected from {device}, reconnecting...")


# ---------------------------------------------------------------------------
# Loopback HTTP server (talked to by the /report-position page)
# ---------------------------------------------------------------------------
class BridgeHandler(BaseHTTPRequestHandler):
    def _send_json(self, obj, code=200):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):  # noqa: N802
        try:
            if len(self.path) > 512:
                self._send_json({"error": "request too large"}, 414)
                return
            parts = urlsplit(self.path)
            query = parse_qs(parts.query)
            if parts.path in ("/stream", "/ping", "/state"):
                from_page = query.get("from", [""])[0] == "page"
                if from_page or parts.path in ("/ping", "/state"):
                    STATE.note_page_ping()
                    TUI_UI.set_page("open, live streaming")
                with STATE.lock:
                    data = dict(STATE.latest) if STATE.latest else {}
                    ts = STATE.ts
                data["ts"] = ts
                data["page_open"] = STATE.page_is_open()
                self._send_json(data)
            else:
                self._send_json({"error": "not found"}, 404)
        except Exception as exc:  # noqa: BLE001
            try:
                self._send_json({"error": str(exc)}, 500)
            except Exception:  # noqa: BLE001
                pass

    def do_POST(self):  # noqa: N802
        self._send_json({"error": "GET only"}, 405)

    def log_message(self, fmt, *args):  # quiet by default
        pass


def run_http_server(port):
    server = ThreadingHTTPServer(("127.0.0.1", port), BridgeHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    TUI_UI.log(f"[bridge] loopback server on http://127.0.0.1:{port}/ (stream|ping|state)")
    return server


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Aegis-Beacon serial bridge: forward device positions to the official site.",
    )
    parser.add_argument("--port", help="serial port (auto-detected if omitted)")
    parser.add_argument("--no-tui", action="store_false", dest="tui",
                        help="disable the live terminal dashboard (plain log lines)")
    parser.add_argument("--baud", type=int, default=DEFAULT_BAUD, help=f"baud rate (default {DEFAULT_BAUD})")
    parser.add_argument("--http-port", type=int, default=DEFAULT_HTTP_PORT,
                        help=f"loopback HTTP port for the page (default {DEFAULT_HTTP_PORT})")
    parser.add_argument("--site", default=DEFAULT_SITE, help=f"site base URL (default {DEFAULT_SITE})")
    parser.add_argument("--no-open", action="store_true", help="never open a browser tab")
    parser.add_argument("--tui", action="store_true", default=None,
                        help="render the live terminal dashboard (auto-enabled on a TTY)")
    parser.add_argument("--list", action="store_true", help="list serial ports and exit")
    parser.add_argument("--verbose", action="store_true", help="print all serial traffic")
    args = parser.parse_args(argv)

    # --tui forces the dashboard on (even when piped); --no-tui disables it.
    if args.tui is False:
        TUI_UI.enabled = False
    elif args.tui is True:
        TUI_UI.enabled = True
    elif not sys.stdout.isatty():
        TUI_UI.enabled = False

    if args.list:
        ports = serial.tools.list_ports.comports()
        if not ports:
            print("No serial ports found.")
            return 0
        for p in ports:
            print(f"{p.device:20s} {p.description or ''}  vid={p.vid and hex(p.vid)} pid={p.pid and hex(p.pid)}")
        return 0

    device = detect_port(args.port)
    if not device:
        print("No supported serial device found. Plug the beacon in over USB,")
        print("install its driver (CP210x / CH340), then run with --list to inspect ports,")
        print("or pass the port explicitly with --port (e.g. COM3, /dev/ttyUSB0).")
        return 1

    if not TUI_UI.enabled:
        print(f"[bridge] Aegis-Beacon serial bridge")
        print(f"[bridge] site target: {args.site}")
        print(f"[bridge] opening browser for new positions: {'no' if args.no_open else 'yes'}")
    else:
        TUI_UI.log(f"site target: {args.site}")
        TUI_UI.log(f"opening browser for new positions: {'no' if args.no_open else 'yes'}")
    run_http_server(args.http_port)

    try:
        handle_serial(device, args.baud, args.site, args.no_open, args.verbose)
    except KeyboardInterrupt:
        if TUI_UI.enabled:
            TUI_UI.log("[bridge] stopped.")
        else:
            print("\n[bridge] stopped.")
    return 0


if __name__ == "__main__":
    sys.exit(main())