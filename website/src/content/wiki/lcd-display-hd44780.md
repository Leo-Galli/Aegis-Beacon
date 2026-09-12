---
title: "HD44780 LCD Displays"
description: "Character LCD modules (16x2 and 20x4) on the Aegis-Beacon: per-screen GPIO pin tables, the LiquidCrystal constructor, the contrast circuit, the GPIO 12 conflict with GPS, and when each screen makes sense."
order: 14
group: "Hardware & Components"
---

# HD44780 LCD Displays

The HD44780 is the most widely available character display. The beacon supports both the 16x2 and the 20x4 through `DISPLAY_TYPE` 3 and 4. They use the same six-GPIO 4-bit parallel bus and the same `LiquidCrystal` constructor, so the only difference between the two is the module itself and how many rows the firmware can use.

This page gives each screen its own GPIO pin table, the constructor call, and the wiring notes that matter in practice.

## Which screen are you wiring?

| Display | DISPLAY_TYPE | Columns | Rows | Interface | GPIOs used |
|---------|--------------|---------|------|-----------|------------|
| HD44780 16x2 | 3 | 16 | 2 | 4-bit parallel | 16, 17, 13, 15, 4, 12 |
| HD44780 20x4 | 4 | 20 | 4 | 4-bit parallel | 16, 17, 13, 15, 4, 12 |

The two character displays share the same six GPIOs. You swap one for the other by changing `DISPLAY_TYPE` and physically replacing the module. No other firmware change is required.

---

## HD44780 16x2 — DISPLAY_TYPE 3

Two lines of 16 characters. Best for a minimal character display where you only need frequency, mode, and one status line.

### Pin table

| LCD pin | ESP32 GPIO | Notes |
|---------|------------|-------|
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

### Firmware wiring

```c
#define PIN_LCD_RS    16
#define PIN_LCD_EN    17
#define PIN_LCD_D4    13
#define PIN_LCD_D5    15
#define PIN_LCD_D6    4
#define PIN_LCD_D7    12

LiquidCrystal lcd(PIN_LCD_RS, PIN_LCD_EN,
                  PIN_LCD_D4, PIN_LCD_D5,
                  PIN_LCD_D6, PIN_LCD_D7);
```

The constructor is identical to the 20x4. The only difference is that `lcd.begin(16, 2)` is used, which comes from `DISP_COLS` and `DISP_ROWS`.

### What it shows

On a 16x2, every screen is reduced to two lines. Typical contents:

- **Line 1**: frequency and mode.
- **Line 2**: status — TX progress, RSSI, or coordinates.

The firmware keeps both lines inside the visible area and centres longer text where appropriate.

### Notes

- The LCD logic runs on 5 V; the ESP32 drives the six data/control lines at 3.3 V. Most HD44780 modules accept 3.3 V logic on a 5 V supply. If yours does not, add a level shifter on those six lines.
- R/W is tied to GND. The firmware never reads the display.
- D7 is on GPIO 12, which is also the GPS TX line. On the 16x2 this is less likely to matter because the screen is chosen when you do not need the extra rows. If you do use GPS and the 16x2 together and hit a conflict, move D7 and update `PIN_LCD_D7`.
- Contrast is mandatory. Without the potentiometer on V0 the display shows a faint rectangle or nothing at all.
- Backlight current is high relative to the rest of the system. On battery builds, raise the series resistor on the A line or switch the backlight off in bright environments.

### Related

