---
title: Rescue Communication Basics
description: "How radio communication works in a rescue context: who talks, what they say, and how the beacon fits into the bigger picture."
---

# Rescue Communication Basics

A beacon is a radio transmitter, but radio is a conversation. Understanding the rescue radio picture turns your beacon from a gadget into a tool.

## The rescue radio picture

Professional rescue teams coordinate over VHF/UHF amateur and professional channels with a clear hierarchy:

| Role | Job |
| --- | --- |
| Incident commander | Decides, assigns, tracks |
| Field teams | Search, extract, report |
| Base / dispatch | Logistics, medical, external calls |
| The subject (you) | Transmit position, follow instructions |

The beacon's job is narrow: deliver position and identity to whoever is listening. It does not replace the conversation; it starts it.

## What your beacon actually says

Each burst carries: SOS in Morse, your callsign or name, and coordinates. That is exactly the three things a rescue team needs to start: the nature (distress), the identity, and the position. The payload format is documented in [Config Payload Format](config-payload-format).

## The listening side

Rescuers may hear you with:

- A handheld radio tuned to your channel
- An SDR receiver scanning the band
- Another beacon in SEARCH mode

Because the beacon transmits on a shared band, the receiving side must know you are there. This is why the wiki's [Emergency Communications Plan](emergency-communications-plan) insists you tell people before the trip: frequency, schedule, and what to do when they hear the burst.

## The one-way truth

The beacon is one-way. You cannot hear the rescuers with it. Your plan must therefore include a way to receive (a PMR446 handheld, a phone, a second beacon in RX) or a prearranged schedule. One-way signaling works, but two-way is a different level of safety.

## Related pages

- [Emergency Communications Plan](emergency-communications-plan) for the pre-trip plan
- [Mayday vs Pan Pan](mayday-vs-panpan) for the voice protocol
- [Position Reporting](position-reporting) for how to report where you are