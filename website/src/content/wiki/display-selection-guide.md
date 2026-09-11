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

## Pin Wiring by Display Type

Only one display is mounted at a time. The OLED and the TFT share an identical 5-pin SPI bus, so the two screens are drop-in replacements for each other. The character LCDs use a separate 6-pin 4-bit parallel bus.

### OLED (DISPLAY_TYPE 1) — SSD1309 128x64, SPI

| Display pin | ESP32 GPIO | Notes |
|-------------|-----------|-------|
| GND | GND | |
| VCC | 3V3 | 3.3V only |
| SCK (D0) | GPIO 15 | software SPI clock |
| SDA (D1/MOSI) | GPIO 13 | software SPI data |
| RES (RESET) | GPIO 4 | hardware reset |
| DC (A0) | GPIO 16 | data/command select |
| CS | GPIO 17 | chip select (active low) |

### TFT (DISPLAY_TYPE 2) — ST7735 128x160, SPI

| Display pin | ESP32 GPIO | Notes |
|-------------|-----------|-------|
| GND | GND | |
| VCC | 3V3 | 3.3V only |
| SCK | GPIO 15 | same bus as the OLED |
| SDA (MOSI) | GPIO 13 | same bus as the OLED |
| RESET | GPIO 4 | same bus as the OLED |
| DC (A0) | GPIO 16 | same bus as the OLED |
| CS | GPIO 17 | same bus as the OLED |
| LED/BL | 3V3 | backlight, keep always on |

The TFT driver is `Adafruit_ST7735`, initialised with `INITR_BLACKTAB`. Rotation is set to 0 so the 128-wide by 160-tall panel fills the framebuffer naturally. The TFT uses the same five GPIOs as the OLED, so the two are physically interchangeable.

### LCD (DISPLAY_TYPE 3) — HD44780 16x2, 4-bit parallel

| Display pin | ESP32 GPIO | Notes |
|-------------|-----------|-------|
| VSS | GND | |
| VDD | 5V | power |
| V0 (contrast) | 10k divider wiper | adjust until text is clear |
| RS | GPIO 16 | |
| EN | GPIO 17 | |
| D4 | GPIO 13 | |
| D5 | GPIO 15 | |
| D6 | GPIO 4 | |
| D7 | GPIO 12 | shared with GPS TX |
| R/W | GND | write-only |
| A (backlight anode) | 5V via 100Ω | |
| K (backlight cathode) | GND | |

`LiquidCrystal lcd(PIN_LCD_RS, PIN_LCD_EN, PIN_LCD_D4, PIN_LCD_D5, PIN_LCD_D6, PIN_LCD_D7)`.

### LCD (DISPLAY_TYPE 4) — HD44780 20x4, 4-bit parallel

Same six GPIOs as the 16x2, identical constructor call. The only difference is that `lcd.begin(20, 4)` is used automatically and every screen renderer has a third and fourth line available.

| Display pin | ESP32 GPIO | Notes |
|-------------|-----------|-------|
| VSS | GND | |
| VDD | 5V | power |
| V0 (contrast) | 10k divider wiper | adjust until text is clear |
| RS | GPIO 16 | |
| EN | GPIO 17 | |
| D4 | GPIO 13 | |
| D5 | GPIO 15 | |
| D6 | GPIO 4 | |
| D7 | GPIO 12 | shared with GPS TX |
| R/W | GND | write-only |
| A (backlight anode) | 5V via 100Ω | |
| K (backlight cathode) | GND | |

**GPIO 12 conflict**: D7 is on GPIO 12, which is also the GPS TX line. If you use the GPS module *and* a 20x4 LCD at the same time, move D7 to a free GPIO (for example GPIO 14 or GPIO 2) and change `PIN_LCD_D7` in the firmware before compiling.

The 16x2 and 20x4 use exactly the same bus and the same constructor call, so the two character displays are interchangeable without any firmware change beyond `DISPLAY_TYPE`.

## Display Dimensions

The firmware derives the resolution from `DISPLAY_TYPE` at compile time and defines the constants used by every renderer:

```c
// DISPLAY_TYPE 1: DISP_W=128, DISP_H=64
// DISPLAY_TYPE 2: DISP_W=128, DISP_H=160
// DISPLAY_TYPE 3: DISP_COLS=16, DISP_ROWS=2
// DISPLAY_TYPE 4: DISP_COLS=20, DISP_ROWS=4
```

`DISP_COLS` and `DISP_ROWS` are used by the character-LCD renderers to keep every line inside the visible area and to centre longer text. `DISP_W` and `DISP_H` are used by the pixel renderers only.

## LCD in detail

