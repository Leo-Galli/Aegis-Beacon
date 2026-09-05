---
title: PlatformIO Guide
description: "Building the firmware with PlatformIO: project setup, environments, board definitions, and the commands for every build task."
---

# PlatformIO Guide

PlatformIO is the recommended way to build the firmware. It manages the toolchain, the board definitions, and the libraries, and it builds from the command line, which is what CI needs (see [Software Build Process](software-build-process)).

## The project layout

```
firmware/
  platformio.ini      # build configuration
  src/                # the firmware source
  lib/                # project-local libraries
  include/            # headers
```

The `platformio.ini` file declares the environments:

```ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200
```

## The daily commands

| Command | Purpose |
| --- | --- |
| `pio run` | Build |
| `pio run -t upload` | Build and flash |
| `pio device monitor` | Serial monitor |
| `pio run -t clean` | Clean build artifacts |
| `pio test` | Run the unit tests |

## Environments

Multiple `[env:...]` sections build the same source for different targets: the normal build, a debug build with the serial log enabled, and a test build. Selecting one:

```
pio run -e debug
```

The wiki's [Serial Debug System](serial-debug-system) page describes the debug build.

## Board definitions

PlatformIO ships definitions for the standard ESP32 boards. Clones may need a custom `board_build` section: flash size, flash mode, and partition table. The [Board Variants and Clones](board-variants-and-clones) page lists the known cases.

## Libraries

Dependencies are declared in `platformio.ini` with `lib_deps`. The beacon pins its library versions so a library update cannot silently change behavior. If a build suddenly breaks after an update, check the locked versions first.

## Related pages

- [Software Build Process](software-build-process) for the CI build
- [ESP32 Board Guide](esp32-board-guide) for the board side
- [Upload and Monitor](upload-and-monitor) for flashing