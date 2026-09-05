---
title: Multi-Beacon Network
description: "Deploying several beacons as a coordinated network: channel planning, interference avoidance, and what each beacon should transmit."
---

# Multi-Beacon Network

One beacon is a signal. Several beacons in a valley are a network, with all the coordination problems that come with it. This page is the planning for a beacon network that does not step on itself.

## The core problem

Two beacons on the same channel in the same area collide: their bursts overlap, and receivers hear neither. The solution is planning, because the firmware has no collision avoidance by design (see [Firmware TX Scheduler](firmware-tx-scheduler)).

## Channel planning

| Beacons | Plan |
| --- | --- |
| 1 - 2 | Same channel is fine if intervals differ |
| 3 - 5 | Different channels, 25 kHz apart minimum |
| 5+ | A proper frequency plan (see [Frequency Planning Examples](frequency-planning-examples)) |

## Interval staggering

Even on the same channel, two beacons with different sleep intervals (10 s and 11 s) drift apart over time and rarely collide. The firmware supports per-beacon intervals precisely for this trick. Combined with repeat counts, staggering makes the collision window small.

## What each beacon transmits

| Beacon | Payload |
| --- | --- |
| Each one | Its own identity (name/callsign) |
| Each one | Its own coordinates |
| Optional | A group identifier in the message base |

The identity field is what turns a pile of beeps into a network: receivers can attribute each burst to a person. See [Config Payload Format](config-payload-format).

## Verification

Deploy the network, then walk the area with a receiver or SDR and log which bursts arrive. A network that works on paper but collides in practice is a planning failure caught at the wrong time; the [Outdoor Testing](outdoor-testing) page has the procedure.

## Related pages

- [Multi Beacon Planning](multi-beacon-planning) for the planning sheet
- [Frequency Planning Examples](frequency-planning-examples) for the channel table
- [Multi Beacon Operations](multi-beacon-operations) for field operations