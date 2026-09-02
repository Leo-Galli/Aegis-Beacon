---
title: "Glossary"
description: "Technical documentation for Glossary"
---

# Glossary

## A

### ADC (Analog-to-Digital Converter)
Converts analog voltage signals to digital values. The ESP32 has two 12-bit ADCs for battery monitoring and other analog inputs.

### AM (Amplitude Modulation)
Radio modulation where the amplitude of the carrier wave varies with the signal. Aegis-Beacon's CW signal is detectable by AM receivers.

### Antenna
Device for transmitting/receiving radio waves. The Aegis-Beacon uses a quarter-wave wire antenna (17.3cm for 433 MHz).

### Arduino
Open-source electronics platform based on easy-to-use hardware and software. Aegis-Beacon uses the Arduino framework on ESP32.

## B

### BOM (Bill of Materials)
Complete list of components needed to build a project. Aegis-Beacon BOM totals ~$23-28 USD.

### BUSY Pin
SX1262 status pin that indicates when the radio is processing. **Mandatory** connection to GPIO 21.

### Bootloader
Small program that runs at startup to load the main firmware. ESP32 bootloader handles USB-to-serial conversion.

## C

### Captive Portal
Web page that automatically opens when connecting to a WiFi network. Aegis-Beacon uses this for configuration access.

### CW (Continuous Wave)
Unmodulated radio wave used for Morse code transmission. Also called "carrier" when on/off keyed.

### CS (Chip Select)
SPI signal that activates a specific device. Active LOW -- pulled low to select the device.

## D

### DAC (Digital-to-Analog Converter)
Converts digital values to analog voltage. ESP32 has two 8-bit DACs. GPIO 25 (DAC1) is used for audio output.

### DDM (Degrees Decimal Minutes)
Coordinate format used in GPS transmissions. `N4553` = 45 53' N.

### Deep Sleep
Low-power mode where most ESP32 peripherals are shut down. Current consumption: ~10uA. Wakes via RTC timer.

### DIO1
SX1262 interrupt pin for TX/RX done and timeout events. Connected to GPIO 2.

## E

### E22-400M30S
Ebyte LoRa module based on SX1262. Includes onboard PA for +30 dBm output and SMA connector.

### EEPROM
Electrically Erasable Programmable Read-Only Memory. Used for persistent storage. Aegis-Beacon uses NVS instead.

## F

### FSK (Frequency Shift Keying)
Digital modulation where frequency shifts between two values. SX1262 supports FSK for data transmission.

### Firmware
Software programmed into the ESP32's flash memory. Controls all hardware peripherals and operating modes.

### Fix (GPS)
Successful determination of geographic coordinates. Requires signals from at least 3 satellites.

## G

### GPIO (General Purpose Input/Output)
Programmable pins on the ESP32 for digital I/O. 30 pins available on DevKit V1 (some input-only).

### GMRS (General Mobile Radio Service)
US radio service for short-distance communication. Requires FCC license. Frequencies: 462/467 MHz.

### GPS (Global Positioning System)
Satellite-based navigation system. Aegis-Beacon uses NEO-6M module for coordinate acquisition.

## H

### HDOP (Horizontal Dilution of Precision)
Measure of GPS accuracy. Lower values indicate better accuracy. HDOP < 2 is considered good.

### HTML (HyperText Markup Language)
Standard markup language for web pages. Used in CONFIG portal dashboard.

## I

### I2C (Inter-Integrated Circuit)
Two-wire serial communication protocol. Not used in Aegis-Beacon (OLED uses SPI instead).

### ISM (Industrial, Scientific, Medical)
Radio bands designated for unlicensed use. 433 MHz is an ISM band available worldwide.

## J

### JSON (JavaScript Object Notation)
Lightweight data interchange format. Used in CONFIG portal for settings serialization.

## L

### LEDC (LED Control)
ESP32 hardware for generating PWM signals. Used for precise Morse audio tone generation.

### LiFePO4
Lithium Iron Phosphate battery chemistry. Better cold weather performance than standard Li-ion.

### LoRa (Long Range)
Spread spectrum radio modulation technology. Provides long-range communication with low power.

## M

### MCU (Microcontroller Unit)
Integrated circuit containing a processor, memory, and I/O. ESP32 DevKit V1 uses dual-core 240 MHz MCU.

### Morse Code
Communication method using short and long signals (dots and dashes). Aegis-Beacon uses PARIS standard timing.

## N

### NSS (Negative Slave Select)
SX1262 chip select pin. Active LOW -- pulled low to communicate with the radio.

### NVS (Non-Volatile Storage)
ESP32 flash storage that persists across power cycles. Stores configuration settings.

## O

### OLED (Organic Light-Emitting Diode)
Display technology with self-emitting pixels. SSD1309 2.42" provides 128x64 resolution.

### OOK (On-Off Keying)
Simple modulation where carrier is turned on/off. CW mode is similar to OOK.

## P

### PARIS Standard
Morse timing calibration where "PARIS" = exactly 50 units. Ensures consistent WPM measurement.

### PA (Power Amplifier)
Circuit that boosts radio signal power. E22 module includes onboard PA for +30 dBm output.

### PlatformIO
Professional collaborative platform for IoT development. Recommended build system for Aegis-Beacon.

### PMR446
European private mobile radio service. 433 MHz band, 500mW max, no license required.

## R

### RadioLib
Arduino library for controlling radio modules. Supports SX1262 for Aegis-Beacon.

### RTC (Real-Time Clock)
Hardware clock that keeps time even when ESP32 is in deep sleep. Used for GPS fix timestamps.

### RSSI (Received Signal Strength Indicator)
Measure of received radio signal power. Used in SEARCH mode to detect beacon signals.

## S

### SAR (Search and Rescue)
Operations to locate and assist people in distress. Aegis-Beacon is designed for mountain SAR.

### SMA (SubMiniature version A)
Coaxial RF connector type. E22 module includes SMA for antenna connection.

### SPI (Serial Peripheral Interface)
High-speed synchronous serial communication. Used for SX1262 (VSPI) and OLED (software SPI).

### SX1262
Semtech LoRa transceiver IC. Provides CW and FSK modulation for emergency beacon.

## T

### TCXO (Temperature Compensated Crystal Oscillator)
Precision frequency reference that compensates for temperature changes. E22 module includes TCXO.

### TP4056
Linear lithium-ion battery charger IC. Handles USB-C charging with DW01A protection.

## U

### U8g2
Monochrome display library for Arduino. Supports SSD1309 with full-frame buffer.

### UART (Universal Asynchronous Receiver/Transmitter)
Serial communication interface. UART2 (GPIO 22/12) used for NEO-6M GPS.

### USB-C
Universal serial bus connector type. Used for programming and charging.

## V

### VBAT
Battery voltage. Measured via voltage divider on GPIO 36. Range: 3.0V (empty) to 4.2V (full).

### VSPI
ESP32's primary SPI bus. Used exclusively for SX1262 radio communication.

## W

### WDT (Watchdog Timer)
Hardware timer that resets the ESP32 if firmware hangs. 30-second timeout in Aegis-Beacon.

### WiFi AP (Access Point)
Wireless network created by ESP32 for configuration access. SSID: `AegisBeacon`, IP: `192.168.4.1`.

### WPM (Words Per Minute)
Morse code speed measurement. Default: 13 WPM. Adjustable from 5-40 WPM.
