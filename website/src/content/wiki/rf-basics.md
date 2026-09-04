---
title: "RF Basics for the Beacon"
description: "dBm, RSSI, CW vs OOK, and the vocabulary used across this wiki"
---

# RF Basics for the Beacon

## Overview

A working knowledge of a few RF concepts makes every other page in this wiki clearer. This page defines the terms used throughout the documentation.

## dBm

Decibels relative to 1 milliwatt - the unit for TX power and received signal strength.

| Level | Example |
|-------|---------|
| +30 dBm | E22 PA maximum |
| +22 dBm | RadioLib cap |
| +17 dBm | Default TX power |
| -60 dBm | Strong received signal |
| -90 dBm | Weak signal near the threshold |
| -120 dBm | Sensitivity floor |

Rule of thumb: every +3 dB doubles the power. +17 to +30 dBm is a factor of ~20 in power - the reason EMERGENCY transmits at max.

## RSSI

Received Signal Strength Indicator - how strong a signal arrives at the receiver. The SEARCH mode measures it per frequency and maps it to audio pitch and OLED bars.

## CW vs OOK

| Modulation | What happens |
|------------|--------------|
| OOK | Carrier turned on/off (on-off keying) |
| CW | Continuous wave keyed on/off |

The SX1262 does not support true OOK, so the firmware keys a continuous FSK carrier with `transmitDirect()`/`standby()`. Receivers cannot tell the difference: it is Morse either way.

## ISM Band

433 MHz is an unlicensed ISM (industrial, scientific, medical) band in most of the world, with power limits that vary by region. See [Regulatory Compliance](/wiki/regulatory-compliance).

## Link Budget

TX power + antenna gains - path losses = received signal. If that beats the receiver threshold, you have a link. See [RF & Link Budget](/wiki/rf-design-link-budget).

## Related Pages

- [RF & Link Budget](/wiki/rf-design-link-budget)
- [Modulation in the Beacon](/wiki/modulation-in-the-beacon)
- [Propagation and Range](/wiki/propagation-and-range)
- [Receiver Compatibility](/wiki/receiver-compatibility)
