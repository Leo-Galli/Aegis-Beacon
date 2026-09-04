# Technology Stack

**Project:** Aegis-Beacon v5.4 — Dual-Mode Avalanche Rescue System
**Repository:** https://github.com/Leo-Galli/Aegis-Beacon
**License:** MIT

This document is the complete technology reference for the project. It covers
the **embedded firmware** (Arduino / PlatformIO on ESP32), the **hardware
platform**, the **Astro website** and the **deployment toolchain**, with the
exact libraries, versions and build commands used.

---

## 1. System Overview

The project is split into two independent, clearly separated areas:

| Area            | Technology class   | Lives in                  | Runs on                      |
|:----------------|:-------------------|:--------------------------|:-----------------------------|
| Embedded beacon | C++ / Arduino      | repository root           | ESP32 DevKit V1 (on device)  |
| Website         | Astro (static)     | `website/` folder         | Vercel static hosting + localhost |

The beacon is a self-contained radio-location device; the website is the
technical manual, build wiki and interactive firmware simulation that documents
it. There is **no runtime coupling** between the two.

---

## 2. Embedded Firmware

### 2.1 Language and framework

| Technology        | Version        | Purpose                                   |
|:------------------|:---------------|:------------------------------------------|
| C++               | (Arduino toolchain) | Firmware implementation language      |
| Arduino framework | espressif32 (Arduino) | HAL, boot, `loop()` scheduling          |
| PlatformIO        | ≥ 6.x          | Build system, dependency resolution, upload |

### 2.2 Libraries (exact `#include` set)

| Library        | Minimum version | Role                                                            |
|:---------------|:----------------|:----------------------------------------------------------------|
| RadioLib       | 6.x             | SX1262/LLCC68 driver — CW carrier keying, LoRa, RSSI, IRQ       |
| ArduinoJson    | 7.x            | Captive-portal REST API serialization                            |
| U8g2lib        | 2.34            | SSD1309 128×64 OLED rendering (software SPI)                    |
| TinyGPSPlus    | 1.0.3           | NMEA GPS sentence parsing (NEO-6M UART)                         |
| WiFi.h         | (framework)     | CONFIG-mode access point (192.168.4.1)                           |
| DNSServer.h    | (framework)     | Captive-portal DNS interception                                  |
| WebServer.h    | (framework)     | Embedded configuration dashboard                                 |
| Preferences.h  | (framework)     | NVS persistence of frequency plans, WPM, volume                 |
| esp_sleep.h    | (framework)     | Deep-sleep state machine (~10 µA)                               |
| esp_task_wdt.h | (framework)     | 30 s hardware watchdog                                          |

### 2.3 Key firmware characteristics

- Dual-core ESP32 (240 MHz), RadioLib SX1262 front end with **mandatory BUSY
  (GPIO 21)** and IRQ **DIO1 (GPIO 2)**.
- Morse CW keying via `transmitDirect()` / `standby()` (no OOK support on
  SX1262), FSK carrier 0.6 kbps, TX −9…+22 dBm (RadioLib cap; E22 PA to +30 dBm).
- Four operating modes: **BEACON / SEARCH / CONFIG / EMERGENCY**.
- BEACON ~65 h, SEARCH ~44 h on one 18650 cell; ~10 µA deep sleep.

---

## 3. Hardware Platform

| Component                  | Part                          | Role                               |
|:---------------------------|:------------------------------|:-----------------------------------|
| Microcontroller            | ESP32 DevKit V1 (30-pin)      | Dual-core MCU, USB, LDO            |
| Radio module               | Ebyte E22-400M30S (SX1262)    | 410–525 MHz, +30 dBm PA, SMA       |
| Display                    | SSD1309 2.42" OLED 128×64     | Status UI (7-pin SPI, software SPI)|
| GPS                        | NEO-6M                        | UART 9600 baud, payload coordinates|
| Battery                    | 18650 Li-ion 3.7 V            | Single-cell power source           |
| Charger                    | TP4056 (USB-C)                | Li-ion charge + protection         |
| Audio                      | 3.5 mm TRRS + DAC/LEDC tone   | Morse click stream, search beeps   |
| Controls                   | 4× tactile buttons            | MODE, SEL, UP, DN (long-press)     |
| Antenna                    | 17.3 cm wire (¼-wave @433 MHz)| SMA / direct solder                |

Approximate BOM: **$23–28 USD**. See `DATASHEET.md` for full electrical
specifications and the exact GPIO map.

---

## 4. Astro Website

### 4.1 Runtime and architecture

| Technology          | Version | Role                                                  |
|:--------------------|:--------|:------------------------------------------------------|
| Astro               | 5.x     | Static site generator (`.astro` components + Markdown)|
| TypeScript          | 5.x     | Typed frontmatter and content collections             |
| Astro Content Col.  | built-in| `src/content/wiki/*.md` collection with `zod` schema  |
| Output mode         | `static`| Prerendered HTML, no server runtime                   |

Pages are `.astro` components under `src/pages/`: the landing page (`index.astro`),
the wiki hub (`wiki/index.astro`) with a dynamic article renderer
(`wiki/[...slug].astro`), the interactive demo (`demo.astro`), the BOM builder
(`builder.astro`) and the legal/brand pages (`terms.astro`, `privacy.astro`,
`branding.astro`). Build output goes to `website/dist/`.

