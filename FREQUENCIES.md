# 📡 GLOBAL EMERGENCY FREQUENCIES
### Aegis-Beacon v4.0 — Search and Rescue (SAR) Reference Manual

[![Version](https://img.shields.io/badge/DATABASE-2026.1-red?style=for-the-badge)](https://github.com/Leo-Galli/Aegis-Beacon)
[![License](https://img.shields.io/badge/LICENSE-MIT-green?style=for-the-badge)](LICENSE)
[![Category](https://img.shields.io/badge/CATEGORY-SAR_INTELLIGENCE-blue?style=for-the-badge)]()

---

## 🌍 Global Distress Channels (Mandatory 2026)
These frequencies are monitored globally by international treaty and satellite systems (Cospas-Sarsat MEOSAR).

| Frequency | Service | Mode | Usage |
| :--- | :--- | :--- | :--- |
| **121.500 MHz** | International Air Distress | AM | Civilian aviation emergency (VHF Guard) |
| **243.000 MHz** | Military Air Distress | AM | NATO military aviation emergency (UHF Guard) |
| **156.800 MHz** | Marine Channel 16 | FM | International maritime distress & calling |
| **406.100 MHz** | Satellite Beacon | Digital | PLB / ELT digital telegrams (Next-Gen MEOSAR) |

---

## 🏔️ European Mountain Rescue (Updated 2026)

### 🇮🇹 Italy
| Frequency | Channel / Name | Tone (CTCSS) | Description |
| :--- | :--- | :--- | :--- |
| **161.300 MHz** | Canal E (Emergenza) | 123.0 Hz | Soccorso Alpino (Interoperability VDA/Alps) |
| **446.08125 MHz**| Radio Montana (7-7) | 85.4 Hz | Standard safety for hikers and backcountry |
| **156.300 MHz** | Marine CH 06 | None | Secondary SAR coordination |

### 🇨🇭 Switzerland
| Frequency | Channel / Name | Tone (CTCSS) | Description |
| :--- | :--- | :--- | :--- |
| **161.300 MHz** | Canal E (REGA) | 123.0 Hz | **Primary Swiss Rescue** (Nationwide Coverage) |
| **161.350 MHz** | K-Kanal | None | Swiss secondary coordination |

### 🇫🇷 France
| Frequency | Network | Tone (CTCSS) | Description |
| :--- | :--- | :--- | :--- |
| **161.300 MHz** | Canal E | 123.0 Hz | Haute-Savoie (SDIS 74 / PGHM) |
| **154.465 MHz** | Grand Nord | None | Emergency coordination (Alps/Pyrenees) |
| **173.500 MHz** | Radio Secours | None | National Gendarmerie SAR Operations |

### 🇦🇹 Austria & 🇩🇪 Germany
| Frequency | Service | Mode | Description |
| :--- | :--- | :--- | :--- |
| **121.500 MHz** | Bergrettung | AM | Primary aviation-based rescue contact |
| **149.025 MHz** | Freenet CH 1 | FM | Common hiker emergency (Germany) |
| **446.09375 MHz**| PMR CH 8 | 123.0 Hz | Alpine emergency protocol (Ch 8-18) |

### 🇪🇸 Spain
| Frequency | Service | Mode | Description |
| :--- | :--- | :--- | :--- |
| **146.175 MHz** | Protección Civil | FM | REMER Emergency Network (VHF Main) |
| **146.625 MHz** | Protección Civil | FM | REMER Emergency Network (Secondary) |

---

## 🗺️ Other Regions (International)

### 🇺🇸 USA & 🇨🇦 Canada
| Frequency | Service | Tone / Mode | Usage |
| :--- | :--- | :--- | :--- |
| **155.160 MHz** | National SAR | FM | Primary land-based search and rescue |
| **155.800 MHz** | State SAR | FM | Local agency coordination |
| **462.675 MHz** | GMRS CH 20 | 141.3 Hz | Wilderness Protocol Emergency Calling |

### 🇦🇺 Australia & 🇳🇿 New Zealand
| Frequency | Service | Channel | Usage |
| :--- | :--- | :--- | :--- |
| **476.525 MHz** | UHF CB | CH 5 | Emergency Repeater Output (Duplex) |
| **477.275 MHz** | UHF CB | CH 35 | Emergency Repeater Input (Duplex) |

---

## ⚙️ Hardware Implementation Guide (Aegis-Beacon v4.0)

For optimal performance in 2026 rescue environments, configure your device via the Dashboard with these specs:

1. **AM vs FM Alignment**:
   - **Aeronautical (121.5/243 MHz)**: Requires **AM (Amplitude Modulation)**.
   - **Land/Marine SAR**: Requires **NFM (Narrow Band FM)**.
2. **CTCSS (Sub-audio Tones)**:
   - Mandatory for **Canal E (123.0 Hz)** and **Radio Montana (85.4 Hz)**. 
   - Without these tones, emergency repeaters will NOT trigger even with a strong signal.
3. **Scan Parameters**:
   - In **Search Mode**, a threshold of `-105 dBm` is recommended for high-altitude SAR.
   - Set dwell time to at least `400ms` to ensure sub-tone detection.

---

## 📜 Legal Notice
> [!IMPORTANT]
> This database is updated for **May 2026**. Emergency frequencies are subject to local government changes. Transmitting on these bands is strictly for **imminent danger to life**. Misuse is subject to international telecommunication laws and heavy penalties.

---
<div align="center">
  <sub>Document version: 2026.1 | Project: Leo-Galli/Aegis-Beacon</sub>
</div>