// =============================================================================
//
//   █████╗ ███████╗ ██████╗ ██╗███████╗    ██████╗ ███████╗ █████╗  ██████╗ ██████╗ ███╗   ██╗
//  ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║
//  ███████║█████╗  ██║  ███╗██║███████╗    ██████╔╝█████╗  ███████║██║     ██║   ██║██╔██╗ ██║
//  ██╔══██║██╔══╝  ██║   ██║██║╚════██║    ██╔══██╗██╔══╝  ██╔══██║██║     ██║   ██║██║╚██╗██║
//  ██║  ██║███████╗╚██████╔╝██║███████║    ██████╔╝███████╗██║  ██║╚██████╗╚██████╔╝██║ ╚████║
//  ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚═╝  ╚═══╝
//
// =============================================================================
//  PROJECT   : Aegis-Beacon v3.0 — Dual-Mode Avalanche Rescue System
//  MODES     : BEACON (transmit SOS) ←→ SEARCH (scan for other beacons)
//  TARGET HW : ESP32-C3 SuperMini + RA-02 SX1276 (433 MHz)
//  FRAMEWORK : Arduino / PlatformIO | DEPS: RadioLib >= 6.x, ArduinoJson >= 7.x
//  LICENSE   : MIT — Use freely, save lives.
// =============================================================================
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │                   MINIMAL BOM — Ultra-Low-Cost (~$8-12 USD)                 │
// ├────┬─────────────────────────────┬───────────┬────────────────────────────  │
// │Ref │ Part                        │ Cost (USD)│ Notes                        │
// ├────┼─────────────────────────────┼───────────┼────────────────────────────  │
// │ U1 │ ESP32-C3 SuperMini          │   $1.50   │ Built-in USB+LDO, no extras  │
// │ U2 │ AI-Thinker RA-02 (SX1276)   │   $2.50   │ Includes spring antenna      │
// │ B1 │ 18650 Li-ion 3.7V (any)     │   $1.50   │ OR 14500 AA-size for smaller │
// │ IC1│ TP4056 USB-C charge module  │   $0.50   │ Charging + protection onboard│
// │ SW1│ Tactile switch 6×6mm (×2)   │   $0.10   │ MODE button + CONFIG button  │
// │ SW2│ SPDT slide switch (power)   │   $0.20   │ Hard power cutoff            │
// │ C1 │ 100µF 10V electrolytic      │   $0.05   │ Bulk cap on 3.3V rail        │
// │ C2 │ 100nF ceramic 0805          │   $0.02   │ Decoupling                   │
// │ R1 │ 10kΩ 0805 (×3)              │   $0.03   │ Pull-ups for SW1, SW2, RST   │
// │ R2 │ 330Ω 0805 (×2)              │   $0.02   │ LED current limiters         │
// │ D1 │ Red LED 3mm (BEACON status) │   $0.05   │                              │
// │ D2 │ Blue LED 3mm (SEARCH mode)  │   $0.05   │                              │
// │ANT │ 17.3cm wire (¼-wave 433MHz) │   $0.00   │ FREE — any stiff wire        │
// │BOX │ Hammond 1551 / 3D-print PLA │   $1.00   │ Small 60×35×20mm box         │
// ├────┴─────────────────────────────┼───────────┼────────────────────────────  │
// │                           TOTAL  │  ~$7-9    │                              │
// └──────────────────────────────────┴───────────┴──────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │                  WIRING TABLE — ESP32-C3 SuperMini ↔ RA-02                  │
// ├──────────────┬────────────────┬──────────────────────────────────────────── │
// │  RA-02 Pin   │  ESP32-C3 GPIO │  Notes                                      │
// ├──────────────┼────────────────┼───────────────────────────────────────────  │
// │  VCC (3.3V)  │  3V3           │  MAX 3.6V!                                  │
// │  GND         │  GND           │  Common ground                              │
// │  SCK         │  GPIO 4        │  SPI Clock                                  │
// │  MOSI        │  GPIO 6        │  SPI MOSI                                   │
// │  MISO        │  GPIO 5        │  SPI MISO                                   │
// │  NSS / CS    │  GPIO 7        │  Chip Select (active LOW)                   │
// │  RESET       │  GPIO 3        │  Active LOW reset                           │
// │  DIO0        │  GPIO 2        │  TX Done / RX Done IRQ                      │
// │  DIO1        │  GPIO 10       │  RX Timeout (search mode)                   │
// ├──────────────┼────────────────┼──────────────────────────────────────────── │
// │  LED_RED (+) │  GPIO 8        │  BEACON mode indicator (through 330Ω)       │
// │  LED_BLUE(+) │  GPIO 20       │  SEARCH mode indicator (through 330Ω)       │
// │  SW_MODE     │  GPIO 9 (BOOT) │  Short press = toggle BEACON↔SEARCH mode    │
// │  SW_CONFIG   │  GPIO 1        │  Hold 3s = enter WiFi config dashboard      │
// └──────────────┴────────────────┴─────────────────────────────────────────────┘
//
// ┌──────────────────────────────────────────────────────────────────────────────┐
// │                        PHYSICAL BUTTON BEHAVIOUR                             │
// ├────────────────────────┬─────────────────────────────────────────────────────│
// │  SW_MODE (short press) │  Instantly toggle BEACON ↔ SEARCH mode              │
// │  SW_MODE (hold 2s)     │  Emergency SOS override (forces BEACON + max power) │
// │  SW_CONFIG (hold 3s)   │  Launch WiFi AP + captive portal dashboard          │
// │  SW_CONFIG (short)     │  Print status summary to Serial                     │
// │  BOTH held at boot     │  Factory reset (clear NVS)                          │
// └────────────────────────┴─────────────────────────────────────────────────────┘
//
// ┌──────────────────────────────────────────────────────────────────────────────┐
// │                           DUAL-MODE LOGIC FLOW                               │
// │                                                                              │
// │  POWER ON                                                                    │
// │   │                                                                          │
// │   ├── BOTH buttons held? → FACTORY RESET → reboot                            │
// │   │                                                                          │
// │   ├── SW_CONFIG held 3s? → CONFIG MODE (WiFi AP + dashboard)                 │
// │   │                                                                          │
// │   └── Normal boot                                                            │
// │        │                                                                     │
// │        ▼                                                                     │
// │   loadConfig() ← NVS   (fail-safe defaults if empty)                         │
// │        │                                                                     │
// │        ▼                                                                     │
// │   Enter last saved mode (BEACON or SEARCH)                                   │
// │        │                                                                     │
// │   ╔════╧═════════════╗        ╔════════════════════════╗                     │
// │   ║  BEACON MODE     ║        ║     SEARCH MODE        ║                     │
// │   ║                  ║        ║                        ║                     │
// │   ║ • Freq hop loop  ║        ║ • Scan freq list       ║                     │
// │   ║ • TX Morse SOS   ║        ║ • Listen for carriers  ║                     │
// │   ║   via OOK/CW     ║        ║ • RSSI measurement     ║                     │
// │   ║ • RED LED blink  ║        ║ • Signal strength log  ║                     │
// │   ║ • Deep sleep     ║        ║ • BLUE LED blink       ║                     │
// │   ║   between cycles ║        ║ • No deep sleep        ║                     │
// │   ║                  ║        ║   (continuous scan)    ║                     │
// │   ╚══════════════════╝        ╚════════════════════════╝                     │
// │         │                               │                                    │
// │         └──── SW_MODE press ────────────┘                                    │
// │                    ↕ switch anytime                                          │
// └──────────────────────────────────────────────────────────────────────────────┘
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// LIBRARY DEPENDENCIES
// Arduino IDE: Manage Libraries → install RadioLib + ArduinoJson
// PlatformIO:
//   lib_deps =
//     jgromes/RadioLib @ ^6.6.0
//     bblanchon/ArduinoJson @ ^7.0.0
// ─────────────────────────────────────────────────────────────────────────────
#include <Arduino.h>
#include <RadioLib.h>
#include <Preferences.h>
#include <WiFi.h>
#include <DNSServer.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include "esp_sleep.h"
#include "esp_task_wdt.h"

// =============================================================================
// ╔══════════════════════════════════════════╗
// ║           DEBUG SYSTEM v1                ║
// ╚══════════════════════════════════════════╝
// All output → Serial at 115200 baud.
// ANSI colours supported in: picocom, minicom, VS Code terminal, PuTTY.
//
//  Log levels:
//    DBG_VERBOSE 0 → INFO / OK / WARN / ERROR only
//    DBG_VERBOSE 1 → + per-symbol MORSE + RF register codes
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

#define LOG_INFO(fmt,...)  Serial.printf(C_CYAN  "[%8lu][INFO ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_OK(fmt,...)    Serial.printf(C_GREEN "[%8lu][OK   ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_WARN(fmt,...)  Serial.printf(C_YELLOW"[%8lu][WARN ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_ERR(fmt,...)   Serial.printf(C_RED   "[%8lu][ERROR] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_MODE(fmt,...)  Serial.printf(C_MAGENTA"[%8lu][MODE ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_SCAN(fmt,...)  Serial.printf(C_BLUE  "[%8lu][SCAN ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_BTN(fmt,...)   Serial.printf(C_WHITE "[%8lu][BTN  ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_CFG(fmt,...)   Serial.printf(C_WHITE "[%8lu][CFG  ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)

#if DEBUG_VERBOSE
  #define LOG_MORSE(fmt,...) Serial.printf(C_GRAY "[%8lu][MORSE] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
  #define LOG_RF(fmt,...)    Serial.printf(C_GRAY "[%8lu][RF   ] " fmt C_RESET "\n", millis(), ##__VA_ARGS__)
#else
  #define LOG_MORSE(fmt,...) do{}while(0)
  #define LOG_RF(fmt,...)    do{}while(0)
#endif

void dbSep(const char* lbl = nullptr) {
  if (lbl) Serial.printf(C_GRAY "─────────── %s ───────────\n" C_RESET, lbl);
  else      Serial.println(C_GRAY "─────────────────────────────────────────────" C_RESET);
}

void dbBanner(const char* mode) {
  Serial.println(C_BOLD C_CYAN
    "\n╔═══════════════════════════════════════════════════════╗\n"
    "║    ⬡  AEGIS-BEACON v3.0  —  DUAL-MODE RESCUE SYSTEM   ║\n"
    "╚═══════════════════════════════════════════════════════╝" C_RESET);
  Serial.printf(C_YELLOW "    Active mode: %s\n" C_RESET "\n", mode);
}

// =============================================================================
// HARDWARE PINS  (ESP32-C3 SuperMini)
// =============================================================================
#define PIN_SPI_SCK    4
#define PIN_SPI_MISO   5
#define PIN_SPI_MOSI   6
#define PIN_LORA_CS    7
#define PIN_LORA_RST   3
#define PIN_LORA_DIO0  2
#define PIN_LORA_DIO1  10

#define PIN_LED_RED    8    // BEACON mode indicator
#define PIN_LED_BLUE   20   // SEARCH mode indicator

#define PIN_SW_MODE    9    // Short = toggle mode | Long 2s = Emergency SOS
#define PIN_SW_CONFIG  1    // Short = print status | Long 3s = Config AP

