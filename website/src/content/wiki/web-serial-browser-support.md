---
title: "Web Serial: Browser-Only Option"
description: "Use the Web Serial API so a Chrome desktop browser talks to the beacon directly, without the Python bridge."
---

# Web Serial: Browser-Only Option

The [serial bridge](serial-bridge-guide) is a Python script. Some users would rather not install Python at all. Modern Chrome and Edge desktops support the **Web Serial API**, which lets a website read a serial port directly, with no helper program. The site does not yet ship a Web Serial reader, but this page explains the option and how it could be used.

## How Web Serial works

1. The page calls `navigator.serial.requestPort()`.
2. The browser shows a chooser with the available serial devices; the user picks the beacon.
3. The page opens the port at 115200 baud and reads lines.
4. It parses the same `AEGIS:POS:` lines the bridge parses, and fills the form.

No installation, no drivers beyond the OS-level USB-serial driver, no loopback server.

## Limitations

| Browser | Web Serial |
| --- | --- |
| Chrome / Edge (desktop) | Yes |
| Firefox | No |
| Safari (macOS/iOS) | No |
| Android Chrome | No |

Web Serial is a secure-context feature: it only works on HTTPS pages (the official site qualifies; local dev needs `http://localhost`, which counts as secure).

## The chooser problem

The beacon's USB-serial chip exposes a generic serial device, so the chooser lists several ports when multiple devices are attached. Name your devices by plugging in one at a time, or choose by port description (`Silicon Labs CP210x`).

## If you want this today

A minimal reader is a few dozen lines of JavaScript using `serial.readable` and `TextDecoder`. The wiki page [Extending the Serial Protocol](extending-serial-protocol) documents the line format, so any Web Serial client can parse positions with the same code the Python bridge uses.

## Related

- [Serial Bridge Guide](serial-bridge-guide)
- [Serial Command Protocol](serial-command-protocol)
- [Report Position Page](report-position-page)