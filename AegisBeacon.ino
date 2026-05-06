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
//  PROJECT   : Aegis-Beacon v4.0 — Dual-Mode Avalanche Rescue System
//              + SSD1306 OLED Display + 3.5mm Audio Jack (Search tone)
//  MODES     : BEACON (transmit SOS) ←→ SEARCH (scan + audio alert)
//  TARGET HW : ESP32-C3 SuperMini + RA-02 SX1276 + SSD1306 0.96" OLED
//  REPO      : https://github.com/Leo-Galli/Aegis-Beacon
//  FRAMEWORK : Arduino / PlatformIO
//  DEPS      : RadioLib >= 6.x | ArduinoJson >= 7.x | Adafruit SSD1306 >= 2.5
//              Adafruit GFX >= 1.11
//  LICENSE   : MIT — Use freely, save lives.
// =============================================================================
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                   BOM v4.0 — ~$12-15 USD                                  │
// ├────┬──────────────────────────────┬──────────┬──────────────────────────  │
// │Ref │ Part                         │ Cost USD │ Notes                      │
// ├────┼──────────────────────────────┼──────────┼──────────────────────────  │
// │ U1 │ ESP32-C3 SuperMini           │  $1.50   │ Built-in USB+LDO           │
// │ U2 │ AI-Thinker RA-02 (SX1276)    │  $2.50   │ 433MHz, spring antenna     │
// │ U3 │ SSD1306 0.96" OLED 128×64    │  $1.80   │ I2C, 4-pin module (I2C)    │
// │    │ (4-pin: VCC GND SCL SDA)     │          │ Address 0x3C default       │
// │ B1 │ 18650 Li-ion 3.7V            │  $1.50   │ Any brand                  │
// │ IC1│ TP4056 USB-C module          │  $0.50   │ Charge + protection        │
// │ J1 │ 3.5mm TRRS audio jack        │  $0.30   │ Panel-mount, 4-pole        │
// │    │ (e.g. PJ-320A or CUI SJ-3523)│          │ Tip=audio, Ring1=GND       │
// │ SW1│ Tactile switch 6×6mm (×2)    │  $0.10   │ MODE + CONFIG buttons      │
// │ C1 │ 100µF 10V electrolytic       │  $0.05   │ Bulk cap 3.3V              │
// │ C2 │ 100nF ceramic 0805 (×2)      │  $0.04   │ Decoupling                 │
// │ C3 │ 10µF 10V electrolytic        │  $0.03   │ Audio output filter        │
// │ R1 │ 10kΩ 0805 (×3)               │  $0.03   │ Pull-ups SW1, SW2, RST     │
// │ R2 │ 330Ω 0805 (×2)               │  $0.02   │ LED limiters               │
// │ R3 │ 100Ω 0805                    │  $0.01   │ Audio output series R      │
// │ D1 │ Red LED 3mm                  │  $0.05   │ BEACON indicator           │
// │ D2 │ Blue LED 3mm                 │  $0.05   │ SEARCH indicator           │
// │ANT │ 17.3cm wire                  │  $0.00   │ ¼-wave 433MHz              │
// │BOX │ Hammond 1593K / 3D PLA       │  $2.00   │ 80×40×20mm, fits 18650+OLED│
// ├────┴──────────────────────────────┼──────────┼──────────────────────────  │
// │                            TOTAL  │ ~$12-14  │                            │
// └───────────────────────────────────┴──────────┴─────────────────────────── ┘
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  OLED WIRING  — SSD1306 ↔ ESP32-C3 SuperMini (I2C)                       │
// ├────────────────┬─────────────────┬─────────────────────────────────────  │
// │  OLED Pin      │  ESP32-C3 GPIO  │  Notes                                │
// ├────────────────┼─────────────────┼─────────────────────────────────────  │
// │  VCC           │  3V3            │  3.3V — do NOT connect to 5V          │
// │  GND           │  GND            │                                       │
// │  SCL           │  GPIO 0         │  I2C Clock (shared if other I2C devs) │
// │  SDA           │  GPIO 1 ← WAIT  │  NOTE: GPIO1 = SW_CONFIG in v3!       │
// │                │                 │  In v4: SW_CONFIG moves to GPIO 21    │
// └────────────────┴─────────────────┴─────────────────────────────────────  ┘
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  AUDIO JACK WIRING — 3.5mm TRRS ↔ ESP32-C3                               │
// ├────────────────┬─────────────────┬─────────────────────────────────────  │
// │  Jack Pin      │  ESP32-C3 GPIO  │  Notes                                │
// ├────────────────┼─────────────────┼─────────────────────────────────────  │
// │  Tip (L audio) │  GPIO 18 (DAC)  │  via 100Ω + 10µF AC-coupling cap      │
// │  Ring1 (R)     │  GPIO 18 (DAC)  │  tie Tip+Ring1 for mono output        │
// │  Ring2 (MIC)   │  N/C            │  not used                             │
// │  Sleeve (GND)  │  GND            │  audio ground                         │
// └────────────────┴─────────────────┴─────────────────────────────────────  ┘
//
//  Audio path: GPIO18 → 100Ω → [10µF AC coupling] → TIP of 3.5mm jack
//  The 100Ω limits current; the 10µF blocks DC from headphones.
//  Volume is software-controlled via DAC value (0–255 = 0–3.3V).
//  Use: standard 3.5mm headphones / earphones. Impedance: 16–600Ω.
//
//  AUDIO TONE BEHAVIOUR (SEARCH mode):
//  • Silence               → no signal detected on current frequency
//  • Slow beep (1/s)       → WEAK signal detected  (RSSI -90 to -80 dBm)
//  • Fast beep (4/s)       → MEDIUM signal          (RSSI -80 to -60 dBm)
//  • Continuous tone       → STRONG signal          (RSSI > -60 dBm)
//  • Pitch rises           → signal getting stronger (like a metal detector)
//  • Morse click stream    → BEACON mode TX (audible in earphone for debug)
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  COMPLETE PIN MAP — ESP32-C3 SuperMini v4.0                              │
// ├────────────┬───────────────────────────────────────────────────────────  │
// │  GPIO  0   │  I2C SCL → OLED SCL                                         │
// │  GPIO  1   │  I2C SDA → OLED SDA                                         │
// │  GPIO  2   │  SX1276 DIO0 (TX/RX Done IRQ)                               │
// │  GPIO  3   │  SX1276 RESET (active LOW)                                  │
// │  GPIO  4   │  SPI SCK → RA-02 SCK                                        │
// │  GPIO  5   │  SPI MISO ← RA-02 MISO                                      │
// │  GPIO  6   │  SPI MOSI → RA-02 MOSI                                      │
// │  GPIO  7   │  SPI CS → RA-02 NSS (active LOW)                            │
// │  GPIO  8   │  LED_RED (BEACON mode indicator, through 330Ω)              │
// │  GPIO  9   │  SW_MODE / BOOT (short=toggle mode, long2s=emergency)       │
// │  GPIO 10   │  SX1276 DIO1 (RX timeout)                                   │
// │  GPIO 18   │  DAC output → 100Ω → 10µF → 3.5mm jack TIP                  │
// │  GPIO 20   │  LED_BLUE (SEARCH mode indicator, through 330Ω)             │
// │  GPIO 21   │  SW_CONFIG (short=status, long3s=WiFi AP)  ← moved from 1   │
// └────────────┴───────────────────────────────────────────────────────────  ┘
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  OLED SCREEN LAYOUTS BY MODE                                             │
// ├──────────────┬─────────────────────────────────────────────────────────  │
// │  BOOT        │  Logo + version splash, 2s                                │
// │  BEACON      │  Line1: "⬡ BEACON"  Line2: freq MHz  Line3: TX progress   │
// │              │  Line4: message + WPM  Line5: cycle#  Line6: sleep timer  │
// │  SEARCH      │  Line1: "◈ SEARCH"  Line2+3: current freq + RSSI bar      │
// │              │  Line4: last hit freq+dBm  Line5: total hits  Line6: time │
// │  EMERGENCY   │  Inverted full screen! "⚡SOS⚡" large, blinking         │
// │  CONFIG      │  WiFi SSID + IP + QR hint + "SCAN TO CONFIG"              │
// └──────────────┴─────────────────────────────────────────────────────────  │
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// LIBRARY DEPENDENCIES
// Arduino IDE → Library Manager:
//   • RadioLib          by Jan Gromes        >= 6.0.0
//   • ArduinoJson       by Benoît Blanchon   >= 7.0.0
//   • Adafruit SSD1306  by Adafruit          >= 2.5.0
//   • Adafruit GFX      by Adafruit          >= 1.11.0
//
// PlatformIO (platformio.ini):
//   lib_deps =
//     jgromes/RadioLib @ ^6.6.0
//     bblanchon/ArduinoJson @ ^7.0.0
//     adafruit/Adafruit SSD1306 @ ^2.5.9
//     adafruit/Adafruit GFX Library @ ^1.11.9
// ─────────────────────────────────────────────────────────────────────────────
#include <Arduino.h>
#include <RadioLib.h>
#include <Preferences.h>
#include <WiFi.h>
#include <DNSServer.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "esp_sleep.h"
#include "esp_task_wdt.h"

// =============================================================================
// DEBUG SYSTEM
// =============================================================================
// Serial at 115200 baud. ANSI colours work in picocom, minicom, VS Code, PuTTY.
// DEBUG_VERBOSE 0 → INFO/OK/WARN/ERROR/OLED/AUDIO
// DEBUG_VERBOSE 1 → + per-symbol MORSE + RadioLib RF codes
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
    "║  ⬡  AEGIS-BEACON v4.0 — DUAL-MODE + OLED + AUDIO JACK   ║\n"
    "║      https://github.com/Leo-Galli/Aegis-Beacon           ║\n"
    "╚══════════════════════════════════════════════════════════╝" C_RESET);
  Serial.printf(C_YELLOW "    Active mode: %s\n\n" C_RESET, mode);
}

// =============================================================================
// HARDWARE PINS  (ESP32-C3 SuperMini v4.0)
// =============================================================================
// ── SPI (RA-02 SX1276) ──────────────────────────────────────────────────────
#define PIN_SPI_SCK    4
#define PIN_SPI_MISO   5
#define PIN_SPI_MOSI   6
#define PIN_LORA_CS    7
#define PIN_LORA_RST   3
#define PIN_LORA_DIO0  2
#define PIN_LORA_DIO1  10

// ── I2C (SSD1306 OLED) ──────────────────────────────────────────────────────
// SDA on GPIO1, SCL on GPIO0 — these are the default I2C pins for ESP32-C3
// NOTE: SW_CONFIG moved from GPIO1 → GPIO21 to free up I2C SDA
#define PIN_I2C_SCL    0
#define PIN_I2C_SDA    1

// ── LEDs ────────────────────────────────────────────────────────────────────
#define PIN_LED_RED    8    // BEACON mode indicator
#define PIN_LED_BLUE   20   // SEARCH mode indicator

// ── BUTTONS ─────────────────────────────────────────────────────────────────
#define PIN_SW_MODE    9    // Short = toggle mode | Long 2s = Emergency SOS
#define PIN_SW_CONFIG  21   // Short = print status | Long 3s = Config AP
//     ↑ MOVED from GPIO1 to GPIO21 in v4.0 (GPIO1 needed for OLED SDA)

// ── AUDIO ───────────────────────────────────────────────────────────────────
// ESP32-C3 does NOT have a hardware DAC like the original ESP32.
// We use ledc PWM (8-bit) filtered through an RC low-pass to produce
// an analogue-ish audio signal.
// GPIO18 → PWM → [100Ω + 10µF RC filter] → 3.5mm jack TIP
// The RC cutoff: fc = 1/(2π×100×10e-6) = ~159 Hz.
// For better audio quality, increase to 1kΩ + 100nF (fc~1.6kHz)
// or use a simple I2S amplifier board.
#define PIN_AUDIO      18   // PWM audio output → 3.5mm jack
#define AUDIO_CHANNEL  0    // LEDC channel 0
#define AUDIO_FREQ_HZ  40000 // PWM carrier freq (above hearing range)
#define AUDIO_RES_BITS 8    // 8-bit resolution → 0-255 duty cycle

// ── OLED ─────────────────────────────────────────────────────────────────────
#define OLED_WIDTH   128
#define OLED_HEIGHT   64
#define OLED_ADDR   0x3C  // Default I2C address; some modules use 0x3D

// =============================================================================
// BUTTON TIMING
// =============================================================================
#define BTN_DEBOUNCE_MS    50
#define BTN_LONG_MODE_MS  2000
#define BTN_LONG_CFG_MS   3000
#define BTN_FACTORY_MS    5000

