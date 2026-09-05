---
title: Common Beginner Mistakes
description: The ten mistakes that cause the most forum posts, and how to avoid each one before it costs you a weekend.
---

# Common Beginner Mistakes

These are the failure modes seen over and over again in first builds. Read this page before you solder anything.

## 1. Not wiring the BUSY pin

The SX1262 BUSY pin (GPIO 21) is **mandatory**. If it is not connected, the firmware hangs on the first radio call and the beacon appears dead. This is the single most common cause of "my beacon does nothing".

## 2. Feeding 5 V to a 3.3 V part

The E22 radio, the OLED, and the GPS all run at 3.3 V (the GPS tolerates 3.3-5 V, but the radio does not). Use the ESP32's 3V3 rail, never VBUS.

## 3. Reversing the battery polarity

The TP4056 BAT+ output and the 18650 holder can be wired backwards. Check polarity twice; a reversed cell can destroy the ESP32.

## 4. Using an I2C OLED

The firmware drives a **7-pin SPI** SSD1309. A 4-pin I2C SSD1306 will not work without firmware changes. Buy the SPI panel.

## 5. Charge-only USB cable

Flashing fails mysteriously with a cable that carries power but no data. Test the cable on any other device first.

## 6. Wrong GPIO for GPS RX

GPS TX connects to **GPIO 22** (a valid input). GPS RX connects to GPIO 12. Swapping them produces no fix and confusing serial output.

## 7. Antenna not actually connected

The E22 has an SMA connector. If you use a bare wire instead, or the SMA nut is loose, range collapses to meters. Verify continuity between the antenna base and ground plane.

## 8. Missing pull-ups on input-only pins

GPIO 34 and 35 (UP and DN buttons) have no internal pull-ups. Without external 10 kΩ pull-ups the buttons read random values.

## 9. Forgetting the antenna rule for tests

Transmitting with no antenna at all can damage the PA over time. Use a dummy load or a real antenna even for quick tests.

## 10. Skipping the battery divider check

The 100 kΩ/100 kΩ divider halves the battery voltage. If you use different values, the ADC reads wrong percentages. Measure with a multimeter: full cell should read about 2.1 V at the GPIO 36 midpoint.