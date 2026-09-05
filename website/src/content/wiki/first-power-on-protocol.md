---
title: First Power-On Protocol
description: The step-by-step procedure for the first time you apply power, with the measurements to take at each step.
---

# First Power-On Protocol

The first power-on is when wiring mistakes reveal themselves. Do it slowly, with a multimeter in hand.

## Before applying power

1. Visually inspect every solder joint (magnifier if you have one).
2. Check for solder bridges between adjacent pads - the OLED and radio headers are the usual spots.
3. Confirm battery polarity in the holder.
4. Confirm the antenna or dummy load is attached.
5. Have the multimeter set to DC volts.

## Step 1: Power rails

Insert the cell (or connect the bench supply at 3.7-4.2 V with a 300 mA limit).

- Measure the ESP32 3V3 pin: **3.3 V**.
- Measure the divider midpoint (GPIO 36): **half of BAT+** (about 1.85-2.1 V).
- Measure current draw: **under 50 mA** at idle with no display, or expect the OLED current.

If any of these are wrong, power off and trace the fault before going further.

## Step 2: Boot

- OLED shows the boot screen with the version.
- The red LED blinks.
- The device proceeds to the GPS wait screen or BEACON mode.

If nothing happens: check 3V3 again, then the OLED wiring, then suspect the flash (reflash the firmware).

## Step 3: Buttons and LEDs

- MODE toggles BEACON/SEARCH and the LED changes red/blue.
- Hold MODE 2 s: EMERGENCY screen appears (red fast blink).
- Hold SEL 3 s: CONFIG screen with SSID/IP appears.

## Step 4: Radio

- In BEACON, current rises to ~100-130 mA during TX.
- The OLED shows the TX progress bar.
- A receiver within a few meters hears the Morse.

## Step 5: Record

Write down firmware version, voltages, and any anomaly. Keep the log with the beacon.

## If something fails

Do not re-power repeatedly. Power off, verify the last phase's wiring, fix, retry. The most common first-boot faults are the BUSY pin, the OLED header bridge, and reversed LEDs.