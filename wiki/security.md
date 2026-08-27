# Security & Legal

## RF Safety

**Warning:** Never transmit without a properly matched antenna or 50-ohm dummy load. Mismatched loads cause reflected power that can damage the SX1262 PA stage permanently.

- Maximum conducted output: +30 dBm (1W) at 433 MHz
- SAR exposure limit (ICNIRP): 0.08 W/kg averaged over 6 minutes
- Maintain 20 cm minimum distance from body during TX
- Disable TX when not in use for field deployment

## Legal Compliance

| Region | Regulation | Limit | Notes |
|--------|------------|-------|-------|
| EU (ETSI) | EN 300 220 | +14 dBm (25 mW) | LPD band 433 MHz, 1% duty cycle |
| US (FCC) | Part 15.247 | +30 dBm (1W) | ISM band 433 MHz, FHSS or digital modulation |
| Australia | ACMA LIPD-2015 | +14 dBm (25 mW) | LIPD class licence, 433 MHz ISM |
| Italy (PMR) | PMR446 | +10 dBm (10 mW) | 446 MHz, licence-free, 8 channels |

## Emergency Use Only

- Use only in genuine emergency situations or authorized testing
- Do not transmit on frequencies allocated to emergency services
- Coordinate with local SAR teams before field deployment
- Keep transmission time minimal to reduce interference

## License

This project is distributed under the MIT License. Source code, hardware schematics, and documentation are freely available. Commercial use is permitted with attribution.