- [Display GPIO and Pin Reference](/wiki/display-type-gpio-reference)
- [Display Selection Guide](/wiki/display-selection-guide)
- [HD44780 LCD 20x4 section on this page](#hd44780-20x4---display_type-4)

---

## HD44780 20x4 — DISPLAY_TYPE 4

Four lines of 20 characters. Best character display for development and for field use when you want coordinates or decoded Morse visible without changing mode.

### Pin table

| LCD pin | ESP32 GPIO | Notes |
|---------|------------|-------|
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

### Firmware wiring

```c
#define PIN_LCD_RS    16
#define PIN_LCD_EN    17
#define PIN_LCD_D4    13
#define PIN_LCD_D5    15
#define PIN_LCD_D6    4
#define PIN_LCD_D7    12

LiquidCrystal lcd(PIN_LCD_RS, PIN_LCD_EN,
                  PIN_LCD_D4, PIN_LCD_D5,
                  PIN_LCD_D6, PIN_LCD_D7);
```

The constructor is identical to the 16x2. The only difference is that `lcd.begin(20, 4)` is used, which the firmware derives from `DISP_COLS` and `DISP_ROWS`.

### What it shows

On a 20x4, every screen that has a third or fourth meaningful line uses it. The extra rows give you a header, a primary status, a secondary detail, and a progress or numeric line where the firmware provides one. Typical extra content:

- Coordinates on the GPS wait and emergency screens.
- Decoded Morse text on the LISTEN screen.
- Scan history and threshold on the SEARCH screen.
- Progress bar and channel/WPM info on the BEACON screen.
- Connection instructions on the CONFIG screen.

### Notes

- The 20x4 uses the same six GPIOs as the 16x2. You can switch between them by changing one number and rewiring nothing, as long as only one character display is connected at a time.
- D7 is still on GPIO 12, still shared with GPS TX. This conflict matters more on the 20x4 because that screen is often chosen precisely when GPS coordinates are wanted on screen at the same time. If you need both, move D7 to a free GPIO (GPIO 14 or GPIO 2 are common choices, but check they are not already used by your specific radio/boot configuration) and change `PIN_LCD_D7` before compiling.
- Contrast is mandatory. Same potentiometer circuit as the 16x2.
- Backlight current is the main battery cost of the character displays. Same mitigation as the 16x2.

### Related

- [Display GPIO and Pin Reference](/wiki/display-type-gpio-reference)
- [Display Selection Guide](/wiki/display-selection-guide)
- [HD44780 LCD 16x2 section on this page](#hd44780-16x2---display_type-3)

---

## Contrast and power

Both character displays need a contrast voltage on V0. The standard circuit is a 10k potentiometer between 5V and GND, wiper on V0.

- If you see a faint rectangle but no text, adjust the pot. That is a contrast issue, not a dead module.
- If you see nothing and the backlight is off, check VDD and the backlight circuit first.
- If the backlight is on and the text is still invisible, check V0 before assuming a GPIO wiring fault.

Power:

- Logic current is small, about 1-2 mA.
- Backlight current is the dominant draw, typically 20-40 mA depending on the module and the series resistor.
- For battery builds, the backlight is worth optimising. A larger series resistor on the A line reduces current at the cost of brightness. In a well-lit environment you may not need the backlight at all.

---

## GPIO 12 conflict with GPS

D7 defaults to GPIO 12. That pin is also `PIN_GPS_TX`.

If you build the GPS edition and use a 20x4 LCD at the same time, the default wiring puts two signals on GPIO 12. That is the one case where the default character display wiring does not work as-is.

To resolve it:

- Move D7 to a free GPIO. GPIO 14 and GPIO 2 are common choices on the 30-pin DevKit V1, but check that the pin you choose is not already used by your specific radio/boot configuration.
- In `AegisBeacon.ino`, change `#define PIN_LCD_D7` to the new GPIO.
- Recompile and flash.

If you publish a derivative build with a different default pin, update any pin tables you distribute so they match the firmware you actually ship.

---

## Swapping 16x2 and 20x4

Because both modules use the same six GPIOs and the same constructor call, swapping them is mechanical:

1. Change `DISPLAY_TYPE` to 3 or 4.
2. Replace the module.
3. Recompile and flash.

The firmware calls `lcd.begin(DISP_COLS, DISP_ROWS)`, so the 16x2 gets `lcd.begin(16, 2)` and the 20x4 gets `lcd.begin(20, 4)` automatically. No other code change is needed.

---

## Limitations

- Text only. No graphics, no icons, no RSSI trace.
- Fixed character grid. No proportional fonts.
- Refresh is slower than the pixel displays because of the parallel interface.
- Requires 5 V on VDD.
- Outdoor readability without the backlight is limited.

---

## When to use which screen

Use the **16x2** when:

- You only need frequency, mode, and one status line.
- You want the cheapest character display.
- You are building the GPS-less version and do not need extra detail lines.
- You want the smallest possible character display footprint.

Use the **20x4** when:

- You want coordinates or decoded Morse visible without changing mode.
- You want scan history and threshold visible at the same time.
- You are doing bench testing and want more information on screen.
- You want one or two more facts per screen than the 16x2 gives you.

Use the **OLED** or **TFT** instead when you want the full graphical UI, battery glyph, RSSI trace, satellite lock meter, or animated antenna glyphs. The character displays are the low-cost, text-only option.
