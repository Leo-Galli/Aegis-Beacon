---
title: ERP vs EIRP
description: The difference between ERP and EIRP, how antenna gain changes the legal number, and which one your regulator means.
---

# ERP vs EIRP

Regulators quote power limits in either ERP or EIRP. Mixing them up can make you think you are legal when you are not.

## The definitions

- **ERP** (effective radiated power): the power a half-wave dipole would need to produce the same field. It ignores the gain of a simple antenna beyond dipole equivalence.
- **EIRP** (effective isotropic radiated power): the power an isotropic (perfectly spherical) radiator would need. It includes the antenna gain over isotropic.

The difference is 2.15 dB: EIRP = ERP + 2.15 dB (for a dipole compared to isotropic).

## Which limits use which

- **EU 433 MHz ISM**: often quoted as 10 mW ERP.
- **PMR446**: 500 mW ERP.
- **Amateur**: usually no ERP limit; power is quoted at the transmitter output.
- **FCC**: often uses EIRP.

## The antenna gain trap

If the limit is 10 mW ERP and your antenna has 3 dBi of gain, the transmitter output must be reduced so that ERP stays under the limit. A high-gain antenna does not make you more legal; it reduces the allowed transmitter power.

For the beacon:

- The default whip antenna has roughly 0 dBi gain (unity).
- A ground-plane setup adds ~3 dBi, which counts against ERP/EIRP limits.

## Working the numbers

At +17 dBm (50 mW) with a unity antenna:

- ERP = 50 mW × (0.75 for the mismatch losses) ≈ 37 mW ≈ +15.7 dBm ERP - still above the 10 mW ISM limit.
- To meet 10 mW ERP you would need to transmit at about +7 dBm with losses.

## The practical takeaway

If your regulator says "10 mW ERP", the beacon's +17 dBm default is not compliant without a license. Use the dashboard's power slider to test below the limit, or operate under a license. The legal pages and the regional frequency table give the numbers per country.