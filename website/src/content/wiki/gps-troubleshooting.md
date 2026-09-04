---
title: "GPS Troubleshooting"
description: "No fix, wrong coordinates or a payload with PSN UNKN: diagnose the NEO-6M path"
---

# GPS Troubleshooting

## Overview

GPS problems usually fall into three buckets: no fix at all, a very slow fix, or coordinates that never reach the payload. All three are diagnosable from the serial console.

## Symptom: No Fix After Minutes

| Check | How | Fix |
|-------|-----|-----|
| Sky view | Move outdoors, away from metal and buildings | Relocate for the cold start |
| Patch antenna | Facing up, not against metal | Reposition per GPS Antenna Placement |
| Wiring | GPS TX to GPIO 22, RX to GPIO 12 | Verify continuity |
| Baud rate | Must be 9600 | Some clones default differently; configure the module |
| UART enabled | `gpsen` true in NVS | Enable GPS in the portal |

## Symptom: Very Slow Fix

| Cause | Symptom |
|-------|---------|
| Cold start | Normal up to 3 minutes |
| Almanac lost | First fix after weeks off |
| Nearby radio TX | GPS patch too close to the SMA |

The RTC RAM cache keeps the last fix, so the beacon transmits the previous position while GPS re-acquires.

## Symptom: Payload Says PSN UNKN

`PSN UNKN` means the fix timeout (default 30 s) expired without a fix:

1. The firmware transmits without coordinates rather than delaying the SOS.
2. Check the timeout setting (`gpstmo`, 10-120 s).
3. Verify the GPS actually fixes by watching `[GPS ] Fix acquired` on serial.

## Symptom: Wrong Coordinates in the Payload

| Problem | Likely cause |
|---------|--------------|
| Transposed digits | Read the DDM format carefully (see Coordinate Plotting) |
| Old position | Stale RTC cache - force a fresh fix outdoors |
| Wrong hemisphere | Check the N/S and E/W letters in the payload |

## Serial Diagnostics

```text
[      45][GPS  ] Waiting for GPS fix (timeout 30s)...
[   12400][GPS  ] Fix acquired: 45.53124  12.30456  sats=6
[   12401][INFO ] Payload ready: "SOS DE MARIO ROSSI PSN N4553 E01230"
```

No `[GPS ]` lines at all = UART wiring or baud problem, not a sky problem.

## Related Pages

- [GPS Integration](/wiki/gps-integration)
- [NEO-6M GPS Module Guide](/wiki/neo6m-gps-module-guide)
- [GPS Antenna Placement](/wiki/gps-antenna-placement)
- [Troubleshooting](/wiki/troubleshooting)
