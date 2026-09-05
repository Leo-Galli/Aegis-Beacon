---
title: SWR Explained
description: What standing wave ratio is, why 1:1 is the goal, and how to check the beacon's antenna without expensive gear.
---

# SWR Explained

SWR (standing wave ratio) measures how well the antenna matches the radio's 50 ohm output. A bad match wastes power and can stress the PA.

## The concept

The radio expects a 50 ohm antenna. If the antenna impedance differs, some power reflects back. SWR describes the ratio of forward to reflected power:

- **1:1** = perfect match, all power radiated.
- **1.5:1** = acceptable, about 4% reflected.
- **2:1** = poor, about 11% reflected, range starts to suffer.
- **3:1+** = bad, the PA works hard and little power radiates.

## Why the beacon's antenna matters

The E22 has a 50 ohm SMA output. The 17.3 cm wire, correctly cut and fed against a ground plane, is close to 50 ohms at 433 MHz. A wire of the wrong length, or one folded against the battery, can push SWR to 2:1+.

## Measuring SWR

- **SWR meter / VNA**: the proper tool, if you have access to one.
- **The two-antenna test**: without an SWR meter, measure range with two identical setups; a big difference between antennas indicates one is badly matched.
- **The dummy load check**: with a 50 ohm dummy load, the radio should behave identically to a good antenna. If it performs worse with a "good" antenna than with the load, the antenna is the problem.

## Common causes of high SWR

1. Antenna length wrong (cut new, longer wire and trim).
2. Antenna touching the battery or the OLED (detuning).
3. Missing ground plane (the counterpoise is half the antenna).
4. Bad SMA joint or a broken center pin.

## The honest guidance

You do not need a VNA for this project. Cut the 17.3 cm wire, give it a ground plane, keep it away from metal, and verify range with the two-beacon test. If range is unexpectedly poor, suspect the antenna before suspecting the radio.