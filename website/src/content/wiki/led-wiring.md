---
title: LED Indicators Wiring
description: "The red and blue status LEDs: which GPIO, what resistor, and what the blink patterns mean."
---

# LED Indicators Wiring

Two LEDs give instant visual status: red for BEACON, blue for SEARCH. This page covers the wiring and the blink language.

## The circuit

| LED | GPIO | Series resistor |
|-----|------|-----------------|
| Red (BEACON) | GPIO 27 | 330 Ω to GND |
| Blue (SEARCH) | GPIO 26 | 330 Ω to GND |

Anode to GPIO through the resistor, cathode to GND. At 3.3 V a 330 Ω resistor gives about 6-8 mA, plenty bright for a 3 mm LED.

## Blink patterns

| Pattern | Meaning |
|---------|---------|
| Red slow blink | BEACON mode, transmitting cycle |
| Blue slow blink | SEARCH mode, scanning |
| Blue fast blink | Signal detected in SEARCH |
| Red fast blink | EMERGENCY mode |
| Both blinking | CONFIG mode (WiFi AP active) |

## Wiring mistakes to avoid

- Reversing anode/cathode: LED just stays dark. If both LEDs never light and the rest works, check polarity.
- Missing resistor: the LED draws too much current and can damage the GPIO. Always include the 330 Ω.
- Sharing one resistor: each LED needs its own series resistor.
- Using the input-only pins (34/35) for LEDs: they cannot drive outputs.

## Testing

With the multimeter in diode mode, a good LED shows ~1.6-2.0 V forward drop in one direction and open in the other. In-circuit, verify about 2 V across the LED when lit.

## If the LEDs are too bright or dim

- Too bright at night: increase the resistor to 470-680 Ω.
- Too dim: check the supply rail or reduce to 220 Ω (stay above 150 Ω for 3.3 V).

The blink timing lives in firmware; see the LED Status Indicators wiki page for the full pattern reference.