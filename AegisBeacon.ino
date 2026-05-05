// =============================================================================
//  █████╗ ███████╗ ██████╗ ██╗███████╗    ██████╗ ███████╗ █████╗  ██████╗ ██████╗ ███╗   ██╗
// ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║
// ███████║█████╗  ██║  ███╗██║███████╗    ██████╔╝█████╗  ███████║██║     ██║   ██║██╔██╗ ██║
// ██╔══██║██╔══╝  ██║   ██║██║╚════██║    ██╔══██╗██╔══╝  ██╔══██║██║     ██║   ██║██║╚██╗██║
// ██║  ██║███████╗╚██████╔╝██║███████║    ██████╔╝███████╗██║  ██║╚██████╗╚██████╔╝██║ ╚████║
// ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚═╝  ╚═══╝
// =============================================================================
// PROJECT  : Aegis-Beacon v1.0 — Ultra-Low-Cost Avalanche Rescue Beacon
// TARGET HW: ESP32-C3 SuperMini + RA-02 (SX1276)   ← cheapest viable combo
// FRAMEWORK: Arduino / PlatformIO  |  DEPS: RadioLib >= 6.x, ArduinoJson >= 7.x
// LICENSE  : MIT — Use freely, save lives.
// =============================================================================
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │           MINIMAL BILL OF MATERIALS  —  Ultra-Low-Cost Build                │
// │           Target total cost: ~$8–12 USD (AliExpress / LCSC pricing)         │
// ├──────┬────────────────────────────────┬──────────────┬──────────────────────┤
// │  Ref │  Part                          │  ~Cost (USD) │  Notes               │
// ├──────┼────────────────────────────────┼──────────────┼──────────────────────┤
// │  U1  │  ESP32-C3 SuperMini            │   $1.50      │  Smallest ESP32-C3;  │
// │      │  (built-in USB, 3.3V LDO,      │              │  onboard 3.3V reg +  │
// │      │   4MB flash, Wi-Fi+BT)         │              │  USB. No LDO needed! │
// │  U2  │  AI-Thinker RA-02 (SX1276)     │   $2.50      │  Cheapest SX1276     │
// │      │  433 MHz module with antenna   │              │  module, ~17 dBm,    │
// │      │                                │              │  spring antenna incl.│
// │  B1  │  18650 Li-ion 3.7V (any brand) │   $1.50      │  Budget option;      │
// │      │  OR 14500 AA-size Li-ion       │              │  LiFePO4 is better   │
// │      │                                │              │  for cold but 3×cost │
// │  IC1 │  TP4056 USB-C charge module    │   $0.50      │  Handles charging +  │
// │      │  with protection (DW01A)       │              │  over-discharge prot.│
// │      │                                │              │  No extra BMS needed │
// │  SW1 │  Tactile switch 6×6mm          │   $0.05      │  BOOT / config mode  │
// │  C1  │  100 µF 10V electrolytic       │   $0.05      │  Main bulk cap on    │
// │      │  (or 47µF X7R ceramic if cold) │              │  3.3V rail           │
// │  C2  │  100 nF ceramic 0805           │   $0.02      │  Decoupling          │
// │  R1  │  10 kΩ 0805                    │   $0.01      │  RST pull-up         │
// │  R2  │  330 Ω 0805                    │   $0.01      │  LED current limit   │
// │  D1  │  Red LED 3mm                   │   $0.05      │  Status indicator    │
// │ ANT  │  17.3 cm wire (¼-wave 433MHz)  │   $0.00      │  FREE – any wire!    │
// │ BOX  │  Hammond 1551 (60×35×20mm)     │   $1.50      │  Cheapest enclosure  │
// │      │  OR 3D-printed PLA box         │   $0.30      │  Print your own      │
// ├──────┴────────────────────────────────┼──────────────┼──────────────────────┤
// │                          TOTAL        │  ~$8–10 USD  │                      │
// └─────────────────────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  WHY THIS IS MINIMAL                                                        │
// │  • ESP32-C3 SuperMini: has built-in LDO → NO external regulator needed      │
// │  • RA-02 module: has SX1276 + TCXO + matching network → NO RF design work   │
// │  • TP4056 module: has charging + protection → NO extra BMS chip needed      │
// │  • Spring/wire antenna: FREE → NO SMA connector, coax, or stub antenna      │
// │  • 4 passive components total (C1, C2, R1, R2) + 1 LED + 1 switch           │
// └─────────────────────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │           WIRING TABLE — ESP32-C3 SuperMini ↔ RA-02 (SX1276)                │
// ├──────────────┬────────────────┬─────────────────────────────────────────────┤
// │  RA-02 Pin   │  ESP32-C3 GPIO │  Notes                                      │
// ├──────────────┼────────────────┼─────────────────────────────────────────────┤
// │  VCC (3.3V)  │  3V3           │  MAX 3.6V — do NOT connect to 5V/VBUS       │
// │  GND         │  GND           │  Common ground                              │
// │  SCK         │  GPIO  4       │  SPI Clock                                  │
// │  MOSI        │  GPIO  6       │  SPI MOSI                                   │
// │  MISO        │  GPIO  5       │  SPI MISO                                   │
// │  NSS / CS    │  GPIO  7       │  Chip Select (active LOW)                   │
// │  RESET       │  GPIO  3       │  Active LOW reset                           │
// │  DIO0        │  GPIO  2       │  TX/RX Done IRQ                             │
// │  DIO1        │  N/C           │  Not needed for OOK/CW                      │
// │  ANT         │  —             │  17.3 cm wire soldered directly to ANT pad  │
// ├──────────────┼────────────────┼─────────────────────────────────────────────┤
// │  LED anode   │  GPIO  8       │  Through R2 (330Ω) to GND                   │
// │  SW1         │  GPIO  9 (BOOT)│  Between GPIO9 and GND                      │
// └──────────────┴────────────────┴─────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  BATTERY WIRING                                                             │
// │  18650 (+) → TP4056 BAT+ → ESP32-C3 SuperMini 5V (via VBUS) input           │
// │  18650 (-) → TP4056 BAT- → GND                                              │
// │  TP4056 USB-C: plug in any USB-C cable to recharge                          │
// │                                                                             │
// │  NOTE: The ESP32-C3 SuperMini has an onboard AMS1117-3.3 LDO                │
// │  powered from VBUS (5V rail = battery via TP4056 OUT+). This means          │
// │  you can run on 3.7V Li-ion without any extra regulator.                    │
// └─────────────────────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  LOGICAL SCHEMA / FLOW                                                      │
// │                                                                             │
// │  POWER ON / DEEP-SLEEP WAKE                                                 │
// │   │                                                                         │
// │   ├─ BOOT button held? ──YES──► runConfigMode()                             │
// │   │                              WiFi AP + Captive Portal dashboard         │
// │   │                              blocks until save/reboot or 5-min timeout  │
// │   └─ NO                                                                     │
// │        │                                                                    │
// │        ▼                                                                    │
// │   loadConfig()  ← NVS                                                       │
// │   NVS empty? → inject hardcoded defaults (433.5 MHz, "SOS", 13 WPM)         │
// │        │                                                                    │
// │        ▼                                                                    │
// │   Disable WiFi + BT (saves ~120 mA during beacon mode)                      │
// │        │                                                                    │
// │        ▼                                                                    │
// │   initRadio(freq, power)  — OOK mode via RadioLib                           │
// │        │                                                                    │
// │  ╔══════════════════════════════════════════╗                               │
// │  ║  BEACON LOOP (one pass, then deep sleep) ║                               │
// │  ║  for each freq in cfg.freqs[]:           ║                               │
// │  ║      setFrequency(freq)                  ║                               │
// │  ║      for each char in message:           ║                               │
// │  ║          morse encode → dot/dash timing  ║                               │
// │  ║          txOn() / txOff() via OOK        ║                               │
// │  ║      inter-freq guard delay (50 ms)      ║                               │
// │  ╚══════════════════════════════════════════╝                               │
// │        │                                                                    │
// │        ▼                                                                    │
// │   radio.sleep()                                                             │
// │   esp_deep_sleep(cfg.sleepSec * 1e6)                                        │
// │   → wakes → setup() → repeat                                                │
// └─────────────────────────────────────────────────────────────────────────────┘
// =============================================================================

