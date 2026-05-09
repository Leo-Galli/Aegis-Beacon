// =============================================================================
//
//  █████╗ ███████╗ ██████╗ ██╗███████╗    ██████╗ ███████╗ █████╗  ██████╗ ██████╗ ███╗   ██╗
// ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║
// ███████║█████╗  ██║  ███╗██║███████╗    ██████╔╝█████╗  ███████║██║     ██║   ██║██╔██╗ ██║
// ██╔══██║██╔══╝  ██║   ██║██║╚════██║    ██╔══██╗██╔══╝  ██╔══██║██║     ██║   ██║██║╚██╗██║
// ██║  ██║███████╗╚██████╔╝██║███████║    ██████╔╝███████╗██║  ██║╚██████╗╚██████╔╝██║ ╚████║
// ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚═╝  ╚═══╝
//
// =============================================================================
//  PROJECT   : Aegis-Beacon v5.3 — Dual-Mode Avalanche Rescue System
//              SSD1309 2.42" OLED (SPI/U8g2) | GPS payload | Button controls
//  MODES     : BEACON (TX SOS + name + GPS coords) ←→ SEARCH (scan + audio)
//  TARGET HW : ESP32 DevKit V1 (30-pin)
//              + Ebyte E22-400M30S / LLCC68 SX1262 (433MHz)
//              + SSD1309 2.42" 128×64 OLED (7-pin SPI)
//              + NEO-6M GPS module (UART)
//              + 3× tactile buttons (MODE, ADJ-SELECT, ADJ-UP, ADJ-DN)
//  REPO      : https://github.com/Leo-Galli/Aegis-Beacon
//  FRAMEWORK : Arduino / PlatformIO
//  DEPS      : RadioLib >= 6.x | ArduinoJson >= 7.x | U8g2 >= 2.34
//              TinyGPS++ >= 1.0.3
//  LICENSE   : MIT — Use freely, save lives.
// =============================================================================
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                   BOM v5.1 — ~$20-25 USD                                  │
// ├────┬──────────────────────────────┬──────────┬──────────────────────────  │
// │Ref │ Part                         │ Cost USD │ Notes                      │
// ├────┼──────────────────────────────┼──────────┼──────────────────────────  │
// │ U1 │ ESP32 DevKit V1 (30-pin)     │  $3.00   │ Built-in USB+LDO           │
// │ U2 │ Ebyte E22-400M30S (SX1262)   │  $5.50   │ 433MHz, 30dBm, SMA ant     │
// │    │ (or any SX1262/LLCC68 module)│          │ BUSY pin required          │
// │ U3 │ SSD1309 2.42" OLED 128×64    │  $3.50   │ SPI 7-pin                  │
// │ U4 │ NEO-6M GPS module            │  $4.50   │ UART 9600 baud, ceramic ant│
// │ RV1│ 10kΩ potentiometer (×2)      │  $0.40   │ Volume + WPM knobs         │
// │ B1 │ 18650 Li-ion 3.7V            │  $1.50   │ Any brand                  │
// │ IC1│ TP4056 USB-C module          │  $0.50   │ Charge + protection        │
// │ J1 │ 3.5mm TRRS audio jack        │  $0.30   │ Panel-mount, 4-pole        │
// │ SW1│ Tactile switch 6×6mm (×4)    │  $0.20   │ MODE + SEL + UP + DN       │
// │ C1 │ 100µF 10V electrolytic       │  $0.05   │ Bulk cap 3.3V              │
// │ C2 │ 100nF ceramic 0805 (×2)      │  $0.04   │ Decoupling                 │
// │ C3 │ 10µF 10V electrolytic        │  $0.03   │ Audio output filter        │
// │ R1 │ 330Ω 0805 (×2)               │  $0.02   │ LED limiters               │
// │ R2 │ 100Ω 0805                    │  $0.01   │ Audio output series R      │
// │ D1 │ Red LED 3mm                  │  $0.05   │ BEACON indicator           │
// │ D2 │ Blue LED 3mm                 │  $0.05   │ SEARCH indicator           │
// │ANT │ 17.3cm wire                  │  $0.00   │ ¼-wave 433MHz              │
// │BOX │ Hammond 1593L / 3D PLA       │  $3.00   │ 100×60×25mm (GPS fits too) │
// ├────┴──────────────────────────────┼──────────┼──────────────────────────  │
// │                            TOTAL  │ ~$23-28  │                            │
// └───────────────────────────────────┴──────────┴─────────────────────────── ┘
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  RADIO WIRING — SX1262 (Ebyte E22-400M30S) ↔ ESP32 DevKit V1 (VSPI)      │
// ├────────────────┬─────────────────┬─────────────────────────────────────  │
// │  SX1262 Pin    │  ESP32 GPIO     │  Notes                                │
// ├────────────────┼─────────────────┼─────────────────────────────────────  │
// │  VCC           │  3V3            │  3.3V only                            │
// │  GND           │  GND            │                                       │
// │  SCK           │  GPIO 18        │  VSPI SCK                             │
// │  MISO          │  GPIO 19        │  VSPI MISO                            │
// │  MOSI          │  GPIO 23        │  VSPI MOSI                            │
// │  NSS / CS      │  GPIO 5         │  Chip Select (active LOW)             │
// │  RESET         │  GPIO 14        │  Hardware reset (active LOW)          │
// │  BUSY          │  GPIO 21        │  BUSY output — MUST be connected      │
// │  DIO1          │  GPIO 2         │  IRQ — TX/RX done, timeout            │
// │  TXEN          │  -1 (N/C)       │  TX enable — pulled HI internally     │
// │                │                 │  on E22; pass -1 to RadioLib          │
// │  RXEN          │  -1 (N/C)       │  RX enable — same as above            │
// └────────────────┴─────────────────┴─────────────────────────────────────  ┘
//
//  CRITICAL — SX1262 vs SX1276 differences:
//  1. BUSY pin is MANDATORY. The SX1262 holds BUSY HIGH while processing any
//     command. RadioLib polls BUSY before every SPI transaction. If BUSY is
//     not wired, all radio operations will hang or fail silently.
//  2. DIO1 is the main IRQ line (was DIO0 on SX1276). Wire DIO1, not DIO0.
//  3. SX1262 does NOT support OOK modulation. Morse keying is implemented via
//     manual FSK carrier on/off: txOn() calls transmitDirect() (continuous
//     unmodulated carrier), txOff() calls standby(). This produces a clean
//     CW-style signal identical to OOK from the receiver's perspective.
//  4. Maximum output power: SX1262 supports up to +22 dBm (E22-400M30S: 30
//     dBm with onboard PA). RadioLib caps at 22 dBm; module PA adds the rest.
//  5. Frequency accuracy is better than SX1276: TCXO on E22 modules.
//  6. Current draw in RX: ~5 mA (vs ~12 mA for SX1276) — better for battery.
// ├────────────────┬─────────────────┬─────────────────────────────────────  │
// │  OLED Pin      │  ESP32 GPIO     │  Notes                                │
// ├────────────────┼─────────────────┼─────────────────────────────────────  │
// │  GND           │  GND            │                                       │
// │  VCC           │  3V3            │  3.3V only                            │
// │  SCK (D0)      │  GPIO 15        │  Software SPI clock                   │
// │  SDA (D1/MOSI) │  GPIO 13        │  Software SPI data                    │
// │  RES (RESET)   │  GPIO 4         │  Hardware reset                       │
// │  DC (A0)       │  GPIO 16        │  Data / Command select                │
// │  CS            │  GPIO 17        │  Chip Select (active LOW)             │
// └────────────────┴─────────────────┴─────────────────────────────────────  ┘
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  GPS WIRING — NEO-6M ↔ ESP32 DevKit V1 (UART2)                           │
// ├────────────────┬─────────────────┬─────────────────────────────────────  │
// │  GPS Pin       │  ESP32 GPIO     │  Notes                                │
// ├────────────────┼─────────────────┼─────────────────────────────────────  │
// │  VCC           │  3V3            │  3.3V (some modules: 5V tolerable)    │
// │  GND           │  GND            │                                       │
// │  TX            │  GPIO 34        │  GPS TX → ESP RX (input only)         │
// │  RX            │  GPIO 12        │  GPS RX ← ESP TX                      │
// └────────────────┴─────────────────┴─────────────────────────────────────  ┘
//  GPS uses HardwareSerial(2) — Serial2 — at 9600 baud (NEO-6M default).
//  GPIO34 is input-only on ESP32 — perfect for GPS RX data.
//  Time to first fix: ~30s (hot), up to 3 min (cold). The BEACON loop waits
//  up to GPS_FIX_TIMEOUT_S seconds at startup if GPS is enabled.
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  BUTTON CONTROLS — 3-button adjustment system ↔ ESP32 DevKit V1          │
// ├────────────────┬─────────────────┬─────────────────────────────────────  │
// │  Button        │  ESP32 GPIO     │  Notes                                │
// ├────────────────┼─────────────────┼─────────────────────────────────────  │
// │  SW_MODE       │  GPIO 33        │  short=toggle mode, long2s=emergency  │
// │  SW_SEL        │  GPIO 32        │  short=toggle VOL/WPM, long3s=config  │
// │  SW_UP         │  GPIO 35        │  increment selected parameter         │
// │  SW_DN         │  GPIO 34        │  decrement selected parameter         │
// └────────────────┴─────────────────┴─────────────────────────────────────  ┘
//  SW_UP and SW_DOWN use INPUT_PULLUP. Each press changes value by one step:
//  Volume step: +/- 10 (range 20-255). WPM step: +/- 1 (range 5-40).
//  Hold UP or DN for auto-repeat after 500 ms, every 150 ms.
//  The selected parameter (VOL / WPM) is shown on the OLED status bar.
//  GPIO 34 and 35 are input-only on ESP32 — suitable for button inputs
//  with internal pullup and external 10kΩ pullup if needed.
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  AUDIO JACK WIRING — 3.5mm TRRS ↔ ESP32 DevKit V1                        │
// ├────────────────┬─────────────────┬─────────────────────────────────────  │
// │  Jack Pin      │  ESP32 GPIO     │  Notes                                │
// ├────────────────┼─────────────────┼─────────────────────────────────────  │
// │  Tip (L audio) │  GPIO 25 (DAC1) │  via 100Ω + 10µF AC-coupling cap      │
// │  Ring1 (R)     │  GPIO 25 (DAC1) │  tie Tip+Ring1 for mono output        │
// │  Ring2 (MIC)   │  N/C            │                                       │
// │  Sleeve (GND)  │  GND            │  audio ground                         │
// └────────────────┴─────────────────┴─────────────────────────────────────  ┘
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  COMPLETE PIN MAP — ESP32 DevKit V1 (30-pin) v5.3                        │
// ├────────────┬───────────────────────────────────────────────────────────  │
// │  GPIO  2   │  SX1262 DIO1 (TX/RX Done / Timeout IRQ)                     │
// │  GPIO  4   │  OLED RESET                                                 │
// │  GPIO  5   │  SX1262 NSS/CS (VSPI, active LOW)                           │
// │  GPIO 12   │  GPS TX ← ESP32 Serial2 TX                                  │
// │  GPIO 13   │  OLED SDA (D1/MOSI) — software SPI                          │
// │  GPIO 14   │  SX1262 RESET (active LOW)                                  │
// │  GPIO 15   │  OLED SCK (D0) — software SPI                               │
// │  GPIO 16   │  OLED DC (Data/Command)                                     │
// │  GPIO 17   │  OLED CS (Chip Select)                                      │
// │  GPIO 18   │  SPI SCK → SX1262 SCK (VSPI)                                │
// │  GPIO 19   │  SPI MISO ← SX1262 MISO (VSPI)                              │
// │  GPIO 21   │  SX1262 BUSY ← (input, must be wired!)                      │
// │  GPIO 23   │  SPI MOSI → SX1262 MOSI (VSPI)                              │
// │  GPIO 25   │  DAC1 audio output → 100Ω → 10µF → 3.5mm jack TIP           │
// │  GPIO 26   │  LED_BLUE (SEARCH mode indicator, 330Ω)                     │
// │  GPIO 27   │  LED_RED  (BEACON mode indicator, 330Ω)                     │
// │  GPIO 32   │  SW_SEL  (short=toggle VOL/WPM, long3s=WiFi AP)             │
// │  GPIO 33   │  SW_MODE (short=toggle mode, long2s=emergency)              │
// │  GPIO 34   │  SW_DN   — decrement selected parameter (input-only)        │
// │  GPIO 35   │  SW_UP   — increment selected parameter (input-only)        │
// │  GPIO 22   │  GPS RX ← NEO-6M TX  (input-only, SVP)                      │
// └────────────┴───────────────────────────────────────────────────────────  ┘
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  MORSE BEACON PAYLOAD FORMAT (GPS + name enabled)                        │
// │                                                                          │
// │  WITHOUT GPS/NAME : "SOS"                                                │
// │  WITH NAME only   : "SOS DE MARIO ROSSI"                                 │
// │  WITH GPS only    : "SOS PSN N4553 E01230"                               │
// │  WITH BOTH        : "SOS DE MARIO ROSSI PSN N4553 E01230"                │
// │                                                                          │
// │  Coordinates use truncated DDM (degrees + decimal minutes × 100) to      │
// │  keep message short in Morse. Full coordinates logged on Serial.         │
// │  Receiver can decode: N4553 = 45.53° N, E01230 = 12.30° E                │
// └──────────────────────────────────────────────────────────────────────────┘
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  SCREEN LAYOUTS — 128×64 SSD1309 2.42"                                   │
// ├──────────────┬─────────────────────────────────────────────────────────  │
// │  BOOT        │  Logo splash + INITIALISING bar                           │
// │  BEACON      │  Header | Big freq | TX bar | Message+WPM | GPS fix status│
// │  SEARCH      │  Header | Big freq | RSSI segbar | Signal label | History │
// │  EMERGENCY   │  Full-screen alternating inverse | Giant SOS              │
// │  CONFIG      │  WiFi SSID + IP + steps                                   │
// │  GPS WAIT    │  Sat count + fix progress + coordinates (if found)        │
// └──────────────┴─────────────────────────────────────────────────────────  │
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// LIBRARY DEPENDENCIES
// Arduino IDE → Library Manager:
//   • RadioLib      by Jan Gromes        >= 6.0.0
//   • ArduinoJson   by Benoît Blanchon   >= 7.0.0
//   • U8g2          by oliver            >= 2.34.0
//   • TinyGPS++     by Mikal Hart        >= 1.0.3
//
// PlatformIO (platformio.ini):
//   lib_deps =
//     jgromes/RadioLib @ ^6.6.0
//     bblanchon/ArduinoJson @ ^7.0.0
//     olikraus/U8g2 @ ^2.34.0
//     mikalhart/TinyGPSPlus @ ^1.0.3
// ─────────────────────────────────────────────────────────────────────────────
#include <Arduino.h>
#include <RadioLib.h>
#include <Preferences.h>
#include <WiFi.h>
#include <DNSServer.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <U8g2lib.h>
#include <TinyGPSPlus.h>
#include "esp_sleep.h"
#include "esp_task_wdt.h"

// =============================================================================
// DEBUG SYSTEM
// =============================================================================
#define DEBUG_VERBOSE  0

#define C_RESET   "\033[0m"
#define C_BOLD    "\033[1m"
#define C_CYAN    "\033[36m"
#define C_GREEN   "\033[32m"
#define C_YELLOW  "\033[33m"
#define C_RED     "\033[31m"
#define C_MAGENTA "\033[35m"
#define C_BLUE    "\033[34m"
#define C_GRAY    "\033[90m"
#define C_WHITE   "\033[97m"

#define LOG_INFO(fmt,...)   Serial.printf(C_CYAN    "[%8lu][INFO ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_OK(fmt,...)     Serial.printf(C_GREEN   "[%8lu][OK   ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_WARN(fmt,...)   Serial.printf(C_YELLOW  "[%8lu][WARN ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_ERR(fmt,...)    Serial.printf(C_RED     "[%8lu][ERROR] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_MODE(fmt,...)   Serial.printf(C_MAGENTA "[%8lu][MODE ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_SCAN(fmt,...)   Serial.printf(C_BLUE    "[%8lu][SCAN ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_BTN(fmt,...)    Serial.printf(C_WHITE   "[%8lu][BTN  ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_CFG(fmt,...)    Serial.printf(C_WHITE   "[%8lu][CFG  ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_OLED(fmt,...)   Serial.printf(C_MAGENTA "[%8lu][OLED ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_AUDIO(fmt,...)  Serial.printf(C_GREEN   "[%8lu][AUDIO] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_GPS(fmt,...)    Serial.printf(C_CYAN    "[%8lu][GPS  ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_POT(fmt,...)    Serial.printf(C_GRAY    "[%8lu][POT  ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)