// =============================================================================
// CONFIGURATION DEFAULTS
// =============================================================================
#define DEFAULT_FREQ_MHZ      433.500f
#define DEFAULT_MESSAGE       "SOS"
#define DEFAULT_WPM           13
#define DEFAULT_POWER_DBM     17
#define DEFAULT_SLEEP_SEC     10
#define DEFAULT_SCAN_DWELL_MS 400
#define DEFAULT_RSSI_THRESH   -90
#define DEFAULT_AUDIO_VOL     180   // 0-255 DAC/PWM duty (70% of max)
#define DEFAULT_AUDIO_TONE_HZ 880   // A5 — standard alert tone

// =============================================================================
// LIMITS & CONSTANTS
// =============================================================================
#define MAX_FREQUENCIES   10
#define MAX_MESSAGE_LEN   64
#define MAX_SCAN_HITS     20
#define CONFIG_AP_TIMEOUT 300000
#define AP_SSID           "AegisBeacon"
#define AP_PASS           ""
#define AP_IP             "192.168.4.1"
#define WDT_TIMEOUT_SEC   30

// OLED display update interval (ms) — avoid updating too often to save CPU
#define OLED_REFRESH_MS   250

// Audio tone frequencies (Hz) for different signal strengths
#define AUDIO_TONE_WEAK    440   // A4 — weak signal
#define AUDIO_TONE_MEDIUM  880   // A5 — medium signal
#define AUDIO_TONE_STRONG  1760  // A6 — strong signal
#define AUDIO_TONE_MORSE   600   // Morse click tone

// =============================================================================
// OPERATING MODES
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

// =============================================================================
// DATA STRUCTURES
// =============================================================================
struct ScanHit {
  float    freq;
  int16_t  rssi;
  uint32_t timestamp;
  char     label[12];
};

struct Config {
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
  uint8_t  audioVolume;    // 0-255 PWM duty for audio output
  bool     audioEnabled;   // master audio on/off
  bool     oledEnabled;    // OLED on/off (save power if needed)
  bool     oledInvert;     // invert display (white on black / black on white)
  bool     emergencyGPS;   // reserved
} cfg;

struct ScanResult {
  float   freq;
  int16_t rssi;
  bool    detected;
};

// =============================================================================
// RTC MEMORY — survives deep sleep
// =============================================================================
RTC_DATA_ATTR uint32_t   g_bootCycle      = 0;
RTC_DATA_ATTR uint32_t   g_txCycles       = 0;
RTC_DATA_ATTR uint32_t   g_scanCycles     = 0;
RTC_DATA_ATTR ScanHit    g_scanHits[MAX_SCAN_HITS];
RTC_DATA_ATTR uint8_t    g_scanHitCount   = 0;
RTC_DATA_ATTR DeviceMode g_currentMode    = MODE_BEACON;
RTC_DATA_ATTR bool       g_emergencyActive = false;
// Last scan RSSI for OLED (survives wakes in search mode)
RTC_DATA_ATTR int16_t    g_lastRssi[MAX_FREQUENCIES];
RTC_DATA_ATTR uint8_t    g_lastRssiCount  = 0;

// =============================================================================
// GLOBALS
// =============================================================================
SPIClass lora_spi(HSPI);
SX1276   radio = new Module(PIN_LORA_CS, PIN_LORA_DIO0, PIN_LORA_RST,
                             PIN_LORA_DIO1, lora_spi);

// OLED — Wire1 on custom pins (GPIO0=SCL, GPIO1=SDA)
TwoWire  oled_i2c = TwoWire(0);
Adafruit_SSD1306 oled(OLED_WIDTH, OLED_HEIGHT, &oled_i2c, -1);
bool g_oledOk = false;   // set true if OLED init succeeds

Preferences prefs;
WebServer   server(80);
DNSServer   dns;

volatile bool g_modeButtonPressed   = false;
volatile bool g_configButtonPressed = false;

// OLED refresh throttle
uint32_t g_lastOledUpdate = 0;

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
// ║            AUDIO ENGINE                              ║
// ╚══════════════════════════════════════════════════════╝
// Uses ESP32-C3 LEDC peripheral (PWM) to generate tones.
// A simple RC low-pass on PIN_AUDIO converts PWM to analogue audio.
// The tone() function is NOT reliable on ESP32-C3; we use ledcWrite directly.
// =============================================================================

// Internal: generate a square wave of given frequency for durationMs
// Using ledcWriteTone (available in Arduino ESP32 core >= 2.0)
void audioTone(uint32_t freqHz, uint32_t durationMs) {
  if (!cfg.audioEnabled || freqHz == 0) return;
  LOG_AUDIO("Tone: %lu Hz for %lu ms (vol=%d)", freqHz, durationMs, cfg.audioVolume);

  ledcWriteTone(AUDIO_CHANNEL, freqHz);
  ledcWrite(AUDIO_CHANNEL, cfg.audioVolume / 2);  // 50% duty at given volume
  delay(durationMs);
  ledcWrite(AUDIO_CHANNEL, 0);  // silence
}

// Non-blocking tone start/stop (for use during scanning loops)
void audioToneStart(uint32_t freqHz) {
  if (!cfg.audioEnabled || freqHz == 0) { ledcWrite(AUDIO_CHANNEL, 0); return; }
  ledcWriteTone(AUDIO_CHANNEL, freqHz);
  ledcWrite(AUDIO_CHANNEL, cfg.audioVolume / 2);
}

void audioToneStop() {
  ledcWrite(AUDIO_CHANNEL, 0);
}

// Short click (Morse-style)
void audioClick(uint32_t durationMs = 15) {
  audioTone(AUDIO_TONE_MORSE, durationMs);
}

// Play ascending sweep — used on boot/mode-change
void audioSweep(uint32_t fromHz, uint32_t toHz, uint32_t stepMs = 8) {
  if (!cfg.audioEnabled) return;
  uint32_t step = (toHz > fromHz) ? 40 : -40;
  for (uint32_t f = fromHz; (toHz > fromHz) ? f < toHz : f > toHz; f += step) {
    ledcWriteTone(AUDIO_CHANNEL, f);
    ledcWrite(AUDIO_CHANNEL, cfg.audioVolume / 3);
    delay(stepMs);
  }
  ledcWrite(AUDIO_CHANNEL, 0);
}

// Audio feedback for RSSI level (metal-detector style)
// Called continuously in SEARCH mode inner loop
// Returns: tone frequency that was played (0 = silence)
uint32_t audioSearchTone(int16_t rssi) {
  if (!cfg.audioEnabled) return 0;

  if (rssi < cfg.rssiThreshold) {
    // Below threshold → silence
    audioToneStop();
    return 0;
  }

  // Map RSSI (-90 to -40 dBm) → tone frequency (440 to 2200 Hz)
  // This gives a rising pitch as you get closer to the beacon, like a metal detector
  int16_t rssiClamped = constrain(rssi, cfg.rssiThreshold, -40);
  uint32_t freq = map(rssiClamped, cfg.rssiThreshold, -40, 440, 2200);

  LOG_AUDIO("RSSI=%d dBm → tone=%lu Hz", rssi, freq);
  return freq;
}

// =============================================================================
// ╔══════════════════════════════════════════════════════╗
// ║              OLED DISPLAY ENGINE                     ║
// ╚══════════════════════════════════════════════════════╝
// All display functions are non-blocking (no delay inside).
// They write to the internal buffer and call display() once.
// oledUpdate() checks the OLED_REFRESH_MS throttle before redrawing.
// =============================================================================

bool initOled() {
  LOG_OLED("Initialising SSD1306 OLED at I2C addr 0x%02X", OLED_ADDR);
  oled_i2c.begin(PIN_I2C_SDA, PIN_I2C_SCL, 400000UL);  // 400 kHz fast mode

  if (!oled.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    LOG_ERR("OLED SSD1306 init FAILED — check I2C wiring (SDA=GPIO%d SCL=GPIO%d addr=0x%02X)",
            PIN_I2C_SDA, PIN_I2C_SCL, OLED_ADDR);
    LOG_WARN("Continuing without OLED — all other functions unaffected");
    return false;
  }

  oled.setTextWrap(false);
  oled.cp437(true);  // Use full 256-char CP437 set
  if (cfg.oledInvert) oled.invertDisplay(true);
  LOG_OK("OLED ready — 128×64 SSD1306");
  return true;
}

// Helper: draw a horizontal progress/bar gauge
// x,y = top-left corner  w = total width  h = height  pct = 0-100
void oledBar(int16_t x, int16_t y, int16_t w, int16_t h, uint8_t pct, bool inverted = false) {
  oled.drawRect(x, y, w, h, SSD1306_WHITE);
  int16_t fill = (int16_t)((w - 2) * pct / 100);
  if (fill > 0) {
    if (inverted)
      oled.fillRect(x + 1 + (w - 2 - fill), y + 1, fill, h - 2, SSD1306_WHITE);
    else
      oled.fillRect(x + 1, y + 1, fill, h - 2, SSD1306_WHITE);
  }
}

// Convert RSSI dBm → percentage for bar (noise floor -120 → 0%, -40 → 100%)
uint8_t rssiToPct(int16_t rssi) {
  return (uint8_t)constrain(map(rssi, -120, -40, 0, 100), 0, 100);
}

// ── BOOT SPLASH ──────────────────────────────────────────────────────────────
void oledSplash() {
  if (!g_oledOk || !cfg.oledEnabled) return;
  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);

  // Title
  oled.setTextSize(2);
  oled.setCursor(4, 4);
  oled.print("AEGIS");
  oled.setTextSize(1);
  oled.setCursor(76, 4);
  oled.print("v4.0");

  // Separator line
  oled.drawFastHLine(0, 22, 128, SSD1306_WHITE);

  // Subtitle
  oled.setTextSize(1);
  oled.setCursor(8, 26);
  oled.print("RESCUE BEACON");

  oled.setCursor(4, 38);
  oled.print("github.com/Leo-Galli");

  // Mode badge
  oled.drawRect(0, 52, 128, 12, SSD1306_WHITE);
  oled.fillRect(1, 53, 126, 10, SSD1306_WHITE);
  oled.setTextColor(SSD1306_BLACK);
  oled.setCursor(30, 55);
  oled.print("INITIALISING...");
  oled.setTextColor(SSD1306_WHITE);

  oled.display();
  LOG_OLED("Splash displayed");
}

// ── BEACON MODE SCREEN ───────────────────────────────────────────────────────
// Layout (128×64):
//  [0- 9] Status bar: mode badge | boot# | right: TX indicator
//  [11-22] Current frequency in large text
//  [24-32] Progress bar (current char in message)
//  [34-42] Message + WPM
//  [44-52] Cycle counter + repeat
//  [54-63] Sleep countdown / "TRANSMITTING"
void oledBeacon(int freqIdx, float freqMHz, int charIdx, int totalChars,
                uint32_t cycleNum, uint32_t sleepRemainSec, bool transmitting) {
  if (!g_oledOk || !cfg.oledEnabled) return;
  if (millis() - g_lastOledUpdate < OLED_REFRESH_MS && !transmitting) return;
  g_lastOledUpdate = millis();

  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);

  // ── Row 0: status bar ──
  oled.fillRect(0, 0, 128, 9, SSD1306_WHITE);
  oled.setTextColor(SSD1306_BLACK);
  oled.setTextSize(1);
  oled.setCursor(2, 1);
  oled.print("\x10 BEACON");       // ► BEACON
  oled.setCursor(74, 1);
  oled.print("BOOT#");
  oled.print(cycleNum);
  oled.setTextColor(SSD1306_WHITE);

  // ── Row 1: frequency (large) ──
  oled.setTextSize(2);
  oled.setCursor(0, 12);
  char fbuf[16];
  snprintf(fbuf, sizeof(fbuf), "%.3f", freqMHz);
  oled.print(fbuf);
  oled.setTextSize(1);
  oled.setCursor(100, 18);
  oled.print("MHz");

  // ── Row 2: freq index indicator ──
  oled.setCursor(0, 28);
  oled.print("FREQ ");
  oled.print(freqIdx + 1);
  oled.print("/");
  oled.print(cfg.freqCount);

  // ── Row 3: TX progress bar ──
  uint8_t pct = (totalChars > 0) ? (uint8_t)(charIdx * 100 / totalChars) : 0;
  oledBar(0, 36, 128, 8, pct);

  // ── Row 4: message + status ──
  oled.setTextSize(1);
  oled.setCursor(0, 46);
  char msgShort[17];
  snprintf(msgShort, sizeof(msgShort), "%-16s", cfg.message);
  oled.print(msgShort);

  // ── Row 5: bottom info ──
  oled.setCursor(0, 56);
  if (transmitting) {
    // Blink "TRANSMITTING" text
    if ((millis() / 400) % 2 == 0) {
      oled.fillRect(0, 55, 128, 9, SSD1306_WHITE);
      oled.setTextColor(SSD1306_BLACK);
      oled.setCursor(10, 56);
      oled.print("  TRANSMITTING  ");
      oled.setTextColor(SSD1306_WHITE);
    }
  } else {
    oled.print("SLEEP ");
    oled.print(sleepRemainSec);
    oled.print("s  ");
    oled.print(cfg.wpm);
    oled.print("WPM");
  }

  oled.display();
}

