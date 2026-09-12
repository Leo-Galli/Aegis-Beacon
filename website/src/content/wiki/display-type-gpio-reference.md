---
title: "Display GPIO and Pin Reference"
description: "One GPIO/pin table per supported display: SSD1309 OLED, ST7735 TFT, HD44780 LCD 16x2 and 20x4, with the exact firmware pin defines, bus sharing, and how to remap a pin when you have a conflict."
order: 11
group: "Hardware & Components"
---

# Display GPIO and Pin Reference

This page is the single place to look when you are wiring a display and want to know exactly which ESP32 pins the firmware uses for each screen type.

Only one display is mounted at a time. The OLED and the TFT share an identical 5-pin software SPI bus. The two character LCDs share an identical 6-pin 4-bit parallel bus. If you have the display in front of you, go straight to its table.

All pin numbers below come from `AegisBeacon.ino`. If you remap any pin there, update the `#define` for that pin and recompile — the wiki and the dashboard both describe the default wiring only.

## Summary table

| Display | DISPLAY_TYPE | Interface | GPIOs used | Power |
|---------|--------------|-----------|------------|-------|
| SSD1309 2.42" OLED | 1 (default) | Software SPI (7-pin) | 15, 13, 4, 16, 17 | 3.3 V |
| ST7735 1.8" TFT | 2 | Software SPI (7-pin) | 15, 13, 4, 16, 17 | 3.3 V |
| HD44780 LCD 16x2 | 3 | 4-bit parallel (6 GPIOs) | 16, 17, 13, 15, 4, 12 | 5 V + 3.3 V logic |
| HD44780 LCD 20x4 | 4 | 4-bit parallel (6 GPIOs) | 16, 17, 13, 15, 4, 12 | 5 V + 3.3 V logic |

The two SPI displays use the same five GPIOs. The two character displays use the same six GPIOs. You switch between screens by changing `DISPLAY_TYPE` and, for the LCD, by rewiring the display itself.

---

## Display type 1 — SSD1309 2.42" OLED

Default screen. Software SPI on a 7-pin header.

### Pin defines in the firmware

```c
#define PIN_OLED_SCK   15
#define PIN_OLED_SDA   13
#define PIN_OLED_RES   4
#define PIN_OLED_DC    16
#define PIN_OLED_CS    17
```

Constructor:

```c
U8G2_SSD1309_128X64_NONAME0_F_4W_SW_SPI u8g2(
  U8G2_R0,
  PIN_OLED_SCK,
  PIN_OLED_SDA,
  PIN_OLED_CS,
  PIN_OLED_DC,
  PIN_OLED_RES
);
```

### Pin table

| Display pin | ESP32 GPIO | Notes |
|-------------|-----------|-------|
| GND | GND | Common ground |
| VCC | 3V3 | 3.3 V only |
| SCK (D0) | GPIO 15 | Software SPI clock |
| SDA (D1 / MOSI) | GPIO 13 | Software SPI data |
| RES (RESET) | GPIO 4 | Hardware reset |
| DC (A0) | GPIO 16 | Data / command select |
| CS | GPIO 17 | Chip select, active low |

### Notes

- This is software SPI, deliberately separate from the radio's hardware VSPI bus. The OLED and the radio can run at the same time.
- The panel must be the 7-pin SPI version. The 4-pin I2C version has the same SSD1309 chip but no SCK/SDA/DC/CS pins and will not work.
- Display power is 3.3 V. Do not power it from 5 V.
- If the panel shows nothing, check the 7-pin header pinout against the module silkscreen before blaming the firmware. Some breakers label SCK as D0 and SDA as D1.

### Related

- [Display Selection Guide](/wiki/display-selection-guide)
- [OLED Display](/wiki/oled-display)
- [Breadboard Prototyping](/wiki/breadboard-prototyping)

---

## Display type 2 — ST7735 1.8" TFT

Color screen. Same 5 GPIOs as the OLED.

### Pin defines in the firmware

The TFT reuses the same `#define`s as the OLED:

```c
#define PIN_OLED_SCK   15
#define PIN_OLED_SDA   13
#define PIN_OLED_RES   4
#define PIN_OLED_DC    16
#define PIN_OLED_CS    17
```

Constructor:

```c
Adafruit_ST7735 tft = Adafruit_ST7735(
  PIN_OLED_CS,
  PIN_OLED_DC,
  PIN_OLED_SDA,
  PIN_OLED_SCK,
  PIN_OLED_RES
);
```

### Pin table

| Module pin | ESP32 GPIO | Notes |
|------------|-----------|-------|
| GND | GND | Common ground |
| VCC | 3V3 | 3.3 V only |
| SCK | GPIO 15 | SPI clock, same bus as the OLED |
| SDA (MOSI) | GPIO 13 | SPI data, same bus as the OLED |
| RESET | GPIO 4 | Hardware reset, same bus as the OLED |
| DC (A0) | GPIO 16 | Data / command select, same bus as the OLED |
| CS | GPIO 17 | Chip select, active low, same bus as the OLED |
| LED / BL | 3V3 | Backlight, keep always on |

