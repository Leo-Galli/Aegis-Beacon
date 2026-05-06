# AEGIS-BEACON v3.0 — Technical Datasheet

**Document type:** Hardware & Firmware Technical Reference  
**Revision:** 3.0.0 — May 2025  
**Status:** [![Released](https://img.shields.io/badge/status-released-brightgreen?style=flat-square)](.)

![BEACON mode](https://img.shields.io/badge/BEACON-SOS_TX_on_all_freqs-red?style=flat-square)
![SEARCH mode](https://img.shields.io/badge/SEARCH-RSSI_scan_continuous-blue?style=flat-square)
![Config mode](https://img.shields.io/badge/CONFIG-WiFi_captive_portal-grey?style=flat-square)
![Emergency mode](https://img.shields.io/badge/EMERGENCY-max_power_no_sleep-orange?style=flat-square)

-----

## 1. Product Overview

Aegis-Beacon is a dual-mode avalanche and backcountry rescue beacon based on the ESP32-C3 microcontroller and SX1276 LoRa/FSK transceiver. It operates in two primary modes: **BEACON** (Morse SOS transmitter) and **SEARCH** (RSSI-based frequency scanner), switchable in real time via physical button or WiFi dashboard.

The device is designed for minimal component count, ultra-low cost (~$8 USD), and maximum field reliability. All critical parameters default to safe values if non-volatile storage is empty.

-----

## 2. Electrical Specifications

### 2.1 Absolute Maximum Ratings

|Parameter            |Min |Max |Unit|Notes                          |
|---------------------|----|----|----|-------------------------------|
|Supply voltage (VBUS)|3.0 |5.5 |V   |TP4056 OUT to ESP32-C3 VBUS    |
|Supply voltage (3V3) |2.3 |3.6 |V   |ESP32-C3 LDO output / RA-02 VCC|
|GPIO input voltage   |−0.3|3.6 |V   |Absolute max, not continuous   |
|Operating temperature|−20 |+85 |°C  |Li-ion cell limits lower bound |
|Storage temperature  |−40 |+125|°C  |Without battery                |
|RF output power      |—   |+17 |dBm |RA-02 hardware limit (RFO pin) |


> ⚠️ **Never apply 5 V to the RA-02 VCC pin.** The SX1276 is a 3.3 V device. Applying 5 V will permanently destroy the RF front-end.

-----

### 2.2 DC Characteristics

|Parameter           |Condition                      |Typical  |Unit|
|--------------------|-------------------------------|---------|----|
|Deep sleep current  |ESP32-C3 + SX1276 sleep        |10–15    |µA  |
|Idle current        |ESP32-C3 active, SX1276 standby|25–35    |mA  |
|TX current @ +10 dBm|433 MHz OOK                    |55–65    |mA  |
|TX current @ +17 dBm|433 MHz OOK                    |110–125  |mA  |
|RX / scan current   |FSK receive mode               |35–45    |mA  |
|WiFi AP active      |Config mode, no TX             |90–110   |mA  |
|WiFi AP + TX        |Config mode test TX            |200–240  |mA  |
|3V3 LDO output      |AMS1117-3.3 on SuperMini       |3.28–3.32|V   |
|3V3 LDO max current |—                              |800      |mA  |

-----

### 2.3 Power Budget (BEACON mode, 10 s sleep cycle)

|Phase                                         |Duration|Current |Energy       |
|----------------------------------------------|--------|--------|-------------|
|Boot + init                                   |~120 ms |60 mA   |2.0 mWh      |
|TX “SOS” @ 17 dBm, 13 WPM                     |~2.7 s  |120 mA  |108 mWh*     |
|Deep sleep                                    |~10 s   |0.012 mA|0.0013 mWh   |
|**Cycle total (~12.8 s)**                     |—       |—       |**~110 mWh** |
|**Cycles per hour**                           |~281    |—       |—            |
|**Battery life (2000 mAh × 3.7 V = 7400 mWh)**|—       |—       |**~67 hours**|

* Energy in mWh normalised to 3.3 V supply.

-----

## 3. RF Specifications

### 3.1 Transmitter

|Parameter                  |Value               |Unit|Notes                             |
|---------------------------|--------------------|----|----------------------------------|
|Modulation                 |OOK (On-Off Keying) |—   |Via RadioLib `setOOK(true)`       |
|Frequency range            |137 – 1020          |MHz |SX1276 hardware limit             |
|Typical operating frequency|433.500             |MHz |ISM-EU default                    |
|Output power range         |+2 to +17           |dBm |Software configurable             |
|Frequency resolution       |61                  |Hz  |SX1276 PLL step                   |
|Frequency accuracy         |±2.5                |kHz |TCXO-less; varies with temperature|
|Spurious emissions         |< −36               |dBm |SX1276 datasheet §6.3             |
|Antenna connector          |PCB pad             |—   |Solder wire directly to ANT pad   |
|Recommended antenna        |¼-wave wire monopole|—   |17.3 cm @ 433 MHz                 |

### 3.2 Receiver (SEARCH mode)

|Parameter                  |Value      |Unit|Notes                                |
|---------------------------|-----------|----|-------------------------------------|
|Modulation                 |FSK receive|—   |250 kHz bandwidth for drift tolerance|
|RSSI range                 |−120 to −10|dBm |SX1276 RSSI register                 |
|RSSI accuracy              |±1.5       |dB  |Per SX1276 datasheet                 |
|Noise floor (typical)      |−110       |dBm |At 433 MHz, 250 kHz BW               |
|Default detection threshold|−90        |dBm |Configurable −120 to −40 dBm         |
|Scan dwell time            |100 – 5000 |ms  |Per frequency, configurable          |
|Sensitivity improvement    |+6 dB      |—   |Narrow BW mode (future update)       |

### 3.3 Frequency Plan (Default)

|Frequency      |Band         |Region        |Notes                             |
|---------------|-------------|--------------|----------------------------------|
|**433.500 MHz**|70 cm UHF ISM|EU / Worldwide|Default; licence-free EU          |
|434.500 MHz    |70 cm UHF ISM|EU            |Secondary ISM                     |
|868.000 MHz    |868 MHz ISM  |EU            |LoRa band EU868                   |
|915.000 MHz    |915 MHz ISM  |NA / AU       |LoRa band US915                   |
|121.500 MHz    |VHF          |Worldwide     |Aviation emergency (add manually) |
|156.800 MHz    |VHF Marine   |Worldwide     |Channel 16 distress (add manually)|

-----

## 4. Microcontroller Specifications

### 4.1 ESP32-C3 SuperMini

|Parameter         |Value                              |
|------------------|-----------------------------------|
|Core              |Single-core RISC-V @ 160 MHz       |
|Flash             |4 MB (QIO)                         |
|SRAM              |400 KB                             |
|RTC memory        |8 KB (survives deep sleep)         |
|WiFi              |802.11 b/g/n, 2.4 GHz              |
|Bluetooth         |BLE 5.0                            |
|Deep sleep current|~5 µA (CPU off, RTC on)            |
|USB               |USB-C, CDC ACM (no UART chip)      |
|Operating voltage |3.0 – 3.6 V                        |
|GPIO count        |22 total, 12 freely usable         |
|ADC               |12-bit, channels 0–4               |
|SPI               |Hardware HSPI: SCK, MOSI, MISO + CS|
|Dimensions        |~22 × 18 mm                        |

### 4.2 RTC Memory Layout (survives deep sleep)

|Variable           |Size               |Purpose                                   |
|-------------------|-------------------|------------------------------------------|
|`g_bootCycle`      |uint32             |Total boot/wake cycles since factory reset|
|`g_txCycles`       |uint32             |Total BEACON TX cycles                    |
|`g_scanCycles`     |uint32             |Total SEARCH scan passes                  |
|`g_scanHits[20]`   |20 × ScanHit struct|Rolling log of last 20 detections         |
|`g_scanHitCount`   |uint8              |Number of valid entries in g_scanHits     |
|`g_currentMode`    |enum (uint8)       |Active operating mode                     |
|`g_emergencyActive`|bool               |Emergency SOS flag                        |

-----

## 5. NVS (Non-Volatile Storage) Map

All settings stored in NVS namespace `"aegis"`.

|Key      |Type  |Default|Range             |Description                         |
|---------|------|-------|------------------|------------------------------------|
|`fcount` |uint8 |1      |1–10              |Number of configured frequencies    |
|`f0`…`f9`|float |433.500|137.0–1020.0      |Frequency N in MHz                  |
|`msg`    |string|`"SOS"`|1–63 chars        |Morse message                       |
|`wpm`    |uint8 |13     |5–30              |Words per minute                    |
|`pwr`    |int8  |17     |2–17              |TX power in dBm                     |
|`sleep`  |uint32|10     |1–3600            |Deep sleep seconds between cycles   |
|`dwell`  |uint16|400    |100–5000          |RSSI scan dwell per frequency (ms)  |
|`rssi`   |int8  |−90    |−120 to −40       |Detection threshold (dBm)           |
|`mode`   |uint8 |0      |0=BEACON, 1=SEARCH|Last selected mode                  |
|`aswitch`|bool  |false  |—                 |Auto-switch to BEACON if low battery|
|`rep`    |uint8 |1      |1–5               |Message repeats per cycle           |
|`egps`   |bool  |false  |—                 |Reserved: GPS coordinate append     |

**Factory reset:** Hold both SW_MODE + SW_CONFIG at boot for 5 s. Clears all NVS keys and resets RTC variables.

-----

## 6. SPI Interface

The SX1276 is connected via ESP32-C3 hardware SPI (HSPI peripheral).

|SPI Parameter     |Value                      |
|------------------|---------------------------|
|Mode              |SPI Mode 0 (CPOL=0, CPHA=0)|
|Clock frequency   |8 MHz (RadioLib default)   |
|Bit order         |MSB first                  |
|CS polarity       |Active LOW                 |
|Max clock (SX1276)|10 MHz                     |

**SPI initialisation in firmware:**

```cpp
SPIClass lora_spi(HSPI);
lora_spi.begin(PIN_SPI_SCK, PIN_SPI_MISO, PIN_SPI_MOSI, PIN_LORA_CS);
```

-----

## 7. Pin Assignment Table

### Complete GPIO Map — ESP32-C3 SuperMini

|GPIO   |Direction|Function         |Pull   |Notes                          |
|-------|---------|-----------------|-------|-------------------------------|
|GPIO 1 |Input    |SW_CONFIG button |Pull-up|Active LOW when pressed        |
|GPIO 2 |Input    |SX1276 DIO0 (IRQ)|—      |TX/RX Done interrupt           |
|GPIO 3 |Output   |SX1276 RESET     |—      |Active LOW, 100 µs pulse       |
|GPIO 4 |Output   |SPI SCK          |—      |SX1276 clock                   |
|GPIO 5 |Input    |SPI MISO         |—      |SX1276 data out                |
|GPIO 6 |Output   |SPI MOSI         |—      |SX1276 data in                 |
|GPIO 7 |Output   |SPI CS (NSS)     |—      |Active LOW chip select         |
|GPIO 8 |Output   |LED_RED          |—      |BEACON mode indicator          |
|GPIO 9 |Input    |SW_MODE / BOOT   |Pull-up|Active LOW; also ESP32 boot pin|
|GPIO 10|Input    |SX1276 DIO1      |—      |RX timeout (SEARCH mode)       |
|GPIO 20|Output   |LED_BLUE         |—      |SEARCH mode indicator          |

**Note:** GPIO9 doubles as the ESP32-C3 BOOT pin. Holding it LOW during power-on forces the device into USB DFU bootloader mode. This is the same pin used as SW_MODE — holding it during normal operation is safe; holding it **at power-on** triggers bootloader entry. The firmware detects this as a long button hold only after setup() starts.

-----

## 8. Firmware Architecture

### 8.1 Execution Flow

```
setup()
  │
  ├─ Serial.begin(115200)
  ├─ g_bootCycle++
  ├─ Print boot banner + diagnostics
  ├─ pinMode() all GPIOs
  ├─ attachInterrupt(SW_MODE, SW_CONFIG)
  ├─ esp_task_wdt_init(30s)
  ├─ Check both buttons → factoryReset() ?
  ├─ loadConfig() from NVS
  ├─ Check SW_CONFIG held → runConfigMode() ?
  ├─ Restore g_currentMode from RTC RAM
  │
  └─ switch(g_currentMode)
       ├─ MODE_BEACON    → runBeaconMode(false)
       ├─ MODE_EMERGENCY → runBeaconMode(true)
       ├─ MODE_SEARCH    → runSearchMode()
       └─ MODE_CONFIG    → runConfigMode()
```

### 8.2 BEACON Mode Flow

```
runBeaconMode()
  │
  ├─ WiFi.mode(WIFI_OFF) + btStop()
  ├─ g_txCycles++
  │
  └─ for fi in cfg.freqs[]:
       ├─ initRadioOOK(freqs[fi], powerDbm)
       │    └─ lora_spi.begin(...)
       │    └─ radio.beginFSK(...)
       │    └─ radio.setOOK(true)
       │
       ├─ for rep in repeatCount:
       │    └─ transmitMessage(cfg.message)
       │         └─ for each char: transmitMorseChar()
       │              └─ txOn() / delay() / txOff()
       │         └─ check g_modeButtonPressed → abort?
       │
       └─ radio.standby() + delay(50ms)
  │
  ├─ radio.sleep()
  └─ esp_deep_sleep(sleepSec × 1e6)
```

### 8.3 SEARCH Mode Flow

```
runSearchMode()
  │
  ├─ WiFi.mode(WIFI_OFF) + btStop()
  ├─ g_scanCycles++
  │
  └─ loop forever:
       └─ for fi in cfg.freqs[]:
            ├─ check buttons → mode switch?
            ├─ initRadioFSK(freqs[fi])
            ├─ radio.startReceive()
            ├─ measure peak RSSI over dwellMs
            ├─ radio.standby()
            ├─ print ASCII RSSI bar to Serial
            ├─ if rssi >= threshold:
            │    └─ recordScanHit(freq, rssi)
            │    └─ blinkLed(BLUE, 2–5 times)
            └─ esp_task_wdt_reset()
```

### 8.4 Watchdog

A 30-second hardware watchdog (`esp_task_wdt`) is enabled in setup(). `esp_task_wdt_reset()` is called:

- Between each frequency in BEACON mode
- Between each frequency in SEARCH mode
- During button hold waits
- In the CONFIG mode server loop (every cycle)

If the device hangs for any reason, the WDT resets it within 30 seconds.

-----

## 9. Morse Code Reference

### 9.1 Alphabet & Numbers

|Char|Morse |Char|Morse |Char|Morse |
|----|------|----|------|----|------|
|A   |`.-`  |J   |`.---`|S   |`...` |
|B   |`-...`|K   |`-.-` |T   |`-`   |
|C   |`-.-.`|L   |`.-..`|U   |`..-` |
|D   |`-..` |M   |`--`  |V   |`...-`|
|E   |`.`   |N   |`-.`  |W   |`.--` |
|F   |`..-.`|O   |`---` |X   |`-..-`|
|G   |`--.` |P   |`.--.`|Y   |`-.--`|
|H   |`....`|Q   |`--.-`|Z   |`--..`|
|I   |`..`  |R   |`.-.` |    |      |

|Char|Morse  |Char|Morse  |
|----|-------|----|-------|
|0   |`-----`|5   |`.....`|
|1   |`.----`|6   |`-....`|
|2   |`..---`|7   |`--...`|
|3   |`...--`|8   |`---..`|
|4   |`....-`|9   |`----.`|

### 9.2 Timing at Common WPM Settings

|WPM   |Unit (ms)|Dot (ms)|Dash (ms)|Inter-char (ms)|Word gap (ms)|
|------|---------|--------|---------|---------------|-------------|
|5     |240      |240     |720      |720            |1680         |
|8     |150      |150     |450      |450            |1050         |
|**13**|**92**   |**92**  |**277**  |**277**        |**646**      |
|18    |67       |67      |200      |200            |467          |
|25    |48       |48      |144      |144            |336          |
|30    |40       |40      |120      |120            |280          |

**“SOS” duration by WPM:**

|WPM   |S (ms) |O (ms) |S (ms) |Total (ms)|
|------|-------|-------|-------|----------|
|8     |750    |1350   |750    |~3.6 s    |
|**13**|**460**|**830**|**460**|**~2.7 s**|
|18    |334    |600    |334    |~2.0 s    |

-----

## 10. Web Dashboard API

The CONFIG mode web server exposes the following HTTP endpoints:

|Method|Endpoint    |Description                              |Response          |
|------|------------|-----------------------------------------|------------------|
|`GET` |`/`         |Serve full dashboard HTML                |`text/html`       |
|`GET` |`/config`   |Get current config as JSON               |`application/json`|
|`GET` |`/status`   |Get runtime status (cycles, heap, uptime)|`application/json`|
|`GET` |`/hits`     |Get scan hit history                     |`application/json`|
|`GET` |`/clearhits`|Clear scan hit history                   |`text/plain "OK"` |
|`GET` |`/test`     |Transmit single SOS test burst           |`text/plain "OK"` |
|`GET` |`/testscan` |Scan all frequencies, return RSSI        |`application/json`|
|`GET` |`/emergency`|Activate EMERGENCY mode and reboot       |`text/plain`      |
|`POST`|`/save`     |Save config JSON body to NVS and reboot  |`text/plain "OK"` |
|`GET` |`/*`        |Redirect to `/` (captive portal)         |`302 redirect`    |

### POST /save — Request Body

```json
{
  "message":    "SOS",
  "wpm":        13,
  "power":      17,
  "sleep":      10,
  "dwell":      400,
  "rssiThresh": -90,
  "repeat":     1,
  "autoSwitch": false,
  "mode":       "BEACON",
  "freqs":      [433.500, 434.500, 868.000]
}
```

### GET /status — Response

```json
{
  "bootCycle":  42,
  "txCycles":   37,
  "scanCycles": 5,
  "scanHits":   3,
  "freeHeap":   296420,
  "uptime":     185432,
  "mode":       "BEACON",
  "emergency":  false
}
```

### GET /hits — Response

```json
{
  "hits": [
    { "freq": 433.5, "rssi": -87, "label": "MEDIUM", "ts": 42381 },
    { "freq": 434.5, "rssi": -62, "label": "STRONG", "ts": 85210 }
  ]
}
```

-----

## 11. Error Codes

### RadioLib State Codes

|Code|Constant                  |Meaning               |Fix                         |
|----|--------------------------|----------------------|----------------------------|
|0   |`RADIOLIB_ERR_NONE`       |Success               |—                           |
|−1  |`ERR_UNKNOWN`             |Unknown error         |Check hardware              |
|−2  |`ERR_CHIP_NOT_FOUND`      |SX1276 not responding |Check SPI wiring; verify VCC|
|−7  |`ERR_SPI_CMD_TIMEOUT`     |SPI timeout           |Check solder joints on RA-02|
|−100|`ERR_INVALID_FREQUENCY`   |Frequency out of range|Use 137–1020 MHz            |
|−102|`ERR_INVALID_OUTPUT_POWER`|Power out of range    |Use 2–17 dBm for RA-02      |

### Firmware Debug Codes (Serial Log)

|Message                        |Severity|Cause                        |Action                      |
|-------------------------------|--------|-----------------------------|----------------------------|
|`NVS empty or corrupt`         |WARN    |First boot / factory reset   |Normal — configure via AP   |
|`Radio init FAILED`            |ERROR   |SPI failure                  |Check wiring table §7       |
|`TX interrupted by MODE button`|WARN    |Button pressed mid-TX        |Intentional                 |
|`EMERGENCY SOS activated`      |WARN    |Long button press / dashboard|Intentional                 |
|`Config AP timeout`            |WARN    |No connection in 5 min       |Normal — rebooting to beacon|
|`loop() called unexpectedly`   |ERROR   |Firmware logic error         |Check for infinite loop     |

-----

## 12. Mechanical Specification

|Parameter                        |Value                             |
|---------------------------------|----------------------------------|
|Recommended enclosure            |Hammond 1551 (60 × 35 × 20 mm)    |
|PCB area (estimated)             |55 × 30 mm                        |
|Total weight (incl. 18650)       |~50 g                             |
|IP rating (with sealed enclosure)|IP54 (splash-proof minimum)       |
|Operating temperature            |−20 °C to +60 °C (Li-ion limited) |
|Cold-weather recommendation      |LiFePO4 18650 for −30 °C operation|

-----

## 13. Revision History

|Version  |Date    |Changes                                                                                                                                                   |
|---------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
|**3.0.0**|May 2025|Dual-mode BEACON/SEARCH; interrupt-driven buttons; emergency mode; full dashboard with scan history; watchdog; RTC state persistence; verbose debug system|
|2.0.0    |Apr 2025|Full serial debug system; minimal BOM (ESP32-C3 SuperMini); updated to RA-02 module                                                                       |
|1.0.0    |Mar 2025|Initial release; BEACON-only; ESP32-WROOM-32E; basic dashboard                                                                                            |

-----

## 14. References

|Resource                    |URL                                                                                                   |
|----------------------------|------------------------------------------------------------------------------------------------------|
|SX1276 Datasheet            |https://www.semtech.com/uploads/documents/DS_SX1276-7-8-9_W_APP_V7.pdf                                |
|ESP32-C3 Technical Reference|https://www.espressif.com/sites/default/files/documentation/esp32-c3_technical_reference_manual_en.pdf|
|RadioLib Library            |https://github.com/jgromes/RadioLib                                                                   |
|ArduinoJson Library         |https://arduinojson.org                                                                               |
|AI-Thinker RA-02 Datasheet  |http://wiki.ai-thinker.com/lora/ra-02                                                                 |
|TP4056 Datasheet            |https://dlnmh9ip6v2uc.cloudfront.net/datasheets/Prototyping/TP4056.pdf                                |
|PARIS Morse Timing Standard |https://en.wikipedia.org/wiki/Morse_code#Timing                                                       |
|ISM Band Regulations EU     |https://www.etsi.org/deliver/etsi_en/300200_300299/30022002/03.02.01_60/en_30022002v030201p.pdf       |

-----

*Aegis-Beacon v3.0 — Technical Datasheet — Revision 3.0.0 — May 2025*  
*MIT License — See LICENSE file for full terms*