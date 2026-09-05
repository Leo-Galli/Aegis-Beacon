---
title: SDR Beacon Build
description: "Adding an SDR dongle as a permanent monitoring receiver for the beacon: setup, antennas, and turning a phone or laptop into a beacon listener."
---

# SDR Beacon Build

An RTL-SDR dongle plus a phone or laptop turns any location into a beacon monitoring station. It is the receiver side of the beacon, and it costs about $25.

## The kit

| Part | Role |
| --- | --- |
| RTL-SDR dongle | The receiver |
| 433 MHz antenna | Matching the band |
| Phone or laptop | The software |
| USB OTG adapter | Connecting on a phone |

## Software

| Platform | App |
| --- | --- |
| Windows / Linux | SDR#, Gqrx, SDRangel |
| macOS | Gqrx, CubicSDR |
| Android | SDR Touch, RTL-SDR apps |

The [SDR Listening Guide](sdr-listening-guide) covers tuning to the beacon's channel and identifying the Morse bursts.

## Placement

- The antenna goes high and clear, like any receiver (see [Antenna Height Matters](antenna-height-matters)).
- Keep the dongle away from the phone's antenna; the dongle's tuner is easily overloaded by nearby transmitters.
- A USB extension cable between dongle and phone reduces USB noise pickup.

## The monitoring setup

1. Tune to the beacon's frequency.
2. Set the bandwidth to 12.5 kHz (the beacon's channel spacing).
3. Watch for the burst pattern on the waterfall.
4. Decode the Morse by ear or with software (see [Morse Decoder Tools](morse-decoder-tools)).

## The base-station build

Permanent monitoring (a hut, a base camp, a home): mount the antenna outdoors, run low-loss coax (see [Coax Loss Tables](coax-loss-tables)), and leave the dongle running. The beacon's repeating bursts make this a true continuous watch: any burst that stops is itself an event.

## Related pages

- [SDR Listening Guide](sdr-listening-guide) for the tuning procedure
- [Receiver Compatibility](receiver-compatibility) for what can hear the beacon
- [Spectrum Analyzers](spectrum-analyzers) for using the dongle as a test tool