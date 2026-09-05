---
title: Bench Power
description: Powering the beacon on the bench with a supply or power bank, and the voltages you should measure.
---

# Bench Power

For development you want controlled power, not a half-charged cell. This page covers bench supplies and power banks.

## Option 1: bench power supply

Set to 3.7-4.2 V with a current limit of 300 mA before connecting. Expect:

- Deep sleep: ~10 uA
- OLED on, radio idle: ~25-40 mA
- Transmitting: ~100-130 mA (ESP32 + PA at +17 dBm)

If the supply shows more than ~300 mA during TX, suspect a wiring fault or a bad PA configuration.

## Option 2: USB power bank

A power bank gives 5 V on USB. Feed that into the ESP32's 5V/VBUS pin (through the onboard AMS1117 to 3.3 V). Do **not** connect a 5 V power bank directly to the 3V3 rail.

Note: with the TP4056 not in the circuit, battery percentage reads from whatever voltage the divider sees. For bench work, that is fine: you mainly care about the radio and display.

## What to measure

| Point | Expected |
|-------|----------|
| ESP32 3V3 pin to GND | 3.3 V |
| TP4056 BAT+ (with cell) | 3.7-4.2 V |
| Divider midpoint (GPIO 36) | half of BAT+ |
| E22 VCC | 3.3 V |

## Current measurement

To measure true sleep current, put the multimeter in series with the battery (uA mode) during deep sleep. The 10 uA figure is the design target; 20-40 uA is normal with leaky modules, over 100 uA means something is staying awake.

## First power-on protocol

1. Measure 3V3 first, before connecting peripherals.
2. Connect display, check it initializes.
3. Connect radio, check BUSY settles.
4. Connect GPS last, and only if you are testing GPS.

This isolates a wiring error to the last thing you connected.