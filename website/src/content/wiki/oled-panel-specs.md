---
title: OLED Panel Specs
description: "The 0.96 inch 128x64 OLED panel's specifications: controller, interface, voltage, and the variants that work with the beacon."
---

# OLED Panel Specs

The 0.96 inch OLED is the beacon's window. This page is its specification sheet in plain terms.

## The panel

| Spec | Value |
| --- | --- |
| Size | 0.96 inches diagonal |
| Resolution | 128 x 64 pixels |
| Controller | SSD1306 |
| Interface | I2C (default 0x3C) or SPI (see [OLED SPI vs I2C](oled-spi-vs-i2c)) |
| Supply | 3.3 V (the module includes a regulator) |
| Current | 15 - 30 mA typical |

## The display facts

- Each pixel is its own light source: no backlight, so the "black" areas draw nothing.
- The contrast is excellent and the viewing angle is wide, which matters in the field.
- In direct sunlight OLEDs wash out; the beacon's UI uses large glyphs partly for this reason.

## The variants

| Variant | Difference |
| --- | --- |
| I2C 4-pin | The recommended type (GND, VCC, SCL, SDA) |
| I2C 6-pin | Adds RES and DC pins: leave unconnected |
| SPI | Different wiring, same panel (see [OLED SPI vs I2C](oled-spi-vs-i2c)) |
| Yellow-blue | Two-tone panels: blue top, yellow bottom |

## The address check

The I2C address is 0x3C for nearly all SSD1306 panels. A few use 0x3D. If the display stays dark with correct wiring, try the other address before suspecting the panel (see [OLED Library Notes](oled-library-notes)).

## Related pages

- [OLED Display](oled-display) for the project's display
- [OLED Panel Life](oled-panel-life) for longevity
- [Firmware OLED Rendering](firmware-oled-rendering) for the driver