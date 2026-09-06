---
title: USB Power vs Data
description: "What the beacon does over a power-only cable, a data cable, and an unpowered hub, and the pitfalls of each."
---

# USB Power vs Data

The beacon can be powered over USB without ever talking to a computer, and it can talk to a computer without being powered by that computer's port. Understanding the two channels avoids the most common "my port disappeared" confusion.

## Power and data are separate

A USB cable has two channels:

- **Power (VBUS)**: always present, 5 V.
- **Data (D+/D-)**: present only in data cables and data-capable ports.

The beacon needs only power to boot and run. It needs both to be seen as a serial port.

| Cable / port | Beacon boots? | Port appears? |
| --- | --- | --- |
| Charge-only cable | Yes | No |
| Data cable into a laptop | Yes | Yes |
| Data cable into a phone charger | Yes | No (charger has no data) |
| Data cable into a hub | Depends | Depends (see below) |

## The three realistic setups

**1. Battery installed, cable for data.** The 18650 powers the board; USB only carries data. This is the cleanest setup for long bridge sessions.

**2. No battery, USB for power + data.** The board runs from 5 V VBUS through the onboard regulator. Everything works, but the beacon draws from the computer; unplugging the cable kills it.

**3. No battery, USB for data only (unpowered hub).** A passive hub without its own supply may not provide enough current, and the ESP32 can brown-out mid-boot. Use a powered hub or keep a battery in.

## Never power from two sources at once

With a battery installed AND a strong USB port, both feed the 5 V rail. The TP4056 charger in the standard build is designed for this (it prefers the higher source), but cheap clones without proper charging circuitry can misbehave. If your board has no charger, remove the battery before long USB sessions, or expect the battery to be topped up by the USB port when one is present.

## Symptoms and causes

| Symptom | Likely cause |
| --- | --- |
| LED on, no COM port | Charge-only cable |
| Port appears then vanishes during upload | Bad cable / flaky connector; try another port and cable |
| Boot loop when USB is the only power | Insufficient supply; use a powered hub or add a battery |
| Bridge connects then drops when unplugged | You were powering from USB only; keep the battery in |

## Related

- [USB Cable Types](usb-cable-types)
- [USB Connection Guide](usb-connection-guide)
- [Battery Selection and Management](battery-selection)