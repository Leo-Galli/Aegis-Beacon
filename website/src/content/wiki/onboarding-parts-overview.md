---
title: Parts Overview
description: Every component in the beacon explained in plain language, before you buy anything.
---

# Parts Overview

Before buying anything, understand what each part does. There are nine functional blocks.

## The microcontroller: ESP32 DevKit V1

The brain. A dual-core 240 MHz processor with built-in WiFi and Bluetooth. The beacon runs entirely on it: the radio control, the Morse encoder, the OLED, the GPS parsing, and the battery monitor.

## The radio: Ebyte E22-400M30S

A complete 433 MHz radio module built around the SX1262 chip, with an onboard power amplifier that can reach +30 dBm. This is what actually transmits the Morse signal.

## The display: SSD1309 OLED 2.42"

A 128x64 monochrome OLED on SPI. Shows the mode, frequency, TX progress, battery level, and the scrolling payload. The 2.42" diagonal is much more readable outdoors than the common 0.96" panels.

## The GPS: NEO-6M module

A small GPS receiver on UART. When enabled, it appends your coordinates to the Morse payload so rescuers know where you are.

## The battery system: 18650 + TP4056

A single 18650 Li-ion cell (3.7 V, ~3000 mAh) powers everything. The TP4056 module charges it over USB-C and provides protection against over-charge and over-discharge.

## The audio: 3.5 mm jack + DAC

GPIO 25 is a native DAC. The firmware generates Morse clicks and scan tones that you can hear on any wired headphone.

## The controls: 4 tactile buttons

MODE, SEL, UP, DN. They cycle modes, enter config, and adjust volume and Morse speed live.

## The indicators: red and blue LEDs

Red blinks in BEACON, blue blinks in SEARCH. Fast blinking patterns signal emergency or a detected signal.

## The antenna: quarter-wave wire or whip

About 17.3 cm at 433 MHz. This is what your signal actually travels on; a badly connected antenna can cut range to a few meters.