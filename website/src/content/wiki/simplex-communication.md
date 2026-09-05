---
title: Simplex Communication
description: "Simplex operation, the mode the beacon uses: one frequency, one direction at a time, and the rules that keep simplex usable."
---

# Simplex Communication

The beacon is a simplex device: it transmits on a frequency and receivers listen on the same one, never at the same time. This page is what simplex means and how to operate it.

## Simplex versus duplex

| Mode | Frequencies | Direction |
| --- | --- | --- |
| Simplex | One | One way at a time |
| Duplex (repeater) | Two (input and output) | Simultaneous |

The beacon's design is pure simplex: it transmits its bursts on its channel, and any receiver on that channel hears them (see [Receiver Compatibility](receiver-compatibility)).

## The simplex rules

1. **One at a time**: in simplex, only one station transmits at a moment. The beacon respects this by bursting briefly and waiting (see [Firmware TX Scheduler](firmware-tx-scheduler)).
2. **Listen before you speak**: the universal habit (see [Radio Etiquette Basics](radio-etiquette-basics)).
3. **The tail**: wait a second after the other station stops; radio squelch tails are real.

## The beacon's simplex behavior

The beacon never listens and transmits simultaneously, and it has no collision avoidance: it transmits on schedule, briefly, and repeats. In a shared simplex channel this is the correct strategy for a device that cannot hear (the one-way design documented in [Rescue Communication Basics](rescue-communication-basics)).

## The group simplex net

For a group, simplex on one channel is the simplest coordination: everyone hears everything, and the [Group Communication Plan](group-communication-plan) staggers the beacons so the bursts do not collide.

## Related pages

- [Radio Etiquette Basics](radio-etiquette-basics) for the habits
- [Two Way Build](two-way-build) for the voice pairing
- [Receiver Compatibility](receiver-compatibility) for who hears