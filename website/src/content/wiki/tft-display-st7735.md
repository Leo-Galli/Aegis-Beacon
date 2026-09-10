---
title: "ST7735 TFT Display"
description: "Using the ST7735 1.8 inch color TFT module with Aegis-Beacon for full-color status screens and graphical UI"
order: 13
group: "Hardware & Components"
---

## ST7735 TFT Module

The ST7735 1.8" TFT is a full-color 128x160 pixel display module available for under $3. When selected as DISPLAY_TYPE 2, Aegis-Beacon renders all screens in color with semantic color coding.

## Module Specifications

- **Controller**: ST7735 (or compatible ST7735S)
- **Resolution**: 128x160 pixels
- **Color depth**: 16-bit RGB (65K colors)
- **Interface**: SPI (4-wire)
- **Operating voltage**: 3.3V (logic and backlight)
- **Backlight**: LED, active high
- **Typical cost**: $2-4 on AliExpress/Amazon

## Wiring

Same SPI bus as the OLED display:

| Module Pin | ESP32 GPIO | Notes |
|-----------|-----------|-------|
| VCC | 3V3 | 3.3V only |
| GND | GND | |
| SCK | GPIO 15 | SPI clock |
| SDA (MOSI) | GPIO 13 | SPI data |
| RESET | GPIO 4 | Hardware reset |
| DC (A0) | GPIO 16 | Data/Command select |
| CS | GPIO 17 | Chip Select |
| LED/BL | 3V3 | Backlight always on |

Important: The OLED and TFT share the same SPI bus. You cannot have both connected simultaneously. Disconnect the OLED before connecting the TFT.

## Color Scheme

When `dispHasColor()` returns true, the firmware applies these colors:

| Element | Color | Usage |
|---------|-------|-------|
| Background | Black | All screens |
| Text | White | Default foreground |
| Beacon TX header | Red (#F800) | Transmitting state |
| Beacon standby | Blue (#001F) | Standby state |
| Frequency | Yellow (#FFE0) | Large frequency display |
| Battery OK | Green (#07E0) | Above 50% charge |
| Battery medium | Yellow (#FFE0) | 25-50% charge |
| Battery low | Red (#F800) | Below 25% charge |
| GPS lock | Green (#07E0) | Fix acquired |
| Emergency screen | Red background, yellow text | Distress mode |
| RSSI strong | Green (#07E0) | Above threshold |
| Progress bar | Cyan (#07FF) | TX progress |
| Signal Orange accent | #FD20 | Aegis-Beacon branding |

## UI Layout

The 128x64 pixel UI area is centered vertically on the 128x160 TFT, with 48-pixel margins top and bottom. This preserves the exact same layout as the OLED version.

On color displays, additional visual elements appear:
- Top status bar showing mode, temperature, and battery
- Color-coded satellite count in GPS wait screen
- Gradient RSSI trace with threshold color changes

## Performance

The ST7735 uses the Adafruit GFX library which renders directly to the display (no frame buffer), keeping RAM usage comparable to the OLED version. SPI clock speed is the same as the OLED.

## Comparison with OLED

| Feature | OLED (Type 1) | TFT (Type 2) |
|---------|--------------|--------------|
| Resolution | 128x64 | 128x160 |
| Color | Monochrome | 16-bit color |
| Power draw | ~20mA | ~40mA |
| Outdoor readability | Excellent (self-emitting) | Good (with backlight) |
| Viewing angle | Nearly 180 degrees | ~160 degrees |
| Cost | $3-5 | $2-4 |
| Module size | 30x28mm | 34x55mm |

## Known Issues

- Some ST7735 modules have a red tab and require `TFT_INITR_RED` initialization. The firmware uses `tft.initR(INITR_BLACKTAB)` by default. If your display shows garbage, try changing the init parameter.
- The ST7735 has a visible border area not covered by active pixels. This is normal for 1.8" modules.
- The backlight draws ~40mA. For battery-powered builds, consider adding a MOSFET switch to control it via a spare GPIO.
