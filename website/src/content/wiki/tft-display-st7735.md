---
title: "ST7735 TFT Display"
description: "ST7735 1.8 inch 128x160 color TFT on the Aegis-Beacon: exact pinout, the Adafruit_ST7735 software SPI constructor, the shared OLED bus, NC pins, LED/BL variants, and the init-table gotcha."
order: 13
group: "Hardware & Components"
---

# ST7735 TFT Display

The ST7735 1.8" TFT is a full-color 128x160 pixel display. When selected as `DISPLAY_TYPE 2`, the beacon renders all screens in color with a signal-orange accent for the active element.

## Module overview

- **Controller**: ST7735 (or compatible ST7735S)
- **Resolution**: 128x160 pixels
- **Color depth**: 16-bit RGB (65K colors)
- **Interface**: SPI (software SPI, 4-wire + reset + chip select)
- **Operating voltage**: 3.3V (logic and backlight)
- **Backlight**: LED, active high
- **Typical cost**: $2–4 on AliExpress/Amazon

The constructor in the code is software SPI:

```c
Adafruit_ST7735 tft = Adafruit_ST7735(
  PIN_OLED_CS,
  PIN_OLED_DC,
  PIN_OLED_SDA,
  PIN_OLED_SCK,
  PIN_OLED_RES
);
```

That is `Adafruit_ST7735(CS, DC, MOSI, SCLK, RST)` on the same pins as the OLED.

Compile with `-D DISPLAY_TYPE=2`.

## Pin table

| Module pin | Connect to | Notes |
|---|---|---|
| VCC | 3V3 ESP32 | Not 5V. The panel stays at 3.3V like the rest of the board. |
| GND | GND | |
| GND (2nd) | GND | Same ground node. |
| NC x3 | Do not connect | Usually unused MISO/SDO (SPI is write-only) and/or a backlight pin already wired on the module. If one of them is actually LED/BLK and the screen stays dark, try tying it to 3V3 (through a resistor if the module has none onboard). |
| CLK | GPIO 15 | PIN_OLED_SCK |
| SDA | GPIO 13 | PIN_OLED_SDA (MOSI) |
| RS | GPIO 16 | PIN_OLED_DC - on this module "RS" is Data/Command |
| RST | GPIO 4 | PIN_OLED_RES |
| CS | GPIO 17 | PIN_OLED_CS |

The OLED and the TFT share the same SPI bus. You cannot have both connected simultaneously. Disconnect the OLED before connecting the TFT.

## NC pins and LED/BL behavior

The display has signals that the firmware does not drive and that you generally do not need to connect:

- **MISO/SDO**: the firmware writes to the panel over SPI; it does not read back from the display. That pin is not used.
- **Extra unconnected pins**: some modules expose more pins than the active set. If they are marked NC, leave them disconnected.
- **Backlight pin that is not labeled**: on some modules the backlight is connected to a pin that is not clearly labeled LED/BL. If the screen stays dark even though the SPI wiring looks correct, check whether the backlight enable is on a pin you have not connected. If so, tie that pin to 3V3, ideally through a resistor if the module does not already include one.

If the module already has a backlight resistor onboard, you can tie LED/BL directly to 3V3. If not, add a current-limiting resistor.

## UI layout on the TFT

The TFT receives the same screen layouts as the OLED, drawn across the full 128x160 pixel panel. The UI is not centred in a smaller box; it fills the panel. Where the OLED uses a single foreground colour, the TFT replaces it with a signal-orange accent for the active element so the important part is always visible against the black background.

## Color scheme on the TFT

When `dispHasColor()` returns true, the firmware starts every screen black and draws the active element in a signal-orange accent (`0xFD20`). The rest of the UI is rendered in white where a foreground colour is needed. The accent is the one colour change that matters on this panel: it marks the element you are most likely to need to read quickly (the active mode state, the frequency readout, the transmitting indicator, the RSSI threshold, and the distress cues on the emergency screen).

## Performance

The ST7735 uses the Adafruit GFX library and renders directly to the display. It does not keep a full frame buffer in RAM the way the OLED does, so RAM usage is comparable to the OLED build while the panel itself is larger. The SPI clock is the same software SPI clock used by the OLED.

## Comparison with the OLED

| Feature | OLED (Type 1) | TFT (Type 2) |
|---------|--------------|--------------|
| Resolution | 128x64 | 128x160 |
| Color | Monochrome | 16-bit color |
| Power draw | ~6–20 mA | ~40 mA |
| Outdoor readability | Excellent (self-emitting) | Good (with backlight) |
| Viewing angle | Nearly 180 degrees | ~160 degrees |
| Cost | $3–5 | $2–4 |
| Module size | 30x28 mm | 34x55 mm |

## Known issues

- Some ST7735 modules have a red tab and require `TFT_INITR_RED` initialization. The firmware uses `tft.initR(INITR_BLACKTAB)` by default. If your display shows garbage, try changing the init parameter.
- The ST7735 has a visible border area not covered by active pixels. This is normal for 1.8" modules.
- The backlight draws ~40 mA. For battery-powered builds, consider adding a switch or a higher series resistor to control it.
- If your module has a backlight enable pin that is not labeled, you may need to tie it to 3V3 for the screen to light up. Check the module silkscreen before assuming a wiring fault.