// ── LIBRARY DEPENDENCIES ──────────────────────────────────────────────────────
// Arduino IDE  : Sketch → Include Library → Manage Libraries
//   • RadioLib   by Jan Gromes   ≥ 6.0
//   • ArduinoJson by Benoît Blanchon ≥ 7.0
//
// PlatformIO (platformio.ini):
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

// =============================================================================
// DEBUG SYSTEM
// =============================================================================
// All debug output goes to Serial at 115200 baud.
// Open Arduino Serial Monitor or any terminal (picocom, screen, PuTTY, etc.)
// at 115200 8N1 to see full real-time diagnostics.
//
// Debug levels:
//   DBG_INFO  — normal operational messages  (always shown)
//   DBG_WARN  — recoverable anomalies         (always shown)
//   DBG_ERR   — critical failures             (always shown)
//   DBG_MORSE — per-symbol morse log          (enabled by DEBUG_VERBOSE)
//   DBG_RF    — per-byte SPI / RF register    (enabled by DEBUG_VERBOSE)
//
// Set DEBUG_VERBOSE 1 to enable full symbol-level logging (VERY verbose).
// Set DEBUG_VERBOSE 0 for clean production log.
// =============================================================================
#define DEBUG_VERBOSE   0   // 0 = clean log  |  1 = full symbol-by-symbol log

// Colour codes for terminals that support ANSI (minicom, VS Code, picocom)
#define ANSI_RESET  "\033[0m"
#define ANSI_CYAN   "\033[36m"
#define ANSI_GREEN  "\033[32m"
#define ANSI_YELLOW "\033[33m"
#define ANSI_RED    "\033[31m"
#define ANSI_GRAY   "\033[90m"
#define ANSI_BOLD   "\033[1m"

// ── Logging macros ────────────────────────────────────────────────────────────
// Each macro prints timestamp + level tag + message.
// Serial.printf is used directly so format strings work like printf().
#define LOG_INFO(fmt, ...)  Serial.printf(ANSI_CYAN  "[%7lu][INFO ] " fmt ANSI_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_OK(fmt, ...)    Serial.printf(ANSI_GREEN "[%7lu][OK   ] " fmt ANSI_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_WARN(fmt, ...)  Serial.printf(ANSI_YELLOW"[%7lu][WARN ] " fmt ANSI_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_ERR(fmt, ...)   Serial.printf(ANSI_RED   "[%7lu][ERROR] " fmt ANSI_RESET "\n", millis(), ##__VA_ARGS__)
#define LOG_SECTION(name)   Serial.printf(ANSI_BOLD  "\n── " name " ──\n" ANSI_RESET)

// Verbose macros — compiled out entirely when DEBUG_VERBOSE = 0
#if DEBUG_VERBOSE
  #define LOG_MORSE(fmt, ...) Serial.printf(ANSI_GRAY "[%7lu][MORSE] " fmt ANSI_RESET "\n", millis(), ##__VA_ARGS__)
  #define LOG_RF(fmt, ...)    Serial.printf(ANSI_GRAY "[%7lu][RF   ] " fmt ANSI_RESET "\n", millis(), ##__VA_ARGS__)
#else
  #define LOG_MORSE(fmt, ...) do {} while(0)
  #define LOG_RF(fmt, ...)    do {} while(0)
#endif

// ── Separator / Banner helpers ─────────────────────────────────────────────
void debugBanner() {
  Serial.println();
  Serial.println(ANSI_BOLD ANSI_CYAN
    "╔══════════════════════════════════════════════════════╗\n"
    "║       AEGIS-BEACON v1.0  — BOOT                      ║\n"
    "║   ESP32-C3 SuperMini + RA-02 SX1276  OOK/CW Beacon   ║\n"
    "╚══════════════════════════════════════════════════════╝"
    ANSI_RESET);
  Serial.println();
}

void debugSeparator(const char* label = nullptr) {
  if (label)
    Serial.printf(ANSI_GRAY "────────────── %s ──────────────\n" ANSI_RESET, label);
  else
    Serial.println(ANSI_GRAY "────────────────────────────────────────" ANSI_RESET);
}

// ── Cycle counter in RTC memory (survives deep sleep) ──────────────────────
RTC_DATA_ATTR uint32_t g_bootCycle = 0;