// =============================================================================
// BUTTON TIMING (ms)
// =============================================================================
#define BTN_DEBOUNCE_MS     50
#define BTN_LONG_MODE_MS   2000   // hold SW_MODE for emergency SOS
#define BTN_LONG_CFG_MS    3000   // hold SW_CONFIG for WiFi AP
#define BTN_FACTORY_MS     5000   // hold BOTH at boot for factory reset

// =============================================================================
// CONFIGURATION DEFAULTS
// =============================================================================
#define DEFAULT_FREQ_MHZ      433.500f
#define DEFAULT_MESSAGE       "SOS"
#define DEFAULT_WPM           13
#define DEFAULT_POWER_DBM     17
#define DEFAULT_SLEEP_SEC     10
#define DEFAULT_SCAN_DWELL_MS 400   // ms per frequency while scanning
#define DEFAULT_RSSI_THRESH   -90   // dBm — signal considered "found" if above this

// =============================================================================
// LIMITS
// =============================================================================
#define MAX_FREQUENCIES    10
#define MAX_MESSAGE_LEN    64
#define MAX_SCAN_HITS      20   // keep last N scan detections in memory
#define CONFIG_AP_TIMEOUT  300000  // 5 min
#define AP_SSID            "AegisBeacon"
#define AP_PASS            ""       // open AP — easier to connect in emergency
#define AP_IP              "192.168.4.1"

// Watchdog timeout — reset if stuck for more than 30 seconds
#define WDT_TIMEOUT_SEC    30

// =============================================================================
// OPERATING MODES
// =============================================================================
typedef enum {
  MODE_BEACON  = 0,   // Transmit SOS morse on all configured frequencies
  MODE_SEARCH  = 1,   // Scan frequencies, listen for carriers, log RSSI
  MODE_CONFIG  = 2,   // WiFi AP + captive portal
  MODE_EMERGENCY = 3  // Forced max-power BEACON, ignore sleep, no stop
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

// =============================================================================
// SCAN HIT RECORD  (stored in RTC RAM — survives deep sleep in beacon mode)
// =============================================================================
struct ScanHit {
  float    freq;
  int16_t  rssi;
  uint32_t timestamp;  // millis() at detection
  char     label[12];  // "STRONG" / "MEDIUM" / "WEAK"
};

// =============================================================================
// MAIN CONFIG STRUCT
// =============================================================================
struct Config {
  float    freqs[MAX_FREQUENCIES];
  uint8_t  freqCount;
  char     message[MAX_MESSAGE_LEN];
  uint8_t  wpm;
  int8_t   powerDbm;
  uint32_t sleepSec;
  uint16_t scanDwellMs;
  int8_t   rssiThreshold;
  DeviceMode lastMode;    // remembered across reboots
  bool     autoSwitch;    // auto-switch to BEACON if battery < threshold
  uint8_t  repeatCount;   // how many times to repeat msg per cycle
  bool     emergencyGPS;  // reserved: future GPS coord append
} cfg;

// =============================================================================
// RTC MEMORY — survives deep sleep
// =============================================================================
RTC_DATA_ATTR uint32_t g_bootCycle    = 0;
RTC_DATA_ATTR uint32_t g_txCycles     = 0;
RTC_DATA_ATTR uint32_t g_scanCycles   = 0;
RTC_DATA_ATTR ScanHit  g_scanHits[MAX_SCAN_HITS];
RTC_DATA_ATTR uint8_t  g_scanHitCount = 0;
RTC_DATA_ATTR DeviceMode g_currentMode = MODE_BEACON;
RTC_DATA_ATTR bool     g_emergencyActive = false;

// =============================================================================
// GLOBALS
// =============================================================================
SPIClass   lora_spi(HSPI);
SX1276     radio = new Module(PIN_LORA_CS, PIN_LORA_DIO0, PIN_LORA_RST, PIN_LORA_DIO1, lora_spi);

Preferences prefs;
WebServer   server(80);
DNSServer   dns;

volatile bool g_modeButtonPressed  = false;
volatile bool g_configButtonPressed = false;

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

// Morse timing (PARIS standard)
inline uint32_t dotMs()      { return 1200 / cfg.wpm; }
inline uint32_t dashMs()     { return dotMs() * 3; }
inline uint32_t intraChrMs() { return dotMs(); }
inline uint32_t interChrMs() { return dotMs() * 3; }
inline uint32_t wordGapMs()  { return dotMs() * 7; }

// =============================================================================
// LED HELPERS
// =============================================================================
void ledsOff() {
  digitalWrite(PIN_LED_RED,  LOW);
  digitalWrite(PIN_LED_BLUE, LOW);
}

void blinkLed(uint8_t pin, int times, int ms = 100) {
  for (int i = 0; i < times; i++) {
    digitalWrite(pin, HIGH); delay(ms);
    digitalWrite(pin, LOW);  delay(ms);
  }
}

void ledModeIndicate(DeviceMode m) {
  ledsOff();
  if (m == MODE_BEACON || m == MODE_EMERGENCY) {
    blinkLed(PIN_LED_RED,  3, 80);
  } else if (m == MODE_SEARCH) {
    blinkLed(PIN_LED_BLUE, 3, 80);
  } else {
    blinkLed(PIN_LED_RED,  1, 200);
    blinkLed(PIN_LED_BLUE, 1, 200);
  }
}

// =============================================================================
// BUTTON ISRs (interrupt-based for responsiveness during TX delays)
// =============================================================================
void IRAM_ATTR isrModeButton()   { g_modeButtonPressed   = true; }
void IRAM_ATTR isrConfigButton() { g_configButtonPressed = true; }

// Block until button released, return held duration in ms
uint32_t waitButtonRelease(uint8_t pin) {
  uint32_t t = millis();
  while (digitalRead(pin) == LOW) {
    delay(10);
    esp_task_wdt_reset();  // keep watchdog happy during button hold
  }
  return millis() - t;
}

// Non-blocking button state check (called in main loops)
// Returns: 0 = not pressed, 1 = short press, 2 = long press
uint8_t checkButton(uint8_t pin, uint32_t longThreshMs, volatile bool& flag) {
  if (!flag) return 0;
  flag = false;
  delay(BTN_DEBOUNCE_MS);
  if (digitalRead(pin) != LOW) return 0;  // spurious
  uint32_t held = waitButtonRelease(pin);
  LOG_BTN("GPIO%d held for %lu ms (threshold=%lu ms)", pin, held, longThreshMs);
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
    LOG_WARN("NVS empty or corrupt — injecting hardcoded defaults");
    cfg.freqs[0]  = DEFAULT_FREQ_MHZ;
    cfg.freqCount = 1;
  } else {
    for (int i = 0; i < cfg.freqCount; i++) {
      char k[8]; snprintf(k, sizeof(k), "f%d", i);
      cfg.freqs[i] = prefs.getFloat(k, DEFAULT_FREQ_MHZ);
      LOG_INFO("  freq[%d] = %.3f MHz", i, cfg.freqs[i]);
    }
  }

  prefs.getString("msg",   cfg.message, MAX_MESSAGE_LEN);
  if (!strlen(cfg.message)) strlcpy(cfg.message, DEFAULT_MESSAGE, MAX_MESSAGE_LEN);

  cfg.wpm          = prefs.getUChar("wpm",   DEFAULT_WPM);
  cfg.powerDbm     = (int8_t)prefs.getChar("pwr", DEFAULT_POWER_DBM);
  cfg.sleepSec     = prefs.getULong("sleep", DEFAULT_SLEEP_SEC);
  cfg.scanDwellMs  = prefs.getUShort("dwell", DEFAULT_SCAN_DWELL_MS);
  cfg.rssiThreshold= (int8_t)prefs.getChar("rssi",  DEFAULT_RSSI_THRESH);
  cfg.lastMode     = (DeviceMode)prefs.getUChar("mode", MODE_BEACON);
  cfg.autoSwitch   = prefs.getBool("aswitch", false);
  cfg.repeatCount  = prefs.getUChar("rep",    1);
  cfg.emergencyGPS = prefs.getBool("egps",    false);
  prefs.end();

  // Validate mode
  if (cfg.lastMode > MODE_SEARCH) cfg.lastMode = MODE_BEACON;

  dbSep("ACTIVE CONFIG");
  LOG_INFO("Message      : \"%s\"",  cfg.message);
  LOG_INFO("WPM          : %d  (dot=%lu ms)", cfg.wpm, dotMs());
  LOG_INFO("TX Power     : %d dBm",  cfg.powerDbm);
  LOG_INFO("Sleep        : %lu s",   cfg.sleepSec);
  LOG_INFO("Freq count   : %d",      cfg.freqCount);
  for (int i = 0; i < cfg.freqCount; i++)
    LOG_INFO("  [%d] %.3f MHz", i, cfg.freqs[i]);
  LOG_INFO("Scan dwell   : %d ms",   cfg.scanDwellMs);
  LOG_INFO("RSSI thresh  : %d dBm",  cfg.rssiThreshold);
  LOG_INFO("Last mode    : %s",      modeName(cfg.lastMode));
  LOG_INFO("Repeat count : %d",      cfg.repeatCount);
  LOG_INFO("Auto-switch  : %s",      cfg.autoSwitch ? "YES" : "NO");
  dbSep();
}

void saveConfig() {
  dbSep("NVS CONFIG SAVE");
  prefs.begin("aegis", false);
  prefs.putUChar("fcount", cfg.freqCount);
  for (int i = 0; i < cfg.freqCount; i++) {
    char k[8]; snprintf(k, sizeof(k), "f%d", i);
    prefs.putFloat(k, cfg.freqs[i]);
  }
  prefs.putString("msg",     cfg.message);
  prefs.putUChar("wpm",      cfg.wpm);
  prefs.putChar("pwr",       (char)cfg.powerDbm);
  prefs.putULong("sleep",    cfg.sleepSec);
  prefs.putUShort("dwell",   cfg.scanDwellMs);
  prefs.putChar("rssi",      (char)cfg.rssiThreshold);
  prefs.putUChar("mode",     (uint8_t)cfg.lastMode);
  prefs.putBool("aswitch",   cfg.autoSwitch);
  prefs.putUChar("rep",      cfg.repeatCount);
  prefs.putBool("egps",      cfg.emergencyGPS);
  prefs.end();
  LOG_OK("Config saved to NVS");
}

void factoryReset() {
  LOG_WARN("FACTORY RESET — clearing NVS...");
  prefs.begin("aegis", false);
  prefs.clear();
  prefs.end();
  g_bootCycle  = 0; g_txCycles = 0; g_scanCycles = 0;
  g_scanHitCount = 0;
  g_currentMode = MODE_BEACON;
  g_emergencyActive = false;
  LOG_OK("NVS cleared. Rebooting with defaults...");
  blinkLed(PIN_LED_RED, 10, 50);
  ESP.restart();
}

