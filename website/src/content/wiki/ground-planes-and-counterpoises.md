---
title: "Ground Planes and Counterpoises"
description: "Why a quarter-wave needs a ground plane, and how copper foil adds ~3 dBi"
---

# Ground Planes and Counterpoises

## Overview

A quarter-wave monopole is only half an antenna - the other half is its ground plane. Without one, the feed becomes part of the antenna, which makes results unpredictable.

## Quarter-Wave Theory

A 17.3 cm monopole at 433 MHz needs an electrically conductive counterpoise underneath to "reflect" the missing half-wave. The radio's own ground pour is a small one; a larger plane performs better.

## Adding a Ground Plane

| Method | Gain effect |
|--------|-------------|
| No plane (bare wire) | Baseline, unpredictable |
| Radio PCB ground only | Slightly better |
| Copper foil under the module | +3 dBi typical |
| Full metal enclosure base | Best, if antenna exits above it |

## Practical Build

1. Cut a square of copper tape or foil ~10 x 10 cm.
2. Connect it to the module GND at the feed point.
3. Mount the whip vertically above it.
4. Keep the plane flat - folding it distorts the pattern.

> [!WARNING]
> The ground plane must be at the antenna feed, not shorting the SMA. Measure continuity: SMA center to the plane should NOT beep, SMA shield to plane should.

## Related Pages

- [Antenna Length Reference](/wiki/antenna-lengths)
- [Antenna Testing and Tuning](/wiki/antenna-testing-and-tuning)
- [RF & Link Budget](/wiki/rf-design-link-budget)
- [Propagation and Range](/wiki/propagation-and-range)
