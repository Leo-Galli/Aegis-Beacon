---
title: Firmware Deep Sleep
description: How the ESP32 enters deep sleep between beacon bursts, what stays powered, and how the device wakes on schedule.
---

# Firmware Deep Sleep

The beacon spends most of its life asleep. Deep sleep is the difference between a battery that lasts hours and one that lasts days.

## What deep sleep does

On the ESP32, deep sleep:

- Stops the CPU and most peripherals
- Keeps the RTC domain powered (the RTC timer that schedules the wake)
- Drops current draw to roughly 10-150 uA depending on the board's regulators
- Loses RAM contents (the ULP coprocessor is not used in this project)

## What is preserved

The firmware stores across sleep:

| Data | Location | Why |
| --- | --- | --- |
| Last GPS fix | RTC RAM | Transmit immediately after wake |
| Configuration | NVS flash | Survives power loss too |
| Wake schedule | RTC timer | The only clock that runs in sleep |

## The wake sequence

1. The RTC timer fires after the sleep interval.
2. The ESP32 boots in about 50 ms.
3. The firmware checks the wake cause; if it is the timer, it resumes the beacon cycle without a full reconfiguration of the radio.
4. After the burst, deep sleep is re-entered.

## Peripherals during sleep

The OLED, buzzer and radio are powered down. The GPS module is handled separately: either it stays powered to keep its almanac warm (higher draw) or it is cut from power and does a cold start each cycle (longer fix time). The firmware setting `GPS power saving` selects between these.

## Measuring the sleep current

Use a multimeter in series with the battery to verify your board actually sleeps. A board with an always-on regulator and an LED that never turns off can draw 10 mA in "sleep", which would halve the runtime. See [Power Budget and Runtimes](power-budget-and-runtimes) for expected numbers.

## Related pages

- [ESP32 Sleep Modes](esp32-sleep-modes) for the hardware side
- [Firmware TX Scheduler](firmware-tx-scheduler) for what triggers the wake
- [Battery Life](battery-monitor-details) for the current measurements