---
title: GPS Coordinate Systems
description: "Decimal degrees, degrees and decimal minutes, UTM: the coordinate formats the beacon can use and how to convert between them."
---

# GPS Coordinate Systems

A position can be written several ways. The beacon transmits in decimal degrees, but maps, radios and rescue teams use other formats. You should be fluent in all three.

## Decimal degrees

`45.8325 N, 6.8650 E`

One number per axis, signed or with a hemisphere letter. This is what the firmware transmits. At the precision used by the payload (5 decimal places), resolution is about 1.1 m at the equator.

## Degrees and decimal minutes (DDM)

`45 49.950 N, 6 51.900 E`

The GPS module's native format and the format used on most topo maps. To convert DDM to decimal degrees: divide the minutes by 60 and add to the degrees.

```
45 + (49.950 / 60) = 45.8325
```

## UTM

`32T 323450 E 5077600 N`

A metric grid projected onto the earth. UTM is what rescuers often use because distances are in meters and easting/northing pairs are simple to plot. The zone (32T here) matters: the same pair of numbers in another zone is a different place.

## Which one to use

| Situation | Format |
| --- | --- |
| Beacon payload | Decimal degrees (firmware default) |
| Topo map plotting | DDM or UTM |
| Reporting to a rescue center | Whatever they ask for; read back their format |
| This wiki's map tools | Decimal degrees |

## Conversion tools

The firmware's CONFIG mode includes a coordinate preview that converts the live fix between formats on the OLED. Online converters exist, but do not rely on a network in the field; practice the DDM to decimal conversion until it is automatic (see [Coordinate Conversion](coordinate-conversion)).

## Related pages

- [Coordinate Conversion](coordinate-conversion) for worked examples
- [GPS UTM vs Decimal](gps-utm-vs-decimal) for the trade-offs
- [Coordinate Plotting and Maps](coordinate-plotting-and-maps) for plotting practice