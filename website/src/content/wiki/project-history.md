---
title: Project History
description: "How Aegis-Beacon came to be: the design journey from prototype to the current firmware, and the decisions that shaped it."
---

# Project History

Every design decision in the beacon has a history. This page is the story of how a personal project became a documented, testable rescue device.

## The beginning

Aegis-Beacon was created by Leonardo Galli (GitHub: [Leo-Galli/Aegis-Beacon](https://github.com/Leo-Galli/Aegis-Beacon)) as a personal project and is released under the MIT License.

The project started with a simple observation: commercial personal locator beacons cost hundreds of euros and rely on proprietary satellite networks. The question was whether a capable rescue beacon could be built from off-the-shelf hobby parts for under thirty euros, on the license-free 433 MHz band, using nothing more exotic than Morse code.

## The first prototype

The earliest builds were breadboard experiments: an ESP32, a LoRa module, a button and a wire antenna. They transmitted, which proved the concept, and immediately exposed the real problems: battery life measured in hours, no way to configure in the field, and a payload format that only the developer understood.

## The decisions that stuck

| Decision | Why |
| --- | --- |
| 433 MHz ISM band | Universal receivers, license-free within limits (see [Why 433 MHz](why-433mhz)) |
| Morse code payload | Any receiver and human ear can decode it, no proprietary protocol |
| OLED + buttons | Field configuration without a computer |
| Deep sleep architecture | The difference between hours and days of runtime |
| GPS as optional | Coordinates matter, but the beacon must work without them |

## The version line

The firmware went through the versions documented in the [Changelog](changelog): the config format was reworked (v4 to v5), the dashboard became part of the firmware itself, and the scan engine was added. Each version fixed a real field problem.

## The website and wiki

Documentation came last, deliberately: the project's lessons are worthless if they stay in one developer's head. The website, the demo, the builder and this wiki exist to make the beacon reproducible by anyone.

## Related pages

- [Roadmap](roadmap) for where it goes next
- [Changelog](changelog) for the version history
- [Attribution and License](attribution-and-license) for the legal frame