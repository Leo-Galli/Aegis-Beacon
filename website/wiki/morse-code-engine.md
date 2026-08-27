# Morse Code Engine

## Overview

The Aegis-Beacon uses PARIS-standard Morse timing for precise, repeatable transmissions. The engine generates both RF carrier keying and audio click streams.

## PARIS Standard Timing

> [!INFO]
> The word "PARIS" = exactly 50 units, calibrating WPM precisely.

### Timing Constants

```
unit_ms = 1200 / WPM

DOT  = 1 unit
DASH = 3 units
intra-character gap = 1 unit
inter-character gap = 3 units
word gap            = 7 units
```

### Example at 13 WPM

| Element | Duration |
|---------|----------|
| Unit | 92 ms |
| Dot | 92 ms |
| Dash | 277 ms |
| Intra-character gap | 92 ms |
| Inter-character gap | 277 ms |
| Word gap | 646 ms |

## Supported Characters

### Letters

```
A .-      B -...    C -.-.    D -..     E .       F ..-.
G --.     H ....    I ..      J .---    K -.-     L .-..
M --      N -.      O ---     P .--.    Q --.-    R .-.
S ...     T -       U ..-     V ...-    W .--     X -..-
Y -.--    Z --..
```

### Numbers

```
0 -----   1 .----   2 ..---   3 ...--   4 ....-
5 .....   6 -....   7 --...   8 ---..   9 ----.
```

### Special Characters

```
/ (slash)  -..-.    . (period)  .-.-.-
```

## Payload Formats

### Configuration Options

| Config | Morse Message |
|--------|---------------|
| Base only | `SOS` |
| Name only | `SOS DE MARIO ROSSI` |
| GPS only | `SOS PSN N4553 E01230` |
| Name + GPS | `SOS DE MARIO ROSSI PSN N4553 E01230` |

### GPS Coordinate Encoding

Truncated DDM (Degrees + Decimal Minutes x 10):

- `N4553` = 45 53' N (lat 45.883)
- `E01230` = 12 30' E (lon 12.50)

> [!NOTE]
> This encoding is intentionally compact to minimize transmission time. Full decimal coordinates are logged to Serial.

### Payload Duration Examples (13 WPM)

| Payload | Duration |
|---------|----------|
| `SOS` | ~2.7 s |
| `SOS DE MARIO ROSSI` | ~15 s |
| `SOS PSN N4553 E01230` | ~18 s |
| `SOS DE MARIO ROSSI PSN N4553 E01230` | ~45 s |

## RF Transmission

### CW Keying

The SX1262 is configured for CW (Continuous Wave) mode:

```cpp
// Initialize for CW
radio.beginFSK();
radio.setFrequency(freq);
radio.setOutputPower(power);

// Transmit carrier
radio.transmitDirect();

// Key off
radio.standby();
```

### Timing Implementation

```cpp
void transmitDot() {
  radio.transmitDirect();
  delay(unitMs);
  radio.standby();
  delay(unitMs);
}

void transmitDash() {
  radio.transmitDirect();
  delay(unitMs * 3);
  radio.standby();
  delay(unitMs);
}
```

## Audio Output

### DAC1 Configuration

```cpp
// Initialize DAC
dacOutputEnable(DAC_CHANNEL_1);

// Mid-rail parking at silence
dacWrite(DAC_CHANNEL_1, 128);

// Tone generation via LEDC
ledcSetup(0, 40000, 8);
ledcAttachPin(25, 0);
```

### Click Stream

Each dot/dash produces a click through the earphone:

```cpp
void audioClick() {
  dacWrite(DAC_CHANNEL_1, 200); // Click on
  delay(5);
  dacWrite(DAC_CHANNEL_1, 128); // Return to mid-rail
}
```

> [!TIP]
> Mid-rail parking (dacWrite(128)) eliminates audible DC-click transients in headphones.

## Mid-TX Interrupt

SW_MODE aborts transmission immediately between characters. The interrupt flag is checked after every character -- maximum latency is one character duration.

```cpp
void transmitChar(char c) {
  // Check for abort
  if (abortFlag) return;
  
  // Transmit character pattern
  for (int bit : morseTable[c]) {
    if (bit == 1) transmitDot();
    else transmitDash();
  }
}
```

## WPM Adjustment

Live adjustment via UP/DN buttons:

| Button | Action |
|--------|--------|
| SW_UP | WPM +1 |
| SW_DN | WPM -1 |
| Hold SW_UP | Auto-repeat +1 every 150ms |
| Hold SW_DN | Auto-repeat -1 every 150ms |

> [!WARNING]
> Higher WPM reduces transmission time but may be harder to decode by less experienced operators. 13 WPM is recommended for emergency use.
