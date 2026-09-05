---
title: Quarter Wave Antenna
description: "The quarter-wave whip: how it works, how long it is at 433 MHz, and why it needs a ground plane."
---

# Quarter Wave Antenna

The quarter-wave vertical is the default antenna for handheld UHF gear, and for good reason: it is short, simple and works well against a ground plane.

## The physics in one paragraph

A quarter-wavelength vertical radiates because the feed point sits at a current maximum and a voltage minimum, which presents a low, convenient impedance (about 36 ohms, close enough to 50 that no matching network is needed). The missing quarter wave is supplied by its image in the ground plane below.

## Length at 433 MHz

The free-space wavelength at 433 MHz is about 692 mm. A quarter wave is 173 mm. Because of end effects (the "velocity factor" of a real wire), the practical length is 0.95 to 0.97 of the ideal:

| Band | Ideal quarter wave | Practical whip |
| --- | --- | --- |
| 433.05 - 434.79 MHz | 173 mm | 165 - 168 mm |
| 446 MHz (PMR446) | 168 mm | 160 - 163 mm |

## The ground plane requirement

A quarter-wave whip without a ground plane has no reference half: the current has nowhere to return, the pattern collapses and the SWR climbs. The ground plane can be:

- The metal body of a case
- Four radial wires of the same length, spread at 45 degrees
- A metal plate under the antenna

The beacon's standard case includes a small ground plane under the antenna mount for exactly this reason.

## Tuning

Cut the whip a few millimeters long, then trim while watching the SWR (see [SWR Explained](swr-explained)). At 433 MHz, 1 mm is about 2 MHz of resonance shift, so cut conservatively.

## Related pages

- [Antenna Design](antenna-design) for the general theory
- [Antenna Lengths](antenna-lengths) for the full table
- [Ground Planes and Counterpoises](ground-planes-and-counterpoises) for the reference half