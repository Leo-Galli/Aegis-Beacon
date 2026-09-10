---
title: "HD44780 LCD Displays"
description: "Using character LCD modules (16x2 and 20x4) with Aegis-Beacon as a low-cost display alternative"
order: 14
group: "Hardware & Components"
---

## HD44780 Character LCD

The HD44780 is the most widely available and cheapest character display. Aegis-Beacon supports both 16x2 and 20x4 variants via DISPLAY_TYPE 3 and 4 respectively.

## Supported Modules

| Display | DISPLAY_TYPE | Columns | Rows | Typical Cost |
|---------|-------------|---------|------|-------------|
| HD44780 16x2 | 3 | 16 | 2 | $1-2 |
| HD44780 20x4 | 4 | 20 | 4 | $2-3 |

Both use parallel (4-bit) interface with the LiquidCrystal library.

## Wiring

| LCD Pin | ESP32 GPIO | Notes |
|---------|-----------|-------|
| VSS | GND | |
| VDD | 5V | External 5V supply or USB |
| V0 (contrast) | 10k pot wiper | Adjust until text is clear |
| RS | GPIO 16 | Register Select |
| RW | GND | Always Write mode |
| EN | GPIO 17 | Enable pulse |
| D4 | GPIO 23 | Data bit 4 |
| D5 | GPIO 22 | Data bit 5 |
| D6 | GPIO 21 | Data bit 6 |
| D7 | GPIO 19 | Data bit 7 |
| A (backlight +) | 5V via 100 ohm | Current limiting resistor |
| K (backlight -) | GND | |

Important notes:
- LCD displays require 5V power supply (not 3.3V)
- ESP32 outputs 3.3V logic which is sufficient for most HD44780 modules
- Always connect RW to GND (write-only mode saves a GPIO)
- Use a 10k potentiometer for contrast adjustment - without it text may be invisible

## 16x2 Layout (DISPLAY_TYPE 3)

Two lines of 16 characters:

```
Line 1: 433.500 MHz  BM   (frequency and mode)
Line 2: TX 12/85 15W       (progress or status)
```

Displayed information is condensed to fit:
- Frequency and mode on line 1
- TX progress, RSSI level, or status on line 2

## 20x4 Layout (DISPLAY_TYPE 4)

Four lines of 20 characters:

```
Line 1: 433.500 MHz  BEACON
Line 2: TX: 12/85 chars
Line 3: WPM:15 PWR:15W GPS:OK
Line 4: [=====>         ] 14%
```

More detailed display with:
- Line 1: Frequency and mode
- Line 2: Activity status (TX progress, detection, or GPS info)
- Line 3: Parameters (WPM, power, GPS, battery)
- Line 4: Progress bar or extended status

## Contrast Adjustment

The most common issue with LCD displays is incorrect contrast. Symptoms:
- All blocks visible (backlight on but no text) => V0 too high
- Nothing visible => V0 too low or no backlight

Adjust the 10k potentiometer on V0 until text is clearly readable against the background. The sweet spot is usually around the middle of the potentiometer range.

## Power Considerations

LCD displays draw 1-2mA for logic plus 20-40mA for backlight. Total power:
- Without backlight: ~2mA (negligible)
- With backlight: ~25-45mA

For battery-powered builds, the backlight current is significant compared to the rest of the system (~50mA idle). Consider:
- Using a lower brightness backlight resistor
- Adding a GPIO-controlled backlight switch
- Running without backlight in well-lit environments

## Display Modes

### Beacon Mode
- 16x2: Frequency, TX progress, battery
- 20x4: Full status with character progress bar

### Search Mode
- 16x2: Frequency, RSSI or "DETECTED"
- 20x4: Frequency, RSSI, threshold, channel scan info

### Listen Mode
- 16x2: Frequency, decoded character stream
- 20x4: Frequency, RSSI, decoded text, channel info

### Emergency Mode
- 16x2: Alternating "SOS SOS" and coordinates
- 20x4: SOS banner, frequency, GPS coordinates, cycle count

### GPS Wait
- 16x2: Satellite count and fix status
- 20x4: Satellite count, timeout, coordinates (when available)

### Config Mode
- 16x2: AP SSID and IP address
- 20x4: AP SSID, IP, and connection instructions

## Limitations

- No graphical elements (no progress bars, no RSSI traces, no icons)
- Fixed character grid - no proportional fonts
- Slower refresh than pixel displays (parallel interface)
- Requires 5V power (not compatible with 3.3V-only systems)
- Limited outdoor readability without backlight

## When to Choose LCD

- Lowest cost priority ($1-2 vs $3-5 for OLED)
- Existing LCD modules available from other projects
- Development and prototyping (easy to read debug output)
- Systems where graphical UI is not needed
- Maximum simplicity in assembly (fewer pins, no SPI)
