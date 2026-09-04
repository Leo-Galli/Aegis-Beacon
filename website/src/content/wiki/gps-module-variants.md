---
title: "GPS Module Variants"
description: "NEO-6M, NEO-7M, NEO-8M and M8N: what changes and what stays the same for the firmware"
---

# GPS Module Variants

## Overview

The firmware is written against the NEO-6M over a 9600 baud UART, but the code talks to any GPS that emits standard NMEA sentences. Newer u-blox modules are drop-in alternatives with one caveat: default baud rate.

## The u-blox Family

| Module | Key difference | Default baud |
|--------|----------------|--------------|
| NEO-6M | Baseline, oldest | 9600 |
| NEO-7M | Faster acquisition | 9600 |
| NEO-8M | Better sensitivity | 9600 (most boards) |
| M8N | Multi-constellation (GPS+GLONASS) | 9600 (most boards) |

## What Stays the Same

- NMEA protocol over UART.
- 3.3 V logic on the TX/RX lines.
- Firmware parses with TinyGPS++ - no driver change needed.
- Patch antenna mounting guidance.

## The Baud Caveat

Some M8N breakout boards ship configured for 38400 baud. If the module is silent at 9600:

1. Check the seller's documentation for the configured baud.
2. Reconfigure the module with u-center to 9600 baud.
3. Or confirm the board has an auto-baud feature.

## Wiring

All of these use the same two pins:

| GPS pin | ESP32 GPIO |
|---------|------------|
| TX | GPIO 22 (Serial2 RX) |
| RX | GPIO 12 (Serial2 TX) |

## Related Pages

- [NEO-6M GPS Module Guide](/wiki/neo6m-gps-module-guide)
- [GPS Integration](/wiki/gps-integration)
- [GPS Troubleshooting](/wiki/gps-troubleshooting)
- [GPS Antenna Placement](/wiki/gps-antenna-placement)
