---
title: Static Safety and ESD
description: How to handle the ESP32 and modules without damaging them, in practical terms.
---

# Static Safety and ESD

Electrostatic discharge can silently damage the ESP32 and the radio. The damage is often invisible and appears weeks later as random resets or a dead GPIO.

## How bad is it really?

Modern ESP32 chips are reasonably robust, and many builds survive without any ESD precautions. But the radio module and the GPS are more sensitive, and a damaged chip fails at the worst possible moment: in the field.

## Practical precautions

- Touch a grounded metal object (a PC case, a radiator pipe) before picking up boards.
- Avoid handling modules on synthetic carpets or in dry winter air.
- Store boards in antistatic bags when not on the bench.
- Handle boards by the edges; do not touch the chip pins.
- If you have a wrist strap and mat, use them. They are cheap insurance.

## During soldering

- A mains-grounded soldering iron discharges through the board safely. A cheap ungrounded iron can dump 100+ V of leakage into your circuit; if you get random resets while touching the board, this is the cause.
- Let the board sit for a minute after handling before plugging it into USB if the air is very dry.

## Testing for damage

If a board behaves oddly after assembly (random reboots, one GPIO dead, radio fails intermittently), and wiring checks out, suspect ESD damage. The cheap fix is a new $3 ESP32; the cheap prevention is the precautions above.

## In the field

The beacon lives in a plastic case with an 18650, so static risk is low. Just do not swap batteries by rubbing the board on a fleece jacket.