#if DEBUG_VERBOSE
  #define LOG_MORSE(fmt,...) Serial.printf(C_GRAY "[%8lu][MORSE] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
  #define LOG_RF(fmt,...)    Serial.printf(C_GRAY "[%8lu][RF   ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#else
  #define LOG_MORSE(fmt,...) do{}while(0)
  #define LOG_RF(fmt,...)    do{}while(0)
#endif

void dbSep(const char* lbl = nullptr) {
  if (lbl) Serial.printf(C_GRAY "─────── %s ───────\n" C_RESET, lbl);
  else      Serial.println(C_GRAY "────────────────────────────────────────────" C_RESET);
}

void dbBanner(const char* mode) {
  Serial.println(C_BOLD C_CYAN
    "\n╔══════════════════════════════════════════════════════════╗\n"
    "║  AEGIS-BEACON v5.3 — SX1262 + GPS + BTN + SSD1309       ║\n"
    "║      https://github.com/Leo-Galli/Aegis-Beacon           ║\n"
    "╚══════════════════════════════════════════════════════════╝" C_RESET);
  Serial.printf(C_YELLOW "    Active mode: %s\n\n" C_RESET, mode);
}

// =============================================================================
// HARDWARE PINS  (Standard ESP32 DevKit V1 — 30-pin)
// =============================================================================

// ── SPI Radio (SX1262 / Ebyte E22-400M30S) — VSPI ───────────────────────────
// SX1262 requires a BUSY pin — RadioLib polls it before every SPI transfer.
// DIO1 is the primary IRQ line on SX1262 (was DIO0 on SX1276).
// TXEN and RXEN are pulled internally on E22 modules — pass -1 (not wired).
#define PIN_SPI_SCK    18
#define PIN_SPI_MISO   19
#define PIN_SPI_MOSI   23
#define PIN_LORA_CS    5
#define PIN_LORA_RST   14
#define PIN_LORA_BUSY  21   // MANDATORY on SX1262 — do not leave unconnected
#define PIN_LORA_DIO1  2    // Main IRQ (TX done, RX done, timeout)
#define PIN_LORA_TXEN  -1   // TX enable — N/C on E22 (internal pull)
#define PIN_LORA_RXEN  -1   // RX enable — N/C on E22 (internal pull)

// ── OLED SSD1309 2.42" — software SPI (U8g2) ────────────────────────────────
#define PIN_OLED_SCK   15
#define PIN_OLED_SDA   13
#define PIN_OLED_RES   4
#define PIN_OLED_DC    16
#define PIN_OLED_CS    17

// ── GPS NEO-6M — UART2 ───────────────────────────────────────────────────────
#define PIN_GPS_RX     22   // input-only GPIO (SVP), GPS TX → ESP RX
#define PIN_GPS_TX     12   // ESP TX → GPS RX
#define GPS_BAUD       9600
#define GPS_SERIAL     Serial2
#define GPS_FIX_TIMEOUT_S  60   // max seconds to wait for GPS fix on boot
#define GPS_MIN_SATS   3        // minimum satellites to consider fix valid

// ── Buttons — adjustment controls ────────────────────────────────────────────
// GPIO 34 and 35 are input-only; use external 10kΩ pull-up resistors if
// the internal INPUT_PULLUP is insufficient (some ESP32 modules vary).
#define PIN_SW_UP      35   // increment selected parameter (VOL or WPM)
#define PIN_SW_DN      34   // decrement selected parameter (VOL or WPM)

// Adjustment button auto-repeat
#define BTN_REPEAT_DELAY_MS  500   // hold time before auto-repeat starts
#define BTN_REPEAT_RATE_MS   150   // interval between repeats when held

// Volume / WPM adjustment steps
#define ADJ_VOL_STEP   10
#define ADJ_WPM_STEP   1
#define ADJ_VOL_MIN    20
#define ADJ_VOL_MAX    255
#define ADJ_WPM_MIN    5
#define ADJ_WPM_MAX    40

// ── LEDs ────────────────────────────────────────────────────────────────────
#define PIN_LED_RED    27
#define PIN_LED_BLUE   26

// ── Buttons ─────────────────────────────────────────────────────────────────
#define PIN_SW_MODE    33
#define PIN_SW_SEL     32   // short=toggle VOL/WPM adjust target, long3s=config

// ── Audio ────────────────────────────────────────────────────────────────────
#define PIN_AUDIO      25
#define AUDIO_CHANNEL  0
#define AUDIO_FREQ_HZ  40000
#define AUDIO_RES_BITS 8

// =============================================================================
// TIMING CONSTANTS
// =============================================================================
#define BTN_DEBOUNCE_MS    50
#define BTN_LONG_MODE_MS  2000
#define BTN_LONG_CFG_MS   3000
#define BTN_FACTORY_MS    5000
#define OLED_REFRESH_MS   120
#define WDT_TIMEOUT_SEC    30

// =============================================================================
// DEFAULTS
// =============================================================================
#define DEFAULT_FREQ_MHZ      433.500f
#define DEFAULT_MESSAGE       "SOS"
#define DEFAULT_WPM           13
#define DEFAULT_POWER_DBM     17
#define DEFAULT_SLEEP_SEC     10
#define DEFAULT_SCAN_DWELL_MS 400
#define DEFAULT_RSSI_THRESH   -90
#define DEFAULT_AUDIO_VOL     180

// =============================================================================
// LIMITS
// =============================================================================
#define MAX_FREQUENCIES   10
#define MAX_MESSAGE_LEN   64
#define MAX_NAME_LEN      32
#define MAX_SCAN_HITS     20
#define CONFIG_AP_TIMEOUT 300000UL
#define AP_SSID           "AegisBeacon"
#define AP_PASS           ""
#define AP_IP             "192.168.4.1"

// Audio tones
#define AUDIO_TONE_MORSE   600
#define AUDIO_TONE_WEAK    440
#define AUDIO_TONE_MEDIUM  880
#define AUDIO_TONE_STRONG  1760

// =============================================================================
// ENUMS & STRUCTS
// =============================================================================
typedef enum {
  MODE_BEACON    = 0,
  MODE_SEARCH    = 1,
  MODE_CONFIG    = 2,
  MODE_EMERGENCY = 3
} DeviceMode;

const char* modeName(DeviceMode m) {
  switch(m) {
    case MODE_BEACON:    return "BEACON";
    case MODE_SEARCH:    return "SEARCH";
    case MODE_CONFIG:    return "CONFIG";
    case MODE_EMERGENCY: return "EMERGENCY";
    default:             return "UNKNOWN";
  }
}

struct ScanHit {
  float    freq;
  int16_t  rssi;
  uint32_t timestamp;
  char     label[12];
};

struct Config {
  // Radio
  float    freqs[MAX_FREQUENCIES];
  uint8_t  freqCount;
  char     message[MAX_MESSAGE_LEN];
  uint8_t  wpm;
  int8_t   powerDbm;
  uint32_t sleepSec;
  uint16_t scanDwellMs;
  int8_t   rssiThreshold;
  DeviceMode lastMode;
  bool     autoSwitch;
  uint8_t  repeatCount;
  // Audio
  uint8_t  audioVolume;
  bool     audioEnabled;
  // Display
  bool     oledEnabled;
  bool     oledInvert;
  // GPS
  bool     gpsEnabled;           // master GPS enable
  bool     gpsIncludeInBeacon;   // append coords to Morse message
  uint8_t  gpsFix1Timeout;       // seconds to wait for fix at boot (10-120)
  // Identity
  bool     nameEnabled;          // include name/surname in Morse
  char     firstName[MAX_NAME_LEN];
  char     lastName[MAX_NAME_LEN];
  // Potentiometers (removed in v5.3 — replaced by buttons)
  // The following booleans kept for NVS compatibility but unused:
  bool     potVolEnabled;
  bool     potWpmEnabled;
};

Config cfg;

struct ScanResult {
  float   freq;
  int16_t rssi;
  bool    detected;
};

// GPS live data (updated continuously by readGPS())
struct GpsFix {
  double   lat;
  double   lng;
  double   altitude;
  uint8_t  satellites;
  bool     valid;
  uint32_t age;         // ms since last valid fix
  uint32_t timestamp;   // millis() when fix was acquired
};

GpsFix g_gpsFix = {0, 0, 0, 0, false, 999999, 0};

// =============================================================================
// RTC MEMORY (survives deep sleep)
// =============================================================================
RTC_DATA_ATTR uint32_t   g_bootCycle      = 0;
RTC_DATA_ATTR uint32_t   g_txCycles       = 0;
RTC_DATA_ATTR uint32_t   g_scanCycles     = 0;
RTC_DATA_ATTR ScanHit    g_scanHits[MAX_SCAN_HITS];
RTC_DATA_ATTR uint8_t    g_scanHitCount   = 0;
RTC_DATA_ATTR DeviceMode g_currentMode    = MODE_BEACON;
RTC_DATA_ATTR bool       g_emergencyActive = false;
// Persist last known GPS fix across deep-sleep cycles
RTC_DATA_ATTR double     g_rtcLat         = 0;
RTC_DATA_ATTR double     g_rtcLng         = 0;
RTC_DATA_ATTR bool       g_rtcFixValid    = false;

// =============================================================================
// GLOBALS
// =============================================================================
SPIClass lora_spi(VSPI);

// SX1262 RadioLib constructor:
// SX1262(Module* mod) where Module takes:
//   (cs, irq/DIO1, reset, busy, spi)
// TXEN and RXEN are set via setRfSwitchPins() if needed; -1 = not used.
SX1262 radio = new Module(PIN_LORA_CS, PIN_LORA_DIO1, PIN_LORA_RST,
                           PIN_LORA_BUSY, lora_spi);

// U8g2: SSD1309 2.42" 128×64 — full-frame buffer, software SPI
U8G2_SSD1309_128X64_NONAME0_F_4W_SW_SPI u8g2(
  U8G2_R0,
  PIN_OLED_SCK,
  PIN_OLED_SDA,
  PIN_OLED_CS,
  PIN_OLED_DC,
  PIN_OLED_RES
);

TinyGPSPlus gps;
HardwareSerial gpsSerial(2);   // Serial2 on ESP32

bool g_oledOk = false;

Preferences prefs;
WebServer   server(80);
DNSServer   dns;

volatile bool g_modeButtonPressed   = false;
volatile bool g_selButtonPressed    = false;  // replaces g_configButtonPressed

uint32_t g_lastOledUpdate = 0;

// ── Button adjustment state ───────────────────────────────────────────────────
// adjTarget: 0 = VOL, 1 = WPM  (toggled by SW_SEL short press)
uint8_t  g_adjTarget     = 0;
uint32_t g_adjOledShowMs = 0;   // millis until adj overlay hides (0 = hidden)
#define  ADJ_SHOW_MS     2500   // ms to show adj overlay after button press

// Up/Down auto-repeat state
uint32_t g_upHeldSince   = 0;
uint32_t g_dnHeldSince   = 0;
uint32_t g_upLastRepeat  = 0;
uint32_t g_dnLastRepeat  = 0;

// =============================================================================
// MORSE CODE TABLE
// =============================================================================
const char* MORSE_TABLE[] = {
  ".-","-...","-.-.","-..",".","..-.","--.","....","..",".---",
  "-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-",
  "..-","...-",".--","-..-","-.--","--..",
  "-----",".----","..---","...--","....-",".....",
  "-....","--...","---..","----."
};

inline uint32_t dotMs()      { return 1200 / cfg.wpm; }
inline uint32_t dashMs()     { return dotMs() * 3; }
inline uint32_t intraChrMs() { return dotMs(); }
inline uint32_t interChrMs() { return dotMs() * 3; }
inline uint32_t wordGapMs()  { return dotMs() * 7; }

// =============================================================================
// ╔══════════════════════════════════════════════════════╗
// ║         BUTTON ADJUSTMENT ENGINE (v5.3)              ║
// ╚══════════════════════════════════════════════════════╝
// Three buttons replace the two potentiometers:
//   SW_SEL  — toggle adjustment target between VOL and WPM
//   SW_UP   — increment selected parameter
//   SW_DN   — decrement selected parameter
// Auto-repeat fires after BTN_REPEAT_DELAY_MS, then every BTN_REPEAT_RATE_MS.
// Call pollAdjButtons() inside any tight loop.
// =============================================================================

// Apply one step of adjustment to the currently selected parameter
static void adjStep(int8_t dir) {
  if (g_adjTarget == 0) {
    // Volume
    int v = (int)cfg.audioVolume + dir * ADJ_VOL_STEP;
    cfg.audioVolume = (uint8_t)constrain(v, ADJ_VOL_MIN, ADJ_VOL_MAX);
    LOG_POT("BTN VOL %s -> audioVolume=%d", dir>0?"+":"−", cfg.audioVolume);
  } else {
    // WPM
    int w = (int)cfg.wpm + dir * ADJ_WPM_STEP;
    cfg.wpm = (uint8_t)constrain(w, ADJ_WPM_MIN, ADJ_WPM_MAX);
    LOG_POT("BTN WPM %s -> wpm=%d (dot=%lu ms)", dir>0?"+":"−", cfg.wpm, dotMs());
  }
  g_adjOledShowMs = millis() + ADJ_SHOW_MS;
}

// Poll SW_UP and SW_DN, handle press and auto-repeat
void pollAdjButtons() {
  uint32_t now = millis();

  // ── UP button ──
  if (digitalRead(PIN_SW_UP) == LOW) {
    if (g_upHeldSince == 0) {
      g_upHeldSince  = now;
      g_upLastRepeat = now;
      adjStep(+1);
    } else if (now - g_upHeldSince > BTN_REPEAT_DELAY_MS &&
               now - g_upLastRepeat > BTN_REPEAT_RATE_MS) {
      g_upLastRepeat = now;
      adjStep(+1);
    }
  } else {
    g_upHeldSince = 0;
  }

  // ── DN button ──
  if (digitalRead(PIN_SW_DN) == LOW) {
    if (g_dnHeldSince == 0) {
      g_dnHeldSince  = now;
      g_dnLastRepeat = now;
      adjStep(-1);
    } else if (now - g_dnHeldSince > BTN_REPEAT_DELAY_MS &&
               now - g_dnLastRepeat > BTN_REPEAT_RATE_MS) {
      g_dnLastRepeat = now;
      adjStep(-1);
    }
  } else {
    g_dnHeldSince = 0;
  }
}

// Legacy stub — called where readPots() was; now delegates to pollAdjButtons()
inline void readPots() { pollAdjButtons(); }

// =============================================================================
// ╔══════════════════════════════════════════════════════╗
// ║              GPS ENGINE                              ║
// ╚══════════════════════════════════════════════════════╝
// TinyGPS++ parses NMEA sentences from Serial2 (NEO-6M).
// readGPS() must be called frequently (every loop iteration ideally).
// The fix is stored in g_gpsFix and persisted to RTC memory.
// buildMorsePayload() assembles the final Morse string based on config.
// =============================================================================

void readGPS() {
  if (!cfg.gpsEnabled) return;
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }
  if (gps.location.isValid() && gps.location.age() < 3000) {
    g_gpsFix.lat        = gps.location.lat();
    g_gpsFix.lng        = gps.location.lng();
    g_gpsFix.altitude   = gps.altitude.isValid() ? gps.altitude.meters() : 0;
    g_gpsFix.satellites = gps.satellites.isValid() ? (uint8_t)gps.satellites.value() : 0;
    g_gpsFix.valid      = (g_gpsFix.satellites >= GPS_MIN_SATS);
    g_gpsFix.age        = gps.location.age();
    g_gpsFix.timestamp  = millis();
    // Persist to RTC memory so it survives deep-sleep
    g_rtcLat      = g_gpsFix.lat;
    g_rtcLng      = g_gpsFix.lng;
    g_rtcFixValid = g_gpsFix.valid;
  } else if (g_rtcFixValid && !g_gpsFix.valid) {
    // Use RTC-persisted fix if GPS lost lock
    g_gpsFix.lat   = g_rtcLat;
    g_gpsFix.lng   = g_rtcLng;
    g_gpsFix.valid = true;   // stale but better than nothing
    g_gpsFix.age   = millis() - g_gpsFix.timestamp + 60000;
  }
}

