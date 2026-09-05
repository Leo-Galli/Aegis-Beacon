---
title: Budget Planning
description: What the beacon really costs, where the money goes, and where you can save without hurting reliability.
---

# Budget Planning

The core build costs between $23 and $28. This page breaks that down and shows where extra money can be spent wisely.

## The core bill of materials

| Part | Typical cost |
|------|-------------|
| ESP32 DevKit V1 | $3.00 |
| E22-400M30S radio | $5.50 |
| SSD1309 2.42" OLED | $3.50 |
| NEO-6M GPS | $4.50 |
| 18650 cell | $1.50 |
| TP4056 charger | $0.50 |
| Buttons, resistors, caps, LEDs, jack | ~$2.00 |
| Enclosure | $3.00 |
| **Total** | **~$23-28** |

## Where prices actually vary

- **The ESP32**: clones are everywhere. A good clone costs $3-4 and works fine. Genuine Espressif modules cost more but are not required.
- **The OLED**: 2.42" SPI panels cost $3-5. The 0.96" I2C panels are cheaper but much less readable outdoors.
- **The GPS**: NEO-6M modules cost $4-6. You can save by skipping GPS entirely (it is optional).
- **The enclosure**: a 3D printed case costs almost nothing if you have a printer; a metal Hammond box costs $5-10.

## Where to save safely

- Buy the ESP32, radio, OLED, and GPS as a bundle from AliExpress; shipping is usually the largest cost.
- Skip the GPS module for your first build and add it later (the firmware handles both configurations).
- Print the enclosure instead of buying one.

## Where not to save

- The **battery**: buy a protected cell from a known brand. A $1 no-name cell can be dangerous.
- The **TP4056**: buy the version with the DW01A protection circuit built in.
- The **antenna connection**: a loose SMA joint can silently kill your range.

## Tools budget

If you own no tools, add $30-50 for an iron, solder, and cutters. These are reusable for any future electronics project.