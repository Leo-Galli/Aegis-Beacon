---
title: "SDR Listening Guide"
description: "Hear and see the beacon with an RTL-SDR: setup, tuning and waterfall interpretation"
---

# SDR Listening Guide

## Overview

A software-defined radio is the cheapest and clearest way to verify the Aegis-Beacon is transmitting. An RTL-SDR dongle (~$15-25) turns a USB port into a receiver from 24 MHz to 1.7 GHz, and its waterfall shows the Morse keying visually even when the audio is buried in noise.

## What You Need

| Item | Notes |
|------|-------|
| RTL-SDR dongle | R820T2 tuner recommended |
| Antenna | The bundled telescopic whip works at 433 MHz |
| Software | SDR# (Windows), GQRX (Linux/macOS), or SDR++ (all) |
| Optional | A 433 MHz tuned monopole for better sensitivity |

## Software Setup

### SDR# (Windows)

1. Download and install SDR# and the RTL-SDR drivers.
2. Plug in the dongle, let Windows install the driver.
3. Open SDR#, select RTL-SDR/USB as the source.
4. Set frequency to 433.500 MHz.
5. Select AM or WFM mode.

### GQRX (Linux/macOS)

1. `apt install gqrx` or use the AppImage.
2. In Device settings choose the RTL-SDR.
3. Enter 433.500 MHz and pick AM.

## Reading the Waterfall

The carrier keying is unmistakable:

- **Carrier on** = a bright vertical line at 433.500 MHz.
- **Carrier off** = nothing.
- SOS looks like: `III___III` repeated (three short, three long, three short).

With the GPS payload enabled, decode the pattern by eye or with a Morse decoder - see [Morse Decoder Tools](/wiki/morse-decoder-tools).

## Tuning to the Beacon

1. Put the beacon in an open area, antenna vertical.
2. Start a test transmission (BEACON or EMERGENCY mode).
3. Tune the SDR to the exact configured frequency.
4. Widen the span to +-50 kHz to see drift or harmonics.

## Why AM Mode

The beacon keys an unmodulated carrier. In FM mode there is no deviation, so FM receivers stay quiet. AM or WFM demodulates the on/off keying into audible Morse.

## Related Pages

- [Receiver Compatibility](/wiki/receiver-compatibility)
- [Propagation and Range](/wiki/propagation-and-range)
- [Morse Decoder Tools](/wiki/morse-decoder-tools)
- [Outdoor Testing](/wiki/outdoor-testing)