// ── SEARCH MODE SCREEN ───────────────────────────────────────────────────────
// Layout:
//  [0- 9] Status bar: ◈ SEARCH | hits count
//  [11-20] Current freq (medium)
//  [22-30] RSSI value + bar
//  [32-42] Last hit: freq + dBm + label
//  [44-52] Scan pass # | freq index
//  [54-63] Audio status + threshold
void oledSearch(int freqIdx, float freqMHz, int16_t rssi,
                uint32_t passNum, bool detected) {
  if (!g_oledOk || !cfg.oledEnabled) return;
  if (millis() - g_lastOledUpdate < OLED_REFRESH_MS) return;
  g_lastOledUpdate = millis();

  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);

  // ── Row 0: status bar ──
  oled.fillRect(0, 0, 128, 9, SSD1306_WHITE);
  oled.setTextColor(SSD1306_BLACK);
  oled.setTextSize(1);
  oled.setCursor(2, 1);
  oled.print("\x04 SEARCH");        // ♦ SEARCH
  oled.setCursor(80, 1);
  oled.print("HITS:");
  oled.print(g_scanHitCount);
  oled.setTextColor(SSD1306_WHITE);

  // ── Row 1: current frequency ──
  oled.setTextSize(2);
  oled.setCursor(0, 12);
  char fbuf[12];
  snprintf(fbuf, sizeof(fbuf), "%.3f", freqMHz);
  oled.print(fbuf);
  oled.setTextSize(1);
  oled.setCursor(100, 18);
  oled.print("MHz");

  // ── Row 2: RSSI bar ──
  oled.setCursor(0, 28);
  oled.print("RSSI:");
  char rbuf[8];
  snprintf(rbuf, sizeof(rbuf), "%4d", rssi);
  oled.print(rbuf);
  oled.print("dBm");
  uint8_t rssiPct = rssiToPct(rssi);
  oledBar(76, 28, 52, 7, rssiPct);

  // ── Row 3: detection alert (blink when detected) ──
  if (detected && (millis() / 300) % 2 == 0) {
    oled.fillRect(0, 37, 128, 9, SSD1306_WHITE);
    oled.setTextColor(SSD1306_BLACK);
    oled.setCursor(8, 38);
    // Show signal label
    if (rssi >= -60)       oled.print("!!! STRONG SIGNAL !!!");
    else if (rssi >= -80)  oled.print("!!  MEDIUM SIGNAL  !!");
    else                   oled.print("!   WEAK SIGNAL    !");
    oled.setTextColor(SSD1306_WHITE);
  } else if (g_scanHitCount > 0) {
    // Show last hit
    oled.setCursor(0, 38);
    oled.print("LAST:");
    snprintf(fbuf, sizeof(fbuf), "%.3f", g_scanHits[g_scanHitCount-1].freq);
    oled.print(fbuf);
    oled.print(" ");
    oled.print(g_scanHits[g_scanHitCount-1].rssi);
    oled.print("dBm");
  } else {
    oled.setCursor(0, 38);
    oled.print("SCANNING...");
  }

  // ── Row 4: pass + freq index ──
  oled.setCursor(0, 48);
  oled.print("PASS#");
  oled.print(passNum);
  oled.print(" CH:");
  oled.print(freqIdx + 1);
  oled.print("/");
  oled.print(cfg.freqCount);

  // ── Row 5: audio indicator ──
  oled.setCursor(0, 57);
  if (cfg.audioEnabled) {
    oled.print("\x0E ");    // ♫ symbol
    uint32_t toneFreq = audioSearchTone(rssi);  // just to read, not play
    if (toneFreq > 0) {
      oled.print(toneFreq);
      oled.print("Hz");
    } else {
      oled.print("SILENT");
    }
  } else {
    oled.print("AUDIO OFF");
  }
  oled.print("  THR:");
  oled.print(cfg.rssiThreshold);

  oled.display();
}

// ── EMERGENCY SCREEN ──────────────────────────────────────────────────────────
void oledEmergency(float freqMHz, uint32_t cycleNum) {
  if (!g_oledOk || !cfg.oledEnabled) return;
  if (millis() - g_lastOledUpdate < 200) return;  // faster refresh for blinking
  g_lastOledUpdate = millis();

  oled.clearDisplay();

  // Alternating inverse: full white → full black every 500ms
  bool inv = (millis() / 500) % 2;
  if (inv) {
    oled.fillScreen(SSD1306_WHITE);
    oled.setTextColor(SSD1306_BLACK);
  } else {
    oled.setTextColor(SSD1306_WHITE);
  }

  // Big SOS
  oled.setTextSize(3);
  oled.setCursor(22, 6);
  oled.print("SOS");

  // Emergency label
  oled.setTextSize(1);
  oled.setCursor(8, 34);
  oled.print("!! EMERGENCY MODE !!");

  // Frequency
  oled.setCursor(10, 46);
  char fbuf[20];
  snprintf(fbuf, sizeof(fbuf), "TX %.3f MHz", freqMHz);
  oled.print(fbuf);

  // Cycle counter
  oled.setCursor(30, 56);
  oled.print("CYCLE #");
  oled.print(cycleNum);

  oled.display();
}

// ── CONFIG MODE SCREEN ───────────────────────────────────────────────────────
void oledConfig() {
  if (!g_oledOk || !cfg.oledEnabled) return;
  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);

  // ── Row 0: header ──
  oled.fillRect(0, 0, 128, 9, SSD1306_WHITE);
  oled.setTextColor(SSD1306_BLACK);
  oled.setTextSize(1);
  oled.setCursor(14, 1);
  oled.print("CONFIGURATION MODE");
  oled.setTextColor(SSD1306_WHITE);

  // ── WiFi info ──
  oled.setTextSize(1);
  oled.setCursor(0, 12);
  oled.print("WiFi: ");
  oled.println(AP_SSID);

  oled.setCursor(0, 22);
  oled.print("URL: http://");
  oled.println(AP_IP);

  // Separator
  oled.drawFastHLine(0, 32, 128, SSD1306_WHITE);

  // Instructions
  oled.setCursor(0, 35);
  oled.print("1. Connect to WiFi");
  oled.setCursor(0, 44);
  oled.print("2. Open browser");
  oled.setCursor(0, 53);
  oled.print("3. Go to above URL");

  oled.display();
  LOG_OLED("Config screen shown");
}

// ── GENERIC MESSAGE SCREEN ───────────────────────────────────────────────────
// For errors, status text, etc.
void oledMessage(const char* line1, const char* line2 = nullptr,
                 const char* line3 = nullptr, bool inverted = false) {
  if (!g_oledOk || !cfg.oledEnabled) return;
  oled.clearDisplay();

  if (inverted) {
    oled.fillScreen(SSD1306_WHITE);
    oled.setTextColor(SSD1306_BLACK);
  } else {
    oled.setTextColor(SSD1306_WHITE);
  }

  oled.setTextSize(1);
  oled.setCursor(0, 8);  oled.println(line1 ? line1 : "");
  if (line2) { oled.setCursor(0, 24); oled.println(line2); }
  if (line3) { oled.setCursor(0, 40); oled.println(line3); }
  oled.display();
}

// =============================================================================
// LED HELPERS
// =============================================================================
void ledsOff() {
  digitalWrite(PIN_LED_RED, LOW);
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
  if (m == MODE_BEACON || m == MODE_EMERGENCY)
    blinkLed(PIN_LED_RED, 3, 80);
  else if (m == MODE_SEARCH)
    blinkLed(PIN_LED_BLUE, 3, 80);
  else {
    blinkLed(PIN_LED_RED, 1, 200);
    blinkLed(PIN_LED_BLUE, 1, 200);
  }
}

// =============================================================================
// BUTTON ISRs
// =============================================================================
void IRAM_ATTR isrModeButton()   { g_modeButtonPressed   = true; }
void IRAM_ATTR isrConfigButton() { g_configButtonPressed = true; }

uint32_t waitButtonRelease(uint8_t pin) {
  uint32_t t = millis();
  while (digitalRead(pin) == LOW) { delay(10); esp_task_wdt_reset(); }
  return millis() - t;
}

// Returns: 0=not pressed, 1=short, 2=long
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
    LOG_WARN("NVS empty — using hardcoded defaults");
    cfg.freqs[0] = DEFAULT_FREQ_MHZ; cfg.freqCount = 1;
  } else {
    for (int i = 0; i < cfg.freqCount; i++) {
      char k[8]; snprintf(k, sizeof(k), "f%d", i);
      cfg.freqs[i] = prefs.getFloat(k, DEFAULT_FREQ_MHZ);
      LOG_INFO("  freq[%d] = %.3f MHz", i, cfg.freqs[i]);
    }
  }

  prefs.getString("msg", cfg.message, MAX_MESSAGE_LEN);
  if (!strlen(cfg.message)) strlcpy(cfg.message, DEFAULT_MESSAGE, MAX_MESSAGE_LEN);

  cfg.wpm           = prefs.getUChar("wpm",    DEFAULT_WPM);
  cfg.powerDbm      = (int8_t)prefs.getChar("pwr", DEFAULT_POWER_DBM);
  cfg.sleepSec      = prefs.getULong("sleep",  DEFAULT_SLEEP_SEC);
  cfg.scanDwellMs   = prefs.getUShort("dwell", DEFAULT_SCAN_DWELL_MS);
  cfg.rssiThreshold = (int8_t)prefs.getChar("rssi",   DEFAULT_RSSI_THRESH);
  cfg.lastMode      = (DeviceMode)prefs.getUChar("mode", MODE_BEACON);
  cfg.autoSwitch    = prefs.getBool("aswitch", false);
  cfg.repeatCount   = prefs.getUChar("rep",    1);
  cfg.audioVolume   = prefs.getUChar("avol",   DEFAULT_AUDIO_VOL);
  cfg.audioEnabled  = prefs.getBool("aen",     true);
  cfg.oledEnabled   = prefs.getBool("olen",    true);
  cfg.oledInvert    = prefs.getBool("olinv",   false);
  cfg.emergencyGPS  = prefs.getBool("egps",    false);
  prefs.end();

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
  LOG_INFO("Audio        : %s vol=%d", cfg.audioEnabled?"ON":"OFF", cfg.audioVolume);
  LOG_INFO("OLED         : %s invert=%s", cfg.oledEnabled?"ON":"OFF", cfg.oledInvert?"YES":"NO");
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
  prefs.putBool("egps",     cfg.emergencyGPS);
  prefs.end();
  LOG_OK("Config saved to NVS");
}

void factoryReset() {
  LOG_WARN("FACTORY RESET — clearing NVS...");
  oledMessage("FACTORY RESET", "Clearing NVS...", "Reboot in 3s", true);
  audioSweep(1600, 200, 5);
  prefs.begin("aegis", false); prefs.clear(); prefs.end();
  g_bootCycle = 0; g_txCycles = 0; g_scanCycles = 0;
  g_scanHitCount = 0; g_emergencyActive = false;
  g_currentMode = MODE_BEACON;
  LOG_OK("NVS cleared. Rebooting...");
  delay(3000);
  ESP.restart();
}

// =============================================================================
// RADIO INIT
// =============================================================================
bool initRadioOOK(float freqMHz, int8_t powerDbm) {
  LOG_INFO("Radio OOK init: %.3f MHz @ %d dBm", freqMHz, powerDbm);
  lora_spi.begin(PIN_SPI_SCK, PIN_SPI_MISO, PIN_SPI_MOSI, PIN_LORA_CS);
  int s = radio.beginFSK(freqMHz, 1.2f, 5.0f, 125.0f, powerDbm, 16, false);
  LOG_RF("beginFSK state=%d", s);
  if (s != RADIOLIB_ERR_NONE) {
    LOG_ERR("Radio init FAILED: %d (CS=GPIO%d RST=GPIO%d DIO0=GPIO%d)",
            s, PIN_LORA_CS, PIN_LORA_RST, PIN_LORA_DIO0);
    oledMessage("RADIO ERROR", "Check SPI wiring", "See Serial log");
    return false;
  }
  s = radio.setOOK(true);
  if (s != RADIOLIB_ERR_NONE) { LOG_ERR("OOK mode failed: %d", s); return false; }
  radio.setOutputPower(powerDbm);
  LOG_OK("Radio OOK ready: %.3f MHz @ %d dBm", freqMHz, powerDbm);
  return true;
}

