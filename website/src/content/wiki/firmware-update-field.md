---
title: Firmware Update in the Field
description: "Updating firmware away from a computer: the options, the risks, and why the beacon is designed to make updates rare."
---

# Firmware Update in the Field

The beacon is designed to not need updates on a mission: its configuration is field-editable, and its firmware is version-stable. But the option exists, and this page is the honest assessment.

## The options

| Method | Needs | Risk |
| --- | --- | --- |
| USB serial | Laptop + cable | Low, standard |
| Pre-flashed spare | A second programmed board | None |
| OTA | WiFi portal extension (not in the base firmware) | Medium |

The base firmware does not include over-the-air updates: they add flash size, security surface, and a second failure mode to a device whose job is reliability. A pre-flashed spare board is the field answer.

## The field rules

1. Never update firmware mid-mission. A failed flash is a dead beacon at the worst moment.
2. Update before the trip, bench-test, then treat the result as the mission firmware.
3. Keep the previous version's binary: rollback is a flash away (see [Release Process](release-process)).

## The config concern

Firmware updates can change the config format (see [Changelog](changelog) for the v4 to v5 migration). Before updating: back up the config over serial (`config dump`), update, factory-reset if the format changed, then restore.

## The spare board habit

The most field-honest practice: program two boards identically, test both, carry one as the spare. A firmware update then never happens in the field; it happens on the bench, and the spare covers the risk.

## Related pages

- [Release Process](release-process) for the update cycle
- [Config Backup](config-backup) for the settings
- [Factory Reset and Recovery](factory-reset-and-recovery) for the reset