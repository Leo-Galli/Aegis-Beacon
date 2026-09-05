---
title: GPS Power Saving
description: The NEO-6M power modes, what the beacon's GPS power setting changes, and the battery trade-offs.
---

# GPS Power Saving

The GPS module can draw more current than the radio when left to its own devices. Power management for the GPS is a real decision, not an afterthought.

## Current draw by state

| State | NEO-6M draw |
| --- | --- |
| Acquiring (searching for satellites) | 40 - 60 mA |
| Tracking (fix locked) | 25 - 40 mA |
| Standby (module asleep) | 10 - 20 mA |
| Power off | 0 mA |

At 30 mA average, a GPS left running for 24 hours consumes roughly 0.7 Ah: about two-thirds of a typical 18650 cell. That is the whole battery budget for nothing but positioning.

## The beacon's options

| Setting | Behavior | Battery cost |
| --- | --- | --- |
| GPS off | Module unpowered, no coordinates | Zero |
| GPS on, sleep with device | Module unpowered during deep sleep, cold start per wake | Medium, short bursts |
| GPS always on | Module tracks continuously, hot starts | High, continuous |

## The honest middle ground

For a rescue beacon that must transmit a position, the recommended configuration is: GPS always powered while beaconing, so the payload always carries a current fix, and accept the battery cost. The beacon was designed for 65+ hours in this configuration (see [Power Budget and Runtimes](power-budget-and-runtimes)).

## Disabling GPS entirely

If you run without a GPS module, set the feature off. The beacon then transmits the manual coordinates you enter in CONFIG mode, which is the correct approach for a fixed or semi-fixed installation.

## Related pages

- [Power Budget and Runtimes](power-budget-and-runtimes) for the numbers
- [Firmware Deep Sleep](firmware-deep-sleep) for the sleep integration
- [GPS Warm vs Cold Start](gps-warm-vs-cold-start) for the acquisition cost