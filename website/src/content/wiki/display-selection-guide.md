---
title: "Display Selection Guide"
description: "How to choose and configure the display type for Aegis-Beacon: OLED, TFT, and LCD options with pin wiring and compile-time selection"
order: 12
group: "Hardware & Components"
---

## Display Selection

Aegis-Beacon v6.0 supports four display types, selected at compile time via the `DISPLAY_TYPE` define at the top of `AegisBeacon.ino`. Change the number to match your hardware, then flash.

## Supported Displays

| Type | Number | Resolution | Color | Library | Interface |
|------|--------|-----------|-------|---------|-----------|
| SSD1309 2.42" OLED | 1 (default) | 128x64 | Monochrome | U8g2 | SPI |
| ST7735 1.8" TFT | 2 | 128x160 | Full color | Adafruit GFX | SPI |
| HD44780 LCD 16x2 | 3 | 16 columns, 2 rows | Monochrome | LiquidCrystal | Parallel |
| HD44780 LCD 20x4 | 4 | 20 columns, 4 rows | Monochrome | LiquidCrystal | Parallel |

## How to Select

Open `AegisBeacon.ino` and find the DISPLAY_TYPE block near the top:

```c
//  1 = SSD1309 2.42" 128x64 OLED (U8g2, soft SPI)
//  2 = ST7735 1.8" TFT 128x160  (Adafruit GFX, color)
//  3 = HD44780 LCD 16x2          (LiquidCrystal, parallel)
//  4 = HD44780 LCD 20x4          (LiquidCrystal, parallel)

#define DISPLAY_TYPE 1   // change this number to your display
```

Change the number to match your display and reflash.

## Color Detection

The firmware automatically detects whether the connected display supports color:

- `dispHasColor()` returns `true` only for DISPLAY_TYPE 2 (ST7735 TFT)
- On color displays, semantic colors are mapped to real RGB values (signal-orange accents, red for emergency, green for GPS lock)
- On monochrome displays (OLED, LCD), all content renders in white-on-black or black-on-white
- No manual color configuration is needed

## Pin Wiring by Display Type

### OLED (DISPLAY_TYPE 1) - SPI

| Display Pin | ESP32 GPIO |
|-------------|-----------|
| GND | GND |
| VCC | 3V3 |
| SCK (D0) | GPIO 15 |
| SDA (D1/MOSI) | GPIO 13 |
| RES (RESET) | GPIO 4 |
| DC (A0) | GPIO 16 |
| CS | GPIO 17 |

### TFT (DISPLAY_TYPE 2) - SPI

| Display Pin | ESP32 GPIO |
|-------------|-----------|
| GND | GND |
| VCC | 3V3 |
| SCK | GPIO 15 |
| SDA (MOSI) | GPIO 13 |
| RESET | GPIO 4 |
| DC (A0) | GPIO 16 |
| CS | GPIO 17 |
| LED/BL | 3V3 (always on) |

### LCD (DISPLAY_TYPE 3/4) - Parallel

| Display Pin | ESP32 GPIO |
|-------------|-----------|
| VSS | GND |
| VDD | 5V |
| V0 (contrast) | 10k pot wiper |
| RS | GPIO 16 |
| EN | GPIO 17 |
| D4 | GPIO 23 |
| D5 | GPIO 22 |
| D6 | GPIO 21 |
| D7 | GPIO 19 |
| R/W | GND |
| A (backlight) | 5V via 100 ohm |
| K (backlight) | GND |

Note: LCD displays use 5V logic. The ESP32 GPIO outputs 3.3V which is sufficient for most HD44780 modules (they accept 3.3V logic levels).

## Display Dimensions

The firmware defines resolution constants automatically:

```c
// DISPLAY_TYPE 1: DISP_W=128, DISP_H=64
// DISPLAY_TYPE 2: DISP_W=128, DISP_H=160
// DISPLAY_TYPE 3: DISP_COLS=16, DISP_ROWS=2
// DISPLAY_TYPE 4: DISP_COLS=20, DISP_ROWS=4
```

For the TFT (128x160), the 128x64 UI area is centered vertically with offset DISP_Y_OFF = 48 pixels.

## UI Adaptations by Display Type

### OLED and TFT (pixel displays)

Full graphical UI with:
- Animated antenna glyphs and progress bars
- RSSI trace (oscilloscope-style) on SEARCH and LISTEN modes
- Battery icon with color-coded percentage
- Satellite lock meter on GPS wait screen
- Distress brackets on EMERGENCY mode

### LCD 16x2

Two-line text display showing:
- Line 1: Frequency and mode
- Line 2: Status (TX progress, RSSI, or coordinates)

### LCD 20x4

Four-line text display showing:
- Line 1: Frequency and mode
- Line 2: Status or coordinates
- Line 3: Battery, WPM, channel info
- Line 4: Progress bar or detailed status

## Choosing the Right Display

- **SSD1309 OLED** (default): Best balance of cost, size, and readability. Outdoor-visible, low power. Recommended for most builds.
- **ST7735 TFT**: Full color with signal-orange accents. Higher power draw. Best if you want color-coded status and richer graphics.
- **LCD 16x2**: Cheapest option. Adequate for basic beacon/search operation. Limited information density.
- **LCD 20x4**: More information than 16x2. Good for development and testing. No graphical elements.

## Troubleshooting

If the display shows nothing:
1. Verify DISPLAY_TYPE matches your hardware
2. Check wiring against the pin table for your display type
3. For OLED: ensure SPI pins are on GPIO 15/13/4/16/17 (software SPI, not hardware)
4. For LCD: adjust the contrast potentiometer until text is visible
5. For TFT: ensure LED/BL is connected to 3V3 for backlight
6. Run `Serial Monitor` at 115200 baud to see boot messages - the firmware reports display init status
