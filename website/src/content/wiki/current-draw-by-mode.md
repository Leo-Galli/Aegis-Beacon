---
title: Current Draw by Mode
description: Reference table of the beacon's current draw in each mode and state, measured at 3.7 V.
---

# Current Draw by Mode

A reference table of what the beacon actually consumes in each operating state. Numbers are measured at 3.7 V on the standard build and vary by a few milliamps across boards.

## State table

| State | Current (mA) | Dominant consumer |
| --- | --- | --- |
| Deep sleep | 0.02 - 0.15 | RTC, regulators |
| CONFIG, idle | 22 - 30 | ESP32, OLED |
| CONFIG + OLED refresh | 28 - 35 | OLED writes |
| BEACON, pre-TX | 25 - 35 | ESP32, GPS |
| BEACON, TX burst | 110 - 140 | SX1262 PA |
| SEARCH, sweeping | 35 - 50 | Radio RX |
| GPS acquiring | 65 - 95 | GPS module |
| GPS tracking | 30 - 45 | GPS module |
| WiFi (CONFIG portal) | 90 - 160 | ESP32 radio stack |

## Reading the table

- Sleep plus GPS-off is the beaconing baseline: everything else is added on top.
- The TX burst at 120 mA for 2 seconds per 10-second cycle adds an average of 24 mA.
- GPS always-on adds a flat 30 mA that never sleeps, which is why it dominates multi-day runtime.

## How to use it

Pick your mission profile and add the averages (worked example on [Battery Capacity Math](battery-capacity-math)). The difference between "GPS on, 10 s interval" and "GPS off, 60 s interval" is roughly a 4x runtime change, which is why the settings exist.

## Measuring your own board

Clone boards differ (see [Board Variants and Clones](board-variants-and-clones)). Run the [Power Measurement](power-measurement) procedure once per board you own; the table above is the reference, your board's numbers are the truth.

## Related pages

- [Power Measurement](power-measurement) for the procedure
- [Power Budget and Runtimes](power-budget-and-runtimes) for the runtime table
- [Firmware Deep Sleep](firmware-deep-sleep) for the sleep state