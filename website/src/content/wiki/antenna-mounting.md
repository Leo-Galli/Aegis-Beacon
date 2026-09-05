---
title: Antenna Mounting
description: "How to mount the antenna on the beacon case: SMA flange, panel mount, strain relief, and keeping metal away from the radiator."
---

# Antenna Mounting

The best antenna is useless if it is mounted badly. The mount does three jobs: hold the antenna, connect it electrically, and keep the surrounding structure from detuning it.

## Mount types

| Mount | Pros | Cons |
| --- | --- | --- |
| SMA panel mount | Standard, swappable antennas | Requires a cutout and nut |
| SMA flange mount | Lower profile, self-sealing | Fixed orientation |
| Direct solder (whip) | Cheapest, most rugged | Not swappable |

The beacon's recommended build uses an SMA panel mount on the case top, with the antenna outside and the radio inside.

## Keeping metal away

Every metal object near the antenna detunes it and absorbs radiation. The rules:

- Keep the antenna at least 30 mm from the battery, the ESP32 board and the OLED.
- Route the coax away from the radiator.
- If the case is metal, the antenna must be fully outside it, and the case acts as the ground plane (which is good, see [Quarter Wave Antenna](quarter-wave-antenna)).

## Strain relief

Field gear gets dropped. A whip antenna snapped at the connector is the single most common field failure. Mitigations:

- A short rubber boot over the SMA base
- A guy line or sleeve for long whips
- Recessed mount so the antenna bends rather than snaps

## Water ingress

The SMA connector is a water path. Seal it with a silicone gasket or dielectric grease at the flange, and keep the connector threads dry. See [Waterproofing](waterproofing-and-enclosure-sealing) for the full procedure.

## The 1 cm rule

A practical check: if the antenna can be bent so the metal parts of the case touch it, the mount is wrong. Recess or extend it so the radiator is always clear.

## Related pages

- [Case Cutouts Guide](case-cutouts-guide) for the hole dimensions
- [Antenna Cable and Connectors](antenna-cable-connectors) for the coax
- [Field Deployment](field-deployment) for in-the-field setup