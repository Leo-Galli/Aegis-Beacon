---
title: "NEO-6M GPS Module"
description: "How the NEO-6M is wired to the ESP32, how TinyGPS++ parses its NMEA sentences, and what 'fix' actually means"
---

# NEO-6M GPS Module

## Overview

The beacon uses a **NEO-6M** GPS receiver with the ceramic patch antenna already mounted on its PCB. It connects to the ESP32 over UART so the firmware can read position, satellite count, and fix state, and optionally include a compact coordinate in the Morse payload.

NEO-6M is not a surveying-grade receiver. It is a mid-range hobby module that typically needs open sky to produce a usable fix; results in deep valleys, under dense canopy, or inside a metal enclosure are poor.

## Physical Module

The live module is the blue-board NEO-6M with the ceramic patch antenna facing up. Its relevant properties:

- Active antenna on the board; no external antenna option.
- Default baud rate 9600.
- Default update rate 1 Hz.
- Cold start can take several minutes if it has never seen satellites in its current location.

## Wiring to ESP32

The NEO-6M talks to the ESP32 on UART2 so it does not conflict with the USB serial console.

| NEO-6M pin | ESP32 pin | Direction | Notes |
|---|---|---|---|
| VCC | 3.3V | power | 3.3V only — do not feed 5V |
| GND | GND | ground | common ground with ESP32 |
| TX | GPIO 12 | NEO → ESP RX | ESP TX for this UART |
| RX | GPIO 22 | ESP TX → NEO RX | input-only on many boards (SVP), works as ESP TX |

Default firmware assignment uses GPIO 12 for the ESP TX to the module and GPIO 22 for the ESP RX from the module. Earlier prototype wiring used GPIO 34 and GPIO 12; GPIO 34 is input-only and caused the RX pin to be on the wrong side — the current assignment fixes that.

## Serial Setup in Firmware

```cpp
#define PIN_GPS_RX     22
#define PIN_GPS_TX     12
#define GPS_BAUD       9600
#define GPS_SERIAL     Serial2

HardwareSerial gpsSerial(2);   // UART2 on ESP32
```

Init:

```cpp
gpsSerial.begin(GPS_BAUD, SERIAL_8N1, PIN_GPS_RX, PIN_GPS_TX);
```

The module is read continuously in `readGPS()`. TinyGPS++ sits on top of the raw UART stream and extracts NMEA fields.

## NMEA Parsing with TinyGPS++

TinyGPS++ parses NMEA sentences from the GPS and exposes structured fields. The firmware asks it for:

- Latitude and longitude (in degrees).
- Satellite count.
- Fix validity.

A sentence like `$GPGGA,...` carries fix quality, satellites, latitude, longitude, altitude. `$GPRMC` carries date, time, position, speed, and fix validity.

The firmware does not forward raw NMEA anywhere — it reads TinyGPS++ fields and uses them directly for display and optional payload.

## What 'Fix' Means Here

A fix in this firmware is:

- TinyGPS++ reports a valid position.
- Satellite count is at least `GPS_MIN_SATS` (default 3).
- We have waited no longer than `GPS_FIX_TIMEOUT_S` (default 60 s) for the first fix.

If the module never sees enough satellites, the beacon still operates — GPS is optional. The payload only includes coordinates when the user enabled "Include GPS in beacon" and the module has a fix.

## Payload Coordinate Format

When GPS and name are both enabled, the beacon transmits a compact coordinate:

```
SOS DE MARIO ROSSI PSN N4553 E01230
```

`PSN` stands for position. The coordinates are abbreviated to fit Morse:

- `N4553` = 45 degrees 53 minutes North.
- `E01230` = 12 degrees 30 minutes East.

The full precision coordinates are logged on Serial for debug, but the Morse payload uses the short form to keep TX time low.

## Antenna Orientation

The ceramic patch is directional in the sense that it works best with a clear view of the sky above it:

- Mount the board so the patch antenna faces upward.
- Avoid placing metal directly above the patch.
- For external antennas, use an active antenna with an SMA connector fed by the module's antenna port if your board exposes it.

## Cold Start Behavior

On first use in a new area, NEO-6M can take a long time to acquire satellites. Expect:

- Several minutes in the worst case if it has no almanac for the location.
- Faster acquisition once it has seen satellites there before.
- Better results the higher and more open the sky is.

## Power

The NEO-6M draws a modest amount of current. In a battery-powered beacon, GPS is the largest single optional drain when enabled. The firmware lets you disable the module entirely when you do not need position — for example when you are in a known location and only need to beacon your message.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| No position, no satellites | Patch under roof, canopy, or metal | Move outdoors with clear sky |
| Position jumpy or slow | Low satellite count, bad sky view | Relocate for open sky |
| Serial garbage on UART2 | Wrong baud, wrong pins, conflict with USB | Confirm GPIO 12/22 and 9600 baud |
| Battery drain too high | GPS enabled in a fixed location | Disable GPS in CONFIG when not needed |

## Related Pages

- [GPS Integration](/wiki/gps-integration) — wiring, fix, and payload format.
- [GPS Coordinate Accuracy](/wiki/gps-coordinate-accuracy) — how accurate the short-form coordinates are.
- [GPS Troubleshooting](/wiki/gps-troubleshooting) — common GPS failures.
- [GPS Module Variants](/wiki/gps-module-variants) — NEO-6M vs alternatives.
