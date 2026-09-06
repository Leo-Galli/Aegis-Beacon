---
title: First Transmission
description: The safe, step-by-step way to make your very first Morse transmission and confirm it on a receiver.
---

# First Transmission

Your first transmission should be boring: a known signal, on a known frequency, into a known antenna, heard on a known receiver.

## Before you transmit

1. Flash the latest v5.5 firmware.
2. Confirm the boot screen shows the expected version and mode.
3. Attach the antenna (or a dummy load).
4. Confirm your frequency is legal where you are (see Frequency Compatibility).
5. Set power to +10 dBm or lower for the first test, if your region allows.

## The test setup

The cleanest first test uses two devices:

- The beacon in BEACON mode on 433.500 MHz.
- A second receiver: another beacon in SEARCH mode, a handheld scanner, or an RTL-SDR.

Place them 2-3 meters apart indoors. Indoors, the signal will be strong and unmistakable.

## What you should hear

- A rising-falling carrier burst pattern: that is the Morse.
- Decode it: it should be `SOS` or `SOS DE NAME` depending on your config.
- On an SDR, you see a strong line on the waterfall at the beacon frequency when it keys.

## What if you hear nothing?

1. Check the antenna is connected to the SMA.
2. Check the receiver is tuned to the exact frequency (433.500, not 433.5 off by a channel).
3. Verify TX power in the dashboard is not set to the minimum.
4. Confirm the beacon is actually transmitting: the OLED shows the TX progress bar and the red LED blinks.
5. Bring the receiver closer; then work outward.

## After a successful first TX

- Log the date, frequency, power, antenna, and range in a bench log.
- Do the two-beacon bench test at increasing distances.
- Only then start outdoor range testing.

## The golden rule

Never transmit just to see if it works. Transmit into a planned test with a receiver ready. Every unmonitored transmission is wasted airtime on a band other people share.