---
title: Cell Chemistry
description: "Lithium-ion, LiFePO4, NiMH and alkaline compared for the beacon: voltage, capacity, cold weather and safety."
---

# Cell Chemistry

Not every battery is the same chemistry, and chemistry decides voltage, capacity, cold behavior and safety. The beacon is designed around one chemistry but can run on others with settings changes.

## The contenders

| Chemistry | Nominal voltage | Capacity vs weight | Cold behavior | Safety |
| --- | --- | --- | --- | --- |
| Li-ion 18650 | 3.7 V | Excellent | Good to -10 C, degrades below | Needs protection |
| LiFePO4 | 3.2 V | Good | Excellent | Very safe |
| NiMH AA | 1.2 V | Fair | Poor | Very safe |
| Alkaline AA | 1.5 V | Poor at high current | Poor | Very safe |

## Why the beacon wants Li-ion

The ESP32 needs a stable 3.3 V rail and bursts of 120 mA. A single 18650 supplies this directly through the regulator, packs the most capacity per gram, and is cheap and standardized. Everything in the standard build assumes this cell.

## The voltage curve problem

Li-ion delivers 4.2 V charged, ~3.0 V empty. The firmware uses the [Battery Monitor](battery-monitor-details) to track this curve and warn long before the regulator drops out. NiMH cells, by contrast, hold 1.2 V until they die suddenly: their curve gives almost no warning, which is bad for a beacon.

## Cold weather

All chemistries lose capacity in the cold. Li-ion loses 20 - 30% at -10 C and substantially more below -20 C, plus the internal resistance climbs so the voltage sags harder under the TX burst. [Cold Weather Batteries](cold-weather-batteries) has the mitigation list.

## LiFePO4 as an option

A 3.2 V LiFePO4 cell runs the ESP32 through the regulator but needs the low-voltage alarm thresholds adjusted in CONFIG mode, and its capacity per volume is lower. It is the right choice when safety and cold performance matter more than runtime.

## Related pages

- [18650 Battery Guide](18650-battery-guide) for the recommended cell
- [Battery Selection](battery-selection) for the decision process
- [Cold Weather Batteries](cold-weather-batteries) for winter use