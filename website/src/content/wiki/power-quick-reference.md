---
title: Power Quick Reference
description: "The power numbers for the beacon in one place: draws, runtimes, thresholds, and the battery decisions."
---

# Power Quick Reference

The power numbers every beacon user needs, one page. The full treatment lives in [Power Budget and Runtimes](power-budget-and-runtimes) and [Battery Capacity Math](battery-capacity-math).

## The draws

| State | Current |
| --- | --- |
| Deep sleep | 0.02 - 0.15 mA |
| Idle (screen on) | 25 - 35 mA |
| GPS tracking | 30 - 45 mA |
| TX burst (+22 dBm) | 110 - 140 mA |
| WiFi (config portal) | 90 - 160 mA |

## The runtimes (2500 mAh cell)

| Configuration | Runtime |
| --- | --- |
| GPS on, 10 s interval | ~50 h |
| GPS off, manual coords | ~100 h+ |
| Sleep only (no beaconing) | Months |

## The thresholds

| Voltage (resting) | Meaning |
| --- | --- |
| 4.1 - 4.2 V | Full |
| 3.6 - 3.8 V | Storage charge (see [Battery Storage](battery-storage)) |
| 3.4 V | Warning: plan the swap |
| 3.2 V | End of session (see [Cell Discharge Curve](cell-discharge-curve)) |

## The battery rules

1. Protected cells only (see [Protected vs Unprotected](protected-vs-unprotected)).
2. Storage at 50% (see [Battery Storage](battery-storage)).
3. Warm cells in winter (see [Cold Weather Batteries](cold-weather-batteries)).

## Related pages

- [Power Budget and Runtimes](power-budget-and-runtimes) for the full table
- [Power Measurement](power-measurement) for measuring yours
- [Battery Capacity Math](battery-capacity-math) for the math