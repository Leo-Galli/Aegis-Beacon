---
title: Antenna Theory Primer
description: How an antenna works, why length matters, and the quarter-wave rule that gives the 17.3 cm wire.
---

# Antenna Theory Primer

The antenna is the most overlooked part of any radio. A great radio with a bad antenna is a bad radio; this page explains why.

## What an antenna does

An antenna converts the electrical signal from the radio into an electromagnetic wave in space, and vice versa. It is a resonator: its physical length determines the frequency it is tuned to.

## The quarter-wave rule

A simple wire antenna works best when its length is a quarter of the wavelength. At 433 MHz:

```
wavelength = 300 / 433 ≈ 69.3 cm
quarter-wave = 69.3 / 4 ≈ 17.3 cm
```

That is exactly the 17.3 cm wire in the BOM. The ground plane (or the device body) acts as the other half of the antenna.

## What happens if the length is wrong

- Too short: the antenna looks capacitive, SWR rises, less power radiates.
- Too long: looks inductive, same result.
- A few millimeters off is fine at 433 MHz (the bandwidth is a few MHz); an inch off starts to hurt.

## Antenna types for the beacon

| Type | When |
|------|------|
| Quarter-wave wire (17.3 cm) | Minimum build, inside the case |
| Quarter-wave whip (SMA) | Better outside the case, more efficient |
| Half-wave dipole | Best portable option, needs a balun |
| Ground plane with radials | Fixed installation, +3 dBi |

## The ground plane

A quarter-wave antenna needs a counterpoise: the metal of the case, a ground plane, or radials. Without one, the antenna works poorly because the "other half" is missing. See the ground planes page for the details.

## Antenna placement beats power

Doubling the power gives +3 dB. Raising the antenna from waist height to shoulder height, or moving it out of the shadow of a ridge, can easily give +10-20 dB of effective gain. Placement is the cheapest range upgrade there is.

## Measuring success

Range is the honest test. The antenna testing page covers SWR and the 17.3 cm wire rule with real measurements.