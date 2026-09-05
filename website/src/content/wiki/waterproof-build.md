---
title: Waterproof Build
description: "Taking the beacon to IP67: case sealing, connector treatment, and the assembly order that keeps water out of the electronics."
---

# Waterproof Build

A rescue device that dies in rain is not a rescue device. The waterproof build takes the standard case and closes every water path, systematically.

## The water paths

| Path | Fix |
| --- | --- |
| Case seam | Gasket or silicone seal |
| USB port | Not present in the sealed build (flash before sealing) |
| Antenna mount | SMA with O-ring or dielectric grease |
| Button holes | Membrane buttons or sealed caps |
| Audio jack | Sealed jack or delete it |
| Battery access | Closed case, or a gasketed door |

## The assembly order

1. Complete and test ALL electronics outside the case (see [First Power On Protocol](first-power-on-protocol)).
2. Flash the final configuration.
3. Seal the USB port (tape or epoxy) or omit it from the case cutout.
4. Mount everything, route the antenna cable, close the case with the gasket.
5. Water test: 30 minutes in a sink, then open and inspect for droplets.

## Materials

| Material | Use |
| --- | --- |
| Silicone gasket or RTV | Case seam |
| Dielectric grease | Connector threads |
| Membrane buttons | The button openings |
| Hot glue or epoxy | Cable entries |

## The honest trade-off

Sealing costs access: changing settings needs the WiFi portal (which works through the case, see [WiFi Config Portal](wifi-config-portal)), and changing the battery needs opening the case. For most users, the right compromise is a gasketed case with a battery door rather than a permanently sealed one.

## Testing after sealing

The sealed build must repeat the bench tests: the gasket and seals do not affect RF, but the antenna mount does. Re-run [Receiver Testing](receiver-testing) and [Transmitter Testing](transmitter-testing) after the seal, not before.

## Related pages

- [Waterproofing and Enclosure Sealing](waterproofing-and-enclosure-sealing) for the full procedure
- [Case Cutouts Guide](case-cutouts-guide) for the holes
- [Field Maintenance and Storage](field-maintenance-and-storage) for the seals' care