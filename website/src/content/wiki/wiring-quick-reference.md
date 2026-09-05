---
title: Wiring Quick Reference
description: "The wiring table for the whole build in one place: every connection, every pin, every colour."
---

# Wiring Quick Reference

The complete wiring table for the standard build, one page. The authoritative detail lives in [GPIO Pin Map](gpio-pin-mapping) and [Circuit Description](circuit-description); this page is the build-in-one-glance reference.

## The connections

| From | To | Wire | Colour |
| --- | --- | --- | --- |
| Cell + | Charger BAT+ | 22 AWG | Red |
| Cell - | Charger BAT- | 22 AWG | Black |
| Charger OUT+ | ESP32 5V/VIN | 24 AWG | Red |
| ESP32 3V3 | Everything | 24 AWG | Orange |
| Ground | Everything | 22 - 24 AWG | Black |
| ESP32 TX | GPS RX | 28 AWG | White |
| ESP32 RX | GPS TX | 28 AWG | Yellow |
| ESP32 SDA | OLED SDA | 28 AWG | Green |
| ESP32 SCL | OLED SCL | 28 AWG | Blue |
| ESP32 MOSI/MISO/SCK/NSS | E22 module | 28 AWG | Various |
| Buttons | ESP32 GPIO | 28 AWG | Various |

## The rules

1. Red = cell positive, black = ground, orange = 3.3 V. Always.
2. Signal wires can be any colour, but the same colour means the same net across the whole build.
3. GPS TX goes to ESP32 RX, and GPS RX to ESP32 TX: the cross is the classic mistake.

## The checks

Before power: continuity power-to-ground shows NO short; every power rail reaches its destinations; the radio's NSS is unique to the radio (see [Schematic Reading](schematic-reading)).

## Related pages

- [GPIO Pin Map](gpio-pin-mapping) for the exact pins
- [Wiring and Connectors](wiring-and-connectors) for the details
- [Wire Gauge Guide](wire-gauge-guide) for the gauges