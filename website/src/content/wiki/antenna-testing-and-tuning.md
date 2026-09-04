---
title: "Antenna Testing and Tuning"
description: "Verify an antenna is cut right: SWR, range checks and the 17.3 cm wire rule"
---

# Antenna Testing and Tuning

## Overview

An antenna that is the wrong length, coiled or ground-shorted still transmits - just poorly. Testing takes minutes and catches the mistakes that silently halve your range.

## The 17.3 cm Rule

A quarter-wave monopole at 433.5 MHz is 17.3 cm. If you solder a wire antenna:

1. Cut it slightly long (~18 cm).
2. Test, then trim 2-3 mm at a time.
3. Stop when the signal is strongest (measured by a receiver or SDR).

## Bench Tests Without an SWR Meter

| Test | What it tells you |
|------|-------------------|
| Continuity antenna-to-ground | Should NOT beep (a short kills the antenna) |
| Continuity SMA center-to-shield | Should NOT beep |
| Receive a distant signal | Compare before/after changes |
| SDR waterfall amplitude | Rough relative comparison |

## Range Check Method

1. Put the beacon in a fixed spot, antenna vertical.
2. Walk away with a receiver or SDR, note where the signal drops out.
3. Repeat after each antenna change.
4. Keep the change that gives the longest range.

## Common Antenna Faults

| Fault | Symptom | Fix |
|-------|---------|-----|
| Too short | Reduced range | Lengthen toward 17.3 cm |
| Too long | Slightly less efficient | Trim |
| Coiled inside case | Severe detuning | Straighten or move outside |
| Grounded to shield | Almost no radiation | Fix the short |
| Loose SMA | Intermittent signal | Tighten or re-solder |

## Related Pages

- [Antenna Length Reference](/wiki/antenna-lengths)
- [Antenna Types](/wiki/antenna-types)
- [Outdoor Testing](/wiki/outdoor-testing)
- [Propagation and Range](/wiki/propagation-and-range)
