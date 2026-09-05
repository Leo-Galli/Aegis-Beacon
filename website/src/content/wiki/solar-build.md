---
title: Solar Build
description: "The beacon with solar charging: panel choice, the charging path, and the missions where solar actually pays for itself."
---

# Solar Build

Solar is a specialization: it adds weight, cost and failure modes in exchange for multi-day autonomy. This page is the honest engineering for when that trade is right.

## The honest missions

| Mission | Solar worth it? |
| --- | --- |
| Weekend trips | No: a spare cell is lighter |
| Fixed long-term monitoring | Yes: a panel is maintenance-free |
| Multi-week expeditions with sun | Yes, with careful sizing |
| Winter, forest, or north-facing | No: the panel never sees real sun |

## The parts

| Part | Role |
| --- | --- |
| 6 V panel, 1 - 5 W | Energy source |
| Buck/boost USB module | Stable 5 V to the charger |
| TP4056 | Charging the cell |
| 18650 cell | Buffer (the panel charges it, it runs the beacon) |

## Sizing the panel

The beacon burns roughly 50 mA average with GPS (see [Power Budget and Runtimes](power-budget-and-runtimes)): about 1200 mAh per day. A 1 W panel delivers that in 6 - 8 hours of full sun; a 3 W panel covers a bad-weather day. Always size for the worst realistic day, not the best.

## Wiring

Panel -> buck/boost (5 V out) -> TP4056 input. Never wire the panel directly to the TP4056: its output sags in shade below the charger's minimum and it charges nothing, or worse, leaks current at night. The [Alternate Power Inputs](alternate-power-inputs) page has the circuit.

## The night problem

A panel connected directly to a charger drains the cell at night through the charger's input circuit. The buck/boost module's input side must block reverse current, or add a Schottky diode. This single detail decides whether the build works or quietly kills its own battery overnight.

## Related pages

- [Solar Charging](solar-charging) for the charging math
- [Alternate Power Inputs](alternate-power-inputs) for the circuit
- [Battery Capacity Math](battery-capacity-math) for the burn rate