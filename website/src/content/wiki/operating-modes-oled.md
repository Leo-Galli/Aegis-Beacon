---
title: "Mode Screens and Icons"
description: "Reading every OLED screen: headers, icons, progress bars and the adjustment overlay"
---

# Mode Screens and Icons

## Overview

Every OLED screen shares the same visual language: an inverted header, a battery icon in the corner, and mode-specific body content. Learning the vocabulary makes field reading instant.

## Shared Elements

| Element | Meaning |
|---------|---------|
| Inverted header | Mode name + counter |
| Battery icon | 4 fill levels, blinking at 10% |
| Letter C in battery | Charging detected |
| GPS dot | Solid = fix, outline = searching |
| ADJ marker | An adjustment is active |
| Bottom bar | Scrolling payload or status line |

## Screen Anatomy

### BEACON

| Zone | Content |
|------|---------|
| Header | `TX BEACON` + cycle + battery |
| Center | Large frequency |
| Middle | CH/PWR/WPM info line |
| Lower | TX progress bar |
| Bottom | Scrolling payload |

### SEARCH

| Zone | Content |
|------|---------|
| Header | `RX SEARCH` + hit count + battery |
| Center | Large frequency |
| Middle | RSSI value + bar with threshold tick |
| Lower | Signal label / last hit |
| Bottom | Scan pass + battery |

### EMERGENCY

- Alternating inverse full screen.
- Giant `SOS` in logisoso32.
- Frequency + power, then coordinates or cycle.

### GPS WAIT

- `ACQUIRING GPS FIX` header.
- Large satellite count.
- Progress bar and status line.

## Adjustment Overlay

After pressing UP or DN, an inverted bar appears at the bottom for 2.5 s showing the live VOL or WPM value. The active target (VOL or WPM) is always shown in the status bar corner.

## Related Pages

- [OLED Display](/wiki/oled-display)
- [Operating Modes](/wiki/operating-modes)
- [Boot Process](/wiki/boot-process)
- [Audio Alert System](/wiki/audio-alert-system)
