---
title: "Frequency Compatibility"
description: "Regional frequency table and compatibility guidance for legal beacon operation worldwide"
---

# Frequency Compatibility

## Overview

The Aegis-Beacon v5.4 radio is an **Ebyte E22-400M30S** module (SX1262 / LLCC68 chip) that covers **410-525 MHz** only. Everything in this page is organized around that constraint: the 433 MHz ISM band is the native operating range, PMR446 and UHF GMRS/CB emergency channels fall inside the coverage window, and VHF mountain-rescue services require a separate radio.

| Band | SX1262 support | Notes |
|:-----|:--------------:|:------|
| 410-525 MHz | Native | UHF ISM / PMR446 / some land SAR — primary use |
| VHF (118-174 MHz) | No | Requires separate VHF radio (aviation, marine, mountain SAR) |
| 406 MHz | In range | Satellite PLB band — never TX here (see Global Distress) |
| 462-477 MHz | In range | GMRS / UHF CB emergency channels — Americas / Oceania |

> [!IMPORTANT]
> The SX1262 transmits a **narrow CW carrier** via `transmitDirect()` / `standby()` keying. It is AM-detectable on any scanner or SDR, but it does **not** generate FM, CTCSS sub-tones, or digital modulation. Frequencies that require CTCSS (Canal E at 123.0 Hz, Radio Montana at 85.4 Hz) are useful for SEARCH-mode scanning of radios already on the channel, but transmissions will not open tone-squelched repeaters.

## ISM 433 MHz Band — Native Range

The E22-400M30S is optimised for **433-434.8 MHz** (EU SRD60 band). This is the primary operating range for beacon CW transmissions.

### EU SRD Band — 433.050–434.790 MHz

| Frequency | Use | Power limit | Notes |
|:----------|:----|:-----------:|:------|
| 433.050 MHz | SRD lower edge | 10 mW ERP | Lower limit of licence-free ISM band (EU) |
| **433.500 MHz** | **Default** | 10 mW ERP | Firmware default (`DEFAULT_FREQ_MHZ = 433.500f`) |
| 433.700 MHz | Ham / ISM overlap | 10 mW ERP | Common simplex calling in EU ISM |
| 434.075 MHz | Weather balloon | — | Avoid when passive scanning — high false positives |
| 434.500 MHz | ISM devices / keyfobs | 10 mW ERP | High background noise — secondary hop only |
| 434.790 MHz | SRD upper edge | 10 mW ERP | Upper limit of EU SRD60 band |

> [!WARNING]
> The E22-400M30S PA outputs up to **+30 dBm**. In the EU SRD band the legal ERP limit is typically **10 mW (+10 dBm)** — set TX power to ≤ +10 dBm in the dashboard for SRD-compliant operation. Higher power requires an amateur licence (with callsign) or a genuine life-threatening emergency.

### Suggested Multi-Frequency Beacon Hop Sequence (EU)

A frequency-hopping cycle increases the chance that at least one hop is heard by a rescuer. Suggested 5-slot sequence:

```
Slot 1: 433.500 MHz   (default, most monitored by hams / SAR volunteers)
Slot 2: 433.700 MHz   (secondary ISM simplex)
Slot 3: 434.500 MHz   (ISM, wider scanner coverage)
Slot 4: 434.790 MHz   (upper SRD edge)
Slot 5: 446.08125 MHz (Radio Montana — if local mountain rescue uses it)
```

Enter the slots in Dashboard → Frequency Manager (up to `MAX_FREQUENCIES = 10`). The firmware cycles through them sequentially per TX cycle in BEACON mode, and scans each one with the configured dwell time in SEARCH mode.

## PMR446 Emergency Channels

PMR446 (446.0-446.2 MHz) is licence-free across the EU and falls inside the SX1262 native range. These are the channels used by hikers, mountain guides and SAR volunteers.

| Channel | Frequency | CTCSS | Common use |
|:-------:|:----------|:-----:|:-----------|
| CH 1 | 446.00625 MHz | None | General calling |
| CH 7 | 446.08125 MHz | 85.4 Hz | **Radio Montana** — primary alpine emergency |
| CH 8 | 446.09375 MHz | 123.0 Hz | Alpine SAR protocol (CNSAS liaisons, Austria, Germany) |
| CH 16 | 446.19375 MHz | None | OIRT secondary / free channel |

> [!NOTE]
> CTCSS is a squelch filter on the *receiver* side, not a physical modulation. The CW carrier is heard on any scanner or SDR in open/scan mode regardless of CTCSS — a trained SAR operator scanning with an SDR will see the Morse SOS.

## Global Distress Channels

Monitored globally by Cospas-Sarsat MEOSAR. Listed for awareness — most are outside the SX1262 range.

