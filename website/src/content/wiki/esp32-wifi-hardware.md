---
title: ESP32 WiFi Hardware
description: "The ESP32's WiFi radio: its hardware, its power cost, and why the beacon keeps it off except in the config portal."
---

# ESP32 WiFi Hardware

The ESP32 has WiFi built in: the same silicon that runs the firmware contains a complete 2.4 GHz radio. It is powerful and power-hungry, and the beacon's design decision is to keep it OFF.

## The hardware

The ESP32's WiFi is a 2.4 GHz 802.11b/g/n radio with its own RF front end and antenna (the PCB antenna on dev boards). It shares the antenna path with Bluetooth, so the two cannot run simultaneously in all modes.

## The power cost

| State | Current |
| --- | --- |
| WiFi off | 0 mA |
| WiFi connected, idle | 80 - 100 mA |
| WiFi transmitting | 120 - 160 mA |
| WiFi modem sleep | 20 - 40 mA |

A beacon with WiFi left on would roughly quadruple its average draw (see [Current Draw by Mode](current-draw-by-mode)). That is the entire reason the firmware gates WiFi behind the config portal.

## The RF interference cost

WiFi transmits on 2.4 GHz, a band of harmonics away from 433 MHz: not a direct conflict. The real cost is the antenna sharing: the ESP32's PCB antenna and the beacon's whip are centimeters apart, and the WiFi front end desensitizes the SX1262 receiver during WiFi activity. Beaconing and WiFi do not mix.

## The legitimate use

The config portal (see [WiFi Config Portal](wifi-config-portal)) turns WiFi on, serves the settings page, and turns it off again. That is the only sanctioned window, and the firmware enforces the timeout.

## Related pages

- [WiFi and Security](wifi-and-security) for the security model
- [WiFi Config Portal](wifi-config-portal) for the portal
- [Current Draw by Mode](current-draw-by-mode) for the numbers