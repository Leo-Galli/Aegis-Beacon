---
title: Firmware OLED Rendering
description: "How the firmware draws the OLED screen: the frame buffer, the 8x8 font, scrolling text and the mode screens."
---

# Firmware OLED Rendering

The 128x64 OLED is driven by the firmware through the SSD1306 controller over I2C. The rendering layer is deliberately simple: a small monospace font, a frame buffer, and a handful of screen layouts.

## Display hardware path

- I2C at 400 kHz (fast mode) on the standard SDA/SCL pins
- Address `0x3C` for most SSD1306 panels
- The display does not need a reset pin when powered with the rest of the board

## Frame buffer

The firmware keeps a 128x64 pixel buffer in RAM (1 KB) and pushes it to the display with one bulk write. Partial updates are only used for the blinking cursor and the status line, which keeps the I2C bus free for the GPS and other traffic.

## Font

The built-in font is 8x8 pixel, uppercase and digits only, matching the Morse restriction (A-Z, 0-9). Each glyph is stored as 8 bytes, one per column. The renderer supports:

- Fixed-width text at (x, y) coordinates
- Inverted video (white on black vs black on white) for the selected menu item
- A 1-pixel blinking underline for the active field

## Screen layouts

Each mode owns its screen:

- **BEACON**: header with mode name, the SOS message, coordinates, and a status row
- **SEARCH**: a full-height signal bar plus the frequency readout
- **CONFIG**: a menu list with an inverted selection cursor
- **EMERGENCY**: large SOS with the GPS status below

## Scrolling and long text

Payload previews longer than 16 characters scroll at 4 pixels per 250 ms. The scroll only runs when the payload is displayed, so it does not interfere with the radio timing.

## Related pages

- [OLED Display](oled-display) for the panel itself
- [Operating Modes OLED](operating-modes-oled) for what each screen shows
- [Firmware State Machine](firmware-state-machine) for how screens switch