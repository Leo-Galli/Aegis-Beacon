---
title: Helical Antenna
description: "The loaded helical antenna: how a coil of wire makes a short antenna resonant, and its trade-offs for the beacon."
---

# Helical Antenna

A full-size quarter wave at 433 MHz is 17 cm. A helical (coiled) antenna squeezes the same electrical length into a few centimeters of rubber-coated coil. That is why your key fob and many small transmitters work with such short antennas.

## How loading works

An antenna does not need to be physically resonant if it is loaded. Winding the wire into a coil adds inductance along its length, which slows the current wave and makes the structure electrically longer than it is physically. The coil acts as a "loading coil" distributed along the radiator.

## The trade-offs

| Property | Helical vs straight whip |
| --- | --- |
| Physical length | 3 - 8 cm vs 17 cm |
| Efficiency | Lower (coil losses, narrow band) |
| Bandwidth | Narrower |
| Durability | Better in a pocket |
| Radiation pattern | More omnidirectional, less vertical gain |

A typical small helical at 433 MHz achieves 50 - 70% efficiency versus a good whip. That is 1.5 - 3 dB of loss: noticeable on the link budget but often acceptable for a beacon that is heard at close-to-medium range.

## Choosing one for the beacon

Use a helical when the beacon must fit in a pocket or survive abuse. Use a whip when range is the priority. The beacon's case design accommodates both via the standard SMA mount, so the antenna is a field-swappable decision, not a build-time one.

## Testing a helical

Helicals are narrow band: check the SWR across the whole 433 MHz band, not just the center. A helical tuned for 433.92 MHz may show poor SWR at 433.05. The [Antenna Testing and Tuning](antenna-testing-and-tuning) page covers the procedure.

## Related pages

- [Antenna Design](antenna-design) for the general theory
- [Antenna Selection](antenna-types) for comparing options
- [SWR Explained](swr-explained) for the measurement