Both character displays share the same 4-bit bus and the same LiquidCrystal constructor. The only difference is the number of visible rows and columns, and every renderer already checks `DISP_ROWS` before using a row, so the 16x2 and the 20x4 are served by identical code.

### LCD 16x2

Two-line text display showing:
- Line 1: Frequency and mode
- Line 2: Status (TX progress, RSSI, or coordinates)

### LCD 20x4

Four-line text display showing:
- Line 1: Frequency and mode
- Line 2: Status or coordinates
- Line 3: Extra detail, progress, or last scan hit
- Line 4: WPM, threshold, or secondary status

The 20x4 is the most informative of the four screens without being graphical. It keeps the same compact text style as the 16x2 but adds a third and fourth row and four extra columns per line, so every mode can show one or two more facts.

Good uses for a 20x4:
- Development and bench testing, where you want to see the decoded Morse text and the scan history at the same time.
- Field builds where you want coordinates visible without entering listen mode.
- Cases where you want beacon progress and channel information on the same screen.

When a 16x2 is enough:
- If you only need frequency, mode, and a single status line.
- If you want the smallest, cheapest character display.
- If you are building the GPS-less version and do not need extra detail lines.

## Choosing the Right Display

- **SSD1309 OLED** (default): Best balance of cost, size, and readability. Outdoor-visible, low power. Recommended for most builds.
- **ST7735 TFT**: Full colour with signal-orange accents. Higher power draw. Best if you want colour-coded status and richer graphics.
- **LCD 16x2**: Cheapest option. Adequate for basic beacon/search operation. Limited information density.
- **LCD 20x4**: More information than 16x2, with a dedicated third and fourth line on every screen. Good for development, testing, and situations where you want to read coordinates or the decoded CW text without switching modes.

## LCD screen layouts

Every LCD renderer branches on `DISP_ROWS`, so the 16x2 and 20x4 share the same functions. On a 20x4, the extra rows are used wherever a screen has a third or fourth meaningful line.

### Splash
- Row 1 (centred): `AEGIS-BEACON v6.0`
- Row 2 (centred, when available): boot progress
- Row 4 (centred, when available): `AVALANCHE RESCUE`

### Beacon
- Row 1: `433.500 MHz  +17dBm`
- Row 2: `TX #1 3/18`, `TX #1 SLP 10s`, or `TX #1 STANDBY`
- Row 3: progress bar `[##########]`
- Row 4: `CH1/1 13WPM`

### Search
- Row 1: `433.500 MHz  RSSI -90dBm`
- Row 2: `*** DETECTED ***` (centred) when above threshold, otherwise scan pass info
- Row 3: `LAST 433.500 -78dBm` when there is a scan history entry
- Row 4: `THR -90dBm`

### Listen (CW decoder)
- Row 1: `RX LISTEN 433.500`
- Row 2: `RSSI -82dBm 14 CHR`
- Rows 3 and 4: sliding window of the most recent decoded text

### GPS wait
- Row 1: `GPS FIX  sats:4`
- Row 2: `FIX OK  4 sats` or `TIMEOUT in 27s`
- Row 3 (centred, when available and fix valid): `45.8831 12.5003`

### Emergency
- Row 1 (centred, flashing): `*** SOS ***` or `  * SOS *  `
- Row 2: `433.500 MHz +22dBm`
- Row 3 (centred, when available): GPS coordinates or cycle number

### Config
- Row 1 (centred): `CONFIG MODE`
- Row 2: `AP: AegisBeacon`
- Row 3 (centred, when available): `http://192.168.4.1`
- Row 4 (centred, when available): `1 wifi 2 browser 3 url`

## Contrast

Character LCDs need a contrast voltage on V0. Use a 10k potentiometer between 5V and GND with the wiper on V0. If text is faint or missing, adjust the pot before suspecting a wiring fault.

## Boot detection

The firmware probes the wired bus at boot and stores the result in NVS under the `disp` key. The captive-portal display card shows the detected screen. The probe is a fallback: if `DISPLAY_TYPE` is already set correctly for the machine you are compiling for, the probe is skipped and the set value is used directly.

## Troubleshooting

If the display shows nothing:
1. Verify `DISPLAY_TYPE` matches your hardware
2. Check wiring against the pin table for your display type
3. For OLED: ensure SPI pins are on GPIO 15/13/4/16/17 (software SPI, not hardware)
4. For LCD: adjust the contrast potentiometer until text is visible
5. For TFT: ensure LED/BL is connected to 3V3 for backlight
6. Run `Serial Monitor` at 115200 baud to see boot messages — the firmware reports display init status
7. For LCD + GPS: if D7 is on GPIO 12 and you also use GPS, move D7 to a free GPIO and recompile
