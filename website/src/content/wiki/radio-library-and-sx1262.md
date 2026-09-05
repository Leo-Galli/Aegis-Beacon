---
title: "Radio Library and SX1262"
description: "How the beacon talks to the SX1262 radio through RadioLib, the GPIO mapping, and the limits of TX power"
---

# Radio Library and SX1262

## Overview

The beacon transmits and receives on the 433 MHz and 868 MHz LoRa bands using an **SX1262** transceiver controlled through **RadioLib**. RadioLib is a cross-platform library for sub-GHz and 2.4 GHz transceivers; on the ESP32 it gives the firmware a clean API for frequency, bandwidth, spreading factor, TX power, and RX/TX state.

The SX1262 is a modern LoRa transceiver with better receive sensitivity and lower noise than the older SX127x family. It is the radio of choice for this project because it supports the frequency range the beacon needs and can be driven at higher power when paired with an external PA.

## Hardware Interface

The SX1262 is wired to the ESP32 as a SPI device with a few control lines.

| Signal | ESP32 pin | Notes |
|---|---|---|
| SCK | GPIO 18 | SPI clock |
| MISO | GPIO 19 | SPI MISO |
| MOSI | GPIO 23 | SPI MOSI |
| CS | GPIO 5 | chip select |
| RST | GPIO 14 | reset |
| BUSY | GPIO 21 | busy — must be wired |
| DIO1 | GPIO 2 | interrupt for RX/TX events |
| TCXO | 1.6V | TCXO enable, if used |

RadioLib talks to the chip over SPI and uses DIO1 for interrupt-driven RX/TX events.

## BUSY Pin Is Mandatory

The BUSY pin tells the host when the radio is busy with a transaction. If it is not wired, the radio can hang because the library waits for a busy indication that never comes. The wiring guide requires BUSY to be connected to a real ESP32 pin. Do not leave it floating.

## RadioLib Configuration

The firmware configures the radio for LoRa operation with parameters appropriate for long-range beacon and scan use:

- Frequency set per the user's selected channel.
- Bandwidth, spreading factor, and coding rate chosen for range and resilience.
- TX power set by the user, within the SX1262's own limits.
- CRC enabled so the receiver can reject corrupted frames.

The radio is initialized once and reused across beacon and search operations.

## TX Power

The SX1262 itself supports TX power in the range -9 dBm up to +22 dBm through RadioLib. The default is +17 dBm. The user sets TX power in CONFIG; the beacon respects that setting during normal operation.

Emergency mode overrides the setting and uses the maximum the radio supports — this is the high-power continuous SOS transmission.

If the board includes an external power amplifier, the actual radiated power can be higher than the SX1262 setting. The radio's own TX power setting is still the baseline; the external PA adds gain on top of that when enabled and wired.

## RX Path in Search Mode

In SEARCH mode the beacon scans a list of frequencies and listens for signals above the RSSI threshold. RadioLib provides the RX state and RSSI reading. The firmware:

- Sets the radio to the next frequency.
- Listens for the dwell time.
- Checks RSSI against the threshold.
- Records a hit if the signal is stronger than the threshold.

A hit is not the same as a decoded packet. The beacon's scan listens for energy above threshold; decoding a LoRa packet requires the right parameters on both ends.

## TX Path in Beacon Mode

In BEACON mode the firmware:

- Builds the Morse payload.
- Encodes it into on-off keying or a tone depending on configuration.
- Drives the radio to transmit with the configured power and pattern.
- Repeats per the configured repeat count and sleep interval.

The payload is Morse, not LoRa frames. The radio is used as a transmitter of a modulated tone or OOK, not as a LoRa packet link in beacon mode.

## Frequency Range and Band Plan

The SX1262 supports the sub-GHz ISM and licensed band range. The beacon's usable frequencies are constrained by regulation and by the antenna, not just by the radio. See [Frequency Compatibility](/wiki/frequency-compatibility) for the band limits and [Antenna Lengths](/wiki/antenna-lengths) for the matching between frequency and antenna.

## TCXO and Clock Stability

If the board uses a TCXO for the radio, the firmware enables it at the correct voltage. A stable clock helps frequency accuracy, which matters when the beacon must be heard on a specific channel. Without a TCXO, the SX1262 uses its internal reference, which is adequate for many uses but less precise.

## Related Pages

- [SX1262 Datasheet Notes](/wiki/sx1262-datasheet-notes) — the transceiver and its capabilities.
- [E22 Radio Module Guide](/wiki/e22-radio-module-guide) — the alternative module family.
- [Frequency Compatibility](/wiki/frequency-compatibility) — band limits and legal use.
- [Antenna Design](/wiki/antenna-design) — matching the radio to the antenna.
