---
title: What's New in v5.5
description: "Everything that changed in Aegis-Beacon v5.5: serial protocol, commands, bridge, Report Position page and the offline-first dashboard."
---

# What's New in v5.5

v5.5 is the connectivity release. The hardware is unchanged from v5.4; the firmware, tooling and website gained a full serial story. If you are upgrading, start with [Upgrading to v5.5](firmware-v55-upgrade-guide).

## Serial protocol

The firmware now speaks a machine-readable protocol on USB serial, printed plain (never ANSI-colored) so any tool can parse it:

```
AEGIS:HELLO:ver=5.5;mode=BEACON;freq=433.500;wpm=12;vol=64
AEGIS:POS:lat=45.123456;lng=11.123456;alt=412;sats=8;freq=433.500;mode=BEACON;payload=SOS PSN N4553 E01130
AEGIS:STATE:mode=SEARCH;freq=433.500;wpm=12;vol=64;heap=184320;boot=1;tx=0;hits=0;gpsFix=1;sats=8
```

See [Serial Command Protocol](serial-command-protocol).

## Serial commands

Type commands in any serial monitor and the device obeys, persisting changes to NVS:

| Command | Effect |
| --- | --- |
| `FREQ 433.500` | Set the desired frequency (410-525 MHz) |
| `WPM 14` | Set Morse speed |
| `MODE BEACON` | Switch mode and reboot |
| `POS` | Print the fix now |
| `STATUS` | Print the state line |

See [Frequency Setting over Serial](frequency-setting-over-serial) and [Serial Command Protocol](serial-command-protocol).

## Cross-platform bridge with a live TUI

`bridge/aegis-serial-bridge.py` is one Python file for Windows, macOS and Linux. It auto-detects the port, reads `AEGIS:` lines, and forwards positions to the website. When run in a terminal it renders a live dashboard (device status, latest position, page state, scrolling log) and forwards commands you type straight to the device over serial. See [Serial Bridge Guide](serial-bridge-guide) and [Bridge TUI](bridge-tui).

## Report Position page

The website's `/report-position` page fills itself in from the link the bridge opens, or streams updates live into an open page. It embeds a keyless Leaflet map that draws a track of every fix as you move. No accounts, no API keys. See [Report Position Page](report-position-page).

## Offline-first dashboard

The WiFi captive-portal dashboard no longer loads web fonts. It uses fonts installed on the device by default, because configuration happens without connectivity. See [Why the Dashboard Uses System Fonts](config-dashboard-offline-fonts).

## Documentation and site

- `DATASHEET.md` became the single merged reference: electrical specs, GPIO map, technology stack, the global SAR frequency database, the full serial protocol and deep dives into deep sleep, GPS and both operating cycles.
- Every page ships complete SEO (canonical, Open Graph, Twitter cards, JSON-LD) for clean previews in WhatsApp, Discord and search engines.
- New legal pages: Terms of Service, Privacy Policy and a dedicated [Disclaimer](/disclaimer).
- A new Building Effectively wiki section (six pages) covers staging, quality gates, bench fixtures, rework, time planning and build logging.
- The wiki gained the USB and connectivity documentation (30+ new pages).
- See the [Changelog](changelog) for the full history.