---
title: Two-Way Build
description: "Turning the beacon into a two-way radio: pairing with PMR446 or amateur handhelds, and the architecture that keeps it simple."
---

# Two-Way Build

The beacon is one-way by design: it transmits, and you listen elsewhere. The two-way build pairs it with a handheld so the same kit can both signal and converse.

## The pairing options

| Handheld | Role | Notes |
| --- | --- | --- |
| PMR446 | Voice on 446 MHz | License-free in Europe, integrated antenna |
| Amateur handheld (70 cm) | Voice on the beacon's band | Needs a license |
| Second beacon | Morse two-way | Both sides beacon |

## The architecture

Keep the beacon as the automatic transmitter and the handheld as the voice channel. They do not need to share frequencies: the team listens to the beacon's channel with one radio while talking on the handheld channel. This separation is deliberate: the beacon never stops beaconing, and the voice channel never gets clogged by the beacon's bursts.

## The audio bridge

The simplest bridge: plug the beacon's audio jack into the handheld's mic input, and the handheld re-transmits the beacon's Morse on the voice channel. This is the trick that turns a PMR446 radio into a beacon receiver for a group (see [Audio Jack Wiring](audio-jack-wiring) for levels).

## Why not a full duplex radio

A true two-way data radio needs collision handling, acknowledgments and a protocol. The beacon deliberately does none of this (see [Firmware TX Scheduler](firmware-tx-scheduler)); the Morse bursts are short enough that the loss rate stays low, and the repeats cover the losses.

## The group build

For a group: each person carries a beacon plus a cheap PMR446 handheld. The beacons form the automatic distress net; the handhelds form the voice net. This is the configuration the [Multi Beacon Planning](multi-beacon-planning) page assumes.

## Related pages

- [PMR446 Deep Dive](pmr446-deep-dive) for the handheld band
- [Multi Beacon Operations](multi-beacon-operations) for the group net
- [Receiver Compatibility](receiver-compatibility) for what hears the beacon