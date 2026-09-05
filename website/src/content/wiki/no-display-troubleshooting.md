---
title: No Display? Troubleshooting
description: The OLED is dark, dim, or showing garbage. Here is how to fix it, in order of likelihood.
---

# No Display? Troubleshooting

A dark OLED is the most visible first-boot failure. Work through these checks in order.

## 1. Power

- Measure VCC on the OLED: should be 3.3 V.
- A dim display usually means a voltage drop: check the wire gauge and the rail under load.
- The OLED needs its own GND; a missing ground makes the whole panel dark.

## 2. The 7 pins

Confirm all seven connections, in order:

| OLED pin | ESP32 GPIO |
|----------|------------|
| SCK | 15 |
| SDA | 13 |
| RES | 4 |
| DC | 16 |
| CS | 17 |

The most common mistake is swapping SCK and SDA. The second is a cold joint on CS (the chip select), which makes the panel ignore everything.

## 3. Contrast and brightness

The firmware sets a default contrast. If the panel is very dim but shows *something*, contrast may be set low by config, or the panel is a clone with a weak regulator. Check the dashboard's OLED section for an invert toggle; also confirm the panel is not inverted (a nearly black screen with faint ghosting is an inverted panel).

## 4. Firmware config

- Is the OLED enabled in the dashboard config (OLED ENABLED toggle)? If it was disabled, the firmware skips display init entirely.
- Is the firmware the right version? v4.0 firmware expects an I2C SSD1306; v5.x expects the SPI SSD1309.

## 5. The panel itself

- Test the panel with a known-good firmware/board if you have one.
- Some "SSD1309" panels need the RES pin held low briefly at init; the firmware does this. A floating RES (cold joint) prevents init.
- A physically cracked ribbon or damaged flex means a new panel.

## 6. Software SPI vs hardware conflict

The OLED uses software SPI on GPIO 15/13/4/16/17, separate from the radio's VSPI. If you accidentally wired the OLED to the VSPI pins, the display and radio fight over the bus. Verify the pins, not the labels on the board silkscreen.

## When all else fails

Reflash the firmware with a factory reset (MODE+SEL at boot 5 s), then retest with a bare-minimum wiring (power + OLED only). If it works with nothing else attached, the fault is interference or power sag from another module.