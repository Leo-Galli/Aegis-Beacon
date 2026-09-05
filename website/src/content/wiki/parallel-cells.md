---
title: Parallel Cells
description: "Running two 18650 cells in parallel for double runtime: the rules, the risks, and when it is worth it."
---

# Parallel Cells

Two cells in parallel double the capacity and halve the current each cell carries. It sounds free. It is not, but it is safe if you follow the rules.

## The only two rules that matter

1. **Same voltage when joined.** Charge both cells fully, measure both, and only connect them within 0.1 V of each other. Connecting a full cell to an empty one pours current through the empty one at uncontrolled rates.
2. **Same chemistry and age.** Never mix a fresh cell with a worn one. The worn cell becomes the weakest link and will be over-discharged by the healthy one.

## What parallel changes

| Property | Single 2500 mAh | Two in parallel |
| --- | --- | --- |
| Capacity | 2500 mAh | 5000 mAh |
| Max current split | One cell sees all | Each sees half |
| Runtime (50 mA avg) | 50 h | 100 h |
| Charging | One TP4056 | One TP4056, slower |

## The failure mode

If cell A is healthy and cell B is worn, B's internal resistance rises and it heats up while A works. The pair then looks fine until B fails short, dragging A down with it. This is why the age rule matters more than the capacity rule.

## A safer alternative

For most users, a single high-capacity cell (3200 - 3500 mAh) plus a spare cell in the pack is simpler and safer than a parallel pair, and gives the same total runtime with zero balancing risk. Parallel is for when the beacon must run continuously for days and you cannot swap cells.

## Fusing

If you do build a parallel pack, fuse each cell leg (a 1 - 2 A PTC or inline fuse). Then a single cell's failure cannot feed the other cell's short.

## Related pages

- [Battery Selection](battery-selection) for cell choice
- [Battery Capacity Math](battery-capacity-math) for the runtime numbers
- [Alternate Power Inputs](alternate-power-inputs) for other supply options