---
title: Spectrum Analyzers
description: "Cheap spectrum analysis options for 433 MHz: RTL-SDR, TinySA, and what each can and cannot verify on the beacon."
---

# Spectrum Analyzers

A spectrum analyzer shows the radio spectrum as a picture. The good news: usable analyzers for 433 MHz now cost less than a good antenna. This page compares the options for the beacon builder.

## The options

| Tool | Cost | Sees | Limits |
| --- | --- | --- | --- |
| RTL-SDR + software | $25 | 24 MHz - 1.7 GHz | RX only, no power measurement |
| TinySA | $60 - 100 | Up to 960 MHz | RX, relative levels, needs care |
| NanoVNA | $30 - 50 | 50 kHz - 900 MHz (V2/V4) | Antenna and cable measurements, not a spectrum tool per se |
| Phone SDR app | Free | With a dongle | Same as RTL-SDR |

## What to verify with one

| Check | Tool | How |
| --- | --- | --- |
| Beacon frequency | RTL-SDR / TinySA | Peak should sit within 12.5 kHz of setting |
| Harmonics | TinySA with attenuator | Second peak at 2x the frequency (867 MHz) should be far below the fundamental |
| Clean keying | RTL-SDR | Bursts should be stable, not chirped |
| Antenna match | NanoVNA | SWR minimum inside the band |
| Band occupancy | RTL-SDR | Which channels are actually busy |

## Safety note

Never connect a spectrum analyzer directly to the beacon's antenna port at full power. Use a 20 - 30 dB attenuator first. The analyzer's front end is designed for tiny signals; +22 dBm can destroy it.

## The realistic workflow

For most builders the honest minimum is: an RTL-SDR for hearing the band and checking frequency, and a NanoVNA for antennas. A TinySA replaces both for receive checks but still needs an attenuator. A $100 total covers everything this wiki asks you to verify.

## Related pages

- [SDR Listening Guide](sdr-listening-guide) for receiving the beacon
- [VSWR Measurement](vswr-measurement) for the NanoVNA procedure
- [Transmitter Testing](transmitter-testing) for the checks