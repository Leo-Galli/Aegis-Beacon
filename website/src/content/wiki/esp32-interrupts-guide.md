---
title: ESP32 Interrupts Guide
description: "How the firmware uses interrupts: the button edges, the radio's DIO line, and the rules that keep interrupts honest."
---

# ESP32 Interrupts Guide

Interrupts are how the ESP32 notices the world without polling it: a button press, a radio event. The firmware uses them sparingly, and this page is why.

## The interrupts in use

| Source | Pin | What it signals |
| --- | --- | --- |
| Button edges | Button GPIOs | Press events for the state machine (see [Firmware Buttons](firmware-buttons)) |
| Radio DIO1 | A GPIO | Packet received or transmitted (see [Radio Library and SX1262](radio-library-and-sx1262)) |
| RTC (sleep) | Internal | The wake timer (see [ESP32 RTC Notes](esp32-rtc-notes)) |

## The interrupt rules

1. **Keep handlers tiny**: set a flag, wake the task. The radio and display work happen in the main loop, never inside an ISR.
2. **No I2C/SPI in ISRs**: the display and the radio are touched from the loop, not from the interrupt.
3. **Debounce in software**: the button ISR sets a pending flag; the loop debounces it (see [Button Troubleshooting](button-troubleshooting)).

## The radio interrupt

The SX1262 raises DIO1 when a packet completes. The handler sets a flag and the loop reads the packet. Missing this interrupt (wrong pin, unconfigured mask) produces the classic symptom: the radio receives but the firmware never notices. See [SX1262 Registers](sx1262-registers) for the IRQ mask commands.

## Interrupt vs polling

Why not poll everything? The button polling would add no real cost, but the radio must be serviced within its timing windows, and polling risks missing an RX window. Interrupts for the radio, polling for the buttons: that split is deliberate (see [Firmware Main Loop](firmware-main-loop)).

## Related pages

- [Firmware Buttons](firmware-buttons) for the button side
- [SX1262 Registers](sx1262-registers) for the radio side
- [GPIO Pin Map](gpio-pin-mapping) for the pin assignments