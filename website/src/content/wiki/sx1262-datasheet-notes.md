---
title: "SX1262 Datasheet Notes"
description: "The key numbers from the SX1262 datasheet that matter for this beacon: frequency, power, sensitivity, current and timings"
---

# SX1262 Datasheet Notes

## Overview

The SX1262 is the radio in this beacon. This page collects the datasheet numbers that matter for the build, so you can see what the chip is rated for and where the firmware's choices come from.

The SX1262 is a LoRa transceiver covering the sub-GHz bands the beacon uses. The datasheet is the authority for the limits below; where the firmware makes a choice, it is noted.

## Frequency

The SX1262 operates in the sub-GHz ISM and related bands. For this project, the relevant region is the 433 MHz and 868 MHz area, depending on local regulation and antenna choice.

The chip's internal PLL and reference clock support the frequencies used by the beacon. The firmware sets the operating frequency per the user's selected channel; the datasheet defines what the chip can do, not which frequency is legal in a given country.

## TX Power

The SX1262 supports TX power from low values up to +22 dBm under RadioLib control. The datasheet specifies a higher power figure under certain conditions, but the usable range in this firmware is bounded by the library's supported range and the board's power handling.

The default TX power is +17 dBm. Emergency mode uses the maximum the firmware allows.

If the board includes an external power amplifier, the radiated power can be higher than the chip's own output. The datasheet for the PA, not only the SX1262, then governs the final power and any compliance concerns.

## RX Sensitivity

The datasheet gives the SX1262 excellent receive sensitivity for LoRa, especially at lower data rates and with appropriate bandwidth and spreading factor. That is why it is a good choice for a beacon that must be heard at range.

Sensitivity depends on the LoRa parameters: bandwidth, spreading factor, coding rate, and frequency. There is no single "sensitivity" number for all configurations; the datasheet provides curves and typical values.

For the beacon's scan mode, the firmware uses RSSI-based detection, not LoRa demodulation. RSSI is less sensitive than a true LoRa decode, but the beacon is listening for energy above a threshold, not decoding packets.

## Current

The SX1262 has different current draws in different states:

- TX current rises with TX power.
- RX current is lower than TX.
- Sleep currents are very low.

The datasheet provides typical current figures for each state and TX power. For the beacon's battery budget, TX current during a beacon burst is the main radio contribution.

The firmware's deep sleep between beacon cycles is what makes runtime long; the radio is not left on continuously.

## Timings

The datasheet defines timing limits and recommended sequences for the radio:

- Startup and reset sequences.
- TX to RX switching.
- Busy pin behavior during transactions.
- DIO1 event timing.

These are handled by RadioLib, which wraps the datasheet sequences. The firmware does not need to implement the low-level timing itself, but it depends on the library doing it correctly.

## BUSY and DIO1

The BUSY pin is used by the library to know when the radio is busy with a transaction. The DIO1 pin is used for interrupt-driven RX/TX events.

The wiring guide requires both to be connected. The datasheet explains why: without BUSY, the library cannot reliably know when the chip is free; without DIO1, interrupt-driven operations do not work as intended.

## Temperature

The datasheet specifies operating temperature range and any power derating at temperature extremes. For a device deployed outdoors, temperature matters: battery performance, display visibility, and radio behavior can all shift.

The beacon is designed for field use, so the datasheet's temperature notes are relevant, though the dominant outdoor concern is usually battery and enclosure behavior rather than the chip itself.

## TCXO

Some boards use a TCXO for frequency accuracy. The datasheet covers TCXO drive requirements, including the supply voltage for the oscillator.

If the board uses a TCXO, the firmware enables it at the correct voltage. A TCXO improves frequency stability, which is helpful when the beacon must be heard on a specific channel.

## Related Pages

- [Radio Library and SX1262](/wiki/radio-library-and-sx1262) — how the firmware uses the chip.
- [Antenna Design](/wiki/antenna-design) — the antenna side of radiated power.
- [Frequency Compatibility](/wiki/frequency-compatibility) — which frequencies are legal.
