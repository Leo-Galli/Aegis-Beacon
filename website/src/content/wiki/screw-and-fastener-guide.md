---
title: Screw and Fastener Guide
description: "The fasteners used in the beacon case: M2/M3 hardware, brass inserts, and the mounting pattern for boards and the antenna."
---

# Screw and Fastener Guide

The difference between a prototype and a field device is often the fasteners: what holds the board, the battery and the antenna when the case gets dropped.

## The hardware set

| Fastener | Use |
| --- | --- |
| M3 x 8 - 12 mm | Board mounts, case screws |
| M2 x 6 mm | Small boards, OLED |
| Brass heat-set inserts | Printed cases: threads that survive reuse |
| M3 standoffs | Stacking the ESP32 and GPS |

## The brass insert trick

Screws into bare printed plastic strip the threads after a few cycles. Heat-set brass inserts (installed with a soldering iron) give real threads that last. The [3D Printing Guide](3d-printing-guide) covers the installation.

## The mounting pattern

| Component | Fastener | Note |
| --- | --- | --- |
| ESP32 board | M3 standoffs | Keep 2 mm clearance under the board |
| OLED | M2 | Thin panel; tighten gently |
| GPS module | M2 or tape | Vibration-sensitive antenna: secure firmly |
| Antenna mount | M3 through the case wall | The SMA flange (see [Antenna Mounting](antenna-mounting)) |

## The torque rule

Small plastic threads need light torque: "snug, then a quarter turn less". A stripped thread in a sealed case is a field repair with the case open in the cold. Use thread-forming screws in plastic, not machine screws without inserts.

## The corrosion rule

Stainless or zinc-plated screws only. A rusted screw in a sealed case is a water path and a future frustration. In wet environments, add a drop of thread sealant on the case-screw threads.

## Related pages

- [Case Cutouts Guide](case-cutouts-guide) for the holes
- [3D Printing Guide](3d-printing-guide) for the printed parts
- [Assembly Sequence](assembly-sequence) for the order