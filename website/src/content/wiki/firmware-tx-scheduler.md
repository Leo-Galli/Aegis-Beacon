---
title: Firmware TX Scheduler
description: "How the beacon spaces transmissions: the sleep interval, repeat count, and the timing rules that keep the duty cycle legal."
---

# Firmware TX Scheduler

The transmitter does not fire at random. A small scheduler decides when each burst starts, how many times it repeats, and when the radio goes back to sleep.

## The beacon cycle

In BEACON mode with TX enabled, the firmware runs a loop:

1. Wake from deep sleep.
2. Build the payload (message + callsign + coordinates).
3. Transmit the burst (repeat count times).
4. Sleep for the configured interval.
5. Repeat.

## Timing parameters

| Parameter | Default | Effect |
| --- | --- | --- |
| Sleep interval | 10 s | Gap between bursts |
| Repeat count | 1 | Bursts per wake |
| Tone speed | 12 WPM | Length of each burst |

## Duty cycle math

At 12 WPM, an SOS message with a callsign and coordinates is roughly 25 to 35 seconds of key-down time. With a 10-second sleep, the duty cycle would exceed legal limits for continuous operation. The scheduler therefore enforces a minimum gap between transmissions and warns when the configured values would exceed the band's duty cycle limit (see [Duty Cycle Rule](duty-cycle-rule)).

## Timing integrity

The scheduler uses `millis()` deltas, never `delay()`, for the gaps between bursts. This matters because the GPS and OLED work while the radio idles. The deep sleep wake-up uses the ESP32's real-time clock, which keeps time during sleep.

## Emergency behavior

In EMERGENCY mode the schedule changes: the sleep interval is shortened to the minimum the radio allows and the repeat count rises, because the legal limits on normal operation are explicitly suspended for a genuine emergency.

## Related pages

- [Firmware TX Cycle](firmware-tx-cycle) for what happens inside one burst
- [Duty Cycle Rule](duty-cycle-rule) for the legal constraint
- [Power Budget and Runtimes](power-budget-and-runtimes) for what the schedule costs in battery