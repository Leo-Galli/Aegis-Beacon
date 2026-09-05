---
title: Solar Charging
description: "Charging the beacon from a solar panel in the field: what works, what the numbers say, and the honest limits."
---

# Solar Charging

A solar panel on the pack sounds like infinite battery. The physics are less generous. This page gives the honest numbers for keeping a beacon topped up in the field.

## The input requirement

The TP4056 charger needs 4.5 - 5.5 V on its input. A "5 V" solar panel delivers that only in full sun; in shade it sags below the charger's minimum and charges nothing. This is the first and biggest trap.

## The math

| Panel | Output in full sun | Charge in 6 h sun |
| --- | --- | --- |
| 6 V / 1 W (folding) | 5 V at 200 mA | ~1200 mAh |
| 6 V / 3 W | 5 V at 600 mA | ~3000 mAh |
| 6 V / 5 W | 5 V at 1 A | ~4000 mAh (charger-limited) |

The beacon's nightly burn at 50 mA average is 1200 mAh per 24 hours. So a 1 W panel in full sun roughly breaks even, and a 3 W panel keeps the cell topped up even with mediocre weather.

## Reality checks

- **Shade kills it**: tree cover, overcast and pack shadow reduce output to 10 - 30% of full sun.
- **Angle matters**: the panel must face the sun; a panel lying flat on a pack produces a fraction of its rating.
- **The charger needs margin**: a panel sagging to 4.2 V charges nothing even though the sun "looks" fine.

## A reliable alternative

For most missions, carrying a second charged 18650 and swapping it is lighter, cheaper and more reliable than a panel. Solar earns its place only on multi-day trips with predictable sun and a pack that can carry a panel flat and angled.

## Wiring it in

Connect the panel through a small buck/boost USB module (not directly to the TP4056) so the charger input stays at a stable 5 V. Add a diode if the module lacks reverse protection. See [Alternate Power Inputs](alternate-power-inputs) for the wiring.

## Related pages

- [Charging and Cell Care](charging-and-cell-care) for the charger side
- [Alternate Power Inputs](alternate-power-inputs) for the input options
- [Power Budget and Runtimes](power-budget-and-runtimes) for the nightly burn