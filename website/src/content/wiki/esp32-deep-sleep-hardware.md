---
title: ESP32 Deep Sleep Hardware
description: "The hardware reality of deep sleep: what powers down, what does not, and the board-level fixes for a clean sleep."
---

# ESP32 Deep Sleep Hardware

The firmware requests deep sleep; the hardware decides what actually sleeps. This page is the hardware reality: the peripherals, the board parts, and the fixes.

## What the chip powers down

In deep sleep the ESP32:

- Stops the CPU and most peripherals
- Keeps the RTC domain (timer, RAM, GPIO state) running (see [ESP32 RTC Notes](esp32-rtc-notes))
- Drops to roughly 10 - 150 uA chip-level draw

## What the chip cannot power down

| Part | Problem |
| --- | --- |
| The dev board's regulator | Stays on, drawing 50 - 200 uA |
| Power LEDs | 0.5 - 2 mA, always on |
| The USB-UART chip | 1 - 5 mA unless its enable pin is driven low |
| The charger module | Small quiescent draw |

The board's parts often draw 10 - 100x the chip's own sleep current. This is why the [Sleep Current](sleep-current) page exists: the chip is not the problem, the board is.

## The board fixes

| Fix | Effect |
| --- | --- |
| Cut the power LED trace | Saves 0.5 - 2 mA |
| Drive the UART chip's EN low in sleep | Saves 1 - 5 mA |
| Use a low-quiescent regulator board | Saves 50 - 200 uA |
| Power-switch the GPS | Saves the module's draw (see [GPS Power Saving](gps-power-saving)) |

## The measurement

The only way to know your board's sleep current: measure it (see [Power Measurement](power-measurement)). The [Current Draw by Mode](current-draw-by-mode) table shows the target numbers; your board's number is the truth.

## Related pages

- [Firmware Deep Sleep](firmware-deep-sleep) for the firmware side
- [Sleep Current](sleep-current) for the budget
- [ESP32 Board Guide](esp32-board-guide) for choosing a board