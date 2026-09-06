---
title: Homing with the Serial Bridge
description: "Combine SEARCH-mode direction finding with the bridge's position stream to close in on a beacon efficiently."
---

# Homing with the Serial Bridge

Two tools, one loop: the beacon's own SEARCH mode finds the direction of a signal, and the [serial bridge](serial-bridge-guide) records where you were when you heard it. Together they turn a "somewhere out there" into a search pattern.

## The setup

1. Plug the searching beacon into the logging machine and start the bridge (see [Position Logging Workflow](position-logging-workflow)).
2. Put the beacon in SEARCH mode: `MODE SEARCH` over serial, or the MODE button.
3. Open the [Report Position Page](report-position-page) on the same machine so every fix streams in live.

## The loop

| Step | Action | Data captured |
| --- | --- | --- |
| 1 | Walk a leg, note where RSSI peaks | Fix at the peak |
| 2 | Turn 90 degrees, walk another leg | Second fix |
| 3 | The crossing of the two bearings is the target | Track line |

Each leg's peak position is recorded automatically in the position log, so you can walk the search without stopping to write.

## Reading the audio

SEARCH mode emits a variable-pitch beep tied to RSSI: higher pitch means closer or better line of sight. Between fixes, the audio is your real-time instrument; the logged positions are your memory.

## Repeater and terrain effects

Reflections in gullies can make the peak lie. Take bearings from at least two positions and trust the crossing only when both legs are consistent. See [Mountain Effects on Radio](mountain-effects-radio) and [Signal Triangulation](signal-triangulation).

## After the find

The log gives you the approach path and the final coordinates. Export it (see [Bridge Automation](bridge-automation)) and fold it into the [Mission Debrief](mission-debrief).

## Related

- [Homing Technique](homing-technique)
- [Signal Triangulation](signal-triangulation)
- [Morse Listening Workflow](morse-listening-workflow)