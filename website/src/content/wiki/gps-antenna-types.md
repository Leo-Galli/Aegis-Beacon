---
title: GPS Antenna Types
description: "The GPS antenna types used on the NEO-6M modules: ceramic patch, active versus passive, and the field differences."
---

# GPS Antenna Types

The little square on the GPS module is an antenna: a ceramic patch. Its type and its active/passive state decide how well the module sees the sky.

## The ceramic patch

The standard NEO-6M module carries a 25 x 25 mm or 15 x 15 mm ceramic patch antenna. It is a directional antenna: it wants to face up, with its best reception directly overhead. The [GPS Sky View](gps-sky-view) page explains why orientation matters.

## Active versus passive

| Type | Amplifier | Needs | Use |
| --- | --- | --- | --- |
| Passive | None | A strong signal path | Short cable, clear sky |
| Active | Built-in LNA | 3 V supply through the coax | Long cable, indoors, marginal conditions |

Most NEO-6M boards are passive. "Active" modules (with an SMA connector and a powered antenna) exist for GPS-denied situations and car use; the beacon's standard build does not need one.

## The field differences

| Situation | Passive patch | Active antenna |
| --- | --- | --- |
| Open sky | Excellent | Excellent |
| Dense canopy | Weak | Better |
| Inside a backpack | Useless | Marginal |
| Power draw | 0 extra | +5 - 15 mA |

The beacon's GPS is passive by design: lower power, no extra supply path, and the mission puts the antenna on the case top in open air (see [GPS Antenna Placement](gps-antenna-placement)).

## The ground plane question

A patch antenna does not need the metal ground plane a whip needs (see [Quarter Wave Antenna](quarter-wave-antenna)): the patch is self-contained. What hurts it is nearby metal and dielectric (the battery, the board, a metal case top).

## Related pages

- [GPS Antenna Placement](gps-antenna-placement) for the mounting
- [GPS Sky View](gps-sky-view) for the view
- [GPS Module Variants](gps-module-variants) for the module choice