// =============================================================================
// RADIO INIT
// =============================================================================
bool initRadioOOK(float freqMHz, int8_t powerDbm) {
  LOG_INFO("Radio init OOK: %.3f MHz @ %d dBm", freqMHz, powerDbm);
  lora_spi.begin(PIN_SPI_SCK, PIN_SPI_MISO, PIN_SPI_MOSI, PIN_LORA_CS);
  int s = radio.beginFSK(freqMHz, 1.2f, 5.0f, 125.0f, powerDbm, 16, false);
  LOG_RF("beginFSK state=%d", s);
  if (s != RADIOLIB_ERR_NONE) {
    LOG_ERR("Radio beginFSK FAILED: %d  (check wiring!)", s);
    LOG_ERR("  CS=GPIO%d  RST=GPIO%d  DIO0=GPIO%d", PIN_LORA_CS, PIN_LORA_RST, PIN_LORA_DIO0);
    return false;
  }
  s = radio.setOOK(true);
  LOG_RF("setOOK(true) state=%d", s);
  if (s != RADIOLIB_ERR_NONE) { LOG_ERR("OOK mode failed: %d", s); return false; }
  radio.setOutputPower(powerDbm);
  LOG_OK("Radio ready — OOK/CW on %.3f MHz @ %d dBm", freqMHz, powerDbm);
  return true;
}

bool initRadioFSK(float freqMHz) {
  LOG_INFO("Radio init FSK RX: %.3f MHz (scan mode)", freqMHz);
  lora_spi.begin(PIN_SPI_SCK, PIN_SPI_MISO, PIN_SPI_MOSI, PIN_LORA_CS);
  // Wide RX bandwidth to catch drifted transmitters (cold temperature drift)
  int s = radio.beginFSK(freqMHz, 1.2f, 5.0f, 250.0f, 2, 16, false);
  LOG_RF("beginFSK (RX) state=%d", s);
  if (s != RADIOLIB_ERR_NONE) { LOG_ERR("Radio RX init failed: %d", s); return false; }
  LOG_OK("Radio ready — FSK RX on %.3f MHz", freqMHz);
  return true;
}

// =============================================================================
// MORSE TX ENGINE
// =============================================================================
inline void txOn()  { radio.transmitDirect(); }
inline void txOff() { radio.standby(); }

void transmitMorseChar(char c, int idx) {
  c = toupper(c);
  const char* pat = nullptr;
  if      (c>='A' && c<='Z') pat = MORSE_TABLE[c-'A'];
  else if (c>='0' && c<='9') pat = MORSE_TABLE[26+(c-'0')];
  else if (c==' ')            { LOG_MORSE("[%d] SPACE=%lums", idx, wordGapMs()); delay(wordGapMs()); return; }
  else                        { LOG_MORSE("[%d] '%c' unknown — skip", idx, c); return; }

  LOG_MORSE("[%d] '%c' → %s", idx, c, pat);
  for (int i = 0; pat[i]; i++) {
    bool dot = (pat[i]=='.');
    uint32_t dur = dot ? dotMs() : dashMs();
    LOG_MORSE("  %s %lums", dot?"DOT ":"DASH", dur);
    txOn();  delay(dur);  txOff();
    if (pat[i+1]) delay(intraChrMs());
  }
  delay(interChrMs());
}

bool transmitMessage(const char* msg, bool checkButtons = true) {
  LOG_INFO("TX: \"%s\" @ %d WPM  dot=%lu ms  dash=%lu ms", msg, cfg.wpm, dotMs(), dashMs());
  uint32_t t0 = millis();

  for (int i = 0; msg[i]; i++) {
    digitalWrite(PIN_LED_RED, (i%2==0) ? HIGH : LOW);

    // Allow mode button to interrupt TX (except emergency mode)
    if (checkButtons && g_modeButtonPressed) {
      LOG_WARN("TX interrupted by MODE button press");
      txOff(); digitalWrite(PIN_LED_RED, LOW);
      return false;  // signal interrupted
    }
    transmitMorseChar(msg[i], i);
    esp_task_wdt_reset();
  }

  digitalWrite(PIN_LED_RED, LOW);
  LOG_OK("TX done: %d chars in %lu ms", strlen(msg), millis()-t0);
  return true;
}

// =============================================================================
// SCAN ENGINE — SEARCH MODE
// =============================================================================
struct ScanResult {
  float   freq;
  int16_t rssi;
  bool    detected;
};

ScanResult scanFrequency(float freqMHz) {
  ScanResult r = {freqMHz, 0, false};

  if (!initRadioFSK(freqMHz)) {
    LOG_ERR("Scan init failed on %.3f MHz", freqMHz);
    return r;
  }

  // Start receiving — measure RSSI over dwell window
  radio.startReceive();
  int16_t maxRssi = -120;
  uint32_t dwellEnd = millis() + cfg.scanDwellMs;

  while (millis() < dwellEnd) {
    int16_t rssi = radio.getRSSI();
    if (rssi > maxRssi) maxRssi = rssi;
    delay(20);
    esp_task_wdt_reset();
  }

  radio.standby();
  r.rssi     = maxRssi;
  r.detected = (maxRssi >= cfg.rssiThreshold);

  LOG_SCAN("%.3f MHz → RSSI=%d dBm  %s",
           freqMHz, maxRssi,
           r.detected ? "*** SIGNAL DETECTED ***" : "quiet");

  return r;
}

void recordScanHit(float freq, int16_t rssi) {
  ScanHit hit;
  hit.freq      = freq;
  hit.rssi      = rssi;
  hit.timestamp = millis();
  if      (rssi >= -60) strlcpy(hit.label, "STRONG", sizeof(hit.label));
  else if (rssi >= -80) strlcpy(hit.label, "MEDIUM", sizeof(hit.label));
  else                  strlcpy(hit.label, "WEAK",   sizeof(hit.label));

  // Ring buffer
  if (g_scanHitCount < MAX_SCAN_HITS) {
    g_scanHits[g_scanHitCount++] = hit;
  } else {
    // Shift and insert at end
    memmove(g_scanHits, g_scanHits+1, (MAX_SCAN_HITS-1)*sizeof(ScanHit));
    g_scanHits[MAX_SCAN_HITS-1] = hit;
  }

  LOG_SCAN("HIT recorded: %.3f MHz  %d dBm  [%s]  total hits=%d",
           freq, rssi, hit.label, g_scanHitCount);

  // Blink blue LED to indicate detection
  blinkLed(PIN_LED_BLUE, 3, 80);
}

void printScanHistory() {
  dbSep("SCAN HISTORY");
  if (g_scanHitCount == 0) {
    LOG_SCAN("No signals detected yet");
    return;
  }
  LOG_SCAN("Last %d detections:", g_scanHitCount);
  for (int i = 0; i < g_scanHitCount; i++) {
    LOG_SCAN("  [%2d] %.3f MHz  %4d dBm  %-8s  T+%lu s",
             i+1,
             g_scanHits[i].freq,
             g_scanHits[i].rssi,
             g_scanHits[i].label,
             g_scanHits[i].timestamp / 1000);
  }
  dbSep();
}

// =============================================================================
// STATUS PRINT (triggered by short press of SW_CONFIG)
// =============================================================================
void printStatus() {
  dbSep("DEVICE STATUS");
  LOG_INFO("Boot cycle   : #%lu", g_bootCycle);
  LOG_INFO("Current mode : %s", modeName(g_currentMode));
  LOG_INFO("TX cycles    : %lu", g_txCycles);
  LOG_INFO("Scan cycles  : %lu", g_scanCycles);
  LOG_INFO("Scan hits    : %d", g_scanHitCount);
  LOG_INFO("Emergency    : %s", g_emergencyActive ? "ACTIVE" : "off");
  LOG_INFO("Free heap    : %lu B", ESP.getFreeHeap());
  LOG_INFO("CPU freq     : %d MHz", getCpuFrequencyMhz());
  LOG_INFO("Uptime       : %lu s", millis()/1000);
  printScanHistory();
}

// =============================================================================
// ═══════════════════════════════════════════════════════════════
//                 CAPTIVE PORTAL DASHBOARD HTML
//  Full dark military/rescue aesthetic — responsive, single page
// ═══════════════════════════════════════════════════════════════
// =============================================================================
const char DASHBOARD_HTML[] PROGMEM = R"HTMLDOC(
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AEGIS-BEACON // CONFIG</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;600;900&family=Rajdhani:wght@300;500;700&display=swap');

:root {
  --bg:#07090e; --s1:#0b1019; --s2:#0f1825; --border:#182640;
  --a1:#00e5ff; --a2:#ff3b3b; --a3:#39ff14; --a4:#ff9900;
  --txt:#b8ccd8; --dim:#3a5060; --dim2:#2a3a48;
  --glow1:0 0 18px rgba(0,229,255,.35);
  --glow2:0 0 18px rgba(255,59,59,.35);
  --glow3:0 0 18px rgba(57,255,20,.35);
  --r:5px; --r2:10px;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  background:var(--bg); color:var(--txt);
  font-family:'Share Tech Mono',monospace;
  min-height:100vh;
  background-image:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,100,160,.18) 0%, transparent 70%),
    repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(0,229,255,.025) 48px,rgba(0,229,255,.025) 49px),
    repeating-linear-gradient(90deg,transparent,transparent 48px,rgba(0,229,255,.025) 48px,rgba(0,229,255,.025) 49px);
}

/* ── SCROLLBAR ── */
::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

/* ── HEADER ── */
header{
  display:flex; align-items:center; justify-content:space-between;
  padding:16px 28px; border-bottom:1px solid var(--border);
  background:linear-gradient(90deg,rgba(0,229,255,.04),transparent,rgba(0,229,255,.04));
  position:sticky; top:0; z-index:50; backdrop-filter:blur(12px);
}
.logo{font-family:'Orbitron',sans-serif;font-weight:900;font-size:1.25rem;
  color:var(--a1);text-shadow:var(--glow1);letter-spacing:5px;}
.logo em{color:var(--a2);font-style:normal;text-shadow:var(--glow2);}
.hdr-right{display:flex;align-items:center;gap:16px;}
.badge{font-size:.6rem;color:var(--a1);border:1px solid var(--a1);padding:3px 10px;
  border-radius:2px;letter-spacing:3px;animation:pulse 2.5s infinite;}
@keyframes pulse{0%,100%{opacity:1;box-shadow:var(--glow1)}50%{opacity:.4;box-shadow:none}}

