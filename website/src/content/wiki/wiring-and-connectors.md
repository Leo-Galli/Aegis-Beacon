---
title: "Wiring and Connectors"
description: "Wire gauge, connectors and routing for the whole build: power, SPI, audio and buttons"
---

# Wiring and Connectors

## Overview

Good wiring is the difference between a beacon that works for years and one that fails on a cold mountain. This page covers wire choices, connector types and routing rules for the Aegis-Beacon.

## Wire Gauge by Function

| Circuit | Gauge | Why |
|---------|-------|-----|
| Battery + TP4056 | 20-22 AWG | Carries up to 1 A charge current |
| 3.3 V rail | 24-26 AWG | A few hundred mA |
| SPI / buttons / OLED | 26-30 AWG | Signal only |
| Audio | 26 AWG shielded | Prevents buzz pickup |
| Antenna feed | Coaxial | Keep short; do not substitute stranded wire |

## Connector Types

| Connector | Use | Notes |
|-----------|-----|-------|
| DuPont headers | Bench prototypes | Fine for breadboard, poor for field |
| JST-XH | Battery and modules | Locking, common on hobby cells |
| Pin headers + screw terminals | Power | Easy rework |
| SMA | Antenna | Use the E22's onboard SMA |
| 3.5 mm TRRS jack | Audio | Panel-mount with nut |

> [!TIP]
> For a field unit, solder everything directly and use a JST connector only at the battery. Every extra connector is a possible cold joint or corrosion point.

## Routing Rules

1. Keep the antenna feed away from the battery and the audio path.
2. Run power and signal wires on opposite sides where possible.
3. Twist the GPS UART pair (RX/TX) together to reject noise.
4. Keep SPI leads under ~10 cm to avoid bus timing issues.
5. Add a drop of hot glue or cable tie at every strain point.

## Audio Shielding

The DAC output is low level. If the audio wire runs past the radio, shield it:

- Use a two-core shielded cable.
- Connect the shield at the jack ground end only.
- Keep the 100 ohm series resistor and 10 uF cap near the ESP32.

## Related Pages

- [Assembly Guide](/wiki/assembly-guide)
- [Soldering Basics](/wiki/soldering-basics)
- [Circuit Description](/wiki/circuit-description)
- [GPIO Pin Map](/wiki/gpio-pin-mapping)
