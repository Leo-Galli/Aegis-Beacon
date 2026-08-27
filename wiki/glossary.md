# Glossary

| Term | Definition |
|------|------------|
| Aegis-Beacon | The complete emergency radio-location system comprising ESP32, SX1262, OLED, GPS, and supporting circuitry |
| BEACON Mode | Primary operating mode. Transmits SOS + callsign + GPS on all configured frequencies, then enters deep sleep |
| BOM | Bill of Materials. Complete list of components required to build the device |
| CW | Continuous Wave. Unmodulated carrier used for Morse code |
| DAC | Digital-to-Analog Converter. ESP32 internal 8-bit DAC on GPIO 25 |
| DDM | Degrees and Decimal Minutes. Coordinate format used in Morse payload |
| Deep Sleep | ESP32 ultra-low power mode (~10 uA). RTC domain active, all other peripherals powered down |
| DIO1 | Digital I/O pin 1 on SX1262. Configured as IRQ source for TX-done and timeout events |
| E22-400M30S | Ebyte LoRa module based on SX1262 with +30 dBm PA. 410-525 MHz |
| FSK | Frequency Shift Keying. Modulation used by SX1262 for CW keying |
| GPIO | General Purpose Input/Output. ESP32 pins configured for specific functions |
| GPS | Global Positioning System. Optional NEO-6M module provides NMEA coordinates |
| Link Budget | Total power available for communication: TX power + antenna gain - path loss - RX sensitivity |
| LoRa | Long Range radio technology by Semtech. Chirp spread spectrum modulation |
| NMEA | National Marine Electronics Association. Standard sentence format for GPS data |
| NVS | Non-Volatile Storage. ESP32 flash-based key-value store for persistent configuration |
| OLED | Organic Light-Emitting Diode display. SSD1309 2.42-inch 128x64 monochrome |
| PA | Power Amplifier. SX1262 internal PA provides up to +22 dBm. E22 external PA extends to +30 dBm |
| PARIS | Standard calibration word for Morse timing. 50 dot-lengths per word |
| PlatformIO | Professional collaborative platform for embedded development |
| RadioLib | Universal wireless communication library (v6.x). Drives SX1262 for LoRa/FSK/CW modes |
| RSSI | Received Signal Strength Indicator. Measured in dBm |
| SAR | Search and Rescue. Primary use case for Aegis-Beacon |
| SMA | SubMiniature version A. Coaxial RF connector. 50-ohm impedance |
| SPI | Serial Peripheral Interface. 4-wire synchronous bus |
| TCXO | Temperature Compensated Crystal Oscillator. SX1262 internal reference |
| TP4056 | Linear Li-ion charge controller IC. USB-C input, 4.2V output, 1A charge current |
| UART | Universal Asynchronous Receiver/Transmitter. Serial2 at 9600 baud for GPS |
| U8g2 | Monochrome graphics library for embedded systems. Drives SSD1309 OLED |
| VSPI | Virtual SPI. ESP32 hardware SPI bus 2 |
| WDT | Watchdog Timer. 30-second hardware timer. Resets ESP32 if firmware hangs |
| WPM | Words Per Minute. Morse code speed. Default: 15 WPM |
