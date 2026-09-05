---
title: Signal Triangulation
description: "Locating a beacon from two or three listening points: the bearings, the intersection, and the honest accuracy of the method."
---

# Signal Triangulation

With two or three listening points you can locate a beacon without walking to it: take a bearing from each point, draw the lines, and the intersection is the beacon's position.

## The method

1. **Point A**: note the direction of the strongest signal (rotate the receiver for the peak, or use the SEARCH mode peak).
2. **Move 100 - 300 m** to point B, roughly perpendicular to the first bearing.
3. **Point B**: take the second bearing.
4. **Draw**: on the map, the two bearing lines intersect at the beacon's position.

## The geometry

| Angle between bearings | Accuracy |
| --- | --- |
| Near 90 degrees | Best: a tight intersection |
| Near 0 or 180 | Useless: the lines are parallel |
| Anything over 30 degrees | Workable |

If the first two bearings are nearly parallel, move to make a wider angle rather than accepting a bad intersection.

## The error budget

| Error source | Effect |
| --- | --- |
| Bearing error of 5 degrees | Hundreds of meters at 1 km range |
| Antenna pattern asymmetry | Systematic bias in one direction |
| Multipath | A bearing pointing at a rock face, not the beacon (see [Homing Technique](homing-technique)) |

## The third point

A third bearing turns the intersection into a triangle. If the three lines do not meet, the triangle's size is the honest error estimate: a small triangle means a good fix, a large one means the bearings are unreliable.

## The honest summary

Triangulation with a handheld is a coarse tool: good for "which valley" or "which slope", not for "which tree". For meter accuracy, use the last-100-meters audio technique (see [Homing Technique](homing-technique)).

## Related pages

- [Signal Strength Mapping](signal-strength-mapping) for the RSSI method
- [Search Patterns and Procedure](search-patterns-and-procedure) for the search
- [Coordinate Plotting and Maps](coordinate-plotting-and-maps) for the drawing