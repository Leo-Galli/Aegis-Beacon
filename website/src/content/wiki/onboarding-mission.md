---
title: How the Beacon Saves Lives
description: The real-world scenario that motivates the whole project, and the design decisions that follow from it.
---

# How the Beacon Saves Lives

Every design decision in Aegis-Beacon traces back to one scenario. Understand the scenario and the whole project makes sense.

## The scenario

A skier is off-piste when an avalanche catches them. They are buried. Their phone has no signal and is useless. A search team with transceivers arrives, but the team's beacons find the standard avalanche transceiver signal.

Now imagine instead that they carry an Aegis-Beacon. On activation it transmits SOS with their name and GPS coordinates in Morse, on a band that cheap SDRs and handheld scanners can hear, for 65+ hours, from a device that costs less than $30.

## The design consequences

- **Morse, not a proprietary protocol**: any receiver can decode it. No decoder app required.
- **433 MHz, not WiFi or cellular**: works with zero infrastructure.
- **65+ hour runtime**: a rescue can take days; the beacon must outlast the search.
- **$23-28 cost**: teams can afford to deploy several; individuals can own one without insurance.
- **Open source**: anyone can verify the rescue logic, and teams can adapt frequencies to their region.

## Honest limits

- The beacon transmits a *position*; it does not call for help. Someone must be listening or searching.
- Morse at 13 WPM needs a receiver within range and someone (or software) to copy it.
- Range in mountains is far less than the 15 km line-of-sight figure.

## What it is not

It is not a satellite PLB, not a GSM tracker, and not a replacement for an avalanche transceiver. It is a low-cost, open, infrastructure-free beacon that fills the gap for teams and individuals who cannot afford dedicated rescue hardware.