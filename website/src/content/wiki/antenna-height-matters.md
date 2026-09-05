---
title: Antenna Height Matters
description: "Why antenna height dominates range at UHF: line of sight, the Fresnel zone, and the difference between waist and shoulder height."
---

# Antenna Height Matters

At 433 MHz, the single biggest lever on range is not power and not antenna gain. It is height. This page explains the physics and the practical numbers.

## Line of sight at UHF

UHF is essentially line of sight. The radio horizon for two antennas of heights h1 and h2 (in meters) is approximately:

```
range (km) = 4.12 x (sqrt(h1) + sqrt(h2))
```

Two beacons at 1.5 m (shoulder height) get a radio horizon of about 10 km. The same beacons on the ground get about 0.3 km. That is a 30x difference from geometry alone.

## The Fresnel zone

Even with line of sight, the signal needs a clear ellipsoid between the antennas (the Fresnel zone, see [Fresnel Zone](fresnel-zone)). At 433 MHz over 1 km, the zone's mid-point radius is about 5 m. A hilltop, a ridge or even dense forest intruding into that zone attenuates the signal far more than the cable ever could.

## Practical numbers

| Antenna position | Effective range (open terrain) |
| --- | --- |
| In a pocket | 200 - 500 m |
| On a belt | 1 - 3 km |
| On a backpack strap | 2 - 5 km |
| On a trekking pole extended | 5 - 10 km |
| On a ridge line | 10 - 20 km |

## The beacon's design decision

The beacon is worn or deployed, so the firmware and case are designed around antenna-up operation. In SEARCH mode you are told to hold the beacon high. This is not superstition: raising the antenna from waist to shoulder adds roughly 40% to the radio horizon.

## If you are the search side

The receiver matters as much as the beacon. A handheld held at chest height hears a beacon on a slope far better than one lying on the snow. Raise the receiver, get above the obstacle, and let the beacon's SEARCH mode guide you ([Mode Search](mode-search)).

## Related pages

- [Line of Sight and Terrain](line-of-sight-terrain) for the terrain effects
- [Fresnel Zone](fresnel-zone) for the clearance rule
- [Propagation and Range](propagation-and-range) for the full picture