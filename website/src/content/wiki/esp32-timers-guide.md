---
title: ESP32 Timers Guide
description: "The timers the firmware relies on: millis for scheduling, the RTC timer for sleep, and the LEDC for tones."
---

# ESP32 Timers Guide

Timing is the firmware's skeleton: when to transmit, how long a tone lasts, when to wake. This page maps the ESP32's timing hardware to its uses in the beacon.

## The timing sources

| Source | Used for | Resolution |
| --- | --- | --- |
| `millis()` | Scheduler gaps, debounce | 1 ms |
| RTC timer | Deep sleep wake (see [Firmware Wake Sources](firmware-wake-sources)) | ~1 s |
| LEDC (PWM) | Tone generation (see [Firmware Tone Generation](firmware-tone-generation)) | Hardware, CPU-free |
| GPS time | Absolute time (see [GPS Timing](gps-timing)) | 1 s |

## The millis discipline

The firmware never calls `delay()` in the timing-critical paths (see [Firmware TX Scheduler](firmware-tx-scheduler)): every gap is measured with `millis()` deltas, so the radio keeps its schedule while the display and GPS do their work.

## The millis wraparound

`millis()` wraps after about 49 days. The firmware compares deltas (`now - last > interval`), which is wraparound-safe: the subtraction works correctly across the wrap. Any code that compares raw `millis()` values with `>` instead of deltas will fail after 49 days of continuous operation.

## The LEDC hardware

The ESP32's LEDC peripheral generates the Morse tones without CPU involvement: configure frequency and duty, write the duration in the loop, and the hardware does the rest. This is what keeps the tone timing accurate while the radio works (see [Firmware Tone Generation](firmware-tone-generation)).

## Related pages

- [Firmware TX Scheduler](firmware-tx-scheduler) for the schedule
- [ESP32 RTC Notes](esp32-rtc-notes) for the RTC
- [Firmware Main Loop](firmware-main-loop) for the loop