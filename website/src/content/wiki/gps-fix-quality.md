---
title: GPS Fix Quality
description: "What the NEO-6M reports about fix quality: the GGA fix indicator, HDOP, and how many satellites are enough."
---

# GPS Fix Quality

The GPS receiver reports more than coordinates. The NMEA sentences carry a quality indicator and a dilution-of-precision value that tell you whether the fix is trustworthy.

## The GGA fix indicator

The `$GPGGA` sentence's sixth field is the fix quality:

| Value | Meaning |
| --- | --- |
| 0 | No fix |
| 1 | GPS fix |
| 2 | DGPS fix |
| 5 | Float RTK (not used by NEO-6M) |

The firmware only accepts a fix when this field is 1 or 2. Everything else is treated as "no fix".

## HDOP

HDOP (Horizontal Dilution of Precision) is a multiplier on the position error. A perfect geometry has HDOP 1.0; a poor geometry can be 5 or worse. Practical scale:

| HDOP | Quality |
| --- | --- |
| 1 - 2 | Excellent |
| 2 - 5 | Good, normal outdoors |
| 5 - 10 | Marginal, expect tens of meters of error |
| > 10 | Position unreliable |

## Satellites in view

The same sentence reports how many satellites the fix uses. The NEO-6M typically locks with 4 and reports 8-11 in open sky. If the count stays at 3-4, the geometry is poor and the position will wander, especially in a valley.

## What the beacon does with quality

The firmware stores the fix quality and satellite count with the fix. When building the payload, it marks coordinates that came from a marginal fix (HDOP above the configured threshold) so the receiver knows the position is approximate. The OLED shows the satellite count on the GPS status line.

## Related pages

- [GPS Coordinate Accuracy](gps-coordinate-accuracy) for error sources
- [Firmware GPS Handling](firmware-gps-handling) for the parsing
- [GPS Sky View](gps-sky-view) for why geometry varies