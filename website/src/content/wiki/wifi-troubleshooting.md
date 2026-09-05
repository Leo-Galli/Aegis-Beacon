---
title: WiFi Troubleshooting
description: "Diagnosing the config portal: no access point, no page, weak signal, and the security checks before using WiFi in the field."
---

# WiFi Troubleshooting

The config portal is the beacon's most convenient configuration path and its most fragile one, because WiFi is the part of the ESP32 with the most environmental dependencies.

## The symptom map

| Symptom | Likely cause |
| --- | --- |
| No access point appears | WiFi not started: the beacon must be in the portal mode |
| AP appears, page won't load | Phone connected to the wrong network, or captive-portal detection |
| Page loads slowly | Radio interference; the ESP32's WiFi is single-band and crowded |
| Portal works, then disappears | Timeout: the portal closes after the idle period |
| Phone keeps dropping | Power saving on the phone, or the beacon's WiFi power setting low |

## Getting into the portal

The portal starts from CONFIG mode (see [WiFi Config Portal](wifi-config-portal)). Common miss: the beacon is in BEACON mode, where WiFi is off by design for battery and RF cleanliness. Switch to CONFIG first.

## The captive portal trap

Phones detect a WiFi network with no internet and open a captive-portal page, which is exactly what the beacon serves. If the phone shows "no internet", that is expected: navigate to the beacon's IP manually (printed on the OLED or in the AP name).

## Field reliability

WiFi in the field is a convenience, not a dependency:

- The serial port works identically (see [Serial Debug System](serial-debug-system)).
- The buttons configure everything the portal does (see [Mode Config](mode-config)).
- If the portal fails on the day, the other two paths still work.

## Security

The portal serves on the beacon's own network, never on an open shared network. It uses the passphrase you set (see [WiFi and Security](wifi-and-security)). Change the default passphrase before first field use.

## Related pages

- [WiFi Config Portal](wifi-config-portal) for the how-to
- [WiFi and Security](wifi-and-security) for the security model
- [Mode Config](mode-config) for the button-based alternative