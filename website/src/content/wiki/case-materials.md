---
title: Case Materials
description: "Choosing the beacon case material: printed PLA, PETG, ABS, and off-the-shelf boxes, with the RF and cold-weather implications."
---

# Case Materials

The case is not cosmetic: it carries the antenna, protects the electronics, and behaves differently in the cold. This page is the material comparison.

## The contenders

| Material | Cost | Cold behavior | RF behavior | Durability |
| --- | --- | --- | --- | --- |
| PLA (3D print) | Low | Brittle below 0 C | Transparent (fine) | Poor drop resistance |
| PETG (3D print) | Low | Tough | Transparent | Good |
| ABS (3D print) | Low | Tough, but fumes when printing | Transparent | Good |
| Off-the-shelf box | Low | Depends | Fine | Varies |
| Metal case | Medium | Fine | Shielding and ground plane | Excellent |

## The RF facts

- Plastic cases are transparent to 433 MHz: the antenna radiates through them.
- A metal case shields the internals AND acts as the antenna's ground plane (see [Quarter Wave Antenna](quarter-wave-antenna)), but the antenna must be outside the metal.
- Never put the antenna inside a metal case: the shield kills the radiation.

## The cold facts

PLA gets brittle around 0 C: a printed PLA case can crack on a rock hit in winter. PETG or ABS are the winter materials. The [Winter Operations](winter-operations) page assumes a winter-suitable case.

## The print considerations

| Material | Bed temperature | Notes |
| --- | --- | --- |
| PLA | 50 - 60 C | Easiest |
| PETG | 70 - 80 C | Sticks hard, needs release |
| ABS | 100 - 110 C, enclosure | Warps without one |

The [3D Printing Guide](3d-printing-guide) has the full settings.

## The recommendation

PETG for a winter-capable printed case, an off-the-shelf ABS/PC box for the fastest path, and a metal box only with the antenna mounted outside. The [Enclosure Options](enclosure-options) page works through the trade-offs.

## Related pages

- [Enclosure Options](enclosure-options) for the choices
- [3D Printing Guide](3d-printing-guide) for printing
- [Antenna Mounting](antenna-mounting) for the antenna side