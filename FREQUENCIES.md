<div align="center">

# 📡 GLOBAL EMERGENCY FREQUENCIES
### Aegis-Beacon v5.4 — Search and Rescue (SAR) Reference Manual

[![Version](https://img.shields.io/badge/DATABASE-2026.2-red?style=for-the-badge)](https://github.com/Leo-Galli/Aegis-Beacon)
[![License](https://img.shields.io/badge/LICENSE-MIT-green?style=for-the-badge)](LICENSE)
[![Category](https://img.shields.io/badge/CATEGORY-SAR_INTELLIGENCE-blue?style=for-the-badge)]()
[![Hardware](https://img.shields.io/badge/HARDWARE-SX1262_E22--400M30S-orange?style=for-the-badge)]()

</div>

---

## ⚠️ Hardware Compatibility Notice (v5.4)

Aegis-Beacon v5.4 uses the **Ebyte E22-400M30S** module (SX1262 / LLCC68 chip), which covers **410–525 MHz** only. This document is organized accordingly:

| Band         | SX1262 Support | Notes                                                        |
|:-------------|:--------------:|:-------------------------------------------------------------|
| 410–525 MHz  | ✅ Native       | UHF ISM / PMR446 / some land SAR — primary use              |
| VHF (118–174 MHz) | ❌ No      | Requires separate VHF radio (aviation, marine, mountain SAR) |
| UHF 406 MHz  | ✅ In range     | Satellite PLB band — **do not TX on 406.100 MHz** (see §1)  |
| UHF 462–477 MHz | ✅ In range  | GMRS/UHF CB emergency channels — Americas/Oceania           |

> **The SX1262 transmits a narrow CW carrier** via `transmitDirect()` / `standby()` keying — AM-detectable on any scanner or SDR. It does **not** generate FM, CTCSS sub-tones, or digital modulation. Use it to transmit Morse SOS on ISM/UHF frequencies and to passively scan RSSI on any configured frequency.

> **CTCSS note:** The SX1262 cannot generate CTCSS sub-audio tones. Frequencies that require CTCSS (e.g. Canal E at 123.0 Hz, Radio Montana at 85.4 Hz) are useful for **SEARCH mode scanning** (detecting other radios already on the channel), but Aegis-Beacon transmissions on those channels will not open tone-squelched repeaters.

---

## 1. Global Distress Channels (International Treaty 2026)

Monitored globally by Cospas-Sarsat MEOSAR. Listed for awareness — most are outside SX1262 range.

| Frequency      | Service                   | Mode    | SX1262 | Notes                                       |
|:---------------|:--------------------------|:-------:|:------:|:--------------------------------------------|
| **121.500 MHz** | International Air Distress | AM     | ❌      | VHF Guard — civilian aviation worldwide     |
| **243.000 MHz** | Military Air Distress      | AM     | ❌      | UHF Guard — NATO military aviation          |
| **156.800 MHz** | Marine Channel 16          | NFM    | ❌      | International maritime distress & calling   |
| **406.100 MHz** | Satellite PLB / ELT        | Digital| ⚠️ range | Cospas-Sarsat MEOSAR — **NEVER transmit here** without certified PLB; interferes with satellite infrastructure |

---

## 2. European Mountain Rescue

### 🇮🇹 Italy — Soccorso Alpino / CNSAS

| Frequency       | Channel / Name          | CTCSS    | SX1262 | Description                                     |
|:----------------|:------------------------|:--------:|:------:|:------------------------------------------------|
| **161.300 MHz** | Canal E (Emergenza)     | 123.0 Hz | ❌      | Primary alpine interoperability (VDA/Alps) — VHF only |
| **446.08125 MHz**| Radio Montana (PMR 7-7) | 85.4 Hz | ✅      | Standard safety frequency for hikers and backcountry |
| **446.09375 MHz**| PMR446 CH 8             | 123.0 Hz| ✅      | Alpine emergency protocol ch. 8 (also used by CNSAS liaisons) |
| **156.300 MHz** | Marine CH 06            | None     | ❌      | Secondary SAR coordination — VHF marine         |

**Recommended Aegis-Beacon config for Italy:**
- SEARCH scan: `446.08125`, `446.09375` MHz — SX1262 range, realistic local SAR traffic
- BEACON TX: `446.08125` MHz (Radio Montana) at reduced power; verify local regulations

---

### 🇨🇭 Switzerland — REGA / Alpine Rescue

| Frequency       | Channel / Name   | CTCSS    | SX1262 | Description                                      |
|:----------------|:-----------------|:--------:|:------:|:-------------------------------------------------|
| **161.300 MHz** | Canal E (REGA)   | 123.0 Hz | ❌      | **Primary Swiss Rescue** nationwide — VHF only   |
| **161.350 MHz** | K-Kanal          | None     | ❌      | Swiss secondary coordination — VHF only           |
| **446.08125 MHz**| Radio Montana    | 85.4 Hz | ✅      | Cross-border consistency with Italy               |

---

### 🇫🇷 France — PGHM / Sécurité Civile

| Frequency       | Network             | CTCSS    | SX1262 | Description                                       |
|:----------------|:--------------------|:--------:|:------:|:--------------------------------------------------|
| **161.300 MHz** | Canal E             | 123.0 Hz | ❌      | Haute-Savoie (SDIS 74 / PGHM) — VHF only         |
| **154.465 MHz** | Grand Nord          | None     | ❌      | Emergency coordination Alps/Pyrenees — VHF only   |
| **173.500 MHz** | Radio Secours       | None     | ❌      | National Gendarmerie SAR operations — VHF only    |
| **446.08125 MHz**| Radio Montana      | 85.4 Hz | ✅      | Cross-border consistency with Italy/Switzerland   |

---

### 🇦🇹 Austria & 🇩🇪 Germany — Bergrettung / BRK

| Frequency        | Service          | Mode | SX1262 | Description                                      |
|:-----------------|:-----------------|:----:|:------:|:-------------------------------------------------|
| **121.500 MHz**  | Bergrettung      | AM   | ❌      | Primary aviation rescue contact — VHF only       |
| **149.025 MHz**  | Freenet CH 1     | NFM  | ❌      | Common hiker emergency (Germany) — VHF only      |
| **446.09375 MHz**| PMR CH 8         | NFM  | ✅      | Alpine emergency protocol (Ch 8, 123.0 Hz CTCSS) |
| **446.08125 MHz**| PMR CH 7 (7-7)   | NFM  | ✅      | Cross-border Radio Montana compatibility          |

---

### 🇪🇸 Spain — Protección Civil / REMER

| Frequency       | Service          | Mode | SX1262 | Description                                       |
|:----------------|:-----------------|:----:|:------:|:--------------------------------------------------|
| **146.175 MHz** | Protección Civil | NFM  | ❌      | REMER Emergency Network — VHF main                |
| **146.625 MHz** | Protección Civil | NFM  | ❌      | REMER Emergency Network — secondary               |
| **446.09375 MHz**| PMR CH 8        | NFM  | ✅      | European PMR emergency protocol                   |

---

## 3. Americas

### 🇺🇸 USA & 🇨🇦 Canada — NASAR / FEMA

| Frequency       | Service           | CTCSS / Mode | SX1262 | Description                                    |
|:----------------|:------------------|:------------:|:------:|:-----------------------------------------------|
| **155.160 MHz** | National SAR      | NFM          | ❌      | Primary land-based SAR — VHF only              |
| **155.800 MHz** | State SAR         | NFM          | ❌      | Local agency coordination — VHF only           |
| **462.675 MHz** | GMRS CH 20        | 141.3 Hz     | ✅      | Wilderness Protocol Emergency Calling — ISM UHF |
| **467.675 MHz** | GMRS CH 20 (input)| 141.3 Hz     | ✅      | Repeater input pair for CH 20                  |
| **462.550 MHz** | GMRS CH 1         | None         | ✅      | General GMRS simplex — secondary calling       |

**Recommended Aegis-Beacon config for North America:**
- SEARCH scan: `462.675`, `462.550` MHz
- BEACON TX: `462.675` MHz (GMRS CH 20 Wilderness Protocol) — requires GMRS licence in USA

---

### 🇦🇺 Australia & 🇳🇿 New Zealand — AMSA / LandSAR

| Frequency        | Service       | Channel | SX1262 | Description                                      |
|:-----------------|:--------------|:-------:|:------:|:-------------------------------------------------|
| **476.525 MHz**  | UHF CB        | CH 5    | ✅      | Emergency Repeater Output (duplex output)        |
| **477.275 MHz**  | UHF CB        | CH 35   | ✅      | Emergency Repeater Input (duplex input)          |
| **477.0 MHz**    | UHF CB simplex| CH 40   | ✅      | General calling / secondary                      |

---

## 4. ISM 433 MHz Band — Aegis-Beacon Native Range

The SX1262 E22-400M30S is optimised for **433–434.8 MHz** (EU SRD60 band). This is the primary operating range for Aegis-Beacon CW beacon transmissions.

### EU SRD (Short Range Device) Band — 433.050–434.790 MHz

| Frequency       | Use                           | Power limit | Notes                                                  |
|:----------------|:------------------------------|:-----------:|:-------------------------------------------------------|
| **433.050 MHz** | SRD lower edge                | 10 mW ERP   | Lower limit of licence-free ISM band (EU)              |
| **433.500 MHz** | **Aegis-Beacon default**      | 10 mW ERP   | Firmware default (`DEFAULT_FREQ_MHZ = 433.500f`)       |
| **433.700 MHz** | Ham / ISM overlap             | 10 mW ERP   | Common simplex calling in EU ISM                       |
| **434.075 MHz** | Weather balloon (radiosonde)  | —           | Avoid when passive scanning — high false-positive rate |
| **434.500 MHz** | ISM devices / keyfobs         | 10 mW ERP   | High background noise — use only as secondary hop      |
| **434.790 MHz** | SRD upper edge                | 10 mW ERP   | Upper limit of EU SRD60 band                           |

> The E22-400M30S PA outputs up to +30 dBm. In the EU SRD band the legal ERP limit is typically **10 mW (+10 dBm)**. Use the dashboard to set TX power to ≤ +10 dBm for SRD-compliant operation. Higher power is permissible under amateur licence (with callsign) or in genuine life-threatening emergencies.

### Suggested Multi-Frequency Beacon Hop Sequence (EU)

A frequency-hopping BEACON cycle increases the probability that at least one hop is heard by a rescuer scanning. Suggested 5-frequency sequence:

```
Slot 1: 433.500 MHz  (default, most monitored by hams/SAR volunteers)
Slot 2: 433.700 MHz  (secondary ISM simplex)
Slot 3: 434.500 MHz  (ISM, wider scanner coverage)
Slot 4: 434.790 MHz  (upper SRD edge)
Slot 5: 446.08125 MHz (Radio Montana — if local CNSAS/mountain rescue uses it)
```

Enter all five frequencies in the Dashboard → Frequency Manager. The firmware cycles through them sequentially per TX cycle.

---

## 5. PMR446 Emergency Channels — SX1262 Optimised

PMR446 (446.0–446.2 MHz) is a licence-free UHF band in the EU (and adopted in many non-EU countries) that falls within SX1262 native range. These channels are commonly used by hikers, mountain guides, and SAR volunteers.

| Channel | Frequency        | CTCSS     | SX1262 | Common use                                         |
|:-------:|:-----------------|:---------:|:------:|:---------------------------------------------------|
| **CH 1**| 446.00625 MHz    | None      | ✅      | General calling                                    |
| **CH 7**| 446.08125 MHz    | 85.4 Hz   | ✅      | **Radio Montana** — primary alpine emergency       |
| **CH 8**| 446.09375 MHz    | 123.0 Hz  | ✅      | Alpine SAR protocol (CNSAS liaisons, Austria, Germany) |
| **CH 16**| 446.19375 MHz   | None      | ✅      | OIRT secondary / free channel                      |

> **CTCSS and Aegis-Beacon:** The SX1262 CW carrier will be heard on **any scanner or SDR** regardless of CTCSS, because scanners in open/scan mode ignore sub-tone squelch. CTCSS is a squelch filter on the *receiver* side, not a physical modulation the CW carrier lacks. Your Morse SOS will appear as a signal on the frequency — a trained SAR operator scanning with an SDR or open-squelch receiver will see and hear it.

---

## 6. Frequency Configuration Guide (v5.4 Firmware)

### Dashboard — Frequency Manager

1. Open CONFIG mode: hold **SW_SEL ≥ 3 s** → connect to `AegisBeacon` WiFi → open `http://192.168.4.1`
2. Navigate to **Frequency Manager**
3. Add up to **10 frequency slots** (firmware constant `MAX_FREQUENCIES = 10`)
4. In BEACON mode, each slot is transmitted in sequence per cycle
5. In SEARCH mode, each slot is scanned with the configured dwell time

### Recommended SEARCH Scan Parameters

| Parameter         | Alpine SAR | Urban / lowland | Constant         |
|:------------------|:----------:|:---------------:|:-----------------|
| Dwell time        | 400 ms     | 200 ms          | `scanDwellMs`    |
| RSSI threshold    | −105 dBm   | −90 dBm         | `rssiThreshold`  |
| RX bandwidth      | 9.7 kHz    | 9.7 kHz         | (firmware fixed) |

> At high altitude, atmospheric conditions reduce background noise. Lowering the threshold to **−105 dBm** significantly increases detection range at the cost of more false positives from local ISM devices.

### Antenna Length by Frequency

| Frequency band  | ¼-wave length | ½-wave length | Notes                          |
|:----------------|:-------------:|:-------------:|:-------------------------------|
| 433–435 MHz     | **17.3 cm**   | 34.6 cm       | Firmware default range         |
| 446 MHz (PMR)   | **16.8 cm**   | 33.6 cm       | PMR446 / Radio Montana         |
| 462–477 MHz (GMRS/UHF CB) | **16.2 cm** | 32.4 cm | North America / Oceania  |

The E22-400M30S SMA connector accepts any 433 MHz SMA whip. For portable use, a 17.3 cm straight wire soldered to the ANT pad is adequate for the 433–477 MHz range (< 5% impedance mismatch at 477 MHz).

---

## 7. Regional Frequency Quick-Reference

| Region          | Primary (SX1262 ✅) | Secondary (SX1262 ✅) | Requires VHF radio ❌       |
|:----------------|:-------------------:|:---------------------:|:---------------------------:|
| 🇮🇹 Italy        | 446.08125 MHz       | 446.09375 MHz         | 161.300 MHz (Canal E)       |
| 🇨🇭 Switzerland  | 446.08125 MHz       | 433.500 MHz (ISM)     | 161.300 MHz (Canal E/REGA)  |
| 🇫🇷 France       | 446.08125 MHz       | 446.09375 MHz         | 161.300 MHz, 173.500 MHz    |
| 🇦🇹 Austria      | 446.09375 MHz       | 446.08125 MHz         | 121.500 MHz, 149.025 MHz    |
| 🇩🇪 Germany      | 446.09375 MHz       | 446.08125 MHz         | 149.025 MHz                 |
| 🇪🇸 Spain        | 446.09375 MHz       | 433.500 MHz (ISM)     | 146.175 MHz, 146.625 MHz    |
| 🇺🇸 USA / 🇨🇦 Canada | 462.675 MHz    | 462.550 MHz           | 155.160 MHz, 155.800 MHz    |
| 🇦🇺 Australia / 🇳🇿 NZ | 476.525 MHz  | 477.275 MHz           | —                           |
| **Universal**   | 433.500 MHz (ISM)   | 434.500 MHz (ISM)     | 121.500 MHz (air guard)     |

---

## 8. What Receivers Can Hear Aegis-Beacon

The SX1262 produces a narrow CW carrier (FSK carrier on, key off = silence). This is equivalent to OOK/AM from a receiver perspective.

| Receiver type                          | Hears Aegis-Beacon? | Notes                                             |
|:---------------------------------------|:-------------------:|:--------------------------------------------------|
| AM-mode scanner / ham radio            | ✅ Yes              | Standard AM mode picks up CW carrier directly     |
| SDR + SDR# / GQRX / SDRangel          | ✅ Yes              | Set demodulator to AM or CW; visible as Morse     |
| Baofeng UV-5R (AM mode on 433 MHz)     | ✅ Yes              | Requires AM mode or wider bandwidth               |
| FM-only handheld (PMR446 radio)        | ⚠️ Partial          | May hear buzzing on FM; not cleanly demodulated   |
| Certified PLB / EPIRB receivers        | ❌ No               | Digital protocol only on 406.1 MHz                |
| Another Aegis-Beacon in SEARCH mode    | ✅ Yes              | RSSI detection, not demodulation                  |

---

## 9. Legal & Regulatory Summary

| Region        | Relevant Band     | TX legal?        | Conditions                                              |
|:--------------|:------------------|:----------------:|:--------------------------------------------------------|
| EU            | 433–434.8 MHz SRD | ✅ Licence-free   | ≤ 10 mW ERP, ≤ 10% duty cycle (EN 300 220)             |
| EU            | PMR446 (446 MHz)  | ✅ Licence-free   | ≤ 500 mW ERP, no repeaters, no encryption              |
| Switzerland   | 433 MHz SRD       | ✅ Licence-free   | OFCOM class licence                                     |
| USA / Canada  | 462–467 MHz GMRS  | ⚠️ Licence req.  | FCC GMRS licence ($35 / 10 yr, covers family)          |
| USA           | 433 MHz ISM       | ✅ Part 15        | ≤ 1 mW conducted; low power only                       |
| Australia/NZ  | UHF CB (476–477)  | ✅ Licence-free   | ACMA class licence, ≤ 5 W                              |
| Global        | 406.100 MHz       | ❌ Prohibited     | Certified PLBs only — illegal to transmit without certification |
| Global        | 121.5 / 156.8 MHz | ⚠️ Emergency only | Distress use only; misuse is a criminal offence        |

> **Emergency exception:** In virtually all jurisdictions, the use of any available communication means to signal genuine life-threatening distress is legally protected. This device is designed for exactly that scenario. Outside of emergency use, observe all power and licensing restrictions above.

---

> [!IMPORTANT]
> This document is updated for **June 2026**. Emergency frequencies and regulatory limits are subject to change by national telecommunications authorities. Always verify current regulations before operation. Transmitting on licensed or protected frequencies outside of declared emergencies is subject to international telecommunication law and significant penalties.

---

<div align="center">

*Document version: 2026.2 | Project: [Leo-Galli/Aegis-Beacon](https://github.com/Leo-Galli/Aegis-Beacon)*

*Built with ❤️ for mountain safety.*

</div>