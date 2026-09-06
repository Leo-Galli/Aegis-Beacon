---
title: First Boot
description: What should happen the first time you power the beacon, screen by screen, and what counts as normal.
---

# First Boot

The first power-up is the moment of truth. Here is exactly what should happen, in order.

## Before power

1. Verify the battery is charged (3.7-4.2 V on the multimeter).
2. Check the antenna is connected (or a dummy load is in place).
3. Double-check the polarity of the battery holder.

## The boot sequence

1. The OLED lights up with the **AEGIS-BEACON v5.5** header, inverted.
2. The red LED blinks once or twice.
3. If GPS is enabled and there is no cached fix, the **ACQUIRING GPS FIX** screen appears with a satellite count and progress bar.
4. After the fix (or timeout, or pressing MODE to skip), the beacon enters **BEACON** mode.
5. The BEACON screen shows the frequency, TX bar, and payload, then the beacon transmits and enters deep sleep.

## What counts as normal

- The OLED is dim but clearly readable.
- The frequency displayed matches your configured default (433.500 MHz unless changed).
- You can hear Morse clicks on headphones plugged into the 3.5 mm jack during TX.

## What counts as a problem

- No OLED: check power and the software SPI pins (SCK=15, SDA=13, RES=4, DC=16, CS=17).
- OLED but no radio: check the BUSY pin (GPIO 21) wiring and the VSPI connections.
- Continuous reboot loop: suspect the watchdog or a power supply sag; try a fresh battery.
- GPS screen that never resolves and never times out: check the GPS UART wiring (TX to GPIO 22).

## After a successful boot

Enter CONFIG mode (hold SEL 3 seconds), connect to the AEGIS-SETUP WiFi AP, and open 192.168.4.1 to verify the dashboard reports the right values. Then do a two-beacon bench test with another receiver.