// Format latitude for Morse: N4553 (= 45.53° N)
// Uses DDM × 100 integer to avoid decimal in Morse (no '.' character)
// N/S prefix + 4 digits degrees×100 truncated
void formatCoordMorse(char* buf, size_t len, double deg, bool isLat) {
  char hemi;
  if (isLat) hemi = (deg >= 0) ? 'N' : 'S';
  else        hemi = (deg >= 0) ? 'E' : 'W';
  double absDeg = fabs(deg);
  int    degInt = (int)absDeg;
  double minFrac = (absDeg - degInt) * 60.0;   // decimal minutes
  int    minInt  = (int)(minFrac * 100.0 / 10.0); // trim to 2-digit minutes*10
  snprintf(buf, len, "%c%02d%02d", hemi, degInt, minInt);
}

// Build the complete Morse payload based on current config + GPS fix
// Result written into `out` buffer (up to outLen chars)
void buildMorsePayload(char* out, size_t outLen) {
  char tmp[128];
  strlcpy(tmp, "SOS", sizeof(tmp));

  // Append name if enabled and set
  if (cfg.nameEnabled && (strlen(cfg.firstName) > 0 || strlen(cfg.lastName) > 0)) {
    strlcat(tmp, " DE ", sizeof(tmp));
    if (strlen(cfg.firstName) > 0) {
      strlcat(tmp, cfg.firstName, sizeof(tmp));
      if (strlen(cfg.lastName) > 0) strlcat(tmp, " ", sizeof(tmp));
    }
    if (strlen(cfg.lastName) > 0) strlcat(tmp, cfg.lastName, sizeof(tmp));
  }

  // Append GPS coordinates if enabled and we have a fix
  if (cfg.gpsIncludeInBeacon && cfg.gpsEnabled) {
    bool hasFix = g_gpsFix.valid || g_rtcFixValid;
    double useLat = g_gpsFix.valid ? g_gpsFix.lat : g_rtcLat;
    double useLng = g_gpsFix.valid ? g_gpsFix.lng : g_rtcLng;

    if (hasFix) {
      char latBuf[10], lngBuf[10];
      formatCoordMorse(latBuf, sizeof(latBuf), useLat, true);
      formatCoordMorse(lngBuf, sizeof(lngBuf), useLng, false);
      char coordStr[24];
      snprintf(coordStr, sizeof(coordStr), " PSN %s %s", latBuf, lngBuf);
      strlcat(tmp, coordStr, sizeof(tmp));
    } else {
      strlcat(tmp, " PSN UNKN", sizeof(tmp));
    }
  }

  strlcpy(out, tmp, outLen);
  LOG_GPS("Morse payload: \"%s\" (%d chars)", out, (int)strlen(out));
}

// =============================================================================
// ╔══════════════════════════════════════════════════════╗
// ║            AUDIO ENGINE                              ║
// ╚══════════════════════════════════════════════════════╝
// =============================================================================

static inline void audioDacSilence() {
  ledcWrite(AUDIO_CHANNEL, 0);
  dacWrite(PIN_AUDIO, 128);   // mid-rail parking — no click
}

void audioTone(uint32_t freqHz, uint32_t durationMs) {
  if (!cfg.audioEnabled || freqHz == 0) return;
  ledcWriteTone(AUDIO_CHANNEL, freqHz);
  ledcWrite(AUDIO_CHANNEL, cfg.audioVolume / 2);
  delay(durationMs);
  audioDacSilence();
}

void audioToneStart(uint32_t freqHz) {
  if (!cfg.audioEnabled || freqHz == 0) { audioDacSilence(); return; }
  ledcWriteTone(AUDIO_CHANNEL, freqHz);
  ledcWrite(AUDIO_CHANNEL, cfg.audioVolume / 2);
}

void audioToneStop() {
  audioDacSilence();
}

void audioSweep(uint32_t fromHz, uint32_t toHz, uint32_t stepMs = 8) {
  if (!cfg.audioEnabled) return;
  int32_t step = (toHz > fromHz) ? 40 : -40;
  for (int32_t f = (int32_t)fromHz; (toHz > fromHz) ? f < (int32_t)toHz : f > (int32_t)toHz; f += step) {
    ledcWriteTone(AUDIO_CHANNEL, (uint32_t)f);
    ledcWrite(AUDIO_CHANNEL, cfg.audioVolume / 3);
    delay(stepMs);
  }
  audioDacSilence();
}

uint32_t audioSearchTone(int16_t rssi) {
  if (!cfg.audioEnabled || rssi < cfg.rssiThreshold) { audioToneStop(); return 0; }
  int16_t clamped = constrain(rssi, cfg.rssiThreshold, -40);
  uint32_t freq = (uint32_t)map(clamped, cfg.rssiThreshold, -40, 440, 2200);
  return freq;
}

// =============================================================================
// ╔══════════════════════════════════════════════════════╗
// ║              OLED DISPLAY ENGINE  (U8g2)             ║
// ╚══════════════════════════════════════════════════════╝
// =============================================================================

bool initOled() {
  LOG_OLED("Initialising SSD1309 2.42\" via U8g2 (soft SPI)");
  u8g2.begin();
  u8g2.setContrast(220);
  u8g2.setFontPosTop();
  u8g2.setDrawColor(1);
  if (cfg.oledInvert) u8g2.sendF("c", 0xa7);
  LOG_OK("OLED ready — SSD1309 128x64");
  return true;
}

// Segmented horizontal bar: x,y = top-left  w = total width  h = height
void oledSegBar(int16_t x, int16_t y, int16_t w, int16_t h, uint8_t pct) {
  const int8_t SEG_W = 6;
  const int8_t GAP   = 2;
  int16_t filled = (int16_t)((long)w * pct / 100);
  u8g2.drawFrame(x, y, w, h);
  int16_t sx = x + 2;
  while (sx + SEG_W <= x + filled - 1) {
    u8g2.drawBox(sx, y + 2, SEG_W, h - 4);
    sx += SEG_W + GAP;
  }
}

// ── ADJUSTMENT OVERLAY ───────────────────────────────────────────────────────
// Draw a small overlay bar at bottom showing current VOL or WPM being edited.
// Called from beacon/search screens when g_adjOledShowMs is in the future.
void oledAdjOverlay() {
  if (millis() >= g_adjOledShowMs) return;

  // Inverted bottom 12 px
  u8g2.setDrawColor(1);
  u8g2.drawBox(0, 52, 128, 12);
  u8g2.setDrawColor(0);

  if (g_adjTarget == 0) {
    // Volume: show label + bar
    u8g2.setFont(u8g2_font_5x7_tf);
    u8g2.drawStr(1, 53, "VOL");
    // Bar: 86 px wide, starts at x=22
    uint8_t pct = (uint8_t)map(cfg.audioVolume, ADJ_VOL_MIN, ADJ_VOL_MAX, 0, 100);
    int16_t fillW = (int16_t)map(pct, 0, 100, 0, 86);
    u8g2.drawFrame(22, 54, 88, 8);
    if (fillW > 2) u8g2.drawBox(23, 55, fillW, 6);
    // Numeric value
    char vbuf[8];
    snprintf(vbuf, sizeof(vbuf), "%3d%%", cfg.audioVolume * 100 / 255);
    u8g2.drawStr(113, 53, vbuf);
  } else {
    // WPM: show label + bar
    u8g2.setFont(u8g2_font_5x7_tf);
    u8g2.drawStr(1, 53, "WPM");
    uint8_t pct = (uint8_t)map(cfg.wpm, ADJ_WPM_MIN, ADJ_WPM_MAX, 0, 100);
    int16_t fillW = (int16_t)map(pct, 0, 100, 0, 86);
    u8g2.drawFrame(22, 54, 88, 8);
    if (fillW > 2) u8g2.drawBox(23, 55, fillW, 6);
    char wbuf[8];
    snprintf(wbuf, sizeof(wbuf), "%3d", cfg.wpm);
    u8g2.drawStr(113, 53, wbuf);
  }

  u8g2.setDrawColor(1);
}

uint8_t rssiToPct(int16_t rssi) {
  return (uint8_t)constrain(map(rssi, -120, -40, 0, 100), 0, 100);
}

// ── BOOT SPLASH ──────────────────────────────────────────────────────────────
void oledSplash() {
  if (!g_oledOk || !cfg.oledEnabled) return;
  u8g2.clearBuffer();

  // Top bar
  u8g2.setDrawColor(1);
  u8g2.drawBox(0, 0, 128, 13);
  u8g2.setDrawColor(0);
  u8g2.setFont(u8g2_font_7x13B_tf);
  u8g2.drawStr(4, 1, "AEGIS-BEACON");
  u8g2.setFont(u8g2_font_5x7_tf);
  u8g2.drawStr(101, 2, "v5.3");
  u8g2.setDrawColor(1);

  // Separator line
  u8g2.drawHLine(0, 14, 128);

  // Subtitle
  u8g2.setFont(u8g2_font_6x10_tf);
  u8g2.drawStr(8, 16, "AVALANCHE RESCUE SYSTEM");

  // Feature flags (compact)
  u8g2.drawHLine(0, 28, 128);
  u8g2.setFont(u8g2_font_5x7_tf);

  char feats[48] = "";
  if (cfg.gpsEnabled)  strlcat(feats, " GPS", sizeof(feats));
  if (cfg.nameEnabled) strlcat(feats, " ID", sizeof(feats));
  strlcat(feats, " BTN-CTRL", sizeof(feats));
  u8g2.drawStr(2, 30, feats);

  // Version bar at bottom
  u8g2.drawBox(0, 41, 128, 1);
  u8g2.drawBox(0, 56, 128, 8);
  u8g2.setDrawColor(0);
  u8g2.setFont(u8g2_font_5x7_tf);
  u8g2.drawStr(22, 57, "INITIALISING...");
  u8g2.setDrawColor(1);

  // Animated dots placeholder (static here)
  u8g2.setFont(u8g2_font_4x6_tf);
  u8g2.drawStr(2, 44, "github.com/Leo-Galli/Aegis-Beacon");

  u8g2.sendBuffer();
}

// ── GPS WAIT SCREEN ───────────────────────────────────────────────────────────
void oledGpsWait(uint8_t sats, uint32_t elapsedSec, uint32_t timeoutSec) {
  if (!g_oledOk || !cfg.oledEnabled) return;
  if (millis() - g_lastOledUpdate < OLED_REFRESH_MS) return;
  g_lastOledUpdate = millis();

  u8g2.clearBuffer();

  // Header bar
  u8g2.setDrawColor(1);
  u8g2.drawBox(0, 0, 128, 12);
  u8g2.setDrawColor(0);
  u8g2.setFont(u8g2_font_6x10_tf);
  u8g2.drawStr(8, 1, "ACQUIRING GPS FIX");
  u8g2.setDrawColor(1);

  // Large satellite count
  u8g2.setFont(u8g2_font_logisoso24_tf);
  char satbuf[4];
  snprintf(satbuf, sizeof(satbuf), "%d", sats);
  u8g2.drawStr(6, 13, satbuf);

  // "SATS" label
  u8g2.setFont(u8g2_font_6x10_tf);
  u8g2.drawStr(52, 22, "SAT");

  // Timeout progress bar (solid fill)
  uint8_t pct = (uint8_t)constrain(elapsedSec * 100 / timeoutSec, 0, 100);
  u8g2.drawFrame(0, 38, 128, 7);
  int16_t fillW = (int16_t)map(pct, 0, 100, 0, 126);
  if (fillW > 0) u8g2.drawBox(1, 39, fillW, 5);

  // Status text
  u8g2.setFont(u8g2_font_5x7_tf);
  if (sats >= GPS_MIN_SATS) {
    char okbuf[20];
    snprintf(okbuf, sizeof(okbuf), "FIX OK  %d sats", sats);
    u8g2.drawStr(0, 47, okbuf);
  } else {
    uint32_t rem = (elapsedSec < timeoutSec) ? timeoutSec - elapsedSec : 0;
    char waitbuf[24];
    snprintf(waitbuf, sizeof(waitbuf), "TIMEOUT IN %lus", rem);
    u8g2.drawStr(0, 47, waitbuf);
  }

  // Coordinates or hint
  if (g_gpsFix.valid) {
    char coordbuf[28];
    snprintf(coordbuf, sizeof(coordbuf), "%.4f  %.4f", g_gpsFix.lat, g_gpsFix.lng);
    u8g2.drawStr(0, 56, coordbuf);
  } else {
    u8g2.drawStr(0, 56, "MODE: skip wait");
  }

  u8g2.sendBuffer();
}

// ── BEACON MODE SCREEN ────────────────────────────────────────────────────────
// 128×64 layout:
//  [ 0-11] Inverted header: BEACON | cycle counter
//  [12-35] Large frequency + MHz
//  [22-43] Channel / power / WPM info line
//  [44-51] TX progress bar (segmented), always visible
//  [52-63] Status row OR adj overlay OR TRANSMITTING flash
void oledBeacon(int freqIdx, float freqMHz, int charIdx, int totalChars,
                uint32_t cycleNum, uint32_t sleepRemainSec, bool transmitting,
                const char* payload) {
  if (!g_oledOk || !cfg.oledEnabled) return;
  if (millis() - g_lastOledUpdate < OLED_REFRESH_MS && !transmitting) return;
  g_lastOledUpdate = millis();

  u8g2.clearBuffer();

  // ── Header bar ──────────────────────────────────────────────────────────
  u8g2.setDrawColor(1);
  u8g2.drawBox(0, 0, 128, 12);
  u8g2.setDrawColor(0);
  u8g2.setFont(u8g2_font_6x10_tf);
  u8g2.drawStr(2, 1, "TX BEACON");
  char cyclbuf[14];
  snprintf(cyclbuf, sizeof(cyclbuf), "#%lu", cycleNum);
  u8g2.drawStr(128 - (int16_t)strlen(cyclbuf) * 6 - 2, 1, cyclbuf);
  u8g2.setDrawColor(1);

  // ── Large frequency ──────────────────────────────────────────────────────
  char fbuf[12];
  snprintf(fbuf, sizeof(fbuf), "%.3f", freqMHz);
  u8g2.setFont(u8g2_font_logisoso24_tf);
  u8g2.drawStr(0, 13, fbuf);
  u8g2.setFont(u8g2_font_5x7_tf);
  u8g2.drawStr(102, 26, "MHz");

  // GPS fix dot (top-right corner, 3px filled/outline)
  if (cfg.gpsEnabled) {
    if (g_gpsFix.valid) {
      u8g2.drawBox(120, 14, 5, 5);      // solid = fix OK
    } else {
      u8g2.drawFrame(120, 14, 5, 5);    // outline = no fix
    }
  }

  // ── Info line: channel / power / wpm ────────────────────────────────────
  char infobuf[28];
  snprintf(infobuf, sizeof(infobuf), "CH%d/%d +%ddBm %dWPM",
           freqIdx + 1, cfg.freqCount, cfg.powerDbm, cfg.wpm);
  u8g2.setFont(u8g2_font_5x7_tf);
  u8g2.drawStr(0, 37, infobuf);

  // ── TX progress bar ──────────────────────────────────────────────────────
  uint8_t pct = (totalChars > 0) ? (uint8_t)((uint32_t)charIdx * 100 / totalChars) : 0;
  // Outer frame
  u8g2.drawFrame(0, 44, 128, 7);
  // Filled portion (solid bar, no gaps — cleaner look)
  if (pct > 0) {
    int16_t fillW = (int16_t)map(pct, 0, 100, 0, 126);
    if (fillW > 0) u8g2.drawBox(1, 45, fillW, 5);
  }

  // ── Bottom area ──────────────────────────────────────────────────────────
  bool showOverlay = (millis() < g_adjOledShowMs);

  if (showOverlay) {
    oledAdjOverlay();
  } else if (transmitting && (millis() / 300) % 2 == 0) {
    // Flashing TRANSMITTING bar
    u8g2.drawBox(0, 52, 128, 12);
    u8g2.setDrawColor(0);
    u8g2.setFont(u8g2_font_6x10_tf);
    // Payload preview centred in bar
    char plbuf[22];
    uint8_t plLen = (uint8_t)strlen(payload);
    int16_t startChar = (int16_t)charIdx - 10;
    if (startChar < 0) startChar = 0;
    if (startChar + 21 > plLen) startChar = (plLen > 21) ? plLen - 21 : 0;
    snprintf(plbuf, sizeof(plbuf), "%-21.21s", payload + startChar);
    u8g2.drawStr(1, 53, plbuf);
    u8g2.setDrawColor(1);
  } else {
    // Status row: GPS state + sleep countdown
    u8g2.setFont(u8g2_font_5x7_tf);
    char statusbuf[32] = "";
    if (cfg.gpsEnabled) {
      strlcat(statusbuf, g_gpsFix.valid ? "GPS:OK" : "GPS:--", sizeof(statusbuf));
      strlcat(statusbuf, "  ", sizeof(statusbuf));
    }
    char slpbuf[16];
    if (sleepRemainSec > 0)
      snprintf(slpbuf, sizeof(slpbuf), "SLP %lus", sleepRemainSec);
    else
      strlcpy(slpbuf, "STANDBY", sizeof(slpbuf));
    strlcat(statusbuf, slpbuf, sizeof(statusbuf));
    u8g2.drawStr(0, 53, statusbuf);

    // Adj target indicator (right side)
    const char* adjLbl = (g_adjTarget == 0) ? "VOL" : "WPM";
    u8g2.drawStr(103, 53, adjLbl);
    u8g2.drawFrame(101, 52, 27, 10);
  }

  u8g2.sendBuffer();
}

