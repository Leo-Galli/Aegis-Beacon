---
title: "Field Maintenance and Storage"
description: "Between-trip care: corrosion, connectors, firmware updates and long-term storage"
---

# Field Maintenance and Storage

## Overview

A rescue beacon waits 99% of its life. Between-trip care is what makes the other 1% count.

## After Each Trip

| Task | Why |
|------|-----|
| Dry the case and connectors | Prevents corrosion |
| Remove snow from the SMA | Detuned antenna next trip |
| Check the battery % | Top up before storage |
| Wipe the USB and audio ports | Dirt causes intermittent failures |
| Visual check of wires | Strain damage at the case exit |

## Monthly Checks

1. Power on and confirm a clean boot (no `[ERROR]`).
2. Transmit one test cycle and confirm the payload.
3. Verify the OLED is readable and not burned in.
4. Check the cell voltage with a multimeter if you have one.
5. Exercise every button - contacts corrode when unused.

## Firmware Updates

1. Flash the latest firmware per [Upload and Monitor](/wiki/upload-and-monitor).
2. Factory reset if upgrading across a major version (see Factory Reset and Recovery).
3. Re-enter your frequency plan and identity afterwards.

## Long-Term Storage

| Parameter | Recommendation |
|-----------|----------------|
| Battery charge | 60-80% for storage, top up every 2 months |
| Cell removal | Optional but prevents deep discharge |
| Environment | Cool, dry, out of direct sun |
| Antenna | Store the whip disconnected to avoid stress |

## Related Pages

- [Winter Operations](/wiki/winter-operations)
- [Charging and Cell Care](/wiki/charging-and-cell-care)
- [Factory Reset and Recovery](/wiki/factory-reset-and-recovery)
- [Troubleshooting](/wiki/troubleshooting)
