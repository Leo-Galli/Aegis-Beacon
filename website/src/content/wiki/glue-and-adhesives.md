---
title: Glue and Adhesives
description: "The adhesives used in the beacon build: hot glue, epoxy, RTV silicone, and the rule about what each one is allowed to touch."
---

# Glue and Adhesives

Every case has joints that fasteners do not reach. The beacon uses three adhesives, each with a strict territory.

## The three adhesives

| Adhesive | Use | Not for |
| --- | --- | --- |
| Hot glue | Strain relief, cable entries, temporary holds | Any load-bearing joint |
| Epoxy (2-part) | Load-bearing joints, permanent mounts | Anything that will be opened |
| RTV silicone | Seals, water barriers | Electrical insulation of hot parts |

## The territory rules

| Joint | Right adhesive |
| --- | --- |
| Cable entry into the case | Hot glue or silicone |
| Antenna mount reinforcement | Epoxy |
| Case seam (permanent build) | RTV silicone (see [Waterproofing](waterproofing-and-enclosure-sealing)) |
| Board to case (temporary) | Hot glue |
| Board to case (permanent) | Epoxy, with standoffs |

## The rules

1. **Nothing conductive**: no adhesive near the radio's RF path unless verified; some epoxies contain metal fillers.
2. **Outgassing**: hot glue and some silicones outgas solvents that can fog the OLED in a sealed case. Cure fully before sealing.
3. **Repairability**: if you may need to open it, use the adhesive that lets you: hot glue over epoxy.

## The cold behavior

Adhesives stiffen in the cold. RTV silicone stays flexible (good), hot glue gets brittle (bad for strain relief), epoxy is unaffected. Winter builds favor silicone for anything that flexes (see [Winter Pack](winter-pack)).

## Related pages

- [Waterproofing and Enclosure Sealing](waterproofing-and-enclosure-sealing) for the sealing
- [Assembly Sequence](assembly-sequence) for the order
- [Case Materials](case-materials) for the substrate