---
title: Battery Field Swap
description: "Swapping the beacon's cell in the field: the case access, the cold-weather technique, and the verification after the swap."
---

# Battery Field Swap

The beacon's user-replaceable cell is its main advantage over sealed commercial devices. The swap is trivial on the bench and a skill in the field, especially in winter.

## Before you need it

- The spare cell travels in an inside pocket, against body heat (see [Cold Weather Batteries](cold-weather-batteries)).
- Know your case's battery access: a gasketed door opens in seconds; a sealed case does not (see [Waterproofing](waterproofing-and-enclosure-sealing)).
- Practice the swap at home until it takes under a minute, with gloves.

## The swap sequence

1. Confirm the beacon is off or asleep (the swap must not happen mid-burst).
2. Open the battery access.
3. Remove the old cell, note its voltage (below 3.3 V: it is done for this trip).
4. Insert the fresh cell, observing polarity.
5. Close and verify the seal.
6. Power on and confirm: boot log clean, battery voltage reads full, one test burst.

## The cold technique

In winter the fresh cell from an inside pocket arrives warm and delivers full current; the old cell, cold, sags under TX (see [Cold Weather Batteries](cold-weather-batteries)). Do not trust the old cell's readings until it has warmed: swap at the first sign of sag, not at the first "low" reading.

## The verification after

The post-swap test burst is mandatory: it confirms polarity, contact, and seal in one action. A beacon that booted but transmits into a broken contact is a beacon that fails silently.

## Related pages

- [18650 Battery Guide](18650-battery-guide) for the cell
- [Cold Weather Batteries](cold-weather-batteries) for winter
- [Battery Troubleshooting](battery-troubleshooting) for the fault side