// ── SEARCH MODE SCREEN ────────────────────────────────────────────────────────
// 128×64 layout:
//  [ 0-11] Inverted header: RX SEARCH | hits count
//  [12-35] Large frequency
//  [22-43] RSSI value + numeric dBm
//  [44-51] RSSI bar with threshold marker
//  [52-63] Signal label / last hit / adj overlay
void oledSearch(int freqIdx, float freqMHz, int16_t rssi,
                uint32_t passNum, bool detected) {
  if (!g_oledOk || !cfg.oledEnabled) return;
  if (millis() - g_lastOledUpdate < OLED_REFRESH_MS) return;
  g_lastOledUpdate = millis();

  u8g2.clearBuffer();

  // ── Header bar ──────────────────────────────────────────────────────────
  u8g2.setDrawColor(1);
  u8g2.drawBox(0, 0, 128, 12);
  u8g2.setDrawColor(0);
  u8g2.setFont(u8g2_font_6x10_tf);
  u8g2.drawStr(2, 1, "RX SEARCH");
  char hitsbuf[12];
  snprintf(hitsbuf, sizeof(hitsbuf), "HIT:%d", g_scanHitCount);
  u8g2.drawStr(128 - (int16_t)strlen(hitsbuf) * 6 - 2, 1, hitsbuf);
  u8g2.setDrawColor(1);

  // ── Large frequency ──────────────────────────────────────────────────────
  char fbuf[12];
  snprintf(fbuf, sizeof(fbuf), "%.3f", freqMHz);
  u8g2.setFont(u8g2_font_logisoso24_tf);
  u8g2.drawStr(0, 13, fbuf);
  u8g2.setFont(u8g2_font_5x7_tf);
  u8g2.drawStr(102, 26, "MHz");

  // Channel indicator (small, top-right)
  char chbuf[8];
  snprintf(chbuf, sizeof(chbuf), "%d/%d", freqIdx+1, cfg.freqCount);
  u8g2.drawStr(112, 14, chbuf);

  // ── RSSI value line ──────────────────────────────────────────────────────
  char rssibuf[18];
  snprintf(rssibuf, sizeof(rssibuf), "RSSI  %4d dBm", rssi);
  u8g2.setFont(u8g2_font_5x7_tf);
  u8g2.drawStr(0, 37, rssibuf);

  // ── RSSI bar (solid fill) + threshold tick ───────────────────────────────
  uint8_t rssiPct = rssiToPct(rssi);
  u8g2.drawFrame(0, 43, 128, 8);
  int16_t barFill = (int16_t)map(rssiPct, 0, 100, 0, 126);
  if (barFill > 0) u8g2.drawBox(1, 44, barFill, 6);
  // Threshold tick (vertical line)
  uint8_t thrPct = rssiToPct(cfg.rssiThreshold);
  int16_t thrX = (int16_t)map(thrPct, 0, 100, 0, 127);
  u8g2.drawVLine(thrX, 42, 10);

  // ── Bottom area ──────────────────────────────────────────────────────────
  bool showOverlay = (millis() < g_adjOledShowMs);

  if (showOverlay) {
    oledAdjOverlay();
  } else if (detected && (millis() / 280) % 2 == 0) {
    // Detected: inverted signal strength label
    u8g2.drawBox(0, 52, 128, 12);
    u8g2.setDrawColor(0);
    u8g2.setFont(u8g2_font_6x10_tf);
    const char* lbl = (rssi >= -60) ? "  ** STRONG SIGNAL **  " :
                      (rssi >= -80) ? "   *  MEDIUM SIGNAL  *  " :
                                      "     WEAK SIGNAL      ";
    int16_t ax = (128 - (int16_t)strlen(lbl) * 6) / 2;
    if (ax < 0) ax = 0;
    u8g2.drawStr(ax, 53, lbl);
    u8g2.setDrawColor(1);
  } else if (g_scanHitCount > 0) {
    // Show last hit
    ScanHit& h = g_scanHits[g_scanHitCount - 1];
    char lastbuf[28];
    snprintf(lastbuf, sizeof(lastbuf), "LAST %.3fMHz %ddBm %s",
             h.freq, h.rssi, h.label);
    u8g2.setFont(u8g2_font_5x7_tf);
    u8g2.drawStr(0, 53, lastbuf);
  } else {
    // Scanning status
    u8g2.setFont(u8g2_font_5x7_tf);
    char scanbuf[28];
    snprintf(scanbuf, sizeof(scanbuf), "SCAN #%lu  THR:%ddBm", passNum, cfg.rssiThreshold);
    u8g2.drawStr(0, 53, scanbuf);

    // Adj target indicator
    const char* adjLbl = (g_adjTarget == 0) ? "VOL" : "WPM";
    u8g2.drawStr(103, 53, adjLbl);
    u8g2.drawFrame(101, 52, 27, 10);
  }

  u8g2.sendBuffer();
}

// ── EMERGENCY SCREEN ──────────────────────────────────────────────────────────
void oledEmergency(float freqMHz, uint32_t cycleNum) {
  if (!g_oledOk || !cfg.oledEnabled) return;
  if (millis() - g_lastOledUpdate < 200) return;
  g_lastOledUpdate = millis();

  u8g2.clearBuffer();
  bool inv = (millis() / 500) % 2;

  if (inv) {
    u8g2.drawBox(0, 0, 128, 64);
    u8g2.setDrawColor(0);
  } else {
    u8g2.setDrawColor(1);
    // Border double-frame when not inverted
    u8g2.drawFrame(0, 0, 128, 64);
    u8g2.drawFrame(2, 2, 124, 60);
  }

  // Giant SOS centred
  u8g2.setFont(u8g2_font_logisoso32_tf);
  u8g2.drawStr(14, 1, "SOS");

  // Separator
  if (!inv) u8g2.drawHLine(4, 35, 120);
  else      { u8g2.drawHLine(4, 35, 120); }  // visible in both modes

  u8g2.setFont(u8g2_font_6x10_tf);
  u8g2.drawStr(4, 37, "EMERGENCY BEACON TX");

  char fbuf[22];
  snprintf(fbuf, sizeof(fbuf), "%.3f MHz  +22dBm", freqMHz);
  u8g2.setFont(u8g2_font_5x7_tf);
  u8g2.drawStr(4, 48, fbuf);

  if (g_gpsFix.valid || g_rtcFixValid) {
    double lat = g_gpsFix.valid ? g_gpsFix.lat : g_rtcLat;
    double lng = g_gpsFix.valid ? g_gpsFix.lng : g_rtcLng;
    char coordbuf[24];
    snprintf(coordbuf, sizeof(coordbuf), "%.3f  %.3f", lat, lng);
    u8g2.drawStr(4, 57, coordbuf);
  } else {
    char cbuf[20];
    snprintf(cbuf, sizeof(cbuf), "CYCLE #%lu  NO GPS", cycleNum);
    u8g2.drawStr(4, 57, cbuf);
  }

  u8g2.setDrawColor(1);
  u8g2.sendBuffer();
}

// ── CONFIG MODE SCREEN ────────────────────────────────────────────────────────
void oledConfig() {
  if (!g_oledOk || !cfg.oledEnabled) return;
  u8g2.clearBuffer();

  u8g2.setDrawColor(1);
  u8g2.drawBox(0, 0, 128, 11);
  u8g2.setDrawColor(0);
  u8g2.setFont(u8g2_font_6x10_tf);
  u8g2.drawStr(14, 1, "CONFIGURATION MODE");
  u8g2.setDrawColor(1);

  u8g2.setFont(u8g2_font_7x13_tf);
  u8g2.drawStr(0, 12, "WiFi:");
  u8g2.setFont(u8g2_font_6x10_tf);
  u8g2.drawStr(44, 13, AP_SSID);

  u8g2.drawStr(0, 25, "URL: http://");
  u8g2.drawStr(73, 25, AP_IP);

  u8g2.drawHLine(0, 35, 128);

  u8g2.setFont(u8g2_font_5x7_tf);
  u8g2.drawStr(0, 37, "1. Connect to WiFi above");
  u8g2.drawStr(0, 46, "2. Open browser");
  u8g2.drawStr(0, 55, "3. Navigate to URL above");

  u8g2.sendBuffer();
}

// ── GENERIC MESSAGE ───────────────────────────────────────────────────────────
void oledMessage(const char* l1, const char* l2 = nullptr,
                 const char* l3 = nullptr, bool inv = false) {
  if (!g_oledOk || !cfg.oledEnabled) return;
  u8g2.clearBuffer();
  if (inv) { u8g2.drawBox(0, 0, 128, 64); u8g2.setDrawColor(0); }
  else     { u8g2.setDrawColor(1); }
  u8g2.setFont(u8g2_font_7x13_tf);
  if (l1) u8g2.drawStr(0,  4, l1);
  if (l2) u8g2.drawStr(0, 24, l2);
  if (l3) u8g2.drawStr(0, 44, l3);
  u8g2.setDrawColor(1);
  u8g2.sendBuffer();
}

void oledSleep() { if (g_oledOk) u8g2.setPowerSave(1); }
void oledWake()  { if (g_oledOk) u8g2.setPowerSave(0); }

// =============================================================================
// LED HELPERS
// =============================================================================
void ledsOff() { digitalWrite(PIN_LED_RED, LOW); digitalWrite(PIN_LED_BLUE, LOW); }

void blinkLed(uint8_t pin, int times, int ms = 100) {
  for (int i = 0; i < times; i++) {
    digitalWrite(pin, HIGH); delay(ms);
    digitalWrite(pin, LOW);  delay(ms);
  }
}

void ledModeIndicate(DeviceMode m) {
  ledsOff();
  if (m == MODE_BEACON || m == MODE_EMERGENCY) blinkLed(PIN_LED_RED, 3, 80);
  else if (m == MODE_SEARCH)                   blinkLed(PIN_LED_BLUE, 3, 80);
  else { blinkLed(PIN_LED_RED, 1, 200); blinkLed(PIN_LED_BLUE, 1, 200); }
}

// =============================================================================
// BUTTON ISRs
// =============================================================================
void IRAM_ATTR isrModeButton() { g_modeButtonPressed = true; }
void IRAM_ATTR isrSelButton()  { g_selButtonPressed  = true; }

uint32_t waitButtonRelease(uint8_t pin) {
  uint32_t t = millis();
  while (digitalRead(pin) == LOW) { delay(10); esp_task_wdt_reset(); }
  return millis() - t;
}

uint8_t checkButton(uint8_t pin, uint32_t longThreshMs, volatile bool& flag) {
  if (!flag) return 0;
  flag = false;
  delay(BTN_DEBOUNCE_MS);
  if (digitalRead(pin) != LOW) return 0;
  uint32_t held = waitButtonRelease(pin);
  LOG_BTN("GPIO%d held %lu ms (long>%lu ms)", pin, held, longThreshMs);
  return (held >= longThreshMs) ? 2 : 1;
}

// =============================================================================
// NVS LOAD / SAVE
// =============================================================================
void loadConfig() {
  dbSep("NVS CONFIG LOAD");
  prefs.begin("aegis", true);

  cfg.freqCount = prefs.getUChar("fcount", 0);
  bool fresh = (cfg.freqCount == 0 || cfg.freqCount > MAX_FREQUENCIES);
  if (fresh) {
    LOG_WARN("NVS empty — using defaults");
    cfg.freqs[0] = DEFAULT_FREQ_MHZ; cfg.freqCount = 1;
  } else {
    for (int i = 0; i < cfg.freqCount; i++) {
      char k[8]; snprintf(k, sizeof(k), "f%d", i);
      cfg.freqs[i] = prefs.getFloat(k, DEFAULT_FREQ_MHZ);
    }
  }

  prefs.getString("msg",   cfg.message,   MAX_MESSAGE_LEN);
  if (!strlen(cfg.message)) strlcpy(cfg.message, DEFAULT_MESSAGE, MAX_MESSAGE_LEN);

  cfg.wpm           = prefs.getUChar("wpm",    DEFAULT_WPM);
  cfg.powerDbm      = (int8_t)prefs.getChar("pwr", DEFAULT_POWER_DBM);
  cfg.sleepSec      = prefs.getULong("sleep",  DEFAULT_SLEEP_SEC);
  cfg.scanDwellMs   = prefs.getUShort("dwell", DEFAULT_SCAN_DWELL_MS);
  cfg.rssiThreshold = (int8_t)prefs.getChar("rssi",  DEFAULT_RSSI_THRESH);
  cfg.lastMode      = (DeviceMode)prefs.getUChar("mode", MODE_BEACON);
  cfg.autoSwitch    = prefs.getBool("aswitch", false);
  cfg.repeatCount   = prefs.getUChar("rep",    1);
  cfg.audioVolume   = prefs.getUChar("avol",   DEFAULT_AUDIO_VOL);
  cfg.audioEnabled  = prefs.getBool("aen",     true);
  cfg.oledEnabled   = prefs.getBool("olen",    true);
  cfg.oledInvert    = prefs.getBool("olinv",   false);
  // GPS
  cfg.gpsEnabled        = prefs.getBool("gpsen",   false);
  cfg.gpsIncludeInBeacon= prefs.getBool("gpsbeac", false);
  cfg.gpsFix1Timeout    = prefs.getUChar("gpstmo", 30);
  // Identity
  cfg.nameEnabled = prefs.getBool("namen", false);
  prefs.getString("fname", cfg.firstName, MAX_NAME_LEN);
  prefs.getString("lname", cfg.lastName,  MAX_NAME_LEN);
  // Pots
  cfg.potVolEnabled = prefs.getBool("poten",  false);
  cfg.potWpmEnabled = prefs.getBool("potwpm", false);

  prefs.end();

  // Sanity clamps
  if (cfg.wpm < 5 || cfg.wpm > 40) cfg.wpm = DEFAULT_WPM;
  if (cfg.lastMode > MODE_SEARCH)   cfg.lastMode = MODE_BEACON;
  if (cfg.sleepSec < 1)             cfg.sleepSec = DEFAULT_SLEEP_SEC;
  if (cfg.gpsFix1Timeout < 10 || cfg.gpsFix1Timeout > 120) cfg.gpsFix1Timeout = 30;

  dbSep("ACTIVE CONFIG");
  LOG_INFO("Message   : \"%s\"",    cfg.message);
  LOG_INFO("WPM       : %d",        cfg.wpm);
  LOG_INFO("GPS       : %s  beacon=%s  timeout=%ds",
           cfg.gpsEnabled?"ON":"OFF",
           cfg.gpsIncludeInBeacon?"YES":"NO", cfg.gpsFix1Timeout);
  LOG_INFO("Name      : %s  \"%s %s\"",
           cfg.nameEnabled?"ON":"OFF", cfg.firstName, cfg.lastName);
  LOG_INFO("Buttons   : UP=GPIO%d DN=GPIO%d SEL=GPIO%d",
           PIN_SW_UP, PIN_SW_DN, PIN_SW_SEL);
  dbSep();
}

void saveConfig() {
  prefs.begin("aegis", false);
  prefs.putUChar("fcount", cfg.freqCount);
  for (int i = 0; i < cfg.freqCount; i++) {
    char k[8]; snprintf(k, sizeof(k), "f%d", i);
    prefs.putFloat(k, cfg.freqs[i]);
  }
  prefs.putString("msg",    cfg.message);
  prefs.putUChar("wpm",     cfg.wpm);
  prefs.putChar("pwr",      (char)cfg.powerDbm);
  prefs.putULong("sleep",   cfg.sleepSec);
  prefs.putUShort("dwell",  cfg.scanDwellMs);
  prefs.putChar("rssi",     (char)cfg.rssiThreshold);
  prefs.putUChar("mode",    (uint8_t)cfg.lastMode);
  prefs.putBool("aswitch",  cfg.autoSwitch);
  prefs.putUChar("rep",     cfg.repeatCount);
  prefs.putUChar("avol",    cfg.audioVolume);
  prefs.putBool("aen",      cfg.audioEnabled);
  prefs.putBool("olen",     cfg.oledEnabled);
  prefs.putBool("olinv",    cfg.oledInvert);
  prefs.putBool("gpsen",    cfg.gpsEnabled);
  prefs.putBool("gpsbeac",  cfg.gpsIncludeInBeacon);
  prefs.putUChar("gpstmo",  cfg.gpsFix1Timeout);
  prefs.putBool("namen",    cfg.nameEnabled);
  prefs.putString("fname",  cfg.firstName);
  prefs.putString("lname",  cfg.lastName);
  prefs.putBool("poten",    cfg.potVolEnabled);
  prefs.putBool("potwpm",   cfg.potWpmEnabled);
  prefs.end();
  LOG_OK("Config saved to NVS");
}

