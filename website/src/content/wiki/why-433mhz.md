---
title: Why 433 MHz
description: "The reasoning behind the beacon's band choice: license-free operation, universal receivers, propagation, and the trade-offs."
---

# Why 433 MHz

The single most important design decision in the project is the band. This page is the honest reasoning, including what 433 MHz costs.

## The case for 433 MHz

| Reason | Detail |
| --- | --- |
| License-free in Europe | CEPT harmonized ISM band (see [ISM Band Explained](ism-band-explained)) |
| Universal receivers | Scanners, SDRs, handhelds and other beacons all cover it |
| The antenna is practical | Quarter wave is 17 cm: fits a handheld device (see [Quarter Wave Antenna](quarter-wave-antenna)) |
| The hardware is cheap | The SX1262 modules for this band cost a few euros |
| Low-band advantage | Better propagation through foliage and terrain than 868 MHz |

## The trade-offs

| Cost | Why it is acceptable |
| --- | --- |
| Power limited to 10 mW ERP | The beacon is a rescue device; emergency use overrides (see [Emergency Use Legal](emergency-use-legal)) |
| Shared with consumer devices | The band is crowded in cities (see [Urban RF Environment](urban-rf-environment)) |
| Legally a gray area at higher power | Solved by the amateur license (see [Amateur License Process](amateur-license-process)) |
| Not satellite-linked | The beacon is line-of-sight; that is the honest design |

## The comparison

| Alternative | Why not |
| --- | --- |
| 868 MHz | Higher ISM power (500 mW) but worse propagation, fewer cheap modules, and US-incompatible |
| 2.4 GHz | WiFi/Bluetooth band: crowded, short range, poor in foliage |
| Satellite PLB | The [commercial comparison](commercial-plb-vs-diy) page covers it: reliable but expensive and closed |
| Amateur 70 cm | Excellent but requires a license for the unlicensed builder |

## The result

433 MHz is the only band that is license-free for receivers everywhere, cheap to build for, and usable for the beacon's mission. Every constraint it imposes is a constraint the project documents and works within, rather than hides.

## Related pages

- [Frequency Compatibility](frequency-compatibility) for the full band data
- [ISM Band Explained](ism-band-explained) for the legal frame
- [Commercial PLB vs DIY](commercial-plb-vs-diy) for the market comparison