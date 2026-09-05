---
title: Snow Signal Math
description: The measured loss of 433 MHz in snow by depth and wetness, and what it means for a buried beacon.
---

# Snow Signal Math

A buried beacon transmits through snow. Snow is not transparent to 433 MHz; the loss depends on depth and especially on water content.

## The numbers

| Condition | Loss |
|-----------|------|
| Dry, fresh powder (50 cm) | 3-6 dB |
| Wet, dense snow (50 cm) | 15-25 dB |
| Dry snow (1 m) | 8-15 dB |
| Wet snow (1 m) | 30-45 dB |
| Ice / hard crust | More than wet snow |

For context, every 6 dB halves the range: a beacon that reaches 1 km in the clear might reach only 500 m under 50 cm of dry snow, and 100-200 m under 50 cm of wet snow.

## Why water is the enemy

Liquid water absorbs radio energy strongly at these frequencies. Fresh powder is mostly air (low loss); spring slush is mostly water (high loss). The same depth can differ by 20 dB between seasons.

## Practical implications

1. Keep the antenna out of the snow where possible - even 10 cm helps a lot.
2. The beacon in a pack on top of snow is dramatically better than the beacon in a snow pocket.
3. A search team should look for the antenna tip, not just the signal: the antenna is the part that radiates.
4. If the beacon is buried with the victim, expect short range and search systematically with the SEARCH mode.

## What to tell the rescue team

"433 MHz through snow" behaves like a short-range locator: within 100-300 m in wet snow, 500 m in dry. It is a beacon for "I am here", not a long-range link from under an avalanche. The SEARCH mode's rising-pitch audio is designed exactly for this close-in hunt.