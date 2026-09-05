---
title: GPS Failure Contingency
description: "What to do when the GPS cannot get a fix in the field: manual coordinates, dead reckoning, and knowing your position anyway."
---

# GPS Failure Contingency

Satellites fail, modules fail, batteries sag. The beacon is a safety device, so the plan must assume the GPS is the first thing to go. This page is the plan.

## Manual coordinates are the backup

The beacon accepts manual coordinates in CONFIG mode. If the GPS is dead, enter your position from the map. Update it whenever you reach a named point: a summit, a hut, a trail junction. The beacon then transmits your last confirmed position, which is dramatically better than nothing.

## Before the trip: know your entry point

Write down the coordinates of your trailhead and your planned route start on paper. Rescuers can always search from your last known entry. This costs nothing and covers the case where the beacon dies before your first GPS fix.

## The 10-minute rule

If the GPS has not fixed within 10 minutes of open sky, treat it as failed:

1. Check the module is powered (LED behavior, CONFIG GPS setting).
2. Check the antenna is pointing up and clear of metal.
3. If still nothing, switch to manual coordinates and move on.

## Dead reckoning in the field

Without GPS, position comes from map, compass, pace count and time. Plot your route point by point: when you change direction, mark the junction. This is the classic navigation skill that GPS quietly replaced; it is worth rehearsing once a season.

## What the beacon transmits on GPS failure

Without a fix and without manual coordinates, the payload carries no position field. The receiver hears SOS plus identification but not where you are. The scan/reception page explains how to interpret that (see [Receiver Compatibility](receiver-compatibility)).

## The honest summary

GPS is a convenience, not the plan. The plan is: a known entry point, manual coordinates updated at landmarks, and map-and-compass skill as the last line. The beacon amplifies all three; it does not replace them.

## Related pages

- [Mode Config](mode-config) for entering manual coordinates
- [GPS Troubleshooting](gps-troubleshooting) for the fault checklist
- [Pre Trip Checklist](pre-trip-checklist) for the pre-departure routine