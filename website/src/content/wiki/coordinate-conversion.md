---
title: Coordinate Conversion
description: Worked conversions between decimal degrees, DDM and UTM, with the arithmetic you can do in your head in the field.
---

# Coordinate Conversion

Rescue teams ask for positions in different formats, and your beacon transmits in decimal degrees. This page is the arithmetic, worked out, so the conversion is not a mystery when it matters.

## DDM to decimal degrees

The GPS module emits degrees, decimal minutes: `45 49.950 N`. To convert: divide the minutes by 60 and add.

```
45 + (49.950 / 60) = 45 + 0.8325 = 45.8325
```

Reverse: take the decimals, multiply by 60.

```
0.8325 x 60 = 49.950  ->  45 49.950
```

## Decimal degrees to DDM, by hand

1. Keep the whole degrees.
2. Multiply the decimal part by 60.
3. Keep the whole minutes, multiply the rest by 60 for seconds (rarely needed).

```
45.8325 -> 45 degrees
0.8325 x 60 = 49.95 -> 49 minutes
0.95 x 60 = 57 seconds
=> 45 49' 57"
```

## To UTM

UTM conversion needs tables or math beyond head arithmetic: it involves the ellipsoid geometry of the zone. In the field, do not attempt it mentally; use the pre-plotted map or a written table for your region. What you can do by hand: read your UTM position off a UTM-gridded topo map once you know your decimal coordinates, because the grid is printed on the map.

## The accuracy rule

| Decimals | Resolution |
| --- | --- |
| 5 decimals | ~1 m (beacon payload) |
| 4 decimals | ~11 m |
| 3 decimals | ~110 m |

When reporting a position, state the format you used. A coordinate without its format is a number, not a position.

## Practice example

Convert `6.8650 E` to DDM:

```
0.8650 x 60 = 51.90 -> 6 51.90 E
```

And `6 51.90 E` back:

```
6 + (51.90 / 60) = 6 + 0.865 = 6.8650
```

## Related pages

- [GPS Coordinate Systems](gps-coordinate-systems) for the formats
- [Coordinate Plotting and Maps](coordinate-plotting-and-maps) for the map side
- [Position Reporting](position-reporting) for reporting protocol