---
title: Homebrew Antenna
description: "Building a simple, field-repairable 433 MHz antenna from parts: wire, SMA, and a soldering iron."
---

# Homebrew Antenna

A store-bought antenna is fine. A homebrew one is cheaper, repairable in the field, and teaches you the physics well enough to debug any antenna problem later. This page covers two builds that work.

## Build 1: the quarter-wave whip

Parts: 170 mm of 1.5 mm steel or brass wire, one SMA female bulkhead, one 20 mm length of heat shrink.

1. Cut the wire to 168 mm (see [Quarter Wave Antenna](quarter-wave-antenna)).
2. Solder the wire into the SMA center pin.
3. Cover the joint with heat shrink for strain relief.
4. Test SWR and trim 1 mm at a time if the resonance sits high.

## Build 2: the field dipole

Parts: 660 mm of 0.8 mm wire (two 165 mm elements), a small BNC or SMA pigtail, tape or cable ties.

1. Cut two 165 mm elements.
2. Solder each to one side of the feed line center and shield.
3. Spread the elements in a straight line at 180 degrees.
4. Tape the feed point to a trekking pole. This is the [Half Wave Dipole](half-wave-dipole) build.

## The ground plane for the whip

The whip alone is only half an antenna. Either mount it on the metal beacon case or add four 165 mm radial wires under the base, spread evenly. Without either, expect poor SWR and weak signal.

## Testing before trusting

Every homebrew antenna must pass the same test as a store antenna:

1. Continuity and short checks on the coax.
2. SWR measurement across the band (see [VSWR Measurement](vswr-measurement)).
3. A live two-beacon range check.

## Field repair kit

Carry 30 cm of spare wire, a spare SMA connector, heat shrink and a mini soldering iron. A broken antenna in the field is a 5-minute repair with this kit, versus a lost mission without it.

## Related pages

- [Antenna Testing and Tuning](antenna-testing-and-tuning) for validation
- [Antenna Mounting](antenna-mounting) for attaching the result
- [Field Maintenance and Storage](field-maintenance-and-storage) for the repair kit