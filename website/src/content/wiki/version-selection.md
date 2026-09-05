---
title: Version Selection
description: Which firmware and hardware versions exist, what changed between them, and how to pick what to flash or buy today.
---

# Version Selection

The project has moved through several hardware revisions. This page helps you match firmware to hardware.

## The version line

- **v4.0**: original ESP32-C3 + SX1276 (OOK) + SSD1306. Legacy hardware.
- **v5.0-v5.3**: ESP32 DevKit V1 + SX1262 + SSD1309, added battery monitor and buttons.
- **v5.4 (current)**: full GPS support, NEO-6M, refined payload formats and reliability features.

## What to buy today

Buy the **v5.4 hardware**: ESP32 DevKit V1 (30-pin), E22-400M30S, SSD1309 2.42" SPI OLED, NEO-6M GPS, TP4056, 18650.

## What to flash

Flash the **v5.4 firmware** from the repository root (`AegisBeacon.ino`). It is the only version with:
- Full NEO-6M GPS payload support.
- The v5.4 GPIO map (see below).
- The current dashboard HTML with button controls and scan settings.

## The GPIO map changed - read this

v4.0 and v5.x use completely different pins. **Do not run v5.x firmware on a v4.0 board** without rewiring: the radio moved from software PWM keying to hardware VSPI with a mandatory BUSY pin.

## Checking what you have

- The boot screen shows the firmware version: `AEGIS-BEACON v5.4`.
- The boot screen feature flags confirm GPS and audio configuration.
- The serial log prints the version string at startup.

## Migrating config

Settings live in NVS and mostly carry over between v5.x releases. After a major upgrade, do a factory reset (MODE+SEL at boot for 5 s) and reconfigure via the dashboard, so stale keys cannot cause odd behavior.