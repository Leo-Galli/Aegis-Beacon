<div align="center">

# Aegis-Beacon

**Open-source emergency radio-location beacon for mountain rescue and SAR**

An ESP32 + SX1262 pocket beacon that transmits your name and GPS position in
Morse on the 433 MHz rescue band, for 65+ hours on a single 18650 cell.

![Banner](https://github.com/Leo-Galli/Aegis-Beacon/blob/main/website/public/banner.png?raw=true)

[![License](https://img.shields.io/github/license/Leo-Galli/Aegis-Beacon?style=flat-square&label=License)](LICENSE)
[![Release](https://img.shields.io/github/v/release/Leo-Galli/Aegis-Beacon?style=flat-square&label=Release)](https://github.com/Leo-Galli/Aegis-Beacon/releases)
[![Website CI](https://github.com/Leo-Galli/Aegis-Beacon/actions/workflows/website-ci.yml/badge.svg)](https://github.com/Leo-Galli/Aegis-Beacon/actions/workflows/website-ci.yml)
[![Firmware CI](https://github.com/Leo-Galli/Aegis-Beacon/actions/workflows/firmware-ci.yml/badge.svg)](https://github.com/Leo-Galli/Aegis-Beacon/actions/workflows/firmware-ci.yml)

</div>

## At a glance

| | | | |
|---|---|---|---|
| **Radio** | Ebyte E22-400M30S (SX1262), 433 MHz, +30 dBm | **Display** | 2.42" SSD1309 OLED (128x64) |
| **GPS** | NEO-6M, optional | **Control** | 4-button panel (MODE / SEL / UP / DN) |
| **Runtime** | ~65 h BEACON, up to ~130 h at 30 s intervals | **Range** | ~15 km line of sight |
| **Battery** | 18650 Li-ion, USB-C via TP4056 | **Cost** | ~$23-28 full BOM |
| **Firmware** | Arduino (PlatformIO), single-file sketch | **License** | MIT |

## What it is

Aegis-Beacon is an open-source, MIT-licensed rescue beacon that works when every
network is gone. No GSM, no WiFi, no subscription: it speaks direct
peer-to-peer radio. In BEACON mode it sends a Morse SOS with your callsign and
GPS coordinates across a sweep of 433 MHz rescue frequencies; in EMERGENCY mode
it transmits continuously at maximum power. A rescuer with a cheap SDR receiver
hears it up to 15 km line-of-sight away.

| Mode       | Purpose                                                               |
|------------|-----------------------------------------------------------------------|
| BEACON     | Morse SOS + name + GPS on configured frequencies, deep-sleep between TX |
| SEARCH     | Scans all frequencies, measures RSSI, alerts with a rising tone       |
| LISTEN     | Live Morse CW decoder: decodes incoming text on the OLED and over USB |
| CONFIG     | WiFi captive-portal dashboard for field configuration, no reflash     |
| EMERGENCY  | Max power, continuous transmission with name + GPS, no deep sleep      |

## Build one

Full BOM cost is **$23-28**, assembled from off-the-shelf parts: an
ESP32 DevKit V1, an Ebyte E22-400M30S (SX1262, +30 dBm), a 2.42" SSD1309 OLED,
an optional NEO-6M GPS, and a 18650 cell. No specialized tools beyond a
soldering iron. Plan the exact shopping list for your budget with the
interactive [BOM builder](https://aegis-beacon.vercel.app/builder).

## Documentation

The complete technical reference lives in the repository root, and the live
site mirrors it in a 400+ page wiki.

| Document | What it covers |
|:---------|:---------------|
| [DATASHEET.md](DATASHEET.md) | Single authoritative reference: electrical specs, GPIO map, NVS schema, HTTP API, technology stack, build/deploy commands, global SAR frequency database |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guide, code conventions, automated PR workflows |
| [Wiki](https://aegis-beacon.vercel.app/wiki) | 400+ articles: onboarding, build & assembly, radio/RF, firmware, GPS, Morse, field operations |

The site also hosts an interactive [firmware simulation](/demo), the
[config dashboard](https://aegis-beacon.vercel.app/config-dashboard) extracted
live from the firmware, a [repeater map](https://aegis-beacon.vercel.app/repeaters),
a [position tracker](https://aegis-beacon.vercel.app/report-position), and
[CI-measured benchmarks](https://aegis-beacon.vercel.app/benchmarks).

## Quick start

```bash
# Website (docs, demo, wiki)
cd website
npm install
npm run dev          # http://localhost:4321

# Firmware (PlatformIO)
pio run --target upload
pio device monitor --baud 115200
```

## Repository layout

```text
Aegis-Beacon/
├── AegisBeacon.ino   # ESP32 firmware, single-file Arduino source
├── DATASHEET.md      # Complete technical reference
├── CONTRIBUTING.md   # Contribution guide and PR workflow docs
├── bridge/           # Cross-platform USB serial bridge (Python)
├── website/          # Astro site: wiki, demo, builder, repeaters, benchmarks
└── .github/          # CI workflows and scripts
```

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first: it
documents the conventional commit format, the automated checks that run on
every pull request, and the benchmark pipeline. Releases are tagged `vX.Y.Z`
from `main`.

## License

MIT. See [LICENSE](LICENSE).
