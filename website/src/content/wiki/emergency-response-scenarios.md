---
title: "Emergency Response Scenarios"
description: "Realistic uses: partner in trouble, group split, lost in weather - step by step"
---

# Emergency Response Scenarios

## Overview

Field emergencies rarely follow the manual. This page works through the scenarios most likely to involve the beacon so you can pre-decide the actions.

## Scenario 1: Partner Injured in Terrain

1. Stabilize them first - the beacon is not first aid.
2. If evacuation is needed and you have reception, switch the injured person's beacon to BEACON.
3. Send your base the plan: `SOS DE [NAME] PSN [LAT] [LON]`.
4. Keep the beacon transmitting; the base coordinates a rescue.
5. Use the SEARCH unit to re-find the beacon if you must leave them.

## Scenario 2: Group Split in Bad Weather

1. Each person with a beacon stays on their assigned frequency.
2. The static member switches to SEARCH periodically to locate the others.
3. The group leader transmits a pre-agreed "here I am" pattern.
4. Reunite on the loudest audio heading.

## Scenario 3: Lost in Fog or Whiteout

1. Stay put - moving makes you harder to find.
2. Switch your beacon to EMERGENCY (continuous TX).
3. Report position via the payload when a base is listening.
4. Conserve battery: if no base is monitoring, use BEACON with a long sleep interval instead.

## Scenario 4: Night Rescue Using SEARCH

1. Use the audio pitch, not the screen, to home in - the OLED drains battery and needs light to read.
2. Follow the strongest audio heading (see Search Patterns).
3. When close, switch the display on briefly to confirm the frequency and RSSI.

## Decision Rule

| Condition | Mode |
|-----------|------|
| Base listening, need position now | EMERGENCY |
| Long wait, conserve battery | BEACON, long sleep |
| Need to find someone | SEARCH |
| Need to change settings | CONFIG |

## Related Pages

- [EMERGENCY Mode](/wiki/mode-emergency)
- [Search Patterns and Procedure](/wiki/search-patterns-and-procedure)
- [Pre-Trip Checklist](/wiki/pre-trip-checklist)
- [Emergency Communications Plan](/wiki/emergency-communications-plan)
