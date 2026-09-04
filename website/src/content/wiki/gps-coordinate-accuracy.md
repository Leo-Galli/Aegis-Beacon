---
title: "GPS Coordinate Accuracy"
description: "What 0.1 arcminute DDM precision really means, and the factors that limit a fix"
---

# GPS Coordinate Accuracy

## Overview

The beacon encodes position to ~0.1 arcminute, which is about 185 m at mid latitudes. Understanding where that error comes from separates "good enough to search" from "good enough to walk to".

## The Encoding Precision

| Component | Example | Resolution |
|-----------|---------|------------|
| Latitude | `N4553` = 45 deg 53.0 min | 0.1 min ~ 185 m |
| Longitude | `E01230` = 12 deg 30.0 min | 0.1 min ~ 130 m at 45N |

The DDM truncation alone gives roughly 185 x 130 m of quantization - the payload cannot express finer positions by design.

## Error Budget

| Source | Magnitude |
|--------|-----------|
| DDM truncation | ~185 m |
| Consumer GPS accuracy | 2.5-5 m (with clear sky) |
| Stale fix (RTC cache) | Unbounded - could be hours old |
| Multipath near cliffs | 10-50 m |

The truncation dominates. The message defines a search area, not a point.

## What This Means for Rescue

| Task | Accuracy needed | Beacon sufficient? |
|------|-----------------|--------------------|
| Define search area | 500 m | Yes |
| Walk to the survivor | 20 m | No - use SEARCH audio to home in |
| Confirm identity | n/a | The name field helps |

## Improving the Outcome

1. Get a fresh fix before deploying (avoid the RTC cache).
2. Let the payload include the name so rescuers confirm identity.
3. Use SEARCH mode's audio for the final tens of metres.
4. Transmit on a known frequency plan so the base knows what to listen for.

## Related Pages

- [GPS Integration](/wiki/gps-integration)
- [Coordinate Plotting and Maps](/wiki/coordinate-plotting-and-maps)
- [RTC RAM State](/wiki/rtc-ram-state)
- [Search Patterns and Procedure](/wiki/search-patterns-and-procedure)