### Notes

- The OLED and the TFT share the same bus. Only one can be connected at a time. Disconnect the OLED before connecting the TFT and vice versa.
- The backlight (LED / BL) is powered from 3.3 V and is always on. If your module has a separate backlight enable pin, tie it to 3.3 V or pin it out according to the module silkscreen.
- The firmware initialises the panel with `INITR_BLACKTAB` and rotation 0. If your module shows garbage on boot, the init tab may differ (some panels are `INITR_RED_TAB`). That is a module difference, not a wiring fault.
- The display uses the full 128x160 pixel area. The UI is not centred in a smaller box; it fills the panel.

### Related

- [Display Selection Guide](/wiki/display-selection-guide)
- [ST7735 TFT Display](/wiki/tft-display-st7735)
- [Breadboard Prototyping](/wiki/breadboard-prototyping)

---

## Display type 3 — HD44780 LCD 16x2

Character display, 4-bit parallel bus on 6 GPIOs.

### Pin defines in the firmware

```c
#define PIN_LCD_RS    16
#define PIN_LCD_EN    17
#define PIN_LCD_D4    13
#define PIN_LCD_D5    15
#define PIN_LCD_D6    4
#define PIN_LCD_D7    12
```

Constructor:

```c
LiquidCrystal lcd(PIN_LCD_RS, PIN_LCD_EN,
                  PIN_LCD_D4, PIN_LCD_D5,
                  PIN_LCD_D6, PIN_LCD_D7);
```

Initialisation:

```c
lcd.begin(16, 2);   // from DISP_COLS / DISP_ROWS
```

### Pin table

| LCD pin | ESP32 GPIO | Notes |
|---------|-----------|-------|
| VSS | GND | Ground |
| VDD | 5V | Power (external 5 V or USB) |
| V0 (contrast) | 10k pot wiper | Adjust until text is clear |
| RS | GPIO 16 | Register select |
| RW | GND | Write-only; saves a GPIO |
| EN | GPIO 17 | Enable pulse |
| D4 | GPIO 13 | Data bit 4 |
| D5 | GPIO 15 | Data bit 5 |
| D6 | GPIO 4 | Data bit 6 |
| D7 | GPIO 12 | Data bit 7 — shared with GPS TX |
| A (backlight +) | 5V via 100Ω | Backlight anode |
| K (backlight -) | GND | Backlight cathode |

### Notes

- The LCD logic runs on 5 V, but the data lines (RS, EN, D4–D7) are 3.3 V from the ESP32. Most HD44780 modules accept 3.3 V logic levels on a 5 V supply; if your module is picky, use a level shifter on the six data/control lines.
- R/W is tied to GND. The firmware never reads the display, so the write-only bus saves one GPIO.
- D7 is on GPIO 12. That pin is also the GPS TX line (`PIN_GPS_TX`). If you build the GPS edition and want the 16x2 LCD at the same time, move D7 to a free GPIO (for example GPIO 14 or GPIO 2) and change `PIN_LCD_D7` in the firmware before compiling.
- Contrast is mandatory. Without the potentiometer on V0 the display shows a faint rectangle or nothing at all.
- Backlight current is significant on battery builds. If you want to reduce it, raise the series resistor on the A line or switch the backlight off in bright environments.

### Related

- [Display Selection Guide](/wiki/display-selection-guide)
- [HD44780 LCD Displays](/wiki/lcd-display-hd44780)
- [Breadboard Prototyping](/wiki/breadboard-prototyping)

---

## Display type 4 — HD44780 LCD 20x4

Character display, same 6 GPIOs as the 16x2, same constructor call.

### Pin defines in the firmware

Exactly the same as the 16x2:

```c
#define PIN_LCD_RS    16
#define PIN_LCD_EN    17
#define PIN_LCD_D4    13
#define PIN_LCD_D5    15
#define PIN_LCD_D6    4
#define PIN_LCD_D7    12
```

Constructor:

```c
LiquidCrystal lcd(PIN_LCD_RS, PIN_LCD_EN,
                  PIN_LCD_D4, PIN_LCD_D5,
                  PIN_LCD_D6, PIN_LCD_D7);
```

Initialisation:

```c
lcd.begin(20, 4);   // from DISP_COLS / DISP_ROWS
```

### Pin table