// =============================================================================
// HARDWARE PIN MAP  (ESP32-C3 SuperMini)
// =============================================================================
#define PIN_LORA_CS     7
#define PIN_LORA_RST    3
#define PIN_LORA_DIO0   2
#define PIN_SPI_SCK     4
#define PIN_SPI_MISO    5
#define PIN_SPI_MOSI    6
#define PIN_LED         8    // Onboard or external LED
#define PIN_BOOT        9    // BOOT button (pulled up internally)

// =============================================================================
// CONFIGURATION DEFAULTS
// =============================================================================
#define DEFAULT_FREQ_MHZ    433.500f
#define DEFAULT_MESSAGE     "SOS"
#define DEFAULT_WPM         13
#define DEFAULT_POWER_DBM   17
#define DEFAULT_SLEEP_SEC   10

// =============================================================================
// LIMITS
// =============================================================================
#define MAX_FREQUENCIES     10
#define MAX_MESSAGE_LEN     64
#define CONFIG_TIMEOUT_MS   300000   // 5 min
#define AP_SSID             "AegisBeacon-Config"
#define AP_IP               "192.168.4.1"

// =============================================================================
// GLOBALS
// =============================================================================
// Use SPIClass to specify non-default SPI pins for ESP32-C3 SuperMini
SPIClass lora_spi(HSPI);

// RadioLib: SX1276(cs, dio0, reset, dio1=-1)
SX1276 radio = new Module(PIN_LORA_CS, PIN_LORA_DIO0, PIN_LORA_RST, RADIOLIB_NC,
                           lora_spi);

Preferences prefs;
WebServer   server(80);
DNSServer   dns;

struct Config {
  float    freqs[MAX_FREQUENCIES];
  uint8_t  freqCount;
  char     message[MAX_MESSAGE_LEN];
  uint8_t  wpm;
  int8_t   powerDbm;
  uint32_t sleepSec;
} cfg;

// =============================================================================
// MORSE TIMING
// =============================================================================
// PARIS standard: 1 unit = 1200 / WPM milliseconds
inline uint32_t dotMs()      { return 1200 / cfg.wpm; }
inline uint32_t dashMs()     { return dotMs() * 3; }
inline uint32_t intraChrMs() { return dotMs() * 1; }   // gap between elements
inline uint32_t interChrMs() { return dotMs() * 3; }   // gap between letters
inline uint32_t wordGapMs()  { return dotMs() * 7; }   // gap between words

// Morse table: A-Z (index 0–25), 0-9 (index 26–35)
const char* MORSE_TABLE[] = {
  ".-","-...","-.-.","-..",".","..-.","--.","....","..",".---",
  "-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-",
  "..-","...-",".--","-..-","-.--","--..",
  "-----",".----","..---","...--","....-",".....",
  "-....","--...","---..","----."
};

// =============================================================================
// LED HELPERS
// =============================================================================
void blinkLed(int times, int ms = 100) {
  for (int i = 0; i < times; i++) {
    digitalWrite(PIN_LED, HIGH); delay(ms);
    digitalWrite(PIN_LED, LOW);  delay(ms);
  }
}

// =============================================================================
// NVS LOAD / SAVE
// =============================================================================
void loadConfig() {
  LOG_SECTION("NVS CONFIG LOAD");
  prefs.begin("aegis", true);

  cfg.freqCount = prefs.getUChar("fcount", 0);
  bool isDefault = (cfg.freqCount == 0 || cfg.freqCount > MAX_FREQUENCIES);

  if (isDefault) {
    LOG_WARN("NVS empty or corrupt — using hardcoded defaults");
    cfg.freqs[0]  = DEFAULT_FREQ_MHZ;
    cfg.freqCount = 1;
  } else {
    LOG_INFO("Loading %d frequencies from NVS", cfg.freqCount);
    for (int i = 0; i < cfg.freqCount; i++) {
      char key[8]; snprintf(key, sizeof(key), "f%d", i);
      cfg.freqs[i] = prefs.getFloat(key, DEFAULT_FREQ_MHZ);
      LOG_INFO("  freq[%d] = %.3f MHz", i, cfg.freqs[i]);
    }
  }

  prefs.getString("msg", cfg.message, MAX_MESSAGE_LEN);
  if (strlen(cfg.message) == 0) {
    strlcpy(cfg.message, DEFAULT_MESSAGE, MAX_MESSAGE_LEN);
    LOG_WARN("Message empty — defaulting to \"%s\"", DEFAULT_MESSAGE);
  }

  cfg.wpm      = prefs.getUChar("wpm",   DEFAULT_WPM);
  cfg.powerDbm = (int8_t)prefs.getChar("pwr", DEFAULT_POWER_DBM);
  cfg.sleepSec = prefs.getULong("sleep", DEFAULT_SLEEP_SEC);

  prefs.end();

  // Print final loaded config
  debugSeparator("ACTIVE CONFIG");
  LOG_INFO("Message  : \"%s\"",     cfg.message);
  LOG_INFO("WPM      : %d  (dot=%lu ms, dash=%lu ms)", cfg.wpm, dotMs(), dashMs());
  LOG_INFO("Power    : %d dBm",     cfg.powerDbm);
  LOG_INFO("Sleep    : %lu sec",    cfg.sleepSec);
  LOG_INFO("Freq cnt : %d",         cfg.freqCount);
  for (int i = 0; i < cfg.freqCount; i++)
    LOG_INFO("  [%d] %.3f MHz", i, cfg.freqs[i]);
  debugSeparator();
}

void saveConfig() {
  LOG_SECTION("NVS CONFIG SAVE");
  prefs.begin("aegis", false);

  prefs.putUChar("fcount", cfg.freqCount);
  for (int i = 0; i < cfg.freqCount; i++) {
    char key[8]; snprintf(key, sizeof(key), "f%d", i);
    prefs.putFloat(key, cfg.freqs[i]);
    LOG_INFO("Saved freq[%d] = %.3f MHz", i, cfg.freqs[i]);
  }
  prefs.putString("msg",   cfg.message);
  prefs.putUChar("wpm",    cfg.wpm);
  prefs.putChar("pwr",     (char)cfg.powerDbm);
  prefs.putULong("sleep",  cfg.sleepSec);

  prefs.end();
  LOG_OK("Config saved to NVS");
}

