---
title: "Hardware Components"
description: "Every part in the build: MCU, radio, display, GPS, battery and buttons, with the full BOM"
---

# Hardware Components

> [!INFO]
> **Total estimated cost: ~$23-28 USD** (AliExpress / LCSC pricing, 2025)

## Bill of Materials

| # | Ref | Component | Qty | Unit Cost | Notes |
|---|-----|-----------|-----|-----------|-------|
| 1 | U1 | **ESP32 DevKit V1** (30-pin) | 1 | $3.00 | Built-in USB + AMS1117-3.3 LDO |
| 2 | U2 | **Ebyte E22-400M30S** (SX1262) | 1 | $5.50 | 433 MHz, +30 dBm PA, SMA connector |
| 3 | U3 | **SSD1309 2.42" OLED** (7-pin SPI) | 1 | $3.50 | 128x64 display, do NOT confuse with 4-pin I2C |
| 4 | U4 | **NEO-6M GPS module** | 1 | $4.50 | UART 9600 baud, optional |
| 5 | B1 | **18650 Li-ion 3.7V** | 1 | $1.50 | LiFePO4 recommended for alpine |
| 6 | IC1 | **TP4056 USB-C module** | 1 | $0.50 | With DW01A protection |
| 7 | J1 | **3.5mm TRRS audio jack** | 1 | $0.30 | PJ-320A or CUI SJ-3523 |
| 8 | SW1 | **Tactile switch 6x6mm** (x4) | 4 | $0.20 | MODE, SEL, UP, DN |
| 9 | R3 | **100k 0805** (x2) | 2 | $0.02 | Battery voltage divider |
| 10 | C1 | **100uF 10V electrolytic** | 1 | $0.05 | Bulk cap on 3.3V rail |
| 11 | C2 | **100nF ceramic 0805** (x2) | 2 | $0.04 | Decoupling on 3.3V rail |
| 12 | C3 | **10uF 10V electrolytic** | 1 | $0.03 | AC-coupling cap on audio path |
| 13 | R1 | **330 Ohm 0805** (x2) | 2 | $0.02 | LED current limiters |
| 14 | R2 | **100 Ohm 0805** | 1 | $0.01 | Audio output series resistor |
| 15 | D1 | **Red LED 3mm** | 1 | $0.05 | BEACON mode indicator |
| 16 | D2 | **Blue LED 3mm** | 1 | $0.05 | SEARCH mode indicator |
| 17 | ANT | **17.3cm wire** (quarter-wave) | 1 | $0.00 | Or use E22 SMA connector |
| 18 | BOX | **Hammond 1593L** (100x60x25mm) | 1 | $3.00 | Or 3D printed PLA |

**Total: ~$23-28 USD**

> [!WARNING]
> **Cold weather:** Below -10C replace C1 electrolytic with a 47uF X7R ceramic. Use LiFePO4 cell for alpine deployments (rated to -30C).

## Component Details

### ESP32 DevKit V1

The main microcontroller. Dual-core 240 MHz Xtensa LX6 with 520 KB SRAM and 4 MB Flash. Includes built-in USB-to-serial converter and AMS1117-3.3V LDO regulator.

**Key Features:**
- 30 GPIO pins (some input-only)
- VSPI and HSPI buses
- 2x UART, 2x I2C, 2x ADC
- WiFi and Bluetooth (disabled in beacon mode)
- Deep sleep at 10 uA

### Ebyte E22-400M30S (SX1262)

The radio transceiver module. Based on Semtech SX1262 with onboard power amplifier for +30 dBm output at 433 MHz.

**Key Features:**
- CW and FSK modulation
- +30 dBm PA output
- -130 dBm receive sensitivity
- SMA antenna connector
- TCXO onboard for frequency stability

### SSD1309 2.42" OLED

Large monochrome display with 128x64 resolution. Connected via software SPI to avoid bus conflicts with the radio.

**Key Features:**
- 128x64 pixel resolution
- Software SPI (no bus sharing)
- U8g2 full-frame buffer
- Invert mode for sunlight readability

### NEO-6M GPS (Optional)

GPS module for real-time coordinate acquisition. Connects to UART2 at 9600 baud.

**Key Features:**
- NMEA 0183 sentence parsing
- Cold start: 5-15 minutes
- Ceramic patch antenna
- 3.3V power supply

> [!TIP]
> The GPS module is completely optional. The beacon works without GPS coordinates -- it just transmits `SOS` or `SOS DE [NAME]` as configured.

## Sourcing Guide

All components are commodity parts available worldwide. Typical sources:

| Part | Primary source | Backup source | Typical lead time |
|------|----------------|---------------|-------------------|
| ESP32 DevKit V1 | AliExpress | Local electronics store | 2-4 weeks |
| E22-400M30S | AliExpress | LCSC | 2-4 weeks |
| SSD1309 2.42" OLED | AliExpress | Amazon | 2-4 weeks |
| NEO-6M GPS | AliExpress | Amazon | 1-3 weeks |
| TP4056 board | AliExpress | Local | 1-2 weeks |
| 18650 cell | Local vape/electronics shop | Amazon | Same day |
| Passives + LEDs | LCSC | Local | 1-2 weeks |
| Hammond 1593L box | Mouser / DigiKey | Amazon | 2-5 days |

> [!NOTE]
> Prices in the BOM reflect AliExpress / LCSC 2025 pricing. Buying local is more expensive but faster and lets you verify parts before paying shipping.

### Buying Checklist

- Order two ESP32 boards -- one spare, they are cheap and occasionally DOA.
- Buy the **7-pin SPI** SSD1309, not the 4-pin I2C version; wiring differs.
- Prefer an E22-400M30S with an SMA connector so antenna upgrades are easy.
- For alpine use, buy a LiFePO4 18650 (rated to -30 C) instead of standard Li-ion.
- Add spare 6x6 mm tactile buttons and 330 Ohm resistors -- they are the most likely parts to lose while building.

### Verifying Parts on Arrival

1. Plug the ESP32 into USB: the onboard LED should blink or the serial monitor should respond at 115200 baud.
2. Check the E22 module for the SX1262 marking and confirm the SMA connector is firmly soldered.
3. Test the OLED by connecting it alone (3.3 V) -- a faint pattern or power-on line confirms it works.
4. Measure each 18650 cell: a fresh cell should read 3.9-4.2 V with no load.
5. Confirm the TP4056 charges: a drained cell plugged into USB-C should light the red charge LED.
