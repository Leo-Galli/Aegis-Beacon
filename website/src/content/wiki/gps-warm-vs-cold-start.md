---
title: GPS Warm vs Cold Start
description: Cold, warm and hot GPS starts explained, how long each takes on a NEO-6M, and how the beacon's sleep behavior affects them.
---

# GPS Warm vs Cold Start

A GPS receiver needs three pieces of data to lock: the satellite almanac, the ephemeris for each satellite, and the current time and position. How much of this it remembers determines the time to first fix (TTFF).

## The three start types

| Start | Retains | Typical TTFF (NEO-6M) |
| --- | --- | --- |
| Cold | Nothing | 26 - 30 s outdoors |
| Warm | Almanac, time, position | 2 - 5 s |
| Hot | Ephemeris too | Under 1 s |

A receiver that has been off for days does a cold start. One that slept for a few hours usually still has a valid ephemeris and does a hot start.

## What the beacon does

The beacon has a firmware setting for GPS power during sleep:

- **Keep powered**: the module retains everything and does a hot or warm start on every wake. Cost: a few milliamps continuously.
- **Power cut**: the module cold-starts after every deep sleep cycle. Cost: tens of seconds of no-fix time after each wake, plus more battery during the search.

The right choice depends on the mission: continuous beaconing with position matters most (keep powered), versus maximum battery life with occasional position updates (power cut).

## Time source matters

The NEO-6M can be told the time and rough position over UART, which turns a cold start into a warm one. The firmware does this after the first fix of a session, so subsequent power cycles acquire faster. This is one reason the first fix of a day is the slowest.

## The 30-second rule

When you power the beacon after days of storage, allow at least a minute of open-sky time before judging the GPS. The first fix is always the worst.

## Related pages

- [Firmware Deep Sleep](firmware-deep-sleep) for the sleep behavior
- [GPS Sky View](gps-sky-view) for what blocks the signal
- [GPS Troubleshooting](gps-troubleshooting) for when a fix never comes