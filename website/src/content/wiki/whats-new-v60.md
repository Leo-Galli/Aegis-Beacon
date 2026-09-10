---
title: "What's New in v6.0"
description: "The v6.0 release brings LISTEN mode with a live CW decoder, the battery monitor, board temperature reporting and a redesigned OLED engine"
---

# What's New in v6.0

v6.0 is the feature release that turns the beacon from a transmitter with a scanner into a full radio tool: it can now also **listen** and decode incoming Morse in real time, report its own battery and temperature, and draw the received signal as an oscilloscope-style trace.

## LISTEN mode and the CW decoder

The headline feature. `MODE LISTEN` keeps the radio on the first configured frequency and runs a real-time Morse CW decoder:

- RSSI is sampled every 5 ms (`CW_SAMPLE_MS`).
- A carrier is a mark when RSSI is at or above the configured `rssiThreshold`.
- Mark and gap durations are measured with the same PARIS timing model the transmitter uses (unit = 1200 / WPM ms).
- Marks of at most 2 units decode as dots, longer marks as dashes.
- Gaps of at least 3 units end a character, gaps of at least 7 units end a word.
- Full ITU table: A-Z, 0-9, punctuation (. , ? - " / ! + = @ $ ( )).
- Decoded characters stream to the OLED (two-line window) and over USB serial as one `AEGIS:CW:<char>` line each; the blue LED blinks on every character.

Enter it with `MODE LISTEN` over serial or from a scripted bridge command. MODE short-press returns to BEACON, SEL long-press enters CONFIG. See [LISTEN mode](mode-listen) for the full screen and operating details and [Firmware CW decoder](firmware-cw-decoder) for the timing internals.

## Battery monitor, live

The firmware now really measures the pack: a 2:1 resistor divider on GPIO 34 (ADC1, so it keeps working while WiFi uses ADC2) is sampled every 5 seconds:

- `readBatteryMv()` returns the pack voltage in millivolts.
- `battPct()` maps 3300-4200 mV linearly to 0-100%.
- A battery glyph appears on BEACON, SEARCH and LISTEN screens with three level cells.
- Below 3550 mV (`BATTERY_LOW_MV`) the glyph flashes, the red LED blinks four times and `AEGIS:BATT:low;mv=..` is printed once; the warning resets when the voltage recovers.
- `BATT` serial command replies `AEGIS:BATT:mv=..;pct=..`.

## Board temperature

The ESP32 internal silicon sensor is read with `temperatureRead()` and reported as `temp=` in the extended `AEGIS:STATE` line and in the serial STATUS block. Values outside 1-125 °C are reported as 0.0 (sensor unavailable).

## RSSI history strip-chart

SEARCH and LISTEN screens now draw the last 120 RSSI samples (`RSSI_HIST_LEN`) as a strip-chart trace instead of a plain fill bar. The threshold tick stays, and a sweeping caret shows the scanner is actively looking while no signal is detected.

## OLED engine rework

Every screen was redrawn with shared vector glyphs: pulsing antenna arcs (BEACON/LISTEN headers, splash), a satellite glyph and 4-cell lock meter (GPS WAIT), a segmented TX progress bar with a blinking caret, distress corner brackets and a blinking TX light (EMERGENCY), a WiFi glyph and checklist (CONFIG), and centered message dialogs with a double frame.

## Serial protocol extensions

| Line | Example | Meaning |
|------|---------|---------|
| `AEGIS:BATT:` | `AEGIS:BATT:mv=3710;pct=52` | Battery voltage and percentage |
| `AEGIS:BATT:low;mv=..` | `AEGIS:BATT:low;mv=3510` | Low-battery warning (once per drop) |
| `AEGIS:CW:<char>` | `AEGIS:CW:S` | One line per decoded Morse character |
| `AEGIS:STATE` | `...;batt=3710;temp=42.1;up=312` | `STATUS` now appends battery, temperature, uptime |
| `AEGIS:HELLO` | `ver=6.0;...` | Version bumped |

## Upgrading

Flashing v6.0 over v5.5 is safe: the NVS schema is unchanged, so every setting (frequencies, WPM, message, mode, thresholds) is preserved. If you want to try LISTEN mode immediately, flash, then send `MODE LISTEN` from the serial monitor or the bridge TUI.