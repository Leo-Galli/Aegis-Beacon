---
title: Water Damage Recovery
description: "What to do when the beacon gets wet: the immediate steps, the drying procedure, and the corrosion cleanup that decides its future."
---

# Water Damage Recovery

Water happens: a stream crossing, a rainstorm, a dropped beacon in snow. The first hour decides whether the beacon survives, and the first minutes decide the first hour.

## The immediate steps

1. **Power off immediately**: remove the cell or disconnect power. Corrosion starts the moment current flows through wet traces.
2. **Remove the cell and open the case.**
3. **Dry the visible water** with a cloth; do not wipe electronics aggressively.
4. **Do NOT power on to "test if it works"** for at least 48 hours. Testing early is how a wet board dies.

## The drying procedure

| Method | Use | Rating |
| --- | --- | --- |
| Air dry, warm room | The standard: 48 - 72 hours, board propped up | Safe |
| Rice (uncooked) | Absorbs moisture; messy, mediocre | OK |
| Silica gel packets | The professional version of rice | Good |
| Low oven (50 C) | Fast but risky; plastic melts | Only if desperate |
| Isopropyl alcohol rinse | Removes residue AND displaces water | For contaminated boards |

## The alcohol rinse

If the water was dirty (snow melt, stream, mud), rinse the board in 99% isopropyl alcohol after drying: the alcohol displaces remaining water and dissolves the conductive residue. Then dry again. This is the single best trick for a wet board.

## Corrosion cleanup

After drying, inspect under magnification. White or green crystals on traces mean corrosion:

1. Neutralize with isopropyl or a soft brush.
2. If a trace is eaten, bridge it with a wire (see [Soldering Basics](soldering-basics)).
3. Check connectors: the antenna SMA and the audio jack are the classic corrosion sites.

## The judgment call

A board that dried, cleaned and passed the bench tests ([First Power On Protocol](first-power-on-protocol)) is trustworthy. A board that shows corrosion on the radio section should be retired: the SX1262's RF path is unforgiving of residue. The cell, if it got wet, goes to recycling, not back in the beacon.

## Related pages

- [Waterproofing and Enclosure Sealing](waterproofing-and-enclosure-sealing) for prevention
- [Field Maintenance and Storage](field-maintenance-and-storage) for the aftercare
- [Troubleshooting](troubleshooting) for the general checklist