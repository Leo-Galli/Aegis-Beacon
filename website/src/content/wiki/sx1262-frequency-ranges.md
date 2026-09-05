---
title: SX1262 Frequency Ranges
description: The frequency capability of the SX1262 chip and the E22 module variants, and why the module's range limits what you can configure.
---

# SX1262 Frequency Ranges

The SX1262 chip is a wide-band radio; the E22 modules are tuned, filtered and amplified for a specific slice of it. The module's range, not the chip's, is what the firmware can actually use.

## The chip versus the module

| Component | Frequency range |
| --- | --- |
| SX1262 bare chip | 150 MHz - 960 MHz |
| E22-400M30S module | 410 - 493 MHz |
| E22-900M30S module | 850.125 - 929.125 MHz |

The 433 MHz beacon uses the 400 MHz variant. A 900 MHz module cannot be configured to 433 MHz, whatever the chip could do in theory: the module's front-end filters and the PA matching are built for its band.

## What the firmware enforces

The configuration validates the frequency against the module's range before accepting it:

- Below the range: rejected with a configuration error (see [Firmware Error Codes](firmware-error-codes))
- Above the range: rejected the same way
- Inside the range but outside the ISM band: accepted with the legal warning, for licensed use

## The calibration trap

The SX1262 self-calibrates at boot against the module's crystal. If the crystal frequency differs from the firmware's assumed value, the radio shifts off-frequency: the [SX1262 Registers](sx1262-registers) page covers the frequency-step math and the symptom.

## The PMR446 question

PMR446 (446 MHz) sits inside the 400 MHz module's range. The beacon can receive it in SEARCH mode but does not transmit there: PMR446 is a separate allocation with its own rules (see [PMR446 Deep Dive](pmr446-deep-dive)).

## Related pages

- [E22 Radio Module Guide](e22-radio-module-guide) for the module
- [Frequency Compatibility](frequency-compatibility) for the band
- [SX1262 Registers](sx1262-registers) for the configuration