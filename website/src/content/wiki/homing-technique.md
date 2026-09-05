---
title: Homing Technique
description: "Walking to a beacon by its signal: the systematic approach that uses RSSI and terrain, not luck."
---

# Homing Technique

When you can hear a beacon but not see it, homing is the systematic way to walk to it. The method is simple: move in the direction where the signal grows.

## The method

1. Note the RSSI (see [Firmware RSSI Measurement](firmware-rssi-measurement) for reading it).
2. Walk a straight line 30 m in one direction.
3. If the signal grows, keep going. If it shrinks, return and try the other direction.
4. At every step, correct course toward the strongest reading.

## The walls of the corridor

As the signal grows, small course errors become visible: the RSSI drops when you drift off the line. Homing is walking down a corridor whose walls are made of RSSI. The corridor narrows as you approach.

## The multipath trap

Reflections can create false peaks: a rock face can bounce a stronger signal from the wrong direction (see [Propagation Modes](propagation-modes)). The escape:

- When the signal suddenly drops to near nothing, you were homing on a reflection.
- Move laterally 20 m and re-measure; the direct path reappears.
- The beacon's repeated bursts make this retry cheap: it transmits every interval.

## The last 100 meters

In the final stretch the signal saturates and RSSI stops discriminating. Switch to the audio: the tone's loudness and clarity guide the last few dozen meters, and the whistle protocol (see [Whistle Signals](whistle-signals)) takes over when the beacon is in sight.

## Related pages

- [Signal Strength Mapping](signal-strength-mapping) for the map version
- [Radio Shadow](radio-shadow) for the dead zones
- [Search Patterns and Procedure](search-patterns-and-procedure) for the search side