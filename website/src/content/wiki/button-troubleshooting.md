---
title: Button Troubleshooting
description: "Diagnosing button faults: double-triggers, no response, phantom presses, and the debounce and wiring checks."
---

# Button Troubleshooting

Buttons are the most mechanically stressed part of the beacon: they get pressed in the cold, with gloves, thousands of times. Their faults are distinctive, and most are wiring, not firmware.

## The symptom map

| Symptom | Likely cause |
| --- | --- |
| No response at all | Wiring, or wrong pin in config |
| Double-triggers | No pull resistor, or electrical noise |
| Works but sticky | Debris in the switch |
| Works cold, not warm (or reverse) | Cold solder joint expanding |
| Phantom presses at random | Noise on the line, or water ingress |

## The wiring check

1. With the beacon off, measure continuity between the button pins: open when released, closed when pressed.
2. Verify the firmware's configured pin matches the wired pin (see [GPIO Pin Mapping](gpio-pin-mapping)).
3. Check the pull resistor: the line must be held high (or low) when the button is released.

## Debounce

The firmware debounces in software (see [Firmware Buttons](firmware-buttons)), but it cannot fix a missing pull resistor: a floating line reads random presses. If double-triggers persist with the pull in place, add a 100 nF capacitor across the button.

## The glove problem

In winter, stiff gloves make presses slow and partial. If a press does not register, the user presses harder, and membrane buttons can stick. The fix is mechanical: buttons with more travel, or the firmware's press-and-hold alternatives (see [Button Actions in Config](button-actions-in-config)).

## The water problem

Water between the contacts reads as a phantom press. After wet trips, dry the buttons and check the case seal (see [Waterproofing](waterproofing-and-enclosure-sealing)).

## Related pages

- [Button System Details](button-system-details) for the design
- [Button Types Guide](button-types-guide) for the parts
- [Firmware Buttons](firmware-buttons) for the code side