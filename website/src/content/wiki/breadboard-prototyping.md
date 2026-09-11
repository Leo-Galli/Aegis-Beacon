---
title: "Breadboard Prototyping"
description: "Bring the whole beacon up on a breadboard first: power, radio, OLED and GPS before soldering"
---

# Breadboard Prototyping

## Overview

Before soldering the final build, bring every subsystem up on a breadboard. An hour on the bench saves an evening of desoldering, and RF problems are far easier to chase with clip leads than with a glued enclosure.

## Power First

1. Wire the ESP32 DevKit V1 and confirm the serial monitor speaks at 115200.
2. Add the TP4056 and 18650; confirm the battery reads ~3.7-4.2 V at BAT+.
3. Confirm the 3.3 V rail reads 3.30 V and stays stable when the radio transmits.

## Subsystem Bring-Up Order

| Step | What to verify | Symptom if wrong |
|------|----------------|------------------|
| 1 | Serial console boots clean | No `[ERROR]`, heap ~290 kB |
| 2 | OLED header + battery icon | Blank panel = wiring or 4-pin I2C mistake |
| 3 | Buttons | `[BTN ]` lines appear in the log |
| 4 | Radio init | Hang = BUSY pin not on GPIO 21 |
| 5 | Audio | Tone comes out of the jack in SEARCH mode |
| 6 | GPS (if fitted) | `[GPS ] Fix acquired` outdoors |
| 7 | First TX | Progress bar + serial TX log |

## Breadboard vs Final Build

| Concern | Breadboard | Final |
|---------|------------|-------|
| RF ground | Noisy, long leads | Short, direct ground |
| Antenna | Keep the SMA at the edge | Exits the enclosure |
| GPS patch | Near the radio = no fix | Moved away per placement rules |

> [!WARNING]
> RF results on a breadboard are indicative, not final. Expect the soldered build to transmit and receive better because the ground planes and lead lengths improve.

## Display Variants on the Breadboard

Only one display is mounted at a time. The breadboard layout changes with the display you choose, so pick the variant first and wire to that pin table.

### OLED (DISPLAY_TYPE 1) — SSD1309 2.42" 128x64, SPI

| Display pin | Breadboard rail | ESP32 GPIO |
|-------------|-----------------|------------|
| GND | GND rail | GND |
| VCC | 3.3V rail | 3.3V |
| SCK (D0) | row | GPIO 15 |
| SDA (D1/MOSI) | row | GPIO 13 |
| RES (RESET) | row | GPIO 4 |
| DC (A0) | row | GPIO 16 |
| CS | row | GPIO 17 |

Use short jumper wires for SCK, SDA, DC and CS. Long SPI leads on a breadboard look fine at idle and fail during TX, so keep those four wires short.

### TFT (DISPLAY_TYPE 2) — ST7735 1.8" 128x160, SPI

| Display pin | Breadboard rail | ESP32 GPIO |
|-------------|-----------------|------------|
| GND | GND rail | GND |
| VCC | 3.3V rail | 3.3V |
| SCK | row | GPIO 15 |
| SDA (MOSI) | row | GPIO 13 |
| RESET | row | GPIO 4 |
| DC (A0) | row | GPIO 16 |
| CS | row | GPIO 17 |
| LED/BL | 3.3V rail | 3.3V |

The TFT uses the same five GPIOs as the OLED, so the two screens are drop-in replacements on the breadboard. The only new rail connection is the LED/BL backlight to 3.3V.

### LCD (DISPLAY_TYPE 3) — HD44780 16x2, 4-bit parallel

| Display pin | Breadboard rail | ESP32 GPIO |
|-------------|-----------------|------------|
| VSS | GND rail | GND |
| VDD | 5V rail | 5V |
| V0 (contrast) | wiper of 10k pot | pot 5V to GND |
| RS | row | GPIO 16 |
| EN | row | GPIO 17 |
| D4 | row | GPIO 13 |
| D5 | row | GPIO 15 |
| D6 | row | GPIO 4 |
| D7 | row | GPIO 12 |
| R/W | GND rail | GND |
| A (backlight anode) | 5V rail via 100Ω | 5V |
| K (backlight cathode) | GND rail | GND |

`LiquidCrystal lcd(PIN_LCD_RS, PIN_LCD_EN, PIN_LCD_D4, PIN_LCD_D5, PIN_LCD_D6, PIN_LCD_D7)`.

### LCD (DISPLAY_TYPE 4) — HD44780 20x4, 4-bit parallel

Same six GPIOs, same power, same contrast circuit, same constructor call. The only difference is the display module itself: 20 columns by 4 rows. On the breadboard the LCD 20x4 is wired exactly like the 16x2.

| Display pin | Breadboard rail | ESP32 GPIO |
|-------------|-----------------|------------|
| VSS | GND rail | GND |
| VDD | 5V rail | 5V |
| V0 (contrast) | wiper of 10k pot | pot 5V to GND |
| RS | row | GPIO 16 |
| EN | row | GPIO 17 |
| D4 | row | GPIO 13 |
| D5 | row | GPIO 15 |
| D6 | row | GPIO 4 |
| D7 | row | GPIO 12 |
| R/W | GND rail | GND |
| A (backlight anode) | 5V rail via 100Ω | 5V |
| K (backlight cathode) | GND rail | GND |

**GPIO 12 conflict**: D7 is on GPIO 12, which is also the GPS TX line. If you are testing the GPS and a 20x4 LCD on the same breadboard, move D7 to a free GPIO (for example GPIO 14 or GPIO 2) before you power up, and change `PIN_LCD_D7` in the firmware for that test build.

### Contrast

The character LCDs show nothing if the contrast is wrong. On the breadboard, connect a 10k potentiometer between 5V and GND and put the wiper on V0. Twist the pot until the text appears. If you see a faint rectangle but no text, that is a contrast issue, not a dead module.

### Choosing the breadboard display

- Use the **OLED** if you want the full graphical UI on the bench. It is the default and the easiest to read.
- Use the **TFT** if you want colour on the bench. It is wired the same as the OLED and looks the same, with a signal-orange accent instead of white.
- Use the **LCD 16x2** if you want the cheapest bench display and do not need the extra rows.
- Use the **LCD 20x4** if you want coordinates, the decoded Morse text, and scan history visible at the same time without changing mode.

## Tips

- Use short jumper wires for SPI and the radio bus.
- Keep the SMA side of the E22 module hanging off the board edge.
- Add 100 nF decoupling near the ESP32 and the radio module.
- Do not run the breadboard on USB power alone for TX tests; use the cell.
- Wire the display last, after the radio and the serial console are working. A blank OLED is easy to debug; a dead radio with a working display is harder.

## Related Pages

- [Assembly Guide](/wiki/assembly-guide)
- [Soldering Basics](/wiki/soldering-basics)
- [GPIO Pin Map](/wiki/gpio-pin-mapping)
- [First Use](/wiki/first-use)
- [Wiring Quick Reference](/wiki/wiring-quick-reference)
- [Display Selection Guide](/wiki/display-selection-guide)
