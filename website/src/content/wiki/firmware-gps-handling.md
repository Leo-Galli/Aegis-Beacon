---
title: Firmware GPS Handling
description: "How the firmware talks to the NEO-6M GPS module: UART wiring, NMEA parsing, fix acquisition and timeouts."
---

# Firmware GPS Handling

The GPS module is a peripheral, not a requirement. The beacon works without it, but when enabled it feeds live coordinates into every transmitted packet.

## UART wiring

The NEO-6M module connects to the ESP32 through a hardware UART:

- **TX** from the module to an ESP32 RX pin
- **RX** from the module to an ESP32 TX pin
- 3.3 V power (never 5 V on the module's VCC if it lacks a regulator)
- Common ground

The firmware configures the UART at **9600 baud**, the NEO-6M default.

## NMEA sentences

The module streams NMEA 0183 sentences. The firmware is interested in two of them:

| Sentence | Content | Use |
| --- | --- | --- |
| `$GPGGA` | Fix quality, latitude, longitude, altitude, satellites | Coordinates for the payload |
| `$GPRMC` | Time, fix status, speed, date | Status and timing |

Each sentence is a comma-separated line ending with `\r\n`. Fields are positional: in GGA, field 2 is latitude, field 3 is hemisphere, field 4 is longitude, field 5 is east/west.

## Parsing strategy

The parser reads bytes as they arrive, buffers until the line terminator, then validates:

1. Check the checksum (the `*HH` suffix).
2. Split on commas.
3. Extract the fields the firmware needs.
4. Convert DDM coordinates (degrees, decimal minutes) to decimal degrees for the payload.
5. Mark the fix as valid only when the fix-quality field reports 1 or 2.

## Fix acquisition

A cold start takes between 30 seconds and several minutes depending on sky view. The firmware does not block the main loop waiting for a fix:

- The radio continues transmitting on the last known coordinates.
- The OLED shows a `GPS: WAIT` or `GPS: SEARCH` status.
- When a valid fix arrives, it is stored in RTC RAM and NVS so it survives reboots.

## Timeout and fallback

If no fix arrives within the configured window, the firmware keeps the previous coordinates (marked with the age) or transmits without coordinates. The beacon is a safety device: a position-less SOS is still better than silence.

## Related pages

- [GPS Integration](gps-integration) for the wiring details
- [GPS Coordinate Accuracy](gps-coordinate-accuracy) for what the numbers mean
- [Firmware Payload Builder](firmware-payload-builder) for how coordinates enter the packet