---
title: Using the Interactive Demo
description: How the web demo mirrors the real firmware, what you can learn from it, and how to use it before you own hardware.
---

# Using the Interactive Demo

The website includes a full interactive simulation of the beacon at `/demo`. It mirrors the firmware behavior closely enough to teach you the device before you own one.

## What the demo shows

- A realistic OLED screen with the same layouts the real device shows.
- Four mode buttons (BEACON, SEARCH, CONFIG, EMERGENCY) and four device keys (MODE, SEL, UP, DN).
- Live controls for Morse speed, TX power, sleep interval, repeat count, and the search parameters.
- A payload preview that builds the Morse message as you type your name and coordinates.

## Things to try

1. Switch between the four modes and watch the OLED layout change.
2. Press MODE repeatedly to cycle modes the way the physical button does.
3. In CONFIG mode, select VOL or WPM with SEL, then adjust with UP/DN.
4. Activate EMERGENCY and observe that it forces maximum power and ignores sleep.
5. Type a name and watch the payload preview expand to `SOS DE NAME PSN ...`.

## What the demo does not show

- Real radio propagation and range.
- Battery drain and deep-sleep current.
- The WiFi captive portal (use the Config Dashboard page for that).
- GPS fix acquisition (coordinates are simulated).

## Why this matters

Before your first build, spend ten minutes with the demo. When the real device is in your hands, every screen and button will already be familiar, and a strange behavior will stand out immediately as a bug rather than a mystery.