# Hardware Architecture

## RF Unit Hardware Architecture

The radio core couples the dual-core ESP32 microcontroller with the Semtech SX1262 long-range transceiver. This combination provides precise carrier generation and low power consumption during deep sleep.

The Ebyte E22-400M30S is based on SX1262. It integrates a power amplifier (PA) and a low-noise receive amplifier (LNA) to extend the link budget beyond 15 km in clear line of sight.

Integrated TP4056 Li-ion charging circuit with voltage monitoring through a resistor divider connected to the ESP32 ADC pin for discharge telemetry.

## Components

| Component | Role | Price |
|-----------|------|-------|
| ESP32 DevKit V1 | Dual-core 240 MHz MCU, WiFi/BT, GPIO, ADC | ~$3 |
| Ebyte E22-400M30S | SX1262 LoRa transceiver, +30 dBm PA, 410-525 MHz | ~$5.50 |
| SSD1309 OLED | 2.42" 128x64 display, SW SPI via U8g2 | ~$3.50 |
| NEO-6M GPS | UART2 NMEA coordinates, optional module | ~$4.50 |
| TP4056 + 18650 | USB-C Li-ion charging, 3.7V 3000mAh cell | ~$2 |
| Passives + Enclosure | SMD components, Hammond 1593L, SMA, headers | ~$7 |

## Physical Characteristics

| Parameter | Value |
|-----------|-------|
| Antenna Connector | SMA female, 50 ohm |
| System Clock | 240 MHz (dual-core Xtensa LX6) |
| Deep-Sleep Current | ~10 uA |
| Enclosure | Hammond 1593L, 100x60x25mm aluminum |
| BEACON Runtime | ~65 hours on single 18650 |
