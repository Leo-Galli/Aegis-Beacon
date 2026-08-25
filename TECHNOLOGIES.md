# Technology Stack

**Project:** Aegis-Beacon v5.4 — Dual-Mode Avalanche Rescue System
**Repository:** https://github.com/Leo-Galli/Aegis-Beacon
**License:** MIT

This document is the complete technology reference for the project. It covers
the **embedded firmware** (Arduino / PlatformIO on ESP32), the **hardware
platform**, the **Node.js website** and the **deployment toolchain**, with the
exact libraries, versions and build commands used.

---

## 1. System Overview

The project is split into two independent, clearly separated areas:

| Area            | Technology class   | Lives in                  | Runs on                      |
|:----------------|:-------------------|:--------------------------|:-----------------------------|
| Embedded beacon | C++ / Arduino      | repository root           | ESP32 DevKit V1 (on device)  |
| Website         | Node.js            | `website/` folder         | Vercel serverless + localhost |

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

## 4. Node.js Website

### 4.1 Runtime and architecture

| Technology            | Version  | Role                                                  |
|:----------------------|:---------|:------------------------------------------------------|
| Node.js               | ≥ 18     | Runtime (`engines` field, Vercel resolves Node 24)    |
| Plain Node HTTP       | `http`   | Zero-dependency server (`server.js`)                  |
| ES modules            | `type: module` | Imports/exports across `server.js`, `translations.js`, browser JS |
| Vercel serverless     | `api/index.js` | Re-exports the same handler as a serverless function  |

The website is a **genuine Node.js application**, not a static host:

- `server.js` renders HTML templates with the active language injected
  (`?lang=` → `aegis-lang` cookie → `Accept-Language` header).
- `/i18n/:lang.json` serves the client-side dictionaries for instant switching
  without a reload.
- Every route (pages, static assets, `/health`, `/version`) is handled by the
  same request handler, with path-traversal protection.

### 4.2 Front-end

| Technology            | Role                                                          |
|:----------------------|:--------------------------------------------------------------|
| HTML5 + semantic tags | Template markup                                               |
| Tailwind CSS (CDN)    | Utility-first styling with `darkMode: 'class'`                |
| CSS custom properties | Animated sun/moon theme switch (`css/site.css`)               |
| Vanilla ES modules    | `js/theme.js`, `js/i18n.js`, `js/tabs.js`, `js/terminal.js`, `js/demo.js`, `js/main.js` |
| WebAudio API          | RSSI pitch emulation (440–2200 Hz) in the firmware demo       |
| Google Fonts          | Inter (UI) + JetBrains Mono (code/terminal)                  |

### 4.3 Internationalization

- Dictionary-driven i18n: 65+ translatable strings across **EN / IT / FR / ES**.
- `website/translations.js` exposes `DICTIONARIES`, `SUPPORTED_LANGS`,
  `DEFAULT_LANG` and `validateDictionaries()` — the `npm run check` script fails
  the build if any language misses a key.
- Technical terms are **never translated**: hardware acronyms (SX1262,
  E22-400M30S, ESP32, GPIO), frequencies, protocol names and the product name
  are kept identical in every language and additionally marked
  `translate="no"` / `notranslate` against automatic translators.

---

## 5. Tooling, Build and Deployment

| Tool             | Version    | Purpose                                          |
|:-----------------|:-----------|:-------------------------------------------------|
| Git + GitHub     | —          | Version control, remote `origin/main`            |
| Visual Studio Code + PlatformIO IDE | ≥ 6.x | Firmware build & upload                |
| Arduino IDE      | 2.x        | Alternative firmware flashing path               |
| Node.js          | ≥ 18       | Local website runtime                            |
| Vercel CLI       | ≥ 34       | Local `vercel build` validation, project linking |
| Vercel (Git)     | —          | Production hosting, Root Directory = `website`   |

### 5.1 Build commands

```bash
# Website — dependency-free install & checks
cd website
npm install            # no runtime dependencies required
npm run check          # syntax check + i18n dictionary parity across EN/IT/FR/ES

# Local website
npm start              # http://localhost:3000

# Vercel production build (must run inside website/)
vercel build --yes --project aegis-beacon

# Firmware (PlatformIO env: esp32devkitv1, see README Installation section)
# Open the repository root in VS Code with PlatformIO, then:
#   pio run --target upload   # compile + flash via USB
#   pio device monitor --baud 115200
```

### 5.2 Deployment pipeline (Vercel)

1. Push to `main` — the Vercel Git integration builds from the **Root
   Directory `website/`** (a project setting, see README "Vercel deployment").
2. `website/vercel.json` defines the serverless function
   `api/index.js` with `functions.includeFiles: public/**` so the renderer can
   read its templates at runtime, plus a catch-all route to the function.
3. Result: language-aware pages, `/demo.html`, static assets and the
   `/i18n/:lang.json` endpoint all served from a single serverless function.

---

## 6. Project Map

```text
Aegis-Beacon/
├── website/             # Node.js website
│   ├── public/          # Views, styles, browser ES modules
│   ├── api/index.js     # Vercel serverless entry point
│   ├── server.js        # Language-aware Node HTTP server
│   ├── translations.js  # EN/IT/FR/ES dictionaries + validation
│   ├── vercel.json      # Vercel build + routing config
│   └── package.json     # Scripts (start, dev, check)
├── AegisBeacon.ino      # ESP32 firmware (Arduino source)
├── README.md            # Project overview and quick start
├── DATASHEET.md         # Hardware / electrical specifications
├── FREQUENCIES.md       # SAR frequency reference manual
├── TECHNOLOGIES.md      # This document — technology stack
└── LICENSE              # MIT
```

---

## 7. Verification Checklist

- [ ] `website/npm run check` passes (syntax + dictionary parity).
- [ ] `website/npm start` serves `/`, `/demo.html`, `/health`, `/version`.
- [ ] `vercel build --yes --project aegis-beacon` (from `website/`) succeeds.
- [ ] Live site returns 200 on `/`, `/demo.html`, `/js/theme.js`, `/css/site.css`,
      `/i18n/es.json`.
- [ ] Firmware compiles with PlatformIO (`pio run --target upload`, env
      `esp32devkitv1`; RadioLib ≥ 6.x, U8g2 ≥ 2.34, TinyGPS++ ≥ 1.0.3,
      ArduinoJson ≥ 7.x).

---

*MIT License — Copyright (c) 2026 Leonardo Galli*
*https://github.com/Leo-Galli/Aegis-Beacon*
