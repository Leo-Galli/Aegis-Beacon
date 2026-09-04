---
title: "Antenna Length Reference"
description: "Quarter and half wave lengths per band, snow penetration loss and field antenna rules of thumb"
---

# Antenna Length Reference

## Overview

A physically correct antenna is the cheapest performance upgrade in radio. For 433 MHz emergency work the antenna is a short piece of wire, but its length matters: cut it wrong and the beacon still transmits, but a large fraction of the power goes nowhere useful.

## Length by Frequency

| Frequency | Quarter-wave | Half-wave |
|-----------|--------------|-----------|
| 433.5 MHz | **17.3 cm** | 34.6 cm |
| 434.0 MHz | 17.3 cm | 34.5 cm |
| 868.0 MHz | 8.6 cm | 17.3 cm |
| 915.0 MHz | 8.2 cm | 16.4 cm |

> [!TIP]
> Keep a spare pre-cut 17.3 cm wire in the field kit. If the SMA whip breaks off, strip and solder the spare to the module ANT pad and the beacon is back on the air.

## Configurations and Gain

| Configuration | Gain | Notes |
|---------------|------|-------|
| Quarter-wave monopole, 17.3 cm wire | ~0 dBi | Recommended, simplest |
| E22-400M30S SMA connector + whip | ~2 dBi | Best option, comes with the module |
| Ground plane added (copper foil) | +3 dBi | Copper tape or PCB foil under the whip |

A quarter-wave wire with no ground plane is an acceptable emergency antenna; adding a small copper-foil ground plane under the module recovers several dB.

## Snow Penetration

433 MHz attenuates approximately **3 dB/m in wet snow**. Concrete numbers for a buried beacon:

| Burial depth | Loss (approx) |
|--------------|---------------|
| 0.5 m | ~1.5-4.5 dB |
| 1 m | ~3-9 dB |
| 2 m | ~6-18 dB |

At +30 dBm with the E22 PA the link budget absorbs a 1 m burial easily; at +17 dBm default power a 1 m wet-snow burial plus surface distance can approach the margin limit. This is why EMERGENCY mode transmits at maximum power.

## Field Rules of Thumb

1. Keep the antenna vertical for omni-directional coverage.
2. Keep it away from the battery pack and metal enclosure walls.
3. Do not coil the antenna inside the enclosure - it detunes and shields itself.
4. For 433 MHz, longer is not better beyond the half-wave length: stick to 17.3 cm (quarter) or 34.6 cm (half).
5. A slightly too-short antenna underperforms far less than a coiled or ground-shorted one.

## Related Pages

- [Antenna Design](/wiki/antenna-design) - electrical design and matching
- [Antenna Selection](/wiki/antenna-types) - choosing SMA whip vs wire vs ground plane
- [RF & Link Budget](/wiki/rf-design-link-budget) - how much signal actually arrives
