---
title: ESP32 Power Input
description: How the DevKit V1 is powered, what the AMS1117 does, and the safe ways to feed it from battery, USB, or a supply.
---

# ESP32 Power Input

The DevKit V1 board includes an AMS1117-3.3 LDO regulator, so the power path matters: you feed it 5 V and it produces 3.3 V.

## The onboard regulator

The AMS1117 takes 5 V (from USB VBUS or the 5V pin) and outputs a clean 3.3 V rail. The radio, OLED, GPS, and logic all run from this rail.

- Input range: roughly 4.5-7 V (5 V nominal).
- Output: 3.3 V at up to 800 mA (derated with heat).
- The beacon's radio PA can draw bursts that the regulator handles easily.

## Powering from USB

Plug the data cable into the board's USB port. The AMS1117 regulates VBUS to 3.3 V. This is the standard bench configuration.

## Powering from the battery

The battery path in this design is: 18650 → TP4056 → BAT+ → 5V/VBUS pin on the DevKit (through the AMS1117) → 3.3 V.

This works because the TP4056 BAT+ sits at 3.7-4.2 V, which is below the 5 V nominal but within the AMS1117's dropout tolerance in practice. The 3.3 V rail remains valid down to about 3.7 V on BAT+, which matches the cell's working range.

## What not to do

- Do not feed 5 V directly into the 3V3 pin. The AMS1117 output is not designed to be driven and the ESP32 is not 5 V tolerant on power.
- Do not connect a cell to both the TP4056 input and the ESP32 5V pin without the module between them.
- Do not run the radio from the 3.3 V regulator if you measure sag below 3.2 V during TX: check the cell or the input wiring.

## Measuring

- 3V3 to GND: 3.3 V.
- BAT+ to GND: 3.7-4.2 V depending on cell state.
- During TX the 3V3 rail should not sag more than ~0.1 V.