void factoryReset() {
  oledMessage("FACTORY RESET", "Clearing NVS...", "Reboot in 3s", true);
  audioSweep(1600, 200, 5);
  prefs.begin("aegis", false); prefs.clear(); prefs.end();
  g_bootCycle = 0; g_txCycles = 0; g_scanCycles = 0;
  g_scanHitCount = 0; g_emergencyActive = false; g_rtcFixValid = false;
  g_currentMode = MODE_BEACON;
  delay(3000);
  ESP.restart();
}

// =============================================================================
// RADIO INIT  (SX1262)
// =============================================================================
// SX1262 does NOT have hardware OOK. Morse CW keying is achieved by:
//   txOn()  → radio.transmitDirect()  — continuous unmodulated FSK carrier
//   txOff() → radio.standby()         — carrier off
// This is equivalent to OOK from the receiver's perspective.
// The FSK deviation is set very narrow (0.6 kHz) so the carrier sits tightly
// on the centre frequency with no modulation; transmitDirect() holds it there.
//
// beginFSK() parameters for SX1262:
//   freq       — centre frequency (MHz)
//   br         — bit rate (kbps)  → 0.6 (slowest; not used for data TX here)
//   freqDev    — frequency deviation (kHz) → 0.6 (minimum practical)
//   rxBw       — RX bandwidth (kHz) → 9.7 (narrowest for scan sensitivity)
//   pwr        — output power (dBm) → up to 22 (RadioLib limit; E22 PA adds more)
//   preambleLen→ 16
//   tcxoVoltage→ 1.6 (V) for E22 TCXO; set 0.0 if your module has no TCXO
//   useRegulatorLDO → false (use DC-DC — lower current)
// =============================================================================

static bool radioInitialised = false;  // track if SPI already started

static void ensureSpiStarted() {
  if (!radioInitialised) {
    lora_spi.begin(PIN_SPI_SCK, PIN_SPI_MISO, PIN_SPI_MOSI, PIN_LORA_CS);
    radioInitialised = true;
  }
}

bool initRadioOOK(float freqMHz, int8_t powerDbm) {
  LOG_INFO("SX1262 CW TX init: %.3f MHz @ %d dBm", freqMHz, powerDbm);
  ensureSpiStarted();

  // Clamp power to SX1262 RadioLib maximum
  int8_t pwr = constrain(powerDbm, -9, 22);

  int s = radio.beginFSK(
    freqMHz,   // frequency
    0.6f,      // bit rate kbps (irrelevant for carrier-only keying)
    0.6f,      // freq deviation kHz (minimal — keeps carrier narrow)
    9.7f,      // RX bandwidth kHz
    pwr,       // output power dBm
    16,        // preamble length
    1.6f,      // TCXO voltage (V) — use 0.0 if no TCXO on your module
    false      // use DC-DC regulator
  );
  LOG_RF("beginFSK state=%d", s);

  if (s != RADIOLIB_ERR_NONE) {
    LOG_ERR("SX1262 TX init FAILED: %d (CS=GPIO%d RST=GPIO%d BUSY=GPIO%d DIO1=GPIO%d)",
            s, PIN_LORA_CS, PIN_LORA_RST, PIN_LORA_BUSY, PIN_LORA_DIO1);
    oledMessage("RADIO ERROR", "Check SX1262 wiring", "BUSY=GPIO21 DIO1=GPIO2");
    return false;
  }

  // Set TXEN/RXEN RF switch if your module needs it (E22 does not)
  // radio.setRfSwitchPins(PIN_LORA_RXEN, PIN_LORA_TXEN);

  LOG_OK("SX1262 CW TX ready: %.3f MHz @ %d dBm", freqMHz, pwr);
  return true;
}

bool initRadioFSK(float freqMHz) {
  LOG_INFO("SX1262 FSK RX init: %.3f MHz", freqMHz);
  ensureSpiStarted();

  int s = radio.beginFSK(
    freqMHz,   // frequency
    0.6f,      // bit rate kbps
    0.6f,      // freq deviation kHz
    9.7f,      // RX bandwidth — narrow for best sensitivity in scan mode
    2,         // output power dBm (low — RX only)
    16,        // preamble length
    1.6f,      // TCXO voltage
    false      // DC-DC regulator
  );

  if (s != RADIOLIB_ERR_NONE) {
    LOG_ERR("SX1262 RX init FAILED: %d", s);
    return false;
  }
  LOG_OK("SX1262 FSK RX ready: %.3f MHz", freqMHz);
  return true;
}

// =============================================================================
// MORSE TX ENGINE
// =============================================================================
static char g_currentPayload[128] = "SOS";   // built once per TX cycle

inline void txOn()  { radio.transmitDirect(); }
inline void txOff() { radio.standby(); }

void transmitMorseChar(char c, int idx, int totalChars,
                        int freqIdx, float freqMHz, uint32_t cycleNum) {
  c = toupper(c);
  const char* pat = nullptr;
  if      (c >= 'A' && c <= 'Z') pat = MORSE_TABLE[c - 'A'];
  else if (c >= '0' && c <= '9') pat = MORSE_TABLE[26 + (c - '0')];
  else if (c == ' ')             { delay(wordGapMs()); return; }
  else                           { return; }

  LOG_MORSE("[%d/%d] '%c' %s", idx+1, totalChars, c, pat);

  for (int i = 0; pat[i]; i++) {
    bool dot = (pat[i] == '.');
    readPots();   // update volume/WPM from pots mid-symbol

    txOn();
    if (cfg.audioEnabled) audioToneStart(AUDIO_TONE_MORSE);
    // Keep display refreshed during key-down
    oledBeacon(freqIdx, freqMHz, idx, totalChars, cycleNum, 0, true, g_currentPayload);
    delay(dot ? dotMs() : dashMs());
    txOff();
    audioToneStop();

    if (pat[i + 1]) delay(intraChrMs());
    readPots();   // check pots between elements
  }
  delay(interChrMs());
}

bool transmitMessage(const char* msg, int freqIdx, float freqMHz,
                     uint32_t cycleNum, bool interruptible = true) {
  int len = strlen(msg);
  LOG_INFO("TX: \"%s\" (%d chars) @ %dWPM", msg, len, cfg.wpm);
  uint32_t t0 = millis();

  for (int i = 0; msg[i]; i++) {
    readPots();
    digitalWrite(PIN_LED_RED, (i % 2 == 0) ? HIGH : LOW);

    if (interruptible && g_modeButtonPressed) {
      LOG_WARN("TX interrupted by mode button");
      txOff(); audioToneStop(); ledsOff();
      return false;
    }

    transmitMorseChar(msg[i], i, len, freqIdx, freqMHz, cycleNum);
    esp_task_wdt_reset();
  }

  digitalWrite(PIN_LED_RED, LOW);
  LOG_OK("TX done: %d chars in %lu ms", len, millis() - t0);
  return true;
}

// =============================================================================
// SCAN ENGINE
// =============================================================================
ScanResult scanFrequency(float freqMHz, int freqIdx, uint32_t passNum) {
  ScanResult r = {freqMHz, -120, false};
  if (!initRadioFSK(freqMHz)) return r;
  radio.startReceive();

  int16_t  maxRssi  = -120;
  uint32_t dwellEnd = millis() + cfg.scanDwellMs;

  while (millis() < dwellEnd) {
    readPots();
    readGPS();
    int16_t rssi = radio.getRSSI();
    if (rssi > maxRssi) maxRssi = rssi;
    uint32_t tf = audioSearchTone(rssi);
    if (tf) audioToneStart(tf); else audioToneStop();
    oledSearch(freqIdx, freqMHz, rssi, passNum, rssi >= cfg.rssiThreshold);
    delay(20);
    esp_task_wdt_reset();
  }

  audioToneStop();
  radio.standby();
  r.rssi     = maxRssi;
  r.detected = (maxRssi >= cfg.rssiThreshold);

  int bars = (int)constrain(map(maxRssi, -120, -40, 0, 20), 0, 20);
  char bar[22] = "                    ";
  for (int b = 0; b < bars; b++) bar[b] = '#';
  LOG_SCAN("[%d] %.3f MHz  %4d dBm  |%s|  %s",
           freqIdx, freqMHz, maxRssi, bar, r.detected ? "*** HIT ***" : "quiet");
  return r;
}

void recordScanHit(float freq, int16_t rssi) {
  ScanHit hit;
  hit.freq = freq; hit.rssi = rssi; hit.timestamp = millis();
  if      (rssi >= -60) strlcpy(hit.label, "STRONG", sizeof(hit.label));
  else if (rssi >= -80) strlcpy(hit.label, "MEDIUM", sizeof(hit.label));
  else                  strlcpy(hit.label, "WEAK",   sizeof(hit.label));

  if (g_scanHitCount < MAX_SCAN_HITS) {
    g_scanHits[g_scanHitCount++] = hit;
  } else {
    memmove(g_scanHits, g_scanHits + 1, (MAX_SCAN_HITS - 1) * sizeof(ScanHit));
    g_scanHits[MAX_SCAN_HITS - 1] = hit;
  }
  LOG_SCAN("HIT: %.3f MHz  %d dBm  [%s]  total=%d", freq, rssi, hit.label, g_scanHitCount);
  blinkLed(PIN_LED_BLUE, 3, 60);
  if (cfg.audioEnabled) {
    audioTone(440, 80); delay(40); audioTone(880, 80); delay(40); audioTone(1760, 160);
  }
}

void printStatus() {
  dbSep("DEVICE STATUS");
  LOG_INFO("Boot      : #%lu  Mode: %s", g_bootCycle, modeName(g_currentMode));
  LOG_INFO("TX cycles : %lu   Scan: %lu", g_txCycles, g_scanCycles);
  LOG_INFO("Heap      : %lu B   Up: %lu s", ESP.getFreeHeap(), millis() / 1000);
  LOG_INFO("OLED      : %s", g_oledOk ? "OK" : "FAIL");
  LOG_INFO("GPS       : valid=%s  sats=%d  lat=%.5f  lng=%.5f",
           g_gpsFix.valid?"YES":"NO", g_gpsFix.satellites, g_gpsFix.lat, g_gpsFix.lng);
  LOG_INFO("WPM pot   : %d  Vol pot: %d", cfg.wpm, cfg.audioVolume);
  LOG_INFO("Payload   : \"%s\"", g_currentPayload);
  dbSep();
}

// =============================================================================
// CAPTIVE PORTAL DASHBOARD
// (Full HTML with GPS + identity + pot controls sections)
// =============================================================================
const char DASHBOARD_HTML[] PROGMEM = R"HTMLDOC(
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AEGIS-BEACON v5.1 // CONFIG</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;600;900&display=swap');
:root{
  --bg:#07090e;--s1:#0b1019;--s2:#0f1825;--border:#182640;
  --a1:#00e5ff;--a2:#ff3b3b;--a3:#39ff14;--a4:#ff9900;--a5:#b060ff;
  --txt:#b8ccd8;--dim:#3a5060;--dim2:#2a3a48;
  --glow1:0 0 18px rgba(0,229,255,.35);--glow2:0 0 18px rgba(255,59,59,.35);
  --glow3:0 0 18px rgba(57,255,20,.35);--glow5:0 0 18px rgba(176,96,255,.35);
  --r:5px;--r2:10px;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--txt);font-family:'Share Tech Mono',monospace;min-height:100vh;
  background-image:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(0,100,160,.18) 0%,transparent 70%),
  repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(0,229,255,.025) 48px,rgba(0,229,255,.025) 49px),
  repeating-linear-gradient(90deg,transparent,transparent 48px,rgba(0,229,255,.025) 48px,rgba(0,229,255,.025) 49px);}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
header{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;
  border-bottom:1px solid var(--border);background:linear-gradient(90deg,rgba(0,229,255,.04),transparent,rgba(0,229,255,.04));
  position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);}