// =============================================================================
// RADIO INIT
// =============================================================================
bool initRadio(float freqMHz, int8_t powerDbm) {
  LOG_INFO("Radio init: %.3f MHz, %d dBm, OOK mode", freqMHz, powerDbm);

  // Initialize SPI with custom pins for ESP32-C3 SuperMini
  lora_spi.begin(PIN_SPI_SCK, PIN_SPI_MISO, PIN_SPI_MOSI, PIN_LORA_CS);

  // Begin FSK (base mode needed before switching to OOK)
  // FSK params: freq, br(kbps), freqDev(kHz), rxBw(kHz), power, preamble, OOK=false
  int state = radio.beginFSK(freqMHz, 1.2f, 5.0f, 125.0f, powerDbm, 16, false);
  LOG_RF("beginFSK() state = %d", state);

  if (state != RADIOLIB_ERR_NONE) {
    LOG_ERR("Radio beginFSK failed! Code: %d", state);
    LOG_ERR("Check wiring: CS=GPIO%d RST=GPIO%d DIO0=GPIO%d", PIN_LORA_CS, PIN_LORA_RST, PIN_LORA_DIO0);
    LOG_ERR("SPI: SCK=GPIO%d MISO=GPIO%d MOSI=GPIO%d", PIN_SPI_SCK, PIN_SPI_MISO, PIN_SPI_MOSI);
    return false;
  }

  // Switch to OOK (On-Off Keying = Continuous Wave keying)
  // transmitDirect() = carrier ON, standby() = carrier OFF
  // This is audible on ANY AM-mode scanner or SDR receiver
  state = radio.setOOK(true);
  LOG_RF("setOOK(true) state = %d", state);
  if (state != RADIOLIB_ERR_NONE) {
    LOG_ERR("OOK mode failed! Code: %d", state);
    return false;
  }

  // Set output power explicitly (RA-02 supports up to ~17 dBm on RFO pin,
  // 20 dBm via PA_BOOST — depends on module variant)
  state = radio.setOutputPower(powerDbm);
  LOG_RF("setOutputPower(%d) state = %d", powerDbm, state);

  LOG_OK("Radio ready — %.3f MHz, %d dBm, OOK/CW", freqMHz, powerDbm);
  return true;
}

// =============================================================================
// MORSE TX ENGINE
// =============================================================================

void txOn() {
  radio.transmitDirect();   // Assert RF carrier
}

void txOff() {
  radio.standby();          // Suppress RF carrier
}

// Transmit one character as Morse, with inter-character pause at end
void transmitMorseChar(char c, int charIndex) {
  c = toupper(c);
  const char* pattern = nullptr;

  if      (c >= 'A' && c <= 'Z') pattern = MORSE_TABLE[c - 'A'];
  else if (c >= '0' && c <= '9') pattern = MORSE_TABLE[26 + (c - '0')];
  else if (c == ' ') {
    LOG_MORSE("SPACE → word gap (%lu ms)", wordGapMs());
    delay(wordGapMs());
    return;
  } else {
    LOG_MORSE("Char '%c' not in Morse table — skipping", c);
    return;
  }

  LOG_MORSE("Char[%d] '%c' → %s", charIndex, c, pattern);

  for (int i = 0; pattern[i] != '\0'; i++) {
    bool isDot = (pattern[i] == '.');
    uint32_t dur = isDot ? dotMs() : dashMs();

    LOG_MORSE("  Element[%d] %s (%lu ms) — TX ON", i, isDot ? "DOT " : "DASH", dur);
    txOn();
    delay(dur);
    txOff();
    LOG_MORSE("  TX OFF");

    // Intra-character gap (between elements of the same character)
    if (pattern[i+1] != '\0') {
      LOG_MORSE("  Intra-char gap (%lu ms)", intraChrMs());
      delay(intraChrMs());
    }
  }

  // Inter-character gap (between letters)
  LOG_MORSE("  Inter-char gap (%lu ms)", interChrMs());
  delay(interChrMs());
}

// Transmit full message string
void transmitMessage(const char* msg) {
  LOG_INFO("TX START: \"%s\" @ %d WPM (dot=%lu ms)", msg, cfg.wpm, dotMs());
  uint32_t t0 = millis();
  int charCount = 0;

  for (int i = 0; msg[i] != '\0'; i++) {
    // Toggle LED on each character for visible heartbeat
    digitalWrite(PIN_LED, (i % 2 == 0) ? HIGH : LOW);
    transmitMorseChar(msg[i], i);
    charCount++;
  }

  digitalWrite(PIN_LED, LOW);
  uint32_t elapsed = millis() - t0;
  LOG_OK("TX DONE: %d chars in %lu ms (%.1f sec)", charCount, elapsed, elapsed / 1000.0f);
}

// =============================================================================
// CONFIG MODE HTML DASHBOARD
// =============================================================================
String buildConfigJson() {
  String j = "{";
  j += "\"wpm\":"   + String(cfg.wpm)      + ",";
  j += "\"power\":" + String(cfg.powerDbm) + ",";
  j += "\"sleep\":" + String(cfg.sleepSec) + ",";
  j += "\"message\":\"" + String(cfg.message) + "\",";
  j += "\"freqs\":[";
  for (int i = 0; i < cfg.freqCount; i++) {
    if (i > 0) j += ",";
    j += String(cfg.freqs[i], 3);
  }
  j += "]}";
  return j;
}

