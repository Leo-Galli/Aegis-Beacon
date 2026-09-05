---
title: Button Types Guide
description: The tactile switches used by the beacon, their variants, and how to wire four buttons to four GPIOs with pull-ups.
---

# Button Types Guide

The beacon uses four tactile push buttons. The simplest and most reliable choice is the ubiquitous 6x6 mm tactile switch.

## The recommended switch

- **6x6 mm tactile momentary switch** (also called "tact" or "micro switch").
- 4-pin, 2 legs on each side internally connected; press closes the circuit.
- Cost: a few cents each; they come in tall (5 mm, 7 mm, 9.5 mm) variants. The 7 mm version is a comfortable height for a case.

## The four buttons

| Button | GPIO | Function |
|--------|------|----------|
| MODE | 33 | Short: toggle BEACON/SEARCH. Long 2 s: EMERGENCY |
| SEL | 32 | Short: toggle VOL/WPM target. Long 3 s: CONFIG portal |
| UP | 35 | Increment selected parameter |
| DN | 34 | Decrement selected parameter |

## Wiring pattern

All four buttons connect from their GPIO to GND, with pull-ups:

- GPIO 32, 33 have internal pull-ups (INPUT_PULLUP works).
- GPIO 34, 35 are input-only with **no internal pull-up**: add external 10 kΩ to 3.3 V.

Pressed = pin reads LOW. Released = HIGH.

## Debounce

The firmware debounces in software (see the Button System page). Mechanical bounce is a few ms; the firmware's 20-50 ms debounce window handles it. No extra hardware needed.

## Variants that also work

- **Side-mounted** tact switches for edge panels.
- **Sealed** tact switches for outdoor cases (IP67 versions exist but cost more).
- **Membrane keypads** if you want a flat panel - wiring differs (matrix), so stick to individual switches for the standard build.

## If a button behaves erratically

- Check the pull-up (missing on 34/35 is the top cause).
- Check for a cold solder joint on the switch legs.
- Check the switch is momentary, not latching: a latching switch would leave the pin permanently low.