---
title: Terrain Reading for Radio
description: "Reading a map and the landscape for radio paths: where the signal will work, where it will die, and the features that always matter."
---

# Terrain Reading for Radio

Before the radio ever transmits, the map can tell you whether the path will work. Terrain reading for radio is the skill of predicting propagation from topography.

## The features that matter

| Feature | Radio effect |
| --- | --- |
| Ridges | Blocking (see [Mountain Effects on Radio](mountain-effects-radio)) |
| Valleys | Trapping (see [Radio Shadow](radio-shadow)) |
| Slopes facing the path | Good: the direct path clears the ground |
| Slopes facing away | Bad: the hill itself blocks |
| Forest | Attenuation (see [Foliage Loss](foliage-loss)) |
| Water | Reflection: multipath, but also a clear path |

## The profile line

Draw the line between beacon and receiver on the map. Read the profile: every ridge the line crosses is a candidate blocker. The skill is judging which ridges matter:

- A ridge that cuts the Fresnel zone deeply blocks (see [Fresnel Zone](fresnel-zone)).
- A ridge that only grazes the path costs 10 - 15 dB (knife-edge, see [Mountain Effects on Radio](mountain-effects-radio)).
- A slope that the path travels along is fine; a slope it must cross is a wall.

## The three questions

Before relying on a path, ask:

1. Is there line of sight? (Profile check.)
2. How much forest is in the path? (Map and experience.)
3. Where is the highest obstacle relative to both ends? (The answer is where the signal dies.)

## The field confirmation

Maps predict; the field confirms. The [Signal Strength Mapping](signal-strength-mapping) walk verifies the map's prediction, and the discrepancy is where the map was wrong (usually: vegetation the map does not show).

## Related pages

- [Mountain Effects on Radio](mountain-effects-radio) for the physics
- [Radio Shadow](radio-shadow) for the dead zones
- [Coordinate Plotting and Maps](coordinate-plotting-and-maps) for the map skills