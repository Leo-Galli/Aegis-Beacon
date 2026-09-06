---
title: GPS Fix Capture Tips
description: "Practical tips for getting and keeping a good GPS fix with the NEO-6M: placement, sky view, timing and cold starts."
---

# GPS Fix Capture Tips

The NEO-6M needs a clear sky view before it can report a position. Most "no fix" reports are placement problems, not hardware problems. This page is the practical routine.

## Placement

- Put the ceramic antenna side **up**, away from metal and away from the body.
- Keep the antenna away from the ESP32, battery and wires; the module is most sensitive at its top face.
- Outdoors: a pocket at the shoulder of a pack beats an inner coat pocket. A chest harness is better still.

## Sky view

The fix time depends on satellites in view:

| Environment | Typical time to fix |
| --- | --- |
| Open sky | 30-90 s (cold), under 10 s (warm) |
| Window sill | Minutes, unreliable |
| Indoors | Usually never |

See [GPS Testing Indoors](gps-testing-indoors) for why indoor testing fails, and [GPS Warm vs Cold Start](gps-warm-vs-cold-start) for the timing details.

## The routine

1. Boot the beacon outdoors and wait for the GPS WAIT screen to complete. The beacon waits up to the configured timeout for a fix before transmitting.
2. Watch the satellite count on the OLED. Three or more valid satellites produce a `valid` fix; more satellites mean better accuracy (see [GPS Coordinate Accuracy](gps-coordinate-accuracy)).
3. Confirm the fix over serial: the bridge prints `AEGIS:POS:` lines automatically, or send `POS`.

## Keeping the fix

- The RTC cache persists the last fix across deep sleep, so a beacon that fixed outdoors boots with a position even if the next boot is indoors (see [Firmware GPS Handling](firmware-gps-handling)).
- If you move far between boots, the cached fix is stale. Re-acquire outdoors before relying on coordinates.

## When it fails

| Symptom | Likely cause |
| --- | --- |
| Never reaches 3 sats | Indoor, or antenna blocked by battery/wires |
| Sats valid but position jumps | Reflected signals; hold still during acquisition |
| Fix lost mid-use | Antenna covered; keep it facing up |

## Related

- [GPS Failure Contingency](gps-failure-contingency)
- [GPS Warm vs Cold Start](gps-warm-vs-cold-start)
- [Configuring the NEO-6M over UART](ublox-uart-config)