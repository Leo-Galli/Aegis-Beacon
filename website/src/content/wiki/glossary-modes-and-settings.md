---
title: "Glossary of Modes and Settings"
description: "Plain-language definitions of every mode, NVS key and dashboard setting"
---

# Glossary of Modes and Settings

## Overview

A quick-reference glossary for the terms used in the dashboard, the firmware and this wiki.

## Modes

| Term | Meaning |
|------|---------|
| BEACON | Periodic Morse TX with deep sleep between cycles |
| SEARCH | Continuous RSSI scanning with audio feedback |
| CONFIG | WiFi AP + dashboard for settings |
| EMERGENCY | Continuous max-power TX, no sleep |
| GPS WAIT | Boot-time screen while acquiring a fix |

## Radio Settings

| Term | Meaning |
|------|---------|
| Frequency plan | The 1-10 slots the beacon uses |
| TX power | Output level in dBm (-9 to +22) |
| WPM | Morse speed (5-40) |
| Repeat count | Payload repetitions per frequency |
| Dwell time | Seconds SEARCH listens per frequency |
| RSSI threshold | dBm level that counts as a hit |

## Identity and GPS Settings

| Term | Meaning |
|------|---------|
| Message | Base Morse text (default SOS) |
| Name | First/last name appended after DE |
| GPS in beacon | Include coordinates in payload |
| Fix timeout | How long to wait for a fix at boot |

## Device Settings

| Term | Meaning |
|------|---------|
| Sleep interval | Deep-sleep seconds between TX cycles |
| Volume | DAC level 0-255 |
| OLED invert | White-on-black vs black-on-white |
| Auto-switch | Switch to BEACON on low battery |

## Related Pages

- [Glossary](/wiki/glossary)
- [Configuration Reference](/wiki/configuration-reference)
- [Operating Modes](/wiki/operating-modes)
- [WiFi Configuration Portal](/wiki/wifi-config-portal)