### 4.2 Front-end

| Technology            | Role                                                          |
|:----------------------|:--------------------------------------------------------------|
| Astro components      | Layouts (`Layout.astro`, `WikiLayout.astro`) + page markup    |
| Markdown + callouts   | Wiki articles with an Obsidian-style `> [!NOTE]` callout plugin |
| CSS custom properties | Design tokens: `--primary`, `--background`, dark/light themes  |
| Self-hosted fonts     | Fontsource: Chakra Petch (display), Manrope (body), JetBrains Mono (code) |
| Vanilla JS modules    | `lib/motion.ts` (reveal-on-scroll), inline theme toggle        |
| WebAudio API          | RSSI pitch emulation (440-2200 Hz) in the firmware demo        |

Fonts are self-hosted via the `@fontsource` packages - no Google Fonts request
leaves the page. All wiki navigation and grouping lives in `lib/wiki-nav.ts`,
kept in sync with the content collection.

### 4.3 Content

- 41 wiki articles in `src/content/wiki/` across 7 groups (Getting Started,
  Hardware & Assembly, Radio & RF, Firmware, Power, Field Ops, Reference).
- Each article is plain Markdown with `title`/`description` frontmatter,
  validated by the content-collection schema.
- `npm run check` runs the Astro type checker across pages and content; any
  missing schema field or broken import fails it.

---

## 5. Tooling, Build and Deployment

| Tool             | Version    | Purpose                                          |
|:-----------------|:-----------|:-------------------------------------------------|
| Git + GitHub     | —          | Version control, remote `origin/main`            |
| Visual Studio Code + PlatformIO IDE | ≥ 6.x | Firmware build & upload                |
| Arduino IDE      | 2.x        | Alternative firmware flashing path               |
| Node.js          | ≥ 20       | Astro CLI runtime (`npm run dev/build/check`)   |
| Vercel CLI       | ≥ 34       | Local `vercel build` validation, project linking |
| Vercel (Git)     | —          | Production hosting, Root Directory = `website`   |

### 5.1 Build commands

```bash
# Website - Astro
cd website
npm install
npm run check          # astro check: pages + content collections
npm run build          # static build -> website/dist/
npm run dev            # local dev server

# Vercel production build (from repository root)
vercel build

# Firmware (PlatformIO env: esp32devkitv1, see README Installation section)
# Open the repository root in VS Code with PlatformIO, then:
#   pio run --target upload   # compile + flash via USB
#   pio device monitor --baud 115200
```

### 5.2 Deployment pipeline (Vercel)

1. Push to `main` - the Vercel Git integration builds from the **Root
   Directory `website/`** (a project setting, see README "Vercel deployment").
2. `website/vercel.json` declares `framework: astro`,
   `buildCommand: npm run build` and `outputDirectory: dist`.
3. Result: a fully static site served from Vercel's edge - `/`,
   `/wiki` (41 articles), `/demo`, `/builder`, `/branding`, `/terms`,
   `/privacy`. No serverless function or runtime is involved.

---

## 6. Project Map

```text
Aegis-Beacon/
├── website/             # Astro website
│   ├── src/
│   │   ├── pages/       # index, wiki/index + wiki/[...slug], demo, builder,
│   │   │                #   branding, terms, privacy
│   │   ├── content/wiki/# 41 Markdown articles (7 groups)
│   │   ├── layouts/     # Layout.astro + WikiLayout.astro
│   │   ├── lib/         # wiki-nav.ts, motion.ts, obsidian-callouts.mjs
│   │   └── content.config.ts
│   ├── public/css/site.css  # Design system (tokens + components)
│   ├── public/favicon.svg   # Brand mark
│   ├── public/banner.png    # Social banner
│   ├── astro.config.mjs     # Static output, callout rehype plugin
│   ├── vercel.json          # framework astro, output dist
│   └── package.json         # Scripts: dev, build, preview, check
├── AegisBeacon.ino      # ESP32 firmware (Arduino source)
├── README.md            # Project overview and quick start
├── DATASHEET.md         # Hardware / electrical specifications
├── FREQUENCIES.md       # SAR frequency reference manual
├── TECHNOLOGIES.md      # This document - technology stack
└── LICENSE              # MIT
```

---

## 7. Verification Checklist

- [ ] `website/npm run check` passes (astro check, 0 errors).
- [ ] `website/npm run build` emits a static site to `website/dist/`.
- [ ] `website/npm run dev` serves `/`, `/wiki`, `/demo`, `/builder` locally.
- [ ] Live site returns 200 on `/`, `/wiki`, `/demo`, `/builder`, `/css/site.css`.
- [ ] All 41 wiki pages listed in `src/lib/wiki-nav.ts` exist in `src/content/wiki/`.
- [ ] Firmware compiles with PlatformIO (`pio run --target upload`, env
      `esp32devkitv1`; RadioLib ≥ 6.x, U8g2 ≥ 2.34, TinyGPS++ ≥ 1.0.3,
      ArduinoJson ≥ 7.x).

---

*MIT License — Copyright (c) 2026 Leonardo Galli*
*https://github.com/Leo-Galli/Aegis-Beacon*
