---
title: Radio Shadow
description: The dead zones where a beacon signal disappears, why they exist, and the systematic way to find and escape them.
---

# Radio Shadow

Every terrain has places where the signal simply is not there: radio shadows. Understanding them is the difference between "the beacon is broken" and "the beacon is in a shadow".

## What creates a shadow

| Cause | Size of shadow |
| --- | --- |
| Ridge or hill in the direct path | Meters to kilometers |
| Deep valley floor | Hundreds of meters |
| Building canyon | Tens of meters |
| Ground depression (dip in terrain) | Tens of meters |
| Dense forest with wet canopy | Tens of meters |

## The signature

A radio shadow has a tell: the signal drops sharply when you cross a boundary, then returns just as sharply a few meters later. If the RSSI is stable and then suddenly -20 dB at one specific spot, you have found a shadow boundary, not a fault.

## Searching through shadows

1. When the signal vanishes, move laterally 10 - 30 m, not forward.
2. Climb: most shadows have a height ceiling where the path clears.
3. Circle the shadow: the beacon is usually audible from its edges.
4. Mark the boundary: shadows are consistent; the same spot will be dead tomorrow too.

## The beacon side

A beacon cannot know it is in a shadow. That is why the deployment checklist requires a confirmation check: deploy, walk 100 m away, listen, and adjust position if the signal drops ([Field Deployment](field-deployment)).

## Related pages

- [Mountain Effects on Radio](mountain-effects-radio) for the terrain version
- [Search Patterns and Procedure](search-patterns-and-procedure) for the systematic search
- [Outdoor Testing](outdoor-testing) for the confirmation check