// Full dark-theme dashboard HTML (PROGMEM to save SRAM)
const char DASHBOARD_HTML[] PROGMEM = R"HTMLDOC(
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AEGIS-BEACON CONFIG</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');
  :root{
    --bg:#080c10;--surface:#0d1520;--border:#1a2d45;
    --accent:#00d4ff;--accent2:#ff4444;--text:#c8dde8;--dim:#4a6070;
    --glow:0 0 12px rgba(0,212,255,.4);--glow2:0 0 12px rgba(255,68,68,.4);
    --r:6px;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--text);font-family:'Share Tech Mono',monospace;min-height:100vh;
    background-image:repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(0,212,255,.02) 40px,rgba(0,212,255,.02) 41px),
    repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(0,212,255,.02) 40px,rgba(0,212,255,.02) 41px);}
  header{display:flex;align-items:center;justify-content:space-between;padding:20px 28px;
    border-bottom:1px solid var(--border);background:rgba(0,212,255,.03);}
  .logo{font-family:'Orbitron',sans-serif;font-weight:900;font-size:1.3rem;color:var(--accent);
    text-shadow:var(--glow);letter-spacing:4px;}
  .logo span{color:var(--accent2);text-shadow:var(--glow2);}
  .badge{font-size:.65rem;color:var(--accent);border:1px solid var(--accent);padding:3px 10px;
    border-radius:2px;letter-spacing:2px;animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{opacity:1;box-shadow:var(--glow)}50%{opacity:.5;box-shadow:none}}
  main{max-width:880px;margin:0 auto;padding:28px 20px;display:grid;gap:20px;grid-template-columns:1fr 1fr;}
  @media(max-width:580px){main{grid-template-columns:1fr}}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:22px;position:relative;overflow:hidden;}
  .card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:.6;}
  .card.full{grid-column:1/-1}.card.danger::before{background:linear-gradient(90deg,transparent,var(--accent2),transparent);}
  .card-title{font-family:'Orbitron',sans-serif;font-size:.68rem;letter-spacing:3px;color:var(--accent);
    margin-bottom:18px;text-transform:uppercase;}
  .card.danger .card-title{color:var(--accent2);}
  label{display:block;font-size:.7rem;color:var(--dim);margin-bottom:5px;letter-spacing:1px;}
  input[type=text],input[type=number],textarea,select{width:100%;background:#060a0f;
    border:1px solid var(--border);border-radius:var(--r);color:var(--text);
    font-family:'Share Tech Mono',monospace;font-size:.88rem;padding:9px 12px;outline:none;
    transition:border-color .2s,box-shadow .2s;}
  input:focus,textarea:focus{border-color:var(--accent);box-shadow:0 0 0 2px rgba(0,212,255,.12);}
  textarea{resize:vertical;min-height:72px;}
  input[type=range]{-webkit-appearance:none;width:100%;height:4px;background:var(--border);
    border-radius:2px;outline:none;margin:10px 0 4px;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;
    border-radius:50%;background:var(--accent);cursor:pointer;box-shadow:var(--glow);}
  .range-labels{display:flex;justify-content:space-between;font-size:.63rem;color:var(--dim);}
  .value-display{font-size:1.3rem;color:var(--accent);font-family:'Orbitron',sans-serif;
    text-shadow:var(--glow);text-align:center;margin-top:6px;}
  #freqList{list-style:none;margin-bottom:12px;}
  #freqList li{display:flex;align-items:center;gap:8px;padding:7px 10px;background:#060a0f;
    border:1px solid var(--border);border-radius:var(--r);margin-bottom:5px;font-size:.85rem;
    animation:fadeIn .2s ease;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}
  #freqList li .fv{flex:1;color:var(--accent);font-family:'Orbitron',sans-serif;font-size:.82rem;}
  #freqList li .fb{color:var(--dim);font-size:.68rem;}
  .del-btn{background:none;border:1px solid #2a1010;color:var(--accent2);padding:2px 7px;
    border-radius:3px;cursor:pointer;font-size:.72rem;transition:background .15s;}
  .del-btn:hover{background:rgba(255,68,68,.12);}
  .add-row{display:flex;gap:8px;}.add-row input{flex:1;}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 20px;
    border-radius:var(--r);font-family:'Orbitron',sans-serif;font-size:.68rem;letter-spacing:2px;
    cursor:pointer;border:1px solid;transition:all .2s;text-transform:uppercase;}
  .btn-p{background:rgba(0,212,255,.08);border-color:var(--accent);color:var(--accent);}
  .btn-p:hover{background:rgba(0,212,255,.18);box-shadow:var(--glow);}
  .btn-d{background:rgba(255,68,68,.08);border-color:var(--accent2);color:var(--accent2);}
  .btn-d:hover{background:rgba(255,68,68,.2);box-shadow:var(--glow2);}
  .btn-save{width:100%;padding:13px;background:linear-gradient(135deg,rgba(0,212,255,.15),rgba(0,100,140,.15));
    border-color:var(--accent);color:var(--accent);font-size:.78rem;margin-top:6px;}
  .btn-save:hover{background:rgba(0,212,255,.25);box-shadow:var(--glow);}
  #toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--surface);
    border:1px solid var(--accent);color:var(--accent);padding:10px 24px;border-radius:var(--r);
    font-size:.78rem;letter-spacing:1px;box-shadow:var(--glow);opacity:0;pointer-events:none;
    transition:opacity .3s;z-index:100;}
  #toast.show{opacity:1}#toast.error{border-color:var(--accent2);color:var(--accent2);box-shadow:var(--glow2);}
  #morsePreview{font-size:.95rem;letter-spacing:4px;color:var(--accent);text-shadow:var(--glow);
    min-height:26px;word-break:break-all;margin-top:8px;}
  .tx-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent2);
    box-shadow:var(--glow2);margin-right:5px;}
  .tx-dot.on{animation:blink .22s step-start infinite;}
  @keyframes blink{50%{opacity:0}}
  .dbg-hint{font-size:.63rem;color:var(--dim);margin-top:10px;line-height:1.6;}
  .dbg-hint code{color:var(--accent);background:rgba(0,212,255,.07);padding:1px 5px;border-radius:3px;}
</style>
</head>
<body>
<header>
  <div class="logo">AEGIS<span>&#x25CF;</span>BEACON</div>
  <div style="text-align:right;font-size:.63rem;color:var(--dim)">
    <div>CONFIGURATION MODE</div>
    <div style="color:var(--accent);font-size:.7rem">ESP32-C3 + RA-02</div>
  </div>
  <div class="badge">&#x2022; CONFIG AP</div>
