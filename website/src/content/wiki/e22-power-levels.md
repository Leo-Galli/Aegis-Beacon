---
title: E22 Power Levels
description: The E22 module's transmit power options, the current each level draws, and the legal mapping of each setting.
---

# E22 Power Levels

The E22 modules (especially the "30S" variants) can transmit far beyond what the license-free band allows. Knowing the power ladder, and where the legal ceiling sits, is the whole game.

## The power ladder

| Setting (dBm) | Output (mW) | Current during TX |
| --- | --- | --- |
| +10 | 10 mW | ~60 - 80 mA |
| +13 | 20 mW | ~75 - 95 mA |
| +17 | 50 mW | ~90 - 110 mA |
| +20 | 100 mW | ~100 - 120 mA |
| +22 | 160 mW | ~110 - 140 mA |

## The legal ceiling

The license-free ISM ceiling for general operation is **10 mW ERP** (see [ERP vs EIRP](erp-vs-eirp)). With antenna gain, even +10 dBm at the module can exceed the ERP ceiling: the honest mapping is:

| Setting | Legal status (unlicensed) |
| --- | --- |
| +10 dBm | The legal floor for routine beaconing |
| +13 to +22 | Emergency use only, or amateur-licensed operation |

The [Regulatory Compliance](regulatory-compliance) page states this in full, and the [Emergency Use Legal](emergency-use-legal) page explains the emergency boundary.

## The battery cost

Each power step up adds current draw, and the TX burst is the beacon's biggest load (see [Current Draw by Mode](current-draw-by-mode)). The power setting is a battery decision as much as a legal one: +10 saves roughly 30% of the TX energy versus +17.

## The field trade

Lower power costs range. For routine beaconing the legal floor is the default; for a genuine emergency the beacon's EMERGENCY mode raises the power (see [Mode Emergency](mode-emergency)). The receiver side matters too: [Antenna Height Matters](antenna-height-matters) often gains more than the power steps.

## Related pages

- [E22 Radio Module Guide](e22-radio-module-guide) for the module
- [ERP vs EIRP](erp-vs-eirp) for the units
- [Regulatory Compliance](regulatory-compliance) for the law