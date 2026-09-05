---
title: Foliage Loss
description: How trees and vegetation attenuate 433 MHz signals, with the numbers you can expect in forest, and what to do about it.
---

# Foliage Loss

Trees are the quiet killer of UHF range. A beacon in a forest sounds weak not because it is broken but because every leaf is a small absorber and scatterer of radio waves.

## The numbers

At 433 MHz, single-tree attenuation is modest, but the forest is not a single tree:

| Environment | Extra loss vs open field |
| --- | --- |
| Single tree in the path | 3 - 6 dB |
| Sparse woodland (10 - 20 m spacing) | 10 - 20 dB |
| Dense forest, summer | 20 - 30 dB |
| Dense forest, winter (bare) | 8 - 15 dB |

Summer foliage roughly doubles the loss of winter: leaves are mostly water, and water absorbs microwaves.

## The physics

Each leaf scatters and absorbs a little signal. Over a path through many trees, the losses add. Because the loss is cumulative, the first 50 m of forest hurts more than the second 50 m of open field helps. Foliage also depolarizes the signal, which costs another few dB at the receiver.

## What to do

- **Get above the canopy**: the fastest fix. A beacon on a ridge or a pole above the trees gains 15 - 25 dB over one at ground level.
- **Shorten the path through the trees**: follow game trails and clearings rather than a straight line.
- **Move 20 m**: a small lateral shift can change the foliage depth dramatically.
- **Raise the receiver** too; the same loss applies on the search side.

## The honest expectation

In dense summer forest, plan for beacon range in hundreds of meters, not kilometers. This is not a defect; it is the physics of the environment. The [Winter Operations](winter-operations) page notes that winter recovers much of the loss.

## Related pages

- [Propagation and Range](propagation-and-range) for the summary
- [Antenna Height Matters](antenna-height-matters) for the height lever
- [Line of Sight and Terrain](line-of-sight-terrain) for terrain interplay