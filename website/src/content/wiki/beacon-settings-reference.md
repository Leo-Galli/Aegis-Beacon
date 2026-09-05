---
title: Beacon Settings Reference
description: "The complete settings catalogue: every configuration value, its range, its default, and where it is documented."
---

# Beacon Settings Reference

The complete catalogue of the beacon's configuration. The [Configuration Reference](configuration-reference) page has the operational detail; this page is the lookup table.

## The radio settings

| Setting | Range | Default | See |
| --- | --- | --- | --- |
| Frequency | Module range | 433.920 MHz | [Frequency Table Reference](frequency-table-reference) |
| Power | +10 to +22 dBm | +10 | [E22 Power Levels](e22-power-levels) |
| Modulation | FSK / LoRa | FSK | [LoRa vs FSK](lora-vs-fsk) |

## The timing settings

| Setting | Range | Default | See |
| --- | --- | --- | --- |
| Sleep interval | 1 - 3600 s | 10 s | [Firmware TX Scheduler](firmware-tx-scheduler) |
| Repeat count | 1 - 10 | 1 | [Firmware TX Scheduler](firmware-tx-scheduler) |
| Tone speed | 5 - 30 WPM | 12 | [Morse Timing Reference](morse-timing-reference) |

## The payload settings

| Setting | Range | Default | See |
| --- | --- | --- | --- |
| Message base | A-Z, 0-9, space | SOS | [Config Payload Format](config-payload-format) |
| Identity | A-Z, 0-9 | None | [Config Payload Format](config-payload-format) |
| Include identity | On / off | Off | [Payload Examples](payload-examples) |

## The GPS settings

| Setting | Range | Default | See |
| --- | --- | --- | --- |
| GPS enabled | On / off | On | [GPS Power Saving](gps-power-saving) |
| Coordinates | Auto / manual | Auto | [GPS Failure Contingency](gps-failure-contingency) |
| Fix age limit | 1 - 60 min | 2 | [GPS Fix Quality](gps-fix-quality) |

## The system settings

| Setting | Range | Default | See |
| --- | --- | --- | --- |
| Battery thresholds | Calibrated | 3.4 V warn | [Battery Monitor Calibration](battery-monitor-calibration) |
| WiFi passphrase | 8+ chars | Factory | [WiFi and Security](wifi-and-security) |
| Factory reset | - | - | [Factory Reset and Recovery](factory-reset-and-recovery) |

## Related pages

- [Configuration Reference](configuration-reference) for the operational detail
- [Configuration Quick Guide](configuration-quick-guide) for the setup order
- [Quick Reference Sheet](quick-reference-sheet) for the one-pager