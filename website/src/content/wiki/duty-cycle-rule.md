---
title: Duty Cycle Rules
description: What transmit duty cycle is, the limits that apply in different regions, and how the beacon's schedule fits.
---

# Duty Cycle Rules

Many regulators limit not just power but duty cycle: the fraction of time a device may transmit. A beacon that keys every 10 seconds must understand this.

## What duty cycle is

Duty cycle = transmit time / total time, expressed as a percentage. A 1% duty cycle means the device transmits 1 second out of every 100.

## Typical limits

| Region / service | Duty cycle limit |
|------------------|------------------|
| EU 433 MHz ISM | Often 1-10% depending on the specific harmonized standard |
| PMR446 | Voice-oriented; beaconing is not a defined use |
| 70 cm amateur | No hard duty cycle, but courtesy applies |
| US (no ISM at 433) | N/A for unlicensed; amateur rules apply |

## The beacon's schedule

At default settings (payload ~3 s, sleep 10 s), the beacon transmits about 20-25% of the time. That exceeds common ISM duty-cycle limits, which is another reason full-power operation generally requires a license.

## Adjusting to comply

- Increase the sleep interval (e.g. 60 s): duty cycle drops to a few percent.
- Shorten the payload: fewer frequencies, no name/GPS, lower WPM.
- Use fewer repeats (repeat count 1 instead of 3).

## The dashboard lever

The sleep interval slider (1-300 s) directly controls duty cycle. At 60 s sleep with a 3 s payload, duty cycle is about 5%; at 300 s, about 1%.

## Emergency exception

In a genuine emergency, nobody will object to continuous transmission. The EMERGENCY mode ignores sleep entirely by design. The duty cycle discussion is about routine and testing use, not life-threatening situations.