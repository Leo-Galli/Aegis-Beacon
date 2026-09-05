---
title: Band Plan Etiquette
description: "How the 433 MHz band is organized in practice: channel spacing, the busy frequencies, and the unwritten rules of choosing a channel."
---

# Band Plan Etiquette

The 433 MHz ISM band has no formal "band plan" like the amateur bands, but practice has created de facto zones. Knowing them keeps your beacon out of the worst congestion.

## The de facto layout

| Segment | Typical occupants |
| --- | --- |
| 433.05 - 433.50 MHz | Sensors, the quieter half |
| 433.50 - 433.90 MHz | Mixed devices |
| 433.92 MHz | The busiest single frequency on Earth: remotes, alarms |
| 433.92 - 434.79 MHz | Upper ISM, moderately busy |

## The unwritten rules

| Rule | Reason |
| --- | --- |
| Avoid 433.92 MHz for continuous use | The remotes live there; your beacon would collide constantly |
| Prefer the lower segment for beacons | Quietest in practice |
| Space channels 25 kHz apart | The harmonized spacing (see [Frequency Table Reference](frequency-table-reference)) |
| Scan before deploying | The current reality beats any rule of thumb (see [Scanning the Band](scanning-frequency-table)) |

## The channel choice process

1. Scan the target area (see [Scanning the Band](scanning-frequency-table)).
2. Pick a channel in the lower segment, 25 kHz from any strong peak.
3. Log the choice in the group plan (see [Group Communication Plan](group-communication-plan)).
4. Re-scan on the day: the band changes with the neighborhood (see [Urban RF Environment](urban-rf-environment)).

## The etiquette conflict

Etiquette says "find a quiet channel"; the emergency says "transmit now". The beacon resolves it by design: routine operation uses the planned channel, and EMERGENCY mode transmits regardless (see [Emergency Use Legal](emergency-use-legal)).

## Related pages

- [Frequency Table Reference](frequency-table-reference) for the channels
- [Frequency Planning Examples](frequency-planning-examples) for the worked plans
- [Radio Etiquette Basics](radio-etiquette-basics) for the habits