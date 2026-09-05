---
title: PMR446 Deep Dive
description: The license-free European radio service, its 16 channels, the 500 mW ERP limit, and how to configure the beacon for it.
---

# PMR446 Deep Dive

PMR446 is the European license-free radio service at 446 MHz. It is the most legally straightforward band for a European beacon user.

## The basics

- **Frequency**: 446.0-446.2 MHz (16 channels, 12.5 kHz spacing).
- **Power**: max 500 mW ERP.
- **License**: none required in most European countries (CEPT countries).
- **Antenna**: the rules historically required an integral (non-removable) antenna for PMR446 equipment. A removable SMA antenna is not compliant with the original spec, which is a real consideration for a beacon with an external antenna.

## The 16 channels

| Ch | MHz | Ch | MHz |
|----|-----|----|-----|
| 1 | 446.00625 | 9 | 446.08125 |
| 2 | 446.01875 | 10 | 446.09375 |
| 3 | 446.03125 | 11 | 446.10625 |
| 4 | 446.04375 | 12 | 446.11875 |
| 5 | 446.05625 | 13 | 446.13125 |
| 6 | 446.06875 | 14 | 446.14375 |
| 7 | 446.01875 | 15 | 446.15625 |
| 8 | 446.04375 | 16 | 446.16875 |

## Configuring the beacon for PMR446

1. Set the frequency to a PMR446 channel (e.g. 446.00625 MHz).
2. Set TX power to 500 mW ERP or less. The beacon's +17 dBm (50 mW) is comfortably under the limit.
3. Keep the antenna compliant with local rules; a quarter-wave whip on 446 MHz is about 16.8 cm.

## Why PMR446 matters for the beacon

- It is the legal path for unlicensed European use.
- Any PMR446 walkie-talkie can hear the beacon's CW if it has an SSB/CW-capable mode, or via an SDR.
- The 500 mW ERP ceiling still gives useful range: a few kilometers line-of-sight.

## The honest caveats

- A beacon transmitting Morse on a PMR446 channel is a legitimate use of the service for distress signaling, but check the specific national rules about non-voice emissions.
- The integral-antenna rule conflicts with the E22's SMA; some operators interpret emergency use as overriding this. Know your local position.

## Also see

The frequency planning examples page has a full EU configuration walkthrough with a PMR446-compliant setup.