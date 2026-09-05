---
title: GPS UTM vs Decimal
description: "Comparing UTM and decimal degree coordinates: accuracy, readability, and which is better for the beacon payload."
---

# GPS UTM vs Decimal

UTM and decimal degrees both describe a point on the earth. They disagree about how to divide the globe, and the choice affects how the numbers behave.

## How each divides the earth

| System | Division | Units |
| --- | --- | --- |
| Decimal degrees | 360 degrees of longitude, 180 of latitude | Degrees with decimals |
| UTM | 60 zones of 6 degrees, each projected flat | Meters (easting, northing) |

UTM's projection means one unit is always one meter: distances are trivial. Degrees are angular, so a degree of longitude shrinks from 111 km at the equator to 0 at the poles.

## Readability

`45.8325 N 6.8650 E` is compact and machine-friendly, which is why the beacon payload uses it. `32T 323450 E 5077600 N` is longer but instantly plotable on a metric map, which is why rescuers prefer it.

## Precision comparison

| Format | Resolution |
| --- | --- |
| 5 decimal places | ~1 m |
| UTM (1 m units) | 1 m |
| 3 decimal places | ~110 m |

The beacon transmits 5 decimal places, so its coordinates are meter-grade either way.

## The zone trap

UTM has a hidden dependency: the zone. The same easting/northing in zone 31T and 32T are about 500 km apart. When a rescue team asks for UTM, they will also state the zone, and the position is meaningless without it. Decimal degrees have no such dependency.

## Recommendation

Transmit decimal degrees (the firmware default). Learn to convert to UTM on paper for the field, because mountain rescue teams in Europe commonly work in UTM or DDM and your decimal degrees must survive the conversion to their format (see [Coordinate Conversion](coordinate-conversion)).

## Related pages

- [GPS Coordinate Systems](gps-coordinate-systems) for the formats
- [Coordinate Conversion](coordinate-conversion) for worked conversions
- [Coordinate Plotting and Maps](coordinate-plotting-and-maps) for map practice