---
title: Distance Estimation from RSSI
description: Turning an RSSI reading into a rough distance estimate, why it is rough, and the calibration walk that makes it honest.
---

# Distance Estimation from RSSI

"RSSI -90, so how far?" is the most asked question in beacon work, and the honest answer is: it depends. This page turns the dependence into a usable estimate.

## The free-space reference

In ideal open terrain, the path loss at 433 MHz follows the inverse-square law:

```
loss (dB) = 32.4 + 20 x log10(distance_m) + 20 x log10(433)
```

At 1 km the loss is about 85 dB. A beacon at +17 dBm then arrives at about -68 dBm. The catch: real terrain adds 10 - 40 dB on top of free space (see [Foliage Loss](foliage-loss), [Mountain Effects on Radio](mountain-effects-radio)).

## The honest table (open terrain)

| RSSI (dBm) | Distance |
| --- | --- |
| -60 | ~100 - 200 m |
| -70 | ~400 - 800 m |
| -80 | ~1 - 2 km |
| -90 | ~2 - 5 km |
| -100 | 5 km+, or terrain-limited |

## The terrain multiplier

In forest or valleys, divide the distance by 3 - 10. A -80 dBm reading in open country means kilometers; the same reading in dense forest means hundreds of meters. The terrain is the dominant term.

## The calibration walk

The honest tool is a calibration walk, once per area:

1. Walk away from the beacon in 100 m steps.
2. Record RSSI at each step (see [Signal Strength Mapping](signal-strength-mapping)).
3. Build the area's personal distance-RSSI table.

That table beats any formula for that area. The [Beacon Log Template](beacon-log-template) records the calibration.

## Related pages

- [RSSI Explained](rssi-explained) for the units
- [RF and Link Budget](rf-design-link-budget) for the math
- [Decibel Table](decibel-table) for the mental arithmetic