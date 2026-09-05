---
title: Sleep Current
description: "The deep sleep current budget: which parts keep drawing after the ESP32 sleeps, and how to get a clean microamp-level sleep."
---

# Sleep Current

Deep sleep current is the most lied-about number in ESP32 builds. The chip's datasheet says microamps; your board's regulators and LEDs say otherwise. This page walks the real budget.

## The ESP32's contribution

The ESP32 in deep sleep draws roughly 10 - 150 uA depending on which RTC features stay enabled. The ULP coprocessor, RTC memory, and the RTC timer all add small amounts. In this project the RTC timer and RTC RAM are used, so expect the upper end of that range.

## The board's contribution

Most dev boards add far more than the chip:

| Board part | Extra draw |
| --- | --- |
| Always-on LDO regulator | 50 - 200 uA |
| Power LED | 0.5 - 2 mA (a killer) |
| USB-UART chip | 1 - 5 mA unless reset |
| Charger circuit | 0.1 - 1 mA |

A board with a power LED and a live UART chip can sleep at 3 - 8 mA, which would eat a 2500 mAh cell in under two weeks even with zero beaconing.

## Getting under 0.2 mA

1. Remove or cut the power LED trace.
2. Put the UART chip on an enable pin that the firmware drives low during sleep.
3. Use a board with a proper low-quiescent regulator.
4. Disconnect the GPS power during sleep (see [GPS Power Saving](gps-power-saving)).

## Measuring

Multimeters lie at these levels: a cheap meter reads 0.0 mA below ~50 uA. Use a meter with a uA range or put a 10 ohm resistor in series and read the millivolts across it.

## Why it matters

Sleep current multiplies by the hours the beacon is not transmitting. Cutting it from 5 mA to 0.05 mA turns a 20-day battery into a 2-year one for the same beaconing. The [Power Budget and Runtimes](power-budget-and-runtimes) table shows the effect.

## Related pages

- [Firmware Deep Sleep](firmware-deep-sleep) for the firmware side
- [Power Measurement](power-measurement) for the procedure
- [ESP32 Board Guide](esp32-board-guide) for picking a good board