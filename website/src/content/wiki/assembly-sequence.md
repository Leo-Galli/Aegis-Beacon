---
title: Assembly Sequence
description: The recommended order of assembly that catches wiring errors before they are buried under other modules.
---

# Assembly Sequence

The order you assemble matters. Solder the power path first, test it, then add peripherals one at a time.

## Phase 1: Power

1. Solder the TP4056 module and the 18650 holder.
2. Solder the battery divider (100k/100k to GPIO 36).
3. Connect the ESP32 DevKit 5V pin to the TP4056 BAT+.
4. **Test**: insert the cell, measure 3.3 V on the ESP32 rail and half of BAT+ at GPIO 36.

## Phase 2: Display

5. Wire the OLED (SCK=15, SDA=13, RES=4, DC=16, CS=17, VCC, GND).
6. **Test**: the boot screen appears and the battery icon shows a sensible value.

## Phase 3: Radio

7. Wire the E22 (VSPI: SCK=18, MISO=19, MOSI=23, CS=5, RST=14, BUSY=21, DIO1=2, VCC, GND).
8. **Test**: the beacon boots into BEACON and transmits; current rises during TX. If it hangs, check BUSY first.

## Phase 4: Controls and status

9. Wire the four buttons (MODE=33, SEL=32, UP=35, DN=34 with external pull-ups on 34/35).
10. Wire the LEDs (red=27, blue=26 via 330 Ω).
11. **Test**: MODE cycles modes, LEDs match the mode.

## Phase 5: Audio and GPS

12. Wire the audio jack (GPIO 25 → 100 Ω → 10 µF → tip).
13. Wire the GPS (TX to GPIO 22, RX to GPIO 12, VCC, GND).
14. **Test**: headphone clicks during TX; GPS fix screen resolves outdoors.

## Phase 6: Enclosure

15. Mount the board, OLED, buttons, and antenna in the case.
16. Do the full bench test suite, then the outdoor range test.

## Why this order

Every phase is testable on its own. If phase 4 fails, the problem is in the buttons - not hidden under the radio wiring. Skipping the per-phase tests is how "it was working yesterday" mysteries begin.