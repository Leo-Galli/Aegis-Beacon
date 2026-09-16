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

With no arguments the bridge starts the TUI, loads ~/.aegis-bridge.json if present,
auto-detects USB when possible, and lets you configure everything from the host
prompt with :menu, :ports, :port, :baud, :site, :http, :open, :verbose, :save.
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
CONFIG_PATH = os.path.join(os.path.expanduser("~"), ".aegis-bridge.json")
PAGE_OPEN_WINDOW_S = 10.0  # a page heartbeat newer than this counts as "open"
POS_PATH = "/report-position"

RECONNECT = threading.Event()


class BridgeSettings:
    """Runtime + persisted bridge options (CLI overrides file on startup)."""

    def __init__(self):
        self.port = None
        self.auto_port = True
        self.baud = DEFAULT_BAUD
        self.http_port = DEFAULT_HTTP_PORT
        self.site = DEFAULT_SITE
        self.no_open = False
        self.verbose = False

    def resolve_port(self):
        if self.port:
            return self.port
        if self.auto_port:
            return detect_port(None)
        return None

    def to_dict(self):
        return {
            "port": self.port,
            "auto_port": self.auto_port,
            "baud": self.baud,
            "http_port": self.http_port,
            "site": self.site,
            "no_open": self.no_open,
            "verbose": self.verbose,
        }

    @classmethod
    def from_dict(cls, data):
        s = cls()
        if not isinstance(data, dict):
            return s
        port = data.get("port")
        if port:
            s.port = str(port)
            s.auto_port = False
        if "auto_port" in data:
            s.auto_port = bool(data["auto_port"])
        s.baud = int(data.get("baud", DEFAULT_BAUD))
        s.http_port = int(data.get("http_port", DEFAULT_HTTP_PORT))
        site = data.get("site")
        if site:
            s.site = str(site)
        s.no_open = bool(data.get("no_open", False))
        s.verbose = bool(data.get("verbose", False))
        return s

    def apply_cli(self, args):
        if args.port:
            self.port = args.port
            self.auto_port = False
        if args.baud != DEFAULT_BAUD:
            self.baud = args.baud
        if args.http_port != DEFAULT_HTTP_PORT:
            self.http_port = args.http_port
        if args.site != DEFAULT_SITE:
            self.site = args.site
        if args.no_open:
            self.no_open = True
        if args.verbose:
            self.verbose = True


def load_settings_file():
    try:
        with open(CONFIG_PATH, encoding="utf-8") as fh:
            return BridgeSettings.from_dict(json.load(fh))
    except FileNotFoundError:
        return BridgeSettings()
    except (OSError, json.JSONDecodeError, TypeError, ValueError):
        return BridgeSettings()


def save_settings_file(settings):
    try:
        with open(CONFIG_PATH, "w", encoding="utf-8") as fh:
            json.dump(settings.to_dict(), fh, indent=2)
            fh.write("\n")
        return True
    except OSError:
        return False

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

# ANSI styling (Windows Terminal, macOS, Linux)
_ANSI = {
    "reset": "\x1b[0m",
    "dim": "\x1b[2m",
    "bold": "\x1b[1m",
    "brand": "\x1b[38;5;255m",
    "accent": "\x1b[38;5;214m",
    "info": "\x1b[38;5;117m",
    "ok": "\x1b[38;5;114m",
    "warn": "\x1b[38;5;180m",
    "device": "\x1b[38;5;117m",
    "muted": "\x1b[38;5;245m",
    "cw": "\x1b[38;5;214m",
}


def _parse_kv_body(body):
    """Parse semicolon key=value pairs from an AEGIS line body."""
    out = {}
    for pair in body.split(";"):
        pair = pair.strip()
        if "=" not in pair:
            continue
        key, _, value = pair.partition("=")
        key, value = key.strip().lower(), value.strip()
        if key and value:
            out[key] = value
    return out


def _parse_aegis_body(line):
    upper = line.strip().upper()
    if not upper.startswith("AEGIS:"):
        return None, {}
    rest = line.strip()[6:]
    if ":" not in rest:
        return rest.upper(), {}
    tag, _, body = rest.partition(":")
    return tag.strip().upper(), _parse_kv_body(body)


