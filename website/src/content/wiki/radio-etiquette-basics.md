---
title: Radio Etiquette Basics
description: "The operating habits that keep the band usable for everyone: listening first, short transmissions, and the beacon's own etiquette."
---

# Radio Etiquette Basics

Radio etiquette is not politeness; it is spectrum management. The habits in this page keep the shared band usable, and the beacon has its own etiquette built into its design.

## The universal habits

| Habit | Why |
| --- | --- |
| Listen before transmitting | The channel may be in use; your beacon burst overlaps someone else's |
| Keep transmissions short | The band is shared; every second is someone else's loss |
| Identify yourself | The beacon does this by design (see [Callsign Identification](callsign-identification)) |
| Leave the channel when done | The beacon's schedule stops when you do (see [Mode Config](mode-config)) |

## The beacon's built-in etiquette

The beacon is unusually polite by design:

- Its bursts are short (a payload takes seconds, see [Firmware Payload Builder](firmware-payload-builder)).
- Its gaps are long (the sleep interval, see [Firmware TX Scheduler](firmware-tx-scheduler)).
- It scans before you deploy it (see [Scanning the Band](scanning-frequency-table)), so it picks a quiet channel rather than fighting for a busy one.

## The interference reality

Etiquette reduces but cannot eliminate collisions: the band is uncoordinated by law (see [Urban RF Environment](urban-rf-environment)). When a collision happens, the beacon's repeats cover it: the next burst arrives on schedule. That is the design compensating for a shared medium.

## When etiquette changes

In an emergency, the [Mayday vs Pan Pan](mayday-vs-panpan) protocol takes priority over ordinary courtesy: the beacon's EMERGENCY mode transmits more often and longer because the situation warrants it (see [Emergency Use Legal](emergency-use-legal)).

## Related pages

- [Band Plan Etiquette](band-plan-etiquette) for the channel rules
- [Simplex Communication](simplex-communication) for the direct mode
- [Rescue Communication Basics](rescue-communication-basics) for the rescue context