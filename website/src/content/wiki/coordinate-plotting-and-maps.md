---
title: "Coordinate Plotting and Maps"
description: "Turn N4553 E01230 into a position on a map, phone app or GPS device"
---

# Coordinate Plotting and Maps

## Overview

The beacon transmits position in compact DDM form: `N4553 E01230`. This page covers converting that to a usable location and entering it into common tools.

## Decoding the Format

| Token | Meaning | Value |
|-------|---------|-------|
| `N4553` | Latitude | 45 degrees, 53 minutes North |
| `E01230` | Longitude | 12 degrees, 30 minutes East |
| `PSN` | Position follows | - |

DDM precision is about 0.1 arcminute, roughly 185 m at this latitude.

## Conversion Math

```
N4553  -> 45 deg 53.0 min N  = 45.8833 N
E01230 -> 12 deg 30.0 min E  = 12.5000 E
```

Minutes are decimal minutes, not seconds: 53 minutes = 53/60 of a degree.

## Plotting Tools

| Tool | How |
|------|-----|
| Google Maps | Search `45.8833, 12.5000` |
| OpenStreetMap | Search the same decimal pair |
| Phone map app | Paste decimal degrees into the search box |
| Garmin / handheld | Enter as decimal degrees or DDM |
| Paper map | Convert to DDM and use the graticule |

## Double-Check Rules

1. N or S first, then the number - do not drop the hemisphere.
2. Longitude has three digits before the minutes in the beacon format (`E012`), latitude has two (`N45`).
3. A transposed pair puts you on the wrong side of the map - verify the number of digits.
4. If the beacon reports `PSN UNKN`, no fix was available; use the last strong SEARCH hit direction instead.

## Related Pages

- [GPS Integration](/wiki/gps-integration)
- [Reading CW by Ear](/wiki/reading-cw-by-ear)
- [Field Deployment](/wiki/field-deployment)
- [RTC RAM State](/wiki/rtc-ram-state)
