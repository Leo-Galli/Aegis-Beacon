<div align="center">

```
 █████╗ ███████╗ ██████╗ ██╗███████╗    ██████╗ ███████╗ █████╗  ██████╗ ██████╗ ███╗   ██╗
██╔══██╗██╔════╝██╔════╝ ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║
███████║█████╗  ██║  ███╗██║███████╗    ██████╔╝█████╗  ███████║██║     ██║   ██║██╔██╗ ██║
██╔══██║██╔══╝  ██║   ██║██║╚════██║    ██╔══██╗██╔══╝  ██╔══██║██║     ██║   ██║██║╚██╗██║
██║  ██║███████╗╚██████╔╝██║███████║    ██████╔╝███████╗██║  ██║╚██████╗╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚═╝  ╚═══╝
```

# Aegis-Beacon v5.5

![Banner](https://github.com/Leo-Galli/Aegis-Beacon/blob/main/website/public/banner.png?raw=true)

**Open-Source Emergency Radio-Location System | ESP32 + SX1262 + GPS**

[![License](https://img.shields.io/github/license/Leo-Galli/Aegis-Beacon?style=flat-square&label=License)](LICENSE)
[![Release](https://img.shields.io/github/v/release/Leo-Galli/Aegis-Beacon?style=flat-square&label=Release)](https://github.com/Leo-Galli/Aegis-Beacon/releases)
[![Website CI](https://github.com/Leo-Galli/Aegis-Beacon/actions/workflows/website-ci.yml/badge.svg)](https://github.com/Leo-Galli/Aegis-Beacon/actions/workflows/website-ci.yml)
[![Firmware CI](https://github.com/Leo-Galli/Aegis-Beacon/actions/workflows/firmware-ci.yml/badge.svg)](https://github.com/Leo-Galli/Aegis-Beacon/actions/workflows/firmware-ci.yml)

</div>

---

## About

**Aegis-Beacon** is an open-source emergency rescue beacon for avalanche survival and backcountry SAR operations. It fits in a jacket pocket, costs roughly $23-28 to build, and transmits Morse SOS with your GPS position over 433 MHz CW for about 65 hours on a single 18650 cell (up to ~175 hours at a 60 s beacon interval).

It is built around the **ESP32 DevKit V1**, an **SX1262 radio** (Ebyte E22-400M30S, up to +30 dBm with PA), a **2.42" SSD1309 OLED**, a **NEO-6M GPS** module, a battery voltage monitor and a 4-button control panel. A WiFi captive-portal dashboard handles field configuration; v5.5 adds a machine-readable serial protocol and a cross-platform bridge that forwards GPS fixes to the website's Report Position page.

| Mode        | What it does                                                        |
|-------------|---------------------------------------------------------------------|
| **BEACON**  | Transmits Morse SOS + name + GPS on 1-10 configured frequencies    |
| **SEARCH**  | Scans all frequencies, measures RSSI, alerts with a rising-pitch tone |
| **CONFIG**  | WiFi access point with a full captive-portal configuration dashboard |
| **EMERGENCY** | Max power, continuous transmission with name + GPS, no deep sleep  |

## Documentation

The complete technical documentation lives in the repository root and is mirrored by an in-depth wiki on the live site.

| Document | Content |
|:----------|:--------|
| [**DATASHEET.md**](DATASHEET.md) | The single authoritative reference: electrical specifications, GPIO map, NVS schema, HTTP API, technology stack, build/deploy commands and the global SAR frequency database |
| [**CONTRIBUTING.md**](CONTRIBUTING.md) | Contribution guide, code conventions and the automated PR workflows |
| [**Wiki**](https://aegis-beacon.vercel.app/wiki) | 400+ articles: onboarding, build & assembly, radio/RF, firmware, GPS, Morse, field operations and more |

The live site (`https://aegis-beacon.vercel.app`) also hosts an interactive firmware simulation at `/demo`, a BOM cost builder at `/builder`, an amateur radio repeater map at `/repeaters`, a live config dashboard extracted from the firmware at `/config-dashboard`, a Report Position tracker at `/report-position` and CI-measured benchmarks at `/benchmarks`.

## Quick Start

```bash
# Website (docs, demo, wiki)
cd website
npm install
npm run dev          # http://localhost:4321

# Firmware (PlatformIO)
pio run --target upload
pio device monitor --baud 115200
```

## Repository Layout

```text
Aegis-Beacon/
├── AegisBeacon.ino   # ESP32 firmware (single-file Arduino source)
├── DATASHEET.md      # Complete technical reference (merged: specs + stack + frequencies)
├── CONTRIBUTING.md   # Contribution guide and PR workflow documentation
├── bridge/           # Cross-platform serial bridge (Python)
├── website/          # Astro site: wiki, demo, builder, repeaters, benchmarks
└── .github/          # CI workflows and scripts
```

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first: it documents the conventional commit format, the automated checks that run on every pull request, and the benchmark pipeline.

## License

MIT — see [LICENSE](LICENSE).