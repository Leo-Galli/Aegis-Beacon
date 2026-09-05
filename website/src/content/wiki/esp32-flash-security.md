---
title: ESP32 Flash Security
description: "The flash security features available on the ESP32: secure boot, flash encryption, and what the beacon does and does not enable."
---

# ESP32 Flash Security

The ESP32 supports real flash security: signed boot, encrypted storage. The beacon's threat model decides what it actually needs.

## The threat model

Who would attack a beacon? The realistic threats:

| Threat | Realistic? |
| --- | --- |
| Someone reading the config (callsign, frequencies) | Low: it is in plain NVS |
| Someone tampering with the firmware | Low: a bespoke build on a hobby device |
| Someone cloning the firmware | Possible, but it is open source anyway |

The beacon's threat model is minimal: it is a field device with no secrets worth protecting.

## What the ESP32 offers

| Feature | What it does |
| --- | --- |
| Secure boot | Refuses to boot unsigned firmware |
| Flash encryption | Encrypts flash contents |
| eFuse burning | Permanent configuration, one-way |

Enabling any of these is irreversible in practice (the eFuses burn once) and complicates every future flash: they are the wrong tool for this project.

## The beacon's choice

The beacon ships without flash encryption and secure boot, deliberately:

1. The firmware is open source: cloning it protects nothing.
2. The config is field data, not a secret.
3. Encrypted flash would break the firmware-update flow and the factory reset (see [Factory Reset and Recovery](factory-reset-and-recovery)).

## The one security feature that matters

The WiFi portal's passphrase (see [WiFi and Security](wifi-and-security)) IS protected, because it is the only credential the device holds. Everything else in the threat model is informational.

## Related pages

- [WiFi and Security](wifi-and-security) for the portal security
- [ESP32 Flash Partitions](esp32-flash-partitions) for the layout
- [NVS Configuration Store](nvs-configuration-store) for the storage