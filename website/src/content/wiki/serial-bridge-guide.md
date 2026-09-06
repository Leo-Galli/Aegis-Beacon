---
title: Serial Bridge Guide
description: "Connect the beacon to a computer or phone over USB and push its GPS position to the official site automatically, on every operating system."
---

# Serial Bridge Guide

The beacon prints its GPS position on the USB serial port. The **serial bridge**
is one Python script that reads those lines and delivers the coordinates to the
official website, either by filling the open Report Position page live or by
opening it with the position already in the form.

Use cases:

- you are out with a group and want to log every beacon position as it is received;
- you found a signal and want to record where you heard it, hands-free;
- you want to practice the full loop: device transmits, you home in, the site logs the position.

## How the loop works

1. The beacon is plugged into a computer (or an Android phone over OTG) with a
   plain USB data cable.
2. The bridge script auto-detects the serial port and listens for `AEGIS:` lines.
3. Each valid GPS fix becomes a link:
   `https://aegis-beacon.vercel.app/report-position?lat=45.123456&lng=11.123456&freq=433.500`
4. If the Report Position page is already open in a browser, the page polls the
   bridge's loopback server (`127.0.0.1:8765`), the bridge sees the page and
   streams every new fix into it. No new tabs.
5. If the page is not open, the bridge opens it, already filled in.

No API keys, no accounts, no cloud. The bridge listens only on the loopback
interface.

## Install

Requires Python 3.8 or newer and `pyserial`:

```bash
pip install pyserial
```

On Windows, `py -m pip install pyserial` if `pip` is not on the PATH.

## Run

From the project root:

```bash
python bridge/aegis-serial-bridge.py
```

The first run prints which port it picked. If nothing was found:

```bash
python bridge/aegis-serial-bridge.py --list     # show every serial port
python bridge/aegis-serial-bridge.py --port COM3
python bridge/aegis-serial-bridge.py --port /dev/ttyUSB0
python bridge/aegis-serial-bridge.py --port /dev/cu.usbserial-0001
```

Useful flags:

| Flag | Meaning |
| --- | --- |
| `--port X` | Serial port (auto-detected if omitted) |
| `--baud N` | Baud rate, default 115200 |
| `--http-port N` | Loopback port, default 8765 |
| `--site URL` | Site base URL, default the official one |
| `--no-open` | Print links instead of opening the browser |
| `--verbose` | Print all serial traffic, not only `AEGIS:` lines |
| `--tui` | Force the live terminal dashboard on (auto-enabled on a TTY) |
| `--no-tui` | Plain log lines, no dashboard |

## Live terminal dashboard (TUI)

When you run the bridge in a terminal, it renders a live dashboard instead of
plain logs:

```text
  AEGIS-BEACON SERIAL BRIDGE   14:32:08   uptime 412s
  ----------------------------------------------------------
  Device     COM3 @ 115200 baud (connected)
  Position   45.531240, 12.304560
  Page       open, live streaming
  ----------------------------------------------------------
  Live log:
  [device] AEGIS:POS:lat=45.531240;lng=12.304560;sats=6;fix=1;age=0
  [bridge] page is open, streaming update to it
```

The dashboard shows the connected device and baud rate, the latest received
position, whether the Report Position page is open and streaming, and a
scrolling live log. It is auto-enabled whenever stdout is a terminal; use
`--tui` to force it on (for example inside a wrapper) or `--no-tui` for plain
line output suitable for piping or logging. See the [Bridge TUI](bridge-tui)
page for the full tour.

## Setting the frequency and listening

The bridge forwards commands you type in its terminal to the device:

```
FREQ 433.500     set the desired frequency, persisted
FREQ?            show configured frequencies
WPM 14           set Morse speed, persisted
MODE BEACON      BEACON | SEARCH | CONFIG | EMERGENCY
POS              print the fix now
STATUS           print device state
HELP             list everything
```

Type `exit` or `quit` to stop the bridge cleanly. To home in on a beacon, put
the receiving device in SEARCH mode (`MODE SEARCH`); the bridge keeps
reporting positions in the background while you follow the signal. See
[Serial Command Protocol](serial-command-protocol) for the full reference.

## Phones

- **Android**: OTG adapter plus a USB-A/USB-C cable. In Termux:
  `pkg install python` then `pip install pyserial`, and run with
  `--port /dev/ttyACM0` or `--port /dev/ttyUSB0`.
- **iPhone / iPad**: iOS cannot run Python, but no script is needed there:
  run the bridge on any computer and open the link it produces on the phone.
  The page fills itself in from the link.

## Browser notes

Chrome, Edge and Firefox let the HTTPS page poll the loopback bridge, so live
streaming works. Safari blocks loopback HTTP from HTTPS pages; the link path
still works there, only the live polling does not. See the
[Report Position](/report-position) page for a hardware-free test: paste an
`AEGIS:POS:` line and watch the form fill in.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `cannot open ... retrying` | Device not plugged in, wrong cable (charge-only cables have no data pins), or driver missing. Install the CP210x or CH340 driver for your chip. |
| No serial ports listed | Check the cable and try another USB port; on macOS grant the terminal permission under System Settings, Privacy and Security. |
| Bridge runs but no positions | The beacon has no GPS fix yet (no `AEGIS:POS:` lines). Send `POS` or wait for a fix; indoor fixes are slow. |
| Page does not update live | Safari, or the page was opened before the bridge started. Reload the page once, or let the bridge open a fresh one. |
| Port already in use | Another monitor has the port open (Arduino IDE, PlatformIO). Close it, or point the bridge at another port with `--http-port`. |