| Frequency | Service | Mode | SX1262 | Notes |
|:----------|:--------|:----:|:------:|:------|
| 121.500 MHz | International Air Distress | AM | No | VHF Guard — civilian aviation worldwide |
| 243.000 MHz | Military Air Distress | AM | No | UHF Guard — NATO military aviation |
| 156.800 MHz | Marine Channel 16 | NFM | No | International maritime distress & calling |
| 406.100 MHz | Satellite PLB / ELT | Digital | Limited | Cospas-Sarsat MEOSAR |

> [!WARNING]
> **Never transmit on 406.100 MHz** without a certified PLB. It interferes with satellite infrastructure and is illegal.

## European Mountain Rescue Channels

### Italy — Alpine Rescue / CNSAS

| Frequency | Channel / Name | CTCSS | SX1262 | Description |
|:----------|:---------------|:-----:|:------:|:------------|
| 161.300 MHz | Canal E (Emergency) | 123.0 Hz | No | Primary alpine interoperability (VDA/Alps) — VHF only |
| 446.08125 MHz | Radio Montana (PMR 7-7) | 85.4 Hz | Yes | Standard safety frequency for hikers and backcountry |
| 446.09375 MHz | PMR446 CH 8 | 123.0 Hz | Yes | Alpine emergency protocol ch. 8 (CNSAS liaisons) |
| 156.300 MHz | Marine CH 06 | None | No | Secondary SAR coordination — VHF marine |

**Recommended config for Italy:** SEARCH scan `446.08125` + `446.09375` MHz; BEACON TX on `446.08125` MHz (Radio Montana) at reduced power — verify local regulations.

### Switzerland — REGA / Alpine Rescue

| Frequency | Channel / Name | CTCSS | SX1262 | Description |
|:----------|:---------------|:-----:|:------:|:------------|
| 161.300 MHz | Canal E (REGA) | 123.0 Hz | No | Primary Swiss rescue — nationwide, VHF only |
| 161.350 MHz | K-Kanal | None | No | Swiss secondary coordination — VHF only |
| 446.08125 MHz | Radio Montana | 85.4 Hz | Yes | Cross-border consistency with Italy |

### France — PGHM / Civil Protection

| Frequency | Network | CTCSS | SX1262 | Description |
|:----------|:--------|:-----:|:------:|:------------|
| 161.300 MHz | Canal E | 123.0 Hz | No | Haute-Savoie (SDIS 74 / PGHM) — VHF only |
| 154.465 MHz | Grand Nord | None | No | Emergency coordination Alps/Pyrenees — VHF only |
| 173.500 MHz | Radio Secours | None | No | National Gendarmerie SAR operations — VHF only |
| 446.08125 MHz | Radio Montana | 85.4 Hz | Yes | Cross-border consistency with Italy/Switzerland |

### Austria & Germany — Bergrettung / BRK

| Frequency | Service | Mode | SX1262 | Description |
|:----------|:--------|:----:|:------:|:------------|
| 121.500 MHz | Bergrettung | AM | No | Primary aviation rescue contact — VHF only |
| 149.025 MHz | Freenet CH 1 | NFM | No | Common hiker emergency (Germany) — VHF only |
| 446.09375 MHz | PMR CH 8 | NFM | Yes | Alpine emergency protocol (123.0 Hz CTCSS) |
| 446.08125 MHz | PMR CH 7 (7-7) | NFM | Yes | Cross-border Radio Montana compatibility |

### Spain — Civil Protection / REMER

| Frequency | Service | Mode | SX1262 | Description |
|:----------|:--------|:----:|:------:|:------------|
| 146.175 MHz | Civil Protection | NFM | No | REMER Emergency Network — VHF main |
| 146.625 MHz | Civil Protection | NFM | No | REMER Emergency Network — secondary |
| 446.09375 MHz | PMR CH 8 | NFM | Yes | European PMR emergency protocol |

## Americas

### USA & Canada — NASAR / FEMA

| Frequency | Service | CTCSS / Mode | SX1262 | Description |
|:----------|:--------|:------------:|:------:|:------------|
| 155.160 MHz | National SAR | NFM | No | Primary land-based SAR — VHF only |
| 155.800 MHz | State SAR | NFM | No | Local agency coordination — VHF only |
| 462.675 MHz | GMRS CH 20 | 141.3 Hz | Yes | Wilderness Protocol Emergency Calling — ISM UHF |
| 467.675 MHz | GMRS CH 20 (input) | 141.3 Hz | Yes | Repeater input pair for CH 20 |
| 462.550 MHz | GMRS CH 1 | None | Yes | General GMRS simplex — secondary calling |

**Recommended config for North America:** SEARCH scan `462.675` + `462.550` MHz; BEACON TX on `462.675` MHz (GMRS CH 20 Wilderness Protocol) — requires a GMRS licence in the USA.

### Australia & New Zealand — AMSA / LandSAR

