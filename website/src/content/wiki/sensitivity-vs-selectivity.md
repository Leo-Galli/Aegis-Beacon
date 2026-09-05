---
title: Sensitivity vs Selectivity
description: "The two receiver qualities that decide what you hear: sensitivity finds weak signals, selectivity rejects strong nearby ones."
---

# Sensitivity vs Selectivity

A receiver has two separate qualities that are constantly confused. Sensitivity is how faint a signal it can hear. Selectivity is how well it rejects signals on neighboring channels. The beacon needs both, and they are set by different parts of the radio.

## Sensitivity

Sensitivity is the lowest signal power the receiver can demodulate, quoted as dBm. The SX1262 in LoRa mode reaches about -137 dBm at low data rates (see [Radio Library and SX1262](radio-library-and-sx1262)). In FSK mode the figure is worse, around -120 dBm. Sensitivity is set by the modulation, the bandwidth, and the front-end noise figure.

## Selectivity

Selectivity is how much a strong signal one channel away leaks into the channel you are listening to. It is set by the channel filter: the receiver's bandwidth and its adjacent-channel rejection. A receiver with 200 kHz bandwidth hears everything within 200 kHz, whether you wanted it or not.

## The trade-off

Narrower bandwidth improves sensitivity (less noise admitted) and selectivity, but limits the data rate and the frequency tolerance. Wider bandwidth tolerates frequency error but hears more noise. The firmware chooses a bandwidth matched to the Morse data rate, which is why the beacon's bursts decode cleanly while a nearby garage opener does not bother it.

## The practical test

| Test | What it reveals |
| --- | --- |
| Weak beacon, clear band | Sensitivity |
| Strong beacon, one channel away | Selectivity |
| Weak beacon next to strong one | Both |

The two-beacon bench test covers the first; add a second transmitter on an adjacent channel to test the second (see [Two Beacon Bench Test](two-beacon-bench-test)).

## Related pages

- [Receiver Testing](receiver-testing) for the procedures
- [Radio Library and SX1262](radio-library-and-sx1262) for the chip's numbers
- [Mode Search](mode-search) for how the beacon uses the receiver