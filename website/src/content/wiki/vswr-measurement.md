---
title: VSWR Measurement
description: How to measure VSWR on a 433 MHz antenna without expensive gear, and how to read the results.
---

# VSWR Measurement

Voltage Standing Wave Ratio (VSWR, or SWR) measures how well the antenna matches the 50 ohm system. It is the first number to check on any antenna.

## What SWR means

SWR is the ratio of the maximum to minimum voltage along the feed line, caused by reflected power. Perfect match: 1:1. Infinite mismatch (open or short): infinite.

| SWR | Reflected power | Judgment |
| --- | --- | --- |
| 1.0 | 0% | Ideal |
| 1.5 | 4% | Excellent, standard target |
| 2.0 | 11% | Acceptable |
| 3.0 | 25% | Poor, fix it |
| 5.0 | 44% | The radio's protection should refuse |

## Measuring without a network analyzer

The practical options at 433 MHz:

1. **NanoVNA** (about $30): the honest tool. Calibrate, sweep 400 - 470 MHz, read SWR at 433.92 MHz.
2. **SWR meter** designed for 70 cm: works inline between radio and antenna in a low-power test.
3. **Two-beacon comparison**: no absolute number, but a good antenna vs a bad one on the same receiver shows a clear RSSI gap (see [Two Beacon Bench Test](two-beacon-bench-test)).

## Procedure with a NanoVNA

1. Calibrate open, short, load.
2. Set sweep 400 - 470 MHz, 101 points.
3. Connect the antenna in free space, away from your body and metal.
4. Read the SWR minimum and its frequency. Resonance should sit inside 433 - 434 MHz.

## Common results

| Reading | Meaning |
| --- | --- |
| SWR min well below 433 MHz | Antenna too long, trim |
| SWR min well above 433 MHz | Antenna too short, extend |
| SWR flat and high everywhere | Broken coax or connector |
| SWR changes when you touch it | Bad ground plane or connection |

## Related pages

- [SWR Explained](swr-explained) for the theory
- [Antenna Testing and Tuning](antenna-testing-and-tuning) for the full procedure
- [Quarter Wave Antenna](quarter-wave-antenna) for the length math