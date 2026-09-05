---
title: ESP32 ADC Guide
description: "Using the ESP32's ADC for the battery monitor: the pins, the reference, the nonlinearity, and the calibration the firmware applies."
---

# ESP32 ADC Guide

The ESP32's ADC is where the battery voltage enters the firmware. It is also the most calibration-sensitive peripheral on the chip. This page is the practical guide.

## The usable pins

The ESP32's ADC is available on specific pins (GPIO 32-39 for ADC1 on most boards). The firmware uses one of these for the battery divider. Input-only pins (GPIO 34-39) work for the ADC but have no pull-ups (see [ESP32 Input Only Pins](esp32-input-only-pins)).

## The reference and the range

The ADC converts 0 - 3.3 V (with the default reference). The battery reaches 4.2 V, which is why the divider halves it first (see [Ohm's Law](ohm-law) and [Battery Monitor Calibration](battery-monitor-calibration)).

## The nonlinearity

The ESP32's ADC is famously nonlinear, especially near the rails. The consequences:

- A reading of 3.3 V at the pin might represent a true 3.1 or 3.4 V.
- The firmware applies calibration curves for the specific chip revision.
- The two-point calibration (see [Battery Monitor Calibration](battery-monitor-calibration)) is the field fix.

## The sampling practices

| Practice | Why |
| --- | --- |
| Average 8 - 16 samples | Kills noise |
| Read when the radio is idle | The TX burst pulls the rail and skews the reading |
| Read with a settled divider | The divider's own current settles in microseconds |

## The input impedance trap

The ADC pin's input impedance is not infinite: a high-value divider (1 M ohm) interacts with the sample-and-hold and reads low. The firmware's divider values (100k range) are chosen to avoid this (see [Battery Monitor Details](battery-monitor-details)).

## Related pages

- [Battery Monitor Calibration](battery-monitor-calibration) for the procedure
- [Battery Monitor Details](battery-monitor-details) for the firmware
- [ESP32 Input Only Pins](esp32-input-only-pins) for the pin rules