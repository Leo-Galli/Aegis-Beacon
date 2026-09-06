---
title: Bridge Troubleshooting
description: "Diagnose the serial bridge: no port, no positions, no page updates, port busy, and browser quirks."
---

# Bridge Troubleshooting

The [serial bridge](serial-bridge-guide) is a thin script; when something fails it is almost always the USB link, the page, or a browser policy. This page is the checklist.

## The bridge cannot find a port

```
No supported serial device found.
```

- Cable: try a known data cable (see [USB Cable Types](usb-cable-types)).
- Driver: install CP210x or CH340 (see [Driver Install](cp210x-driver-install)).
- Inspect ports: `python bridge/aegis-serial-bridge.py --list`.
- Pass the port explicitly: `--port COM3`, `--port /dev/ttyUSB0`, `--port /dev/cu.usbserial-0001`.

## Port in use

Only one program can hold the port. Close Arduino IDE, PlatformIO monitor, or an older bridge instance, then retry.

## The bridge runs but prints no `AEGIS:POS:` lines

- The beacon has no GPS fix. Fixes need sky view; indoor fixes are slow or never come (see [GPS Fix Capture Tips](gps-fix-capture-tips)).
- Send `POS` from the terminal: the bridge forwards commands to the device, so typing `POS` returns a line immediately if a fix is cached.
- GPS disabled in config? Check the dashboard: GPS must be enabled and included in the beacon.

## The page opens but is empty

The bridge opens the page with coordinates in the URL. If the fields are empty:

- The beacon had no fix yet (`POS` printed `lat=0.000000`).
- A browser extension stripped the query string. Open the printed link directly.

## The page does not update live

- **Safari** blocks HTTPS pages from talking to `http://127.0.0.1`. Use Chrome, Edge or Firefox for live updates; Safari still gets the filled-in link.
- The page was opened before the bridge started; reload it once.
- Another program holds the bridge's HTTP port (default 8765). Change it with `--http-port` on both sides (the page polls the default; use the default unless you must change it, and then only with the `--site` local workflow).

## Positions arrive but the map link is missing

The map links appear only when both latitude and longitude are present and numeric. Check the `AEGIS:POS:` line printed by the bridge.

## The bridge crashes on Windows

- Use `py` instead of `python` if `python` is not on PATH.
- Run from the repo root so `bridge/` resolves; or `cd` into `bridge/` and reference the script by name.

## Related

- [Serial Bridge Guide](serial-bridge-guide)
- [Serial Adapter Troubleshooting](serial-adapter-troubleshooting)
- [Report Position Page](report-position-page)