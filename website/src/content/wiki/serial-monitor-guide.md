---
title: Serial Monitor Guide
description: "Using the serial monitor effectively: baud rates, the debug build's log levels, and reading the beacon's output."
---

# Serial Monitor Guide

The serial port is the beacon's window into its own head. The debug build prints a structured log that turns "it does something weird" into a specific diagnosis.

## Connecting

| Tool | Command |
| --- | --- |
| PlatformIO | `pio device monitor` |
| Arduino CLI | `arduino-cli monitor -p <port> -c baudrate=115200` |
| Arduino IDE | Tools > Serial Monitor |

The baud rate is 115200 for the debug build. Wrong baud rate = garbage characters.

## The log format

```
[BOOT]  Firmware v5.5.0, ESP32 rev 3
[CFG]   Loaded config, version 2
[GPS]   No fix yet, 3 satellites
[RF]    TX burst complete, freq 433.920, power +17
[ERR]   E03: GPS UART timeout
```

The prefix brackets name the subsystem: `BOOT`, `CFG`, `GPS`, `RF`, `OLED`, `BTN`, `ERR`. See [Serial Debug System](serial-debug-system) for the full list.

## Reading the boot sequence

A healthy boot prints, in order: the firmware version, config load, radio init (with calibration), GPS status, and the first mode entry. Anything missing in that sequence points at the subsystem that stayed silent.

## The commands

The debug build accepts typed commands:

| Command | What it does |
| --- | --- |
| `config dump` | Print every setting |
| `config set <key> <value>` | Change a setting |
| `status` | Current mode, battery, GPS |
| `tx now` | Fire one test burst |

These work over any serial terminal; they are the fastest configuration path for a displayless build (see [Displayless Build](displayless-build)).

## Log level

The debug build logs at INFO by default; `log level debug` adds the per-millisecond radio and GPS detail. Use it sparingly: at 115200 baud the verbose log can delay the real timing.

## Related pages

- [Serial Debug System](serial-debug-system) for the full system
- [ESP32 Serial Debug](esp32-serial-debug) for the wiring
- [Firmware Error Codes](firmware-error-codes) for the codes