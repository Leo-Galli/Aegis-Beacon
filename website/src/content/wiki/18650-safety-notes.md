---
title: 18650 Safety Notes
description: Protected vs unprotected cells, why protection matters in a rescue beacon, and safe handling rules.
---

# 18650 Safety Notes

The 18650 is the energy source and the biggest safety risk in the project. Treat it with respect.

## Protected vs unprotected

- **Protected cells** contain a small PCB (usually visible as a slightly longer cell with a ring at the positive end) that cuts off over-charge, over-discharge, and over-current.
- **Unprotected cells** are raw lithium cells. They are fine in a proper BMS circuit but dangerous when misused.

**Use protected cells in this beacon.** The TP4056 module has its own protection, but two layers of protection are the difference between a dead battery and a fire in your pack.

## Why protection matters here

- The beacon runs until the cell is deeply discharged; protection stops the cell below 2.4 V.
- A shorted wire in a pack can dump 10+ A; protection trips before the cell vents.
- Charging errors (e.g. a damaged TP4056) are caught by the cell's own protection.

## Safe handling rules

- Never carry loose cells in a pocket with keys or coins. Use a plastic case.
- Inspect the wrapper: any tear, dent, or bulge means replace the cell.
- Charge at room temperature, not on a bed or sofa.
- Do not leave charging unattended overnight as a habit.
- Dispose of damaged cells at a battery recycling point, not in the trash.

## Cold weather

Standard Li-ion cells lose capacity below 0 C and can be damaged by charging below freezing. For alpine use, consider a LiFePO4 cell (rated to -30 C with less capacity loss) - see the battery guide pages.

## Measuring

- Full: 4.2 V. Empty (protection trip): about 2.4-2.5 V.
- Healthy cell at rest: 3.6-4.2 V.
- A cell that reads below 2.5 V at rest is suspect; do not force-charge it at full current.