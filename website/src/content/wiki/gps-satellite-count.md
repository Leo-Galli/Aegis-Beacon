---
title: GPS Satellite Count
description: "Reading the satellite count as a diagnostic: what the numbers mean, how many is enough, and the fix that follows a low count."
---

# GPS Satellite Count

The satellite count is the fastest GPS diagnostic you have. It tells you more than "fix or no fix": it tells you why.

## Reading the number

The OLED GPS line shows the count of satellites used by the current fix (in view vs used is a separate question; see [GPS Fix Quality](gps-fix-quality)).

| Count | Meaning |
| --- | --- |
| 0 | No satellites seen: antenna, power or wiring problem |
| 1 - 3 | Signal reaching the module but no fix possible |
| 4 - 6 | Marginal fix: geometry poor, position wanders |
| 7 - 10 | Normal open-sky tracking |
| 11+ | Excellent sky view, best accuracy |

## The diagnosis ladder

| Symptom | Check |
| --- | --- |
| Count stays 0 indoors | Expected; go outside (see [GPS Testing Indoors](gps-testing-indoors)) |
| Count 0 outdoors | Antenna blocked (see [GPS Sky View](gps-sky-view)), module unpowered, or UART wiring |
| Count climbs but never fixes | Sky view poor, or the module lost its almanac |
| Count drops after a fix | Antenna moving into shadow, or interference |

## The climb test

The classic field diagnostic: walk 20 m uphill or away from the obstacle. If the count climbs with elevation, the problem was sky view. If it stays at zero, the problem is electrical.

## Related pages

- [GPS Fix Quality](gps-fix-quality) for the quality fields
- [GPS Sky View](gps-sky-view) for the antenna side
- [GPS Troubleshooting](gps-troubleshooting) for the fault list