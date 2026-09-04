---
title: "ESP32 Board Variants"
description: "DevKit V1, WROOM vs WROVER, 30 vs 38 pin, and what to check on clone boards"
---

# ESP32 Board Variants

## Overview

Not every ESP32 development board is the same. This project is written for the ESP32 DevKit V1 style board with the WROOM-32 module, but knowing your exact variant prevents confusing failures.

## Module vs Dev Board

| Term | Meaning |
|------|---------|
| ESP32-WROOM-32 | The radio module (chip + flash + antenna) |
| DevKit V1 | The breakout board with USB and LDO |
| SuperMini / C3 | Different chips - NOT compatible with v5.4 firmware |

## WROOM vs WROVER

| Variant | Extra | Used here? |
|---------|-------|------------|
| WROOM-32 | None | Yes - this is the target |
| WROVER | PSRAM | Not needed; `BOARD_HAS_PSRAM=0` is set in the build |

## 30-Pin vs 38-Pin

| Header | Pins | Fits this build |
|--------|------|-----------------|
| DevKit V1 30-pin | 30 | Yes, the reference layout |
| DevKit V1 38-pin | 38 | Also works if you map GPIOs carefully |

The DATASHEET and GPIO pin map target the 30-pin layout. On a 38-pin board the extra pins are just duplicates and additional GPIOs; the pins this project uses are present on both.

## Clone Board Checks

| Check | What to verify |
|-------|----------------|
| USB chip | CP2102 or CH340 enumerated |
| Flash size | `4MB` reported in the boot log |
| PSRAM | None expected on WROOM |
| Antenna | Present; do not cover it with metal |
| LDO output | 3.30 V on the 3V3 pin |

## Related Pages

- [ESP32 Board Guide](/wiki/esp32-board-guide)
- [GPIO Pin Map](/wiki/gpio-pin-mapping)
- [Shopping List](/wiki/shopping-list)
- [Software Build Process](/wiki/software-build-process)
