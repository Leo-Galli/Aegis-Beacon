---
title: "Audio Alert System"
description: "DAC1 output stage, tone mapping per signal class, Morse click stream and volume control"
---

# Audio Alert System

## Overview

Audio is generated on the ESP32 **native DAC1 (GPIO 25)** with an LEDC PWM carrier, giving much cleaner output than the PWM-only approach used on the v4.0 ESP32-C3 board. The same output drives the Morse click stream in BEACON mode and the metal-detector style pitch sweep in SEARCH mode.

## Output Stage

| Parameter | Value | Notes |
|-----------|-------|-------|
| Output pin | GPIO 25 | Native DAC1 (`DAC_CHANNEL_1`) |
| PWM carrier frequency | 40,000 Hz | LEDC channel 0, above hearing range |
| PWM resolution | 8-bit | 0-255 duty cycle |
| Default volume | 180 | ~70%, range 0-255 |
| Silence mid-rail parking | dacWrite(128) | 1.65 V, eliminates click transients |
| Series resistor | 100 ohm | R2 |
| AC-coupling capacitor | 10 uF | C3, blocks DC bias from headphones |
| Compatible headphones | 16-600 ohm | Standard 3.5mm wired |
| Connector | 3.5mm TRRS | Tip=audio, Ring1=Tip (mono), Sleeve=GND |

**Signal path:** `GPIO 25 (DAC1) -> 100 ohm series R -> 10 uF AC-coupling cap -> 3.5mm jack TIP`

> [!NOTE]
> The DAC is parked at mid-rail (128) during silence instead of being driven to 0. This removes the audible DC-click transient you would otherwise hear through headphones at every tone boundary.

## Tone Frequencies

| Condition | Frequency | Pattern |
|-----------|-----------|---------|
| No signal (RSSI below threshold) | - | Silence (DAC parked at 1.65 V) |
| Weak signal (threshold to -80 dBm) | 440 Hz | Rising-pitch start |
| Medium signal (-80 to -60 dBm) | ~880 Hz | Higher pitch |
| Strong signal (-60 dBm or higher) | up to 2200 Hz | Continuous |
| Pitch mapping | 440-2200 Hz | Linear interpolation with RSSI |
| Morse TX (BEACON mode) | 600 Hz | Click stream, synchronized with TX |
| EMERGENCY mode | 1760 Hz | Continuous tone |

The SEARCH audio works like a metal detector: as the RSSI rises the pitch climbs continuously, letting a rescuer home in on the strongest signal by ear without looking at the display.

## Volume Control

- **Range:** 0-255, default 180 (~70%).
- **Live adjustment:** SW_UP / SW_DN when VOL is the selected target, step +-10 per press.
- **Persistence:** hold SW_SEL for at least 1 second to save the current volume and WPM to NVS.
- **Master enable:** `aen` NVS key toggles the whole audio subsystem.

## Related NVS Keys

| Key | Type | Default | Meaning |
|-----|------|---------|---------|
| `avol` | uint8 | 180 | DAC volume (0-255) |
| `aen` | bool | true | Master audio enable |
| `poten` | bool | false | Allow SW_UP/DN volume adjust |

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| No audio at all | Wrong pin or `aen` disabled | Verify GPIO 25 wiring and the NVS toggle |
| Quiet or distorted output | Missing AC-coupling cap | Check C3 (10 uF) orientation and value |
| Click at tone boundaries | DAC not parking at 128 | Confirm firmware calls `audioDacSilence()` |
| Headphones buzz | Ground loop via USB | Disconnect USB and run from battery only |