/* ── MODE TOGGLE (big physical-feel switch) ── */
.mode-toggle-wrap{
  display:flex;flex-direction:column;align-items:center;gap:8px;
  background:var(--s2);border:1px solid var(--border);border-radius:var(--r2);
  padding:20px 28px;
}
.mode-label{font-family:'Orbitron',sans-serif;font-size:.65rem;letter-spacing:3px;color:var(--dim);margin-bottom:4px;}
.toggle-switch{
  position:relative; width:180px; height:48px;
  background:var(--s1);border-radius:24px;cursor:pointer;
  border:2px solid var(--border);
  transition:border-color .3s;
  user-select:none;
}
.toggle-switch.beacon{border-color:var(--a2);}
.toggle-switch.search{border-color:var(--a1);}
.toggle-knob{
  position:absolute;top:4px;width:82px;height:36px;border-radius:20px;
  transition:left .3s cubic-bezier(.4,0,.2,1),background .3s;
  display:flex;align-items:center;justify-content:center;
  font-family:'Orbitron',sans-serif;font-size:.6rem;letter-spacing:2px;font-weight:600;
}
.toggle-switch.beacon .toggle-knob{left:4px;background:var(--a2);color:#fff;box-shadow:var(--glow2);}
.toggle-switch.search .toggle-knob{left:90px;background:var(--a1);color:#000;box-shadow:var(--glow1);}
.toggle-labels{display:flex;width:180px;justify-content:space-between;font-size:.65rem;}
.toggle-labels span:first-child{color:var(--a2);}
.toggle-labels span:last-child{color:var(--a1);}
.mode-desc{font-size:.68rem;color:var(--dim);text-align:center;max-width:280px;line-height:1.6;}

/* ── LAYOUT ── */
main{max-width:960px;margin:0 auto;padding:28px 20px;display:grid;gap:18px;grid-template-columns:1fr 1fr;}
@media(max-width:640px){main{grid-template-columns:1fr;padding:16px 12px;}}

/* ── CARDS ── */
.card{
  background:var(--s1);border:1px solid var(--border);border-radius:var(--r2);
  padding:22px;position:relative;overflow:hidden;
  transition:border-color .25s, box-shadow .25s;
}
.card:hover{border-color:rgba(0,229,255,.25);}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--a1),transparent);opacity:.5;}
.card.full{grid-column:1/-1}
.card.alert::before{background:linear-gradient(90deg,transparent,var(--a2),transparent);}
.card.ok::before{background:linear-gradient(90deg,transparent,var(--a3),transparent);}

.ct{font-family:'Orbitron',sans-serif;font-size:.65rem;letter-spacing:3px;
  color:var(--a1);margin-bottom:18px;text-transform:uppercase;display:flex;align-items:center;gap:8px;}
.ct-dot{width:7px;height:7px;border-radius:50%;background:var(--a1);box-shadow:var(--glow1);animation:pulse 2.5s infinite;}
.card.alert .ct{color:var(--a2);} .card.alert .ct-dot{background:var(--a2);box-shadow:var(--glow2);}
.card.ok .ct{color:var(--a3);} .card.ok .ct-dot{background:var(--a3);box-shadow:var(--glow3);}

/* ── FORM ELEMENTS ── */
label{display:block;font-size:.68rem;color:var(--dim);margin-bottom:5px;letter-spacing:1px;}
.form-row{margin-bottom:16px;}
input[type=text],input[type=number],textarea,select{
  width:100%;background:#050810;border:1px solid var(--border);border-radius:var(--r);
  color:var(--txt);font-family:'Share Tech Mono',monospace;font-size:.88rem;
  padding:9px 12px;outline:none;transition:border-color .2s,box-shadow .2s;
}
input:focus,textarea:focus,select:focus{border-color:var(--a1);box-shadow:0 0 0 2px rgba(0,229,255,.1);}
textarea{resize:vertical;min-height:68px;line-height:1.5;}

input[type=range]{-webkit-appearance:none;width:100%;height:5px;background:var(--border);
  border-radius:3px;outline:none;margin:10px 0 3px;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;
  border-radius:50%;background:var(--a1);cursor:pointer;box-shadow:var(--glow1);transition:transform .15s;}
input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.2);}

.range-row{display:flex;justify-content:space-between;font-size:.62rem;color:var(--dim);}
.val-big{font-family:'Orbitron',sans-serif;font-size:1.5rem;color:var(--a1);
  text-shadow:var(--glow1);text-align:center;margin-top:6px;}

/* ── TOGGLE CHECKBOX ── */
.tog-wrap{display:flex;align-items:center;gap:12px;cursor:pointer;margin-top:4px;}
.tog-cb{position:relative;width:44px;height:24px;flex-shrink:0;}
.tog-cb input{opacity:0;width:0;height:0;}
.tog-slider{position:absolute;inset:0;background:var(--dim2);border-radius:12px;cursor:pointer;
  transition:background .25s;border:1px solid var(--border);}
.tog-slider::before{content:'';position:absolute;width:18px;height:18px;left:2px;top:2px;
  background:#666;border-radius:50%;transition:transform .25s,background .25s;}
.tog-cb input:checked + .tog-slider{background:rgba(0,229,255,.15);border-color:var(--a1);}
.tog-cb input:checked + .tog-slider::before{transform:translateX(20px);background:var(--a1);box-shadow:var(--glow1);}
.tog-lbl{font-size:.78rem;color:var(--txt);}

/* ── FREQUENCY LIST ── */
#freqList{list-style:none;margin-bottom:12px;}
#freqList li{display:flex;align-items:center;gap:8px;padding:8px 11px;
  background:#050810;border:1px solid var(--border);border-radius:var(--r);
  margin-bottom:5px;font-size:.84rem;animation:fadeIn .2s ease;}
@keyframes fadeIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}
.fv{flex:1;color:var(--a1);font-family:'Orbitron',sans-serif;font-size:.8rem;}
.fb{color:var(--dim);font-size:.63rem;margin-right:4px;}
.fi{color:var(--a3);font-size:.63rem;}
.del{background:none;border:1px solid #2a1010;color:var(--a2);padding:2px 8px;
  border-radius:3px;cursor:pointer;font-size:.7rem;transition:background .15s;font-family:inherit;}
.del:hover{background:rgba(255,59,59,.12);}
.add-row{display:flex;gap:8px;}.add-row input{flex:1;}

/* ── SCAN HITS PANEL ── */
#scanList{max-height:200px;overflow-y:auto;margin-top:8px;}
.hit-row{display:flex;align-items:center;gap:10px;padding:6px 10px;
  border-bottom:1px solid var(--dim2);font-size:.77rem;animation:fadeIn .2s ease;}
.hit-freq{color:var(--a1);font-family:'Orbitron',sans-serif;font-size:.75rem;min-width:100px;}
.hit-rssi{min-width:70px;}
.hit-lbl{font-size:.65rem;padding:1px 7px;border-radius:2px;font-family:'Orbitron',sans-serif;letter-spacing:1px;}
.hit-lbl.STRONG{background:rgba(57,255,20,.12);color:var(--a3);border:1px solid var(--a3);}
.hit-lbl.MEDIUM{background:rgba(255,153,0,.1);color:var(--a4);border:1px solid var(--a4);}
.hit-lbl.WEAK  {background:rgba(0,229,255,.07);color:var(--a1);border:1px solid var(--a1);}
.hit-time{color:var(--dim);font-size:.63rem;margin-left:auto;}
.no-hits{color:var(--dim);font-size:.75rem;padding:16px 0;text-align:center;}

/* ── SIGNAL BAR (RSSI visualizer) ── */
.rssi-bar-wrap{display:flex;align-items:center;gap:8px;margin-top:6px;}
.rssi-bar-bg{flex:1;height:8px;background:var(--dim2);border-radius:4px;overflow:hidden;}
.rssi-bar{height:100%;border-radius:4px;transition:width .4s;background:linear-gradient(90deg,var(--a2),var(--a4),var(--a3));}
.rssi-val{font-size:.75rem;color:var(--txt);min-width:60px;text-align:right;}

/* ── MORSE PREVIEW ── */
#morsePreview{font-size:.9rem;letter-spacing:4px;color:var(--a1);word-break:break-all;
  min-height:24px;margin-top:8px;text-shadow:var(--glow1);line-height:1.8;}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 20px;
  border-radius:var(--r);font-family:'Orbitron',sans-serif;font-size:.65rem;letter-spacing:2px;
  cursor:pointer;border:1px solid;transition:all .2s;text-transform:uppercase;white-space:nowrap;}
.btn:disabled{opacity:.4;cursor:not-allowed;}
.btn-c{background:rgba(0,229,255,.08);border-color:var(--a1);color:var(--a1);}
.btn-c:hover:not(:disabled){background:rgba(0,229,255,.18);box-shadow:var(--glow1);}
.btn-d{background:rgba(255,59,59,.08);border-color:var(--a2);color:var(--a2);}
.btn-d:hover:not(:disabled){background:rgba(255,59,59,.2);box-shadow:var(--glow2);}
.btn-g{background:rgba(57,255,20,.08);border-color:var(--a3);color:var(--a3);}
.btn-g:hover:not(:disabled){background:rgba(57,255,20,.18);box-shadow:var(--glow3);}
.btn-save{width:100%;padding:14px;font-size:.75rem;margin-top:4px;
  background:linear-gradient(135deg,rgba(0,229,255,.12),rgba(0,120,160,.12));
  border-color:var(--a1);color:var(--a1);}
.btn-save:hover{background:rgba(0,229,255,.22);box-shadow:var(--glow1);}
.btn-row{display:flex;gap:10px;flex-wrap:wrap;}

/* ── TX INDICATOR ── */
.tx-dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;
  background:var(--a2);box-shadow:var(--glow2);}
.tx-dot.on{animation:blink .2s step-start infinite;}
@keyframes blink{50%{opacity:0}}

/* ── STATUS ROW ── */
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.stat-item{background:#050810;border:1px solid var(--dim2);border-radius:var(--r);padding:10px 14px;}
.stat-lbl{font-size:.6rem;color:var(--dim);letter-spacing:1px;margin-bottom:3px;}
.stat-val{font-family:'Orbitron',sans-serif;font-size:.85rem;color:var(--a1);}
.stat-val.ok{color:var(--a3);} .stat-val.warn{color:var(--a4);} .stat-val.err{color:var(--a2);}

/* ── TOAST ── */
#toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
  background:var(--s2);border:1px solid var(--a1);color:var(--a1);
  padding:10px 24px;border-radius:var(--r);font-size:.76rem;letter-spacing:1px;
  box-shadow:var(--glow1);opacity:0;pointer-events:none;transition:opacity .3s;z-index:200;}
#toast.show{opacity:1} #toast.err{border-color:var(--a2);color:var(--a2);box-shadow:var(--glow2);}

/* ── SECTION DIVIDER ── */
.section-hdr{grid-column:1/-1;display:flex;align-items:center;gap:16px;margin-top:8px;}
.section-hdr span{font-family:'Orbitron',sans-serif;font-size:.62rem;letter-spacing:4px;color:var(--dim);white-space:nowrap;}
.section-hdr::before,.section-hdr::after{content:'';flex:1;height:1px;background:var(--border);}

/* ── EMERGENCY CARD ── */
.emg-btn{width:100%;padding:16px;font-size:.75rem;letter-spacing:3px;
  background:rgba(255,59,59,.12);border:2px solid var(--a2);color:var(--a2);
  animation:emgPulse 2s infinite;}
@keyframes emgPulse{0%,100%{box-shadow:var(--glow2)}50%{box-shadow:none}}
.emg-btn:hover{background:rgba(255,59,59,.25);}

/* ── DBG HINT ── */
.dbg-box{background:#050810;border:1px solid var(--dim2);border-radius:var(--r);
  padding:12px 14px;font-size:.68rem;line-height:1.8;color:var(--dim);}
.dbg-box code{color:var(--a1);background:rgba(0,229,255,.07);padding:1px 5px;border-radius:2px;}
</style>
</head>
<body>

<header>
  <div class="logo">AEGIS<em>⬡</em>BEACON</div>
  <div class="hdr-right">
    <div style="text-align:right;font-size:.6rem;color:var(--dim);line-height:1.8">
      <div>ESP32-C3 + RA-02 SX1276</div>
      <div id="hdrMode" style="color:var(--a1)">LOADING...</div>
    </div>
    <div class="badge">◉ CONFIG AP</div>
  </div>
