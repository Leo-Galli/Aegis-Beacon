---
title: "HD44780 LCD Displays"
description: "HD44780 character LCD modules (16x2 and 20x4) on the Aegis-Beacon: full pin tables for the 16-pin header, the 7-pin variant, the PCF8574 I2C backpack types 5 and 6, the LiquidCrystal constructor, the contrast circuit, the GPIO 12 conflict with GPS, and when each screen makes sense."
order: 14
group: "Hardware & Components"
---

# HD44780 LCD Displays

The HD44780 is the most widely available character display. The beacon supports both the 16x2 and the 20x4 through `DISPLAY_TYPE` 3 and 4 on the six-GPIO 4-bit parallel bus, and both sizes again through `DISPLAY_TYPE` 5 and 6 on a PCF8574 I2C backpack with only two GPIOs.

This page covers every pinout you are likely to encounter: the full 16-pin header, the smaller 7-pin variant, the I2C backpack (types 5 and 6), and the exact controller code that drives the display.

## Which screen are you wiring?

| Display | DISPLAY_TYPE | Columns | Rows | Interface | GPIOs used |
|---------|--------------|---------|------|-----------|------------|
| HD44780 16x2 | 3 | 16 | 2 | 4-bit parallel | 16, 17, 13, 15, 4, 12 |
| HD44780 20x4 | 4 | 20 | 4 | 4-bit parallel | 16, 17, 13, 15, 4, 12 |
| HD44780 16x2 I2C | 5 | 16 | 2 | PCF8574 backpack | 13 (SDA), 15 (SCL) |
| HD44780 20x4 I2C | 6 | 20 | 4 | PCF8574 backpack | 13 (SDA), 15 (SCL) |

The two parallel types share the same six GPIOs; the two I2C types share two. You swap any of them by changing `DISPLAY_TYPE` and rewiring the display. No other firmware change is required.

---

## HD44780 16x2 — DISPLAY_TYPE 3

Two lines of 16 characters. Best for a minimal character display where you only need frequency, mode, and one status line.

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

### Pin table - 16-pin header

| LCD pin | Connect to | Notes |
|---------|-----------|------|
| 1 VSS | GND | |
| 2 VDD | 5V | Display logic supply |
| 3 V0 | 10kΩ potentiometer between VDD and GND, wiper on V0 | Sets the contrast. Alternatively a fixed ~2kΩ resistor toward GND. |
| 4 RS | GPIO 16 | |
| 5 RW | GND | LiquidCrystal only writes; keep RW tied to ground. |
| 6 E | GPIO 17 | |
| 7-10 D0-D3 | Do not connect | 4-bit mode, unused. |
| 11 D4 | GPIO 13 | |
| 12 D5 | GPIO 15 | |
| 13 D6 | GPIO 4 | |
| 14 D7 | GPIO 2 | Boot-safe: the HD44780 input is high-impedance and cannot disturb the GPIO 2 strap sample. |
| 15 LED+ (A) | 5V (through a ~220Ω resistor if the module has none onboard) | Backlight. |
| 16 LED- (K) | GND | |

### Pin table - what the firmware uses

| Signal | ESP32 GPIO | Notes |
|---------|------------|------|
| RS | GPIO 16 | Register select |
| EN | GPIO 17 | Enable pulse |
| D4 | GPIO 13 | Data bit 4 |
| D5 | GPIO 15 | Data bit 5 |
| D6 | GPIO 4 | Data bit 6 |
| D7 | GPIO 2 | Data bit 7 - strap pin, boot-safe (high-Z input) |

### NC pins, GND pins, and unused signals

The character displays have signals that the firmware does not connect:

- **D0–D3 (pins 7–10)**: not used. The firmware runs in 4-bit mode, so it only drives D4–D7. Leave them disconnected.
- **RW (pin 5)**: tied to GND by the firmware. The firmware never reads from the display. Connecting RW to GND saves a GPIO and is the recommended wiring.
- **Extra GND pin on some modules**: some breakout boards expose a second GND pin. Tie it to the same GND node as the first one.
- **Backlight LED+/LED- (A/K)**: driven from 5V and GND through a current-limiting resistor if the module does not already include one.

### Contrast

V0 needs a contrast voltage. The standard circuit is a 10kΩ potentiometer between VDD (5V) and GND, with the wiper on V0. Twist the pot until the text is clear.

If you do not want a potentiometer, a fixed resistor of about 2kΩ toward GND is a rough starting point on many modules, but the potentiometer is the reliable choice because the correct V0 varies from module to module.

If the display shows a faint rectangle but no text, adjust V0. That is a contrast issue, not a dead module.

### Backlight

Backlight current is the dominant draw on the character displays:

- Logic current is small, about 1–2 mA.
- Backlight current is typically 20–40 mA depending on the module and the series resistor.
- If the module does not already include a current-limiting resistor on the A line, add about 220Ω between 5V and LED+.
- On battery builds, raise the series resistor to reduce current, or switch the backlight off in bright environments.

### What it shows

On a 16x2, every screen is reduced to two lines. Typical contents:

- **Line 1**: frequency and mode.
- **Line 2**: status - TX progress, RSSI, or coordinates.

