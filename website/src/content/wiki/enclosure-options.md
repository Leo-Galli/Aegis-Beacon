---
title: "Enclosure Options"
description: "Aluminium box, 3D printed case, cutouts and waterproofing for field use"
---

# Enclosure Options

## Overview

The recommended enclosure is the Hammond 1593L (100 x 60 x 25 mm), but a 3D printed case is a legitimate alternative. The enclosure choice affects antenna performance, GPS lock and water resistance.

## Hammond 1593L

| Aspect | Detail |
|--------|--------|
| Size | 100 x 60 x 25 mm |
| Material | Painted aluminium |
| Fits | ESP32, E22 module, OLED, 18650, GPS |
| RF behavior | Metal box screens the radio antenna - the SMA whip must exit |
| GPS behavior | Blocks GPS entirely (see GPS Antenna Placement) |

Cutouts needed:

- OLED window (~58 x 30 mm for the 2.42 inch panel)
- USB-C port
- 3.5 mm audio jack
- 4x 6 mm button holes
- 2x LED holes (red, blue)
- SMA antenna exit

> [!WARNING]
> In an all-metal box the antenna must be outside. A 17.3 cm wire soldered to the module while inside the aluminium case will be almost completely shielded. Use the SMA connector and an external whip.

## 3D Printed Case

| Aspect | Detail |
|--------|--------|
| Material | PLA or PETG |
| RF behavior | Transparent to RF - antenna can stay inside if vertical |
| GPS behavior | Transparent to GPS |
| Water resistance | Needs a gasket or sealant; printed cases leak |

PLA degrades in UV and heat. PETG resists both better. See [3D Printing Guide](/wiki/3d-printing-guide) for the model workflow.

## Weatherproofing

| Opening | Treatment |
|---------|-----------|
| Buttons | Rubber button boots or a thin silicone sheet over the PCB |
| OLED window | Clear acrylic glued with silicone, not cyanoacrylate (fumes fog the panel) |
| USB-C | Rubber plug when not charging |
| SMA | Finger-tighten; a dab of PTFE tape on the thread helps |
| Audio jack | Use the panel-mount type with a nut, not a PCB-mount jack |

## Decision Table

| Scenario | Choose |
|----------|--------|
| Bench and car use | Hammond 1593L |
| Alpine winter deployment | 3D printed PETG with gasket (GPS works inside) |
| Rainy coastal use | Sealed 3D print or metal box with external antenna |

## Related Pages

- [Assembly Guide](/wiki/assembly-guide)
- [3D Printing Guide](/wiki/3d-printing-guide)
- [GPS Antenna Placement](/wiki/gps-antenna-placement)
- [Hardware Components](/wiki/hardware-components)