</header>

<main>

  <!-- ═══ MODE TOGGLE ═══ -->
  <div class="card full">
    <div class="ct"><span class="ct-dot"></span>OPERATING MODE</div>
    <div style="display:flex;flex-wrap:wrap;gap:28px;align-items:flex-start;justify-content:center">
      <div class="mode-toggle-wrap">
        <div class="mode-label">CURRENT MODE</div>
        <div class="toggle-switch beacon" id="modeToggle" onclick="toggleMode()">
          <div class="toggle-knob" id="modeKnob">BEACON</div>
        </div>
        <div class="toggle-labels">
          <span>⬤ BEACON</span>
          <span>SEARCH ⬤</span>
        </div>
      </div>
      <div style="max-width:360px">
        <div id="modeDescBeacon" class="mode-desc" style="color:#ff6b6b">
          <strong style="color:var(--a2)">BEACON MODE</strong> — Device transmits an SOS Morse signal on all configured frequencies in a loop.
          Use this when you are buried or lost and need rescuers to find you.
          Red LED blinks during each transmission.
        </div>
        <div id="modeDescSearch" class="mode-desc" style="display:none;color:#7ee8fa">
          <strong style="color:var(--a1)">SEARCH MODE</strong> — Device scans all configured frequencies and measures signal strength (RSSI).
          Use this to locate other beacons. Blue LED blinks when a signal is detected above the RSSI threshold.
        </div>
        <div style="margin-top:14px;padding:10px 14px;background:#050810;border:1px solid var(--dim2);border-radius:var(--r);font-size:.68rem;color:var(--dim)">
          <strong style="color:var(--txt)">Physical buttons:</strong><br>
          SW_MODE short press → toggle BEACON / SEARCH<br>
          SW_MODE hold 2s → Emergency SOS (max power)<br>
          SW_CONFIG hold 3s → this dashboard<br>
          Both buttons at boot → factory reset
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ SECTION: BEACON ═══ -->
  <div class="section-hdr"><span>BEACON SETTINGS</span></div>

  <!-- Emergency message -->
  <div class="card full">
    <div class="ct"><span class="ct-dot"></span>EMERGENCY MESSAGE</div>
    <div class="form-row">
      <label>TRANSMISSION TEXT (alphanumeric — Morse encoded)</label>
      <textarea id="msgInput" maxlength="63" placeholder="SOS MY LOCATION IS..."></textarea>
    </div>
    <label>MORSE PREVIEW</label>
    <div id="morsePreview">· · ·  − − −  · · ·</div>
  </div>

  <!-- Frequencies -->
  <div class="card full">
    <div class="ct"><span class="ct-dot"></span>FREQUENCY MANAGER</div>
    <ul id="freqList"></ul>
    <div class="add-row" style="margin-bottom:8px">
      <input type="number" id="newFreq" placeholder="e.g. 433.500" step="0.001" min="137" max="1020">
      <button class="btn btn-c" onclick="addFreq()">＋ ADD</button>
    </div>
    <div style="font-size:.62rem;color:var(--dim);line-height:1.8">
      Common rescue: <code style="color:var(--a1)">433.500</code> ISM-EU &bull;
      <code style="color:var(--a1)">915.000</code> ISM-US &bull;
      <code style="color:var(--a1)">121.500</code> Aviation &bull;
      <code style="color:var(--a1)">156.800</code> Marine Ch16
    </div>
  </div>

  <!-- WPM -->
  <div class="card">
    <div class="ct"><span class="ct-dot"></span>MORSE SPEED</div>
    <label>WORDS PER MINUTE (WPM)</label>
    <input type="range" id="wpmSlider" min="5" max="30" value="13" oninput="updateWpm(this.value)">
    <div class="range-row"><span>5 WPM (slow)</span><span>30 WPM (fast)</span></div>
    <div class="val-big" id="wpmVal">13 WPM</div>
    <div style="font-size:.62rem;color:var(--dim);text-align:center;margin-top:8px">
      Recommended for avalanche rescue: 8–13 WPM
    </div>
  </div>

  <!-- TX Power -->
  <div class="card">
    <div class="ct"><span class="ct-dot"></span>TX POWER</div>
    <label>OUTPUT POWER — RA-02 max 17 dBm</label>
    <input type="range" id="pwrSlider" min="2" max="17" value="17" oninput="updatePwr(this.value)">
    <div class="range-row"><span>+2 dBm (min)</span><span>+17 dBm (max)</span></div>
    <div class="val-big" id="pwrVal">+17 dBm</div>
  </div>

  <!-- Repeat + Sleep -->
  <div class="card">
    <div class="ct"><span class="ct-dot"></span>CYCLE TIMING</div>
    <div class="form-row">
      <label>DEEP SLEEP BETWEEN CYCLES (seconds)</label>
      <input type="number" id="sleepInput" min="1" max="3600" value="10">
    </div>
    <div class="form-row">
      <label>MESSAGE REPEAT PER CYCLE (1–5)</label>
      <input type="number" id="repeatInput" min="1" max="5" value="1">
    </div>
    <div style="font-size:.62rem;color:var(--dim)">
      10s sleep + 1 repeat ≈ 72h on 2000mAh 18650
    </div>
  </div>

  <!-- Auto-switch -->
  <div class="card">
    <div class="ct"><span class="ct-dot"></span>SMART OPTIONS</div>
    <div class="form-row">
      <label class="tog-wrap" for="autoSwitch">
        <div class="tog-cb"><input type="checkbox" id="autoSwitch"><span class="tog-slider"></span></div>
        <span class="tog-lbl">Auto-switch to BEACON if battery low</span>
      </label>
    </div>
    <div class="form-row" style="margin-top:16px">
      <label>EMERGENCY MESSAGE PREFIX (auto-prepended in emergency mode)</label>
      <input type="text" id="emergPrefix" value="SOS" maxlength="20" placeholder="SOS">
    </div>
  </div>

  <!-- ═══ SECTION: SEARCH ═══ -->
  <div class="section-hdr"><span>SEARCH / SCAN SETTINGS</span></div>

  <!-- Scan dwell + RSSI threshold -->
  <div class="card">
    <div class="ct"><span class="ct-dot"></span>SCAN PARAMETERS</div>
    <div class="form-row">
      <label>DWELL TIME PER FREQUENCY (ms)</label>
      <input type="number" id="dwellInput" min="100" max="5000" value="400">
    </div>
    <div class="form-row">
      <label>RSSI DETECTION THRESHOLD (dBm)</label>
      <input type="range" id="rssiSlider" min="-120" max="-40" value="-90" oninput="updateRssi(this.value)">
      <div class="range-row"><span>-120 (very sensitive)</span><span>-40 (strong only)</span></div>
      <div class="val-big" id="rssiVal" style="color:var(--a4)">-90 dBm</div>
    </div>
    <div style="font-size:.62rem;color:var(--dim)">
      Typical RA-02 noise floor: −110 dBm. Recommend −90 dBm threshold.
    </div>
  </div>

  <!-- Scan history panel -->
  <div class="card ok">
    <div class="ct"><span class="ct-dot"></span>DETECTED SIGNALS</div>
    <div class="btn-row" style="margin-bottom:12px">
      <button class="btn btn-g" onclick="loadHits()">↻ REFRESH</button>
      <button class="btn btn-d" onclick="clearHits()">✕ CLEAR</button>
    </div>
    <div id="scanList"><div class="no-hits">No signals detected yet</div></div>
  </div>

  <!-- ═══ SECTION: RF TEST ═══ -->
  <div class="section-hdr"><span>RF TEST &amp; DIAGNOSTICS</span></div>

  <div class="card alert">
    <div class="ct"><span class="ct-dot"></span>TRANSMIT TEST</div>
    <div style="font-size:.75rem;color:var(--dim);margin-bottom:14px">
      Sends one SOS burst on the first configured frequency. Monitor with any SDR receiver or analog AM scanner.
    </div>
    <div class="btn-row">
      <button class="btn btn-d" id="testTxBtn" onclick="sendTest()">
        <span class="tx-dot" id="txLed"></span>SEND TEST SOS
      </button>
      <button class="btn btn-c" id="testScanBtn" onclick="sendScan()">
        ◈ SCAN NOW
      </button>
    </div>
    <div id="testStatus" style="font-size:.7rem;color:var(--dim);margin-top:10px;min-height:20px"></div>
  </div>

  <!-- Device Status -->
  <div class="card">
    <div class="ct"><span class="ct-dot"></span>DEVICE STATUS</div>
    <div class="stat-grid" id="statusGrid">
      <div class="stat-item"><div class="stat-lbl">BOOT CYCLES</div><div class="stat-val" id="st-boot">--</div></div>
      <div class="stat-item"><div class="stat-lbl">TX CYCLES</div><div class="stat-val" id="st-tx">--</div></div>
      <div class="stat-item"><div class="stat-lbl">SCAN CYCLES</div><div class="stat-val" id="st-scan">--</div></div>
      <div class="stat-item"><div class="stat-lbl">HITS LOGGED</div><div class="stat-val ok" id="st-hits">--</div></div>
      <div class="stat-item"><div class="stat-lbl">FREE HEAP</div><div class="stat-val" id="st-heap">--</div></div>
      <div class="stat-item"><div class="stat-lbl">UPTIME</div><div class="stat-val" id="st-up">--</div></div>
    </div>
    <button class="btn btn-c" style="margin-top:12px;width:100%" onclick="loadStatus()">↻ REFRESH STATUS</button>
  </div>

  <!-- ═══ EMERGENCY ═══ -->
  <div class="section-hdr"><span>EMERGENCY</span></div>

  <div class="card alert full">
    <div class="ct"><span class="ct-dot"></span>EMERGENCY OVERRIDE</div>
    <div style="font-size:.75rem;color:var(--dim);margin-bottom:16px;max-width:600px">
      Forces device into maximum-power BEACON mode immediately, bypassing all sleep cycles.
      Equivalent to holding SW_MODE for 2 seconds on the physical device.
      <strong style="color:var(--a2)">Use only in life-threatening emergency.</strong>
    </div>
    <button class="btn emg-btn" onclick="triggerEmergency()">⚡ ACTIVATE EMERGENCY SOS — MAXIMUM POWER</button>
  </div>

  <!-- Debug info -->
  <div class="section-hdr"><span>DEBUG</span></div>
  <div class="card full">
    <div class="ct"><span class="ct-dot"></span>SERIAL DEBUG TERMINAL</div>
    <div class="dbg-box">
      Connect via USB-C → open Serial Monitor at <code>115200 baud</code> for full real-time log.<br>
      Linux/Mac: <code>picocom -b 115200 /dev/ttyUSB0</code> &nbsp;|&nbsp;
      Windows: <code>PuTTY → COM port → 115200</code><br><br>
      Log tags: <code>[INFO]</code> normal &nbsp;·&nbsp; <code>[OK]</code> success &nbsp;·&nbsp;
      <code>[WARN]</code> anomaly &nbsp;·&nbsp; <code>[ERROR]</code> failure &nbsp;·&nbsp;
      <code>[SCAN]</code> RSSI data &nbsp;·&nbsp; <code>[BTN]</code> button events<br>
      Set <code>DEBUG_VERBOSE 1</code> in firmware for per-symbol Morse + RF register logs.
    </div>
  </div>

  <!-- SAVE -->
  <div class="card full">
    <button class="btn btn-save" onclick="saveAll()">✔ SAVE ALL SETTINGS &amp; REBOOT TO SELECTED MODE</button>
  </div>

