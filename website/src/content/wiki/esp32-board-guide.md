---
title: "ESP32 Board Guide"
description: "Choosing and handling the ESP32 DevKit V1: variants, input-only pins, USB chips and board care"
---

# ESP32 Board Guide

## Overview

The ESP32 DevKit V1 (30-pin) is the heart of the Aegis-Beacon. It provides the dual-core CPU, the USB programming interface and the onboard AMS1117-3.3 LDO that powers everything else.

## Why This Board

| Requirement | How the DevKit V1 satisfies it |
|-------------|--------------------------------|
| Dual-core CPU | Two Xtensa cores at 240 MHz |
| Two SPI-capable buses | VSPI for the radio, software SPI for the OLED |
| Native DAC | GPIO 25 (DAC1) for clean audio |
| 4 ADC-capable inputs | GPIO 34, 35, 36, 39 for buttons and battery |
| Deep sleep | ~10 uA with RTC RAM retained |
| USB programming | Built-in CP2102/CH340 USB-serial |

## 30-Pin vs 38-Pin

Both work, but this project targets the 30-pin board:

| Feature | 30-pin | 38-pin |
|---------|--------|--------|
| Breadboard friendly | Yes | Yes |
| Pins used by this project | All covered | Compatible |
| Onboard LDO | AMS1117-3.3 | AMS1117-3.3 |

The firmware and DATASHEET reference the 30-pin layout. If you have a 38-pin board, double-check every GPIO number against your physical pinout before wiring.

## Input-Only Pins

Four pins on the ESP32 cannot be used as outputs and have **no internal pull-up**:

| GPIO | Use in this project |
|------|---------------------|
| 34 | SW_DN (needs external 10k pull-up) |
| 35 | SW_UP (needs external 10k pull-up) |
| 36 | Battery ADC (SVP, input only) |
| 39 | TP4056 charging detect (SVN, input only) |

> [!WARNING]
> Never try to drive GPIO 34, 35, 36 or 39 as outputs. The firmware defines them as inputs; wiring them to a push-pull output will fight the device.

## USB-Serial Chips

Boards ship with either a CP2102 or a CH340 chip:

| Chip | Driver | Notes |
|------|--------|-------|
| CP2102 | Silicon Labs VCP | Most common on name-brand boards |
| CH340 | CH340 driver | Common on cheap clones |

If the board does not enumerate on your PC, install the matching driver first, then try a data (not charge-only) USB cable.

## Board Care

- Do not exceed 5.5 V on VBUS.
- The onboard LDO output is 3.3 V at up to 800 mA. The radio, OLED and GPS together stay within this budget.
- Keep the metal USB shield and antenna away from each other during RF tests.
- If the board gets hot to the touch, power it down immediately and check for a short on the 3.3 V rail.

## Related Pages

- [GPIO Pin Map](/wiki/gpio-pin-mapping)
- [Electrical Specifications](/wiki/electrical-specifications)
- [Hardware Components](/wiki/hardware-components)
- [E22 Radio Module Guide](/wiki/e22-radio-module-guide)
