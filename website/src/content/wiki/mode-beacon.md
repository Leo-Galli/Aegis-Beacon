---
title: "BEACON Mode"
description: "The primary emergency mode: TX cycle, payload building, deep sleep and how to configure it"
---

# BEACON Mode

## Overview

BEACON is the default and primary mode. On a fixed interval the device wakes, transmits the configured Morse payload on every frequency in the plan, then deep-sleeps. Runtime on a 2000 mAh cell is roughly 65 hours at a 10 s interval, up to 175 hours at 60 s.

## TX Cycle

1. WiFi and Bluetooth are disabled (saves ~120 mA).
2. The Morse payload is built: base message + name + GPS if enabled.
3. The radio initializes in CW mode at the first frequency.
4. The payload is transmitted, repeated N times per frequency.
5. The OLED shows the frequency, TX progress bar and scrolling payload.
6. The device enters deep sleep for the configured interval.
7. RTC RAM preserves the mode, counters and last GPS fix.

## OLED Layout

| Area | Content |
|------|---------|
| Header | `TX BEACON` + cycle number + battery icon |
| Center | Large frequency (logisoso24) |
| Info line | Channel, power, WPM |
| Progress | TX progress bar |
| Bottom | Scrolling payload, GPS state, battery %, sleep countdown |

## Payload Configuration

| Setting | NVS key | Default |
|---------|---------|---------|
| Base message | `msg` | `SOS` |
| Include name | `namen` | false |
| First name | `fname` | empty |
| Last name | `lname` | empty |
| Include GPS | `gpsbeac` | false |
| Repeat count | `rep` | 1 |

## Power and Sleep

| Sleep interval | Est. runtime (2000 mAh) |
|----------------|--------------------------|
| 10 s | ~65 h |
| 30 s | ~130 h |
| 60 s | ~175 h |

## Related Pages

- [Operating Modes](/wiki/operating-modes)
- [Morse Code Engine](/wiki/morse-code-engine)
- [Power Management](/wiki/power-management)
- [GPS Integration](/wiki/gps-integration)