</main>
<div id="toast"></div>

<script>
// ── STATE ─────────────────────────────────────────────────────────────────
let freqs = [433.500];
let currentMode = 'BEACON';

const MORSE = {A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'};

function toMorse(t){return t.toUpperCase().split('').map(c=>c===' '?'/':MORSE[c]||'?').join(' ');}

// ── LOAD ─────────────────────────────────────────────────────────────────
async function loadAll() {
  try {
    const d = await (await fetch('/config')).json();
    freqs = d.freqs || [433.5];
    currentMode = d.mode || 'BEACON';
    document.getElementById('msgInput').value   = d.message || 'SOS';
    document.getElementById('wpmSlider').value  = d.wpm || 13;
    document.getElementById('pwrSlider').value  = d.power || 17;
    document.getElementById('sleepInput').value = d.sleep || 10;
    document.getElementById('dwellInput').value = d.dwell || 400;
    document.getElementById('rssiSlider').value = d.rssiThresh || -90;
    document.getElementById('repeatInput').value= d.repeat || 1;
    document.getElementById('autoSwitch').checked = d.autoSwitch || false;
    document.getElementById('emergPrefix').value  = d.emergPrefix || 'SOS';
    updateWpm(d.wpm || 13);
    updatePwr(d.power || 17);
    updateRssi(d.rssiThresh || -90);
    setModeUI(currentMode);
    renderFreqs();
    updateMorse();
    loadStatus();
    loadHits();
  } catch(e) { toast('Config load failed',true); }
}

// ── MORSE PREVIEW ─────────────────────────────────────────────────────────
function updateMorse(){document.getElementById('morsePreview').textContent=toMorse(document.getElementById('msgInput').value||'SOS');}
document.getElementById('msgInput').addEventListener('input', updateMorse);

// ── SLIDERS ───────────────────────────────────────────────────────────────
function updateWpm(v){document.getElementById('wpmVal').textContent=v+' WPM';document.getElementById('wpmSlider').value=v;}
function updatePwr(v){document.getElementById('pwrVal').textContent='+'+v+' dBm';document.getElementById('pwrSlider').value=v;}
function updateRssi(v){document.getElementById('rssiVal').textContent=v+' dBm';document.getElementById('rssiSlider').value=v;}

// ── MODE TOGGLE UI ─────────────────────────────────────────────────────────
function setModeUI(mode) {
  currentMode = mode;
  const tog = document.getElementById('modeToggle');
  const knb = document.getElementById('modeKnob');
  const db  = document.getElementById('modeDescBeacon');
  const ds  = document.getElementById('modeDescSearch');
  const hm  = document.getElementById('hdrMode');
  if (mode === 'BEACON') {
    tog.className='toggle-switch beacon'; knb.textContent='BEACON';
    db.style.display=''; ds.style.display='none';
    hm.textContent='⬤ BEACON'; hm.style.color='var(--a2)';
  } else {
    tog.className='toggle-switch search'; knb.textContent='SEARCH';
    db.style.display='none'; ds.style.display='';
    hm.textContent='◈ SEARCH'; hm.style.color='var(--a1)';
  }
}
function toggleMode(){setModeUI(currentMode==='BEACON'?'SEARCH':'BEACON');}

// ── FREQUENCY LIST ─────────────────────────────────────────────────────────
function bandLabel(f){
  f=parseFloat(f);
  if(f<174) return '2M VHF';
  if(f<470) return '70cm UHF';
  if(f<870) return '868MHz ISM';
  if(f<930) return '915MHz ISM';
  return 'CUSTOM';
}
function renderFreqs(){
  const ul=document.getElementById('freqList'); ul.innerHTML='';
  freqs.forEach((f,i)=>{
    const li=document.createElement('li');
    const used=i===0?' <span class="fi">PRIMARY</span>':'';
    li.innerHTML=`<span class="fv">${parseFloat(f).toFixed(3)} MHz</span><span class="fb">${bandLabel(f)}</span>${used}<button class="del" onclick="removeFreq(${i})">✕</button>`;
    ul.appendChild(li);
  });
}
function addFreq(){
  const v=parseFloat(document.getElementById('newFreq').value);
  if(isNaN(v)||v<137||v>1020){toast('Invalid frequency (137–1020 MHz)',true);return;}
  if(freqs.length>=10){toast('Max 10 frequencies',true);return;}
  if(freqs.some(f=>Math.abs(f-v)<0.001)){toast('Frequency already in list',true);return;}
  freqs.push(v); document.getElementById('newFreq').value=''; renderFreqs();
}
function removeFreq(i){
  if(freqs.length<=1){toast('At least 1 frequency required',true);return;}
  freqs.splice(i,1); renderFreqs();
}

// ── STATUS ────────────────────────────────────────────────────────────────
async function loadStatus(){
  try{
    const d=await(await fetch('/status')).json();
    document.getElementById('st-boot').textContent=d.bootCycle||'0';
    document.getElementById('st-tx').textContent=d.txCycles||'0';
    document.getElementById('st-scan').textContent=d.scanCycles||'0';
    document.getElementById('st-hits').textContent=d.scanHits||'0';
    document.getElementById('st-heap').textContent=((d.freeHeap||0)/1024).toFixed(1)+'KB';
    document.getElementById('st-up').textContent=Math.floor((d.uptime||0)/1000)+'s';
  }catch(e){}
}

// ── SCAN HITS ─────────────────────────────────────────────────────────────
async function loadHits(){
  try{
    const d=await(await fetch('/hits')).json();
    const el=document.getElementById('scanList');
    if(!d.hits||d.hits.length===0){el.innerHTML='<div class="no-hits">No signals detected yet</div>';return;}
    el.innerHTML=d.hits.map(h=>{
      const rssiPct=Math.min(100,Math.max(0,((h.rssi+120)/80*100)));
      return `<div class="hit-row">
        <span class="hit-freq">${parseFloat(h.freq).toFixed(3)} MHz</span>
        <div style="flex:1">
          <div class="rssi-bar-wrap">
            <div class="rssi-bar-bg"><div class="rssi-bar" style="width:${rssiPct}%"></div></div>
            <span class="rssi-val">${h.rssi} dBm</span>
          </div>
        </div>
        <span class="hit-lbl ${h.label}">${h.label}</span>
        <span class="hit-time">T+${Math.floor(h.ts/1000)}s</span>
      </div>`;
    }).join('');
  }catch(e){}
}
async function clearHits(){
  try{await fetch('/clearhits');loadHits();toast('Scan history cleared');}catch(e){}
}

// ── TEST TX ────────────────────────────────────────────────────────────────
async function sendTest(){
  const btn=document.getElementById('testTxBtn'),led=document.getElementById('txLed'),st=document.getElementById('testStatus');
  btn.disabled=true;led.classList.add('on');
  st.textContent='Transmitting SOS on '+parseFloat(freqs[0]).toFixed(3)+' MHz...';
  try{
    const r=await fetch('/test');
    st.textContent=r.ok?'✓ Test TX complete — monitor with SDR or AM scanner.':'✕ TX failed — check hardware/wiring.';
  }catch(e){st.textContent='Request error.';}
  led.classList.remove('on');btn.disabled=false;
}
async function sendScan(){
  const btn=document.getElementById('testScanBtn'),st=document.getElementById('testStatus');
  btn.disabled=true; st.textContent='Scanning all frequencies...';
  try{
    const r=await(await fetch('/testscan')).json();
    st.innerHTML=r.results.map(x=>`${parseFloat(x.freq).toFixed(3)} MHz: <strong style="color:${x.rssi>=-90?'var(--a3)':'var(--dim)'}">${x.rssi} dBm</strong>`).join(' &nbsp;|&nbsp; ');
    loadHits();
  }catch(e){st.textContent='Scan error.';}
  btn.disabled=false;
}

// ── EMERGENCY ─────────────────────────────────────────────────────────────
async function triggerEmergency(){
  if(!confirm('ACTIVATE EMERGENCY SOS?\n\nThis will force maximum-power beacon mode immediately.\nOnly confirm in a real emergency.'))return;
  try{
    const r=await fetch('/emergency');
    if(r.ok)toast('EMERGENCY SOS ACTIVATED');
    else toast('Emergency trigger failed',true);
  }catch(e){toast('Request error',true);}
}

// ── SAVE ──────────────────────────────────────────────────────────────────
async function saveAll(){
  const payload={
    message:document.getElementById('msgInput').value.trim()||'SOS',
    wpm:    +document.getElementById('wpmSlider').value,
    power:  +document.getElementById('pwrSlider').value,
    sleep:  +document.getElementById('sleepInput').value,
    dwell:  +document.getElementById('dwellInput').value,
    rssiThresh: +document.getElementById('rssiSlider').value,
    repeat: +document.getElementById('repeatInput').value,
    autoSwitch: document.getElementById('autoSwitch').checked,
    emergPrefix: document.getElementById('emergPrefix').value.trim()||'SOS',
    mode: currentMode,
    freqs
  };
  try{
    const r=await fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(r.ok){
      toast('✓ Saved! Rebooting into '+currentMode+' mode...');
      setTimeout(()=>{
        document.body.innerHTML='<div style="color:var(--a1);font-family:Orbitron,sans-serif;text-align:center;padding:80px 20px;font-size:1rem;letter-spacing:4px;background:#07090e;min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:20px">'+(currentMode==='BEACON'?'<div style="color:#ff3b3b">⬤ BEACON MODE ACTIVE</div><div style="font-size:.7rem;color:#666">Transmitting SOS on all frequencies</div>':'<div style="color:#00e5ff">◈ SEARCH MODE ACTIVE</div><div style="font-size:.7rem;color:#666">Scanning for signals...</div>')+'</div>';
      },1500);
    }else toast('Save failed',true);
  }catch(e){toast('Network error',true);}
}

// ── TOAST ─────────────────────────────────────────────────────────────────
function toast(msg,err=false){
  const t=document.getElementById('toast');t.textContent=msg;
  t.className='show'+(err?' err':'');
  setTimeout(()=>{t.className='';},3500);
}

// ── BOOT ─────────────────────────────────────────────────────────────────
loadAll();
setInterval(loadStatus,10000);
setInterval(loadHits,5000);
</script>
</body>
</html>
)HTMLDOC";

// =============================================================================
// WEB SERVER HANDLERS
// =============================================================================

void handleRoot() {
  LOG_INFO("HTTP GET /  — dashboard (%d bytes)", strlen_P(DASHBOARD_HTML));
  server.send_P(200, "text/html", DASHBOARD_HTML);
}

