// =============================================================================
//  Aegis-Beacon v5.4 — types.h
//  All enum/struct types used as function parameters extracted here so that
//  Arduino IDE's automatic function-prototype generator sees them BEFORE it
//  emits the prototypes. Without this, the IDE inserts prototypes like:
//    AegisMode aegisModeName(AegisMode);
//  above the typedef, causing "not declared in this scope" errors.
//
//  Include this as the FIRST line of AegisBeacon.ino:
//    #include "types.h"
//  Place types.h in the same folder as AegisBeacon.ino.
// =============================================================================
#pragma once
#include <Arduino.h>

// ── Operating modes ──────────────────────────────────────────────────────────
typedef enum {
  MODE_BEACON    = 0,
  MODE_SEARCH    = 1,
  MODE_CONFIG    = 2,
  MODE_EMERGENCY = 3
} AegisMode;

// ── Scan history entry ───────────────────────────────────────────────────────
struct AegisScanHit {
  float    freq;
  int16_t  rssi;
  uint32_t timestamp;
  char     label[12];
};

// ── Single-frequency scan result ─────────────────────────────────────────────
struct AegisScanResult {
  float   freq;
  int16_t rssi;
  bool    detected;
};