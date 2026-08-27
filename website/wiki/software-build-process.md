# Software Build Process

## Overview

The Aegis-Beacon firmware can be built using either Arduino IDE or PlatformIO. Both methods produce identical output.

## Prerequisites

### Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| **Git** | Latest | Clone repository |
| **Arduino IDE** | 2.x | IDE (optional) |
| **PlatformIO** | Latest | Build system (recommended) |

### Hardware Requirements

- ESP32 DevKit V1 (30-pin)
- USB-C cable for programming

## Option 1: PlatformIO (Recommended)

### Installation

1. Install VS Code
2. Install PlatformIO extension
3. Clone repository:

```bash
git clone https://github.com/Leo-Galli/Aegis-Beacon.git
cd Aegis-Beacon
```

### Build Configuration

File: `platformio.ini`

```ini
[env:esp32devkitv1]
platform  = espressif32
board     = esp32dev
framework = arduino

lib_deps =
    jgromes/RadioLib @ ^6.6.0
    bblanchon/ArduinoJson @ ^7.0.0
    olikraus/U8g2 @ ^2.34.0
    mikalhart/TinyGPSPlus @ ^1.0.3

monitor_speed = 115200
upload_speed  = 921600

build_flags =
    -DBOARD_HAS_PSRAM=0

board_build.flash_size = 4MB
```

### Build Commands

```bash
# Build firmware
pio run

# Upload to device
pio run --target upload

# Monitor serial output
pio device monitor --baud 115200

# Clean build
pio run --target clean
```

> [!TIP]
> PlatformIO automatically downloads and installs all dependencies. No manual library installation required.

## Option 2: Arduino IDE

### Installation

1. Download Arduino IDE 2.x
2. Add ESP32 board support:

```
File → Preferences → Additional boards URL:
https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
```

3. Install ESP32 board:

```
Tools → Board Manager → search "esp32" → install "esp32 by Espressif"
```

### Library Installation

```
Sketch → Include Library → Manage Libraries
```

Install:
- `RadioLib` by Jan Gromes (>= 6.0.0)
- `ArduinoJson` by Benoit Blanchon (>= 7.0.0)
- `U8g2` by oliver (>= 2.34.0)
- `TinyGPS++` by Mikal Hart (>= 1.0.3)

### Build Process

1. Open `AegisBeacon.ino`
2. Select board: `Tools → Board → ESP32 Dev Module`
3. Select port: `Tools → Port → COMx`
4. Upload: Click Upload button (→)

## Build Output

### Successful Build

```
RAM:   [========= ]  89.2% (used 463876 bytes from 520192 bytes)
Flash: [=======   ]  71.4% (used 2985000 bytes from 4194304 bytes)
```

### File Locations

| File | Location |
|------|----------|
| **Firmware binary** | `.pio/build/esp32dev/firmware.bin` |
| **Bootloader** | `.pio/build/esp32dev/bootloader.bin` |
| **Partition table** | `.pio/build/esp32dev/partitions.bin` |

## OTA Updates (Future)

> [!NOTE]
> OTA (Over-The-Air) updates are planned for v6.0. Currently requires USB connection.

## Debug Builds

### Enable Verbose Debug

In `config.h`:

```cpp
#define DEBUG_VERBOSE   1   // Per-symbol Morse + RadioLib codes
```

### Serial Monitor Settings

| Setting | Value |
|---------|-------|
| **Baud rate** | 115200 |
| **Data bits** | 8 |
| **Parity** | None |
| **Stop bits** | 1 |

## CI/CD Pipeline

### GitHub Actions

File: `.github/workflows/firmware-ci.yml`

```yaml
name: Firmware CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/cache@v3
        with:
          path: |
            ~/.platformio
          key: ${{ runner.os }}-pio-${{ hashFiles('platformio.ini') }}
      - uses: actions/setup-python@v4
        with:
          python-version: '3.x'
      - name: Install PlatformIO
        run: pip install platformio
      - name: Build
        run: pio run
```

### Checks Performed

| Check | Description |
|-------|-------------|
| **Syntax** | C++ compilation |
| **Dependencies** | Library resolution |
| **Binary size** | Flash/RAM usage |
| **PlatformIO config** | Valid configuration |

> [!TIP]
> All CI checks must pass before merging pull requests. Run `pio run` locally before committing.
