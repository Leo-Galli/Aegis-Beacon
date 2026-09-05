---
title: GPS Build Configuration
description: "Building the beacon around the GPS: module choice, antenna placement, power strategy, and the settings that make coordinates reliable."
---

# GPS Build Configuration

The GPS build is the standard build with the GPS treated as the first-class citizen: the module chosen for the mission, the antenna placed deliberately, and the power budget planned around continuous tracking.

## Module choice

| Module | Why | See |
| --- | --- | --- |
| NEO-6M | Cheap, standard, well documented | [NEO-6M Guide](neo6m-gps-module-guide) |
| NEO-M8N | Faster acquisition, better sensitivity | [NX130 vs NEO-M8N](nx130-vs-neo-m8n) |
| NX130 (UBX) | Small, low power, still NMEA | [NX130 GPS Module](nx130-gps-module) |

## Antenna placement

The patch antenna wants clear sky and no metal:

- Top of the case, away from the battery and the ESP32 board
- At least 20 mm from the radio's antenna
- No metal plane under the patch (unlike the radio antenna, which wants one)

The [GPS Antenna Placement](gps-antenna-placement) page has the measurements.

## Power strategy

The honest options (see [GPS Power Saving](gps-power-saving)):

| Strategy | Runtime | Freshness |
| --- | --- | --- |
| GPS always on | 50 - 65 h on 2500 mAh | Always current |
| GPS on per cycle | Longer | Stale between fixes |
| GPS off, manual coords | Longest | As entered |

## The settings

- GPS: ON
- Coordinates: auto
- Fix age limit: 2 minutes (older fixes are marked stale in the payload)

## Verification

Before the field: power on outdoors, confirm the satellite count reaches 6+, and check the OLED coordinates match your map position within a few meters. See [GPS Testing Indoors](gps-testing-indoors) for what cannot be tested on the bench.

## Related pages

- [GPS Integration](gps-integration) for the wiring
- [GPS Failure Contingency](gps-failure-contingency) for the backup plan
- [Power Budget and Runtimes](power-budget-and-runtimes) for the numbers