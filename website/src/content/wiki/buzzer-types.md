---
title: Buzzer Types
description: Active versus passive buzzers, the ones the beacon uses, and the drive circuit for each.
---

# Buzzer Types

The word "buzzer" covers two very different devices. The distinction decides whether the firmware can control the tone at all.

## Active versus passive

| Type | Inside | Tone control | Use |
| --- | --- | --- | --- |
| Active | An oscillator | Fixed tone, on/off only | Alarms |
| Passive | A bare transducer | The host generates the tone | The beacon's Morse |

The beacon uses a passive buzzer: the firmware generates the Morse tones with PWM (see [Firmware Tone Generation](firmware-tone-generation)). An active buzzer would beep at its fixed frequency and could not produce dots and dashes.

## How to tell them apart

| Test | Active | Passive |
| --- | --- | --- |
| Power on with no signal | Beeps immediately | Silent |
| Resistance across the pins | Low | Higher (a coil) |
| Label | Often marked | Often unmarked |

## The drive circuit

A passive buzzer is a coil: it needs current, and the ESP32 GPIO can drive a small one directly through a transistor or, at low volumes, with a series resistor (see [Ohm's Law](ohm-law) for the math). The standard circuit:

- GPIO -> resistor -> transistor base
- Buzzer between 3.3 V and the transistor collector
- Flyback diode across the buzzer (the coil's kickback can reset the ESP32)

## The sound

Passive buzzers are louder than their size suggests, and the 700 Hz default tone (see [Audio Tone Details](audio-tone-details)) is chosen to cut through pack fabric and snow. In the field the buzzer is the final-approach beacon: the [Homing Technique](homing-technique) uses it for the last meters.

## Related pages

- [Firmware Tone Generation](firmware-tone-generation) for the tones
- [Audio Tone Details](audio-tone-details) for the frequencies
- [Audio Troubleshooting](audio-troubleshooting) for the faults