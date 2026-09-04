---
title: "NEO-6M GPS Module Guide"
description: "Choosing, wiring and placing the NEO-6M: UART2, patch antenna, and the RTC RAM backup role"
---

# NEO-6M GPS Module Guide

## Overview

The NEO-6M is an inexpensive GPS module that reports position over a 9600 baud UART. In the Aegis-Beacon it feeds coordinates into the Morse payload, so rescuers can home in on both the signal and a precise location.

## Module Facts

| Parameter | Value |
|-----------|-------|
| Chip | u-blox NEO-6M |
| Interface | UART, 9600 baud |
| ESP32 port | Serial2 (GPIO 22 RX, GPIO 12 TX) |
| Antenna | Ceramic patch, onboard |
| Time to first fix | ~30 s hot, up to 3 min cold |
| Minimum satellites | 3 |
| Fix timeout (firmware) | 10-120 s, default 30 s |

## Wiring

| GPS pin | ESP32 GPIO | Notes |
|---------|------------|-------|
| VCC | 3V3 | Most modules accept 3.3-5 V |
| GND | GND | Common ground |
| TX | GPIO 22 | GPS TX to ESP32 RX (input-only) |
| RX | GPIO 12 | ESP32 TX to GPS RX |

The NEO-6M TX line is 3.3 V logic on most breakouts. If your module is a 5 V version, level-shift the TX line before it reaches GPIO 22.

## Patch Antenna Placement

The ceramic patch needs sky view. Two rules matter:

1. Keep the patch away from the ESP32 antenna area and the radio SMA.
2. Face the patch upward, with metal below it if possible (a small ground plane improves reception).

See [GPS Antenna Placement](/wiki/gps-antenna-placement) for the full treatment.

## The Backup Battery Question

Some NEO-6M boards include a coin-cell holder for RTC backup. The Aegis-Beacon does not depend on it: the last fix is stored in the ESP32 RTC RAM instead, and survives deep sleep and power cycles. A missing backup cell on a clone module is therefore not a problem.

## When GPS Is Optional

The firmware runs perfectly with no GPS fitted:

- Set `gpsen` to false (default).
- Payloads degrade gracefully: `SOS` or `SOS DE [NAME]` only.
- Boot skips the GPS wait screen entirely.

## Related Pages

- [GPS Integration](/wiki/gps-integration)
- [RTC RAM State](/wiki/rtc-ram-state)
- [GPS Antenna Placement](/wiki/gps-antenna-placement)
- [First Use](/wiki/first-use)
