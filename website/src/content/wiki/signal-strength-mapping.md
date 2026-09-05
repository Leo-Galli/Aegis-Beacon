---
title: Signal Strength Mapping
description: "Turning RSSI readings into a mental map of the coverage: walking a route, marking levels, and finding the shadow boundaries."
---

# Signal Strength Mapping

RSSI numbers become useful when they become a map. This page is the practice of walking a route with a receiver and building a signal map of the area.

## The method

1. Put a receiver (second beacon in RX, or SDR) on the beacon's channel.
2. Walk a grid or a route, stopping at marked points.
3. Record RSSI and position at each stop.
4. Mark the map: strong, medium, weak, nothing.

## Reading the result

The map reveals the area's radio personality:

| Pattern | Meaning |
| --- | --- |
| Smooth gradient | Open terrain, no obstacles |
| Sharp cliffs of signal | Ridge and shadow boundaries (see [Radio Shadow](radio-shadow)) |
| Patchy alternation | Multipath from buildings or rock faces (see [Propagation Modes](propagation-modes)) |
| Dead hollows | Valley traps (see [Mountain Effects on Radio](mountain-effects-radio)) |

## The contours

Every -6 dB marks half the power; on the map this looks like a contour line. Drawing the contours by hand at -80 and -100 dBm gives the usable coverage area at a glance: the searchable region for that beacon placement.

## Using the map

- Before the trip: choose the deployment point whose coverage circle covers the intended area (see [Field Deployment](field-deployment)).
- During a search: walk the strong edges first; the beacon is probably near the coverage boundary.
- After a failed reception: the map shows whether the problem is placement or hardware.

## Related pages

- [RSSI Explained](rssi-explained) for the numbers
- [Radio Shadow](radio-shadow) for the dead zones
- [Outdoor Testing](outdoor-testing) for the procedure