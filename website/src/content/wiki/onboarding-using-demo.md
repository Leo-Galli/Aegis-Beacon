---
title: Using the Interactive Demo
description: How the web demo mirrors the real firmware, what you can learn from it, and how to use it before you own hardware.
---

# Using the Interactive Demo

The website includes a full interactive simulation of the beacon at `/demo`. It mirrors firmware v6.0 behavior closely enough to teach you the device before you own one.

## What the demo shows

- A realistic 2D handheld mockup: smoke-polycarbonate case, antenna, SSD1309 window, tact switches and status LEDs.
- Live SSD1309 OLED rendered white-on-black exactly like the physical display.
- Firmware-accurate OLED layouts for all five operating modes.
- Five mode selectors (BEACON, SEARCH, LISTEN, CONFIG, EMERGENCY) and four device keys (MODE, SEL, UP, DN).
- Live controls for Morse speed, TX power, RSSI, sleep interval, and the search threshold.
- A payload preview that builds the Morse message as you type your name and coordinates.
- LISTEN mode with a simulated CW decode stream on the OLED.

## Things to try

1. Switch between the five modes and watch the OLED layout change to match the wiki screen reference.
2. Press MODE briefly to toggle BEACON and SEARCH (from LISTEN, MODE returns to BEACON).
3. Hold MODE for 2 seconds to enter EMERGENCY (alternating inverse SOS screen).
4. In any field mode, press SEL briefly to toggle the VOL/WPM adjustment target, then UP/DN to change values.
5. Hold SEL for 3 seconds to open CONFIG (WiFi portal instructions on the OLED).
6. Enter LISTEN, raise RSSI above the threshold, and watch characters decode from the payload field.
7. Type a name and watch the payload preview expand to `SOS DE NAME PSN ...`.

## Button map (matches hardware)

| Button | Short press | Long press |
|--------|-------------|------------|
| MODE | Toggle BEACON/SEARCH (LISTEN returns to BEACON) | 2 s: EMERGENCY |
| SEL | Toggle VOL / WPM target | 3 s: CONFIG |
| UP | Increment selected parameter | - |
| DN | Decrement selected parameter | - |

## What the demo does not show

- Real radio propagation and range.
- Battery drain and deep-sleep current.
- The WiFi captive portal (use the Config Dashboard page for that).
- GPS fix acquisition (coordinates are simulated).

## Why this matters

Before your first build, spend ten minutes with the demo. When the real device is in your hands, every screen and button will already be familiar, and a strange behavior will stand out immediately as a bug rather than a mystery.
