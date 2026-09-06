---
title: Effective Build Strategy
description: Plan the build like a staged project so every module is tested before it is buried under the next one.
---

# Effective Build Strategy

An Aegis-Beacon build is a sequence of small, independently testable stages. The difference between a build that works on the first try and one that needs hours of debugging is usually the order you do things in, not your soldering skill.

## The one rule that saves the most time

> Never cover an untested module with another module.

Every stage must end with a measurable check. If a fault is found later, you will have to undo work to reach it. If it is found at the stage boundary, the fix is a single wire or one reflow.

## Stage plan

| Stage | What you build | Test gate before moving on |
|-------|----------------|-----------------------------|
| 1. Power | TP4056, cell holder, divider, ESP32 5V rail | 3.3 V on the rail; half of BAT+ on GPIO 36 |
| 2. Display | OLED on software SPI | Boot screen with a sensible battery icon |
| 3. Radio | E22 module on VSPI | Boots into BEACON, transmits, current rises during TX |
| 4. Controls | Buttons and LEDs | Each button toggles its function; LEDs light |
| 5. Audio | DAC path and jack | Tone in headphones, no clicks at silence |
| 6. GPS | NEO-6M on UART2 | Fix acquired outdoors, coordinates in the payload |
| 7. Enclosure | Case, cutouts, final fit | Everything fits without stress on cables |

Each gate is a real measurement, not a visual check. Write the measured values in the build log; they are your baseline when something drifts later.

## Batch the boring work

Time is lost switching tools. Do all the repetitive operations in one sitting:

- Pre-cut and pre-tin every wire to length before starting the board.
- Solder both LEDs and their resistors in one pass.
- Crimp or pre-solder the battery holder and switch terminals together.
- Test the cell and charger on the bench before it goes anywhere near the board.

## Protect your work

- Use a bench mat and wrist strap: one ESD zap can kill the ESP32 or the GPS receiver.
- Keep the antenna off the board while soldering the radio: an open SMA is fine, a whip touching the bench shorts nothing, but a disconnected 50 ohm trace acts as an antenna during TX. Fit the antenna only after the radio stage passes.
- Work cell-out until the power stage passes: a fresh 18650 can source several amps into a short.

## When you are stuck

Stop and measure. The three most common stuck points and their fastest checks:

1. Radio hangs on the first call: measure continuity from BUSY to GPIO 21. BUSY is the most-missed wire.
2. OLED blank: check that the 7-pin display is SPI, not the 4-pin I2C variant, then verify RES and CS are high after boot.
3. Battery reads 0 % or 100 % forever: the divider is disconnected. Measure the voltage directly at GPIO 36.

See [Assembly Sequence](/wiki/assembly-sequence) for the full wiring order and [Bench Checklist](/wiki/bench-checklist) for the complete test list.

## Related pages

- [Build Quality Gates](/wiki/build-quality-gates)
- [Bench Jigs and Fixtures](/wiki/bench-jigs-and-fixtures)
- [Rework and Desoldering](/wiki/rework-and-desoldering)
- [Time Budget and Planning](/wiki/build-time-planning)