---
title: Long Term Storage
description: "Putting the beacon away for months or a year: the preparation, the cell decision, and the revival procedure."
---

# Long Term Storage

A beacon stored for a year is a project, not a device. The difference between a pleasant revival and a disappointing one is decided the day you put it away.

## The preparation

1. Clean and inspect (see [Cleaning and Inspection](cleaning-and-inspection)).
2. Update the firmware to the current release (see [Release Process](release-process)).
3. Back up the configuration (see [Config Backup](config-backup)).
4. Set the cell to storage charge (see [Battery Storage](battery-storage)).
5. Store cool and dry, antenna detached or protected.

## The cell decision

| Option | Pros | Cons |
| --- | --- | --- |
| Cell installed at 50% | Ready-ish after a top-up | Self-discharge over months |
| Cell removed, stored separately | Best cell health | Beacon is a shell until you return |
| Fresh cell on revival | Simplest | The old cell's fate is unknown |

The honest recommendation: cell out, stored at 50%, and a fresh charge cycle on revival.

## The revival procedure

1. Charge the cell fully (see [Charging and Cell Care](charging-and-cell-care)).
2. Install, power on, watch the boot log (see [Serial Monitor Guide](serial-monitor-guide)).
3. Run the full bench test (see [Two Beacon Bench Test](two-beacon-bench-test)).
4. If the config was wiped by the storage period, restore the backup.
5. GPS: expect a cold start (see [GPS Warm vs Cold Start](gps-warm-vs-cold-start)).

## The calendar

Put a note in your calendar: 6 months after storage, do the quarterly cell check (see [Battery Storage](battery-storage)). A beacon forgotten for two years with a dead cell inside is a battery recycling problem, not a revival.

## Related pages

- [Beacon Care Seasonal](beacon-care-seasonal) for the season rhythm
- [Battery Storage](battery-storage) for the cell rules
- [Pack Check Routine](pack-check-routine) for the revival check