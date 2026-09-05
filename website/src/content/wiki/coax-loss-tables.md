---
title: Coax Loss Tables
description: Reference tables for coaxial cable loss at UHF, and how to budget the losses in the beacon's link.
---

# Coax Loss Tables

Loss tables answer one question: how much signal disappears between the radio and the antenna. At 433 MHz the answer is "not much, unless the cable is long or bad".

## Loss per 10 meters at 433 MHz

| Cable | Loss / 10 m | Notes |
| --- | --- | --- |
| RG174 | 6 - 8 dB | Thin, flexible, lossy |
| RG58 | 3.5 - 4.5 dB | Standard thin coax |
| RG213 | 2 - 2.5 dB | Thick, stiff, low loss |
| LMR-400 | 1.5 - 2 dB | Professional grade |
| LMR-195 | 3 - 4 dB | RG58-class but better shield |

## What the numbers mean for a beacon

The beacon's internal run is typically 10 - 25 cm: the loss there is 0.1 - 0.2 dB, negligible. The table only starts to matter when you:

- Mount the antenna away from the case (extended mast)
- Use a directional antenna on a pole
- Test from inside a vehicle or shelter with a long feed line

## Doubling is the trap

Every 3 dB lost is half the power: +22 dBm into a cable with 3 dB loss becomes +19 dBm at the antenna. A 5 dB loss is nearly two-thirds gone. This is why the recommendation for anything beyond 1 m is a low-loss cable, not RG174.

## Measuring, not trusting

Cable loss from a table is an estimate. A damaged cable (kinked, crushed, wet connector) can add many dB. Test the finished run with the two-beacon bench procedure ([Two Beacon Bench Test](two-beacon-bench-test)) and compare the RSSI to expectations.

## Related pages

- [Antenna Cable and Connectors](antenna-cable-connectors) for the choice
- [RF and Link Budget](rf-design-link-budget) for where loss fits
- [Antenna Testing and Tuning](antenna-testing-and-tuning) for the test procedure