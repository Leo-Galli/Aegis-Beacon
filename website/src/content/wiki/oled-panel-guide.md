---
title: "OLED Panel Guide"
description: "SSD1309 vs SSD1306, I2C vs SPI breakouts, buying the right 7-pin panel and avoiding burn-in"
---

# OLED Panel Guide

## Overview

The display is a common source of build confusion because the market sells two different controllers (SSD1306 and SSD1309) on two different interfaces (I2C and SPI). This build needs the SSD1309 7-pin SPI panel.

## SSD1306 vs SSD1309

| Aspect | SSD1306 | SSD1309 |
|--------|---------|---------|
| Common size | 0.96 inch | 2.42 inch |
| Interface options | I2C + SPI | SPI |
| Driver in firmware | Not used (v4.0 legacy) | U8g2 native |
| This build | No | **Yes** |

## 4-Pin vs 7-Pin

| Breakout | Pins | Interface |
|----------|------|-----------|
| 4-pin | VCC GND SCL SDA | I2C only |
| 7-pin | GND VCC SCK SDA RES DC CS | SPI |

> [!WARNING]
> The 4-pin I2C SSD1309 breakout looks similar and shares the driver chip but cannot be used with this firmware, which drives the panel over software SPI. Check the pin count before buying.

## Pin Connection (7-Pin SPI)

| OLED pin | ESP32 GPIO |
|----------|------------|
| GND | GND |
| VCC | 3V3 (never 5 V) |
| SCK (D0) | GPIO 15 |
| SDA (D1) | GPIO 13 |
| RES | GPIO 4 |
| DC | GPIO 16 |
| CS | GPIO 17 |

## Preventing Burn-In

OLED pixels degrade with use:

1. Use the 120 ms refresh normally; no full-screen static content persists.
2. Prefer the sleep command before deep sleep (firmware does this automatically).
3. Avoid leaving the same CONFIG screen on for hours on the bench.

## Related Pages

- [OLED Display](/wiki/oled-display)
- [Shopping List](/wiki/shopping-list)
- [GPIO Pin Map](/wiki/gpio-pin-mapping)
- [Troubleshooting](/wiki/troubleshooting)
