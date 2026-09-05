---
title: GPS Sky View
description: Why the GPS needs open sky, how satellites move, and how to position the antenna for the fastest fix.
---

# GPS Sky View

The NEO-6M receiver works by measuring the distance to at least four satellites. It can only do that when it can see the sky. "Sky view" is the quality of that view, and it dominates every other factor in fix time.

## How satellites move

The GPS constellation has 24 to 32 satellites in six orbital planes. At any moment, anywhere on Earth, between 6 and 12 are above the horizon. They are not stationary: each one crosses the sky over several hours, so the constellation geometry is always changing.

## The four-satellite minimum

A receiver needs:

- 3 satellites for a 2D fix (latitude, longitude)
- 4 satellites for a 3D fix (plus altitude)

More satellites mean a better geometry. The receiver prefers satellites spread around the sky, not clustered in one direction; a cluster produces a weak solution even with enough satellites.

## What blocks the view

| Obstacle | Effect |
| --- | --- |
| Building interiors | No fix, or fix only near a window |
| Dense tree canopy | Intermittent fix, long acquisition |
| Deep valleys | Satellites hidden behind ridges |
| Body or backpack | Antenna pointed away from the sky |
| Metal roofs / vehicles | Strong reflections, wrong positions |

## Positioning the antenna

The GPS antenna is a small patch antenna that wants to face up. Practical rules:

- Put the beacon upright, antenna side up.
- Keep it away from metal: the ESP32 board, the battery, a metal case.
- In a backpack, put it in the top pocket, not buried against the frame.
- On a belt, wear it so the patch faces the sky, not your body.

## The one-second rule

If you move the antenna more than a few meters after a fix, the position may be stale or the fix may be lost. If the beacon is transmitting while you hike, expect the coordinates to trail your actual position by the time between fixes.

## Related pages

- [GPS Antenna Placement](gps-antenna-placement) for the hardware detail
- [GPS Warm vs Cold Start](gps-warm-vs-cold-start) for acquisition times
- [GPS Fix Quality](gps-fix-quality) for what the receiver reports