---
title: Battery Monitor Calibration
description: "Calibrating the firmware's battery voltage readings: the ADC divider, the reference, and the two-point calibration procedure."
---

# Battery Monitor Calibration

The battery monitor reads the cell voltage through a divider into the ESP32's ADC. ADC readings are approximate by nature; calibration turns "roughly" into "trustworthy".

## The measurement path

Cell voltage -> divider (see [Ohm's Law](ohm-law) for the math) -> ESP32 ADC -> firmware scaling -> display.

## The error sources

| Source | Effect |
| --- | --- |
| Resistor tolerance (5% parts) | Up to 10% voltage error |
| ADC reference drift | A few percent |
| ADC nonlinearity | Worst at the rails |
| Wiring resistance | Small but real under load |

## The two-point calibration

1. **High point**: charge the cell fully, rest 30 minutes, measure the actual cell voltage with a multimeter.
2. **Low point**: run the beacon until the monitor reads near the warning threshold, measure again.
3. Enter both pairs (measured voltage, displayed voltage) into the calibration settings.

The firmware interpolates between the two points. With good multimeter measurements, the result is accurate to about 2%.

## Without calibration

Uncalibrated, the monitor is still useful as a trend: a falling reading over hours is a falling cell, whatever the absolute error. The warning threshold should be set conservatively (see [Battery Monitor Details](battery-monitor-details)) so the uncalibrated error does not matter at the decision point.

## The winter note

In the cold the cell voltage reads differently (see [Cold Weather Batteries](cold-weather-batteries)). Calibrate at the temperature you will use the beacon: a calibration done at 20 C overstates the charge at -10 C.

## Related pages

- [Battery Monitor Details](battery-monitor-details) for the firmware side
- [Ohm's Law](ohm-law) for the divider math
- [Battery Troubleshooting](battery-troubleshooting) for the fault side