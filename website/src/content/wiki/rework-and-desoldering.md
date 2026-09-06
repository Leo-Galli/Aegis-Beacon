---
title: Rework and Desoldering
description: Remove and repair solder joints cleanly, without lifting pads or killing components.
---

# Rework and Desoldering

Every builder makes a mistake eventually. The skill is removing the mistake without collateral damage: lifted pads, delaminated traces and overheated components turn a five-minute fix into a rebuild.

## Tools

| Tool | Use |
|------|-----|
| Desoldering braid (wick) | Pulling solder out of through-holes and pads |
| Solder pump (desoldering iron) | Clearing plated through-holes quickly |
| Flux pen or paste | Making old joints reflow cleanly |
| Fine tweezers | Removing components without bending leads |
| Isopropyl alcohol | Cleaning flux residue after rework |

## Removing a wire or through-hole part

1. Apply fresh solder to the old joint. Fresh solder carries the heat in and lowers the melting point of the joint.
2. Add flux, then touch the braid between the iron tip and the joint. The solder wicks up the braid.
3. For a component with several leads (the OLED header, the E22 module), do not fight one pin: heat the pads in sequence while gently lifting, or cut the leads and remove the body, then clear each hole.

## Removing the E22 module

The E22-400M30S is the most delicate part of the board. If you must remove it:

- Use a hot-air rework station at 320-340 C with a wide nozzle, or two irons heating the two end rows simultaneously.
- Never pry: the module has pads underneath that lift with the copper.
- After removal, clean the pads and inspect for lifted traces before re-soldering a replacement.

## Pad damage

If a pad lifts:

- For a signal pad, scrape a tiny window in the solder mask on the adjacent trace and solder the wire there.
- For a ground pad, any nearby ground plane via or exposed ground works.
- Secure the repair with a drop of glue so mechanical stress never reaches the solder joint.

## After rework

1. Clean flux residue with isopropyl alcohol.
2. Inspect under light: look for solder bridges between adjacent pins (common on the OLED header).
3. Re-run the quality gate for the affected stage before moving on. See [Build Quality Gates](/wiki/build-quality-gates).

## Preventing the need for rework

Most rework is caused by rushing the preparation: cold joints from an under-tinned tip, bridges from too much solder, or pads lifted by too little heat. Keep the iron tinned, use flux, and let the joint tell you when it is done. See [Soldering Basics](/wiki/soldering-basics).

## Related pages

- [Soldering Iron Guide](/wiki/soldering-iron-guide)
- [Flux and Solder](/wiki/flux-and-solder)
- [Breadboard Prototyping](/wiki/breadboard-prototyping)