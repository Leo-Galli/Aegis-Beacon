---
title: Radio Quick Start
description: "The radio knowledge needed before the first transmission: the band, the channel, and the first range test."
---

# Radio Quick Start

You can build the beacon without radio theory, but you cannot USE it well without the basics. This page is the minimum: the band, the channel, and the first test.

## The band in one paragraph

The beacon transmits on the 433 MHz ISM band: license-free within limits, shared with remotes and sensors, and receivable by any scanner or SDR (see [Why 433 MHz](why-433mhz) for the full reasoning).

## The first choices

| Decision | Default | See |
| --- | --- | --- |
| Channel | 433.100 MHz (or scanned) | [Scanning the Band](scanning-frequency-table) |
| Power | Legal floor | [E22 Power Levels](e22-power-levels) |
| Antenna | Quarter-wave whip | [Antenna Quick Select](antenna-quick-select) |

## The first test

1. Put a second beacon in SEARCH or RX on the channel (see [Two Beacon Bench Test](two-beacon-bench-test)).
2. Transmit one burst.
3. The receiver shows the signal and decodes it.
4. Walk away until the signal fades: that is your honest range (see [Outdoor Testing](outdoor-testing)).

## The first lesson

Range is dominated by height and terrain, not power (see [Antenna Height Matters](antenna-height-matters)). A beacon at +10 dBm on a ridge outranges a beacon at +22 dBm in a valley. Spend your effort on placement before power.

## Related pages

- [RF Basics](rf-basics) for the theory
- [Radio Communication Basics](radio-communication-basics) for the practice
- [Frequency Compatibility](frequency-compatibility) for the band