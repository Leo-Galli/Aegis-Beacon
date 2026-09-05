---
title: The 70 cm Amateur Band
description: The amateur allocation at 430-440 MHz where the beacon can legally run at full power, with a license.
---

# The 70 cm Amateur Band

For full-power legal operation, the 70 cm amateur band (430-440 MHz in Europe) is where the beacon belongs.

## The allocation

- **Europe (CEPT)**: 430-440 MHz amateur allocation.
- **US (FCC)**: 420-450 MHz, depending on region.
- **Primary**: amateur service; some segments shared with radiolocation and others.

The beacon's SX1262 covers 410-525 MHz, so the whole amateur segment is within reach.

## What a license lets you do

With a valid amateur license (Technician-class or above in the US, a national license in Europe, often harmonized by CEPT Recommendation T/R 61-01):

- Transmit at higher power: the beacon's +17/+22 dBm are trivial for amateurs (the US limit is 1500 W PEP; Europe commonly 75 W ERP).
- Identify: amateurs must transmit their callsign regularly. The beacon's Morse payload can include a callsign; consider configuring the name field with your callsign for identification.
- Operate CW (Morse) freely: CW is a standard amateur mode.

## Configuring for 70 cm

1. Choose a frequency in the local band plan (e.g. 433.500 MHz is common in Europe; check your region's repeater and simplex allocations).
2. Set power to what your license allows (the beacon maxes at +22 dBm before the E22 PA).
3. Enable callsign identification: set FIRST NAME / LAST NAME fields to send `DE [CALLSIGN]` in the payload.

## Band etiquette

- Avoid repeater inputs/outputs listed in your local band plan.
- Avoid frequencies used for satellite work (e.g. 435-438 MHz uplinks in places).
- Keep transmissions short outside emergencies; a beacon that keys every 10 seconds all day is not polite on a shared band. Use the emergency frequencies or coordinate with local operators for long-term tests.

## The emergency exemption

Even without a license, many jurisdictions permit distress traffic. The beacon is explicitly designed for that scenario. The line between "testing" and "emergency" is a legal one you should be clear about before transmitting at amateur power levels.