bool initRadioFSK(float freqMHz) {
  LOG_INFO("Radio FSK RX init: %.3f MHz", freqMHz);
  lora_spi.begin(PIN_SPI_SCK, PIN_SPI_MISO, PIN_SPI_MOSI, PIN_LORA_CS);
  int s = radio.beginFSK(freqMHz, 1.2f, 5.0f, 250.0f, 2, 16, false);
  if (s != RADIOLIB_ERR_NONE) { LOG_ERR("Radio FSK RX failed: %d", s); return false; }
  LOG_OK("Radio FSK RX ready: %.3f MHz", freqMHz);
  return true;
}

// =============================================================================
// MORSE TX ENGINE
// =============================================================================
inline void txOn()  { radio.transmitDirect(); }
inline void txOff() { radio.standby(); }

// Transmit one Morse character with optional audio click feedback
void transmitMorseChar(char c, int idx, int totalChars, int freqIdx, float freqMHz,
                        uint32_t cycleNum) {
  c = toupper(c);
  const char* pat = nullptr;
  if      (c >= 'A' && c <= 'Z') pat = MORSE_TABLE[c - 'A'];
  else if (c >= '0' && c <= '9') pat = MORSE_TABLE[26 + (c - '0')];
  else if (c == ' ')             { delay(wordGapMs()); return; }
  else                           { return; }

  LOG_MORSE("[%d/%d] '%c' → %s", idx+1, totalChars, c, pat);

  for (int i = 0; pat[i]; i++) {
    bool dot = (pat[i] == '.');
    uint32_t dur = dot ? dotMs() : dashMs();

    txOn();
    // Audio click during TX (earphone monitoring of outgoing signal)
    if (cfg.audioEnabled) {
      audioToneStart(AUDIO_TONE_MORSE);
    }

    // Update OLED while transmitting
    oledBeacon(freqIdx, freqMHz, idx, totalChars, cycleNum, 0, true);

    delay(dur);
    txOff();
    audioToneStop();

    if (pat[i + 1]) delay(intraChrMs());
  }
  delay(interChrMs());
}