| LCD pin | ESP32 GPIO | Notes |
|---------|-----------|-------|
| VSS | GND | Ground |
| VDD | 5V | Power (external 5 V or USB) |
| V0 (contrast) | 10k pot wiper | Adjust until text is clear |
| RS | GPIO 16 | Register select |
| RW | GND | Write-only |
| EN | GPIO 17 | Enable pulse |
| D4 | GPIO 13 | Data bit 4 |
| D5 | GPIO 15 | Data bit 5 |
| D6 | GPIO 4 | Data bit 6 |
| D7 | GPIO 12 | Data bit 7 — shared with GPS TX |
| A (backlight +) | 5V via 100Ω | Backlight anode |
| K (backlight -) | GND | Backlight cathode |

### Notes

- The 20x4 uses the same six GPIOs and the same constructor call as the 16x2. The only difference is the display module itself and the `lcd.begin(20, 4)` call, which the firmware makes automatically from `DISP_COLS` and `DISP_ROWS`.
- You can swap a 16x2 for a 20x4 and back again without changing any wiring, only `DISPLAY_TYPE`.
- D7 is still on GPIO 12, still shared with GPS TX. The conflict matters more on the 20x4 because that screen is often used precisely when you also want GPS coordinates visible. If you need both, move D7 and update `PIN_LCD_D7`.
- The 20x4 shows a third and fourth row on every screen where the firmware has one. That is the main reason to choose it over the 16x2: coordinates, decoded Morse, and scan history can stay on screen at the same time.

### Related

- [Display Selection Guide](/wiki/display-selection-guide)
- [HD44780 LCD Displays](/wiki/lcd-display-hd44780)
- [Breadboard Prototyping](/wiki/breadboard-prototyping)

---

## Bus sharing and what can be connected together

The display buses are exclusive stacks:

- **SPI bus (OLED + TFT)**: same five GPIOs, one display at a time.
- **LCD bus (16x2 + 20x4)**: same six GPIOs, one display at a time.

You cannot mix SPI and LCD simultaneously without changing pins in the firmware, and you cannot mix the 16x2 and the 20x4 without rewiring the display itself (they use the same pins).

| Combination | Possible with default pins? |
|-------------|-----------------------------|
| OLED + Radio (VSPI) | Yes — different buses |
| TFT + Radio (VSPI) | Yes — different buses |
| OLED + TFT | No — same bus, one at a time |
| LCD 16x2 + LCD 20x4 | No — same bus, one at a time |
| LCD + GPS | Yes, but D7 on GPIO 12 conflicts with GPS TX for the 20x4 use case. Move D7 if both are needed. |

---

## Moving a pin when you have a conflict

The only default conflict worth fixing is **D7 on GPIO 12** when you use a 20x4 LCD together with GPS.

To move D7:

1. Pick a free GPIO. GPIO 14 and GPIO 2 are safe choices on the 30-pin DevKit V1; GPIO 14 is also the SX1262 reset pin, so only use it if the display is the only screen and you are not building the radio version with the default reset pin. GPIO 2 is the SX1262 DIO1 line, so only use it if you are not building the standard radio configuration.
2. In `AegisBeacon.ino`, change `#define PIN_LCD_D7` to the new GPIO.
3. Recompile and flash.

If you move D7, update the wiki pin tables on your copy if you publish a derivative, because the default wiring no longer matches.

The SPI pins (15, 13, 4, 16, 17) are shared between the OLED and the TFT and are part of the default radio layout only in the sense that the radio uses VSPI on 18/19/23/5. The display SPI pins are a separate software bus and do not conflict with the radio GPIOs. You can move them, but then the OLED and TFT are no longer drop-in interchangeable, so only do that when you have a specific reason.

---

## Contrast and power for the character LCDs

Both LCDs need contrast on V0. Use a 10k potentiometer between 5V and GND with the wiper on V0. If you see blocks but no text, the contrast is wrong; if you see nothing and the backlight is on, check V0 first before chasing GPIO wiring.

Backlight current on the LCDs is much higher than on the OLED. If battery runtime matters and you are using a character display, consider lowering the backlight current with a larger series resistor on the A line, or switching the backlight off when the unit is in a well-lit environment.

---

## Quick checklist

- [ ] `DISPLAY_TYPE` matches the display you have wired.
- [ ] For OLED/TFT: 3.3 V, not 5 V.
- [ ] For LCD: 5 V on VDD, 3.3 V logic on RS/EN/D4–D7 is usually fine, contrast pot on V0.
- [ ] For LCD + GPS with a 20x4: D7 moved off GPIO 12, or GPS TX sacrificed.
- [ ] Only one display connected at a time.
- [ ] OLED is the 7-pin SPI version, not the 4-pin I2C version.
- [ ] TFT backlight (LED/BL) tied to 3.3 V.
- [ ] Serial monitor at 115200 shows the display init line if you want confirmation: `OLED ready — SSD1309 128x64`, `Display ready — ST7735 128x160 (color)`, or `Display ready — LCD 20x4`.
