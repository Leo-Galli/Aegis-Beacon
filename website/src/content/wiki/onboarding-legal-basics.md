---
title: Legal Basics for Beginners
description: A plain-language overview of what you may legally do with a 433 MHz transmitter, and where to check your local rules.
---

# Legal Basics for Beginners

Radio transmitters are regulated in every country. This page gives the honest overview; the Frequencies & Regulation section has the details.

## The core question

Aegis-Beacon transmits on 410-525 MHz, most commonly at 433.500 MHz. Whether that is legal without a license depends on:

1. Your country's ISM (industrial, scientific, medical) band allocations,
2. The power limit for unlicensed use,
3. Whether you hold an amateur radio license.

## The 433 MHz ISM band

In Europe and much of the world, 433.05-434.79 MHz is an ISM band with a typical unlicensed limit of **10 mW ERP** for general devices. The beacon transmits at 17-22 dBm (50-160 mW), which is **above that limit**. Transmitting at these levels generally requires a ham license in most jurisdictions, or a recognized emergency-use exception.

## PMR446

PMR446 (446 MHz) is license-free in Europe at 500 mW ERP with a fixed antenna. The beacon firmware supports PMR446-compliant frequencies and power settings, which gives a legal path in the EU when configured within those limits.

## What the wiki recommends

- Check the local frequency table in **Frequency Compatibility** before your first real transmission.
- For unlicensed operation, configure the beacon within your local ISM/PMR limits (power and duty cycle).
- For full-power operation, hold an amateur license and operate on licensed bands.
- Never transmit on frequencies used by emergency services or air traffic.

## A note on emergency use

Some jurisdictions carve out exceptions for genuine life-threatening emergencies. This varies by country and is not a blanket permission; see the legal pages for the honest summary.