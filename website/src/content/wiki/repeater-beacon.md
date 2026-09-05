---
title: Repeater Beacon
description: "Using a second beacon as a hilltop relay: the placement rules, the frequency split, and the honest limits of the trick."
---

# Repeater Beacon

A beacon behind a ridge is often unheard. A second beacon on the ridge, listening on one channel and retransmitting on another, can bridge the gap. This page is that trick, done honestly.

## The concept

| Unit | Frequency | Role |
| --- | --- | --- |
| Field beacon | 433.500 | Transmits the distress signal |
| Relay beacon (ridge) | RX 433.500, TX 433.700 | Listens and repeats |
| Search team | 433.700 | Hears the relayed signal |

The relay sits high, hears the field beacon, and re-transmits the same Morse on a second channel. It is a manual, one-way repeater.

## Placement rules

- The relay must see the field beacon (line of sight) or the relay is pointless (see [Mountain Effects on Radio](mountain-effects-radio)).
- The relay must see the search area.
- The two antennas on the relay need separation: at least 2 m between them, or the relay desenses itself on its own transmit.

## The firmware side

The relay beacon is just a beacon in SEARCH-adjacent operation: its firmware listens on channel A and, when a burst is decoded, transmits it on channel B. This requires the frequency settings to be programmed accordingly; the standard firmware supports fixed-frequency RX with TX on a separate channel in the appropriate build.

## The honest limits

- The relay doubles the equipment and battery burden.
- The relay is one-way: it does not acknowledge, and its own failure is silent.
- A real repeater is a licensed, maintained installation; a beacon used as one is a field improvisation with a shelf life.

## When it is right

A one-afternoon field exercise with a known terrain gap, where a human can babysit the relay: this is where the trick shines. For a real incident, the [Incident Command](incident-command) system already has better tools.

## Related pages

- [Multi Beacon Operations](multi-beacon-operations) for the group context
- [Radio Shadow](radio-shadow) for why the gap exists
- [Receiver Compatibility](receiver-compatibility) for who hears what