---
title: Antenna Quick Select
description: "Choosing the right antenna for the mission: the decision table that matches antenna to situation."
---

# Antenna Quick Select

The antenna is the highest-leverage field decision. This page is the decision table; the theory lives in [Antenna Design](antenna-design).

## The decision table

| Situation | Antenna | Why |
| --- | --- | --- |
| Pocket / pocket-carried beacon | Helical | Short, survives abuse (see [Helical Antenna](helical-antenna)) |
| Pack-mounted, open terrain | Quarter-wave whip | Best all-rounder (see [Quarter Wave Antenna](quarter-wave-antenna)) |
| Hanging from a pole / tree | Dipole | No ground plane needed (see [Half Wave Dipole](half-wave-dipole)) |
| Fixed deployment, metal case | Quarter-wave on the case | The case is the ground plane |
| Maximum range, static | Tall whip or dipole, high | Height beats gain (see [Antenna Height Matters](antenna-height-matters)) |

## The two rules

1. The antenna must match the band: 433 MHz whips are about 17 cm; anything shorter is loaded (see [Antenna Lengths](antenna-lengths)).
2. The antenna must match the mount: SMA standard, not RP-SMA (see [Antenna Cable and Connectors](antenna-cable-connectors)).

## The field-swap reality

The SMA mount makes the antenna a field decision (see [Antenna Mounting](antenna-mounting)): carry a whip and a helical, and match the mission on the day. The [Field Repair Kit](field-repair-kit) carries both.

## The verification

Whatever the choice: SWR check (see [VSWR Measurement](vswr-measurement)) and a range test (see [Outdoor Testing](outdoor-testing)). A perfect decision with a broken antenna is a broken decision.

## Related pages

- [Antenna Design](antenna-design) for the theory
- [Antenna Types](antenna-types) for the comparison
- [Antenna Testing and Tuning](antenna-testing-and-tuning) for the validation