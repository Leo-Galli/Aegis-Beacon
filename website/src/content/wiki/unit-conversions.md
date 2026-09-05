---
title: Unit Conversions
description: "The unit conversions that come up constantly in this project: inches to mm, feet to meters, miles to km, celsius to fahrenheit."
---

# Unit Conversions

The beacon project mixes metric and imperial constantly: datasheets in inches, maps in meters, altitude in feet. This page is the conversion reference.

## Length

| Rule | Example |
| --- | --- |
| 1 inch = 25.4 mm | 3/8" = 9.5 mm |
| 1 foot = 0.3048 m | 100 ft = 30.5 m |
| 1 mile = 1.609 km | 3 mi = 4.8 km |
| 1 meter = 3.28 ft | 10 m = 33 ft |

## Antenna lengths in both

| Band | Metric | Imperial |
| --- | --- | --- |
| Quarter wave 433 MHz | 165 - 168 mm | 6.5 - 6.6 in |
| Half wave 433 MHz | 330 - 336 mm total | 13 in |
| Quarter wave PMR446 | 160 - 163 mm | 6.3 - 6.4 in |

## Temperature

| C | F | Context |
| --- | --- | --- |
| 0 | 32 | Freezing |
| -10 | 14 | Li-ion starts suffering (see [Cold Weather Batteries](cold-weather-batteries)) |
| 20 | 68 | Room |
| 30 | 86 | Hot day |

Mental shortcut: F = (C x 1.8) + 32.

## Pressure and altitude

| hPa | m (approx) | Notes |
| --- | --- | --- |
| 1013 | 0 | Standard sea level |
| 900 | ~950 m | Alpine valley |
| 780 | ~2100 m | Typical hut altitude |
| 700 | ~3100 m | High passes |

## Mass

1 kg = 2.2 lb. An 18650 cell is 45 - 50 g: a beacon with cell weighs 150 - 250 g depending on the case, worth knowing for pack planning.

## Related pages

- [Antenna Lengths](antenna-lengths) for the antenna table
- [Electrical Specifications](electrical-specifications) for the electrical units
- [Battery Capacity Math](battery-capacity-math) for the battery math