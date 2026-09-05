---
title: Urban RF Environment
description: "What the 433 MHz band looks like in a city: density of devices, interference, and how to test the beacon where everyone else also transmits."
---

# Urban RF Environment

A city is the opposite of a mountain: hundreds of 433 MHz devices per building, reflections everywhere, and a noise floor raised by electronics. Testing there teaches you nothing about the field, unless you know what you are seeing.

## Who else is on the band

| Device | Typical channels |
| --- | --- |
| Car remote keys | 433.92 MHz |
| Wireless thermometers | 433.05 - 434.79 MHz |
| Smart plugs and switches | 433.92 MHz |
| Garage openers | 433 - 434 MHz |
| Baby monitors, motion sensors | 433 MHz |

The ISM band is a shared parking lot. The beacon is one more car.

## City effects

- **Dense reflections**: multipath makes RSSI swing wildly as you walk; a "dead" spot at one step can be full signal two steps away.
- **High noise floor**: the receiver's sensitivity is effectively reduced by a raised noise level, so ranges shrink.
- **Collisions**: another device transmitting on the same channel at the same moment garbles your burst; the beacon has no collision avoidance, by design, because it transmits so briefly.

## Testing in the city

- Expect short ranges and treat them as a floor, not a ceiling.
- Use SEARCH mode to find a clear channel before your test.
- Prefer open squares and parks over canyon streets for meaningful numbers.
- Never judge antenna quality on a busy urban test; the noise masks differences.

## The deliberate choice

The beacon's 433 MHz choice trades city interference for universal receiver compatibility (see [Why 433 MHz](frequency-compatibility)). For a rescue device, a channel that any scanner or handheld can hear matters more than a quiet one.

## Related pages

- [Interference Sources](interference-sources) for the catalogue
- [RF Interference and Noise](rf-interference-and-noise) for the noise floor
- [Frequency Planning Examples](frequency-planning-examples) for choosing channels