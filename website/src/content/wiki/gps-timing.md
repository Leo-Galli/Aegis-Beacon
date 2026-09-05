---
title: GPS Timing
description: How GPS time works, why the module can keep time during sleep, and how the beacon uses GPS time for scheduling.
---

# GPS Timing

The GPS constellation is a set of atomic clocks in orbit. The NEO-6M can therefore do something most embedded devices cannot: know the exact time, anywhere, without a network.

## GPS time

Each satellite carries a cesium or rubidium clock. The time they broadcast, GPS time, is within nanoseconds of UTC (it drifts by leap seconds; UTC is GPS time minus 18 seconds at the time of writing). Receivers use it to solve position, but the same signal gives them the time for free.

## What the beacon uses

| Use | How |
| --- | --- |
| Fix timestamp | RMC sentence carries UTC hhmmss |
| Wake scheduling | RTC timer, aligned after each fix |
| Logging | Serial debug lines get GPS time |

The beacon does not need network time sync. When a fix arrives, the firmware writes the GPS time into the RTC so the RTC drifts are corrected at every fix.

## Time without a fix

The ESP32 RTC keeps time during deep sleep, but it drifts. Over 24 hours a typical crystal drifts seconds to minutes. If the GPS is disabled, expect the beacon's internal clock to drift and the transmitted timestamps to be approximate.

## Why the 18-second offset matters

If you ever read a raw NMEA time and compare it to your watch, it will be 18 seconds behind UTC (in the current leap-second era). The firmware does not correct for this; it treats GPS time as UTC. For rescue reporting the difference is irrelevant, but it explains the mismatch you might see on a serial monitor.

## Related pages

- [Firmware GPS Handling](firmware-gps-handling) for the parser
- [GPS NMEA Sentences](gps-nmea-sentences) for the RMC fields
- [RTC RAM State](rtc-ram-state) for what survives sleep