The firmware keeps both lines inside the visible area and centres longer text where appropriate.

### Notes

- The LCD logic runs on 5 V; the ESP32 drives the six data/control lines at 3.3 V. Most HD44780 modules accept 3.3 V logic on a 5 V supply. If yours does not, add a level shifter on those six lines.
- R/W is tied to GND. The firmware never reads the display.
- D7 is on GPIO 2, a strapping pin that is boot-safe here because the HD44780 data line is a high-impedance input. The GPS shares no LCD pin: its TX line is unconnected because the firmware never transmits to the module.
- Backlight current is high relative to the rest of the system. On battery builds, raise the series resistor on the A line or switch the backlight off in bright environments.

### Related

- [Display GPIO and Pin Reference](/wiki/display-type-gpio-reference)
- [Display Selection Guide](/wiki/display-selection-guide)
- [HD44780 LCD 20x4 section on this page](#hd44780-20x4---display_type-4)

---

## HD44780 20x4 - DISPLAY_TYPE 4

Four lines of 20 characters. Best character display for development and for field use when you want coordinates or decoded Morse visible without changing mode.

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

### Pin table - 16-pin header

| LCD pin | Connect to | Notes |
|---------|-----------|------|
| 1 VSS | GND | |
| 2 VDD | 5V | Display logic supply |
| 3 V0 | 10kΩ potentiometer between VDD and GND, wiper on V0 | Sets the contrast. Alternatively a fixed ~2kΩ resistor toward GND. |
| 4 RS | GPIO 16 | |
| 5 RW | GND | LiquidCrystal only writes; keep RW tied to ground. |
| 6 E | GPIO 17 | |
| 7-10 D0-D3 | Do not connect | 4-bit mode, unused. |
| 11 D4 | GPIO 13 | |
| 12 D5 | GPIO 15 | |
| 13 D6 | GPIO 4 | |
| 14 D7 | GPIO 2 | Boot-safe: the HD44780 input is high-impedance and cannot disturb the GPIO 2 strap sample. |
| 15 LED+ (A) | 5V (through a ~220Ω resistor if the module has none onboard) | Backlight. |
| 16 LED- (K) | GND | |

### Pin table - what the firmware uses

| Signal | ESP32 GPIO | Notes |
|---------|------------|------|
| RS | GPIO 16 | Register select |
| EN | GPIO 17 | Enable pulse |
| D4 | GPIO 13 | Data bit 4 |
| D5 | GPIO 15 | Data bit 5 |
| D6 | GPIO 4 | Data bit 6 |
| D7 | GPIO 2 | Data bit 7 - strap pin, boot-safe (high-Z input) |

The 20x4 uses the same 16-pin header, the same six GPIOs, and the same constructor call as the 16x2. The only difference is the number of visible rows and columns, which the firmware derives automatically.

### Contrast, backlight, NC pins, and power

The contrast, backlight, NC pins, and power notes are the same as the 16x2:

- **D0–D3 (pins 7–10)**: not used. Leave them disconnected.
- **RW (pin 5)**: tied to GND. The firmware never reads from the display.
- **Extra GND pin on some modules**: tie it to the same GND node as the first one.
- **Backlight LED+/LED- (A/K)**: 5V and GND, with a series resistor if the module does not already include one.
- **V0**: 10kΩ potentiometer between VDD and GND, wiper on V0, unless the module has a fixed internal contrast resistor.
- **Logic current**: about 1–2 mA.
- **Backlight current**: typically 20–40 mA; the main battery cost of the character displays.

### What it shows

On a 20x4, every screen that has a third or fourth meaningful line uses it. The extra rows give you a header, a primary status, a secondary detail, and a progress or numeric line where the firmware provides one. Typical extra content:

- Coordinates on the GPS wait and emergency screens.
- Decoded Morse text on the LISTEN screen.
- Scan history and threshold on the SEARCH screen.
- Progress bar and channel/WPM info on the BEACON screen.
- Connection instructions on the CONFIG screen.

### Notes

- The 20x4 uses the same six GPIOs as the 16x2. You can switch between them by changing one number and rewiring nothing, as long as only one character display is connected at a time.
- D7 is on GPIO 2, boot-safe for this use (the HD44780 data line is a high-impedance input). The GPS shares no LCD pin: its TX line is unconnected because the firmware never transmits to the module. No manual pin moves are required.
- Contrast is mandatory unless the module has a fixed internal resistor. Same potentiometer circuit as the 16x2.
- Backlight current is the main battery cost of the character displays. Same mitigation as the 16x2.

### Related

- [Display GPIO and Pin Reference](/wiki/display-type-gpio-reference)
- [Display Selection Guide](/wiki/display-selection-guide)
- [HD44780 LCD 16x2 section on this page](#hd44780-16x2---display_type-3)

---

## LCD variant you actually receive: 7-pin, 16-pin, fixed contrast

Not every HD44780 breakout looks like the full 16-pin header. The signals are the same; what changes is which pins are broken out to the board edge.

### 7-pin variant

Some modules expose only the essential pins: RS, EN, D4, D5, D6, D7, plus VCC and GND. That is the same set of signals as the 16-pin header, minus the pins the firmware does not use anyway (D0–D3, the second GND, and sometimes a separately broken-out RW or backlight).

On a 7-pin module:

- Connect RS, EN, D4, D5, D6, D7 to the same GPIOs as the 16-pin table above.
- Connect VCC and GND.
- If the module has no V0 pin, the contrast is already set internally, usually by a fixed resistor on the board.
- If the module has a fixed internal contrast that is too light or too dark, you cannot adjust it without modifying the module itself. That is a module-level limitation, not a firmware one.

### 16-pin module with RW already tied internally

Some boards label pin 5 as RW but tie it to GND on the PCB. In that case you still do not need an extra wire for RW; just follow the silkscreen and tie the module’s GND pin to the ESP32 GND rail.

### Backlight already on the module

If the module has a built-in current-limiting resistor on the A line, you can connect LED+ directly to 5V. If it does not, add about 220Ω between 5V and LED+.

### Fixed-contrast modules

A few cheap modules ship with a fixed contrast resistor and no user-accessible V0. If the text is barely visible on one of those, your options are:

- Use a different module with a user-adjustable V0.
- Modify the module if you are comfortable lifting or bridging the contrast resistor.
- Accept the fixed contrast and choose the module accordingly next time.

---

## Configurazione "a 7 pin"

If you have a module that exposes only seven connections, the mapping is the same essential set of signals:

- RS, EN, D4, D5, D6, D7 to the same GPIOs as the full table.
- VCC and GND.

The 7-pin version is not a different interface; it is just the same parallel bus with fewer broken-out pins. The firmware does not care whether the board is 16-pin, 7-pin, or anything in between, as long as the six signals it drives are present and wired to the correct GPIOs.

If you cannot find a V0 pin on a 7-pin board, assume the contrast is fixed onboard. If the module also has no separate backlight resistor, it usually already includes one, so LED+ can go straight to 5V.

---

## I2C backpack (GND, VCC, SDA, SCL) - DISPLAY_TYPE 5 / 6

The PCF8574 I2C backpack is fully supported as `DISPLAY_TYPE 5` (16x2) or `DISPLAY_TYPE 6` (20x4). The firmware talks to the backpack through the `LiquidCrystal_I2C` library on the Wire peripheral, so a backpack build needs only four wires instead of seven.

### Why SDA=GPIO13 and SCL=GPIO15

Only one display is ever mounted, so the I2C bus reuses the OLED/TFT soft-SPI pins. GPIO 21 and 22, the usual ESP32 I2C pair, are taken by the radio BUSY line and GPS RX; GPIO 0 is a strapping pin; GPIO 1 and 3 are the USB serial. 13/15 is the cleanest pair left.

| Backpack pin | Connect to | Notes |
|---|---|---|
| GND | GND | |
| VCC | 5V | The HD44780 logic runs at 5V; the PCF8574 is usually powered from the same rail |
| SDA | GPIO 13 | `PIN_LCD_I2C_SDA`, same pin as OLED SDA |
| SCL | GPIO 15 | `PIN_LCD_I2C_SCL`, same pin as OLED SCK |

A 4-wire connection also removes the GPIO 12 conflict with GPS TX entirely, because the parallel D7 line does not exist.

### The I2C address

Most backpacks answer at **0x27**; some, built on the PCF8574A, answer at **0x3F**. The firmware defaults to 0x27 and the boot probe tries both addresses, taking whichever answers first. If your backpack uses another address, override it at compile time:

```bash
pio run -e esp32dev -D LCD_I2C_ADDR=0x3F
```

### What changes in the firmware

- `lcd.init()` + `lcd.backlight()` replace `lcd.begin()`, and `Wire.begin(PIN_LCD_I2C_SDA, PIN_LCD_I2C_SCL)` must run first.
- Sleep now also switches the backlight off (`noBacklight()`), because the display-enable bit and the backlight flag live in the same PCF8574 port.
- Everything else, every renderer and every screen, is identical to the parallel types.

---

## Contrast and power

### What it shows

On a 20x4, every screen that has a third or fourth meaningful line uses it. The extra rows give you a header, a primary status, a secondary detail, and a progress or numeric line where the firmware provides one. Typical extra content:

- Coordinates on the GPS wait and emergency screens.
- Decoded Morse text on the LISTEN screen.
- Scan history and threshold on the SEARCH screen.
- Progress bar and channel/WPM info on the BEACON screen.
- Connection instructions on the CONFIG screen.

### Notes

- The 20x4 uses the same six GPIOs as the 16x2. You can switch between them by changing one number and rewiring nothing, as long as only one character display is connected at a time.
- D7 is on GPIO 2, boot-safe for this use (the HD44780 data line is a high-impedance input). The GPS shares no LCD pin: its TX line is unconnected because the firmware never transmits to the module. No manual pin moves are required.
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

D7 defaults to GPIO 2, a strapping pin that is boot-safe here because the display data line is a high-impedance input on the ESP32 side.

GPS and any character display can coexist on the default wiring: D7 sits on GPIO 2 and the GPS TX line is unconnected, so no two signals ever share a GPIO.

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