// Transmit complete message, returns false if interrupted
bool transmitMessage(const char* msg, int freqIdx, float freqMHz,
                     uint32_t cycleNum, bool interruptible = true) {
  int len = strlen(msg);
  LOG_INFO("TX: \"%s\" @ %d WPM  (dot=%lu ms)", msg, cfg.wpm, dotMs());
  uint32_t t0 = millis();

  for (int i = 0; msg[i]; i++) {
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
  int16_t maxRssi = -120;
  uint32_t dwellEnd = millis() + cfg.scanDwellMs;

  while (millis() < dwellEnd) {
    int16_t rssi = radio.getRSSI();
    if (rssi > maxRssi) maxRssi = rssi;

    // Continuous audio feedback (metal-detector pitch tracking)
    if (cfg.audioEnabled) {
      uint32_t toneFreq = audioSearchTone(rssi);
      if (toneFreq > 0) audioToneStart(toneFreq);
      else               audioToneStop();
    }

    // OLED update during dwell
    bool det = (rssi >= cfg.rssiThreshold);
    oledSearch(freqIdx, freqMHz, rssi, passNum, det);

    delay(20);
    esp_task_wdt_reset();
  }

  audioToneStop();
  radio.standby();
  r.rssi     = maxRssi;
  r.detected = (maxRssi >= cfg.rssiThreshold);

  // Print ASCII bar on Serial
  int bars = (maxRssi > -120) ? (int)constrain(map(maxRssi, -120, -40, 0, 20), 0, 20) : 0;
  char bar[22] = "                    ";
  for (int b = 0; b < bars; b++) bar[b] = '#';
  LOG_SCAN("[%d] %.3f MHz  RSSI=%4d dBm  |%s|  %s",
           freqIdx, freqMHz, maxRssi, bar,
           r.detected ? "*** SIGNAL ***" : "quiet");

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

  LOG_SCAN("HIT: %.3f MHz  %d dBm  [%s]  total=%d",
           freq, rssi, hit.label, g_scanHitCount);

  // Alert: audio chirp + LED flash
  blinkLed(PIN_LED_BLUE, 3, 60);
  if (cfg.audioEnabled) {
    // Rising triple-beep alert: classic rescue detector sound
    audioTone(440, 80); delay(40);
    audioTone(880, 80); delay(40);
    audioTone(1760, 160);
  }
}

void printScanHistory() {
  dbSep("SCAN HISTORY");
  if (g_scanHitCount == 0) { LOG_SCAN("No signals detected"); return; }
  for (int i = 0; i < g_scanHitCount; i++) {
    LOG_SCAN("[%2d] %.3f MHz  %4d dBm  %-8s  T+%lu s",
             i+1, g_scanHits[i].freq, g_scanHits[i].rssi,
             g_scanHits[i].label, g_scanHits[i].timestamp / 1000);
  }
  dbSep();
}

void printStatus() {
  dbSep("DEVICE STATUS");
  LOG_INFO("Boot cycle   : #%lu", g_bootCycle);
  LOG_INFO("Mode         : %s", modeName(g_currentMode));
  LOG_INFO("TX cycles    : %lu", g_txCycles);
  LOG_INFO("Scan cycles  : %lu", g_scanCycles);
  LOG_INFO("Scan hits    : %d", g_scanHitCount);
  LOG_INFO("Emergency    : %s", g_emergencyActive ? "ACTIVE" : "off");
  LOG_INFO("Free heap    : %lu B", ESP.getFreeHeap());
  LOG_INFO("Uptime       : %lu s", millis() / 1000);
  LOG_INFO("OLED         : %s", g_oledOk ? "OK" : "NOT FOUND");
  LOG_INFO("Audio        : %s vol=%d", cfg.audioEnabled ? "ON" : "OFF", cfg.audioVolume);
  printScanHistory();
}

// =============================================================================
// ══════════════════════════════════════════════════════════
//   CAPTIVE PORTAL DASHBOARD HTML  (v4.0 — OLED + Audio)
// ══════════════════════════════════════════════════════════
// =============================================================================
const char DASHBOARD_HTML[] PROGMEM = R"HTMLDOC(
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AEGIS-BEACON v4.0 // CONFIG</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;600;900&display=swap');
:root{
  --bg:#07090e;--s1:#0b1019;--s2:#0f1825;--border:#182640;
  --a1:#00e5ff;--a2:#ff3b3b;--a3:#39ff14;--a4:#ff9900;
  --txt:#b8ccd8;--dim:#3a5060;--dim2:#2a3a48;
  --glow1:0 0 18px rgba(0,229,255,.35);--glow2:0 0 18px rgba(255,59,59,.35);
  --glow3:0 0 18px rgba(57,255,20,.35);--r:5px;--r2:10px;
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
main{max-width:980px;margin:0 auto;padding:24px 18px;display:grid;gap:16px;grid-template-columns:1fr 1fr;}
@media(max-width:640px){main{grid-template-columns:1fr}}
.card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r2);padding:20px;position:relative;overflow:hidden;transition:border-color .25s;}
.card:hover{border-color:rgba(0,229,255,.22);}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--a1),transparent);opacity:.5;}
.card.full{grid-column:1/-1}.card.alert::before{background:linear-gradient(90deg,transparent,var(--a2),transparent);}
.card.ok::before{background:linear-gradient(90deg,transparent,var(--a3),transparent);}
.card.audio::before{background:linear-gradient(90deg,transparent,var(--a4),transparent);}
.ct{font-family:'Orbitron',sans-serif;font-size:.62rem;letter-spacing:3px;color:var(--a1);margin-bottom:16px;text-transform:uppercase;display:flex;align-items:center;gap:7px;}
.ct-dot{width:6px;height:6px;border-radius:50%;background:var(--a1);box-shadow:var(--glow1);animation:pulse 2.5s infinite;}
.card.alert .ct{color:var(--a2);}.card.alert .ct-dot{background:var(--a2);box-shadow:var(--glow2);}
.card.ok .ct{color:var(--a3);}.card.ok .ct-dot{background:var(--a3);box-shadow:var(--glow3);}
.card.audio .ct{color:var(--a4);}.card.audio .ct-dot{background:var(--a4);box-shadow:0 0 12px rgba(255,153,0,.4);}
label{display:block;font-size:.66rem;color:var(--dim);margin-bottom:4px;letter-spacing:1px;}
.form-row{margin-bottom:14px;}
input[type=text],input[type=number],textarea,select{width:100%;background:#050810;border:1px solid var(--border);border-radius:var(--r);color:var(--txt);font-family:'Share Tech Mono',monospace;font-size:.85rem;padding:8px 11px;outline:none;transition:border-color .2s,box-shadow .2s;}
input:focus,textarea:focus,select:focus{border-color:var(--a1);box-shadow:0 0 0 2px rgba(0,229,255,.1);}
textarea{resize:vertical;min-height:62px;}
input[type=range]{-webkit-appearance:none;width:100%;height:5px;background:var(--border);border-radius:3px;outline:none;margin:9px 0 3px;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:17px;height:17px;border-radius:50%;background:var(--a1);cursor:pointer;box-shadow:var(--glow1);}
input[type=range].audio-range::-webkit-slider-thumb{background:var(--a4);}
.range-row{display:flex;justify-content:space-between;font-size:.6rem;color:var(--dim);}
.val-big{font-family:'Orbitron',sans-serif;font-size:1.4rem;color:var(--a1);text-shadow:var(--glow1);text-align:center;margin-top:5px;}
.val-big.audio{color:var(--a4);}
.tog-wrap{display:flex;align-items:center;gap:11px;cursor:pointer;margin-top:3px;}
.tog-cb{position:relative;width:42px;height:22px;flex-shrink:0;}
.tog-cb input{opacity:0;width:0;height:0;}
.tog-slider{position:absolute;inset:0;background:var(--dim2);border-radius:11px;cursor:pointer;transition:background .25s;border:1px solid var(--border);}
.tog-slider::before{content:'';position:absolute;width:16px;height:16px;left:2px;top:2px;background:#666;border-radius:50%;transition:transform .25s,background .25s;}
.tog-cb input:checked+.tog-slider{background:rgba(0,229,255,.15);border-color:var(--a1);}
.tog-cb input:checked+.tog-slider::before{transform:translateX(20px);background:var(--a1);box-shadow:var(--glow1);}
.tog-lbl{font-size:.76rem;color:var(--txt);}
.mode-toggle-wrap{display:flex;flex-direction:column;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r2);padding:18px 24px;}
.mode-label{font-family:'Orbitron',sans-serif;font-size:.62rem;letter-spacing:3px;color:var(--dim);margin-bottom:3px;}
.toggle-switch{position:relative;width:176px;height:46px;background:var(--s1);border-radius:23px;cursor:pointer;border:2px solid var(--border);transition:border-color .3s;user-select:none;}
.toggle-switch.beacon{border-color:var(--a2);}.toggle-switch.search{border-color:var(--a1);}
.toggle-knob{position:absolute;top:4px;width:80px;height:34px;border-radius:19px;transition:left .3s cubic-bezier(.4,0,.2,1),background .3s;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',sans-serif;font-size:.58rem;letter-spacing:2px;font-weight:600;}
.toggle-switch.beacon .toggle-knob{left:4px;background:var(--a2);color:#fff;box-shadow:var(--glow2);}
.toggle-switch.search .toggle-knob{left:88px;background:var(--a1);color:#000;box-shadow:var(--glow1);}
.toggle-labels{display:flex;width:176px;justify-content:space-between;font-size:.62rem;}
.toggle-labels span:first-child{color:var(--a2);}.toggle-labels span:last-child{color:var(--a1);}
#freqList{list-style:none;margin-bottom:11px;}
#freqList li{display:flex;align-items:center;gap:7px;padding:7px 10px;background:#050810;border:1px solid var(--border);border-radius:var(--r);margin-bottom:4px;font-size:.82rem;animation:fadeIn .2s ease;}
@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.fv{flex:1;color:var(--a1);font-family:'Orbitron',sans-serif;font-size:.78rem;}
.fb{color:var(--dim);font-size:.61rem;}
.fi{color:var(--a3);font-size:.61rem;}
.del{background:none;border:1px solid #2a1010;color:var(--a2);padding:2px 7px;border-radius:3px;cursor:pointer;font-size:.68rem;transition:background .15s;font-family:inherit;}
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
.no-hits{color:var(--dim);font-size:.73rem;padding:14px 0;text-align:center;}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.stat-item{background:#050810;border:1px solid var(--dim2);border-radius:var(--r);padding:9px 12px;}
.stat-lbl{font-size:.58rem;color:var(--dim);letter-spacing:1px;margin-bottom:2px;}
.stat-val{font-family:'Orbitron',sans-serif;font-size:.82rem;color:var(--a1);}
.stat-val.ok{color:var(--a3);}.stat-val.warn{color:var(--a4);}.stat-val.err{color:var(--a2);}
.oled-preview{background:#000;border:2px solid var(--border);border-radius:4px;padding:8px;font-family:'Share Tech Mono',monospace;font-size:.72rem;color:#fff;line-height:1.7;min-height:90px;}
.oled-preview.active{border-color:var(--a1);box-shadow:0 0 8px rgba(0,229,255,.2);}
#morsePreview{font-size:.88rem;letter-spacing:4px;color:var(--a1);word-break:break-all;min-height:22px;margin-top:7px;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 18px;border-radius:var(--r);font-family:'Orbitron',sans-serif;font-size:.62rem;letter-spacing:2px;cursor:pointer;border:1px solid;transition:all .2s;text-transform:uppercase;white-space:nowrap;}
.btn:disabled{opacity:.4;cursor:not-allowed;}
.btn-c{background:rgba(0,229,255,.08);border-color:var(--a1);color:var(--a1);}
.btn-c:hover:not(:disabled){background:rgba(0,229,255,.18);box-shadow:var(--glow1);}
.btn-d{background:rgba(255,59,59,.08);border-color:var(--a2);color:var(--a2);}
.btn-d:hover:not(:disabled){background:rgba(255,59,59,.2);box-shadow:var(--glow2);}
.btn-g{background:rgba(57,255,20,.08);border-color:var(--a3);color:var(--a3);}
.btn-g:hover:not(:disabled){background:rgba(57,255,20,.18);box-shadow:var(--glow3);}
.btn-au{background:rgba(255,153,0,.08);border-color:var(--a4);color:var(--a4);}
.btn-au:hover:not(:disabled){background:rgba(255,153,0,.2);}
.btn-save{width:100%;padding:13px;font-size:.73rem;background:linear-gradient(135deg,rgba(0,229,255,.12),rgba(0,120,160,.12));border-color:var(--a1);color:var(--a1);margin-top:3px;}
.btn-save:hover{background:rgba(0,229,255,.22);box-shadow:var(--glow1);}
.btn-row{display:flex;gap:9px;flex-wrap:wrap;}
.tx-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px;background:var(--a2);box-shadow:var(--glow2);}
.tx-dot.on{animation:blink .2s step-start infinite;}
@keyframes blink{50%{opacity:0}}
.emg-btn{width:100%;padding:14px;font-size:.72rem;letter-spacing:3px;background:rgba(255,59,59,.12);border:2px solid var(--a2);color:var(--a2);animation:emgPulse 2s infinite;}
@keyframes emgPulse{0%,100%{box-shadow:var(--glow2)}50%{box-shadow:none}}
.emg-btn:hover{background:rgba(255,59,59,.25);}
.section-hdr{grid-column:1/-1;display:flex;align-items:center;gap:14px;margin-top:6px;}
.section-hdr span{font-family:'Orbitron',sans-serif;font-size:.6rem;letter-spacing:4px;color:var(--dim);white-space:nowrap;}
.section-hdr::before,.section-hdr::after{content:'';flex:1;height:1px;background:var(--border);}
.dbg-box{background:#050810;border:1px solid var(--dim2);border-radius:var(--r);padding:11px 13px;font-size:.66rem;line-height:1.8;color:var(--dim);}
.dbg-box code{color:var(--a1);background:rgba(0,229,255,.07);padding:1px 5px;border-radius:2px;}
#toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:var(--s2);border:1px solid var(--a1);color:var(--a1);padding:9px 22px;border-radius:var(--r);font-size:.74rem;letter-spacing:1px;box-shadow:var(--glow1);opacity:0;pointer-events:none;transition:opacity .3s;z-index:200;}
#toast.show{opacity:1}#toast.err{border-color:var(--a2);color:var(--a2);box-shadow:var(--glow2);}
</style>
</head>
<body>
<header>
  <div class="logo">AEGIS<em>⬡</em>BEACON <span style="font-size:.65rem;color:var(--dim)">v4.0</span></div>
  <div style="text-align:right;font-size:.58rem;color:var(--dim);line-height:1.9">
    <div>ESP32-C3 + RA-02 + OLED + Audio</div>
    <div id="hdrMode" style="color:var(--a1)">LOADING...</div>
  </div>
  <div class="badge">◉ CONFIG AP</div>
</header>
<main>

<!-- MODE TOGGLE -->
<div class="card full">
  <div class="ct"><span class="ct-dot"></span>OPERATING MODE</div>
  <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-start;justify-content:center">
    <div class="mode-toggle-wrap">
      <div class="mode-label">CURRENT MODE</div>
      <div class="toggle-switch beacon" id="modeToggle" onclick="toggleMode()">
        <div class="toggle-knob" id="modeKnob">BEACON</div>
      </div>
      <div class="toggle-labels"><span>⬤ BEACON</span><span>SEARCH ⬤</span></div>
    </div>
    <div style="max-width:380px">
      <div id="modeDescBeacon" style="font-size:.67rem;color:#ff6b6b;line-height:1.7">
        <strong style="color:var(--a2)">BEACON MODE</strong> — Transmits Morse SOS on all configured frequencies.
        Red LED + OLED shows TX progress. Audio earphone provides morse click feedback.
      </div>
      <div id="modeDescSearch" style="display:none;font-size:.67rem;color:#7ee8fa;line-height:1.7">
        <strong style="color:var(--a1)">SEARCH MODE</strong> — Scans all frequencies, measures RSSI.
        Blue LED blinks on detection. OLED shows signal strength. 3.5mm jack audio pitch rises as signal gets stronger — like a metal detector.
      </div>
      <div style="margin-top:12px;padding:9px 13px;background:#050810;border:1px solid var(--dim2);border-radius:var(--r);font-size:.66rem;color:var(--dim);line-height:1.8">
        <strong style="color:var(--txt)">Buttons:</strong>
        SW_MODE short → toggle BEACON/SEARCH &bull;
        SW_MODE 2s → Emergency SOS &bull;
        SW_CONFIG 3s → this dashboard &bull;
        Both at boot 5s → factory reset
      </div>
    </div>
  </div>
</div>

<!-- SECTION: BEACON -->
<div class="section-hdr"><span>BEACON SETTINGS</span></div>

<div class="card full">
  <div class="ct"><span class="ct-dot"></span>EMERGENCY MESSAGE</div>
  <div class="form-row">
    <label>TRANSMISSION TEXT</label>
    <textarea id="msgInput" maxlength="63" placeholder="SOS MY LOCATION IS..."></textarea>
  </div>
  <label>MORSE PREVIEW</label>
  <div id="morsePreview">· · ·  − − −  · · ·</div>
</div>

<div class="card full">
  <div class="ct"><span class="ct-dot"></span>FREQUENCY MANAGER</div>
  <ul id="freqList"></ul>
  <div class="add-row" style="margin-bottom:7px">
    <input type="number" id="newFreq" placeholder="e.g. 433.500" step="0.001" min="137" max="1020">
    <button class="btn btn-c" onclick="addFreq()">＋ ADD</button>
  </div>
  <div style="font-size:.6rem;color:var(--dim)">
    Common: <code style="color:var(--a1)">433.500</code> ISM-EU &bull;
    <code style="color:var(--a1)">915.000</code> ISM-US &bull;
    <code style="color:var(--a1)">121.500</code> Aviation &bull;
    <code style="color:var(--a1)">156.800</code> Marine
  </div>
</div>

<div class="card">
  <div class="ct"><span class="ct-dot"></span>MORSE SPEED</div>
  <label>WORDS PER MINUTE</label>
  <input type="range" id="wpmSlider" min="5" max="30" value="13" oninput="updateWpm(this.value)">
  <div class="range-row"><span>5 WPM</span><span>30 WPM</span></div>
  <div class="val-big" id="wpmVal">13 WPM</div>
</div>

<div class="card">
  <div class="ct"><span class="ct-dot"></span>TX POWER</div>
  <label>OUTPUT POWER (RA-02 max 17 dBm)</label>
  <input type="range" id="pwrSlider" min="2" max="17" value="17" oninput="updatePwr(this.value)">
  <div class="range-row"><span>+2 dBm</span><span>+17 dBm</span></div>
  <div class="val-big" id="pwrVal">+17 dBm</div>
</div>

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
</div>

<!-- SECTION: AUDIO -->
<div class="section-hdr"><span>AUDIO OUTPUT (3.5mm Jack)</span></div>

<div class="card audio full">
  <div class="ct"><span class="ct-dot"></span>AUDIO SETTINGS</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;flex-wrap:wrap">
    <div>
      <div class="form-row">
        <label class="tog-wrap" for="audioEnabled">
          <div class="tog-cb"><input type="checkbox" id="audioEnabled" checked><span class="tog-slider"></span></div>
          <span class="tog-lbl">Enable 3.5mm audio jack output</span>
        </label>
      </div>
      <label>OUTPUT VOLUME (0–255 PWM duty)</label>
      <input type="range" class="audio-range" id="volSlider" min="0" max="255" value="180" oninput="updateVol(this.value)">
      <div class="range-row"><span>Mute</span><span>Max</span></div>
      <div class="val-big audio" id="volVal">180</div>
    </div>
    <div style="font-size:.68rem;color:var(--dim);line-height:1.9">
      <strong style="color:var(--a4)">SEARCH mode audio:</strong><br>
      Pitch rises with signal strength (metal-detector effect).<br>
      440Hz = weak &bull; 880Hz = medium &bull; 1760Hz = strong<br>
      Triple beep on new detection.<br><br>
      <strong style="color:var(--a4)">BEACON mode audio:</strong><br>
      Morse click feedback in earphone.<br><br>
      <strong style="color:var(--txt)">Hardware:</strong>
      GPIO18 → 100Ω → 10µF cap → 3.5mm TIP<br>
      Supports 16–600Ω headphones/earphones.
    </div>
  </div>
</div>

<!-- SECTION: OLED -->
<div class="section-hdr"><span>OLED DISPLAY (SSD1306 128×64)</span></div>

<div class="card full">
  <div class="ct"><span class="ct-dot"></span>DISPLAY SETTINGS</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
    <div>
      <div class="form-row">
        <label class="tog-wrap" for="oledEnabled">
          <div class="tog-cb"><input type="checkbox" id="oledEnabled" checked><span class="tog-slider"></span></div>
          <span class="tog-lbl">Enable OLED display</span>
        </label>
      </div>
      <div class="form-row" style="margin-top:12px">
        <label class="tog-wrap" for="oledInvert">
          <div class="tog-cb"><input type="checkbox" id="oledInvert"><span class="tog-slider"></span></div>
          <span class="tog-lbl">Invert display (white on black ↔ black on white)</span>
        </label>
      </div>
      <div class="form-row" style="margin-top:14px">
        <button class="btn btn-c" style="width:100%" onclick="testOled()">◻ TEST OLED DISPLAY</button>
      </div>
      <div id="oledTestStatus" style="font-size:.68rem;color:var(--dim);margin-top:8px"></div>
    </div>
    <div>
      <div style="font-size:.66rem;color:var(--dim);margin-bottom:8px;letter-spacing:1px">OLED SCREEN PREVIEW (per mode)</div>
      <div class="oled-preview active" id="oledPreview">
        Loading preview...
      </div>
    </div>
  </div>
</div>

<!-- SECTION: SEARCH -->
<div class="section-hdr"><span>SEARCH / SCAN SETTINGS</span></div>

<div class="card">
  <div class="ct"><span class="ct-dot"></span>SCAN PARAMETERS</div>
  <div class="form-row">
    <label>DWELL TIME PER FREQUENCY (ms)</label>
    <input type="number" id="dwellInput" min="100" max="5000" value="400">
  </div>
  <div class="form-row">
    <label>RSSI DETECTION THRESHOLD (dBm)</label>
    <input type="range" id="rssiSlider" min="-120" max="-40" value="-90" oninput="updateRssi(this.value)">
    <div class="range-row"><span>-120 (sensitive)</span><span>-40 (strong only)</span></div>
    <div class="val-big" id="rssiVal" style="color:var(--a4)">-90 dBm</div>
  </div>
</div>

<div class="card ok">
  <div class="ct"><span class="ct-dot"></span>DETECTED SIGNALS</div>
  <div class="btn-row" style="margin-bottom:10px">
    <button class="btn btn-g" onclick="loadHits()">↻ REFRESH</button>
    <button class="btn btn-d" onclick="clearHits()">✕ CLEAR</button>
  </div>
  <div id="scanList"><div class="no-hits">No signals detected yet</div></div>
</div>

<!-- SECTION: TEST & DIAG -->
<div class="section-hdr"><span>RF TEST &amp; DIAGNOSTICS</span></div>

<div class="card alert">
  <div class="ct"><span class="ct-dot"></span>RF TEST</div>
  <div class="btn-row" style="margin-bottom:10px">
    <button class="btn btn-d" id="testTxBtn" onclick="sendTest()">
      <span class="tx-dot" id="txLed"></span>SEND TEST SOS
    </button>
    <button class="btn btn-c" id="testScanBtn" onclick="sendScan()">◈ SCAN NOW</button>
    <button class="btn btn-au" id="testAudioBtn" onclick="testAudio()">♫ TEST AUDIO</button>
  </div>
  <div id="testStatus" style="font-size:.68rem;color:var(--dim);min-height:18px"></div>
</div>

<div class="card">
  <div class="ct"><span class="ct-dot"></span>DEVICE STATUS</div>
  <div class="stat-grid" id="statusGrid">
    <div class="stat-item"><div class="stat-lbl">BOOT CYCLES</div><div class="stat-val" id="st-boot">--</div></div>
    <div class="stat-item"><div class="stat-lbl">TX CYCLES</div><div class="stat-val" id="st-tx">--</div></div>
    <div class="stat-item"><div class="stat-lbl">SCAN CYCLES</div><div class="stat-val" id="st-scan">--</div></div>
    <div class="stat-item"><div class="stat-lbl">HITS LOGGED</div><div class="stat-val ok" id="st-hits">--</div></div>
    <div class="stat-item"><div class="stat-lbl">FREE HEAP</div><div class="stat-val" id="st-heap">--</div></div>
    <div class="stat-item"><div class="stat-lbl">OLED</div><div class="stat-val" id="st-oled">--</div></div>
  </div>
  <button class="btn btn-c" style="margin-top:10px;width:100%" onclick="loadStatus()">↻ REFRESH</button>
</div>

<!-- SMART OPTIONS -->
<div class="card">
  <div class="ct"><span class="ct-dot"></span>SMART OPTIONS</div>
  <div class="form-row">
    <label class="tog-wrap" for="autoSwitch">
      <div class="tog-cb"><input type="checkbox" id="autoSwitch"><span class="tog-slider"></span></div>
      <span class="tog-lbl">Auto-switch to BEACON if battery low</span>
    </label>
  </div>
</div>

<!-- EMERGENCY -->
<div class="section-hdr"><span>EMERGENCY</span></div>
<div class="card alert full">
  <div class="ct"><span class="ct-dot"></span>EMERGENCY OVERRIDE</div>
  <div style="font-size:.72rem;color:var(--dim);margin-bottom:14px">
    Forces maximum-power BEACON mode, disables sleep, sounds audio alarm, shows full OLED SOS screen.
    Equivalent to holding SW_MODE for 2 seconds. <strong style="color:var(--a2)">Use only in life-threatening emergency.</strong>
  </div>
  <button class="btn emg-btn" onclick="triggerEmergency()">⚡ ACTIVATE EMERGENCY SOS — MAX POWER</button>
</div>

<!-- DEBUG -->
<div class="section-hdr"><span>DEBUG</span></div>
<div class="card full">
  <div class="ct"><span class="ct-dot"></span>SERIAL DEBUG TERMINAL</div>
  <div class="dbg-box">
    Connect USB-C → Serial Monitor at <code>115200 baud</code>.<br>
    Linux/Mac: <code>picocom -b 115200 /dev/ttyUSB0</code> &nbsp;|&nbsp; Windows: <code>PuTTY COM port 115200</code><br>
    Tags: <code>[INFO]</code> <code>[OK]</code> <code>[WARN]</code> <code>[ERROR]</code> <code>[SCAN]</code> <code>[BTN]</code> <code>[OLED]</code> <code>[AUDIO]</code><br>
    Set <code>DEBUG_VERBOSE 1</code> for per-symbol Morse + RF register logs.
  </div>
</div>

<!-- SAVE -->
<div class="card full">
  <button class="btn btn-save" onclick="saveAll()">✔ SAVE ALL SETTINGS &amp; REBOOT TO SELECTED MODE</button>
</div>

</main>
<div id="toast"></div>

<script>
let freqs=[433.500], currentMode='BEACON';
const MORSE={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'};
function toMorse(t){return t.toUpperCase().split('').map(c=>c===' '?'/':MORSE[c]||'?').join(' ');}

async function loadAll(){
  try{
    const d=await(await fetch('/config')).json();
    freqs=d.freqs||[433.5]; currentMode=d.mode||'BEACON';
    document.getElementById('msgInput').value=d.message||'SOS';
    document.getElementById('wpmSlider').value=d.wpm||13;
    document.getElementById('pwrSlider').value=d.power||17;
    document.getElementById('sleepInput').value=d.sleep||10;
    document.getElementById('dwellInput').value=d.dwell||400;
    document.getElementById('rssiSlider').value=d.rssiThresh||-90;
    document.getElementById('repeatInput').value=d.repeat||1;
    document.getElementById('autoSwitch').checked=d.autoSwitch||false;
    document.getElementById('audioEnabled').checked=d.audioEnabled!==false;
    document.getElementById('volSlider').value=d.audioVolume||180;
    document.getElementById('oledEnabled').checked=d.oledEnabled!==false;
    document.getElementById('oledInvert').checked=d.oledInvert||false;
    updateWpm(d.wpm||13); updatePwr(d.power||17);
    updateRssi(d.rssiThresh||-90); updateVol(d.audioVolume||180);
    setModeUI(currentMode); renderFreqs(); updateMorse();
    loadStatus(); loadHits(); updateOledPreview();
  }catch(e){toast('Config load failed',true);}
}

function updateMorse(){document.getElementById('morsePreview').textContent=toMorse(document.getElementById('msgInput').value||'SOS');}
document.getElementById('msgInput').addEventListener('input',()=>{updateMorse();updateOledPreview();});
function updateWpm(v){document.getElementById('wpmVal').textContent=v+' WPM';document.getElementById('wpmSlider').value=v;}
function updatePwr(v){document.getElementById('pwrVal').textContent='+'+v+' dBm';document.getElementById('pwrSlider').value=v;}
function updateRssi(v){document.getElementById('rssiVal').textContent=v+' dBm';document.getElementById('rssiSlider').value=v;}
function updateVol(v){document.getElementById('volVal').textContent=v;document.getElementById('volSlider').value=v;}

function setModeUI(mode){
  currentMode=mode;
  const tog=document.getElementById('modeToggle'),knb=document.getElementById('modeKnob');
  const db=document.getElementById('modeDescBeacon'),ds=document.getElementById('modeDescSearch');
  const hm=document.getElementById('hdrMode');
  if(mode==='BEACON'){tog.className='toggle-switch beacon';knb.textContent='BEACON';db.style.display='';ds.style.display='none';hm.textContent='⬤ BEACON';hm.style.color='var(--a2)';}
  else{tog.className='toggle-switch search';knb.textContent='SEARCH';db.style.display='none';ds.style.display='';hm.textContent='◈ SEARCH';hm.style.color='var(--a1)';}
  updateOledPreview();
}
function toggleMode(){setModeUI(currentMode==='BEACON'?'SEARCH':'BEACON');}

// OLED preview simulator
function updateOledPreview(){
  const el=document.getElementById('oledPreview');
  const msg=document.getElementById('msgInput').value||'SOS';
  const freq=(freqs[0]||433.500).toFixed(3);
  const enabled=document.getElementById('oledEnabled').checked;
  if(!enabled){el.textContent='[OLED DISABLED]';el.className='oled-preview';return;}
  el.className='oled-preview active';
  if(currentMode==='BEACON'){
    el.innerHTML=`<span style="background:#fff;color:#000;padding:0 4px">▶ BEACON         BOOT#1</span>\n`+
      `<span style="color:#0ff">${freq} MHz</span>\n`+
      `FREQ 1/${freqs.length}\n`+
      `[████████████████    ] 80%\n`+
      `${msg.substring(0,16).padEnd(16)}\n`+
      `SLEEP 10s  ${document.getElementById('wpmSlider').value}WPM`;
  } else {
    el.innerHTML=`<span style="background:#fff;color:#000;padding:0 4px">◈ SEARCH        HITS:0</span>\n`+
      `<span style="color:#0ff">${freq} MHz</span>\n`+
      `RSSI: -92dBm  [██░░░░░░░]\n`+
      `SCANNING...\n`+
      `PASS#1 CH:1/${freqs.length}\n`+
      `♫ SILENT  THR:${document.getElementById('rssiSlider').value}`;
  }
}
document.getElementById('oledEnabled').addEventListener('change', updateOledPreview);
document.getElementById('wpmSlider').addEventListener('input', updateOledPreview);
document.getElementById('rssiSlider').addEventListener('input', updateOledPreview);

function bandLabel(f){f=parseFloat(f);if(f<174)return'2M VHF';if(f<470)return'70cm UHF';if(f<870)return'868MHz';if(f<930)return'915MHz';return'CUSTOM';}
function renderFreqs(){
  const ul=document.getElementById('freqList');ul.innerHTML='';
  freqs.forEach((f,i)=>{const li=document.createElement('li');
    li.innerHTML=`<span class="fv">${parseFloat(f).toFixed(3)} MHz</span><span class="fb">${bandLabel(f)}</span>${i===0?'<span class="fi">PRIMARY</span>':''}<button class="del" onclick="removeFreq(${i})">✕</button>`;
    ul.appendChild(li);});
  updateOledPreview();
}
function addFreq(){const v=parseFloat(document.getElementById('newFreq').value);if(isNaN(v)||v<137||v>1020){toast('Invalid freq',true);return;}if(freqs.length>=10){toast('Max 10',true);return;}if(freqs.some(f=>Math.abs(f-v)<0.001)){toast('Already added',true);return;}freqs.push(v);document.getElementById('newFreq').value='';renderFreqs();}
function removeFreq(i){if(freqs.length<=1){toast('Min 1 freq',true);return;}freqs.splice(i,1);renderFreqs();}

async function loadStatus(){
  try{const d=await(await fetch('/status')).json();
    document.getElementById('st-boot').textContent=d.bootCycle||0;
    document.getElementById('st-tx').textContent=d.txCycles||0;
    document.getElementById('st-scan').textContent=d.scanCycles||0;
    document.getElementById('st-hits').textContent=d.scanHits||0;
    document.getElementById('st-heap').textContent=((d.freeHeap||0)/1024).toFixed(1)+'KB';
    const oledEl=document.getElementById('st-oled');
    oledEl.textContent=d.oledOk?'OK':'MISSING';
    oledEl.className='stat-val '+(d.oledOk?'ok':'err');
  }catch(e){}
}

async function loadHits(){
  try{const d=await(await fetch('/hits')).json();const el=document.getElementById('scanList');
    if(!d.hits||!d.hits.length){el.innerHTML='<div class="no-hits">No signals detected yet</div>';return;}
    el.innerHTML=d.hits.map(h=>{const pct=Math.min(100,Math.max(0,((h.rssi+120)/80*100)));
      return`<div class="hit-row"><span class="hit-freq">${parseFloat(h.freq).toFixed(3)} MHz</span><div style="flex:1"><div style="display:flex;align-items:center;gap:6px"><div class="rssi-bar-bg"><div class="rssi-bar" style="width:${pct}%"></div></div><span class="rssi-val">${h.rssi} dBm</span></div></div><span class="hit-lbl ${h.label}">${h.label}</span></div>`;
    }).join('');
  }catch(e){}
}
async function clearHits(){try{await fetch('/clearhits');loadHits();toast('History cleared');}catch(e){}}

async function sendTest(){
  const btn=document.getElementById('testTxBtn'),led=document.getElementById('txLed'),st=document.getElementById('testStatus');
  btn.disabled=true;led.classList.add('on');st.textContent='TX SOS on '+parseFloat(freqs[0]).toFixed(3)+' MHz...';
  try{const r=await fetch('/test');st.textContent=r.ok?'✓ Test TX complete':'✕ TX failed';}catch(e){st.textContent='Error';}
  led.classList.remove('on');btn.disabled=false;
}
async function sendScan(){
  const btn=document.getElementById('testScanBtn'),st=document.getElementById('testStatus');
  btn.disabled=true;st.textContent='Scanning...';
  try{const r=await(await fetch('/testscan')).json();
    st.innerHTML=r.results.map(x=>`${parseFloat(x.freq).toFixed(3)}MHz:<strong style="color:${x.rssi>=-90?'var(--a3)':'var(--dim)'}">${x.rssi}dBm</strong>`).join(' | ');
    loadHits();}catch(e){st.textContent='Scan error.';}
  btn.disabled=false;
}
async function testAudio(){
  const btn=document.getElementById('testAudioBtn'),st=document.getElementById('testStatus');
  btn.disabled=true;st.textContent='Playing audio test sweep...';
  try{const r=await fetch('/testaudio');st.textContent=r.ok?'✓ Audio test sent — check headphones':'✕ Audio failed';}catch(e){st.textContent='Error';}
  btn.disabled=false;
}
async function testOled(){
  const st=document.getElementById('oledTestStatus');
  st.textContent='Testing OLED...';
  try{const r=await fetch('/testoled');st.textContent=r.ok?'✓ OLED test displayed':'✕ OLED not found';}catch(e){st.textContent='Error';}
}
async function triggerEmergency(){
  if(!confirm('ACTIVATE EMERGENCY SOS?\n\nMax power, no sleep, audio alarm, SOS screen.\nOnly confirm in a real emergency.'))return;
  try{const r=await fetch('/emergency');if(r.ok)toast('EMERGENCY SOS ACTIVATED');else toast('Failed',true);}catch(e){toast('Error',true);}
}
async function saveAll(){
  const p={message:document.getElementById('msgInput').value.trim()||'SOS',wpm:+document.getElementById('wpmSlider').value,power:+document.getElementById('pwrSlider').value,sleep:+document.getElementById('sleepInput').value,dwell:+document.getElementById('dwellInput').value,rssiThresh:+document.getElementById('rssiSlider').value,repeat:+document.getElementById('repeatInput').value,autoSwitch:document.getElementById('autoSwitch').checked,audioEnabled:document.getElementById('audioEnabled').checked,audioVolume:+document.getElementById('volSlider').value,oledEnabled:document.getElementById('oledEnabled').checked,oledInvert:document.getElementById('oledInvert').checked,mode:currentMode,freqs};
  try{const r=await fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)});
    if(r.ok){toast('✓ Saved! Rebooting...');setTimeout(()=>{document.body.innerHTML='<div style="color:var(--a1);font-family:Orbitron,sans-serif;text-align:center;padding:80px 20px;font-size:.95rem;letter-spacing:4px;background:#07090e;min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:20px">'+(currentMode==='BEACON'?'<div style="color:#ff3b3b">⬤ BEACON MODE ACTIVE</div>':'<div style="color:#00e5ff">◈ SEARCH MODE ACTIVE</div>')+'<div style="font-size:.65rem;color:#666">Close this page</div></div>';},1500);}
    else toast('Save failed',true);}catch(e){toast('Network error',true);}
}
function toast(msg,err=false){const t=document.getElementById('toast');t.textContent=msg;t.className='show'+(err?' err':'');setTimeout(()=>{t.className='';},3500);}
loadAll();
setInterval(loadStatus,10000);setInterval(loadHits,5000);
</script>
</body>
</html>
)HTMLDOC";

// =============================================================================
// WEB SERVER HANDLERS
// =============================================================================
void handleRoot()   { server.send_P(200, "text/html", DASHBOARD_HTML); }

void handleConfig() {
  String j = "{";
  j += "\"mode\":\""       + String(modeName(cfg.lastMode)) + "\",";
  j += "\"message\":\""   + String(cfg.message)            + "\",";
  j += "\"wpm\":"          + String(cfg.wpm)                + ",";
  j += "\"power\":"        + String(cfg.powerDbm)           + ",";
  j += "\"sleep\":"        + String(cfg.sleepSec)           + ",";
  j += "\"dwell\":"        + String(cfg.scanDwellMs)        + ",";
  j += "\"rssiThresh\":"   + String(cfg.rssiThreshold)      + ",";
  j += "\"repeat\":"       + String(cfg.repeatCount)        + ",";
  j += "\"autoSwitch\":"   + String(cfg.autoSwitch?"true":"false") + ",";
  j += "\"audioEnabled\":" + String(cfg.audioEnabled?"true":"false") + ",";
  j += "\"audioVolume\":"  + String(cfg.audioVolume)        + ",";
  j += "\"oledEnabled\":"  + String(cfg.oledEnabled?"true":"false") + ",";
  j += "\"oledInvert\":"   + String(cfg.oledInvert?"true":"false") + ",";
  j += "\"freqs\":[";
  for (int i = 0; i < cfg.freqCount; i++) {
    if (i) j += ",";
    j += String(cfg.freqs[i], 3);
  }
  j += "]}";
  server.send(200, "application/json", j);
}

void handleStatus() {
  char buf[300];
  snprintf(buf, sizeof(buf),
    "{\"bootCycle\":%lu,\"txCycles\":%lu,\"scanCycles\":%lu,"
    "\"scanHits\":%d,\"freeHeap\":%lu,\"uptime\":%lu,"
    "\"mode\":\"%s\",\"emergency\":%s,\"oledOk\":%s}",
    g_bootCycle, g_txCycles, g_scanCycles,
    g_scanHitCount, ESP.getFreeHeap(), millis(),
    modeName(g_currentMode),
    g_emergencyActive ? "true" : "false",
    g_oledOk          ? "true" : "false"
  );
  server.send(200, "application/json", buf);
}

void handleHits() {
  String j = "{\"hits\":[";
  for (int i = 0; i < g_scanHitCount; i++) {
    if (i) j += ",";
    j += "{\"freq\":" + String(g_scanHits[i].freq, 3)
      + ",\"rssi\":"   + String(g_scanHits[i].rssi)
      + ",\"label\":\"" + String(g_scanHits[i].label) + "\""
      + ",\"ts\":"     + String(g_scanHits[i].timestamp) + "}";
  }
  j += "]}";
  server.send(200, "application/json", j);
}

void handleClearHits() {
  g_scanHitCount = 0;
  memset(g_scanHits, 0, sizeof(g_scanHits));
  server.send(200, "text/plain", "OK");
}

void handleTest() {
  server.send(200, "text/plain", "OK");
  if (initRadioOOK(cfg.freqs[0], cfg.powerDbm)) {
    transmitMessage("SOS", 0, cfg.freqs[0], g_txCycles, false);
    radio.standby();
  }
}

void handleTestScan() {
  String j = "{\"results\":[";
  for (int i = 0; i < cfg.freqCount; i++) {
    ScanResult r = scanFrequency(cfg.freqs[i], i, 0);
    if (i) j += ",";
    j += "{\"freq\":" + String(r.freq, 3) + ",\"rssi\":" + String(r.rssi) + "}";
    if (r.detected) recordScanHit(r.freq, r.rssi);
  }
  j += "]}";
  server.send(200, "application/json", j);
}

void handleTestAudio() {
  server.send(200, "text/plain", "OK");
  if (cfg.audioEnabled) {
    LOG_AUDIO("Audio test: sweep + triple beep");
    audioSweep(400, 1800, 6);
    delay(100);
    audioTone(440,  100); delay(60);
    audioTone(880,  100); delay(60);
    audioTone(1760, 200);
  } else {
    LOG_WARN("Audio test requested but audio is disabled");
  }
}

void handleTestOled() {
  server.send(200, g_oledOk ? "text/plain" : "text/plain",
              g_oledOk ? "OK" : "OLED_NOT_FOUND");
  if (g_oledOk) {
    LOG_OLED("OLED test requested from dashboard");
    oledMessage("OLED TEST", "Display OK!", "v4.0 ready");
    delay(2000);
    oledConfig();  // go back to config screen
  }
}

void handleEmergency() {
  g_emergencyActive = true;
  g_currentMode     = MODE_EMERGENCY;
  cfg.lastMode      = MODE_EMERGENCY;
  saveConfig();
  server.send(200, "text/plain", "EMERGENCY_ACTIVE");
  if (cfg.audioEnabled) audioSweep(200, 2000, 4);
  delay(500);
  ESP.restart();
}

void handleSave() {
  if (!server.hasArg("plain")) { server.send(400, "text/plain", "No body"); return; }
  String body = server.arg("plain");
  LOG_CFG("Save body (%d B): %s", body.length(), body.c_str());

  StaticJsonDocument<1200> doc;
  if (deserializeJson(doc, body) != DeserializationError::Ok) {
    server.send(400, "text/plain", "JSON error"); return;
  }

  strlcpy(cfg.message, doc["message"] | DEFAULT_MESSAGE, MAX_MESSAGE_LEN);
  cfg.wpm           = constrain((int)doc["wpm"],        5,    30);
  cfg.powerDbm      = constrain((int)doc["power"],      2,    17);
  cfg.sleepSec      = constrain((uint32_t)doc["sleep"], 1UL,  3600UL);
  cfg.scanDwellMs   = constrain((int)doc["dwell"],      100,  5000);
  cfg.rssiThreshold = constrain((int)doc["rssiThresh"], -120, -40);
  cfg.repeatCount   = constrain((int)doc["repeat"],     1,    5);
  cfg.autoSwitch    = doc["autoSwitch"]  | false;
  cfg.audioEnabled  = doc["audioEnabled"]| true;
  cfg.audioVolume   = constrain((int)doc["audioVolume"],0,    255);
  cfg.oledEnabled   = doc["oledEnabled"] | true;
  cfg.oledInvert    = doc["oledInvert"]  | false;

  const char* modeStr = doc["mode"] | "BEACON";
  cfg.lastMode = (strcmp(modeStr, "SEARCH") == 0) ? MODE_SEARCH : MODE_BEACON;

  JsonArray arr = doc["freqs"].as<JsonArray>();
  cfg.freqCount = 0;
  for (float f : arr) {
    if (cfg.freqCount >= MAX_FREQUENCIES) break;
    if (f >= 137.0f && f <= 1020.0f) cfg.freqs[cfg.freqCount++] = f;
  }
  if (!cfg.freqCount) { cfg.freqs[0] = DEFAULT_FREQ_MHZ; cfg.freqCount = 1; }

  saveConfig();
  server.send(200, "text/plain", "OK");

  // Show saved screen on OLED
  oledMessage("CONFIG SAVED", "Rebooting...", modeName(cfg.lastMode));
  if (cfg.audioEnabled) audioSweep(600, 1200, 8);

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
  oledConfig();

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
  server.on("/testaudio", HTTP_GET,  handleTestAudio);
  server.on("/testoled",  HTTP_GET,  handleTestOled);
  server.on("/emergency", HTTP_GET,  handleEmergency);
  server.on("/save",      HTTP_POST, handleSave);
  server.onNotFound(handleNotFound);
  server.begin();

  LOG_OK("Config AP: \"%s\"  URL: http://%s", AP_SSID, AP_IP);

  uint32_t start = millis(), lastHb = 0;
  while (true) {
    dns.processNextRequest();
    server.handleClient();
    esp_task_wdt_reset();

    // LED + OLED heartbeat
    digitalWrite(PIN_LED_RED,  (millis() / 700) % 2);
    digitalWrite(PIN_LED_BLUE, (millis() / 1100) % 2);

    // Refresh OLED config screen every 5s to show client count
    if (millis() - g_lastOledUpdate > 5000) { oledConfig(); }

    if (millis() - lastHb > 30000) {
      LOG_INFO("Config AP: %lu s left | clients: %d",
               (CONFIG_AP_TIMEOUT - (millis()-start))/1000,
               WiFi.softAPgetStationNum());
      lastHb = millis();
    }
    if (g_configButtonPressed) {
      if (checkButton(PIN_SW_CONFIG, BTN_LONG_CFG_MS, g_configButtonPressed) == 1)
        printStatus();
    }
    if (millis() - start > CONFIG_AP_TIMEOUT) {
      LOG_WARN("Config timeout — rebooting");
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
  dbSep(emergency ? "EMERGENCY SOS" : "BEACON MODE");

  WiFi.mode(WIFI_OFF); btStop();
  LOG_INFO("WiFi+BT off");

  if (emergency && cfg.audioEnabled) {
    audioSweep(400, 2000, 5);  // startup alarm sweep
  }

  int8_t  txPower = emergency ? 17 : cfg.powerDbm;
  uint8_t repeats = emergency ? 3  : cfg.repeatCount;
  g_txCycles++;

  uint32_t cycleStart = millis();

  for (int fi = 0; fi < cfg.freqCount; fi++) {
    float freq = cfg.freqs[fi];
    dbSep();
    LOG_INFO("Hop %d/%d → %.3f MHz", fi+1, cfg.freqCount, freq);

    if (emergency) oledEmergency(freq, g_txCycles);

    if (!initRadioOOK(freq, txPower)) {
      LOG_ERR("Radio init FAILED — %.3f MHz skipped", freq);
      oledMessage("RADIO ERROR", "Skipping freq...");
      blinkLed(PIN_LED_RED, 6, 40);
      continue;
    }

    for (int r = 0; r < repeats; r++) {
      bool completed = transmitMessage(cfg.message, fi, freq, g_txCycles, !emergency);
      if (!completed && !emergency) { goto mode_switch; }
      if (r < repeats-1) delay(interChrMs() * 3);
    }

    radio.standby();
    delay(50);

    if (!emergency && g_modeButtonPressed) {
      uint8_t press = checkButton(PIN_SW_MODE, BTN_LONG_MODE_MS, g_modeButtonPressed);
      if (press == 2) { g_emergencyActive = true; g_currentMode = MODE_EMERGENCY; goto mode_switch; }
      if (press == 1) { g_currentMode = MODE_SEARCH; cfg.lastMode = MODE_SEARCH; saveConfig(); goto mode_switch; }
    }
    if (!emergency && g_configButtonPressed) {
      uint8_t press = checkButton(PIN_SW_CONFIG, BTN_LONG_CFG_MS, g_configButtonPressed);
      if (press == 2) goto enter_config;
      if (press == 1) printStatus();
    }
  }

  radio.sleep();
  LOG_OK("Beacon cycle done in %lu ms", millis() - cycleStart);

  if (emergency) {
    delay(300);
    runBeaconMode(true);  // loop forever in emergency
    return;
  }

  {
    // Show sleep countdown on OLED
    uint32_t sleepMs = cfg.sleepSec * 1000UL;
    uint32_t sleepStart = millis();
    while (millis() - sleepStart < sleepMs) {
      uint32_t remain = (sleepMs - (millis() - sleepStart)) / 1000;
      oledBeacon(0, cfg.freqs[0], 0, 1, g_txCycles, remain, false);
      if (g_modeButtonPressed || g_configButtonPressed) break;
      delay(100);
      esp_task_wdt_reset();
    }

    if (g_modeButtonPressed) {
      uint8_t press = checkButton(PIN_SW_MODE, BTN_LONG_MODE_MS, g_modeButtonPressed);
      if (press == 2) { g_emergencyActive = true; g_currentMode = MODE_EMERGENCY; goto mode_switch; }
      if (press == 1) { g_currentMode = MODE_SEARCH; cfg.lastMode = MODE_SEARCH; saveConfig(); goto mode_switch; }
    }
    if (g_configButtonPressed) {
      if (checkButton(PIN_SW_CONFIG, BTN_LONG_CFG_MS, g_configButtonPressed) == 2) goto enter_config;
    }

    LOG_INFO("Deep sleep %lu s...", cfg.sleepSec);
    if (g_oledOk && cfg.oledEnabled) oled.ssd1306_command(SSD1306_DISPLAYOFF);
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
  WiFi.mode(WIFI_OFF); btStop();

  if (cfg.audioEnabled) audioSweep(200, 1000, 8);  // startup rising sweep

  g_scanCycles++;
  uint32_t scanStart = millis();
  uint32_t passNum   = 0;
  uint16_t totalDetections = 0;

  LOG_SCAN("Dwell: %d ms/freq  Threshold: %d dBm  Audio: %s",
           cfg.scanDwellMs, cfg.rssiThreshold,
           cfg.audioEnabled ? "ON" : "OFF");

  while (true) {
    passNum++;
    bool anyDetected = false;

    for (int fi = 0; fi < cfg.freqCount; fi++) {
      // Button checks
      if (g_modeButtonPressed) {
        uint8_t press = checkButton(PIN_SW_MODE, BTN_LONG_MODE_MS, g_modeButtonPressed);
        if (press == 2) { g_emergencyActive = true; g_currentMode = MODE_EMERGENCY; goto search_exit; }
        if (press == 1) { g_currentMode = MODE_BEACON; cfg.lastMode = MODE_BEACON; saveConfig(); goto search_exit; }
      }
      if (g_configButtonPressed) {
        uint8_t press = checkButton(PIN_SW_CONFIG, BTN_LONG_CFG_MS, g_configButtonPressed);
        if (press == 2) { g_currentMode = MODE_CONFIG; goto search_exit; }
        if (press == 1) printStatus();
      }

      ScanResult result = scanFrequency(cfg.freqs[fi], fi, passNum);

      if (result.detected) {
        anyDetected = true;
        totalDetections++;
        recordScanHit(result.freq, result.rssi);
      }

      esp_task_wdt_reset();
    }

    // LED heartbeat
    digitalWrite(PIN_LED_BLUE, (millis() / (anyDetected ? 150 : 900)) % 2);

    LOG_SCAN("Pass#%lu done — %lu s elapsed | detections: %d",
             passNum, (millis()-scanStart)/1000, totalDetections);
  }

search_exit:
  ledsOff(); audioToneStop();
  LOG_MODE("Search exit → %s", modeName(g_currentMode));
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
  LOG_INFO("Boot cycle   : #%lu", g_bootCycle);
  LOG_INFO("Reset reason : %d",   (int)esp_reset_reason());
  LOG_INFO("Free heap    : %lu B", ESP.getFreeHeap());
  LOG_INFO("CPU freq     : %d MHz", getCpuFrequencyMhz());
  LOG_INFO("SDK version  : %s",   ESP.getSdkVersion());

  // ── GPIO init ────────────────────────────────────────────────────────────
  pinMode(PIN_LED_RED,   OUTPUT);
  pinMode(PIN_LED_BLUE,  OUTPUT);
  pinMode(PIN_SW_MODE,   INPUT_PULLUP);
  pinMode(PIN_SW_CONFIG, INPUT_PULLUP);
  ledsOff();

  // ── Interrupts ────────────────────────────────────────────────────────────
  attachInterrupt(digitalPinToInterrupt(PIN_SW_MODE),   isrModeButton,   FALLING);
  attachInterrupt(digitalPinToInterrupt(PIN_SW_CONFIG), isrConfigButton, FALLING);

  // ── Watchdog ──────────────────────────────────────────────────────────────
  esp_task_wdt_init(WDT_TIMEOUT_SEC, true);
  esp_task_wdt_add(NULL);
  LOG_INFO("Watchdog: %d s", WDT_TIMEOUT_SEC);

  // ── Audio init ────────────────────────────────────────────────────────────
  // LEDC channel setup — must happen before any audioTone() calls
  ledcSetup(AUDIO_CHANNEL, AUDIO_FREQ_HZ, AUDIO_RES_BITS);
  ledcAttachPin(PIN_AUDIO, AUDIO_CHANNEL);
  ledcWrite(AUDIO_CHANNEL, 0);  // ensure silence
  LOG_AUDIO("LEDC audio on GPIO%d ch%d @ %d Hz, %d-bit",
            PIN_AUDIO, AUDIO_CHANNEL, AUDIO_FREQ_HZ, AUDIO_RES_BITS);

  // ── OLED init ─────────────────────────────────────────────────────────────
  // Load config first (needed for oledEnabled/oledInvert)
  // Temporarily load just OLED prefs before full loadConfig
  prefs.begin("aegis", true);
  bool oledEn  = prefs.getBool("olen", true);
  bool oledInv = prefs.getBool("olinv", false);
  prefs.end();
  cfg.oledEnabled = oledEn;
  cfg.oledInvert  = oledInv;

  if (cfg.oledEnabled) {
    g_oledOk = initOled();
    if (g_oledOk) oledSplash();
  } else {
    LOG_OLED("OLED disabled by config");
  }

  // ── Startup blink + tone ──────────────────────────────────────────────────
  blinkLed(PIN_LED_RED,  1, 80);
  blinkLed(PIN_LED_BLUE, 1, 80);

  // ── Factory reset check ───────────────────────────────────────────────────
  if (digitalRead(PIN_SW_MODE) == LOW && digitalRead(PIN_SW_CONFIG) == LOW) {
    delay(BTN_DEBOUNCE_MS);
    uint32_t t = millis();
    while (digitalRead(PIN_SW_MODE) == LOW && digitalRead(PIN_SW_CONFIG) == LOW) {
      delay(100); esp_task_wdt_reset();
      // Count down on OLED
      uint32_t held = millis() - t;
      if (g_oledOk) {
        char buf[32];
        snprintf(buf, sizeof(buf), "Hold %lus more...", (BTN_FACTORY_MS - held) / 1000 + 1);
        oledMessage("FACTORY RESET", "Hold both buttons", buf, true);
      }
      if (held > BTN_FACTORY_MS) factoryReset();
    }
    LOG_BTN("Factory reset cancelled");
  }

  // ── Full config load ──────────────────────────────────────────────────────
  loadConfig();

  // Re-apply OLED invert after full config load
  if (g_oledOk) oled.invertDisplay(cfg.oledInvert);

  // ── Config mode at boot ───────────────────────────────────────────────────
  if (digitalRead(PIN_SW_CONFIG) == LOW) {
    delay(BTN_DEBOUNCE_MS);
    if (digitalRead(PIN_SW_CONFIG) == LOW) {
      uint32_t held = waitButtonRelease(PIN_SW_CONFIG);
      LOG_BTN("SW_CONFIG held %lu ms at boot", held);
      if (held >= BTN_LONG_CFG_MS) {
        g_currentMode = MODE_CONFIG;
        runConfigMode();
      }
    }
  }

  // ── Determine mode ────────────────────────────────────────────────────────
  if (g_emergencyActive) {
    LOG_WARN("Emergency flag in RTC — forcing EMERGENCY mode");
    g_currentMode = MODE_EMERGENCY;
  } else if (g_bootCycle == 1) {
    g_currentMode = cfg.lastMode;
  }

  LOG_MODE("Starting: %s", modeName(g_currentMode));
  ledModeIndicate(g_currentMode);

  // Boot audio feedback
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
      LOG_ERR("Unknown mode %d — defaulting to BEACON", g_currentMode);
      runBeaconMode(false);
  }
}

void loop() {
  LOG_ERR("loop() reached — heap=%lu — restarting", ESP.getFreeHeap());
  esp_task_wdt_reset();
  delay(2000);
  ESP.restart();
}

// =============================================================================
// END — AEGIS-BEACON v4.0
// https://github.com/Leo-Galli/Aegis-Beacon
// =============================================================================
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  SERIAL DEBUG REFERENCE                                                  │
// │  [INFO ] Normal operation    [OK   ] Success    [WARN ] Anomaly          │
// │  [ERROR] Hardware failure    [MODE ] Mode event  [SCAN ] RSSI result     │
// │  [BTN  ] Button event        [CFG  ] NVS save    [OLED ] Display event   │
// │  [AUDIO] Audio event         [MORSE] Per-symbol* [RF   ] RadioLib code*  │
// │          * = only with DEBUG_VERBOSE 1                                   │
// │                                                                          │
// │  TYPICAL HEALTHY BEACON BOOT:                                            │
// │   [OLED ] OLED ready — 128×64 SSD1306                                    │
// │   [AUDIO] LEDC audio on GPIO18 ch0 @ 40000 Hz, 8-bit                     │
// │   [MODE ] Starting: BEACON                                               │
// │   [OK   ] Radio OOK ready: 433.500 MHz @ 17 dBm                          │
// │   [INFO ] TX: "SOS" @ 13 WPM                                             │
// │   [OK   ] TX done: 3 chars in 2730 ms                                    │
// │   [INFO ] Deep sleep 10 s...                                             │
// │                                                                          │
// │  TYPICAL HEALTHY SEARCH BOOT:                                            │
// │   [SCAN ] Dwell: 400 ms/freq  Threshold: -90 dBm  Audio: ON              │
// │   [SCAN ] [0] 433.500 MHz  RSSI=-112 dBm  |..........| quiet             │
// │   [AUDIO] RSSI=-87 dBm → tone=1210 Hz                                    │
// │   [SCAN ] [1] 434.500 MHz  RSSI= -87 dBm  |#######....| *** SIGNAL ***   │
// │   [SCAN ] HIT: 434.500 MHz -87 dBm [MEDIUM] total=1                      │
// │                                                                          │
// │  COMMON ERRORS:                                                          │
// │   [ERROR] OLED SSD1306 init FAILED  → check I2C SDA=GPIO1 SCL=GPIO0      │
// │   [ERROR] Radio init FAILED: -2     → check SPI wiring                   │
// │   [WARN ] NVS empty                 → normal on first boot               │
// └──────────────────────────────────────────────────────────────────────────┘
