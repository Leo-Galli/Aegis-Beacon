---
title: GPS Testing Indoors
description: Why GPS fails indoors, what you can still test on the bench, and how to get a fix without going outside.
---

# GPS Testing Indoors

Most GPS modules will not get a fix inside a building. That is normal, not a fault. This page explains what you can and cannot verify on the bench.

## Why it fails indoors

The 1.5 GHz GPS signal is weak (about -130 dBm) and does not penetrate roofs and walls well. Concrete and metal framing block it entirely; double glazing attenuates it heavily. A module that worked fine outdoors will sit at "no fix" indefinitely indoors.

## What you can test inside

| Test | How | Expect |
| --- | --- | --- |
| Module powers up | Check the module LED | Blinks when searching |
| UART output | Serial monitor at 9600 | NMEA sentences stream |
| Parser works | Feed a recorded GGA line | Coordinates update on OLED |
| Wiring correct | Check TX/RX swap | Sentences appear at all |

## Getting a fix near a window

A module placed directly on a windowsill sometimes locks after several minutes, especially if the window faces a clear sky. Elevating it above the sill line helps more than moving it sideways. Do not expect reliability; treat a windowsill fix as a bonus, not a test result.

## The recorded-data trick

The most reliable indoor test is to replay a recorded session:

1. Go outside with the beacon or a serial recorder and capture 10 minutes of NMEA.
2. Feed that recording into the module's RX pin at 9600 baud.
3. The firmware cannot tell the difference between a recorded satellite stream and a live one, so the full parse-and-display path is exercised.

## When to test for real

The definitive GPS test is outdoors with a clear view. Fifteen minutes before your first field trip, power the beacon outside and confirm the satellite count climbs and the coordinates settle within a few meters of your map position.

## Related pages

- [GPS Troubleshooting](gps-troubleshooting) for fault diagnosis
- [GPS Sky View](gps-sky-view) for why the view matters
- [Outdoor Testing](outdoor-testing) for the real test procedure