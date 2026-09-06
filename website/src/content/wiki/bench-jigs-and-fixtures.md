---
title: Bench Jigs and Fixtures
description: Simple homemade fixtures that make bench testing faster, safer and repeatable.
---

# Bench Jigs and Fixtures

A few minutes of fixture building saves hours over the life of the project. These fixtures are cheap, take minutes to make, and make every quality gate faster and safer.

## Dummy load

A 50 ohm dummy load lets you test TX without radiating. Use a 47-51 ohm resistor rated at least 2 W (a 2 W carbon or a 3 W wirewound works) soldered to an SMA connector:

- SMA center to one resistor leg, SMA shell to the other.
- Mount the resistor so it can dissipate heat in free air.
- Expected power at +22 dBm into 50 ohm: about 160 mW continuous. A 2 W resistor stays cool.

With the dummy load fitted you can key the radio on the bench legally and safely, and measure the actual output with an RF power meter if you have one.

## LED test clip

Instead of wiring LEDs first, clip a red and a blue LED with 330 ohm resistors onto jumper wires that reach GPIO 27 and 26. Test the mode logic before the LEDs are installed in the case. This also tells you instantly whether a non-working LED later is the LED or the firmware.

## Continuity probe

Make a beeper from a 3 V coin cell, a piezo buzzer and two probe wires. Continuity testing the BUSY, DIO1 and CS lines before first power-on catches the two most common wiring faults in seconds.

## Serial breakout

Keep a USB-serial adapter with a 3.3 V logic level (CP2102 or CH340) permanently wired to a 4-pin header. Plugging the ESP32's UART0 into a breakout lets you read the boot log and issue serial commands without unplugging the programming cable. See [Serial Monitor Guide](/wiki/serial-monitor-guide).

## Cell holder on a bench

Mount a spare 18650 holder on the bench with short leads ending in a 2-pin header. Use it to power the board during development instead of juggling the cell in the final holder: faster swaps, and the cell is never near a soldering iron.

## Antenna tap

A short SMA-to-binding-post adapter (or a clip lead soldered to an SMA pigtail) lets you swap antennas in seconds during range tests. Useful when comparing the wire whip against the SMA whip. See [Antenna Testing and Tuning](/wiki/antenna-testing-and-tuning).

## Measurement log sheet

Keep a printed or digital sheet with one row per gate (power, display, radio, controls, audio, GPS) and columns for date, measured values and result. See the [Beacon Log Template](/wiki/beacon-log-template). The sheet turns a chaotic bench session into a repeatable procedure.

## Related pages

- [Bench Power](/wiki/bench-power)
- [Dummy Load and Bench Testing](/wiki/dummy-load-and-bench-testing)
- [Two-Beacon Bench Test](/wiki/two-beacon-bench-test)