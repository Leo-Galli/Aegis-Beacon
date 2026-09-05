---
title: Workspace Setup
description: A clean, safe, efficient bench layout for building and testing the beacon.
---

# Workspace Setup

A good bench makes the build faster and safer. You do not need a lab, just a stable surface with good light.

## Location

- A sturdy table with a heat-safe mat or a piece of ceramic tile under the soldering area.
- Good lighting: a desk lamp that reaches the work area without glare.
- Ventilation: an open window or a fan pulling fumes away from your face.

## Layout

Arrange left to right (or right to left, whatever you prefer):

1. **Parts tray** with labeled compartments for each component.
2. **Tools within reach**: iron, solder, cutters, strippers, tweezers.
3. **The work area**: the board being assembled, with the helping hands.
4. **The test area**: multimeter, power supply, and later the receiver or SDR.

## Good practices

- Keep the soldering iron in its stand whenever it is not in your hand.
- Unplug the iron when you leave the bench.
- Keep liquids away from the electronics.
- Antistatic mat or wrist strap is nice but not critical for this board; at minimum touch a grounded metal object before handling the ESP32.
- Use a bright lamp so you can see solder joints clearly; bad joints hide in shadows.

## Power test setup

For the first power-on, use a bench supply or a fully charged battery, and have the multimeter ready to verify the 3V3 rail (3.3 V) before connecting anything else.

## Cleaning up

- Trim component leads as you go; stray leads are sharp and can short pads.
- Collect solder dross in a small container.
- Keep the firmware-flashing cable labelled as data-capable; charge-only cables are the classic time sink.