---
title: "LED Status Indicators"
description: "Red and blue LEDs: what the blink patterns mean in every mode"
---

# LED Status Indicators

## Overview

Two LEDs give instant mode feedback at a glance: red for BEACON, blue for SEARCH. This page covers every blink pattern.

## LED Wiring

| LED | GPIO | Resistor |
|-----|------|----------|
| LED_RED (BEACON) | 27 | 330 ohm to GND |
| LED_BLUE (SEARCH) | 26 | 330 ohm to GND |

## Patterns by Mode

| Mode | LED pattern | Meaning |
|------|-------------|---------|
| BEACON | Red blink with each TX | Transmitting |
| SEARCH | Blue slow blink | Scanning |
| SEARCH | Blue fast blink | Signal detected |
| CONFIG | Both blink | WiFi AP active |
| EMERGENCY | Red fast | Emergency TX |
| Boot | Both briefly | Power-on self test |

## Reading the Rhythm

The LED rhythm mirrors the radio activity:

- In BEACON, red blinks with the payload keying, so you can watch TX without the OLED.
- In SEARCH, blue blinks slow on quiet passes and speeds up when the RSSI crosses the threshold.

## Related Pages

- [Operating Modes](/wiki/operating-modes)
- [BEACON Mode](/wiki/mode-beacon)
- [SEARCH Mode](/wiki/mode-search)
- [GPIO Pin Map](/wiki/gpio-pin-mapping)
