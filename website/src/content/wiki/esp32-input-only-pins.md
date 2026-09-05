---
title: ESP32 Input-Only Pins
description: GPIO 34, 35, 36 and 39 have no output drivers and no pull-ups. What that means for the buttons and the ADC.
---

# ESP32 Input-Only Pins

Four GPIOs on the ESP32 are input-only: **GPIO 34, 35, 36, 39**. They cannot drive outputs and have no internal pull-ups. The beacon uses three of them, so this matters.

## The pins

| GPIO | Use in beacon | Direction |
|------|---------------|-----------|
| 34 | SW_DN button | Input only |
| 35 | SW_UP button | Input only |
| 36 | Battery divider ADC | Input only |
| 39 | TP4056 STDBY detect | Input only |

## What "input-only" means

- You cannot light an LED or drive a signal from these pins.
- There is no internal pull-up or pull-down; a floating input reads random values.
- They tolerate 0-3.3 V only (no 5 V).

## The button consequence

SW_UP (GPIO 35) and SW_DN (GPIO 34) need **external 10 kΩ pull-ups** to 3.3 V, or they float. The buttons then pull the pin low when pressed. This is documented in the wiring tables and is a top-ten build mistake.

## The ADC consequence

GPIO 36 (SVP) is the battery divider input. It reads half of BAT+ through the 100 kΩ/100 kΩ divider. No pull-up is needed or wanted: the divider itself sets the voltage.

## The STDBY consequence

GPIO 39 (SVN) detects the TP4056 STDBY signal, which is LOW while charging. This pin is optional; if you do not wire it, the firmware simply never sees "charging".

## Checking your wiring

- Measure GPIO 35 with no button pressed: should read 3.3 V (pulled up).
- Press the button: reads 0 V.
- A floating reading (somewhere in between, jumping around) means the pull-up is missing.