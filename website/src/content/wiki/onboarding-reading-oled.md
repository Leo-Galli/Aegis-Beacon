---
title: Reading the OLED Screens
description: How to read every icon, bar, and line on the beacon display without the manual.
---

# Reading the OLED Screens

The 2.42" OLED shows a lot of information in a small space. This page is the translation layer.

## The header bar

Every screen except EMERGENCY has an inverted header. From left to right you see the mode label, a cycle or hit counter, and the pixel-art battery icon in the top-right corner.

- `[████]` = 76-100% battery
- `[███ ]` = 51-75%
- `[██  ]` = 26-50%
- `[█   ]` = 11-25%
- `[!   ]` blinking = 10% or less
- `[ C  ]` = charging detected (TP4056 STDBY pin low)

## BEACON screen

- Large frequency number in the center (the biggest text on screen).
- A TX progress bar that fills as the message transmits.
- Info line with channel, power, and WPM.
- A scrolling payload line at the bottom showing the actual Morse message.
- The GPS fix indicator: solid square = fix OK, outline = searching.

## SEARCH screen

- Frequency + RSSI value in dBm.
- A fill bar that grows with signal strength.
- A small tick on the bar marking the configured threshold.
- Signal label: STRONG / MEDIUM / WEAK, or "quiet".

## EMERGENCY screen

- Giant alternating-inverted **SOS**.
- "EMERGENCY BEACON TX" plus frequency, power, and coordinates.

## CONFIG screen

- WiFi SSID (AEGIS-SETUP), the IP address (192.168.4.1), and step-by-step connection instructions.

## The adjustment overlay

While adjusting VOL or WPM with UP/DN, the bottom 12 pixels show an inverted bar with the live value. It disappears after 2.5 seconds.

If a screen ever looks wrong, the first thing to check is the boot screen: it shows the firmware version and feature flags, which instantly tells you whether you are running the config you think you are.