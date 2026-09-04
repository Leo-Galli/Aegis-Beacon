---
title: "Build Configurations"
description: "Three reference builds: base rescue radio, GPS edition and full field unit, with the BOM deltas"
---

# Build Configurations

## Overview

The same firmware drives three practical builds. Every configuration shares the core: ESP32 DevKit V1, SX1262 radio module, 4 buttons, audio output. They differ in GPS, battery monitoring and enclosure effort.

## Configuration Comparison

| Feature | Base | GPS Edition | Full Field Unit |
|---------|------|-------------|-----------------|
| ESP32 DevKit V1 | yes | yes | yes |
| SX1262 (E22-400M30S) | yes | yes | yes |
| SSD1309 2.42" OLED | yes | yes | yes |
| 4 buttons | yes | yes | yes |
| Audio output | yes | yes | yes |
| NEO-6M GPS | no | yes | yes |
| Battery monitor divider | optional | yes | yes |
| TP4056 charger | yes | yes | yes |
| Hammond 1593L case | optional | optional | yes |
| Typical cost | ~$15-18 | ~$23-28 | ~$30-35 |

## Base Rescue Radio

- Purpose: learning, bench testing, PMR446-adjacent experiments, simplest possible beacon.
- No GPS: payloads are `SOS` or `SOS DE [NAME]`.
- Build time: about one evening for an experienced solderer.
- Good first build because there are fewer failure modes.

## GPS Edition

- The recommended reference build documented throughout this wiki and in the DATASHEET.
- Adds the NEO-6M on UART2 (GPIO 22 RX / GPIO 12 TX) and the battery divider on GPIO 36.
- Enables the full `SOS DE [NAME] PSN [LAT] [LON]` payload.
- Enclosure: Hammond 1593L or 3D printed, with the OLED window cut out.

## Full Field Unit

- Everything in the GPS edition plus cold-weather considerations:
  - LiFePO4 cell instead of Li-ion (rated to -30 C).
  - 47 uF X7R ceramic bulk cap instead of the 100 uF electrolytic.
  - SMA whip antenna and a spare pre-cut 17.3 cm wire.
  - Sealed case with strain relief on the antenna and audio jack.
- Build time: a weekend, mostly for the enclosure work.

## Common Denominator

No matter the build, these stay identical:

- GPIO wiring per the [GPIO Pin Map](/wiki/gpio-pin-mapping).
- NVS defaults (433.500 MHz, +17 dBm, 13 WPM).
- The four operating modes and their OLED layouts.
- The WiFi CONFIG portal and HTTP API.

## Choosing

| You want to... | Build |
|----------------|-------|
| Learn the hardware cheaply | Base |
| Use it in the mountains with position reporting | GPS Edition |
| Carry it all winter in serious terrain | Full Field Unit |

> [!TIP]
> Start with the Base build, verify the RF path and Morse timing on the bench, then add GPS. Most field problems trace back to the radio wiring, so isolate that variable first.

## Related Pages

- [Shopping List](/wiki/shopping-list)
- [First Use](/wiki/first-use)
- [Hardware Components](/wiki/hardware-components)
- [Bill of Materials (Builder)](/builder)
