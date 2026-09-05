---
title: Choosing a Build Configuration
description: Which of the three reference builds suits your use case, and how the BOM differs between them.
---

# Choosing a Build Configuration

Not everyone needs the full GPS-equipped field unit. Pick the configuration that matches how you will actually use the beacon.

## The three reference builds

| Build | Parts | Cost | Best for |
|-------|-------|------|----------|
| Base rescue radio | ESP32, E22, OLED, buttons, audio | ~$18 | Learning, bench testing, first build |
| GPS edition | Base + NEO-6M | ~$23 | Backcountry users who want coordinates |
| Full field unit | GPS + rugged case + external antenna | ~$28 | Serious field use, team deployment |

## Base rescue radio

The minimum viable beacon: it transmits SOS in Morse, scans, and configures over WiFi. It has no GPS, so the payload is just `SOS DE NAME` (or plain `SOS`).

Choose this if:
- You want the cheapest possible working device.
- You are building to learn before committing to the full kit.
- Your use case is a fixed-location beacon (base camp, vehicle).

## GPS edition

Adds the NEO-6M on UART2. The payload becomes `SOS DE NAME PSN N4553 E01230`, giving rescuers an actual position.

Choose this if:
- You will be moving (hiking, skiing, mountaineering).
- The difference between "a beacon is transmitting" and "here is where they are" matters to your rescue plan.

## Full field unit

Adds a rugged enclosure, a proper external antenna, and sometimes a bigger battery. Runtime and range are the priorities.

Choose this if:
- The beacon is a piece of your safety kit, not a project.
- You operate in demanding terrain or weather.
- A team will carry and maintain several units.

## Upgrading later

All three builds share the same firmware. The GPS is a drop-in addition (two wires + power), and the case is purely mechanical. Start with the base build and upgrade when you are ready; the firmware auto-detects the GPS setting from the dashboard.