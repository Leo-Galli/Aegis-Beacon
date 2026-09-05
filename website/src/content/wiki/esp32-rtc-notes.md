---
title: ESP32 RTC Notes
description: "The ESP32's real-time clock: what it preserves, its drift, and how the beacon uses it for scheduling and timestamps."
---

# ESP32 RTC Notes

The ESP32's RTC domain is the part of the chip that stays alive in deep sleep. This page is what it does, what it does not do, and how the beacon uses it.

## What the RTC domain keeps

In deep sleep the RTC domain keeps:

| Item | Purpose |
| --- | --- |
| RTC timer | The wake scheduler (see [Firmware Wake Sources](firmware-wake-sources)) |
| RTC RAM | The last GPS fix, session state (see [RTC RAM State](rtc-ram-state)) |
| RTC GPIO state | Which pins hold their level |

The main RAM, the flash cache and most peripherals power down.

## The clock

The RTC has its own low-power oscillator (32 kHz). It keeps counting during sleep, which is how the wake timer works. Its accuracy: a few seconds per hour, drifting with temperature. The beacon corrects it whenever a GPS fix arrives (see [GPS Timing](gps-timing)).

## The battery question

The RTC is not battery-backed like a computer's CMOS clock: if the beacon loses ALL power (cell removed), the RTC stops and the time is lost. On reboot the firmware re-initializes from config defaults or the first GPS fix.

## The drift budget

| Period | RTC drift |
| --- | --- |
| 1 hour | 1 - 10 s |
| 24 hours | 30 s - 4 min |
| 1 week | minutes |

For a beacon this is fine: the schedule is approximate by design (see [Firmware TX Scheduler](firmware-tx-scheduler)), and GPS corrections keep the timestamps honest.

## Related pages

- [RTC RAM State](rtc-ram-state) for what survives
- [Firmware Deep Sleep](firmware-deep-sleep) for the sleep
- [GPS Timing](gps-timing) for the correction