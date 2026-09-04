---
title: "Frequency Planning Examples"
description: "Real configuration examples for Europe, PMR446 channels and the hop sequence"
---

# Frequency Planning Examples

## Overview

This page shows concrete frequency plans you can enter in the CONFIG portal, based on the [Frequency Compatibility](/wiki/frequency-compatibility) reference and the firmware's 10-slot limit.

## Example 1: European Backcountry (Single Beacon)

| Slot | Frequency | Note |
|------|-----------|------|
| 1 | 433.500 MHz | Primary, within EU SRD band |
| 2 | 433.650 MHz | Backup |
| 3 | 434.000 MHz | Backup |

Keep at least 100-150 kHz between active slots so the SEARCH dwells do not bleed into each other.

## Example 2: PMR446 Monitoring Plan

PMR446 emergency channels sit in the 446.0-446.2 MHz range. If your rescue network monitors PMR446, place the beacon on a compatible frequency:

| Slot | Frequency | Note |
|------|-----------|------|
| 1 | 433.500 MHz | Beacon primary |
| 2 | 446.00625 MHz | PMR446 channel 1 (verify legality first) |
| 3 | 446.01875 MHz | PMR446 channel 2 |

> [!WARNING]
> PMR446 frequencies are a separate licence-free allocation in the EU. The firmware allows any frequency the radio can reach, but the operator is responsible for what is legal to transmit. See [Regulatory Compliance](/wiki/regulatory-compliance).

## Example 3: EU Hop Sequence Suggestion

The frequency compatibility reference suggests a 5-slot EU hop sequence. Enter it as slots 1-5 with `rep` set to 1-3, then let SEARCH follow the same list.

## Rules Recap

1. Stay inside the legal band for your region.
2. Leave 100-150 kHz between slots.
3. Keep slot 1 as the agreed "calling" frequency.
4. Write the plan on the case.

## Related Pages

- [Frequency Compatibility](/wiki/frequency-compatibility)
- [Multi-Beacon Operations](/wiki/multi-beacon-operations)
- [CONFIG Mode](/wiki/mode-config)
- [Regulatory Compliance](/wiki/regulatory-compliance)
