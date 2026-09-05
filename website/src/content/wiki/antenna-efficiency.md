---
title: Antenna Efficiency
description: What antenna efficiency means at 433 MHz, where the losses hide, and how to estimate whether your antenna is good enough.
---

# Antenna Efficiency

Efficiency is the fraction of the radio's output power that actually leaves the antenna as radio waves. The rest is lost as heat in the antenna structure and the ground.

## The efficiency equation

```
efficiency = radiated power / input power
```

A perfect antenna is 100% efficient. Real antennas are not. The important fact: SWR measures how well the antenna matches the radio, not how efficient it is. A perfect 1:1 SWR antenna made of rusty wire is still lossy.

## Where the losses hide

| Loss source | Typical cost |
| --- | --- |
| Small helical coil | 1.5 - 3 dB |
| Short whip without ground plane | 1 - 2 dB |
| Poor solder joint at the base | 0.5 - 1 dB |
| Nearby metal detuning | 0.5 - 3 dB, variable |
| Wet, corroded connector | 0.5 - 2 dB, grows over time |

## Ground losses

A quarter-wave whip over a poor ground plane loses efficiency because the ground absorbs the return currents. Four radials of the right length reduce this substantially; a single short stub does not. The beacon case's small integrated ground plane is adequate for field use.

## Estimating your efficiency

Without a test range you cannot measure efficiency directly, but you can infer it:

1. Measure the SWR: below 1.5:1 means the match is fine (see [SWR Explained](swr-explained)).
2. Do the two-beacon range test and compare RSSI against a known-good antenna.
3. Repeat with the suspect antenna; the RSSI delta is the efficiency difference.

## The 3 dB perspective

Losing 3 dB halves the effective power: a 20 dBm signal becomes 17 dBm equivalent. In range terms that is roughly a 30% reduction in distance for the same link quality. Worth fixing when easy (solder, ground plane, cable), not worth over-engineering when the antenna is already reasonable.

## Related pages

- [Antenna Testing and Tuning](antenna-testing-and-tuning) for measurements
- [RF and Link Budget](rf-design-link-budget) for the full chain
- [Ground Planes and Counterpoises](ground-planes-and-counterpoises) for the reference half