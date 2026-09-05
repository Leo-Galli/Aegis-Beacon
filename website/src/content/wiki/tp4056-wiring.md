---
title: TP4056 Wiring
description: "How to wire the TP4056 charger module into the beacon: input, battery, and the STDBY detection pin."
---

# TP4056 Wiring

The TP4056 module is a complete Li-ion charge manager with protection (DW01A + FS8205). Getting the wiring right is a one-time task; getting it wrong can be dangerous.

## The module pins

| Pad | Function |
|-----|----------|
| IN+/USB | 5 V charge input (USB-C on most modules) |
| IN-/GND | Ground |
| BAT+ | Battery positive (also the measurement point) |
| BAT- | Battery negative (through the protection FETs) |
| STDBY | Open-drain status: LOW while charging |
| CHRG | Open-drain status: LOW when charging complete |

## Wiring to the beacon

1. **USB input**: the module's USB-C port (or IN+ pads) connects to a power source for charging.
2. **BAT+ to ESP32 5V pin**: the battery rail feeds the DevKit's 5V/VBUS pin through the onboard AMS1117, producing 3.3 V.
3. **BAT+ to divider**: the 100 kΩ/100 kΩ divider taps BAT+ at the junction to GPIO 36.
4. **STDBY to GPIO 39**: optional; when LOW, the firmware shows the "C" charging indicator in the battery icon.
5. **GND**: common ground everywhere.

## The battery current path

18650 + → BAT+ → ESP32 5V pin → AMS1117 → 3.3 V rail.

The battery supplies the whole system through the charger's BAT+ pad. The DW01A protection sits between BAT- and ground, cutting the cell on over-discharge (about 2.4 V) or over-current.

## What to double-check

- Polarity: BAT+ and BAT- are labelled on the module. Reversing the cell in the holder is the classic accident.
- The module's USB input accepts 5 V only. Do not feed 12 V.
- The ESP32's 5V pin and the battery rail are the same node; never connect a second 5 V source to the ESP32 5V pin while the TP4056 is also connected.

## Charging behavior

- Charging: current up to 1 A (configurable with the PROG resistor), voltage capped at 4.2 V.
- Full: current drops to the cutoff, STDBY goes high, CHRG goes low.
- The beacon keeps running while charging; the battery icon shows "C".