---
title: Standard Build Configuration
description: "The recommended standard beacon build: every part, the wiring order, and the settings that make it a complete field device."
---

# Standard Build Configuration

The standard build is the one this wiki recommends: ESP32 + E22 radio + OLED + GPS + audio, in a rugged case. It is the build the [Shopping List](shopping-list) prices and the [Assembly Guide](assembly-guide) assembles.

## The parts

| Part | Role |
| --- | --- |
| ESP32 dev board | Main controller |
| E22-900M30S or E22-400M30S module | SX1262 LoRa radio |
| 0.96" 128x64 OLED (I2C) | Display |
| NEO-6M GPS module | Position |
| Buzzer + audio jack | Tone output |
| TP4056 charger + 18650 cell | Power |
| SMA whip antenna | Radiator |
| Four buttons | Input |

## The settings that matter

| Setting | Value |
| --- | --- |
| Frequency | 433.920 MHz (or a planned channel) |
| Power | Legal floor for routine use |
| Interval | 10 s |
| Repeat | 1 |
| WPM | 12 |
| GPS | On |
| Identity | Your name or callsign |

## Why this exact set

Each part exists to close a failure mode: the OLED so you can configure in the field, the GPS so coordinates are automatic, the audio so a handheld radio or recorder can capture the burst, the buttons so nothing needs a computer. The [Build Configurations](build-configurations) page compares it against the alternatives.

## The result

A complete rescue beacon: 150 - 250 g, 65+ hours on a 2500 mAh cell with GPS, full field configuration, and a payload that any receiver in the band can hear.

## Related pages

- [Build Configurations](build-configurations) for the comparison
- [Assembly Guide](assembly-guide) for the steps
- [First Use](first-use) for the first run