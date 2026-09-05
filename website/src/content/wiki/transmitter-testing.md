---
title: Transmitter Testing
description: "Verifying the beacon actually transmits what it should: frequency, power, keying, and the dummy load procedure."
---

# Transmitter Testing

A transmitter that does not transmit is the worst failure a beacon can have, because it looks fine on the bench. This page is the verification sequence that catches it.

## The order of checks

1. Frequency accuracy
2. Power output
3. Keying behavior (clean Morse)
4. Harmonics and spurious (with the right gear)

## Frequency check without a counter

The SEARCH mode of a second beacon is a crude but effective frequency meter: sweep the band and see where the peak lands. A beacon transmitting at 433.92 MHz should peak within one channel step (12.5 kHz) of 433.92. A peak 100 kHz off indicates a calibration problem.

## Power check with a dummy load

A dummy load (see [Dummy Load and Bench Testing](dummy-load-and-bench-testing)) absorbs the full power. With the load in place:

1. Measure the current draw during TX; +22 dBm should draw 110 - 140 mA extra.
2. If a power meter is available, verify the level reads within 1 - 2 dB of the setting.

## Keying behavior

Morse keying must be clean: no clicks, no tails, consistent timing. Two ways to verify:

- **Audio path**: the [Audio Jack](audio-jack-wiring) feeds the keyed tone to a recorder; decode it with an app or by ear (see [Reading CW by Ear](reading-cw-by-ear)).
- **Receiver**: a second beacon in RX shows the bursts on schedule and decodes them.

## The 10-second listen

The most valuable test costs nothing: put the second beacon in fixed-frequency RX on the channel, and listen to 10 full bursts. Timing jitter, missing repeats, and drift all show up in the rhythm of what you hear.

## Related pages

- [Dummy Load and Bench Testing](dummy-load-and-bench-testing) for the load
- [Receiver Testing](receiver-testing) for the paired test
- [Two Beacon Bench Test](two-beacon-bench-test) for the full procedure