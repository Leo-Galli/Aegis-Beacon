---
title: Bench Testing Basics
description: "The standard tests to run on a finished beacon before it goes in a pack: continuity, power, TX, RX, and GPS."
---

# Bench Testing Basics

A finished beacon deserves a standard test pass before field use. Run these in order; each test depends on the previous one passing.

## 1. Continuity and power

- Measure resistance from BAT+ to GND (should not be near zero).
- Apply power, verify 3.3 V at the ESP32 rail.
- Verify the divider reads half of BAT+ at GPIO 36.

## 2. Boot and display

- Boot screen shows the correct version.
- All four modes display the expected layouts (use the MODE button).
- Battery icon shows a sensible percentage.

## 3. Radio transmit

- With a dummy load attached, enter BEACON and verify the TX bar and LED.
- Measure current during TX: expect ~100-130 mA at +17 dBm.
- Listen on headphones for the Morse click stream.

## 4. Radio receive

- Enter SEARCH and confirm the RSSI reads a floor value (typically -110 to -90 dBm with no signal).
- Place a second beacon (or your SDR) transmitting nearby and confirm the RSSI rises and the audio pitch changes.

## 5. GPS

- Take the beacon to a window or outside.
- Enter BEACON with GPS enabled and watch the fix screen.
- Confirm a fix within the configured timeout, and that the payload preview includes coordinates.

## 6. Config portal

- Hold SEL for 3 s, connect to AEGIS-SETUP, open 192.168.4.1.
- Change one setting, save, confirm it survives a reboot.

## 7. Battery endurance

- Log the deep-sleep current (target 10-50 uA).
- Estimate runtime from the sleep current and duty cycle; the Power Budget page has the math.

## When to call it done

A beacon that passes all seven tests is ready for the field. Record the results in the build log: the firmware version, the serial number of the ESP32, the battery, and the date. Months later, "it used to pass" is not data; the log is.