</header>
<main>

  <div class="card full">
    <div class="card-title">&#x25B6; Emergency Message</div>
    <label>MESSAGE TEXT — encoded to Morse OOK carrier</label>
    <textarea id="msgInput" maxlength="63" placeholder="SOS MY LOCATION IS..."></textarea>
    <div id="morsePreview"></div>
  </div>

  <div class="card full">
    <div class="card-title">&#x25B6; Multi-Frequency Manager</div>
    <ul id="freqList"></ul>
    <div class="add-row">
      <input type="number" id="newFreq" placeholder="e.g. 433.500" step="0.001" min="137" max="1020">
      <button class="btn btn-p" onclick="addFreq()">+ ADD</button>
    </div>
    <div style="font-size:.63rem;color:var(--dim);margin-top:7px">
      Common: 433.500 MHz (ISM EU) &bull; 915.000 MHz (ISM US) &bull; 121.500 MHz (Aviation guard)
    </div>
  </div>

  <div class="card">
    <div class="card-title">&#x25B6; Morse Speed</div>
    <label>WORDS PER MINUTE</label>
    <input type="range" id="wpmSlider" min="5" max="30" value="13" oninput="updateWpm(this.value)">
    <div class="range-labels"><span>5 WPM</span><span>30 WPM</span></div>
    <div class="value-display" id="wpmVal">13 WPM</div>
  </div>

  <div class="card">
    <div class="card-title">&#x25B6; TX Power</div>
    <label>OUTPUT POWER (dBm) — RA-02 max ~17 dBm</label>
    <input type="range" id="pwrSlider" min="2" max="17" value="17" oninput="updatePwr(this.value)">
    <div class="range-labels"><span>+2 dBm</span><span>+17 dBm</span></div>
    <div class="value-display" id="pwrVal">+17 dBm</div>
  </div>

  <div class="card">
    <div class="card-title">&#x25B6; Sleep Interval</div>
    <label>SECONDS BETWEEN TX CYCLES</label>
    <input type="number" id="sleepInput" min="1" max="3600" value="10" style="margin-top:6px">
    <div style="font-size:.63rem;color:var(--dim);margin-top:8px">
      10 s = ~72h on 2000mAh 18650 @ 17dBm
    </div>
  </div>

  <div class="card danger">
    <div class="card-title">&#x25B6; Test Signal</div>
    <div style="margin-bottom:14px;font-size:.78rem;color:var(--dim)">
      Sends one SOS burst on first configured frequency. Monitor with any SDR or AM scanner.
    </div>
    <button class="btn btn-d" id="testBtn" onclick="sendTest()">
      <span class="tx-dot" id="txLed"></span>TRANSMIT TEST
    </button>
    <div id="testStatus" style="font-size:.7rem;color:var(--dim);margin-top:8px"></div>
  </div>

  <div class="card full">
    <div class="card-title">&#x25B6; Debug Terminal Info</div>
    <div class="dbg-hint">
      Connect via USB and open Serial Monitor at <code>115200 baud</code> to see full real-time debug log.<br>
      Linux/Mac: <code>picocom -b 115200 /dev/ttyUSB0</code> &nbsp;&bull;&nbsp;
      Windows: PuTTY COM port @ 115200<br>
      Log includes: boot cycle, config values, radio init codes, per-symbol Morse timing, TX durations.
    </div>
  </div>

  <div class="card full">
    <button class="btn btn-save" onclick="saveAll()">&#x2713;&nbsp; SAVE &amp; REBOOT TO BEACON MODE</button>
  </div>

</main>
<div id="toast"></div>
<script>
let freqs=[];
const MORSE={'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'};

async function loadState(){
  try{
    const d=await(await fetch('/config')).json();
    freqs=d.freqs||[433.5];
    document.getElementById('msgInput').value=d.message||'SOS';
    document.getElementById('wpmSlider').value=d.wpm||13;
    document.getElementById('pwrSlider').value=d.power||17;
    document.getElementById('sleepInput').value=d.sleep||10;
    updateWpm(d.wpm||13);updatePwr(d.power||17);
    renderFreqs();updateMorse();
  }catch(e){toast('Config load error',true);}
}
function toMorse(t){return t.toUpperCase().split('').map(c=>c===' '?'/':MORSE[c]||'?').join(' ');}
function updateMorse(){document.getElementById('morsePreview').textContent=toMorse(document.getElementById('msgInput').value);}
document.getElementById('msgInput').addEventListener('input',updateMorse);
function updateWpm(v){document.getElementById('wpmVal').textContent=v+' WPM';document.getElementById('wpmSlider').value=v;}
function updatePwr(v){document.getElementById('pwrVal').textContent='+'+v+' dBm';document.getElementById('pwrSlider').value=v;}
function bandLabel(f){f=parseFloat(f);if(f<174)return 'VHF';if(f<470)return '70cm UHF';if(f<870)return '868MHz ISM';if(f<930)return '915MHz ISM';return 'CUSTOM';}
function renderFreqs(){
  const ul=document.getElementById('freqList');ul.innerHTML='';
  freqs.forEach((f,i)=>{const li=document.createElement('li');
    li.innerHTML=`<span class="fv">${parseFloat(f).toFixed(3)} MHz</span><span class="fb">${bandLabel(f)}</span><button class="del-btn" onclick="removeFreq(${i})">&#x2715;</button>`;
    ul.appendChild(li);});
}
function addFreq(){const v=parseFloat(document.getElementById('newFreq').value);
  if(isNaN(v)||v<137||v>1020){toast('Invalid freq',true);return;}
  if(freqs.length>=10){toast('Max 10',true);return;}
  freqs.push(v);document.getElementById('newFreq').value='';renderFreqs();}
function removeFreq(i){if(freqs.length<=1){toast('Min 1 freq',true);return;}freqs.splice(i,1);renderFreqs();}
async function saveAll(){
  const p={message:document.getElementById('msgInput').value.trim()||'SOS',
    wpm:+document.getElementById('wpmSlider').value,
    power:+document.getElementById('pwrSlider').value,
    sleep:+document.getElementById('sleepInput').value,freqs};
  try{
    const r=await fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)});
    if(r.ok){toast('Saved! Rebooting…');setTimeout(()=>{document.body.innerHTML='<div style="color:#00d4ff;font-family:Orbitron,sans-serif;text-align:center;padding:80px;font-size:1.1rem;letter-spacing:4px">BEACON MODE ACTIVE<br><br><span style="font-size:.7rem;color:#4a6070">Close this page</span></div>';},1500);}
    else toast('Save failed',true);
  }catch(e){toast('Network error',true);}
}
async function sendTest(){
  const btn=document.getElementById('testBtn'),led=document.getElementById('txLed'),st=document.getElementById('testStatus');
  btn.disabled=true;led.classList.add('on');
  st.textContent='Transmitting on '+(freqs[0]||433.5).toFixed(3)+' MHz…';
  try{const r=await fetch('/test');st.textContent=r.ok?'Test OK — check SDR/scanner.':'Test failed.';}
  catch(e){st.textContent='Request error.';}
  led.classList.remove('on');btn.disabled=false;
}
function toast(msg,err=false){const t=document.getElementById('toast');t.textContent=msg;t.className='show'+(err?' error':'');setTimeout(()=>{t.className='';},3000);}
loadState();
</script>
</body>
</html>
)HTMLDOC";

