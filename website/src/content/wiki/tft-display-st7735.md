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

When `dispHasColor()` returns true, the firmware starts every screen black and draws the active element in a signal-orange accent (`0xFD20`). The rest of the UI is rendered in white where a foreground colour is needed. The accent is the one colour change that matters on this panel: it marks the element you are most likely to need to read quickly (the active mode state, the frequency readout, the transmitting indicator, the RSSI threshold, and the distress cues on the emergency screen). |

## UI Layout

The TFT receives the same screen layouts as the OLED, drawn across the full 128x160 pixel panel. The UI is not centred in a smaller box; it fills the panel. Where the OLED uses a single foreground colour, the TFT replaces it with a signal-orange accent for the active element so the important part is always visible against the black background.

## Performance

The ST7735 uses the Adafruit GFX library and renders directly to the display. It does not keep a full frame buffer in RAM the way the OLED does, so RAM usage is comparable to the OLED build while the panel itself is larger. The SPI clock is the same software SPI clock used by the OLED.

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
