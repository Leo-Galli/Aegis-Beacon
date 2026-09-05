---
title: ISM Bands Explained
description: What an ISM band is, the 433 MHz allocation, and why "unlicensed" still means "licensed-free within limits".
---

# ISM Bands Explained

The beacon transmits in the 433 MHz ISM band. ISM stands for industrial, scientific, and medical, and the name explains both the freedom and the limits.

## What ISM means

ISM bands are frequency ranges reserved for equipment that is not primarily a radio service: microwave ovens (2.4 GHz), medical diathermy, and industrial heating. Because the primary users are allowed to radiate, everything else shares the band under strict limits.

## The 433 MHz allocation

In Europe and much of the world, **433.05-434.79 MHz** is an ISM allocation. Devices may operate without an individual license, but typically at **10 mW ERP** maximum and often with duty-cycle restrictions.

## The catch for the beacon

The beacon transmits at 17-22 dBm (50-160 mW), well above the 10 mW ERP limit. Operating at those levels is generally not "unlicensed" in most jurisdictions:

- With a **ham license**, you may operate at higher power on the amateur allocations (70 cm band: 430-440 MHz in Europe).
- Some countries have **emergency-use exceptions** for genuine life-threatening situations.
- PMR446 (446 MHz) is license-free at 500 mW ERP in the EU, and the firmware supports those frequencies.

## The practical advice

1. For testing and bench work, keep power low and use a dummy load.
2. For legal unlicensed operation, use PMR446 frequencies within their limits.
3. For full-power emergency use, hold a ham license and check the local band plan.
4. Never transmit on frequencies used by safety services.

## Where to check your rules

The frequency compatibility page has a regional table. The authoritative source is always your national regulator: FCC (US), Ofcom (UK), ANFR (France), BNetzA (Germany), and their equivalents.

## The design choice

The beacon *can* transmit within legal limits; it also *can* go to +22 dBm. The firmware makes the power configurable precisely so you can match your local rules. The default of +17 dBm is a compromise between range and the power most operators can legally use with a license.