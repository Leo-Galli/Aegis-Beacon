---
title: Version Selection
description: Which firmware and hardware versions exist, what changed between them, and how to pick what to flash or buy today.
---

# Version Selection

The project has moved through several hardware revisions. This page helps you match firmware to hardware.

## The version line

- **v4.0**: original ESP32-C3 + SX1276 (OOK) + SSD1306. Legacy hardware.
- **v5.0-v5.3**: ESP32 DevKit V1 + SX1262 + SSD1309, added battery monitor and buttons.
- **v5.4**: full GPS support, NEO-6M, refined payload formats and reliability features.
- **v5.5 (current)**: adds the serial bridge protocol (`AEGIS:` lines), serial commands (`FREQ`, `WPM`, `MODE`, `POS`), the cross-platform bridge script and the Report Position page on the website, and an offline-first config dashboard built on default system fonts.

## What to buy today

Buy the **v5.5 hardware**: ESP32 DevKit V1 (30-pin), E22-400M30S, SSD1309 2.42" SPI OLED, NEO-6M GPS, TP4056, 18650. The hardware is unchanged from v5.4; only firmware and tooling moved.

## What to flash

Flash the **v5.5 firmware** from the repository root (`AegisBeacon.ino`). It is the only version with:
- Full NEO-6M GPS payload support.
- The machine-readable serial protocol and serial commands (see [Serial Command Protocol](serial-command-protocol)).
- Position reporting for the [Serial Bridge Guide](serial-bridge-guide) and the website's Report Position page.
- The current dashboard HTML with button controls, scan settings and default system fonts.

## The GPIO map changed - read this

v4.0 and v5.x use completely different pins. **Do not run v5.x firmware on a v4.0 board** without rewiring: the radio moved from software PWM keying to hardware VSPI with a mandatory BUSY pin.

## Checking what you have

- The boot screen shows the firmware version: `AEGIS-BEACON v5.5`.
- The boot screen feature flags confirm GPS and audio configuration.
- The serial log prints the version string at startup, followed by an `AEGIS:HELLO:ver=5.5;...` line.

## Migrating config

Settings live in NVS and mostly carry over between v5.x releases. After a major upgrade, do a factory reset (MODE+SEL at boot for 5 s) and reconfigure via the dashboard, so stale keys cannot cause odd behavior.