class TUI:
    def __init__(self):
        self.lock = threading.Lock()
        self.enabled = sys.stdout.isatty()
        self.lines = []          # rolling log lines (newest last)
        self.last_status = "waiting for USB device..."
        self.last_pos = "no position received yet"
        self.last_page = "not detected"
        self.last_url = ""      # public site link for the latest fix (shareable)
        self.last_mode = "UNKNOWN"
        self.last_cw = ""
        self.hint = "Type :menu for bridge settings · MODE LISTEN to the device"
        self.track = []          # recent fixes: (time, lat, lng, url), newest last
        self.started = time.time()
        self.settings = None

    def _clear(self):
        # Move to home, clear the screen and the scrollback buffer.
        sys.stdout.write("\x1b[2J\x1b[H\x1b[3J")

    def _bar(self, label, value, width=34):
        return f"{label:<10} {value}".ljust(width)

    def _paint_log(self, line):
        a = _ANSI
        if line.startswith("[bridge]"):
            return a["warn"] + line + a["reset"]
        if line.startswith("[device]"):
            return a["device"] + line + a["reset"]
        if line.startswith("AEGIS:CW:"):
            return a["cw"] + a["bold"] + line + a["reset"]
        if line.startswith("AEGIS:MODE:") or line.startswith("AEGIS:OK:"):
            return a["ok"] + line + a["reset"]
        if line.startswith("AEGIS:"):
            return a["ok"] + line + a["reset"]
        if line.startswith("[serial]"):
            return a["muted"] + line + a["reset"]
        return line

    def _mode_badge(self):
        a = _ANSI
        mode = self.last_mode or "UNKNOWN"
        color = a["accent"]
        if mode == "LISTEN":
            color = a["info"]
        elif mode == "EMERGENCY":
            color = a["warn"]
        return f"{a['dim']}Mode{a['reset']}  {color}{a['bold']}[{mode}]{a['reset']}"

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

    def set_mode(self, mode):
        with self.lock:
            self.last_mode = (mode or "UNKNOWN").upper()
            if self.last_mode == "LISTEN":
                self.hint = "LISTEN · AEGIS:CW stream · device OLED + speaker"
            elif self.last_mode == "SEARCH":
                self.hint = "SEARCH · RSSI scan on configured frequency"
            elif self.last_mode == "CONFIG":
                self.hint = "CONFIG · WiFi portal 192.168.4.1 on the beacon"
            elif self.last_mode == "EMERGENCY":
                self.hint = "EMERGENCY · SOS Morse TX"
            else:
                self.hint = "BEACON · Morse TX · POS lines to report-position"
            self.draw()

    def set_cw(self, ch):
        with self.lock:
            self.last_cw = ch
            self.draw()

    def note_aegis_line(self, line):
        """Update dashboard fields from a machine-readable AEGIS line."""
        tag, kv = _parse_aegis_body(line)
        if not tag:
            return
        if tag == "HELLO" and "mode" in kv:
            self.set_mode(kv["mode"])
        elif tag == "STATE" and "mode" in kv:
            self.set_mode(kv["mode"])
        elif tag == "MODE":
            body = line.strip().split(":", 2)[-1].strip()
            self.set_mode(body)
        elif tag == "OK" and "mode" in kv:
            self.set_mode(kv["mode"])
        elif tag == "CW":
            body = line.strip().split(":", 2)[-1].strip()
            if body:
                self.set_cw(body)

    def draw(self):
        if not self.enabled:
            return
        with self.lock:
            width = min(shutil.get_terminal_size((80, 24)).columns, 96)
            now = datetime.datetime.now().strftime("%H:%M:%S")
            uptime = int(time.time() - self.started)
            a = _ANSI
            lines = []
            conn = f"{a['ok']}●{a['reset']}" if "connected" in self.last_status.lower() else f"{a['muted']}○{a['reset']}"
            lines.append("")
            head = (
                f"  {conn} {a['brand']}{a['bold']}AEGIS-BEACON{a['reset']} "
                f"{a['accent']}SERIAL BRIDGE{a['reset']}   {a['muted']}{now}   uptime {uptime}s{a['reset']}"
            )
            lines.append(head.ljust(width + len(a["reset"]) * 3))
            lines.append("  " + a["muted"] + ("─" * (width - 2)) + a["reset"])
            lines.append("  " + self._mode_badge())
            lines.append(f"  {a['dim']}{self.hint}{a['reset']}")
            lines.append("  " + a["muted"] + ("─" * (width - 2)) + a["reset"])
            lines.append("  " + self._bar("Device", self.last_status))
            lines.append("  " + self._bar("Position", self.last_pos))
            share = self.last_url or "(public link appears on first fix)"
            if len(share) > width - 14:
                share = "…" + share[-(width - 18):]
            lines.append("  " + self._bar("Share", share))
            lines.append("  " + self._bar("Page", self.last_page))
            if self.settings is not None:
                s = self.settings
                port_lbl = s.port if s.port else ("auto" if s.auto_port else "(unset)")
                cfg = (
                    f"port={port_lbl}  baud={s.baud}  http={s.http_port}  "
                    f"browser={'off' if s.no_open else 'on'}  verbose={'on' if s.verbose else 'off'}"
                )
                if len(cfg) > width - 6:
                    cfg = cfg[: width - 9] + "..."
                lines.append(f"  {a['dim']}Config{a['reset']}  {a['muted']}{cfg}{a['reset']}")
            if self.last_mode == "LISTEN" and self.last_cw:
                cw_line = f"AEGIS:CW:{self.last_cw}"
                lines.append("  " + self._bar("RX decode", cw_line))
            if self.track:
                lines.append("  " + a["muted"] + ("─" * (width - 2)) + a["reset"])
                lines.append(f"  {a['dim']}Local track (newest last):{a['reset']}")
                for ts, pos, _url in self.track:
                    lines.append(f"    {a['muted']}{ts}{a['reset']}  {pos}")
            lines.append("  " + a["muted"] + ("─" * (width - 2)) + a["reset"])
            lines.append(f"  {a['dim']}Live log:{a['reset']}")
            body = self.lines[- (width // 2) - 8:]
            for line in body:
                painted = self._paint_log(line)
                plain_len = len(line)
                pad = max(0, width - 2 - plain_len)
                lines.append("  " + painted + " " * pad)
            lines.append("  " + a["muted"] + ("─" * (width - 2)) + a["reset"])
            lines.append(
                f"  {a['dim']}Host:{a['reset']} :menu :ports :port :save · device: MODE LISTEN FREQ WPM · quit"
            )
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


def _print_port_list():
    ports = sorted(serial.tools.list_ports.comports(), key=score_port, reverse=True)
    if not ports:
        TUI_UI.log("[bridge] no serial ports found (plug USB and try again)")
        return
    TUI_UI.log("[bridge] serial ports (best first):")
    for idx, p in enumerate(ports, start=1):
        desc = (p.description or "").strip()
        TUI_UI.log(f"[bridge]   {idx}. {p.device}  {desc}  score={score_port(p)}")


def _host_config_menu(settings):
    TUI_UI.log("[bridge] --- bridge config (host commands) ---")
    TUI_UI.log("[bridge] :ports              list USB serial ports")
    TUI_UI.log("[bridge] :port NAME          set port (e.g. COM3, /dev/ttyUSB0)")
    TUI_UI.log("[bridge] :port auto          auto-detect best port")
    TUI_UI.log("[bridge] :baud N             baud rate (default 115200)")
    TUI_UI.log("[bridge] :http N             loopback HTTP port for the web page")
    TUI_UI.log("[bridge] :site URL           report-position site base URL")
    TUI_UI.log("[bridge] :open on|off        open browser on new fixes")
    TUI_UI.log("[bridge] :verbose on|off     log all serial traffic")
    TUI_UI.log("[bridge] :save               write ~/.aegis-bridge.json")
    TUI_UI.log("[bridge] :connect            reconnect serial with current settings")
    TUI_UI.log("[bridge] :menu               show this menu again")
    TUI_UI.log(f"[bridge] config file: {CONFIG_PATH}")


def _handle_host_line(line, settings, ser_ref, stop, http_holder):
    """Parse :commands for bridge config; return True if handled (not forwarded)."""
    low = line.lower()
    if low in ("quit", "exit"):
        TUI_UI.log("[bridge] bye")
        stop.set()
        return True
    if not line.startswith(":"):
        return False
    parts = line.split(maxsplit=2)
    cmd = parts[0].lower()
    arg = parts[1].lower() if len(parts) > 1 else ""
    rest = line.split(maxsplit=2)[-1] if len(parts) > 2 else (parts[1] if len(parts) > 1 else "")

    if cmd in (":menu", ":help", ":config"):
        _host_config_menu(settings)
        return True
    if cmd == ":ports":
        _print_port_list()
        return True
    if cmd == ":port":
        tail = line.split(None, 1)[1].strip() if len(line.split(None, 1)) > 1 else ""
        if not tail or tail.lower() == "auto":
            settings.port = None
            settings.auto_port = True
            TUI_UI.log("[bridge] port set to auto-detect")
        else:
            settings.port = tail
            settings.auto_port = False
            TUI_UI.log(f"[bridge] port set to {settings.port}")
        RECONNECT.set()
        TUI_UI.draw()
        return True
    if cmd == ":baud":
        try:
            settings.baud = int(arg)
            TUI_UI.log(f"[bridge] baud set to {settings.baud}")
            RECONNECT.set()
            TUI_UI.draw()
        except ValueError:
            TUI_UI.log("[bridge] usage: :baud 115200")
        return True
    if cmd == ":http":
        try:
            new_port = int(arg)
            if new_port < 1 or new_port > 65535:
                raise ValueError
            settings.http_port = new_port
            restart_http_server(settings, http_holder)
            TUI_UI.log(f"[bridge] loopback HTTP port set to {new_port}")
            TUI_UI.draw()
        except ValueError:
            TUI_UI.log("[bridge] usage: :http 8765")
        return True
    if cmd == ":site":
        url = line.split(None, 1)[1].strip() if len(line.split(None, 1)) > 1 else ""
        if not url:
            TUI_UI.log("[bridge] usage: :site https://aegis-beacon.vercel.app")
            return True
        settings.site = url.rstrip("/")
        TUI_UI.log(f"[bridge] site set to {settings.site}")
        TUI_UI.draw()
        return True
    if cmd == ":open":
        if arg in ("on", "yes", "1", "true"):
            settings.no_open = False
            TUI_UI.log("[bridge] browser open: on")
        elif arg in ("off", "no", "0", "false"):
            settings.no_open = True
            TUI_UI.log("[bridge] browser open: off")
        else:
            TUI_UI.log("[bridge] usage: :open on|off")
        TUI_UI.draw()
        return True
    if cmd == ":verbose":
        if arg in ("on", "yes", "1", "true"):
            settings.verbose = True
            TUI_UI.log("[bridge] verbose serial: on")
        elif arg in ("off", "no", "0", "false"):
            settings.verbose = False
            TUI_UI.log("[bridge] verbose serial: off")
        else:
            TUI_UI.log("[bridge] usage: :verbose on|off")
        TUI_UI.draw()
        return True
    if cmd == ":save":
        if save_settings_file(settings):
            TUI_UI.log(f"[bridge] settings saved to {CONFIG_PATH}")
        else:
            TUI_UI.log("[bridge] could not save settings file")
        return True
    if cmd == ":connect":
        RECONNECT.set()
        TUI_UI.log("[bridge] reconnecting serial...")
        return True
    TUI_UI.log(f"[bridge] unknown host command {cmd} (type :menu)")
    return True


def _forward_stdin(ser_ref, stop, settings, http_holder):
    """Read host lines: :config commands or forward to the device."""
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
            if _handle_host_line(line, settings, ser_ref, stop, http_holder):
                continue
            ser = ser_ref[0]
            if ser is not None and ser.is_open:
                try:
                    ser.write((line + "\r\n").encode("utf-8"))
                    TUI_UI.log(f"[bridge] -> device: {line}")
                except serial.SerialException as exc:
                    TUI_UI.log(f"[bridge] cannot send command ({exc})")
            else:
                TUI_UI.log("[bridge] device not connected (use :ports · :port · :connect)")
    except Exception:  # noqa: BLE001
        pass


def handle_serial(settings, http_holder):
    """Open the port (with reconnect), process AEGIS: lines forever."""
    ser_ref = [None]
    stop = threading.Event()
    stdin_thread = threading.Thread(
        target=_forward_stdin,
        args=(ser_ref, stop, settings, http_holder),
        daemon=True,
    )
    stdin_thread.start()
    while not stop.is_set():
        device = settings.resolve_port()
        if not device:
            TUI_UI.set_status("waiting for USB · :ports · :port NAME · :menu")
            if RECONNECT.wait(timeout=2):
                RECONNECT.clear()
            continue
        baud = settings.baud
        try:
            ser = serial.Serial(device, baud, timeout=0.2)
        except serial.SerialException as exc:
            TUI_UI.log(f"[bridge] cannot open {device}: {exc}")
            TUI_UI.log("[bridge] retry in 2 s · fix with :port or :ports")
            if RECONNECT.wait(timeout=2):
                RECONNECT.clear()
            continue
        ser_ref[0] = ser
        TUI_UI.set_status(f"{device} @ {baud} baud (connected)")
        TUI_UI.log(f"[bridge] connected to {device} @ {baud} baud")
        try:
            while not stop.is_set():
                if RECONNECT.is_set():
                    RECONNECT.clear()
                    break
                raw = ser.readline()
                if not raw:
                    continue
                line = raw.decode("utf-8", errors="replace").strip()
                if not line:
                    continue
                upper = line.upper()
                if upper.startswith("AEGIS:"):
                    TUI_UI.note_aegis_line(line)
                    TUI_UI.log(f"[device] {line}")
                    if upper.startswith("AEGIS:POS:"):
                        data = parse_pos_line(line)
                        if "lat" in data and "lng" in data:
                            STATE.set_position(data)
                            url = build_site_url(settings.site, data)
                            TUI_UI.set_position(f"{data['lat']:.6f}, {data['lng']:.6f}")
                            TUI_UI.set_share(url)
                            TUI_UI.log(f"[bridge] share link: {url}")
                            if settings.no_open:
                                TUI_UI.log(
                                    f"[bridge] position captured: {data['lat']:.6f}, {data['lng']:.6f}"
                                )
                                continue
                            if STATE.page_is_open():
                                TUI_UI.log("[bridge] page is open, streaming update to it")
                            elif should_open_browser(data):
                                TUI_UI.log(f"[bridge] opening page with position: {url}")
                                try:
                                    webbrowser.open(url, new=2)
                                except Exception as exc:  # noqa: BLE001
                                    TUI_UI.log(
                                        f"[bridge] could not open browser ({exc}); paste manually:\n  {url}"
                                    )
                            else:
                                TUI_UI.log("[bridge] position unchanged, not opening a new tab")
                        else:
                            TUI_UI.log("[bridge] AEGIS:POS: without usable coordinates, ignoring")
                    elif upper.startswith("AEGIS:HELLO:"):
                        TUI_UI.log("[device] firmware handshake received")
                    elif upper.startswith("AEGIS:CW:"):
                        pass
                    elif upper.startswith("AEGIS:MODE:") or upper.startswith("AEGIS:OK:"):
                        TUI_UI.log("[bridge] device mode synced with dashboard")
                    elif settings.verbose:
                        TUI_UI.log(f"[bridge] (ignored) {line}")
                elif settings.verbose:
                    TUI_UI.log(f"[serial]  {line}")
        except serial.SerialException as exc:
            TUI_UI.log(f"[bridge] serial error ({exc}); reconnecting...")
            time.sleep(1)
        finally:
            try:
                ser.close()
            except Exception:  # noqa: BLE001
                pass
            ser_ref[0] = None
            if not stop.is_set():
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
    TUI_UI.log(f"[bridge] loopback server on 127.0.0.1:{port} (stream|ping|state)")
    return server


def restart_http_server(settings, http_holder):
    """Stop the previous loopback server (if any) and bind the new port."""
    old = http_holder[0]
    if old is not None:
        try:
            old.shutdown()
        except Exception:  # noqa: BLE001
            pass
    http_holder[0] = run_http_server(settings.http_port)


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

    settings = load_settings_file()
    settings.apply_cli(args)
    TUI_UI.settings = settings
    http_holder = [None]

    if not TUI_UI.enabled:
        print("[bridge] Aegis-Beacon serial bridge")
        print(f"[bridge] site target: {settings.site}")
        print(f"[bridge] opening browser: {'no' if settings.no_open else 'yes'}")
        print(f"[bridge] config file: {CONFIG_PATH}")
    else:
        TUI_UI.log(f"site target: {settings.site}")
        TUI_UI.log(f"opening browser: {'no' if settings.no_open else 'yes'}")
        if os.path.isfile(CONFIG_PATH):
            TUI_UI.log(f"loaded settings from {CONFIG_PATH}")
        TUI_UI.log("type :menu to configure port, baud, HTTP and site from the TUI")
        if not settings.resolve_port():
            TUI_UI.log("no USB device yet · plug in the beacon · :ports · :port COM3")
            _host_config_menu(settings)

    http_holder[0] = run_http_server(settings.http_port)

    try:
        handle_serial(settings, http_holder)
    except KeyboardInterrupt:
        if TUI_UI.enabled:
            TUI_UI.log("[bridge] stopped.")
        else:
            print("\n[bridge] stopped.")
    return 0


if __name__ == "__main__":
    sys.exit(main())