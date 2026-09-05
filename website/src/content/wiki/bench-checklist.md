---
title: Bench Checklist
description: The complete bench test sequence for a new or repaired beacon, in order, with the pass criteria for each step.
---

# Bench Checklist

A new build or a repair gets the full bench sequence. This page is the order, so nothing gets skipped because it "was probably fine".

## The sequence

| Step | Test | Pass criteria |
| --- | --- | --- |
| 1 | Visual + continuity | No shorts on the power rails (see [Schematic Reading](schematic-reading)) |
| 2 | First power on | Boot log clean, no error codes (see [First Power On Protocol](first-power-on-protocol)) |
| 3 | Display | OLED shows the mode screen correctly |
| 4 | Buttons | Each button registers, debounced (see [Button Troubleshooting](button-troubleshooting)) |
| 5 | GPS | Fix outdoors; coordinates match the map position (see [GPS Testing Indoors](gps-testing-indoors)) |
| 6 | Audio | Tone plays; recording decodes (see [Audio Recording Guide](audio-recording-guide)) |
| 7 | Radio TX | One burst, frequency correct (see [Transmitter Testing](transmitter-testing)) |
| 8 | Radio RX | Second beacon decodes it (see [Two Beacon Bench Test](two-beacon-bench-test)) |
| 9 | Battery | Sleep current in spec; runtime estimate sane (see [Power Measurement](power-measurement)) |
| 10 | Config | Every setting saves and survives reboot (see [Config Backup](config-backup)) |

## The pass rule

A step that fails stops the sequence: do not proceed on a failing board. Fix, retest, continue. The [Troubleshooting](troubleshooting) page covers every failure mode the sequence can hit.

## The log

Record each step in the [Beacon Log Template](beacon-log-template). The bench log is the baseline every future test compares against.

## The time

The full sequence takes about an hour for a new build, less for a repair. Skipping it to "save time" converts an hour into a field failure (see [Pack Check Routine](pack-check-routine)).

## Related pages

- [First Power On Protocol](first-power-on-protocol) for step 2
- [Two Beacon Bench Test](two-beacon-bench-test) for steps 7-8
- [Beacon Log Template](beacon-log-template) for the record