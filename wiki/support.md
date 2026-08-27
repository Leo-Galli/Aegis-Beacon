# Support

## Troubleshooting

| Issue | Solution |
|-------|----------|
| SX1262 not responding | Check SPI wiring (GPIO 5, 18, 19, 23). Verify BUSY (GPIO 21) and RESET (GPIO 14). |
| OLED blank screen | Check SW SPI pins (GPIO 4, 13, 15, 16, 17). Verify contrast in U8g2 constructor. |
| GPS no fix | Ensure outdoor view of sky. Check TX/RX swap (GPIO 12/22). Verify 3.3V power. |
| No audio output | Check DAC1 (GPIO 25) connection. Verify 100R resistor and 10uF coupling cap. |
| WiFi portal not accessible | Ensure CONFIG mode is active. Check SSID "AEGIS-BEACON". Try 192.168.4.1. |
| Device resets randomly | Check battery voltage. Verify 30s watchdog is not triggering due to firmware hang. |
| Low TX range | Verify antenna is connected. Check TX power setting. Ensure 50-ohm match. |
| Erratic GPS coordinates | Allow 5-15 minutes for cold start. Check antenna placement away from RF sections. |

## Getting Help

Open an issue on [GitHub Issues](https://github.com/Leo-Galli/Aegis-Beacon/issues).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](../LICENSE) for details.
