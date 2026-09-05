---
title: Protected vs Unprotected Cells
description: The difference between protected and unprotected 18650 cells, and which one belongs in a beacon.
---

# Protected vs Unprotected Cells

An 18650 cell without protection is a small bomb waiting for a mistake: overcharge, over-discharge, or a short can start a fire. The protection circuit is the difference between a battery and a hazard.

## What protection does

A protected cell has a small PCB under the wrapper that cuts the cell off:

| Protection | Action |
| --- | --- |
| Overcharge | Cuts off above ~4.3 V |
| Over-discharge | Cuts off below ~2.5 - 2.8 V |
| Overcurrent | Cuts off above the rated current |
| Short circuit | Cuts off instantly |

## The cost

| | Unprotected | Protected |
| --- | --- | --- |
| Length | 65 mm | 67 - 69 mm |
| Capacity | Nominal | Slightly lower (circuit space) |
| Current limit | None | 3 - 10 A typical |
| Safety | Depends entirely on your charger and firmware | Circuit-level |

## Which for the beacon

Use a **protected** cell. The beacon's TP4056 charger does not terminate at 4.2 V perfectly for every cell, the firmware's low-voltage cutoff is a software promise, and the cell sits inside a plastic case against other metal. The protection circuit is the last line that the firmware cannot replace.

## Fitting the longer cell

Protected cells are 2 - 4 mm longer. The beacon case is designed around protected-cell dimensions. If you print your own case, measure the cell with its wrapper before cutting the battery slot (see [Case Cutouts Guide](case-cutouts-guide)).

## Spotting a fake

Counterfeit "protected" cells are common on marketplaces. Buy cells from a known battery seller (the brand's official store or a reputable distributor), check the weight (a real 2500 mAh protected cell weighs 45 - 50 g), and treat suspiciously cheap cells as unprotected.

## Related pages

- [18650 Battery Guide](18650-battery-guide) for the recommended cell
- [18650 Safety Notes](18650-safety-notes) for handling
- [Charging and Cell Care](charging-and-cell-care) for the charging side