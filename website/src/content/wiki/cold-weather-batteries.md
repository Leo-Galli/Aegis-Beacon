---
title: Cold Weather Batteries
description: How cold destroys battery life, the symptoms to expect below zero, and the field techniques that keep a beacon alive in winter.
---

# Cold Weather Batteries

Every chemistry hates the cold. The beacon is a winter tool, so cold behavior is not a footnote: it is the design constraint.

## What cold does

| Temperature | Li-ion effect |
| --- | --- |
| 0 C | Slight capacity loss, normal voltage |
| -10 C | ~20 - 30% capacity loss, higher internal resistance |
| -20 C | 40 - 60% loss, TX sag becomes severe |
| -30 C | Marginal: cell may not deliver TX current at all |

The mechanism: cold slows the chemical reactions inside the cell. The cell still holds most of its charge, but it cannot deliver current fast enough, so the voltage sags hard exactly when the TX burst needs 120 mA.

## Symptoms to expect

- The beacon boots fine indoors, then resets during the first outdoor TX burst.
- The battery monitor reads "low" while the cell is nearly full.
- GPS fix times stretch (the module's crystal and the RF front end also suffer).

## Field techniques

1. **Insulate the cell**: the battery slot should sit against the body or in an insulated pocket. Body heat is the best trick available.
2. **Keep a spare cell in an inside pocket**, swap at a rest stop. A room-temperature cell is worth 30% more than the one in the pack.
3. **Warm before TX**: if the beacon has been sitting in the cold, pressing a hand over the case for a minute before an important transmission helps.
4. **Lower the power setting**: +22 dBm needs more current than +17 dBm. In extreme cold, dropping to +17 dBm reduces the sag and the reset risk.

## The firmware side

The battery monitor thresholds are temperature-aware in the sense that the warning appears earlier in practice (the sag triggers it). Do not ignore an "E08 low battery" in winter: the cell may be full but unable to deliver; warming it first is the right response.

## Related pages

- [Winter Operations](winter-operations) for the full winter playbook
- [Cell Chemistry](cell-chemistry) for the chemistry choice
- [Battery Monitor Details](battery-monitor-details) for the warnings