---
title: Mission Debrief
description: "Turn a mission's logged positions and scan hits into a debrief: track review, timing, signal reports and lessons."
---

# Mission Debrief

A debrief turns a scenario into learning. With the [position log](position-logging-workflow) from the [serial bridge](serial-bridge-guide) and the beacon's own scan records, you have hard data to review instead of memory.

## What to collect

| Source | Data |
| --- | --- |
| Bridge log (`mission.log`) | Every `AEGIS:POS:` fix with altitude and satellite count |
| Beacon scan hits | Frequencies and RSSI recorded during SEARCH mode |
| Team notes | Times, weather, terrain, what was tried |

## The debrief steps

1. **Replay the track**: plot the logged fixes in order (see [Position Logging Workflow](position-logging-workflow)) and compare with the plan.
2. **Check coverage**: which transmissions did you hear, and where? Overlay scan hits on the track.
3. **Check the payloads**: confirm the Morse payloads match expectations (name, coordinates in DDM).
4. **Timing**: how long from deployment to first fix, to first heard transmission? Compare with [Emergency Response, Minute by Minute](emergency-response-minute-by-minute).
5. **Lessons**: one thing that worked, one thing to change, captured as a bullet list for the next scenario.

## Signal report

For each leg, record the practical outcome:

| Outcome | Meaning |
| --- | --- |
| Clear copy | Payload fully readable, coordinates correct |
| Partial | Some symbols lost; position could still be guessed |
| No copy | Nothing heard at that distance/terrain |

## Update the training plan

The point of the debrief is the next iteration. Logs that show weak fixes indoors suggest [GPS Fix Capture Tips](gps-fix-capture-tips); persistent misses on a frequency suggest checking [Frequency Compatibility](frequency-compatibility).

## Related

- [Position Logging Workflow](position-logging-workflow)
- [Group Communication Plan](group-communication-plan)
- [Beacon Log Template](beacon-log-template)