| Frequency | Service | Channel | SX1262 | Description |
|:----------|:--------|:-------:|:------:|:------------|
| 476.525 MHz | UHF CB | CH 5 | Yes | Emergency repeater output (duplex output) |
| 477.275 MHz | UHF CB | CH 35 | Yes | Emergency repeater input (duplex input) |
| 477.0 MHz | UHF CB simplex | CH 40 | Yes | General calling / secondary |

## Regional Quick Reference

| Region | Primary (SX1262) | Secondary (SX1262) | Requires VHF radio |
|:-------|:-----------------|:-------------------|:-------------------|
| Italy | 446.08125 MHz | 446.09375 MHz | 161.300 MHz (Canal E) |
| Switzerland | 446.08125 MHz | 433.500 MHz (ISM) | 161.300 MHz (Canal E/REGA) |
| France | 446.08125 MHz | 446.09375 MHz | 161.300, 173.500 MHz |
| Austria | 446.09375 MHz | 446.08125 MHz | 121.500, 149.025 MHz |
| Germany | 446.09375 MHz | 446.08125 MHz | 149.025 MHz |
| Spain | 446.09375 MHz | 433.500 MHz (ISM) | 146.175, 146.625 MHz |
| USA / Canada | 462.675 MHz | 462.550 MHz | 155.160, 155.800 MHz |
| Australia / NZ | 476.525 MHz | 477.275 MHz | — |
| **Universal** | 433.500 MHz (ISM) | 434.500 MHz (ISM) | 121.500 MHz (air guard) |

## SEARCH Scan Parameters

| Parameter | Alpine SAR | Urban / lowland | Constant |
|:----------|:----------:|:---------------:|:---------|
| Dwell time | 400 ms | 200 ms | `scanDwellMs` |
| RSSI threshold | -105 dBm | -90 dBm | `rssiThreshold` |
| RX bandwidth | 9.7 kHz | 9.7 kHz | firmware fixed |

> [!TIP]
> At high altitude, atmospheric conditions reduce background noise. Lowering the threshold to **-105 dBm** significantly increases detection range at the cost of more false positives from local ISM devices.

## Antenna Length by Frequency

| Frequency band | 1/4-wave | 1/2-wave | Notes |
|:---------------|:--------:|:--------:|:------|
| 433-435 MHz | **17.3 cm** | 34.6 cm | Firmware default range |
| 446 MHz (PMR) | **16.8 cm** | 33.6 cm | PMR446 / Radio Montana |
| 462-477 MHz (GMRS/UHF CB) | **16.2 cm** | 32.4 cm | North America / Oceania |

The E22-400M30S SMA connector accepts any 433 MHz SMA whip. For portable use, a 17.3 cm straight wire soldered to the ANT pad is adequate for the 433-477 MHz range (under 5% impedance mismatch at 477 MHz).

## What Receivers Can Hear

| Receiver type | Hears it? | Notes |
|:--------------|:---------:|:------|
| AM-mode scanner / ham radio | Yes | Standard AM mode picks up the CW carrier directly |
| SDR + SDR# / GQRX / SDRangel | Yes | Set demodulator to AM or CW; Morse is clearly visible |
| Baofeng UV-5R (AM mode on 433 MHz) | Yes | Requires AM mode or wider bandwidth |
| FM-only handheld (PMR446 radio) | Partial | May hear buzzing on FM; not cleanly demodulated |
| Certified PLB / EPIRB receivers | No | Digital protocol only on 406.1 MHz |
| Another beacon in SEARCH mode | Yes | RSSI detection, not demodulation |

## Legal & Regulatory Summary

| Region | Relevant band | TX legal? | Conditions |
|:-------|:--------------|:---------:|:-----------|
| EU | 433-434.8 MHz SRD | Licence-free | ≤ 10 mW ERP, ≤ 10% duty cycle (EN 300 220) |
| EU | PMR446 (446 MHz) | Licence-free | ≤ 500 mW ERP, no repeaters, no encryption |
| Switzerland | 433 MHz SRD | Licence-free | OFCOM class licence |
| USA / Canada | 462-467 MHz GMRS | Licence required | FCC GMRS licence ($35 / 10 yr, covers family) |
| USA | 433 MHz ISM | Part 15 | ≤ 1 mW conducted; low power only |
| Australia / NZ | UHF CB (476-477) | Licence-free | ACMA class licence, ≤ 5 W |
| Global | 406.100 MHz | Prohibited | Certified PLBs only — illegal without certification |
| Global | 121.5 / 156.8 MHz | Limited | Distress use only; misuse is a criminal offence |

> [!IMPORTANT]
> **Emergency exception:** in virtually all jurisdictions, using any available communication means to signal genuine life-threatening distress is legally protected. Outside of emergency use, observe all power and licensing restrictions above. Frequencies and limits change — always verify current regulations before operation. This document reflects the June 2026 reference manual.
