---
title: Group Communication Plan
description: "The communication plan for a group carrying beacons: channels, schedules, call signs, and the coordination that keeps a group findable."
---

# Group Communication Plan

A group of beacons is only a network if someone wrote the plan. This page is the group communication plan: the written agreement that turns several devices into a coordinated system.

## The plan contents

| Section | What it says |
| --- | --- |
| Channels | Each beacon's frequency (see [Multi Beacon Network](multi-beacon-network)) |
| Schedules | Each beacon's interval, staggered |
| Identities | Who is who in the payloads (see [Config Payload Format](config-payload-format)) |
| Voice fallback | PMR446 channels for conversation (see [Two Way Build](two-way-build)) |
| Check-in points | Where the group verifies reception |

## The check-in ritual

At each waypoint, the group verifies: every beacon decodes every other beacon. This takes one minute with two receivers and catches channel collisions, dead batteries and broken antennas at the moment they happen, not at the incident.

## The staggered schedule

Two beacons on the same channel with the same 10 s interval collide forever. The plan assigns different intervals (10, 11, 13 s) so the bursts drift apart (see [Multi Beacon Network](multi-beacon-network)). This single line in the plan prevents the most common group failure.

## The group identity

Each payload carries the owner's identity. The plan also defines a group identifier in the message base (e.g. "SOS DE ALP" plus the member), so a receiver can tell a group burst from a stranger's device at a glance.

## The agreement ritual

Write the plan, print it, and have every member carry it. A plan in the group chat is not a plan: the card in the pocket is (see [Emergency Kit](emergency-kit)).

## Related pages

- [Multi Beacon Operations](multi-beacon-operations) for the field side
- [Multi Beacon Network](multi-beacon-network) for the network design
- [Emergency Communications Plan](emergency-communications-plan) for the external side