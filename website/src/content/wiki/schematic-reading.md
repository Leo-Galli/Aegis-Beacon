---
title: Schematic Reading
description: "Reading the beacon's schematic: power rails, signal nets, and the five checks that catch wiring errors before soldering."
---

# Schematic Reading

A schematic is a map of the circuit. This page teaches the beacon's schematic in the terms that matter: rails, nets, and the five checks that catch most mistakes.

## The layers of a schematic

| Layer | What it shows |
| --- | --- |
| Power rails | The 3.3 V and battery paths, regulators, decoupling |
| Signal nets | UART (GPS), I2C (OLED), SPI (radio), GPIO (buttons, LED) |
| Ground | The return path for everything |

## The beacon's nets

| Net | Pins | See |
| --- | --- | --- |
| UART0 | ESP32 TX/RX to GPS | [GPS Integration](gps-integration) |
| I2C | SDA/SCL to OLED | [OLED Display](oled-display) |
| SPI | MOSI/MISO/SCK/NSS to radio | [E22 Module Pinout](e22-module-pinout) |
| GPIO | Buttons, LED, buzzer | [GPIO Pin Map](gpio-pin-mapping) |

## The five checks

Before soldering anything:

1. **Polarity**: every electrolytic capacitor, diode and the battery: the + and - match the silkscreen.
2. **Power short check**: with the multimeter, no continuity between 3.3 V and ground.
3. **Signal crossings**: two signal nets must never share a pad; check the schematic, not the solder.
4. **Pull resistors**: every button line has its pull (see [Button System Details](button-system-details)).
5. **The radio's NSS**: the chip-select line is unique to the radio; a shared NSS is a classic LoRa failure.

## Reading symbols

- Ground: the stack of decreasing lines, the most important symbol on the page.
- Power: the labeled rail stub; find every instance of the 3.3 V symbol before tracing a fault.
- The SX1262's pin names come straight from its datasheet (see [Datasheet Reading](datasheet-reading)).

## Related pages

- [Circuit Description](circuit-description) for the project's circuit
- [GPIO Pin Map](gpio-pin-mapping) for the pin table
- [Datasheet Reading](datasheet-reading) for the module datasheets