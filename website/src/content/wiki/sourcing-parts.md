---
title: Sourcing Parts
description: Where to buy each component, how to spot clone pitfalls, and how to handle shipping and lead times.
---

# Sourcing Parts

Every part in the BOM is a commodity. The game is shipping time and clone quality, not availability.

## Where to buy

| Part | Best source | Notes |
|------|-------------|-------|
| ESP32 DevKit V1 | AliExpress, Amazon | Any reputable clone works; avoid no-name brands with missing USB chip |
| E22-400M30S | AliExpress | Buy from a store with real photos of the module |
| SSD1309 2.42" OLED | AliExpress | Confirm 7-pin SPI, not 4-pin I2C |
| NEO-6M GPS | AliExpress | Confirm the module includes the ceramic patch antenna |
| TP4056 | AliExpress | Get the version with DW01A protection |
| 18650 | Local store, Amazon | Buy brand-name protected cells |
| Buttons, passives | AliExpress assortment kits | Cheap and cover future builds |

## Clone pitfalls

- **ESP32**: fake CH340/CP2102 chips can fail to enumerate. If the PC does not see the port, suspect the USB chip, not your code.
- **OLED**: some "SSD1309" panels ship with SSD1306. The firmware supports both, but I2C-only 4-pin panels will not work.
- **E22**: counterfeits exist with reduced PA output. Compare against the datasheet's current draw if you have a multimeter.
- **GPS**: some modules ship without the backup battery; that is fine, the beacon uses RTC RAM instead.

## Shipping times

- AliExpress standard: 1-4 weeks depending on region.
- Amazon/local: 1-3 days but 1.5-3x the price.
- Buy the ESP32, radio, OLED, and GPS in one order to save on shipping.

## Ordering as a set

The Shopping List page links each part to specific listings. For a team order, buy 3-4 of each module: the per-unit shipping is the same and you get spares for the price of one extra unit.