void handleConfig() {
  String j = "{";
  j += "\"mode\":\""     + String(modeName(cfg.lastMode)) + "\",";
  j += "\"message\":\""  + String(cfg.message)            + "\",";
  j += "\"wpm\":"        + String(cfg.wpm)                + ",";
  j += "\"power\":"      + String(cfg.powerDbm)           + ",";
  j += "\"sleep\":"      + String(cfg.sleepSec)           + ",";
  j += "\"dwell\":"      + String(cfg.scanDwellMs)        + ",";
  j += "\"rssiThresh\":" + String(cfg.rssiThreshold)      + ",";
  j += "\"repeat\":"     + String(cfg.repeatCount)        + ",";
  j += "\"autoSwitch\":" + String(cfg.autoSwitch?"true":"false") + ",";
  j += "\"emergPrefix\":\"SOS\",";
  j += "\"freqs\":[";
  for (int i = 0; i < cfg.freqCount; i++) {
    if (i) j += ",";
    j += String(cfg.freqs[i], 3);
  }
  j += "]}";
  LOG_CFG("GET /config → %s", j.c_str());
  server.send(200, "application/json", j);
}

void handleStatus() {
  char buf[256];
  snprintf(buf, sizeof(buf),
    "{\"bootCycle\":%lu,\"txCycles\":%lu,\"scanCycles\":%lu,"
    "\"scanHits\":%d,\"freeHeap\":%lu,\"uptime\":%lu,\"mode\":\"%s\","
    "\"emergency\":%s}",
    g_bootCycle, g_txCycles, g_scanCycles,
    g_scanHitCount, ESP.getFreeHeap(), millis(),
    modeName(g_currentMode),
    g_emergencyActive ? "true" : "false"
  );
  server.send(200, "application/json", buf);
}

void handleHits() {
  String j = "{\"hits\":[";
  for (int i = 0; i < g_scanHitCount; i++) {
    if (i) j += ",";
    j += "{\"freq\":" + String(g_scanHits[i].freq, 3);
    j += ",\"rssi\":"  + String(g_scanHits[i].rssi);
    j += ",\"label\":\"" + String(g_scanHits[i].label) + "\"";
    j += ",\"ts\":"    + String(g_scanHits[i].timestamp) + "}";
  }
  j += "]}";
  server.send(200, "application/json", j);
}

void handleClearHits() {
  g_scanHitCount = 0;
  memset(g_scanHits, 0, sizeof(g_scanHits));
  LOG_INFO("Scan history cleared via dashboard");
  server.send(200, "text/plain", "OK");
}

void handleTest() {
  LOG_INFO("HTTP GET /test — single SOS TX test");
  server.send(200, "text/plain", "OK");
  if (initRadioOOK(cfg.freqs[0], cfg.powerDbm)) {
    transmitMessage("SOS", false);
    radio.standby();
    LOG_OK("Test TX complete");
  } else {
    LOG_ERR("Test TX: radio init failed");
  }
}

void handleTestScan() {
  LOG_INFO("HTTP GET /testscan — scanning all frequencies");
  String j = "{\"results\":[";
  for (int i = 0; i < cfg.freqCount; i++) {
    ScanResult r = scanFrequency(cfg.freqs[i]);
    if (i) j += ",";
    j += "{\"freq\":" + String(r.freq, 3) + ",\"rssi\":" + String(r.rssi) + "}";
    if (r.detected) recordScanHit(r.freq, r.rssi);
  }
  j += "]}";
  server.send(200, "application/json", j);
}

void handleEmergency() {
  LOG_WARN("EMERGENCY SOS activated via dashboard!");
  g_emergencyActive = true;
  g_currentMode     = MODE_EMERGENCY;
  cfg.lastMode      = MODE_EMERGENCY;
  saveConfig();
  server.send(200, "text/plain", "EMERGENCY_ACTIVE");
  delay(500);
  ESP.restart();
}

void handleSave() {
  LOG_SECTION("HTTP POST /save");
  if (!server.hasArg("plain")) { server.send(400, "text/plain", "No body"); return; }

  String body = server.arg("plain");
  LOG_CFG("Body (%d B): %s", body.length(), body.c_str());

  StaticJsonDocument<1024> doc;
  if (deserializeJson(doc, body) != DeserializationError::Ok) {
    LOG_ERR("JSON parse error");
    server.send(400, "text/plain", "JSON error");
    return;
  }

  strlcpy(cfg.message, doc["message"] | DEFAULT_MESSAGE, MAX_MESSAGE_LEN);
  cfg.wpm          = constrain((int)doc["wpm"],        5, 30);
  cfg.powerDbm     = constrain((int)doc["power"],      2, 17);
  cfg.sleepSec     = constrain((uint32_t)doc["sleep"], 1UL, 3600UL);
  cfg.scanDwellMs  = constrain((int)doc["dwell"],    100, 5000);
  cfg.rssiThreshold= constrain((int)doc["rssiThresh"],-120, -40);
  cfg.repeatCount  = constrain((int)doc["repeat"],     1,  5);
  cfg.autoSwitch   = doc["autoSwitch"] | false;

  const char* modeStr = doc["mode"] | "BEACON";
  cfg.lastMode = (strcmp(modeStr,"SEARCH")==0) ? MODE_SEARCH : MODE_BEACON;

  JsonArray arr = doc["freqs"].as<JsonArray>();
  cfg.freqCount = 0;
  for (float f : arr) {
    if (cfg.freqCount >= MAX_FREQUENCIES) break;
    if (f >= 137.0f && f <= 1020.0f) cfg.freqs[cfg.freqCount++] = f;
  }
  if (!cfg.freqCount) { cfg.freqs[0] = DEFAULT_FREQ_MHZ; cfg.freqCount = 1; }

  LOG_CFG("Saved: mode=%s msg=\"%s\" wpm=%d pwr=%d sleep=%lu freqs=%d",
          modeName(cfg.lastMode), cfg.message, cfg.wpm, cfg.powerDbm, cfg.sleepSec, cfg.freqCount);

  saveConfig();
  server.send(200, "text/plain", "OK");
  delay(1200);
  ESP.restart();
}

void handleNotFound() {
  server.sendHeader("Location", String("http://") + AP_IP, true);
  server.send(302, "text/plain", "");
}

// =============================================================================
// CONFIG MODE
// =============================================================================
void runConfigMode() {
  dbSep("CONFIG MODE");
  blinkLed(PIN_LED_RED, 2, 150);
  blinkLed(PIN_LED_BLUE, 2, 150);

  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASS);
  WiFi.softAPConfig(IPAddress(192,168,4,1), IPAddress(192,168,4,1), IPAddress(255,255,255,0));

  dns.start(53, "*", IPAddress(192,168,4,1));

  server.on("/",          HTTP_GET,  handleRoot);
  server.on("/config",    HTTP_GET,  handleConfig);
  server.on("/status",    HTTP_GET,  handleStatus);
  server.on("/hits",      HTTP_GET,  handleHits);
  server.on("/clearhits", HTTP_GET,  handleClearHits);
  server.on("/test",      HTTP_GET,  handleTest);
  server.on("/testscan",  HTTP_GET,  handleTestScan);
  server.on("/emergency", HTTP_GET,  handleEmergency);
  server.on("/save",      HTTP_POST, handleSave);
  server.onNotFound(handleNotFound);
  server.begin();

  LOG_OK("Config AP active — SSID: \"%s\"  URL: http://%s", AP_SSID, AP_IP);
  LOG_INFO("Connect phone/laptop to \"%s\" → browser opens automatically", AP_SSID);

  uint32_t start = millis();
  uint32_t lastHb = 0;

  while (true) {
    dns.processNextRequest();
    server.handleClient();
    esp_task_wdt_reset();

    // LED heartbeat
    digitalWrite(PIN_LED_RED,  (millis() / 700) % 2);
    digitalWrite(PIN_LED_BLUE, (millis() / 1100) % 2);

    // Status heartbeat every 30s
    if (millis() - lastHb > 30000) {
      LOG_INFO("Config AP alive — %lu s remaining | clients: %d",
               (CONFIG_AP_TIMEOUT - (millis()-start)) / 1000,
               WiFi.softAPgetStationNum());
      lastHb = millis();
    }

    // Short press SW_CONFIG while in config = print status
    if (g_configButtonPressed) {
      uint8_t press = checkButton(PIN_SW_CONFIG, BTN_LONG_CFG_MS, g_configButtonPressed);
      if (press == 1) printStatus();
    }

    if (millis() - start > CONFIG_AP_TIMEOUT) {
      LOG_WARN("Config timeout — rebooting to %s mode", modeName(cfg.lastMode));
      ledsOff();
      ESP.restart();
    }
    yield();
  }
}

// =============================================================================
// BEACON MODE
// =============================================================================
void runBeaconMode(bool emergency = false) {
  dbSep(emergency ? "EMERGENCY SOS MODE" : "BEACON MODE");
  LOG_MODE("Mode: %s", emergency ? "EMERGENCY" : "BEACON");
  LOG_INFO("Message     : \"%s\"", cfg.message);
  LOG_INFO("Frequencies : %d", cfg.freqCount);
  LOG_INFO("WPM         : %d  (dot=%lu ms)", cfg.wpm, dotMs());
  LOG_INFO("Power       : %d dBm", cfg.powerDbm);
  LOG_INFO("Repeat      : %d×", cfg.repeatCount);
  LOG_INFO("Sleep after : %lu s", emergency ? 0UL : cfg.sleepSec);

  WiFi.mode(WIFI_OFF);
  btStop();
  LOG_INFO("WiFi + BT disabled");

  int8_t  txPower  = emergency ? 17 : cfg.powerDbm;
  uint8_t repeats  = emergency ? 3  : cfg.repeatCount;

  uint32_t cycleStart = millis();
  g_txCycles++;

  for (int fi = 0; fi < cfg.freqCount; fi++) {
    float freq = cfg.freqs[fi];
    dbSep();
    LOG_INFO("Hop %d/%d → %.3f MHz", fi+1, cfg.freqCount, freq);

    if (!initRadioOOK(freq, txPower)) {
      LOG_ERR("Radio init FAILED — %.3f MHz skipped", freq);
      blinkLed(PIN_LED_RED, 6, 40);
      continue;
    }

    for (int r = 0; r < repeats; r++) {
      LOG_INFO("Repeat %d/%d", r+1, repeats);
      bool completed = transmitMessage(cfg.message, !emergency);

      if (!completed && !emergency) {
        LOG_WARN("TX interrupted — processing mode button");
        goto mode_switch;  // jump out of nested loops cleanly
      }
      if (r < repeats-1) delay(interChrMs() * 3);  // pause between repeats
    }

    radio.standby();
    delay(50);

    // Check mode button between frequencies
    if (!emergency && g_modeButtonPressed) {
      uint8_t press = checkButton(PIN_SW_MODE, BTN_LONG_MODE_MS, g_modeButtonPressed);
      if (press == 2) {
        LOG_WARN("Long press — activating EMERGENCY SOS");
        g_emergencyActive = true;
        g_currentMode = MODE_EMERGENCY;
        goto mode_switch;
      } else if (press == 1) {
        LOG_MODE("Short press — switching to SEARCH mode");
        g_currentMode = MODE_SEARCH;
        cfg.lastMode  = MODE_SEARCH;
        saveConfig();
        goto mode_switch;
      }
    }
    if (!emergency && g_configButtonPressed) {
      uint8_t press = checkButton(PIN_SW_CONFIG, BTN_LONG_CFG_MS, g_configButtonPressed);
      if (press == 2) { goto enter_config; }
      if (press == 1) { printStatus(); }
    }
  }

  radio.sleep();
  LOG_OK("Beacon cycle done in %lu ms", millis() - cycleStart);

  if (emergency) {
    LOG_WARN("Emergency mode: no sleep — repeating immediately");
    delay(500);
    runBeaconMode(true);  // recursive — continuous emergency TX
    return;
  }

  {
    uint64_t sleepUs = (uint64_t)cfg.sleepSec * 1000000ULL;
    LOG_INFO("Deep sleep %lu s...", cfg.sleepSec);
    Serial.flush();
    ledsOff();
    esp_deep_sleep(sleepUs);
  }
  return;

mode_switch:
  radio.sleep(); ledsOff();
  LOG_MODE("Mode switch → %s", modeName(g_currentMode));
  ledModeIndicate(g_currentMode);
  delay(300);
  ESP.restart();

enter_config:
  radio.sleep(); ledsOff();
  g_currentMode = MODE_CONFIG;
  runConfigMode();
}

