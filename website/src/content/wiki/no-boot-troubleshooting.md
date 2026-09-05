---
title: No Boot? Troubleshooting
description: The beacon powers up but nothing happens. The systematic path from power to firmware.
---

# No Boot? Troubleshooting

"No boot" has a narrow set of causes. Work top to bottom; the cheap checks are first.

## 1. Power really present?

- Measure the ESP32 3V3 pin: 3.3 V.
- Measure BAT+: 3.7-4.2 V.
- Check the battery holder contacts: a loose spring or a reversed cell both read oddly.
- Watch the current draw: a board pulling 500 mA+ is shorted; a board pulling 0 mA has an open power path.

## 2. Is it booting but silent?

- The OLED may be dead while the ESP32 runs. Connect Serial at 115200 and look for the boot log.
- The red LED on the DevKit (power LED) should light. The onboard "EN" behavior tells you the ROM booted.

## 3. Flashing state

- A board that was previously flashed may have a corrupted app. Reflash with `esptool` or the IDE; if upload fails at "Connecting...", hold BOOT and retry.
- If the board is new and never flashed, it may be running the factory demo or nothing at all. Flash the firmware first.

## 4. The classic hardware causes

- **BUSY pin not wired**: firmware hangs in radio init; boot log stops after the radio init line. Fix: wire GPIO 21 to the E22 BUSY.
- **Solder bridge on the EN button or RESET line**: the board stays in reset. Measure EN: should be 3.3 V.
- **Short on the 3V3 rail**: radio or OLED wired to the wrong rail. Measure 3V3 under load.

## 5. Power sag

A dying cell under the PA's burst can brown-out the ESP32, causing a reboot loop. Symptom: boot screen flashes and restarts. Fix: fresh cell or bench supply; check the BAT+ wiring for voltage drop.

## 6. Serial output tells you everything

Attach Serial at 115200. The boot log tells you exactly where it stops: flash init, radio init, GPS wait, or the main loop. That single line of evidence eliminates 90% of the guessing.