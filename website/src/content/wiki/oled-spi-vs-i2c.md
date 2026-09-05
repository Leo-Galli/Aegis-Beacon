---
title: OLED SPI vs I2C
description: Why the beacon uses a 7-pin SPI SSD1309, and how to tell SPI from I2C panels before you buy.
---

# OLED SPI vs I2C

The display choice trips up more first builders than any other part. The short version: buy the **7-pin SPI** panel.

## SPI vs I2C in one table

| Property | SPI (7-pin) | I2C (4-pin) |
|----------|-------------|-------------|
| Pins | GND, VCC, SCK, SDA, RES, DC, CS | GND, VCC, SCL, SDA |
| Speed | Fast (full frame 120 ms) | Slower |
| Firmware support | Yes (U8g2 sw SPI) | Not in this firmware |
| Typical panel | SSD1309 2.42" | SSD1306 0.96" |

## Why SPI

- The firmware drives the display with U8g2 over software SPI on GPIO 15/13/4/16/17.
- SPI can push a full 128x64 frame much faster, which matters for the scrolling payload and progress bar.
- The 2.42" SSD1309 panels that this project uses are SPI.

## How to tell them apart on the listing

- Count the pins: 7 pins (or 7-pin header) = SPI. 4 pins = I2C.
- Read the description: "SPI" or "7-pin" or "SSD1309 2.42 inch" vs "I2C" or "4-pin".
- Look at the back of the board: SPI panels have a DC (A0) and CS pin.

## What if you already own an I2C panel?

The firmware does not support I2C displays. You have two options:

1. Buy the correct SPI panel (cheap, correct fix).
2. Rewrite the display initialization to U8g2's I2C constructor and rewire - not recommended for a first build.

## What if the "SSD1309" is really an SSD1306?

Some sellers label 0.96" SSD1306 panels as SSD1309. Both work with U8g2 (the firmware initializes the panel generically), but the physical 2.42" size is the point: it is readable outdoors. Check the physical diagonal when it arrives.