---
title: "Avalanche Rescue Operation"
description: "How the beacon supports companion rescue: search modes, priorities and realistic limits"
---

# Avalanche Rescue Operation

## Overview

The Aegis-Beacon is an emergency radio-location device, not a certified avalanche transceiver. In an avalanche scenario it can supplement, never replace, a proper 457 kHz avalanche beacon and the training that goes with it. This page describes how a rescue could use the Aegis-Beacon's SEARCH and GPS payloads.

## Understanding the Difference

| Device | Frequency | Purpose |
|--------|-----------|---------|
| Certified avalanche transceiver | 457 kHz | Primary companion rescue |
| Aegis-Beacon SEARCH | 433 MHz RSSI scan | Supplementary locating aid |
| Aegis-Beacon BEACON | 433 MHz CW | Position reporting to rescuers |

## If You Are the Survivor

1. **Switch to SEARCH mode immediately** (short press MODE).
2. Keep the antenna vertical and scan the debris field.
3. Listen for the RSSI audio pitch and watch the hit log.
4. Prioritize visual clues and the 457 kHz transceiver if present.

## If You Are Buried

1. Hold MODE for 2 s to enter EMERGENCY: continuous max-power TX.
2. Protect your airway and conserve energy.
3. The beacon transmits `SOS DE [NAME] PSN [LAT] [LON]` plus a continuous tone.
4. EMERGENCY runs ~12 h on a 2000 mAh cell; it will outlast the critical window.

## Realistic Limits

- 433 MHz attenuates ~3 dB/m in wet snow. A 1 m burial costs ~3-9 dB.
- SEARCH directionality is weak; treat the pitch as a proximity clue, not a bearing.
- GPS accuracy is ~185 m at DDM precision - enough to define a search area, not a point.

## Related Pages

- [EMERGENCY Mode](/wiki/mode-emergency)
- [SEARCH Mode](/wiki/mode-search)
- [Field Deployment](/wiki/field-deployment)
- [Safety Guidelines](/wiki/safety-guidelines)