// =============================================================================
// WEB SERVER HANDLERS
// =============================================================================
void handleRoot() {
  LOG_INFO("HTTP GET /  — serving dashboard HTML (%d bytes)", strlen_P(DASHBOARD_HTML));
  server.send_P(200, "text/html", DASHBOARD_HTML);
}

void handleConfig() {
  String j = buildConfigJson();
  LOG_INFO("HTTP GET /config  — serving JSON: %s", j.c_str());
  server.send(200, "application/json", j);
}

void handleSave() {
  LOG_SECTION("HTTP POST /save");
  if (!server.hasArg("plain")) {
    LOG_ERR("No request body received");
    server.send(400, "text/plain", "No body");
    return;
  }

  String body = server.arg("plain");
  LOG_INFO("Received body (%d bytes): %s", body.length(), body.c_str());

  StaticJsonDocument<1024> doc;
  DeserializationError err = deserializeJson(doc, body);
  if (err) {
    LOG_ERR("JSON parse error: %s", err.c_str());
    server.send(400, "text/plain", "JSON error");
    return;
  }

  // Apply new values
  strlcpy(cfg.message, doc["message"] | DEFAULT_MESSAGE, MAX_MESSAGE_LEN);
  cfg.wpm      = constrain((int)doc["wpm"],   5, 30);
  cfg.powerDbm = constrain((int)doc["power"], 2, 17);
  cfg.sleepSec = constrain((uint32_t)doc["sleep"], 1UL, 3600UL);

  LOG_INFO("New message  : \"%s\"", cfg.message);
  LOG_INFO("New WPM      : %d",     cfg.wpm);
  LOG_INFO("New power    : %d dBm", cfg.powerDbm);
  LOG_INFO("New sleep    : %lu s",  cfg.sleepSec);

  JsonArray arr = doc["freqs"].as<JsonArray>();
  cfg.freqCount = 0;
  for (float f : arr) {
    if (cfg.freqCount >= MAX_FREQUENCIES) break;
    if (f >= 137.0f && f <= 1020.0f) {
      LOG_INFO("New freq[%d]  : %.3f MHz", cfg.freqCount, f);
      cfg.freqs[cfg.freqCount++] = f;
    } else {
      LOG_WARN("Rejected out-of-range freq: %.3f MHz", f);
    }
  }
  if (cfg.freqCount == 0) {
    LOG_WARN("No valid frequencies — using default %.3f MHz", DEFAULT_FREQ_MHZ);
    cfg.freqs[0] = DEFAULT_FREQ_MHZ; cfg.freqCount = 1;
  }

  saveConfig();
  server.send(200, "text/plain", "OK");
  LOG_OK("Config saved. Rebooting in 1.5s...");
  delay(1500);
  ESP.restart();
}

void handleTest() {
  LOG_SECTION("HTTP GET /test — RF TEST SIGNAL");
  server.send(200, "text/plain", "TX");
  LOG_INFO("Test TX on %.3f MHz @ %d dBm", cfg.freqs[0], cfg.powerDbm);
  if (initRadio(cfg.freqs[0], cfg.powerDbm)) {
    transmitMessage("SOS");
    radio.standby();
    LOG_OK("Test TX complete");
  } else {
    LOG_ERR("Radio init failed during test — check hardware");
  }
}

void handleNotFound() {
  String url = server.uri();
  LOG_INFO("HTTP 302 redirect: %s → http://%s", url.c_str(), AP_IP);
  server.sendHeader("Location", String("http://") + AP_IP, true);
  server.send(302, "text/plain", "");
}

// =============================================================================
// CONFIG MODE — WiFi AP + Captive Portal
// =============================================================================
void runConfigMode() {
  LOG_SECTION("CONFIGURATION MODE");
  blinkLed(3, 200);

  LOG_INFO("Starting WiFi Access Point: SSID=%s", AP_SSID);
  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID);
  WiFi.softAPConfig(
    IPAddress(192, 168, 4, 1),
    IPAddress(192, 168, 4, 1),
    IPAddress(255, 255, 255, 0)
  );
  LOG_OK("AP up — IP: %s", AP_IP);

  dns.start(53, "*", IPAddress(192, 168, 4, 1));
  LOG_INFO("DNS server started (captive portal redirect)");

  server.on("/",       HTTP_GET,  handleRoot);
  server.on("/config", HTTP_GET,  handleConfig);
  server.on("/save",   HTTP_POST, handleSave);
  server.on("/test",   HTTP_GET,  handleTest);
  server.onNotFound(handleNotFound);
  server.begin();

  LOG_OK("Web server running at http://%s", AP_IP);
  LOG_INFO("Connect phone/laptop to WiFi: \"%s\" → browser auto-opens", AP_SSID);
  LOG_INFO("Config AP timeout: %d minutes", CONFIG_TIMEOUT_MS / 60000);
  debugSeparator("WAITING FOR CONFIG");

  uint32_t start  = millis();
  uint32_t lastHb = 0;

  while (true) {
    dns.processNextRequest();
    server.handleClient();
    digitalWrite(PIN_LED, (millis() / 500) % 2);

    // Heartbeat log every 30 seconds
    if (millis() - lastHb > 30000) {
      uint32_t remaining = (CONFIG_TIMEOUT_MS - (millis() - start)) / 1000;
      LOG_INFO("Config AP alive — %lu s until timeout | %d client(s)",
               remaining, WiFi.softAPgetStationNum());
      lastHb = millis();
    }

    if (millis() - start > CONFIG_TIMEOUT_MS) {
      LOG_WARN("Config AP timeout reached — rebooting to beacon mode");
      ESP.restart();
    }
    yield();
  }
}

