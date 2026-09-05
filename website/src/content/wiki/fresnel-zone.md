---
title: The Fresnel Zone
description: Why line-of-sight is not enough, how the Fresnel zone blocks signal, and what to do about it in the mountains.
---

# The Fresnel Zone

Radio waves do not travel on a razor-thin line. They spread into a football-shaped region between transmitter and receiver called the Fresnel zone, and anything poking into it weakens the signal.

## The concept

Between two antennas there is a clear "tube" of space where the signal travels. For a link to work at full strength, that tube should be free of obstacles. The zone's radius at the midpoint is:

```
r ≈ 8.66 m × sqrt(km / GHz)
```

At 433 MHz (0.433 GHz) over 1 km: r ≈ 8.66 × sqrt(1 / 0.433) ≈ 13 m. Over 10 km: r ≈ 41 m.

## What this means for the beacon

- A ridge or building that is *not* in the direct line can still block the signal if it reaches into the zone.
- Over short rescue ranges (hundreds of meters), the zone is small and less of a problem.
- Over multi-kilometer links, the antennas should be raised so the midpoint clears obstacles.

## Practical mountain rules

1. Get height: the higher the antenna, the bigger the clear zone below it.
2. A beacon on the ground in a valley has the terrain in its zone on almost every path.
3. Deploy the beacon on a high point when possible; a 1-2 m pole or a branch beats lying on the ground by a huge margin.
4. Do not aim for a specific direction; the beacon radiates omnidirectionally, so height is the lever, not pointing.

## The good news

For the beacon's real job - being found within a kilometer or two - the zone is small and rarely the deciding factor. Terrain line-of-sight matters far more. The Fresnel zone matters when you are planning a 5+ km link between a beacon on a peak and a base station.

## When to ignore it

Short-range bench tests and searches within ~500 m: ignore the zone, focus on placement and height.