---
title: "GPIO Pin Map Reference"
description: "One consolidated table of every ESP32 pin used by the beacon, with function, direction and notes"
---

# GPIO Pin Map Reference

## Overview

This is the consolidated pin reference for the beacon. It brings together the radio, GPS, OLED, buttons, status LED, and any other GPIO the firmware uses, in one place. Use it when wiring the board or checking a clone layout.

Pin numbers follow the ESP32 package used on the dev board. Not every dev board maps pins identically; confirm against your board's silkscreen.

## Full Pin Table

| Function | GPIO | Direction | Notes |
|---|---|---|---|
| Radio SCK | 18 | output | SPI clock |
| Radio MISO | 19 | input | SPI MISO |
| Radio MOSI | 23 | output | SPI MOSI |
| Radio CS | 5 | output | chip select |
| Radio RST | 14 | output | reset |
| Radio BUSY | 21 | input | must be wired |
| Radio DIO1 | 2 | input | RX/TX events |
| Radio TCXO | — | power | 1.6V if present |
| GPS TX | 12 | output | ESP TX to GPS RX |
| GPS RX | 22 | input | ESP RX from GPS TX |
| GPS VCC | 3.3V | power | 3.3V only |
| OLED SCK | 15 | output | SPI clock for OLED |
| OLED SDA | 13 | output | SPI MOSI for OLED |
| OLED RES | 4 | output | reset |
| OLED DC | 16 | output | data/command |
| OLED CS | 17 | output | chip select |
| SW_MODE | 33 | input | mode button |
| SW_SEL | 32 | input | select button |
| SW_UP | 35 | input | up button |
| SW_DN | 34 | input | down button |
| Status LED | — | output | onboard or external |
| Battery ADC | — | input | battery voltage read |

A few pins are labeled with their function rather than a fixed number where the implementation uses a board-specific pad or an onboard resource. Confirm on your schematic.

## Direction Notes

- GPIO 34 and GPIO 35 are input-only on many ESP32 packages. That is why the down button is on 34 and the up button is on 35: they only need to read a press.
- GPIO 22 is used for GPS RX on the current firmware because it works as an ESP TX on the chosen UART. Earlier prototype wiring put the GPS RX on 34, which caused a pin-side error; the current assignment fixes that.
- The radio BUSY pin is input-only in function but must be connected to a real GPIO so the library can read it.

## SPI Bus Separation

The beacon uses two SPI buses:

- The radio uses SPI on the pins in the table above.
- The OLED uses its own SPI pins, separate from the radio.

This keeps the OLED from interfering with the radio during TX. Do not share the radio's SPI pins with the OLED.

## UART Separation

The GPS uses UART2, separate from the USB serial console. This keeps GPS NMEA data off the debug console and lets the USB serial remain available for logging.

## Button GPIOs

The four buttons use the GPIOs in the table. Their firmware behavior is:

- SW_MODE on 33.
- SW_SEL on 32.
- SW_UP on 35.
- SW_DN on 34.

If you clone the board, keep these assignments unless you also update the firmware pin definitions.

## Safety Notes

- Do not drive 5V into a 3.3V pin.
- Do not leave the radio BUSY pin floating.
- Keep the GPS power at 3.3V.

## Related Pages

- [GPIO Pin Map](/wiki/gpio-pin-mapping) — the board-level pin mapping.
- [Wiring & Connectors](/wiki/wiring-and-connectors) — how to make the connections.
- [NEO-6M GPS Module](/wiki/nx130-gps-module) — GPS pin details.
- [Radio Library and SX1262](/wiki/radio-library-and-sx1262) — radio pin details.
