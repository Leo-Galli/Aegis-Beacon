---
title: E22 Module Pinout
description: "Every pin of the E22-400M30S explained: power, SPI, BUSY, DIO1, and the SMA antenna connection."
---

# E22 Module Pinout

The E22-400M30S is the radio heart of the beacon. Knowing every pin prevents the classic wiring mistakes.

## The pins

| Pin | Function | Beacon GPIO |
|-----|----------|-------------|
| VCC | 3.3 V supply | 3V3 |
| GND | Ground | GND |
| SCK | SPI clock | GPIO 18 |
| MISO | SPI data out | GPIO 19 |
| MOSI | SPI data in | GPIO 23 |
| NSS / CS | Chip select (active low) | GPIO 5 |
| RESET | Active low reset | GPIO 14 |
| BUSY | Status output (mandatory) | GPIO 21 |
| DIO1 | TX/RX done IRQ | GPIO 2 |
| TXEN / RXEN | PA control (internal) | N/C |

## VCC and GND

3.3 V only. The module contains an SX1262 plus a power amplifier; never feed it 5 V. Use short, thick wires for VCC/GND because the PA draws bursts of current.

## The SPI bus

The module uses the ESP32's hardware VSPI: SCK=18, MISO=19, MOSI=23, CS=5. The OLED deliberately uses *software* SPI (15/13/4/16/17) so the two devices never fight over the bus.

## BUSY - the mandatory pin

BUSY goes high while the SX1262 is busy (e.g. during a command, a calibration, or a transmission). RadioLib polls it before every SPI transfer. If BUSY is not wired to GPIO 21, the first radio call hangs forever. This is the most common single cause of "beacon does nothing after boot".

## DIO1

DIO1 is the interrupt output: it pulses on TX/RX complete and on timeout. The firmware uses it for transmission timing. It is wired to GPIO 2.

## RESET

Active-low hardware reset. The firmware pulses it during initialization to put the SX1262 in a known state.

## TXEN / RXEN

On the E22 module these are pulled internally to enable the PA for TX and the LNA for RX automatically. Do not connect them.

## The antenna

The SMA connector expects a 433 MHz antenna. The module's PA reaches +30 dBm on the datasheet, but the beacon firmware caps TX at +22 dBm (RadioLib's SX1262 limit before the external PA stage).