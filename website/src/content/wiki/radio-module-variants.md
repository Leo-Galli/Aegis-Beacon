---
title: "Radio Module Variants"
description: "E22-400M30S vs bare SX1262 vs LLCC68 modules, and why the E22 is recommended"
---

# Radio Module Variants

## Overview

The SX1262 transceiver ships in several form factors. The firmware is written for RadioLib's SX126x driver, so any genuine SX1262 or LLCC68 module works if the pins are wired right. The E22-400M30S is recommended for its SMA connector, TCXO and PA.

## Module Comparison

| Module | PA | SMA | TCXO | Best for |
|--------|----|-----|------|----------|
| E22-400M30S | +30 dBm | Yes | Yes | Recommended - this build |
| Bare SX1262 breakout | No | No | Depends | Learning, custom RF layouts |
| LLCC68 module | Varies | Varies | Usually | Lower-power LoRa apps |

## Why the E22-400M30S

1. **SMA connector** - a real antenna instead of a soldered wire.
2. **TCXO onboard** - +-1 ppm frequency accuracy without external parts.
3. **PA to +30 dBm** - buys back snow and foliage losses.
4. **Castellated pins** - easy hand soldering.

## If You Use a Bare SX1262

Everything in the firmware works, but you must add:

| Missing on bare module | Your job |
|------------------------|----------|
| Antenna | Solder a 17.3 cm wire to the RF pin |
| TCXO | Configure the reference or accept drift |
| PA | RadioLib is capped at +22 dBm |
| Matching network | Follow the chip reference design |

## Compatibility Notes

- LLCC68 is pin-compatible enough that RadioLib handles it as an SX126x variant.
- Do not mix in SX1276 modules: the v5.4 firmware, pinout and BUSY handling target the SX1262 family.

## Related Pages

- [E22 Radio Module Guide](/wiki/e22-radio-module-guide)
- [Antenna Length Reference](/wiki/antenna-lengths)
- [GPIO Pin Map](/wiki/gpio-pin-mapping)
- [RF & Link Budget](/wiki/rf-design-link-budget)