// =============================================================================
// SEARCH MODE
// =============================================================================
void runSearchMode() {
  dbSep("SEARCH MODE");
  LOG_MODE("Entering SEARCH mode");
  LOG_INFO("Frequencies  : %d", cfg.freqCount);
  LOG_INFO("Dwell/freq   : %d ms", cfg.scanDwellMs);
  LOG_INFO("RSSI thresh  : %d dBm", cfg.rssiThreshold);

  WiFi.mode(WIFI_OFF);
  btStop();
  LOG_INFO("WiFi + BT disabled");

  g_scanCycles++;
  uint32_t scanStart = millis();
  uint16_t detectionCount = 0;

  // Continuous scan loop until mode button pressed
  while (true) {
    dbSep();
    LOG_SCAN("Scan pass — %d frequencies", cfg.freqCount);
    bool anyDetected = false;

    for (int fi = 0; fi < cfg.freqCount; fi++) {
      // Poll mode button before each frequency
      if (g_modeButtonPressed) {
        uint8_t press = checkButton(PIN_SW_MODE, BTN_LONG_MODE_MS, g_modeButtonPressed);
        if (press == 2) {
          LOG_WARN("Long press in SEARCH — activating EMERGENCY SOS");
          g_emergencyActive = true;
          g_currentMode = MODE_EMERGENCY;
          goto search_exit;
        } else if (press == 1) {
          LOG_MODE("Short press — switching to BEACON mode");
          g_currentMode = MODE_BEACON;
          cfg.lastMode  = MODE_BEACON;
          saveConfig();
          goto search_exit;
        }
      }
      if (g_configButtonPressed) {
        uint8_t press = checkButton(PIN_SW_CONFIG, BTN_LONG_CFG_MS, g_configButtonPressed);
        if (press == 2) { g_currentMode = MODE_CONFIG; goto search_exit; }
        if (press == 1) { printStatus(); }
      }

      // Scan this frequency
      ScanResult result = scanFrequency(cfg.freqs[fi]);

      // Signal strength bar on serial
      int bars = 0;
      if (result.rssi > -120) bars = map(constrain(result.rssi, -120, -40), -120, -40, 0, 20);
      char bar[22] = "                    ";
      for (int b = 0; b < bars && b < 20; b++) bar[b] = '#';
      LOG_SCAN("[%d] %.3f MHz  RSSI=%4d dBm  |%s|  %s",
               fi, result.freq, result.rssi, bar,
               result.detected ? "*** SIGNAL ***" : "quiet");

      if (result.detected) {
        anyDetected = true;
        detectionCount++;
        recordScanHit(result.freq, result.rssi);
        // Flash blue LED rapidly on strong signal
        int flashes = (result.rssi >= -60) ? 5 : 2;
        blinkLed(PIN_LED_BLUE, flashes, 60);
      }

      esp_task_wdt_reset();
    }

    // Slow blue heartbeat when idle, fast when detecting
    digitalWrite(PIN_LED_BLUE, (millis() / (anyDetected ? 150 : 800)) % 2);

    uint32_t elapsed = (millis() - scanStart) / 1000;
    LOG_SCAN("Pass complete — elapsed %lu s | total detections: %d", elapsed, detectionCount);
  }

search_exit:
  ledsOff();
  LOG_MODE("Search exit → %s", modeName(g_currentMode));
  ledModeIndicate(g_currentMode);
  delay(300);
  ESP.restart();
}

// =============================================================================
// SETUP — entry point (boot + deep-sleep wake)
// =============================================================================
void setup() {
  Serial.begin(115200);
  delay(200);  // USB CDC settle (ESP32-C3)

  g_bootCycle++;
  dbBanner(modeName(g_currentMode));

  LOG_INFO("Boot cycle   : #%lu", g_bootCycle);
  LOG_INFO("Reset reason : %d", (int)esp_reset_reason());
  LOG_INFO("Free heap    : %lu B", ESP.getFreeHeap());
  LOG_INFO("CPU freq     : %d MHz", getCpuFrequencyMhz());
  LOG_INFO("Flash size   : %lu B", ESP.getFlashChipSize());
  LOG_INFO("IDF version  : %s", ESP.getSdkVersion());

  // ── Pin init ────────────────────────────────────────────────────────
  pinMode(PIN_LED_RED,   OUTPUT);
  pinMode(PIN_LED_BLUE,  OUTPUT);
  pinMode(PIN_SW_MODE,   INPUT_PULLUP);
  pinMode(PIN_SW_CONFIG, INPUT_PULLUP);
  ledsOff();

  // Attach interrupts
  attachInterrupt(digitalPinToInterrupt(PIN_SW_MODE),   isrModeButton,   FALLING);
  attachInterrupt(digitalPinToInterrupt(PIN_SW_CONFIG), isrConfigButton, FALLING);

  // ── Watchdog ─────────────────────────────────────────────────────────
  esp_task_wdt_init(WDT_TIMEOUT_SEC, true);
  esp_task_wdt_add(NULL);
  LOG_INFO("Watchdog: %d s timeout", WDT_TIMEOUT_SEC);

  // Startup blink
  blinkLed(PIN_LED_RED,  1, 80);
  blinkLed(PIN_LED_BLUE, 1, 80);

  // ── Factory reset check (both buttons at boot) ───────────────────────
  if (digitalRead(PIN_SW_MODE) == LOW && digitalRead(PIN_SW_CONFIG) == LOW) {
    delay(BTN_DEBOUNCE_MS);
    uint32_t t = millis();
    while (digitalRead(PIN_SW_MODE) == LOW && digitalRead(PIN_SW_CONFIG) == LOW) {
      delay(100); esp_task_wdt_reset();
      if (millis() - t > BTN_FACTORY_MS) {
        factoryReset();  // never returns
      }
    }
    LOG_BTN("Both buttons released before factory reset threshold");
  }

  // ── Load NVS config ──────────────────────────────────────────────────
  loadConfig();

  // ── Config mode check (SW_CONFIG held at boot) ───────────────────────
  if (digitalRead(PIN_SW_CONFIG) == LOW) {
    delay(BTN_DEBOUNCE_MS);
    if (digitalRead(PIN_SW_CONFIG) == LOW) {
      uint32_t held = waitButtonRelease(PIN_SW_CONFIG);
      LOG_BTN("SW_CONFIG held %lu ms at boot", held);
      if (held >= BTN_LONG_CFG_MS) {
        LOG_INFO("Config mode triggered at boot");
        g_currentMode = MODE_CONFIG;
        runConfigMode();  // blocks until reboot
      }
    }
  }

  // ── Determine startup mode ───────────────────────────────────────────
  // Emergency active in RTC memory (survived deep sleep)
  if (g_emergencyActive) {
    LOG_WARN("Emergency flag set — forcing EMERGENCY SOS mode");
    g_currentMode = MODE_EMERGENCY;
  } else {
    // Restore last mode from NVS
    if (g_bootCycle == 1) {
      g_currentMode = cfg.lastMode;
      LOG_INFO("First boot — using NVS mode: %s", modeName(g_currentMode));
    }
    // g_currentMode from RTC memory persists across deep-sleep wakes
  }

  LOG_MODE("Starting in mode: %s", modeName(g_currentMode));
  ledModeIndicate(g_currentMode);
  delay(200);

  // ── Dispatch to mode ─────────────────────────────────────────────────
  switch (g_currentMode) {
    case MODE_BEACON:
      runBeaconMode(false);
      break;
    case MODE_EMERGENCY:
      runBeaconMode(true);
      break;
    case MODE_SEARCH:
      runSearchMode();
      break;
    case MODE_CONFIG:
      runConfigMode();
      break;
    default:
      LOG_ERR("Unknown mode %d — defaulting to BEACON", g_currentMode);
      g_currentMode = MODE_BEACON;
      runBeaconMode(false);
  }
}

void loop() {
  // Should NEVER reach here.
  LOG_ERR("loop() called unexpectedly! heap=%lu", ESP.getFreeHeap());
  esp_task_wdt_reset();
  delay(2000);
  ESP.restart();
}

// =============================================================================
// END — AEGIS-BEACON v3.0
// =============================================================================
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  SERIAL DEBUG QUICK REFERENCE                                           │
// │                                                                         │
// │  [INFO ] Normal operation                                               │
// │  [OK   ] Successful operation                                           │
// │  [WARN ] Non-fatal anomaly                                              │
// │  [ERROR] Hardware/radio failure — check wiring                          │
// │  [MODE ] Mode change event                                              │
// │  [SCAN ] RSSI scan result per frequency                                 │
// │  [BTN  ] Physical button event + hold duration                          │
// │  [CFG  ] Dashboard config save/load                                     │
// │  [MORSE] Per-symbol morse timing     (DEBUG_VERBOSE 1 only)             │
// │  [RF   ] RadioLib state return codes (DEBUG_VERBOSE 1 only)             │
// │                                                                         │
// │  HEALTHY BOOT (BEACON mode):                                            │
// │  ── Boot cycle #N                                                       │
// │  ── Loading config from NVS                                             │
// │  ── Starting in mode: BEACON                                            │
// │  ── Radio ready — OOK/CW on 433.500 MHz @ 17 dBm                        │
// │  ── TX: "SOS" @ 13 WPM                                                  │
// │  ── TX done: 3 chars in 2730 ms                                         │
// │  ── Deep sleep 10 s...                                                  │
// │                                                                         │
// │  HEALTHY BOOT (SEARCH mode):                                            │
// │  ── Starting in mode: SEARCH                                            │
// │  ── Scan pass — 3 frequencies                                           │
// │  ── [0] 433.500 MHz  RSSI=-108 dBm  |..........| quiet                  │
// │  ── [1] 434.500 MHz  RSSI= -87 dBm  |#######....| *** SIGNAL ***        │
// │  ── HIT recorded: 434.500 MHz -87 dBm [MEDIUM]                          │
// │                                                                         │
// │  COMMON ERRORS:                                                         │
// │  [ERROR] beginFSK failed: -2  → SPI wiring wrong                        │
// │  [ERROR] beginFSK failed: -7  → Bad solder joint on RA-02               │
// │  [WARN ] NVS empty          → Normal on first boot                      │
// └─────────────────────────────────────────────────────────────────────────┘
