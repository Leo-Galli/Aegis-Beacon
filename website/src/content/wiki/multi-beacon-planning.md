---
title: Multi-Beacon Frequency Planning
description: How to plan frequencies when a group carries several beacons, and how to avoid them stepping on each other.
---

# Multi-Beacon Frequency Planning

When a team carries multiple beacons, planning prevents chaos: several beacons on the same frequency produce overlapping transmissions and confused hits.

## The problem

Each beacon transmits its full payload on every configured frequency. If two beacons use the same frequency on the same schedule, their transmissions overlap, and SEARCH mode sees one continuous signal instead of two identifiable beacons.

## The solution: frequency and time separation

1. **Frequency separation**: give each beacon its own frequency, at least 25-50 kHz apart. The SX1262's receive bandwidth is narrow, so a 50 kHz gap cleanly separates signals.
2. **Time separation**: even on separate frequencies, stagger the sleep intervals (e.g. 9 s, 11 s, 13 s) so transmissions drift out of phase.
3. **Payload separation**: include the operator's name in the payload so you can tell beacons apart when frequencies do overlap.

## A three-beacon example

| Beacon | Frequency | Sleep |
|--------|-----------|-------|
| Alice | 433.500 MHz | 10 s |
| Bob | 433.550 MHz | 12 s |
| Carol | 433.600 MHz | 14 s |

## SEARCH mode behavior

A rescuer's SEARCH scan visits each frequency in sequence. With separated frequencies, each beacon is heard on its own channel, and the hit log cleanly attributes each hit.

## The collision edge case

If two beacons must share a frequency (e.g. you only have one legal channel), accept that they will overlap sometimes. Widen the sleep intervals and add a random offset if the firmware supports it; otherwise, rely on the name in the payload to tell them apart.

## Group drills

Run a two-beacon bench test with both beacons transmitting simultaneously: verify you can identify each payload by name. Do this before the field, not during.