---
title: dBm Explained
description: What dBm means, the powers the beacon uses, and how to think about -9 to +22 dBm.
---

# dBm Explained

dBm is the unit of RF power used everywhere in this project. It looks intimidating and is actually simple.

## The definition

dBm is power relative to 1 milliwatt, on a logarithmic scale:

- 0 dBm = 1 mW
- +10 dBm = 10 mW
- +20 dBm = 100 mW
- +30 dBm = 1 W
- -10 dBm = 0.1 mW

Every +10 dB is a 10x power increase. Every +3 dB is a 2x increase.

## The beacon's numbers

| Setting | Power | Use |
|---------|-------|-----|
| -9 dBm | ~0.13 mW | Minimum (test, short range) |
| +17 dBm | ~50 mW | BEACON default |
| +22 dBm | ~160 mW | EMERGENCY, and RadioLib's SX1262 max |
| +30 dBm | 1 W | E22 PA output (module capability, not used by the beacon's settings) |

## Why logarithms

Radio links involve huge dynamic ranges: a receiver might hear -50 dBm from a nearby beacon and -120 dBm from a distant one. That's a factor of 10 billion, which is unmanageable in linear units. dBm compresses it to a 70-number scale.

## RSSI vs power

RSSI (received signal strength indicator) is also in dBm but describes what the *receiver* sees, which depends on distance, antenna, and obstacles. A beacon transmitting at +17 dBm can produce RSSI anywhere from -40 dBm (a few meters) to -120 dBm (beyond range).

## Rules of thumb

- 3 dB is barely noticeable to a listener; 10 dB is clearly louder.
- Doubling the distance costs roughly 6 dB on flat ground (inverse square for the path).
- To double range in free space, you need 4x power (+6 dB).

## In the dashboard

The TX power slider ranges -9 to +22 dBm. The firmware caps it at +22 dBm regardless of what the E22's PA could do, because RadioLib's SX1262 driver is the limit and because legal power limits are usually far lower.