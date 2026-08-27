# GPIO Pin Mapping

Complete GPIO pin assignment for the ESP32 DevKit V1 (v5.4). All pins are active-low unless noted.

| GPIO | Function | Direction | Notes |
|------|----------|-----------|-------|
| GPIO 2 | SX1262 DIO1 | Input | TX/RX done + timeout IRQ |
| GPIO 4 | OLED RESET | Output | Hardware reset for SSD1309 |
| GPIO 5 | SX1262 NSS/CS | Output | VSPI chip select, active LOW |
| GPIO 12 | GPS TX out | Output | Serial2 TX to NEO-6M RX |
| GPIO 13 | OLED SDA (D1) | Output | Software SPI data |
| GPIO 14 | SX1262 RESET | Output | Active LOW hardware reset |
| GPIO 15 | OLED SCK (D0) | Output | Software SPI clock |
| GPIO 16 | OLED DC | Output | Data/Command select |
| GPIO 17 | OLED CS | Output | Software SPI chip select |
| GPIO 18 | VSPI SCK | Output | Hardware SPI clock to SX1262 |
| GPIO 19 | VSPI MISO | Input | Hardware SPI data from SX1262 |
| GPIO 21 | SX1262 BUSY | Input | MANDATORY - RadioLib polls this |
| GPIO 22 | GPS RX in | Input | Serial2 RX from NEO-6M TX |
| GPIO 23 | VSPI MOSI | Output | Hardware SPI data to SX1262 |
| GPIO 25 | DAC1 Audio | Output | Morse tone via 100R + 10uF |
| GPIO 26 | LED Blue | Output | SEARCH mode indicator |
| GPIO 27 | LED Red | Output | BEACON mode indicator |
| GPIO 32 | SW_SEL | Input | Short=VOL/WPM, Long=config |
| GPIO 33 | SW_MODE | Input | Short=toggle, Long=emergency |
| GPIO 34 | SW_DN | Input | Input-only, ext pullup needed |
| GPIO 35 | SW_UP | Input | Input-only, ext pullup needed |
| GPIO 36 | ADC Battery | Input | ADC1_CH0 SVP, input-only |
| GPIO 39 | TP4056 STDBY | Input | SVN, input-only, optional |

## Important Notes

- GPIO 34, 35, 36, 39 are input-only with no internal pull-up
- GPIO 21 (BUSY) is mandatory - firmware will hang without it
- Software SPI used for OLED to avoid VSPI bus conflicts
- GPIO 25 has native 8-bit DAC for audio output
