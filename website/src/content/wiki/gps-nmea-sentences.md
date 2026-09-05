---
title: GPS NMEA Sentences
description: The NMEA 0183 sentences a NEO-6M emits, what each field means, and which ones the firmware actually uses.
---

# GPS NMEA Sentences

The NEO-6M speaks NMEA 0183 at 9600 baud. Every line is a sentence: a `$` prefix, a talker ID, a sentence type, comma-separated fields, a checksum, and a line ending.

## The sentence family

A NEO-6M with default settings emits several sentence types. The most important:

| Sentence | Content |
| --- | --- |
| `GGA` | Fix data: time, position, quality, satellites, altitude |
| `RMC` | Recommended minimum: time, status, position, speed, date |
| `GSA` | DOP values and satellites used |
| `GSV` | Satellites in view with signal levels |
| `GLL` | Geographic position, lat/lon |
| `VTG` | Course and speed over ground |

## Anatomy of a GGA sentence

```
$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47
```

| Field | Value here | Meaning |
| --- | --- | --- |
| 1 | 123519 | UTC time hhmmss |
| 2 | 4807.038 | Latitude in DDM |
| 3 | N | Hemisphere |
| 4 | 01131.000 | Longitude in DDM |
| 5 | E | Hemisphere |
| 6 | 1 | Fix quality (1 = GPS fix) |
| 7 | 08 | Satellites used |
| 8 | 0.9 | HDOP |
| 9 | 545.4 | Altitude, meters |
| 10 | M | Altitude unit |

The checksum `*47` is the XOR of all bytes between `$` and `*`, written in hex.

## RMC sentence

`RMC` carries the fix status: `A` means active (valid), `V` means void (no fix). The firmware checks this flag as a second gate on top of the GGA quality field.

## What the firmware keeps

The parser extracts latitude, longitude, altitude, fix quality, satellite count and HDOP from GGA, plus the status from RMC. Everything else is ignored, which keeps the parse fast enough to run between radio events.

## Related pages

- [Firmware GPS Handling](firmware-gps-handling) for the parser
- [GPS Fix Quality](gps-fix-quality) for the quality fields
- [GPS Testing Indoors](gps-testing-indoors) for bench validation