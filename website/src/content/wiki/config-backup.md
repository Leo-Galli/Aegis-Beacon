---
title: Config Backup
description: "Backing up and restoring the beacon's configuration: the serial dump, the file format, and the restore procedure."
---

# Config Backup

Your configuration is the product of an evening's careful work: callsign, channels, power, GPS settings. A factory reset or a firmware migration wipes it in a second. Backups are the answer.

## The backup

The serial debug build provides the dump:

```
config dump
```

which prints every setting as key-value lines. Save the output to a file. That file IS the backup: human-readable, diffable, restorable.

## The format

```
frequency=433100000
power_dbm=17
sleep_interval_s=10
repeat_count=1
wpm=12
gps_enabled=1
identity=IK2XYZ
...
```

Each line is `key=value`, matching the keys in [Firmware NVS Keys](firmware-nvs-keys).

## The restore

1. Factory reset (see [Factory Reset and Recovery](factory-reset-and-recovery)) for a clean base.
2. Connect serial, enter the debug console.
3. Feed the file: `config set <key> <value>` per line, or paste the whole file where the console accepts batch input.
4. `config dump` again and diff against the backup to confirm.

## The habit

- Back up after every configuration session.
- Keep the backup with the emergency card (see [Emergency Kit](emergency-kit)).
- Version the backup file in the repo if the config is a "known good" mission profile.

## Related pages

- [Firmware NVS Keys](firmware-nvs-keys) for the storage
- [Serial Monitor Guide](serial-monitor-guide) for the console
- [Factory Reset and Recovery](factory-reset-and-recovery) for the reset