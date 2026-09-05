---
title: Frequency Table Reference
description: "The reference frequency tables for the beacon: the 433 MHz band plan, PMR446 channels, and the regional rescue channels."
---

# Frequency Table Reference

The numbers this project keeps coming back to, in one place. The full regulatory context lives on [Frequency Compatibility](frequency-compatibility); this page is the lookup table.

## The 433 MHz ISM band

| Segment | Use |
| --- | --- |
| 433.050 - 434.790 MHz | ISM, license-free within limits (see [ISM Band Explained](ism-band-explained)) |
| 433.920 MHz | The busiest single frequency: car remotes, sensors |
| 434.000 - 434.790 MHz | Upper ISM segment, often quieter |

## Suggested beacon channels (433 MHz)

| Channel | Frequency | Notes |
| --- | --- | --- |
| 1 | 433.075 | Lower edge, away from 433.920 |
| 2 | 433.100 | |
| 3 | 433.125 | |
| 4 | 433.150 | |
| 5 | 433.175 | |
| 6 | 433.200 | |

Channels follow 25 kHz spacing per the harmonized plan. The [Frequency Planning Examples](frequency-planning-examples) page works through real allocations.

## PMR446 channels

| Channel | Frequency (MHz) |
| --- | --- |
| 1 | 446.00625 |
| 2 | 446.01875 |
| 3 | 446.03125 |
| ... | 12.5 kHz steps |
| 16 | 446.19375 |

PMR446 is receive-only territory for the beacon (see [PMR446 Deep Dive](pmr446-deep-dive)).

## Emergency and rescue channels

The regional mountain rescue channels are listed on [Frequency Compatibility](frequency-compatibility) with their legal notes; this wiki does not republish frequencies that are country-specific allocations without their context.

## Related pages

- [Frequency Compatibility](frequency-compatibility) for the full tables
- [Frequency Planning Examples](frequency-planning-examples) for worked plans
- [Scanning the Band](scanning-frequency-table) for the SEARCH mode channels