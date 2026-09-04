---
title: "Snow and Signal Behavior"
description: "How wet and dry snow attenuate 433 MHz, with burial-depth loss numbers"
---

# Snow and Signal Behavior

## Overview

Snow is the one material a mountain beacon must transmit through. At 433 MHz the numbers are far friendlier than at 2.4 GHz, but they still matter for a buried device.

## Attenuation Numbers

| Snow type | Attenuation |
|-----------|-------------|
| Dry snow | Under 1 dB/m |
| Wet snow | ~3 dB/m |
| Slush/ice | Higher still |

Wet snow is the hard case: water absorbs RF. A spring or coastal wet-snow burial costs about 3 dB per metre.

## Burial Depth Reality

| Depth | Loss (wet snow) |
|-------|-----------------|
| 0.5 m | ~1.5 dB |
| 1 m | ~3-9 dB |
| 2 m | ~6-18 dB |

## Why Power Matters

At +17 dBm default, a 1 m burial eats a meaningful share of the link budget. At +30 dBm (EMERGENCY, E22 PA) the same burial is well inside the budget - roughly an extra 6-9 dB of margin over the default setting.

## What This Means

1. If you must rely on the beacon for snow scenarios, EMERGENCY mode's max power is the designed tool.
2. Antenna orientation matters more when buried - a vertical whip has less snow between it and the surface than a flat one.
3. Snow on a case-mounted SMA detunes the antenna; clear it.

## Related Pages

- [Propagation and Range](/wiki/propagation-and-range)
- [EMERGENCY Mode](/wiki/mode-emergency)
- [Antenna Length Reference](/wiki/antenna-lengths)
- [Winter Operations](/wiki/winter-operations)
