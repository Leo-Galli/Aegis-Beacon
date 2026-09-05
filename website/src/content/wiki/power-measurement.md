---
title: Power Measurement
description: How to measure the beacon's current draw in every mode with a multimeter, and the numbers you should see.
---

# Power Measurement

"You think the beacon draws 50 mA" is not data. Measuring it takes five minutes with a multimeter and answers the questions that actually matter: is the sleep actually sleeping, is the radio efficient, and will the battery last the trip.

## Measuring average current

The honest tool for average draw is a USB meter or a bench power supply with current readout. The quick approximation with a multimeter:

1. Set the meter to mA DC.
2. Put it in series with the battery positive lead.
3. Run the beacon in each mode for 30 seconds and record the average.

## The problem with peaks

The TX burst pulls 120 mA for a second. A multimeter's averaging hides this and reads somewhere between sleep and TX. To see the true picture, log with a scope or a data logger, or compute the average from the duty cycle (see [Battery Capacity Math](battery-capacity-math)).

## Expected numbers

| State | Expected current |
| --- | --- |
| Deep sleep (firmware default) | 0.02 - 0.15 mA |
| Idle, radio off | 20 - 30 mA |
| GPS acquiring | +40 - 60 mA |
| RX listening | +10 - 15 mA |
| TX burst (+22 dBm) | 110 - 140 mA |

## Red flags

| Reading | Problem |
| --- | --- |
| Sleep current above 1 mA | Board LED, regulator, or GPS left powered |
| TX current below 80 mA | Power level setting wrong, or radio in a low-power state |
| Idle current above 60 mA | Something is not sleeping: OLED backlight, GPS, WiFi |
| Current jumps randomly | Brownout protection cycling |

## The WiFi trap

A common mistake is leaving the ESP32's WiFi or Bluetooth stack enabled. WiFi alone adds 80 - 160 mA whenever it is active. The beacon's firmware keeps WiFi off in normal operation (see [WiFi and Security](wifi-and-security)).

## Related pages

- [Current Draw by Mode](current-draw-by-mode) for the table
- [Power Budget and Runtimes](power-budget-and-runtimes) for the consequences
- [Firmware Deep Sleep](firmware-deep-sleep) for the sleep side