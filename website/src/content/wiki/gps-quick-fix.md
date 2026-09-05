---
title: GPS Quick Fix
description: "The five-minute GPS fault isolation: the four checks that find 90% of GPS problems."
---

# GPS Quick Fix

Ninety percent of GPS problems come from four causes, and all four have a five-minute check. This page is the fast path; the [GPS Troubleshooting](gps-troubleshooting) page has the full depth.

## The four checks

| Check | How | Fix |
| --- | --- | --- |
| Power | Module LED blinks? (see [GPS Testing Indoors](gps-testing-indoors)) | Wire the supply correctly |
| Wiring | TX/RX crossed? (see [Wiring Quick Reference](wiring-quick-reference)) | Swap the two wires |
| Sky view | Count climbs outdoors? (see [GPS Satellite Count](gps-satellite-count)) | Move the antenna up and clear |
| Config | GPS enabled in CONFIG? | Enable it |

## The order matters

Check power first (the LED), then wiring (the serial output), then sky (the count), then config. Each check rules out a whole failure class; going in the wrong order repeats work.

## The 10-minute rule

If the module shows power and wiring but no fix after 10 minutes of open sky, treat it as failed for the session: enter manual coordinates (see [GPS Failure Contingency](gps-failure-contingency)) and diagnose at home.

## The winter addition

In the cold, acquisition takes longer (see [GPS Warm vs Cold Start](gps-warm-vs-cold-start)). Add 5 minutes to the rule below 0 C.

## Related pages

- [GPS Troubleshooting](gps-troubleshooting) for the full depth
- [GPS Testing Indoors](gps-testing-indoors) for the bench
- [GPS Failure Contingency](gps-failure-contingency) for the plan B