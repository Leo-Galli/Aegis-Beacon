---
title: "Propagation and Range"
description: "What 433 MHz does in the real world: line of sight, snow loss, terrain and honest range expectations"
---

# Propagation and Range

## Overview

433 MHz sits between VHF and the crowded 2.4 GHz ISM band. It behaves close to line of sight: it bends a little around terrain, penetrates snow far better than 2.4 GHz, and is absorbed by wet vegetation far less than microwave bands.

## Link Budget in One Line

```
Range = f(transmit power, antenna gain, receiver sensitivity) - losses
```

For the Aegis-Beacon the important numbers are:

| Parameter | Value |
|-----------|-------|
| TX power | +17 dBm default, +30 dBm E22 PA max |
| Antenna | ~0-2 dBi |
| Receiver sensitivity (RSSI floor) | ~-120 dBm |
| Snow penetration | ~3 dB/m in wet snow |

## Realistic Range Expectations

| Scenario | Typical range |
|----------|---------------|
| Open line of sight, +17 dBm, whip both ends | 1-5 km |
| Open line of sight, +30 dBm PA | 5-15 km |
| Valley with ridge in between | 100-500 m |
| Dense wet forest | 500 m-2 km |
| Beacon buried 1 m in snow | Reduced by ~3-9 dB |

These are order-of-magnitude figures. The only reliable way to know your link is a field test - see [Outdoor Testing](/wiki/outdoor-testing).

## Terrain Effects

| Obstacle | Effect at 433 MHz |
|----------|-------------------|
| Ridge of rock | Hard shadow behind it |
| Snow | ~3 dB/m wet snow attenuation |
| Wet leaves | A few dB per 10 m of dense foliage |
| Metal (cars, foil, structures) | Total blockage |

## Why EMERGENCY Mode Uses Max Power

A buried beacon fights both the snow loss and the reduced height of its antenna. EMERGENCY mode transmits continuously at maximum power and repeats the payload 3x per frequency, buying back several dB of the burial loss.

## Related Pages

- [RF & Link Budget](/wiki/rf-design-link-budget)
- [Antenna Length Reference](/wiki/antenna-lengths)
- [Outdoor Testing](/wiki/outdoor-testing)
- [Frequency Compatibility](/wiki/frequency-compatibility)
