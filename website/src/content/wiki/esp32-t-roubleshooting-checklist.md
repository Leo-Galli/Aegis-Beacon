---
title: "ESP32 Troubleshooting Checklist"
description: "A step-by-step checklist for the most common ESP32 problems in this beacon: no boot, no GPS, no TX, no serial, brownouts and bad flashes"
---

# ESP32 Troubleshooting Checklist

## Overview

This checklist walks through the most common ESP32 problems seen in this beacon. Work through it in order before digging deeper into any one subsystem. In many cases, the cause is power, wiring, or a flash issue rather than a firmware bug.

Use the serial log as the first diagnostic tool. If you have no serial output at all, start with power and the USB/serial connection.

## 1. No Serial Output At All

Symptoms: nothing appears on the USB serial console after power-up or reset.

Steps:

- Confirm the ESP32 is powered. A dev board with a weak USB port or a bad cable can look dead.
- Confirm the USB/serial cable is good and the device is detected by the host.
- Confirm you are connected to the right serial port at the right baud rate.
- Try pressing the reset button and watch for any brief output.
- If the board has a separate USB-to-serial chip, check that it is functioning.

If there is still no output, the board may not be booting at all. Move to power and flash checks.

## 2. Power Problems

Symptoms: intermittent boot, brownout messages, reboots under load, no TX.

Steps:

- Confirm the board is getting stable 5V or 3.3V as required by the board.
- Check for a low USB current limit on the host.
- If the board is powered from a battery, confirm the voltage is within range and the regulator is working.
- Watch for brownout messages in the serial log. Brownouts usually mean the power rail is dipping under load.
- If TX causes a reboot, the power rail may not handle the current spike. Add better power supply or decouple the radio and ESP32 supplies properly.

Power is the most common cause of intermittent failures. Fix it first.

## 3. GPS Not Working

Symptoms: GPS shows no satellites, no fix, or garbage on UART2.

Steps:

- Confirm the GPS module is powered at 3.3V.
- Confirm the TX and RX pins match the firmware: GPS TX to ESP RX on the UART2 RX pin, GPS RX to ESP TX on the UART2 TX pin.
- Confirm the baud rate is 9600.
- Confirm you are using UART2, not UART1 or UART0.
- Open serial and look for GPS log events.
- If the GPS shows zero satellites, the module is not seeing the sky. Move it outdoors with a clear view.

If the GPS shows garbage, check for a wiring swap between TX and RX, or a baud mismatch.

## 4. No Radio TX

Symptoms: beacon mode does not transmit, or the radio initializes and then fails.

Steps:

- Confirm the radio module is powered.
- Confirm the SPI pins match the firmware.
- Confirm the BUSY pin is connected. A missing BUSY pin is a common cause of radio hangs.
- Confirm the reset and DIO1 pins are connected.
- Watch the serial log for radio init messages or errors.
- Confirm the frequency is within the SX1262's supported range and within local regulation.
- Confirm the antenna is connected. An open antenna can cause a TX fault on some modules.

If the radio initializes but never transmits, check power during TX and the antenna.

## 5. OLED Not Working

Symptoms: OLED stays dark or shows garbage.

Steps:

- Confirm the OLED is powered.
- Confirm the SPI pins match the firmware.
- Confirm RES, DC, and CS are connected.
- If the OLED is wired but stays dark, check the enable flag in CONFIG.
- If it shows garbage, check the SPI pins and the reset pin.

## 6. Buttons Not Responding

Symptoms: pressing buttons does nothing.

Steps:

- Confirm the button GPIOs match the firmware.
- Confirm each button pulls the pin in the expected direction (internal pull-up or pull-down as the firmware expects).
- Test one button at a time and watch the button log.
- If a button is registered but does nothing, check the firmware behavior for that button in the current mode.

## 7. Bad Flash

Symptoms: the device runs old firmware, behaves strangely, or does not run the firmware you uploaded.

Steps:

- Re-flash the firmware cleanly.
- Confirm the flash tool is targeting the correct serial port.
- Confirm the firmware binary matches the board and pin configuration you intend to use.
- After flashing, reset the board and check the serial banner for the expected version.
- If the device keeps running old code, it may be a stale boot mode or a flash address issue.

## 8. NVS Confusion

Symptoms: settings do not persist, or the device behaves as if it has old settings after a reflash.

Steps:

- Confirm you saved after changing settings.
- If settings should not persist, use factory reset.
- Remember that a reflash does not erase NVS by default.
- If the firmware changed key names, old NVS keys remain and new keys use defaults.

## 9. CONFIG Portal Not Reachable

Symptoms: entering CONFIG does not give a portal.

Steps:

- Confirm you held SW_SEL for 3 seconds.
- Confirm the device entered CONFIG mode (check the serial log or OLED).
- Confirm your device joined the access point.
- Try opening http://192.168.4.1 directly.
- Remember the portal auto-reverts after 5 minutes without a client.

## 10. Intermittent Wires

Symptoms: a function works sometimes and not others.

Steps:

- Wiggle connectors and wires while watching the serial log.
- Check for loose connections, cold solder joints, and thin wires that flex.
- For the GPS and radio, a flaky connection can cause intermittent loss of fix or TX faults.

## Final Step

If you have worked through this checklist and the problem remains, capture the serial log during the failure and check which subsystem logs an error. The log usually points to the failing stage: boot, GPS, radio init, OLED init, button init, or CONFIG mode.

## Related Pages

- [ESP32 Serial Debug Output](/wiki/esp32-serial-debug) — how to read the log.
- [NEO-6M GPS Module](/wiki/nx130-gps-module) — GPS-specific failures.
- [Radio Library and SX1262](/wiki/radio-library-and-sx1262) — radio-specific failures.
- [Serial Debug System](/wiki/serial-debug-system) — the full debug interface.
