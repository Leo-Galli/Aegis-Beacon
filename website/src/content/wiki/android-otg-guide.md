---
title: Android OTG Guide
description: "Plug the beacon into an Android phone with an OTG adapter and use serial terminals or the bridge in Termux."
---

# Android OTG Guide

Android phones can drive the beacon directly over USB. With an **OTG adapter** the phone acts as the USB host, so you can flash, run serial commands, and run the [serial bridge](termux-serial-bridge) on the phone itself, no laptop needed.

## What you need

- An Android phone with USB-C (or Micro-USB) OTG support (nearly all modern phones).
- An **OTG adapter**: USB-C to USB-A female, or Micro-USB to USB-A female. Some phones ship with one.
- A normal data USB cable (USB-A to Micro-USB) between the adapter and the beacon.
- A serial app, or Termux for the bridge.

## Connect

1. Plug the OTG adapter into the phone.
2. Plug the data cable into the adapter and the beacon.
3. The phone usually shows a notification ("USB device connected"). Grant permission when asked.
4. Check the port name: `/dev/ttyUSB0` or `/dev/ttyACM0`.

## Check the port

```bash
ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null
```

The new entry is the beacon.

## What works on the phone

| Task | Tool |
| --- | --- |
| Serial monitor | Serial USB Terminal, Serial USB Console (Play Store) |
| Bridge + position reporting | Termux (see [Termux Serial Bridge](termux-serial-bridge)) |
| Flashing | Hard on stock Android; easiest with a laptop |

## Power notes

The phone powers the beacon over OTG (5 V). If the beacon draws more than the phone provides, the connection can drop under load. Keep the beacon on its own battery to be safe, and disable aggressive battery saver on the serial app.

## Related

- [Termux Serial Bridge](termux-serial-bridge)
- [USB Connection Guide](usb-connection-guide)
- [Serial Port Detection](serial-port-detection)