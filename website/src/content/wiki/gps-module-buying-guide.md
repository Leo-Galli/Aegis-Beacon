---
title: GPS Module Buying Guide
description: "What to check before buying a NEO-6M GPS module: patch antenna, backup battery, UART breakout, and clone quality."
---

# GPS Module Buying Guide

Not all NEO-6M modules are equal. This page lists the five things to verify before you order.

## 1. The patch antenna is included

The module must include the ceramic patch antenna (a small square ceramic on the board, typically 25x25 mm or 15x15 mm). Some listings sell the bare chip without it; without the patch, GPS will not work outdoors.

## 2. The UART is broken out

You need TX and RX pins on the module. Most boards break out TX, RX, VCC, GND. Some tiny modules use pads instead of pins; pads work but are harder to wire.

## 3. Backup battery (nice to have)

A small rechargeable coin cell (e.g. ML621) keeps the almanac alive when unpowered, so a later cold start is faster. The beacon also stores the last fix in RTC RAM, so the backup battery is optional. If the listing says "no backup battery", that is acceptable.

## 4. The supply voltage

NEO-6M boards accept 3.3-5 V on VCC. In this beacon it runs from 3.3 V. The TX line is 3.3 V logic, compatible with the ESP32's RX pin.

## 5. Clone quality

- Cheap clones use the genuine u-blox NEO-6M chip or the pin-compatible AT6558/A1035. The firmware talks NMEA at 9600 baud, which all of them emit.
- The most common clone problem is a mislabeled baud rate or a module that ships configured for 1 Hz updates - fine for this beacon.
- If the module never reports a fix indoors even near a window, test it outside; NEO-6M needs sky view.

## Which exact listing to pick

Any module labeled "NEO-6M GPS module with ceramic antenna UART" with visible TX/RX pins and a stated 9600 baud default works. Price range $3-6. Avoid the bare-chip listings and the ones without photos of the back of the board.