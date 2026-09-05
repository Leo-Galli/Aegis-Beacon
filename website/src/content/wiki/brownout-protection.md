---
title: Brownout Protection
description: "The ESP32 brownout detector: what it protects, how to read its resets, and the hardware fixes that stop the resets at the source."
---

# Brownout Protection

The ESP32 will reset itself rather than run on a voltage too low to trust. That protection is a feature: it prevents the corrupted-state failures that a beacon absolutely cannot afford.

## What the detector does

When the 3.3 V rail falls below the brownout threshold (about 2.8 V, configurable), the chip asserts reset before the flash and RAM become unreliable. The result is a clean restart instead of random corruption. The firmware can disable the detector, but the beacon never does: a beacon that resets cleanly is better than one that transmits garbage.

## The reset signature

On the serial monitor, the loop prints:

```
Brownout detector was triggered
```

followed by a reboot. The trigger almost always coincides with the TX burst, because the burst is the highest current draw of the cycle (see [Current Draw by Mode](current-draw-by-mode)).

## The hardware fixes, in order

1. **Fresh, healthy cell**: the sag test in [Battery Troubleshooting](battery-troubleshooting).
2. **Short, thick power wires**: voltage drop is I x R; the burst current makes thin wires sag.
3. **Decoupling**: 100 - 470 uF at the board's power input absorbs the burst transient.
4. **Lower TX power**: +17 dBm draws less than +22 dBm; in extreme cold this is the pragmatic fix (see [Cold Weather Batteries](cold-weather-batteries)).

## The firmware side

The battery monitor reports the rail voltage continuously. A brownout during TX means the monitor was already near the warning threshold; the [Battery Monitor Details](battery-monitor-details) page explains how to read the sequence.

## When NOT to disable it

Disabling the brownout detector to "fix" resets is trading corruption for resets. The resets are the symptom; fix the supply. If a mission requires running on a nearly-dead cell, lower the power setting instead of disabling the detector.

## Related pages

- [Boot Loop Troubleshooting](boot-loop-troubleshooting) for the loop diagnosis
- [Battery Troubleshooting](battery-troubleshooting) for the cell side
- [Power Measurement](power-measurement) for the measurements