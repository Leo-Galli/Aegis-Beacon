---
title: "E22 Radio Module Guide"
description: "Ebyte E22-400M30S in depth: SX1262 inside, SMA, TCXO, PA, and why BUSY is mandatory"
---

# E22 Radio Module Guide

## Overview

The Ebyte **E22-400M30S** is a compact UHF transceiver module built around the Semtech SX1262 (or the compatible LLCC68) with an onboard power amplifier, TCXO and SMA connector. It is the recommended radio for the Aegis-Beacon because it turns the SX1262 into a solder-friendly breakout with a real antenna port.

## Module Facts

| Parameter | Value | Notes |
|-----------|-------|-------|
| Chip inside | SX1262 or LLCC68 | Same driver family |
| Frequency range | 410-525 MHz | Hardware filter limit |
| PA output | up to +30 dBm | RadioLib caps at +22 dBm |
| Frequency accuracy | +-1 ppm | TCXO onboard |
| Antenna | SMA female | External whip recommended |
| Control bus | SPI | VSPI on the ESP32 |
| TXEN / RXEN | N/C (-1) | Pulled internally on the E22 |

## Why CW Instead of OOK

The SX1262 does not support OOK modulation. The firmware keys a continuous FSK carrier instead:

- Carrier on: `transmitDirect()`
- Carrier off: `standby()`

At the receiver this is indistinguishable from OOK. Any AM-mode scanner or SDR hears clean Morse.

## Mandatory Pins

| Module pin | ESP32 GPIO | Why it matters |
|------------|------------|----------------|
| BUSY | 21 | RadioLib polls it before every SPI transfer |
| DIO1 | 2 | TX/RX done and timeout interrupt |
| NSS/CS | 5 | Chip select, active LOW |
| RESET | 14 | Active LOW hardware reset |

> [!WARNING]
> BUSY is not optional on the SX1262. If GPIO 21 is not wired to BUSY, the firmware hangs on the first radio call. This is the single most common build error.

## The +30 dBm PA

The E22 PA sits between the SX1262 and the SMA connector:

- RadioLib's maximum setting is +22 dBm (the chip's internal PA limit).
- The E22 adds another stage, so total output can reach +30 dBm.
- Use the module's +30 dBm capability only when legal and necessary; EMERGENCY mode does so by design.

## Frequency Variants

Ebyte sells the same board for several bands. The 433 MHz variant is labeled **E22-400M30S**. Do not buy the 470-510 MHz or 850+ MHz versions.

## Related Pages

- [RF & Link Budget](/wiki/rf-design-link-budget)
- [Antenna Selection](/wiki/antenna-types)
- [GPIO Pin Map](/wiki/gpio-pin-mapping)
- [Shopping List](/wiki/shopping-list)
