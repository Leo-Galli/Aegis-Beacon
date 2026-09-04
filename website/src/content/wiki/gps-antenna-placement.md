---
title: "GPS Antenna Placement"
description: "Ceramic patch orientation, distance from the radio and metal, and cold-start behavior indoors"
---

# GPS Antenna Placement

## Overview

The NEO-6M module carries a small ceramic patch antenna. Its placement inside the enclosure is the difference between a 30 second fix and a beacon that never locks in the field.

## Rules of Thumb

1. **Sky view is everything.** The patch needs a clear hemisphere above it. Snow, a metal lid, or a conductive enclosure roof blocks it.
2. **Keep it away from the radio.** The SX1262 transmits at up to +30 dBm a few centimetres away; keep the GPS patch at least 3-5 cm from the SMA connector and antenna feed.
3. **Metal under the patch helps.** A ground plane below the ceramic patch improves reception. The ESP32 board's own ground pour often provides enough.
4. **Face it up.** The patch antenna is directional. Mount the module so the ceramic faces the sky, not the side of the case.

## Enclosure Considerations

| Enclosure material | GPS behavior |
|--------------------|--------------|
| Plastic / 3D printed PLA | Transparent to GPS - good |
| Aluminium (Hammond 1593L) | Blocks GPS - the module needs a window or external placement |
| Metal lid | Blocks the signal |

> [!NOTE]
> The Hammond 1593L case is aluminium. If you mount the GPS inside it, the fix may never lock. Options: cut a window, mount the module under a plastic panel, or run the GPS on an external pigtail.

## Cold Start vs Warm Start

| State | Time to fix | When |
|-------|-------------|------|
| Cold start | 30 s to 3 min | First boot, or after days without power |
| Warm start | ~1-15 s | Recent almanac in the RTC backup or from previous boot |
| Indoors | Often never | GPS signals do not penetrate buildings reliably |

The beacon stores the last fix in RTC RAM, so even a failed cold start still lets it transmit the previous known position.

## Testing Placement

1. Boot the beacon near a window or outdoors.
2. Watch the serial console for `[GPS ] Fix acquired` and the satellite count.
3. Move the module a few centimetres at a time and reboot to compare time-to-fix.
4. Keep the configuration that fixes fastest in your real carrying position.

## Related Pages

- [NEO-6M GPS Module Guide](/wiki/neo6m-gps-module-guide)
- [GPS Integration](/wiki/gps-integration)
- [Assembly Guide](/wiki/assembly-guide)
- [Enclosure Options](/wiki/enclosure-options)
