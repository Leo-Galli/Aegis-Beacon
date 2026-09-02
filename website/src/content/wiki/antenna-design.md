---
title: "Antenna Design"
description: "Technical documentation for Antenna Design"
---

# Antenna Design

## Overview

The antenna is critical for range performance. The E22-400M30S module includes an SMA connector for easy antenna attachment.

## Quarter-Wave Antenna Lengths

| Frequency | Quarter-Wave | Half-Wave |
|-----------|--------------|-----------|
| 433.5 MHz | **17.3 cm** | 34.6 cm |
| 462 MHz | 16.2 cm | 32.4 cm |
| 868 MHz | 8.6 cm | 17.3 cm |
| 915 MHz | 8.2 cm | 16.4 cm |

> [!TIP]
> The quarter-wave length is calculated as: `L = 7155 / f(MHz)` cm

## Antenna Types

### 1. Wire Antenna (Simplest)

- **Length:** 17.3 cm for 433.5 MHz
- **Material:** Solid copper wire, 1-2mm diameter
- **Connection:** Solder to ANT pad on E22 module
- **Gain:** ~0 dBi
- **Cost:** $0.00

### 2. SMA Whip Antenna (Recommended)

- **Type:** 433 MHz SMA whip
- **Length:** ~17 cm
- **Gain:** 2-3 dBi
- **Cost:** ~$1-2
- **Source:** AliExpress, Amazon

### 3. SMA Helical Antenna

- **Type:** Spring-loaded helical
- **Length:** ~10 cm
- **Gain:** 1-2 dBi
- **Advantage:** Compact, durable
- **Cost:** ~$2-3

### 4. External Antenna (Best Performance)

- **Type:** 433 MHz Yagi or omnidirectional
- **Gain:** 5-10 dBi
- **Range:** 20+ km LOS
- **Use case:** Fixed base station

> [!WARNING]
> Never transmit without an antenna connected. This can damage the SX1262 power amplifier.

## Installation Tips

### Vertical Orientation

Mount the antenna vertically for omni-directional coverage in the horizontal plane. This provides 360-degree coverage for search and rescue operations.

### Ground Plane

Adding a ground plane (copper foil or metal plate) beneath the antenna improves gain by approximately 3 dBi. This is especially important for fixed installations.

### Keep Away From

- **Battery:** Detunes antenna, reduces range
- **Metal enclosure:** Blocks signal, causes reflections
- **Human body:** Absorbs RF energy at 433 MHz
- **Other antennas:** Causes interference

### SMA Connector

The E22-400M30S module includes a standard SMA female connector. Use quality SMA cables and connectors to minimize loss.

> [!NOTE]
> SMA connectors are rated for 500+ mating cycles. Avoid over-tightening -- hand-tight plus 1/4 turn is sufficient.

## Weatherproofing

For outdoor installations:

1. **Conformal coating** on exposed connections
2. **Heat shrink tubing** over solder joints
3. **Silicone sealant** around antenna feedthrough
4. **Drip loop** in cable to prevent water ingress

## Testing

### SWR Measurement

Use an SWR meter to verify antenna tuning:

| SWR | Rating |
|-----|--------|
| 1.0 - 1.5 | Excellent |
| 1.5 - 2.0 | Good |
| 2.0 - 3.0 | Acceptable |
| > 3.0 | Poor -- retune or replace |

### Range Test

1. Set up beacon at known location
2. Walk away with AM receiver
3. Note maximum audible distance
4. Compare with theory (should be 5-15 km LOS)
