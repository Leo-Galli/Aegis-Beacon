---
title: Bridge TUI
description: "The live terminal dashboard of the serial bridge: what every field means, how to drive the device from it, and how to switch back to plain logs."
---

# Bridge TUI

The serial bridge ships with a small live terminal dashboard. When you run it
in a terminal, instead of scrolling log lines it paints a status screen that
updates in place, so you always see the important state at a glance.

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

## The fields

| Field | Meaning |
| --- | --- |
| Clock and uptime | Current local time and how long the bridge has been running |
| Device | Serial port and baud rate, plus connection state (connected / reconnecting) |
| Position | The most recent GPS fix received from the beacon (lat, lng) |
| Page | Whether the Report Position page is open and live-streaming into the bridge |
| Live log | A rolling window of the newest device and bridge messages |

The log is the same stream you would see in plain mode, capped to fit the
screen. Old lines scroll off; the newest ones stay visible.

## How it decides to show

The dashboard auto-enables when the bridge detects that stdout is a real
terminal, and falls back to plain line logs otherwise (pipes, files, CI).
You can override either way:

```bash
python bridge/aegis-serial-bridge.py --tui      # force the dashboard on
python bridge/aegis-serial-bridge.py --no-tui   # force plain log lines
```

`--no-tui` is handy when you want to redirect output to a file:

```bash
python bridge/aegis-serial-bridge.py --no-tui | tee bridge.log
```

## Driving the device from the dashboard

While the dashboard is running you can still type serial commands; they are
forwarded to the beacon as soon as you press Enter:

```
FREQ 433.500     set the desired frequency, persisted
FREQ?            show configured frequencies
WPM 14           set Morse speed, persisted
MODE BEACON      BEACON | SEARCH | CONFIG | EMERGENCY
POS              print the fix now
STATUS           print device state
HELP             list everything
exit             stop the bridge
```

Each command you send appears in the live log as `[bridge] -> device: ...`,
and the device's response scrolls in as a `[device]` line. See
[Serial Command Protocol](serial-command-protocol) for the full command
reference.

## Screen size

The dashboard adapts to the terminal width (up to 96 columns) and keeps only
as many log lines as fit vertically. In a tiny window it shows less history;
make the terminal bigger to see more.

## Why a dashboard

The bridge can run for hours during a multi-beacon session. The dashboard
turns it from a log you have to scroll through into a live instrument panel:
you can see at a glance whether the device is connected, whether the position
is fresh, and whether the site page is receiving the stream — the three
things that actually matter during a field exercise.

## Related pages

- [Serial Bridge Guide](serial-bridge-guide)
- [Bridge Automation](bridge-automation)
- [Bridge Troubleshooting](bridge-troubleshooting)
- [Report Position Page](report-position-page)