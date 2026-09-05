---
title: SDR Software Setup
description: "Setting up SDR software to receive the beacon: driver installation, tuning, and the waterfall reading."
---

# SDR Software Setup

An RTL-SDR dongle is hardware; the software turns it into a receiver. This page is the setup that gets a beacon on the screen in ten minutes.

## The install

| Platform | Driver | Software |
| --- | --- | --- |
| Windows | Zadig (RTL-SDR driver) | SDR#, SDRangel |
| macOS | DriverKit drivers (newer dongles) | Gqrx, CubicSDR |
| Linux | `rtl-sdr` package | Gqrx, SDRangel |

Newer "RTL-SDR V4" dongles need the current driver versions; older R820T dongles work everywhere. If the dongle shows up but the software shows no signal, the driver is the first suspect.

## The tuning

| Setting | Value for the beacon |
| --- | --- |
| Frequency | The beacon's channel (e.g. 433.100 MHz) |
| Bandwidth | 12.5 - 25 kHz |
| Mode | WFM or NFM (the beacon's FSK fits either at this deviation) |
| Gain | Manual, about 60 - 70%: auto-gain ducks weak signals |

## Reading the waterfall

The beacon's bursts appear as regular vertical bars: short for dots, longer for dashes, at the beacon's rhythm. The regularity is the fingerprint: a beacon bursts on a schedule (see [Firmware TX Scheduler](firmware-tx-scheduler)), while consumer devices transmit irregularly.

## The audio path

In FM mode the software demodulates the Morse tones as audio: the same tones the buzzer makes. Record and decode with the [Morse Decoder Tools](morse-decoder-tools), or listen directly.

## Related pages

- [SDR Listening Guide](sdr-listening-guide) for the listening procedure
- [SDR Beacon Build](sdr-beacon-build) for the monitoring station
- [Spectrum Analyzers](spectrum-analyzers) for the test use