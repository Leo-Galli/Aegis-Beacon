---
title: Arduino CLI Guide
description: "Building the firmware with the Arduino CLI instead of PlatformIO: setup, board package, compile, and flash commands."
---

# Arduino CLI Guide

PlatformIO is recommended, but the Arduino CLI is the official, scriptable alternative: lighter, closer to the Arduino IDE, and fine for anyone who prefers the toolchain the Arduino world ships.

## Setup

```bash
arduino-cli config init
arduino-cli core update-index
arduino-cli core install esp32:esp32
```

The ESP32 core package is large; the install takes a few minutes.

## The daily commands

| Command | Purpose |
| --- | --- |
| `arduino-cli board list` | List connected boards |
| `arduino-cli compile --fqbn esp32:esp32:esp32` | Build |
| `arduino-cli upload -p <port> --fqbn ...` | Flash |
| `arduino-cli monitor -p <port> -c baudrate=115200` | Serial monitor |

## Library management

```bash
arduino-cli lib install "<library>@<version>"
```

Pin versions exactly as PlatformIO does: `@2.1.0` style, not bare names. The libraries used are listed in the [Software Build Process](software-build-process) page.

## The differences from PlatformIO

| Aspect | Arduino CLI | PlatformIO |
| --- | --- | --- |
| Board config | In `--fqbn` flags | In `platformio.ini` |
| Environments | Scripted by you | First-class |
| Unit tests | Not built in | `pio test` |
| CI integration | Manual | Native |

If you are happy with one, stay with it; both produce the same firmware. Switch only if a specific feature (tests, environments) pulls you.

## Related pages

- [Software Build Process](software-build-process) for the build steps
- [Upload and Monitor](upload-and-monitor) for flashing
- [PlatformIO Guide](platformio-guide) for the recommended path