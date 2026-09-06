---
title: Serial Command Protocol
description: "The machine-readable AEGIS: protocol the firmware speaks over USB serial, and every command you can send it."
---

# Serial Command Protocol

The firmware speaks a small, machine-readable protocol over the USB serial port
at 115200 baud. Every line is plain ASCII, never ANSI-colored, one record per
line, prefixed with `AEGIS:`. The companion
[serial bridge](serial-bridge-guide) and the website's
[Report Position](/report-position) page are built on it, and any serial
monitor can use it too.

## Outgoing lines

The firmware prints these lines as events happen:

### `AEGIS:HELLO:`

Printed once at boot, after the debug banner:

```
AEGIS:HELLO:ver=5.3;mode=BEACON;freq=433.500;wpm=12;vol=64
```

Fields: `ver` firmware version, `mode` current mode, `freq` first configured
frequency in MHz, `wpm` Morse speed, `vol` audio volume.

### `AEGIS:POS:`

The position report, printed when a GPS fix is acquired, when the payload is
rebuilt, on demand (`POS`), and then throttled to at most one every 5 seconds
while the device is awake:

```
AEGIS:POS:lat=45.123456;lng=11.123456;alt=412;sats=8;freq=433.500;mode=BEACON;fix=1;age=87;payload=SOS PSN N4553 E01130
```

| Field | Meaning |
| --- | --- |
| `lat` | Latitude in decimal degrees |
| `lng` | Longitude in decimal degrees |
| `alt` | Altitude in meters |
| `sats` | Satellites in use |
| `freq` | First configured frequency in MHz |
| `mode` | Current operating mode |
| `fix` | `1` for a fresh live fix, `0` for a last-known/cached position |
| `age` | Age of the fix in milliseconds |
| `payload` | The exact Morse payload, as transmitted |

The `fix` and `age` fields let consumers tell a freshly recalculated position
from a repeated last-known one. The firmware recalculates from the receiver on
every GPS update, and after 30 seconds without fresh satellite data it flags
the report as stale (`fix=0`) instead of pretending the same coordinates are
new (see [Firmware GPS Handling](firmware-gps-handling)).

### `AEGIS:STATE:`

The answer to `STATUS`:

```
AEGIS:STATE:mode=SEARCH;freq=433.500;wpm=12;vol=64;heap=184320;boot=1;tx=0;hits=0;gpsFix=1;sats=8
```

### Other replies

```
AEGIS:FREQ:0=433.500        after a FREQ command
AEGIS:WPM:14                after a WPM command
AEGIS:MODE:SEARCH           after a MODE command
AEGIS:ERR:<message>         a rejected command
AEGIS:HELP:...              the HELP reply
```

## Inbound commands

Send any command as a single line, ended with a newline. Commands are
case-insensitive; the device restarts after a successful `MODE` change, so
allow a second for the handshake line to come back.

| Command | Effect |
| --- | --- |
| `HELP` or `?` | List the available commands |
| `POS` | Print the current fix immediately |
| `STATUS` | Print `AEGIS:STATE:` with live counters |
| `FREQ?` | List every configured frequency |
| `FREQ 433.500` | Set the first (desired) frequency, persisted to NVS |
| `WPM 14` | Set Morse speed (5-40), persisted |
| `MODE BEACON` | Switch mode and reboot: `BEACON`, `SEARCH`, `CONFIG`, `EMERGENCY` |

### `FREQ` details

The frequency must be between 410 and 525 MHz, matching the SX1262's range
and the legal 433 MHz ISM band the project targets. The value is written to
`freqs[0]` so it becomes the beacon's primary transmit frequency, and is
persisted, surviving deep sleep and reboots.

### `MODE` details

`MODE BEACON`, `MODE SEARCH` and `MODE CONFIG` are persisted as the boot mode.
`MODE EMERGENCY` activates the emergency state (maximum power, SOS payload)
and is never persisted. Every mode change reboots the device, so expect the
`AEGIS:HELLO:` line afterwards.

## Why a text protocol

A text protocol with a distinctive prefix is easy to parse from any language
(the bridge is under 400 lines of Python), easy to debug by eye in a serial
monitor, and immune to ANSI escape codes because `AEGIS:` lines are printed
with plain `Serial.printf`, not the colored log macros. The bridge ignores
everything that is not an `AEGIS:` line, so the full debug log can keep
running alongside it.

## Using it with any serial monitor

- Arduino IDE Serial Monitor: set 115200 baud, `Both NL & CR`.
- PlatformIO Monitor: `pio device monitor -b 115200`.
- `screen /dev/ttyUSB0 115200` on macOS/Linux.
- `esptool.py --port COM3 read_flash_status` is unrelated; use any terminal
  emulator for the protocol.