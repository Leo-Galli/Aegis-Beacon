---
title: Displayless Build
description: "The beacon without an OLED: GPS and audio kept, configuration by serial or WiFi, and the build decisions that follow."
---

# Displayless Build

Between the minimal build and the full one sits the displayless build: everything except the OLED. It keeps GPS and audio, drops the screen, and saves about $6 and 30 g.

## What stays

| Part | Role |
| --- | --- |
| ESP32 + E22 radio | Core |
| NEO-6M GPS | Automatic coordinates |
| Buzzer + audio jack | Tone and output |
| TP4056 + 18650 | Power |
| Buttons | Mode/select |

## Configuration without a display

| Path | How |
| --- | --- |
| Serial | USB cable + serial monitor (see [Serial Debug System](serial-debug-system)) |
| WiFi | The config portal serves a web form (see [WiFi Config Portal](wifi-config-portal)) |
| Defaults | Flash with your settings compiled in |

The WiFi portal is the practical answer: phone connects to the beacon's access point, a web page shows and edits every setting.

## The feedback problem

Without a screen, the beacon confirms actions by LED pattern and tone. The [LED Status Indicators](led-status-indicators) page is the dictionary: count the blinks, hear the beeps, know the state. It works, but it is a skill.

## When to choose it

- The case is too small for a display
- The mission is "set once, deploy, forget"
- Budget or weight is tight
- You want the ruggedness of fewer moving parts

## Related pages

- [Minimal Build](minimal-build) for the smaller version
- [Standard Build Configuration](standard-build-configuration) for the full version
- [Build Configurations](build-configurations) for the comparison