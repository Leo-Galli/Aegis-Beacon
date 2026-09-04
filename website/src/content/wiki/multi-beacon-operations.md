---
title: "Multi-Beacon Operations"
description: "Several beacons in one group: frequency planning, scanning conflicts and SEARCH behaviour"
---

# Multi-Beacon Operations

## Overview

When a group carries several Aegis-Beacons, planning who transmits on what keeps SEARCH usable. Two beacons on the same frequency can step on each other and flood the hit log.

## Frequency Planning

| Beacon | Frequencies |
|--------|-------------|
| Beacon A | 433.500 (primary) |
| Beacon B | 434.000 (primary) |
| Beacon C | 434.500 (primary) |

Each beacon can also carry the group's shared "search" frequency as its secondary, so a rescuer with one receiver can still scan the whole group.

## SEARCH Conflicts

If two beacons share a frequency:

| Situation | Result |
|-----------|--------|
| Both TX simultaneously | Collision, garbled or missed |
| Both TX alternately | Both hits, log fills with 2 entries/cycle |
| Group shares one freq | Rescuer hears "a" beacon but not which |

## Group Protocol

1. Assign each member a unique primary frequency before the trip.
2. Agree on a single shared emergency frequency for coordinated rescues.
3. Record the plan: write each member's frequency on the case.
4. Practice scanning the group plan with a receiver before leaving.

## SEARCH Tip

A rescuer scanning a group should:

1. Configure all group frequencies in one beacon's SEARCH plan.
2. Set dwell high enough (500-1000 ms) to catch each keyed element.
3. Read the hit log's frequency field to identify which beacon was heard.

## Related Pages

- [SEARCH Mode](/wiki/mode-search)
- [Frequency Compatibility](/wiki/frequency-compatibility)
- [Scan Engine Details](/wiki/scan-engine-details)
- [Emergency Communications Plan](/wiki/emergency-communications-plan)
