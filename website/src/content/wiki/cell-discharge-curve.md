---
title: Cell Discharge Curve
description: "Reading an 18650's discharge curve: the voltage plateau, the knee, and why voltage alone is a poor fuel gauge."
---

# Cell Discharge Curve

A lithium cell's voltage does not fall in a straight line: it holds a plateau for most of its life, then falls off a cliff. Understanding the curve explains why the beacon's battery warnings work the way they do.

## The shape of the curve

A discharge from 4.2 V to 3.0 V looks like:

| Charge remaining | Voltage |
| --- | --- |
| 100% | 4.2 V |
| 90% | 4.1 V |
| 70% | 3.9 V |
| 50% | 3.7 V |
| 20% | 3.5 V |
| 5% | 3.2 V |
| 0% | 3.0 V and falling fast |

## The two lessons

1. **The plateau**: between 4.1 and 3.5 V the voltage changes slowly. A reading of 3.9 V could mean 70% or 50% depending on load, temperature and cell age.
2. **The knee**: below 3.4 V the voltage drops steeply. The beacon's warning threshold sits just above the knee because that is where the remaining time becomes minutes, not hours.

## Why voltage is a poor fuel gauge

The voltage depends on load (TX bursts pull it down a tenth of a volt), temperature (cold pulls it down more), and cell age (an old cell reads lower at the same charge). The firmware's monitor handles this with thresholds, not a percentage guess (see [Battery Monitor Details](battery-monitor-details)).

## The practical use

| Voltage (resting) | Meaning |
| --- | --- |
| 4.1 - 4.2 V | Full |
| 3.7 - 3.9 V | Good, most of the charge left |
| 3.5 - 3.6 V | Half or less; plan |
| 3.3 - 3.4 V | Low; the TX burst will sag (see [Brownout Protection](brownout-protection)) |
| below 3.2 V | End of useful life for this session |

## Related pages

- [Battery Monitor Details](battery-monitor-details) for the thresholds
- [Battery Capacity Math](battery-capacity-math) for the runtime
- [Battery Troubleshooting](battery-troubleshooting) for the measurements