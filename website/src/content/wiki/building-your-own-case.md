---
title: "Building Your Own Case"
description: "Design a custom enclosure from scratch: layout, cutouts, antenna exit and assembly"
---

# Building Your Own Case

## Overview

Beyond the Hammond 1593L and the ready 3D models, a custom case lets you tune the layout to your exact parts. This page covers the design decisions.

## Internal Layout

Order the modules to minimize interference:

1. Battery at one end, away from the antenna.
2. Radio module at the antenna end, SMA at the exit.
3. OLED on the display face.
4. GPS patch facing up with clear sky view.
5. Audio jack on the side opposite the SMA.

## Dimensions

| Module | Approx footprint |
|--------|------------------|
| ESP32 DevKit V1 | 55 x 28 mm |
| E22-400M30S | 25 x 20 mm |
| SSD1309 2.42" OLED | 60 x 37 mm panel |
| TP4056 | 25 x 17 mm |
| NEO-6M | 25 x 25 mm |
| 18650 | 65 x 18 mm |

## Cutout Checklist

- OLED window
- USB-C
- 3.5 mm audio jack
- 4 buttons
- 2 LEDs
- SMA

## Antenna Exit

| Choice | Notes |
|--------|-------|
| SMA bulkhead | Cleanest, needs a hole + nut |
| Direct whip | Strain relief required |
| Internal vertical whip | Only with a non-metal case |

## Assembly Order

1. Mount and wire the power path (battery, TP4056, ESP32).
2. Verify boot and battery reading.
3. Add OLED and verify the screens.
4. Add radio + antenna, verify TX with a dummy load.
5. Add GPS, verify a fix outdoors.
6. Seal and label the frequency plan on the outside.

## Related Pages

- [Enclosure Options](/wiki/enclosure-options)
- [3D Printing Guide](/wiki/3d-printing-guide)
- [Waterproofing and Enclosure Sealing](/wiki/waterproofing-and-enclosure-sealing)
- [GPS Antenna Placement](/wiki/gps-antenna-placement)
