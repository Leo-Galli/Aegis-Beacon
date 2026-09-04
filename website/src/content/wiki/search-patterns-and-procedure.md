---
title: "Search Patterns and Procedure"
description: "Grid, spiral and audio homing patterns for locating a beacon with SEARCH mode"
---

# Search Patterns and Procedure

## Overview

SEARCH mode reports RSSI strength as an audio pitch and OLED bar. Without a directional antenna the signal is only a proximity indicator, so searches use systematic patterns that turn "stronger / weaker" into a location.

## Before Searching

1. Confirm the frequency plan matches the target beacon's frequencies.
2. Set the threshold a few dB above the noise floor (see RF Interference).
3. Walk a wide perimeter first to confirm a signal exists at all.

## Grid Search

Walk a straight line across the search area, then turn and walk a parallel line spaced 10-20 m away.

| Pass | What you hear |
|------|---------------|
| First pass | Weak, growing pitch as you near the center line |
| Turn | Pitch falls again |
| Second pass | Note the strongest point on each line |

The strongest point between two adjacent lines brackets the target.

## Audio Homing

Once the pitch rises above medium (about -60 dBm):

1. Slow down and take steps of 1-2 m.
2. Turn 90 degrees and repeat - the loudest heading is toward the target.
3. Use the OLED RSSI bar to confirm, not just your ears.
4. Mark the loudest point and spiral outward 5 m to confirm it is a peak.

## Spiral Pattern

Walk an outward spiral from the strongest point:

- If the pitch rises again, you are crossing the actual peak.
- If it monotonically falls, the strongest point was the target.

## After Locating

1. Mark the spot clearly.
2. Probe the snow (see the probe section of Field Deployment).
3. Only dig once you have confirmed the signal peak, to preserve oxygen and energy.

## Related Pages

- [SEARCH Mode](/wiki/mode-search)
- [Audio Alert System](/wiki/audio-alert-system)
- [Field Deployment](/wiki/field-deployment)
- [Coordinate Plotting and Maps](/wiki/coordinate-plotting-and-maps)
