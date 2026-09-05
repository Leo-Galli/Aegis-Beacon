---
title: Interference Sources at 433 MHz
description: The real-world sources of noise and interference around 433 MHz, and how they affect SEARCH mode.
---

# Interference Sources at 433 MHz

The 433 MHz ISM band is shared with a lot of equipment. Knowing the neighbors helps you interpret false hits in SEARCH mode.

## The usual suspects

| Source | Frequency | Notes |
|--------|-----------|-------|
| Garage door openers | ~433.92 MHz | Classic false hit |
| Key fobs and car remotes | 433-434 MHz | Burst transmissions |
| Wireless weather stations | 433.05-434.79 MHz | Continuous data bursts |
| Doorbell transmitters | 433 MHz | Random bursts |
| Smart-home sensors | 433 MHz | Frequent short packets |
| LTE/5G harmonics (rare) | Near the band | Usually below noise floor |
| LED drivers, switching supplies | Broadband | Localized, near the device |

## What a false hit looks like

In SEARCH mode you see a hit with a rising RSSI, but no Morse. The audio pitch may jump around as the interferer transmits its data bursts. The hit log fills with frequencies that are "busy" but not beaconing.

## How to filter

1. Raise the RSSI threshold (e.g. -85 instead of -90) to ignore weaker interferers.
2. Listen: a real beacon repeats a fixed Morse pattern; an interferer's bursts are irregular.
3. Scan multiple passes; a real beacon appears on every pass at the same frequency, an interferer appears sporadically.
4. Move the receiver; interference is usually local.

## When interference is not the cause

If a hit appears only once in twenty passes and never again, it was noise. If it appears every pass at the same frequency with stable RSSI, it is a real transmitter - likely your own beacon or a neighbor's.

## Reducing local noise

- Keep the beacon away from USB chargers and switching supplies during SEARCH.
- The ESP32's own WiFi/BT are off during SEARCH, so they are not the cause.
- The SX1262's receive bandwidth is narrow (CW/FSK), which rejects most broadband noise naturally.

## The honest view

In a quiet mountain valley, false hits are rare. In a campsite or near houses, expect some. Treat every hit as "check it" rather than "it is them".