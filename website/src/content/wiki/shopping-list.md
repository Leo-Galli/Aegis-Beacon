---
title: "Shopping List"
description: "Where to buy the parts, how to spot clone pitfalls, and a realistic cost breakdown for 2026"
---

# Shopping List

## Overview

All parts are common hobbyist modules available from AliExpress, LCSC, Amazon or local electronics shops. Total for the GPS edition is roughly $23-28 USD at 2026 prices.

## Core Bill of Materials

| Item | Buy this | Watch out for |
|------|----------|---------------|
| ESP32 DevKit V1 | 30-pin dev board, USB-C or micro | Clones with fake CP2102/CH340 chips - test serial before buying 10 |
| E22-400M30S | Ebyte module, 433 MHz, SMA | Do not buy the 470-510 MHz variant |
| SSD1309 2.42" OLED | 7-pin SPI version | The 4-pin I2C version will NOT work - check pin count |
| NEO-6M GPS | Module with ceramic patch + EEPROM | Some clones lack the backup battery (fine, RTC RAM replaces it) |
| TP4056 | USB-C module with DW01A protection | Buy the one that exposes BAT+ and STDBY pads |
| 18650 | Protected cell, 2000-3500 mAh | Never buy "fire" or unbranded cells with inflated ratings |
| Buttons x4 | 6x6 mm tactile | Any brand |
| Resistors | 0805 or through-hole kits | 100k, 100R, 330R |
| Caps | 100 uF, 100 nF x2, 10 uF | Electrolytic for bulk, ceramic for decoupling |

## Where to Buy

| Source | Best for | Notes |
|--------|----------|-------|
| AliExpress | Everything | Slowest shipping, lowest price |
| LCSC | Resistors, caps, connectors | Good for bulk passive components |
| Amazon | Fast delivery of modules | 2-3x AliExpress prices |
| Local shop | ESP32, buttons, wire | Saves the wait for small orders |

## Clone Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Serial port never enumerates | Fake CP2102 | Buy from a reputable seller; test with a known board |
| Upload fails halfway | Fake CH340 driver mismatch | Reinstall driver; try a different USB cable |
| Module runs hot | 5 V fed to a 3.3 V pin | Check every VCC wire before powering |
| OLED shows nothing | Bought the 4-pin I2C version | Verify 7 pins: GND VCC SCK SDA RES DC CS |
| Radio never initializes | Wrong frequency variant | Confirm the label says 400M30S (433) |

> [!WARNING]
> The single most common shopping mistake is the OLED. There are two SSD1309 breakout styles on the market; the firmware uses the **7-pin SPI** board. The 4-pin I2C board has the same driver chip but no SPI pins and cannot be used without modification.

## Cost Reality Check

| Part | Cost |
|------|------|
| ESP32 DevKit V1 | $3.00 |
| E22-400M30S | $5.50 |
| SSD1309 OLED | $3.50 |
| NEO-6M GPS | $4.50 |
| TP4056 + 18650 | $2.00 |
| Passive + buttons + wire | ~$2.50 |
| Case | $0-3.00 |
| **Total** | **~$23-28** |

See the interactive [BOM Builder](/builder) to adjust quantities, swap sources and recompute the total live.

## Related Pages

- [Build Configurations](/wiki/build-configurations)
- [Hardware Components](/wiki/hardware-components)
- [BOM Builder](/builder)