.logo{font-family:'Orbitron',sans-serif;font-weight:900;font-size:1.15rem;color:var(--a1);text-shadow:var(--glow1);letter-spacing:4px;}
.logo em{color:var(--a2);font-style:normal;}
.badge{font-size:.58rem;color:var(--a1);border:1px solid var(--a1);padding:3px 9px;border-radius:2px;letter-spacing:3px;animation:pulse 2.5s infinite;}
@keyframes pulse{0%,100%{opacity:1;box-shadow:var(--glow1)}50%{opacity:.4;box-shadow:none}}
main{max-width:1000px;margin:0 auto;padding:24px 18px;display:grid;gap:16px;grid-template-columns:1fr 1fr;}
@media(max-width:640px){main{grid-template-columns:1fr}}
.card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r2);padding:20px;position:relative;overflow:hidden;transition:border-color .25s;}
.card:hover{border-color:rgba(0,229,255,.22);}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--a1),transparent);opacity:.5;}
.card.full{grid-column:1/-1}
.card.alert::before{background:linear-gradient(90deg,transparent,var(--a2),transparent);}
.card.ok::before{background:linear-gradient(90deg,transparent,var(--a3),transparent);}
.card.audio::before{background:linear-gradient(90deg,transparent,var(--a4),transparent);}
.card.gps::before{background:linear-gradient(90deg,transparent,var(--a3),transparent);}
.card.id::before{background:linear-gradient(90deg,transparent,var(--a5),transparent);}
.card.pot::before{background:linear-gradient(90deg,transparent,var(--a4),transparent);}
.ct{font-family:'Orbitron',sans-serif;font-size:.62rem;letter-spacing:3px;color:var(--a1);margin-bottom:16px;text-transform:uppercase;display:flex;align-items:center;gap:7px;}
.ct-dot{width:6px;height:6px;border-radius:50%;background:var(--a1);box-shadow:var(--glow1);animation:pulse 2.5s infinite;}
.card.alert .ct,.card.alert .ct-dot{color:var(--a2);background:var(--a2);box-shadow:var(--glow2);}
.card.ok .ct,.card.ok .ct-dot,.card.gps .ct,.card.gps .ct-dot{color:var(--a3);background:var(--a3);box-shadow:var(--glow3);}
.card.audio .ct,.card.audio .ct-dot,.card.pot .ct,.card.pot .ct-dot{color:var(--a4);background:var(--a4);}
.card.id .ct,.card.id .ct-dot{color:var(--a5);background:var(--a5);box-shadow:var(--glow5);}
label{display:block;font-size:.66rem;color:var(--dim);margin-bottom:4px;letter-spacing:1px;}
.form-row{margin-bottom:14px;}
input[type=text],input[type=number],textarea,select{width:100%;background:#050810;border:1px solid var(--border);border-radius:var(--r);color:var(--txt);font-family:'Share Tech Mono',monospace;font-size:.85rem;padding:8px 11px;outline:none;transition:border-color .2s,box-shadow .2s;}
input:focus,textarea:focus,select:focus{border-color:var(--a1);box-shadow:0 0 0 2px rgba(0,229,255,.1);}
input[type=range]{-webkit-appearance:none;width:100%;height:5px;background:var(--border);border-radius:3px;outline:none;margin:9px 0 3px;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:17px;height:17px;border-radius:50%;background:var(--a1);cursor:pointer;box-shadow:var(--glow1);}
input[type=range].audio-range::-webkit-slider-thumb{background:var(--a4);}
input[type=range].wpm-range::-webkit-slider-thumb{background:var(--a2);}
.tog-wrap{display:flex;align-items:center;gap:11px;cursor:pointer;margin-top:3px;}
.tog-cb{position:relative;width:42px;height:22px;flex-shrink:0;}
.tog-cb input{opacity:0;width:0;height:0;}
.tog-slider{position:absolute;inset:0;background:var(--dim2);border-radius:11px;cursor:pointer;transition:background .25s;border:1px solid var(--border);}
.tog-slider::before{content:'';position:absolute;width:16px;height:16px;left:2px;top:2px;background:#666;border-radius:50%;transition:transform .25s,background .25s;}
.tog-cb input:checked+.tog-slider{background:rgba(0,229,255,.15);border-color:var(--a1);}
.tog-cb input:checked+.tog-slider::before{transform:translateX(20px);background:var(--a1);box-shadow:var(--glow1);}
.tog-lbl{font-size:.76rem;color:var(--txt);}
.info-box{background:#050810;border:1px solid var(--dim2);border-radius:var(--r);padding:10px 12px;font-size:.66rem;color:var(--dim);line-height:1.8;margin-top:8px;}
.coord-display{font-family:'Orbitron',sans-serif;font-size:.85rem;color:var(--a3);text-shadow:var(--glow3);text-align:center;margin:8px 0;letter-spacing:2px;}
#morsePreview{font-size:.88rem;letter-spacing:4px;color:var(--a1);word-break:break-all;min-height:22px;margin-top:7px;}
.payload-preview{background:#000;border:2px solid var(--a1);border-radius:4px;padding:9px 11px;font-family:'Share Tech Mono',monospace;font-size:.78rem;color:#fff;letter-spacing:2px;margin-top:8px;word-break:break-all;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 18px;border-radius:var(--r);font-family:'Orbitron',sans-serif;font-size:.62rem;letter-spacing:2px;cursor:pointer;border:1px solid;transition:all .2s;text-transform:uppercase;white-space:nowrap;}
.btn:disabled{opacity:.4;cursor:not-allowed;}
.btn-c{background:rgba(0,229,255,.08);border-color:var(--a1);color:var(--a1);}
.btn-c:hover:not(:disabled){background:rgba(0,229,255,.18);box-shadow:var(--glow1);}
.btn-d{background:rgba(255,59,59,.08);border-color:var(--a2);color:var(--a2);}
.btn-d:hover:not(:disabled){background:rgba(255,59,59,.2);box-shadow:var(--glow2);}
.btn-g{background:rgba(57,255,20,.08);border-color:var(--a3);color:var(--a3);}
.btn-g:hover:not(:disabled){background:rgba(57,255,20,.18);box-shadow:var(--glow3);}
.btn-save{width:100%;padding:13px;font-size:.73rem;background:linear-gradient(135deg,rgba(0,229,255,.12),rgba(0,120,160,.12));border-color:var(--a1);color:var(--a1);margin-top:3px;}
.btn-save:hover{background:rgba(0,229,255,.22);box-shadow:var(--glow1);}
.btn-row{display:flex;gap:9px;flex-wrap:wrap;}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.stat-item{background:#050810;border:1px solid var(--dim2);border-radius:var(--r);padding:9px 12px;}
.stat-lbl{font-size:.58rem;color:var(--dim);letter-spacing:1px;margin-bottom:2px;}
.stat-val{font-family:'Orbitron',sans-serif;font-size:.82rem;color:var(--a1);}
.stat-val.ok{color:var(--a3);}.stat-val.warn{color:var(--a4);}.stat-val.err{color:var(--a2);}
#freqList{list-style:none;margin-bottom:11px;}
#freqList li{display:flex;align-items:center;gap:7px;padding:7px 10px;background:#050810;border:1px solid var(--border);border-radius:var(--r);margin-bottom:4px;font-size:.82rem;}
.fv{flex:1;color:var(--a1);font-family:'Orbitron',sans-serif;font-size:.78rem;}
.del{background:none;border:1px solid #2a1010;color:var(--a2);padding:2px 7px;border-radius:3px;cursor:pointer;font-size:.68rem;}
.del:hover{background:rgba(255,59,59,.12);}
.add-row{display:flex;gap:7px;}.add-row input{flex:1;}
#scanList{max-height:180px;overflow-y:auto;margin-top:7px;}
.hit-row{display:flex;align-items:center;gap:9px;padding:5px 9px;border-bottom:1px solid var(--dim2);font-size:.75rem;}
.hit-freq{color:var(--a1);font-family:'Orbitron',sans-serif;font-size:.73rem;min-width:95px;}
.rssi-bar-bg{flex:1;height:6px;background:var(--dim2);border-radius:3px;overflow:hidden;}
.rssi-bar{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--a2),var(--a4),var(--a3));}
.rssi-val{color:var(--txt);font-size:.72rem;min-width:55px;text-align:right;}
.hit-lbl{font-size:.62rem;padding:1px 6px;border-radius:2px;font-family:'Orbitron',sans-serif;letter-spacing:1px;}
.hit-lbl.STRONG{background:rgba(57,255,20,.12);color:var(--a3);border:1px solid var(--a3);}
.hit-lbl.MEDIUM{background:rgba(255,153,0,.1);color:var(--a4);border:1px solid var(--a4);}
.hit-lbl.WEAK{background:rgba(0,229,255,.07);color:var(--a1);border:1px solid var(--a1);}
.emg-btn{width:100%;padding:14px;font-size:.72rem;letter-spacing:3px;background:rgba(255,59,59,.12);border:2px solid var(--a2);color:var(--a2);animation:emgPulse 2s infinite;font-family:'Orbitron',sans-serif;cursor:pointer;}
@keyframes emgPulse{0%,100%{box-shadow:var(--glow2)}50%{box-shadow:none}}
.emg-btn:hover{background:rgba(255,59,59,.25);}
.section-hdr{grid-column:1/-1;display:flex;align-items:center;gap:14px;margin-top:6px;}
.section-hdr span{font-family:'Orbitron',sans-serif;font-size:.6rem;letter-spacing:4px;color:var(--dim);white-space:nowrap;}
.section-hdr::before,.section-hdr::after{content:'';flex:1;height:1px;background:var(--border);}
.knob-wrap{display:flex;gap:20px;justify-content:center;margin:10px 0;}
.knob{display:flex;flex-direction:column;align-items:center;gap:4px;}
.knob-ring{width:64px;height:64px;border-radius:50%;border:3px solid var(--a4);background:var(--s2);position:relative;box-shadow:0 0 12px rgba(255,153,0,.2);}
.knob-marker{position:absolute;width:3px;height:18px;background:var(--a4);left:50%;top:6px;transform-origin:50% 26px;transform:translateX(-50%);}
.knob-label{font-family:'Orbitron',sans-serif;font-size:.56rem;letter-spacing:2px;color:var(--a4);}
.knob-val{font-family:'Orbitron',sans-serif;font-size:.9rem;color:var(--a4);}
</style>
</head>
<body>
<header>
  <div class="logo">AEGIS<em>-</em>BEACON <span style="font-size:.65rem;color:var(--dim);margin-left:8px;">v5.1</span></div>
  <div class="badge">CONFIG MODE</div>
</header>
<main>

<!-- ── MODE ────────────────────────────────────────────────────────────── -->
<div class="card full">
  <div class="ct"><span class="ct-dot"></span>OPERATING MODE</div>
  <div style="display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
      <div style="font-family:'Orbitron',sans-serif;font-size:.6rem;letter-spacing:3px;color:var(--dim);">ACTIVE MODE</div>
      <div style="position:relative;width:176px;height:46px;background:var(--s1);border-radius:23px;cursor:pointer;border:2px solid var(--border);transition:border-color .3s;" id="modeSwitch" onclick="toggleMode()">
        <div id="modeKnob" style="position:absolute;top:4px;width:80px;height:34px;border-radius:19px;transition:left .3s;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',sans-serif;font-size:.58rem;letter-spacing:2px;font-weight:600;left:4px;background:var(--a2);color:#fff;box-shadow:var(--glow2);">BEACON</div>
      </div>
      <div style="display:flex;width:176px;justify-content:space-between;font-size:.62rem;"><span style="color:var(--a2)">BEACON</span><span style="color:var(--a1)">SEARCH</span></div>
    </div>
    <div style="flex:1;min-width:220px;">
      <div style="font-size:.62rem;color:var(--dim);margin-bottom:4px;letter-spacing:1px;">MORSE PAYLOAD PREVIEW</div>
      <div class="payload-preview" id="payloadPreview">SOS</div>
    </div>
  </div>
</div>

<!-- ── BEACON ──────────────────────────────────────────────────────────── -->
<div class="card alert">
  <div class="ct"><span class="ct-dot"></span>BEACON SETTINGS</div>
  <div class="form-row">
    <label>SOS MESSAGE BASE</label>
    <input type="text" id="msg" maxlength="30" oninput="updatePayloadPreview()" value="SOS">
    <div id="morsePreview"></div>
  </div>
  <div class="form-row">
    <label>TX POWER (dBm) — <span id="pwrVal">17</span></label>
    <input type="range" id="pwr" min="2" max="20" value="17" oninput="document.getElementById('pwrVal').textContent=this.value">
  </div>
  <div class="form-row">
    <label>SLEEP INTERVAL (s) — <span id="sleepVal">10</span></label>
    <input type="range" id="sleep" min="1" max="300" value="10" oninput="document.getElementById('sleepVal').textContent=this.value">
  </div>
  <div class="form-row">
    <label>REPEAT COUNT — <span id="repVal">1</span></label>
    <input type="range" id="rep" min="1" max="10" value="1" oninput="document.getElementById('repVal').textContent=this.value">
  </div>
</div>

<!-- ── IDENTITY ────────────────────────────────────────────────────────── -->
<div class="card id">
  <div class="ct"><span class="ct-dot"></span>IDENTITY (NAME IN MORSE)</div>
  <div class="form-row">
    <label class="tog-wrap">
      <span class="tog-cb"><input type="checkbox" id="nameEn" onchange="updatePayloadPreview()"><span class="tog-slider"></span></span>
      <span class="tog-lbl">INCLUDE NAME IN BEACON</span>
    </label>
  </div>
  <div class="form-row">
    <label>FIRST NAME</label>
    <input type="text" id="fname" maxlength="20" placeholder="MARIO" oninput="updatePayloadPreview()" style="text-transform:uppercase">
  </div>
  <div class="form-row">
    <label>LAST NAME</label>
    <input type="text" id="lname" maxlength="20" placeholder="ROSSI" oninput="updatePayloadPreview()" style="text-transform:uppercase">
  </div>
  <div class="info-box">
    When enabled, the beacon transmits:<br>
    <span style="color:var(--a5)">SOS DE [FIRSTNAME] [LASTNAME]</span><br>
    Only capital letters A–Z are transmitted.<br>
    Keep names short to minimise TX time.
  </div>
</div>

<!-- ── GPS ─────────────────────────────────────────────────────────────── -->
<div class="card gps">
  <div class="ct"><span class="ct-dot"></span>GPS (NEO-6M MODULE)</div>
  <div class="form-row">
    <label class="tog-wrap">
      <span class="tog-cb"><input type="checkbox" id="gpsEn" onchange="updatePayloadPreview()"><span class="tog-slider"></span></span>
      <span class="tog-lbl">ENABLE GPS MODULE</span>
    </label>
  </div>
  <div class="form-row">
    <label class="tog-wrap">
      <span class="tog-cb"><input type="checkbox" id="gpsBeacon" onchange="updatePayloadPreview()"><span class="tog-slider"></span></span>
      <span class="tog-lbl">TRANSMIT COORDINATES IN BEACON</span>
    </label>
  </div>
  <div class="form-row">
    <label>FIX WAIT TIMEOUT (s) — <span id="gpsTmoVal">30</span></label>
    <input type="range" id="gpsTmo" min="10" max="120" value="30" oninput="document.getElementById('gpsTmoVal').textContent=this.value">
  </div>
  <div class="coord-display" id="gpsCoordDisplay">NO FIX</div>
  <div class="info-box">
    GPS: RX=GPIO34  TX=GPIO12  9600 baud<br>
    Format: <span style="color:var(--a3)">SOS PSN N4553 E01230</span><br>
    N4553 = 45°53' N — concise for Morse.<br>
    Stale fix (post deep-sleep) still transmitted.
  </div>
</div>

<!-- ── BUTTON CONTROLS ─────────────────────────────────────────────────── -->
<div class="card pot full">
  <div class="ct"><span class="ct-dot"></span>BUTTON CONTROLS (v5.3)</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;align-items:start;">
    <div>
      <div style="font-family:'Orbitron',sans-serif;font-size:.62rem;letter-spacing:2px;color:var(--a4);margin-bottom:8px;">SW_SEL — GPIO32</div>
      <div class="info-box">
        Short press: toggle VOL / WPM adjust target.<br>
        Long 3s: enter Config (WiFi AP mode).<br>
        OLED overlay shows active target.
      </div>
    </div>
    <div>
      <div style="font-family:'Orbitron',sans-serif;font-size:.62rem;letter-spacing:2px;color:var(--a4);margin-bottom:8px;">SW_UP — GPIO35</div>
      <div class="info-box">
        Increment: Volume +10 or WPM +1.<br>
        Auto-repeat after 500ms hold.<br>
        Updates live, no reboot needed.
      </div>
    </div>
    <div>
      <div style="font-family:'Orbitron',sans-serif;font-size:.62rem;letter-spacing:2px;color:var(--a4);margin-bottom:8px;">SW_DN — GPIO34</div>
      <div class="info-box">
        Decrement: Volume -10 or WPM -1.<br>
        Auto-repeat after 500ms hold.<br>
        Vol range: 20-255. WPM range: 5-40.
      </div>
    </div>
  </div>
</div>

<!-- ── SEARCH ──────────────────────────────────────────────────────────── -->
<div class="card">
  <div class="ct"><span class="ct-dot"></span>SEARCH SETTINGS</div>
  <div class="form-row">
    <label>SCAN FREQUENCIES (MHz)</label>
    <ul id="freqList"></ul>
    <div class="add-row">
      <input type="number" id="newFreq" step="0.001" min="410" max="525" placeholder="433.500">
      <button class="btn btn-c" onclick="addFreq()">+ ADD</button>
    </div>
  </div>
  <div class="form-row">
    <label>DWELL TIME (ms) — <span id="dwellVal">400</span></label>
    <input type="range" id="dwell" min="50" max="2000" value="400" oninput="document.getElementById('dwellVal').textContent=this.value">
  </div>
  <div class="form-row">
    <label>RSSI THRESHOLD (dBm) — <span id="rssiVal">-90</span></label>
    <input type="range" id="rssiThr" min="-120" max="-40" value="-90" oninput="document.getElementById('rssiVal').textContent=this.value">
  </div>
</div>

<!-- ── AUDIO ───────────────────────────────────────────────────────────── -->
<div class="card audio">
  <div class="ct"><span class="ct-dot"></span>AUDIO (DEFAULT — OVERRIDDEN BY POT)</div>
  <div class="form-row">
    <label class="tog-wrap">
      <span class="tog-cb"><input type="checkbox" id="audioEn" checked><span class="tog-slider"></span></span>
      <span class="tog-lbl">AUDIO ENABLED</span>
    </label>
  </div>
  <div class="form-row">
    <label>DEFAULT VOLUME — <span id="volVal">70</span>% (ignored if pot enabled)</label>
    <input type="range" class="audio-range" id="vol" min="0" max="255" value="180"
      oninput="document.getElementById('volVal').textContent=Math.round(this.value/255*100)">
  </div>
  <div class="form-row">
    <label>DEFAULT WPM — <span id="wpmVal">13</span> (ignored if pot enabled)</label>
    <input type="range" class="wpm-range" id="wpm" min="5" max="40" value="13"
      oninput="document.getElementById('wpmVal').textContent=this.value;updatePayloadPreview()">
  </div>
</div>

<!-- ── RADIO ───────────────────────────────────────────────────────────── -->
<div class="card alert">
  <div class="ct"><span class="ct-dot"></span>RADIO (SX1262)</div>
  <div class="form-row">
    <label>TX POWER (dBm) — <span id="pwrVal2">17</span></label>
    <input type="range" id="pwr2" min="-9" max="22" value="17" oninput="document.getElementById('pwrVal2').textContent=this.value;document.getElementById('pwr').value=this.value;document.getElementById('pwrVal').textContent=this.value">
    <div class="info-box" style="margin-top:6px;">
      SX1262 RadioLib range: −9 to +22 dBm.<br>
      E22-400M30S onboard PA: up to +30 dBm.<br>
      Emergency mode always uses +22 dBm.
    </div>
  </div>
  <div class="info-box">
    SCK=GPIO18  MISO=GPIO19  MOSI=GPIO23<br>
    CS=GPIO5   RST=GPIO14   BUSY=GPIO21<br>
    DIO1=GPIO2  TCXO=1.6V<br>
    <span style="color:var(--a2)">⚠ BUSY pin must be wired or radio hangs</span>
  </div>
</div>

<!-- ── DISPLAY ─────────────────────────────────────────────────────────── -->
<div class="card">
  <div class="ct"><span class="ct-dot"></span>DISPLAY (SSD1309 2.42")</div>
  <div class="form-row">
    <label class="tog-wrap">
      <span class="tog-cb"><input type="checkbox" id="oledEn" checked><span class="tog-slider"></span></span>
      <span class="tog-lbl">OLED ENABLED</span>
    </label>
  </div>
  <div class="form-row">
    <label class="tog-wrap">
      <span class="tog-cb"><input type="checkbox" id="oledInv"><span class="tog-slider"></span></span>
      <span class="tog-lbl">INVERT DISPLAY</span>
    </label>
  </div>
  <div class="info-box">
    OLED: SSD1309 2.42" 128×64 (sw SPI)<br>
    SCK=GPIO15  SDA=GPIO13  RES=GPIO4<br>
    DC=GPIO16   CS=GPIO17<br>
    Driver: U8g2 full-frame buffer
  </div>
<div class="card ok full">
  <div class="ct"><span class="ct-dot"></span>DEVICE STATUS</div>
  <div class="stat-grid" id="statGrid">
    <div class="stat-item"><div class="stat-lbl">BOOT CYCLES</div><div class="stat-val" id="sBoot">—</div></div>
    <div class="stat-item"><div class="stat-lbl">FREE HEAP</div><div class="stat-val" id="sHeap">—</div></div>
    <div class="stat-item"><div class="stat-lbl">GPS FIX</div><div class="stat-val" id="sGps">—</div></div>
    <div class="stat-item"><div class="stat-lbl">SATELLITES</div><div class="stat-val" id="sSats">—</div></div>
    <div class="stat-item"><div class="stat-lbl">LIVE WPM</div><div class="stat-val" id="sWpm">—</div></div>
    <div class="stat-item"><div class="stat-lbl">LIVE VOLUME</div><div class="stat-val" id="sVol">—</div></div>
    <div class="stat-item"><div class="stat-lbl">TX CYCLES</div><div class="stat-val" id="sTx">—</div></div>
    <div class="stat-item"><div class="stat-lbl">SCAN HITS</div><div class="stat-val" id="sHits">—</div></div>
  </div>
</div>

<!-- ── SCAN HITS ────────────────────────────────────────────────────────── -->
<div class="card full">
  <div class="ct"><span class="ct-dot"></span>SCAN HIT HISTORY</div>
  <div id="scanList"><div style="color:var(--dim);font-size:.73rem;padding:14px 0;text-align:center;">No signals detected yet.</div></div>
</div>

<!-- ── EMERGENCY ────────────────────────────────────────────────────────── -->
<div class="card alert full">
  <div class="ct"><span class="ct-dot"></span>EMERGENCY</div>
  <p style="font-size:.72rem;color:var(--dim);margin-bottom:14px;">
    Emergency mode transmits high-power SOS continuously, including your name and GPS position if enabled.
    Cannot be cancelled remotely — use MODE button (hold 2s) on the device.
  </p>
  <button class="emg-btn" onclick="confirmEmergency()">⚡ ACTIVATE EMERGENCY SOS ⚡</button>
</div>

<!-- ── SAVE ─────────────────────────────────────────────────────────────── -->
<div class="card full">
  <div class="ct"><span class="ct-dot"></span>SAVE & CONTROL</div>
  <div class="btn-row" style="margin-bottom:12px;">
    <button class="btn btn-g btn-save" onclick="saveConfig()">💾 SAVE &amp; REBOOT</button>
  </div>
  <div class="btn-row">
    <button class="btn btn-c" onclick="fetchStatus()">↺ REFRESH STATUS</button>
    <button class="btn btn-d" onclick="confirmFactory()">⚠ FACTORY RESET</button>
  </div>
</div>

</main>
<script>
// ── Morse table ──────────────────────────────────────────────────────────────
const MORSE={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'};
function toMorse(s){return s.toUpperCase().split('').map(c=>MORSE[c]||' ').join('  ');}

// ── Mode toggle ───────────────────────────────────────────────────────────────
let modeBeacon=true;
function toggleMode(){
  modeBeacon=!modeBeacon;
  const sw=document.getElementById('modeSwitch');
  const kn=document.getElementById('modeKnob');
  if(modeBeacon){sw.style.borderColor='var(--a2)';kn.style.left='4px';kn.style.background='var(--a2)';kn.style.boxShadow='var(--glow2)';kn.textContent='BEACON';}
  else{sw.style.borderColor='var(--a1)';kn.style.left='88px';kn.style.background='var(--a1)';kn.style.color='#000';kn.style.boxShadow='var(--glow1)';kn.textContent='SEARCH';}
}

// ── Payload preview ───────────────────────────────────────────────────────────
function buildPayload(){
  let s=document.getElementById('msg').value.toUpperCase()||'SOS';
  const nameEn=document.getElementById('nameEn').checked;
  const fname=(document.getElementById('fname').value||'').toUpperCase().trim();
  const lname=(document.getElementById('lname').value||'').toUpperCase().trim();
  if(nameEn&&(fname||lname)){
    s+=' DE';
    if(fname) s+=' '+fname;
    if(lname) s+=' '+lname;
  }
  const gpsEn=document.getElementById('gpsEn').checked;
  const gpsBeacon=document.getElementById('gpsBeacon').checked;
  if(gpsEn&&gpsBeacon) s+=' PSN N4553 E01230';  // placeholder
  return s;
}
function updatePayloadPreview(){
  const pl=buildPayload();
  document.getElementById('payloadPreview').textContent=pl;
  document.getElementById('morsePreview').textContent=toMorse(pl);
}
updatePayloadPreview();

// ── Frequency list ────────────────────────────────────────────────────────────
let freqs=[433.500];
function renderFreqs(){
  const ul=document.getElementById('freqList');ul.innerHTML='';
  freqs.forEach((f,i)=>{
    const li=document.createElement('li');
    li.innerHTML=`<span class="fv">${f.toFixed(3)} MHz</span><span style="color:var(--dim);font-size:.61rem;">CH ${i+1}</span><button class="del" onclick="delFreq(${i})">✕</button>`;
    ul.appendChild(li);
  });
}
function addFreq(){const v=parseFloat(document.getElementById('newFreq').value);if(isNaN(v)||v<410||v>525||freqs.length>=10)return;freqs.push(v);document.getElementById('newFreq').value='';renderFreqs();}
function delFreq(i){if(freqs.length<=1)return;freqs.splice(i,1);renderFreqs();}
renderFreqs();

// ── Knob visual (decorative) ──────────────────────────────────────────────────
function updateKnob(markerId, valId, rawVal, min, max, suffix){
  const pct=(rawVal-min)/(max-min);
  const deg=-140+pct*280;
  document.getElementById(markerId).style.transform=`translateX(-50%) rotate(${deg}deg)`;
  document.getElementById(valId).textContent=rawVal+suffix;
}

// ── Status fetch ──────────────────────────────────────────────────────────────
function fetchStatus(){
  fetch('/status').then(r=>r.json()).then(d=>{
    document.getElementById('sBoot').textContent='#'+d.boot;
    document.getElementById('sHeap').textContent=Math.round(d.heap/1024)+'KB';
    document.getElementById('sTx').textContent=d.tx;
    document.getElementById('sHits').textContent=d.hits;
    document.getElementById('sGps').textContent=d.gpsFix?'VALID':'NO FIX';
    document.getElementById('sGps').className='stat-val '+(d.gpsFix?'ok':'warn');
    document.getElementById('sSats').textContent=d.gpsSats;
    document.getElementById('sWpm').textContent=d.wpm+' WPM';
    document.getElementById('sVol').textContent=Math.round(d.vol*100/255)+'%';
    // Update knobs
    updateKnob('volKnobMarker','volKnobVal',Math.round(d.vol*100/255),0,100,'%');
    updateKnob('wpmKnobMarker','wpmKnobVal',d.wpm,5,40,' WPM');
    // GPS coords display
    if(d.gpsFix) document.getElementById('gpsCoordDisplay').textContent=d.gpsLat.toFixed(4)+'  '+d.gpsLng.toFixed(4);
    // Scan hits
    if(d.scanHits&&d.scanHits.length>0){
      const sl=document.getElementById('scanList');sl.innerHTML='';
      d.scanHits.forEach(h=>{
        const pct=Math.max(0,Math.min(100,(h.rssi+120)*100/80));
        const row=document.createElement('div');row.className='hit-row';
        row.innerHTML=`<span class="hit-freq">${h.freq.toFixed(3)} MHz</span><div class="rssi-bar-bg"><div class="rssi-bar" style="width:${pct}%"></div></div><span class="rssi-val">${h.rssi} dBm</span><span class="hit-lbl ${h.label}">${h.label}</span>`;
        sl.appendChild(row);
      });
    }
  }).catch(()=>{});
}
fetchStatus();
setInterval(fetchStatus,4000);

// ── Save ────────────────────────────────────────────────────────────────────
function saveConfig(){
  const data={
    msg:document.getElementById('msg').value,
    wpm:parseInt(document.getElementById('wpm').value),
    pwr:parseInt(document.getElementById('pwr').value),
    sleep:parseInt(document.getElementById('sleep').value),
    rep:parseInt(document.getElementById('rep').value),
    dwell:parseInt(document.getElementById('dwell').value),
    rssi:parseInt(document.getElementById('rssiThr').value),
    mode:modeBeacon?0:1,
    aen:document.getElementById('audioEn').checked?1:0,
    avol:parseInt(document.getElementById('vol').value),
    olen:document.getElementById('oledEn').checked?1:0,
    olinv:document.getElementById('oledInv').checked?1:0,
    gpsen:document.getElementById('gpsEn').checked?1:0,
    gpsbeac:document.getElementById('gpsBeacon').checked?1:0,
    gpstmo:parseInt(document.getElementById('gpsTmo').value),
    namen:document.getElementById('nameEn').checked?1:0,
    fname:document.getElementById('fname').value.toUpperCase(),
    lname:document.getElementById('lname').value.toUpperCase(),
    poten:0,
    potwpm:0,
    freqs:freqs
  };
  fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
    .then(r=>r.text()).then(()=>alert('Saved! Device rebooting...'))
    .catch(()=>alert('Save failed — check connection.'));
}

function confirmEmergency(){if(confirm('ACTIVATE EMERGENCY SOS?\n\nTransmits high-power SOS with name+GPS. Cannot be stopped remotely.')){fetch('/emergency',{method:'POST'});}}
function confirmFactory(){if(confirm('FACTORY RESET?\n\nAll settings will be erased.')){fetch('/factory',{method:'POST'}).then(()=>setTimeout(()=>location.reload(),4000));}}
</script>
</body>
</html>
)HTMLDOC";

// =============================================================================
// WEB SERVER HANDLERS
// =============================================================================
void handleRoot()     { server.send_P(200, "text/html", DASHBOARD_HTML); }
void handleNotFound() { server.sendHeader("Location", "/"); server.send(302); }

void handleStatus() {
  StaticJsonDocument<768> doc;
  doc["boot"]   = g_bootCycle;
  doc["heap"]   = ESP.getFreeHeap();
  doc["tx"]     = g_txCycles;
  doc["hits"]   = g_scanHitCount;
  doc["uptime"] = millis() / 1000;
  doc["oled"]   = g_oledOk;
  doc["mode"]   = (int)g_currentMode;
  doc["wpm"]    = cfg.wpm;
  doc["vol"]    = cfg.audioVolume;
  doc["gpsFix"] = g_gpsFix.valid;
  doc["gpsSats"]= g_gpsFix.satellites;
  doc["gpsLat"] = g_gpsFix.lat;
  doc["gpsLng"] = g_gpsFix.lng;
  doc["payload"]= g_currentPayload;

  JsonArray hits = doc.createNestedArray("scanHits");
  int start = (g_scanHitCount > 5) ? g_scanHitCount - 5 : 0;
  for (int i = start; i < g_scanHitCount; i++) {
    JsonObject h = hits.createNestedObject();
    h["freq"]  = g_scanHits[i].freq;
    h["rssi"]  = g_scanHits[i].rssi;
    h["label"] = g_scanHits[i].label;
  }
  String out;
  serializeJson(doc, out);
  server.send(200, "application/json", out);
}

void handleSave() {
  if (!server.hasArg("plain")) { server.send(400); return; }
  StaticJsonDocument<1024> doc;
  if (deserializeJson(doc, server.arg("plain"))) { server.send(400); return; }

  if (doc.containsKey("msg"))     strlcpy(cfg.message,   doc["msg"]   | DEFAULT_MESSAGE, MAX_MESSAGE_LEN);
  if (doc.containsKey("wpm"))     cfg.wpm           = constrain((int)doc["wpm"],   5,  40);
  if (doc.containsKey("pwr"))     cfg.powerDbm      = constrain((int)doc["pwr"],   2,  20);
  if (doc.containsKey("sleep"))   cfg.sleepSec      = constrain((int)doc["sleep"], 1, 600);
  if (doc.containsKey("rep"))     cfg.repeatCount   = constrain((int)doc["rep"],   1,  10);
  if (doc.containsKey("dwell"))   cfg.scanDwellMs   = constrain((int)doc["dwell"],50,2000);
  if (doc.containsKey("rssi"))    cfg.rssiThreshold = constrain((int)doc["rssi"], -120,-40);
  if (doc.containsKey("mode"))    cfg.lastMode      = ((int)doc["mode"]==1) ? MODE_SEARCH : MODE_BEACON;
  if (doc.containsKey("aen"))     cfg.audioEnabled  = (bool)(int)doc["aen"];
  if (doc.containsKey("avol"))    cfg.audioVolume   = constrain((int)doc["avol"],  0,255);
  if (doc.containsKey("olen"))    cfg.oledEnabled   = (bool)(int)doc["olen"];
  if (doc.containsKey("olinv"))   cfg.oledInvert    = (bool)(int)doc["olinv"];
  if (doc.containsKey("gpsen"))   cfg.gpsEnabled    = (bool)(int)doc["gpsen"];
  if (doc.containsKey("gpsbeac")) cfg.gpsIncludeInBeacon = (bool)(int)doc["gpsbeac"];
  if (doc.containsKey("gpstmo"))  cfg.gpsFix1Timeout= constrain((int)doc["gpstmo"],10,120);
  if (doc.containsKey("namen"))   cfg.nameEnabled   = (bool)(int)doc["namen"];
  if (doc.containsKey("fname"))   strlcpy(cfg.firstName, doc["fname"] | "", MAX_NAME_LEN);
  if (doc.containsKey("lname"))   strlcpy(cfg.lastName,  doc["lname"] | "", MAX_NAME_LEN);
  if (doc.containsKey("poten"))   cfg.potVolEnabled = (bool)(int)doc["poten"];
  if (doc.containsKey("potwpm"))  cfg.potWpmEnabled = (bool)(int)doc["potwpm"];

  if (doc.containsKey("freqs")) {
    JsonArray fa = doc["freqs"].as<JsonArray>();
    cfg.freqCount = 0;
    for (JsonVariant v : fa) {
      if (cfg.freqCount >= MAX_FREQUENCIES) break;
      float f = v.as<float>();
      if (f >= 410.0f && f <= 525.0f) cfg.freqs[cfg.freqCount++] = f;
    }
    if (!cfg.freqCount) { cfg.freqs[0] = DEFAULT_FREQ_MHZ; cfg.freqCount = 1; }
  }

  saveConfig();
  server.send(200, "text/plain", "OK");
  delay(1500);
  ESP.restart();
}

void handleEmergency() {
  g_emergencyActive = true; g_currentMode = MODE_EMERGENCY;
  server.send(200, "text/plain", "EMERGENCY ACTIVATED");
  delay(500); ESP.restart();
}

void handleFactory() {
  server.send(200, "text/plain", "Resetting...");
  factoryReset();
}

void runConfigMode() {
  LOG_MODE("CONFIG MODE — AP: %s", AP_SSID);
  oledConfig();
  ledModeIndicate(MODE_CONFIG);

  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASS);
  delay(100);
  WiFi.softAPConfig(IPAddress(192,168,4,1), IPAddress(192,168,4,1), IPAddress(255,255,255,0));

  dns.start(53, "*", IPAddress(192,168,4,1));
  server.on("/",          HTTP_GET,  handleRoot);
  server.on("/status",    HTTP_GET,  handleStatus);
  server.on("/save",      HTTP_POST, handleSave);
  server.on("/emergency", HTTP_POST, handleEmergency);
  server.on("/factory",   HTTP_POST, handleFactory);
  server.onNotFound(handleNotFound);
  server.begin();
  LOG_OK("AP up — %s  %s", AP_SSID, AP_IP);

  uint32_t cfgStart = millis();
  while (millis() - cfgStart < CONFIG_AP_TIMEOUT) {
    dns.processNextRequest();
    server.handleClient();
    if (cfg.gpsEnabled) readGPS();
    esp_task_wdt_reset();
    if (g_modeButtonPressed) {
      uint8_t p = checkButton(PIN_SW_MODE, BTN_LONG_MODE_MS, g_modeButtonPressed);
      if (p == 1) break;
    }
    delay(2);
  }

  server.stop(); dns.stop();
  WiFi.mode(WIFI_OFF);
  g_currentMode = cfg.lastMode;
  delay(300); ESP.restart();
}

// =============================================================================
// GPS FIX WAIT (at BEACON boot, if GPS enabled)
// =============================================================================
void waitForGpsFix() {
  if (!cfg.gpsEnabled) return;
  if (g_rtcFixValid) {
    LOG_GPS("Using RTC-persisted fix: %.5f  %.5f", g_rtcLat, g_rtcLng);
    g_gpsFix.lat = g_rtcLat; g_gpsFix.lng = g_rtcLng; g_gpsFix.valid = true;
    return;
  }

  LOG_GPS("Waiting for GPS fix (timeout %ds)...", cfg.gpsFix1Timeout);
  uint32_t t0 = millis();

  while (millis() - t0 < (uint32_t)cfg.gpsFix1Timeout * 1000UL) {
    readGPS();
    uint32_t elapsed = (millis() - t0) / 1000;
    uint8_t sats = gps.satellites.isValid() ? (uint8_t)gps.satellites.value() : 0;
    oledGpsWait(sats, elapsed, cfg.gpsFix1Timeout);

    if (g_gpsFix.valid) {
      LOG_GPS("Fix acquired: %.5f  %.5f  sats=%d", g_gpsFix.lat, g_gpsFix.lng, g_gpsFix.satellites);
      audioSweep(400, 1200, 6);
      return;
    }

    // Allow skipping GPS wait with MODE button short press
    if (g_modeButtonPressed) {
      uint8_t p = checkButton(PIN_SW_MODE, BTN_LONG_MODE_MS, g_modeButtonPressed);
      if (p == 1) { LOG_GPS("GPS wait skipped by user"); return; }
      if (p == 2) { g_emergencyActive = true; g_currentMode = MODE_EMERGENCY; return; }
    }

    esp_task_wdt_reset();
    delay(100);
  }

  LOG_WARN("GPS fix timeout — transmitting without coords");
}

// =============================================================================
// BEACON MODE
// =============================================================================
void runBeaconMode(bool emergency) {
  dbSep(emergency ? "EMERGENCY MODE" : "BEACON MODE");
  WiFi.mode(WIFI_OFF);
  btStop();

  // Build Morse payload once per cycle
  buildMorsePayload(g_currentPayload, sizeof(g_currentPayload));
  LOG_INFO("Full payload: \"%s\"", g_currentPayload);

  int8_t  txPower = emergency ? 20 : cfg.powerDbm;
  int     repeats = emergency ? 3  : (int)cfg.repeatCount;
  g_txCycles++;
  uint32_t cycleStart = millis();

  for (int fi = 0; fi < cfg.freqCount; fi++) {
    float freq = cfg.freqs[fi];
    dbSep();
    LOG_INFO("Hop %d/%d → %.3f MHz", fi+1, cfg.freqCount, freq);

    if (emergency) oledEmergency(freq, g_txCycles);

    if (!initRadioOOK(freq, txPower)) {
      LOG_ERR("Radio FAILED — %.3f MHz skipped", freq);
      oledMessage("RADIO ERROR", "Check SPI wiring");
      blinkLed(PIN_LED_RED, 6, 40);
      continue;
    }

    for (int r = 0; r < repeats; r++) {
      // Pass the complete payload to the TX engine
      bool completed = transmitMessage(g_currentPayload, fi, freq, g_txCycles, !emergency);
      if (!completed && !emergency) goto mode_switch;
      if (r < repeats - 1) delay(interChrMs() * 3);
    }

    radio.standby();
    delay(50);

    if (!emergency && g_modeButtonPressed) {
      uint8_t press = checkButton(PIN_SW_MODE, BTN_LONG_MODE_MS, g_modeButtonPressed);
      if (press == 2) { g_emergencyActive = true; g_currentMode = MODE_EMERGENCY; goto mode_switch; }
      if (press == 1) { g_currentMode = MODE_SEARCH; cfg.lastMode = MODE_SEARCH; saveConfig(); goto mode_switch; }
    }
    if (!emergency && g_selButtonPressed) {
      uint8_t press = checkButton(PIN_SW_SEL, BTN_LONG_CFG_MS, g_selButtonPressed);
      if (press == 2) goto enter_config;
      if (press == 1) {
        g_adjTarget = (g_adjTarget == 0) ? 1 : 0;
        g_adjOledShowMs = millis() + ADJ_SHOW_MS;
        LOG_BTN("ADJ target -> %s", g_adjTarget==0?"VOL":"WPM");
      }
    }
  }

  radio.sleep();
  LOG_OK("Beacon cycle done in %lu ms", millis() - cycleStart);

  if (emergency) { delay(300); runBeaconMode(true); return; }

  {
    uint32_t sleepMs = cfg.sleepSec * 1000UL;
    uint32_t sleepStart = millis();
    while (millis() - sleepStart < sleepMs) {
      readPots();
      readGPS();
      uint32_t remain = (sleepMs - (millis() - sleepStart)) / 1000;
      oledBeacon(0, cfg.freqs[0], 0, 1, g_txCycles, remain, false, g_currentPayload);
      if (g_modeButtonPressed || g_selButtonPressed) break;
      delay(100);
      esp_task_wdt_reset();
    }

    if (g_modeButtonPressed) {
      uint8_t press = checkButton(PIN_SW_MODE, BTN_LONG_MODE_MS, g_modeButtonPressed);
      if (press == 2) { g_emergencyActive = true; g_currentMode = MODE_EMERGENCY; goto mode_switch; }
      if (press == 1) { g_currentMode = MODE_SEARCH; cfg.lastMode = MODE_SEARCH; saveConfig(); goto mode_switch; }
    }
    if (g_selButtonPressed) {
      uint8_t press = checkButton(PIN_SW_SEL, BTN_LONG_CFG_MS, g_selButtonPressed);
      if (press == 2) goto enter_config;
      if (press == 1) {
        g_adjTarget = (g_adjTarget == 0) ? 1 : 0;
        g_adjOledShowMs = millis() + ADJ_SHOW_MS;
      }
    }

    // Rebuild payload before sleeping (GPS fix might have improved)
    buildMorsePayload(g_currentPayload, sizeof(g_currentPayload));
    LOG_INFO("Deep sleep %lu s...", cfg.sleepSec);
    oledSleep();
    Serial.flush();
    ledsOff();
    esp_deep_sleep((uint64_t)cfg.sleepSec * 1000000ULL);
  }
  return;

mode_switch:
  radio.sleep(); ledsOff(); audioToneStop();
  ledModeIndicate(g_currentMode);
  delay(300);
  ESP.restart();
enter_config:
  radio.sleep(); ledsOff(); audioToneStop();
  g_currentMode = MODE_CONFIG;
  runConfigMode();
}

// =============================================================================
// SEARCH MODE
// =============================================================================
void runSearchMode() {
  dbSep("SEARCH MODE");
  WiFi.mode(WIFI_OFF);
  btStop();
  if (cfg.audioEnabled) audioSweep(200, 1000, 8);

  g_scanCycles++;
  uint32_t scanStart = millis();
  uint32_t passNum   = 0;
  uint16_t totalDet  = 0;

  while (true) {
    passNum++;
    bool anyDetected = false;

    for (int fi = 0; fi < cfg.freqCount; fi++) {
      readPots();
      readGPS();

      if (g_modeButtonPressed) {
        uint8_t p = checkButton(PIN_SW_MODE, BTN_LONG_MODE_MS, g_modeButtonPressed);
        if (p == 2) { g_emergencyActive = true; g_currentMode = MODE_EMERGENCY; goto search_exit; }
        if (p == 1) { g_currentMode = MODE_BEACON; cfg.lastMode = MODE_BEACON; saveConfig(); goto search_exit; }
      }
      if (g_selButtonPressed) {
        uint8_t p = checkButton(PIN_SW_SEL, BTN_LONG_CFG_MS, g_selButtonPressed);
        if (p == 2) { g_currentMode = MODE_CONFIG; goto search_exit; }
        if (p == 1) {
          g_adjTarget = (g_adjTarget == 0) ? 1 : 0;
          g_adjOledShowMs = millis() + ADJ_SHOW_MS;
        }
      }

      ScanResult result = scanFrequency(cfg.freqs[fi], fi, passNum);
      if (result.detected) { anyDetected = true; totalDet++; recordScanHit(result.freq, result.rssi); }
      esp_task_wdt_reset();
    }

    digitalWrite(PIN_LED_BLUE, (millis() / (anyDetected ? 150 : 900)) % 2);
    LOG_SCAN("Pass#%lu done — %lu s  detections: %d",
             passNum, (millis() - scanStart) / 1000, totalDet);
  }

search_exit:
  ledsOff(); audioToneStop();
  ledModeIndicate(g_currentMode);
  delay(300);
  ESP.restart();
}

// =============================================================================
// SETUP
// =============================================================================
void setup() {
  Serial.begin(115200);
  delay(200);
  g_bootCycle++;
  dbBanner(modeName(g_currentMode));
  LOG_INFO("Boot #%lu  reset_reason=%d  heap=%lu B  cpu=%dMHz",
           g_bootCycle, (int)esp_reset_reason(), ESP.getFreeHeap(), getCpuFrequencyMhz());

  // ── GPIO ──────────────────────────────────────────────────────────────────
  pinMode(PIN_LED_RED,   OUTPUT);
  pinMode(PIN_LED_BLUE,  OUTPUT);
  pinMode(PIN_SW_MODE,   INPUT_PULLUP);
  pinMode(PIN_SW_SEL,    INPUT_PULLUP);
  pinMode(PIN_SW_UP,     INPUT_PULLUP);
  pinMode(PIN_SW_DN,     INPUT_PULLUP);
  ledsOff();

  // ── ADC setup (not used for pots anymore, kept for compatibility) ─────────
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  // ── Interrupts ─────────────────────────────────────────────────────────────
  attachInterrupt(digitalPinToInterrupt(PIN_SW_MODE), isrModeButton, FALLING);
  attachInterrupt(digitalPinToInterrupt(PIN_SW_SEL),  isrSelButton,  FALLING);

  // ── Watchdog ─────────────────────────────────────────────────────────────
  esp_task_wdt_init(WDT_TIMEOUT_SEC, true);
  esp_task_wdt_add(NULL);

  // ── Audio ─────────────────────────────────────────────────────────────────
  ledcSetup(AUDIO_CHANNEL, AUDIO_FREQ_HZ, AUDIO_RES_BITS);
  ledcAttachPin(PIN_AUDIO, AUDIO_CHANNEL);
  ledcWrite(AUDIO_CHANNEL, 0);
  dacWrite(PIN_AUDIO, 128);   // mid-rail — no startup click
  LOG_AUDIO("LEDC GPIO%d (DAC1) ch%d @ %d Hz %d-bit", PIN_AUDIO, AUDIO_CHANNEL, AUDIO_FREQ_HZ, AUDIO_RES_BITS);

  // ── Load config (needed before OLED init for oledEnabled/invert) ──────────
  loadConfig();

  // ── GPS serial ────────────────────────────────────────────────────────────
  if (cfg.gpsEnabled) {
    gpsSerial.begin(GPS_BAUD, SERIAL_8N1, PIN_GPS_RX, PIN_GPS_TX);
    LOG_GPS("GPS serial started on RX=GPIO%d TX=GPIO%d @ %d baud", PIN_GPS_RX, PIN_GPS_TX, GPS_BAUD);
  }

  // ── Button adjustment init ────────────────────────────────────────────────
  g_adjTarget = 0;   // start with VOL selected
  g_adjOledShowMs = 0;
  LOG_POT("Adj buttons: UP=GPIO%d DN=GPIO%d SEL=GPIO%d", PIN_SW_UP, PIN_SW_DN, PIN_SW_SEL);

  // ── OLED ──────────────────────────────────────────────────────────────────
  if (cfg.oledEnabled) {
    g_oledOk = initOled();
    if (g_oledOk) oledSplash();
  }

  // ── Startup blink ─────────────────────────────────────────────────────────
  blinkLed(PIN_LED_RED, 1, 80);
  blinkLed(PIN_LED_BLUE, 1, 80);

  // ── Factory reset check (hold both MODE + SEL for 5s) ───────────────────
  if (digitalRead(PIN_SW_MODE) == LOW && digitalRead(PIN_SW_SEL) == LOW) {
    delay(BTN_DEBOUNCE_MS);
    uint32_t t = millis();
    while (digitalRead(PIN_SW_MODE) == LOW && digitalRead(PIN_SW_SEL) == LOW) {
      delay(100); esp_task_wdt_reset();
      uint32_t held = millis() - t;
      if (g_oledOk) {
        char buf[28];
        snprintf(buf, sizeof(buf), "Hold %lus more...", (BTN_FACTORY_MS - held) / 1000 + 1);
        oledMessage("FACTORY RESET", "Hold MODE + SEL", buf, true);
      }
      if (held > BTN_FACTORY_MS) factoryReset();
    }
  }

  // ── Boot config enter (hold SEL during power-on) ─────────────────────────
  if (digitalRead(PIN_SW_SEL) == LOW) {
    delay(BTN_DEBOUNCE_MS);
    if (digitalRead(PIN_SW_SEL) == LOW) {
      uint32_t held = waitButtonRelease(PIN_SW_SEL);
      if (held >= BTN_LONG_CFG_MS) { g_currentMode = MODE_CONFIG; runConfigMode(); }
    }
  }

  // ── Determine mode ────────────────────────────────────────────────────────
  if (g_emergencyActive)    g_currentMode = MODE_EMERGENCY;
  else if (g_bootCycle == 1) g_currentMode = cfg.lastMode;

  LOG_MODE("Starting: %s", modeName(g_currentMode));
  ledModeIndicate(g_currentMode);

  // ── GPS fix wait (BEACON mode only, non-emergency) ────────────────────────
  if ((g_currentMode == MODE_BEACON) && cfg.gpsEnabled && !g_emergencyActive) {
    waitForGpsFix();
  }

  // ── Build initial payload ─────────────────────────────────────────────────
  buildMorsePayload(g_currentPayload, sizeof(g_currentPayload));
  LOG_INFO("Payload ready: \"%s\"", g_currentPayload);

  // ── Boot audio feedback ───────────────────────────────────────────────────
  if (cfg.audioEnabled) {
    if (g_currentMode == MODE_BEACON || g_currentMode == MODE_EMERGENCY)
      audioTone(800, 150);
    else if (g_currentMode == MODE_SEARCH)
      audioSweep(400, 900, 10);
  }
  delay(200);

  // ── Dispatch ──────────────────────────────────────────────────────────────
  switch (g_currentMode) {
    case MODE_BEACON:    runBeaconMode(false); break;
    case MODE_EMERGENCY: runBeaconMode(true);  break;
    case MODE_SEARCH:    runSearchMode();      break;
    case MODE_CONFIG:    runConfigMode();      break;
    default:
      LOG_ERR("Unknown mode %d — fallback BEACON", g_currentMode);
      runBeaconMode(false);
  }
}

void loop() {
  // Never reached — each mode loops internally or calls deep_sleep.
  LOG_ERR("loop() reached — heap=%lu — restarting", ESP.getFreeHeap());
  esp_task_wdt_reset();
  delay(2000);
  ESP.restart();
}

// =============================================================================
// END — AEGIS-BEACON v5.3
// https://github.com/Leo-Galli/Aegis-Beacon
// =============================================================================
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  SERIAL DEBUG LOG KEY                                                    │
// │  [INFO ] Normal  [OK   ] Success  [WARN ] Anomaly  [ERROR] HW failure    │
// │  [MODE ] Mode event  [SCAN ] RSSI  [GPS  ] GPS engine  [POT  ] Btn adj   │
// │  [AUDIO] Audio   [OLED ] Display  [BTN  ] Button  [CFG  ] NVS save       │
// │  [MORSE] Per-symbol*  [RF   ] RadioLib code*   (* = DEBUG_VERBOSE 1)     │
// │                                                                          │
// │  BUTTON WIRING QUICK REFERENCE (v5.3):                                   │
// │   SW_MODE : GPIO33 → GND  (short=mode toggle, long2s=emergency)          │
// │   SW_SEL  : GPIO32 → GND  (short=VOL/WPM select, long3s=config)          │
// │   SW_UP   : GPIO35 → GND  (increment selected parameter)                 │
// │   SW_DN   : GPIO34 → GND  (decrement selected parameter)                 │
// │   All buttons: INPUT_PULLUP, connect one terminal to GPIO, other to GND  │
// │   Optional: 10kΩ external pull-up on GPIO34/35 (input-only pins)         │
// └──────────────────────────────────────────────────────────────────────────┘
