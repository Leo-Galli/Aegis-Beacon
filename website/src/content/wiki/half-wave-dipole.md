---
title: Half Wave Dipole
description: "The half-wave dipole for the beacon: balanced feed, no ground plane needed, and when it beats the quarter-wave whip."
---

# Half Wave Dipole

A dipole is two quarter-wave elements fed in the middle. It is the reference antenna of radio engineering, and it has one property the beacon builder should know about: it needs no ground plane.

## Why no ground plane

The quarter-wave vertical relies on the ground plane for its missing half. The dipole contains both halves in its own two wires, so it is a complete, balanced antenna on its own. This makes it attractive when the beacon sits on a backpack or a rock with nothing metallic under it.

## Length at 433 MHz

Two quarter-wave elements of 165 - 168 mm each (see [Quarter Wave Antenna](quarter-wave-antenna)) give a total length of about 33 cm tip to tip. The feed impedance at the center is about 73 ohms, close enough to 50 that a simple 1:1 balun or even a direct feed works acceptably for field use.

## Pattern and orientation

A dipole radiates broadside to its axis and has nulls off the ends. For a beacon on a backpack, hang the dipole vertically: the pattern then covers the horizon in all directions, which is exactly what a search receiver needs.

## When to choose it over the whip

| Situation | Better choice |
| --- | --- |
| Metal case under antenna | Quarter-wave whip |
| No metal nearby (backpack, snow) | Dipole |
| Hanging from a pole or tree | Dipole |
| Handheld, in a pocket | Quarter-wave whip |

## The folded variant

A folded dipole (the two halves joined at the ends with a third wire) raises the feed impedance and is mechanically tougher. It is slightly wider band and is a good choice for a rugged field antenna, at the cost of a bit more wire to break.

## Related pages

- [Antenna Design](antenna-design) for theory
- [Antenna Selection](antenna-types) for the comparison
- [Homebrew Antenna](homebrew-antenna) for building one