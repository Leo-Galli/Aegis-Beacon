---
title: Antenna Cable and Connectors
description: "Coaxial cable and RF connectors for the beacon: SMA vs RP-SMA, coax loss at 433 MHz, and the right cable for the job."
---

# Antenna Cable and Connectors

Between the radio module and the antenna sit a connector and (sometimes) a cable. At 433 MHz this pair is forgiving, but only if the basics are right.

## SMA and RP-SMA

- **SMA**: the pin is on the plug (male) and the socket on the jack (female).
- **RP-SMA** (reverse polarity): the pin is on the jack. RP-SMA exists to defeat amateur antenna swapping on consumer gear.

The beacon uses standard SMA. Check any store-bought antenna before buying: a surprising number of "SMA" antennas on marketplaces are RP-SMA, and they will not mate properly.

## Coax at 433 MHz

| Cable | Loss per meter at 433 MHz | Use |
| --- | --- | --- |
| RG174 | ~0.6 - 0.8 dB | Short internal jumpers only |
| RG58 | ~0.4 dB | External runs up to a few meters |
| LMR-195 / RG316 | ~0.3 - 0.4 dB | Good all-rounder |

The rule of thumb: for runs under 30 cm, any cable works. For every additional meter, prefer the lower-loss cable. A beacon with a 1 m RG174 run loses 0.6 - 0.8 dB, which is real but rarely fatal.

## Soldering the connector

The common failure is a cold joint on the center pin or a stray whisker shorting center to shield. After soldering:

1. Measure continuity center-to-center and shield-to-shield.
2. Measure that center does NOT connect to shield (multimeter beep test).
3. Give the cable one flex cycle and repeat.

## The pigtail trap

Buying an "antenna with pigtail" is convenient, but every extra connector pair costs ~0.1 - 0.2 dB and adds a failure point. Prefer the antenna that matches the mount directly.

## Related pages

- [Antenna Mounting](antenna-mounting) for the mount
- [Wire and Connectors](wire-and-connectors) for the non-RF wiring
- [Antenna Testing and Tuning](antenna-testing-and-tuning) for verifying the finished assembly