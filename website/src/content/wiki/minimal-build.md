---
title: Minimal Build
description: "The smallest possible beacon: ESP32 plus radio and battery, no OLED or GPS, and what you give up for the size."
---

# Minimal Build

Sometimes the mission is: smallest, cheapest, most robust. The minimal build drops the display and the GPS and keeps the core: an ESP32, a radio module, and a battery.

## The bill

| Part | Role |
| --- | --- |
| ESP32 board | Everything |
| E22 / SX1262 module | The radio |
| 18650 cell + TP4056 | Power |
| Antenna | The radiator |
| Two buttons | Mode and select |

Total cost is roughly $14 - $18, about two-thirds of the standard build (see [Shopping List](shopping-list)).

## What you give up

| Feature | Lost |
| --- | --- |
| OLED | No screen: config by serial or WiFi only |
| GPS | No automatic coordinates: manual entry required |
| Audio | No tone output |
| Status feedback | LED only |

## How it works

The minimal beacon still transmits the full payload. Without a display, configuration happens over the serial port or the WiFi config portal (see [WiFi Config Portal](wifi-config-portal)). Coordinates are entered manually in decimal degrees. The [Mode Config](mode-config) flow is identical; only the surface changes.

## When it is the right build

- A permanent or semi-fixed beacon at a known location (coordinates entered once)
- A learning or classroom board
- A backup unit that lives in a drawer until needed
- Anywhere size and robustness beat convenience

## Build notes

- Without the OLED, the I2C bus is free; leave the pins accessible for diagnostics.
- The two buttons are mandatory: the firmware expects at least MODE and SEL.
- Keep a serial adapter in the kit: it is the only configuration path without a display.

## Related pages

- [Build Configurations](build-configurations) for the comparison
- [Standard Build](standard-build-configuration) for the full version
- [Displayless Build](displayless-build) for the middle ground