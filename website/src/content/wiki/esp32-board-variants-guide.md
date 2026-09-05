---
title: ESP32 Board Variants
description: DevKit V1 vs other ESP32 development boards, 30 vs 38 pin, WROOM vs WROVER, and what to check on clones.
---

# ESP32 Board Variants

Not every ESP32 board is the same. This page covers the variants that work, the ones that do not, and what to verify on the board you bought.

## DevKit V1 (the reference board)

The beacon is designed around the **DevKit V1** layout with the standard 30-pin or 38-pin edge connectors. Both work; the 38-pin adds extra GPIOs that the beacon does not need but that some boards expose differently.

## WROOM vs WROVER

- **WROOM-32**: standard, 4 MB flash, no PSRAM. The beacon uses no PSRAM, so this is the correct and cheapest choice.
- **WROVER**: adds PSRAM and a different antenna layout. Works, but unnecessary.

## 30-pin vs 38-pin

The beacon's GPIO map (radio on VSPI, OLED on software SPI, GPS on UART2, buttons, ADC) exists on both. The 38-pin boards have extra pins that simply go unused. Check that the pins you need are actually broken out on your specific board: a few "38-pin" boards route GPIOs differently.

## ESP32-S2, S3, C3

These are different chips:

- **ESP32-C3**: used by v4.0. The v5.x firmware is compiled for the classic ESP32; it will not build or run correctly on a C3.
- **ESP32-S2/S3**: different architecture; the current firmware does not target them. Future versions may.

## What to check on clones

1. The USB chip (CH340 vs CP2102) - see the USB chips page.
2. The flash size: many clones ship 4 MB, some 16 MB; the firmware needs 4 MB minimum.
3. The crystal: genuine boards use a 40 MHz crystal; badly made clones may use 26 MHz and cause WiFi timing errors (rare).
4. The EN button and BOOT button actually work.

## The bottom line

Buy a DevKit V1 (WROOM-32, 30 or 38 pin, 4 MB flash). It is the exact hardware the firmware is tested on.