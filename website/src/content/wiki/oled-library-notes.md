---
title: OLED Library Notes
description: "Working notes on the SSD1306 display library: the API the firmware uses, performance traps, and the I2C constraints."
---

# OLED Library Notes

The display is driven through a library wrapping the SSD1306 controller. This page collects the working notes that save a builder a day of debugging.

## The API the firmware uses

| Call | Purpose |
| --- | --- |
| `display.begin()` | Initialize over I2C |
| `display.clear()` | Clear the frame buffer |
| `display.drawChar(x, y, c)` | Draw one 8x8 glyph |
| `display.drawText(x, y, s)` | Draw a string |
| `display.invert(rect)` | Invert a region for selection |
| `display.display()` | Push the buffer to the panel |

## The I2C constraints

- Bus speed 400 kHz; the panel handles it, the wiring must too (short wires, pull-ups to 3.3 V).
- One transaction per frame is the performance goal; per-pixel writes are the trap.
- The address is `0x3C` for nearly all SSD1306 panels. A few use `0x3D`: if the display stays dark, try the other address before suspecting wiring.

## The memory constraint

A 128x64 frame buffer is 1 KB of RAM. On an ESP32 that is nothing, but the buffer must be declared once and reused; allocating per frame fragments the heap and, worse, slows the loop.

## Performance traps

| Trap | Consequence |
| --- | --- |
| Redrawing the whole screen per keystroke | Visible flicker |
| Blocking I2C while the radio transmits | Timing jitter in the bursts |
| Font data in flash, accessed byte-by-byte | Slow but harmless; prefetch instead |

## The dark-panel check

If the OLED never lights: measure 3.3 V at the panel, check the address, then verify SDA/SCL are on the pins the firmware expects (see [GPIO Pin Map](gpio-pin-mapping)). The display is one of the most forgiving peripherals; a dark panel is almost always wiring.

## Related pages

- [OLED Display](oled-display) for the panel guide
- [OLED SPI vs I2C](oled-spi-vs-i2c) for the interface choice
- [Firmware OLED Rendering](firmware-oled-rendering) for the renderer