// =============================================================================
// BEACON MODE
// =============================================================================
void runBeaconMode() {
  LOG_SECTION("BEACON MODE");
  LOG_INFO("Boot cycle  : #%lu", g_bootCycle);
  LOG_INFO("Message     : \"%s\"", cfg.message);
  LOG_INFO("Frequencies : %d", cfg.freqCount);
  LOG_INFO("WPM         : %d  (dot=%lu ms, dash=%lu ms)", cfg.wpm, dotMs(), dashMs());
  LOG_INFO("Power       : %d dBm", cfg.powerDbm);
  LOG_INFO("Sleep after : %lu sec", cfg.sleepSec);

  // Disable WiFi + BT — saves ~120 mA during TX
  // Critical: at cold temps battery voltage sags more under load,
  // so every mA we eliminate improves stability
  LOG_INFO("Disabling WiFi + Bluetooth stacks...");
  WiFi.mode(WIFI_OFF);
  btStop();
  LOG_OK("RF radios (WiFi/BT) disabled");

  uint32_t cycleStart = millis();

  for (int fi = 0; fi < cfg.freqCount; fi++) {
    float freq = cfg.freqs[fi];
    debugSeparator();
    LOG_INFO("Frequency hop %d/%d → %.3f MHz", fi + 1, cfg.freqCount, freq);

    if (!initRadio(freq, cfg.powerDbm)) {
      LOG_ERR("Radio init FAILED on %.3f MHz — skipping", freq);
      blinkLed(5, 50);   // fast error blink
      continue;
    }

    transmitMessage(cfg.message);

    // Inter-frequency guard gap
    radio.standby();
    LOG_INFO("Inter-frequency guard: 50 ms");
    delay(50);
  }

  // Power down SX1276 completely
  radio.sleep();
  LOG_OK("SX1276 in sleep mode");

  uint32_t cycleDuration = millis() - cycleStart;
  LOG_OK("Full TX cycle done in %lu ms (%.2f sec)", cycleDuration, cycleDuration / 1000.0f);

  // Estimate next wake time
  LOG_INFO("Entering deep sleep for %lu seconds...", cfg.sleepSec);
  LOG_INFO("Next TX cycle at approximately T+%lu s from now", cfg.sleepSec);
  debugSeparator("SLEEP");
  Serial.flush();  // IMPORTANT: flush before sleep or last log lines get lost

  uint64_t sleepUs = (uint64_t)cfg.sleepSec * 1000000ULL;
  digitalWrite(PIN_LED, LOW);
  esp_deep_sleep(sleepUs);
  // Never reaches here
}

// =============================================================================
// ARDUINO SETUP — entry point after boot / deep-sleep wake
// =============================================================================
void setup() {
  Serial.begin(115200);
  delay(150);  // brief settle for USB CDC enumeration (ESP32-C3)
  debugBanner();

  g_bootCycle++;
  LOG_INFO("Boot cycle #%lu", g_bootCycle);
  LOG_INFO("Reset reason: %d", esp_reset_reason());
  LOG_INFO("Free heap   : %lu bytes", ESP.getFreeHeap());
  LOG_INFO("CPU freq    : %d MHz", getCpuFrequencyMhz());
  LOG_INFO("Flash size  : %lu bytes", ESP.getFlashChipSize());
  debugSeparator();

  pinMode(PIN_LED,  OUTPUT);
  pinMode(PIN_BOOT, INPUT_PULLUP);
  digitalWrite(PIN_LED, LOW);

  blinkLed(2, 80);  // startup flash

  // Load NVS config (fail-safe defaults if empty)
  loadConfig();

  // Config mode check: BOOT held LOW
  LOG_INFO("Checking BOOT button (GPIO%d)...", PIN_BOOT);
  if (digitalRead(PIN_BOOT) == LOW) {
    delay(100);   // debounce (cold-weather contacts may be sluggish)
    if (digitalRead(PIN_BOOT) == LOW) {
      LOG_INFO("BOOT button held — entering config mode");
      runConfigMode();  // blocks until reboot
    }
  }
  LOG_INFO("BOOT button not held — beacon mode");

  // Enter beacon TX cycle
  runBeaconMode();  // transmits then deep-sleeps (never returns)
}

void loop() {
  // Should never reach here.
  // If it does, something catastrophic happened — log and restart.
  LOG_ERR("loop() reached unexpectedly! This should never happen.");
  LOG_ERR("Heap free: %lu  |  Stack: %u", ESP.getFreeHeap(), uxTaskGetStackHighWaterMark(NULL));
  delay(2000);
  ESP.restart();
}

// =============================================================================
// END OF AEGIS-BEACON FIRMWARE v1.0
// =============================================================================
//
// QUICK DEBUG REFERENCE — Serial log tags:
//   [INFO ] — normal operation
//   [OK   ] — successful operation
//   [WARN ] — non-fatal anomaly (check if unexpected)
//   [ERROR] — failure (check wiring / hardware)
//   [MORSE] — per-symbol morse log (only if DEBUG_VERBOSE = 1)
//   [RF   ] — RadioLib return codes (only if DEBUG_VERBOSE = 1)
//
// TYPICAL HEALTHY BOOT LOG SEQUENCE:
//   [AEGIS-BEACON] v1.0 Boot
//   [INFO ] Boot cycle #1
//   [INFO ] Loading 1 frequencies from NVS   ← or "NVS empty"
//   [INFO ] Disabling WiFi + BT stacks...
//   [OK   ] Radio ready — 433.500 MHz, 17 dBm, OOK/CW
//   [INFO ] TX START: "SOS" @ 13 WPM
//   [OK   ] TX DONE: 3 chars in 2730 ms
//   [OK   ] Full TX cycle done in 2845 ms
//   [INFO ] Entering deep sleep for 10 seconds...
//
// COMMON ERRORS AND FIXES:
//   [ERROR] Radio beginFSK failed! Code: -2
//     → SPI wiring wrong. Double-check CS/SCK/MOSI/MISO/RST pins.
//   [ERROR] Radio beginFSK failed! Code: -7
//     → RA-02 not receiving SPI clock. Check solder joints.
//   [WARN ] NVS empty — using hardcoded defaults
//     → Normal on first boot. Configure via AP mode.
// =============================================================================
