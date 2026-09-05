---
title: Propagation Modes
description: "How 433 MHz signals travel: line of sight, diffraction, reflection, and the rare ducting events that make UHF travel far."
---

# Propagation Modes

Radio waves do not all travel the same way. At 433 MHz, the dominant modes are boring ones: direct line of sight and diffraction over obstacles. This page catalogues them so you recognize the exceptions.

## Line of sight

The direct path between two antennas is the strongest and most reliable mode. It is blocked by terrain: ridges, buildings, dense forest. Range on the direct path follows the radio-horizon math on [Antenna Height Matters](antenna-height-matters).

## Diffraction

A wave bends over a ridge or roof edge. The signal in the shadow of an obstacle is weaker but not zero; the loss depends on how deeply the obstacle intrudes into the [Fresnel Zone](fresnel-zone). A beacon behind a ridge is often audible at the ridge crest, which is why rescuers climb to the ridge before listening.

## Reflection

Buildings, rock faces and water reflect UHF. Reflections create multipath: the receiver hears the direct wave plus delayed echoes, which can add (strong signal) or cancel (deep fade). This is why the RSSI of a moving receiver wobbles even at constant distance.

## Ducting

Rarely, temperature inversions create an atmospheric duct that guides UHF over hundreds of kilometers. Ducting is why a 433 MHz signal occasionally appears hundreds of km away, and it is the reason two beacons in the same town can interfere despite legal power limits. It is unpredictable and cannot be relied on.

## What this means for the beacon

- Assume line of sight plus modest diffraction, nothing more.
- When the beacon is "too quiet", move: 20 m can clear the obstacle that blocks the path.
- Interference from far away is possible during ducting; SEARCH mode's channel scan will find a clear one.

## Related pages

- [Propagation and Range](propagation-and-range) for the summary
- [Line of Sight and Terrain](line-of-sight-terrain) for terrain effects
- [Interference Sources](interference-sources) for who else uses the band