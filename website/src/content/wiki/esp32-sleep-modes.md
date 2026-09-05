---
title: "ESP32 Sleep Modes"
description: "How the beacon uses the ESP32 sleep states to stretch battery life, and what wakes it up"
---

# ESP32 Sleep Modes

## Overview

The ESP32 supports several sleep modes with different trade-offs between power consumption and wake-up flexibility. The beacon uses deep sleep between beacon transmissions to stretch battery life, and it wakes on a timer to transmit the next beacon cycle.

Understanding the sleep modes helps explain why the beacon can run for a long time on a single cell, and why some configuration changes require a reboot.

## Sleep Modes in Brief

| Mode | What is kept | Typical use |
|---|---|---|
| Active | Everything on | Beaconing, scanning, CONFIG |
| Light sleep | CPUs and peripherals can be paused; RAM retained | Short pauses within a mode |
| Deep sleep | Most of the chip off; RTC memory and RTC peripherals retained | Between beacon cycles |

For this beacon, deep sleep is the main battery-saver. Between TX cycles, the chip goes deep and wakes on a timer.

## What Survives Deep Sleep

Deep sleep retains:

- RTC RAM, which the firmware can use to carry state across sleep cycles.
- RTC peripherals, including the RTC timer used to wake the device.

Regular RAM and most peripherals are lost or need re-initialization on wake.

## What Does Not Survive

Ordinary RAM contents are lost unless they are placed in RTC RAM. Peripherals that are not RTC-based need to be re-initialized after wake.

That is why the beacon re-initializes the radio, the OLED, the GPS, and the audio system after each wake, and why the firmware's boot path sets up the whole system each time.

## What Wakes the Device

The beacon is woken from deep sleep by the RTC timer. The timer is set to the sleep interval configured by the user. When it expires, the device wakes, transmits, and goes back to sleep for the next interval.

Other wake sources exist on the ESP32, such as a button or a touch pin, but the beacon's primary sleep-to-wake path is the timer.

## Sleep Interval

The sleep interval is the time between TX cycles. The user sets it in CONFIG, from a few seconds up to several minutes.

Short sleep interval:
- More frequent beacons.
- Shorter battery life.
- Better for urgent situations where you want the beacon heard quickly and repeatedly.

Long sleep interval:
- Less frequent beacons.
- Longer battery life.
- Better for a beacon left in place and checked periodically.

The right interval depends on the situation. In an emergency, a short interval with high power and repeats is usually better. For a long-term position beacon, a longer interval may be acceptable.

## TX Cycle Pattern

A beacon cycle is roughly:

1. Wake from deep sleep on the RTC timer.
2. Re-initialize peripherals.
3. Get GPS fix state if GPS is enabled.
4. Build the payload.
5. Transmit the payload with the configured power and repeat count.
6. Go back to deep sleep for the sleep interval.

The dominant power use in each cycle is the TX burst. Between bursts, the device is mostly asleep.

## CONFIG Mode and Sleep

In CONFIG mode, the device is not in beacon sleep cycles. It is awake serving the configuration portal. That is why CONFIG mode uses more power than beacon mode.

When CONFIG is open, the device stays awake as long as a client is connected or the portal is active. After the auto-revert timeout with no client, the device leaves CONFIG and may return to whatever mode it was in before, including beacon mode with its sleep cycles.

## Light Sleep vs Deep Sleep

Light sleep and deep sleep are not interchangeable for this application.

Light sleep keeps more state alive and wakes faster, but it uses more power than deep sleep. Deep sleep uses the least power but loses more state, so the firmware must re-initialize more on wake.

For a beacon that transmits for a short burst and then waits for a long interval, deep sleep is the best fit.

## RTC RAM Use

The firmware can use RTC RAM to carry small pieces of state across deep sleep without needing NVS. This is useful for things like the last known GPS fix, the last mode, or emergency flags that need to survive sleep cycles but do not need full NVS persistence.

RTC RAM is not the same as NVS. RTC RAM survives deep sleep and power cycles only as long as the RTC domain is powered; NVS survives reboots and reflashes and is the place for user configuration.

## Related Pages

- [Power Management](/wiki/power-management) — the overall battery picture.
- [NVS Configuration Store](/wiki/nvs-configuration-store) — what persists across reboots.
- [RTC RAM State](/wiki/rtc-ram-state) — the RTC domain and emergency flag.
- [CONFIG Mode](/wiki/mode-config) — how CONFIG differs from beacon sleep cycles.
