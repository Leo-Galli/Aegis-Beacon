---
title: "Button Actions in CONFIG Mode"
description: "Exactly what each physical button does once the device is in the WiFi configuration portal"
---

# Button Actions in CONFIG Mode

## Overview

When the device is in CONFIG mode, the four buttons still work. They do not stop functioning just because the WiFi portal is open. Their behavior is the same as in normal operation, except that a few actions interact with the portal lifetime.

Understanding what each button does while CONFIG is open prevents accidental mode switches or saves while you are configuring.

## Button Summary

| Button | GPIO | Default action in CONFIG |
|---|---|---|
| SW_MODE | 33 | Same as normal: short toggles BEACON/SEARCH, long (2 s) triggers EMERGENCY |
| SW_SEL | 32 | Short toggles VOL/WPM target; long (3 s) re-opens or keeps the portal active; hold 1 s saves |
| SW_UP | 35 | Increment the currently selected parameter |
| SW_DN | 34 | Decrement the currently selected parameter |

## SW_MODE

SW_MODE keeps its normal behavior in CONFIG:

- Short press: toggle between BEACON and SEARCH mode.
- Long press (2 s): emergency activation.

If you accidentally toggle mode while configuring, the device leaves CONFIG and the portal closes. Re-enter CONFIG by holding SW_SEL for 3 s again.

Do not long-press SW_MODE by accident while the portal is open. Emergency mode is not something you want to trigger from a mis-press during configuration.

## SW_SEL

SW_SEL in CONFIG has two relevant behaviors:

- Short press: toggle the VOL/WPM adjustment target, same as outside CONFIG. This selects whether the UP/DN buttons change volume or WPM.
- Long press (3 s): this is the gesture that enters CONFIG. While already in CONFIG, it can be used to keep the portal alive if the 5-minute auto-revert timer is about to expire.
- Hold 1 s: save current VOL and WPM to NVS. This is the quick-save gesture.

If you hold SW_SEL for 3 s again while in CONFIG, the portal stays active. This is useful if you are still configuring and the portal is close to timing out.

## SW_UP and SW_DN

SW_UP and SW_DN adjust the currently selected parameter live:

- When VOL is selected, SW_UP increases volume, SW_DN decreases it.
- When WPM is selected, SW_UP increases WPM, SW_DN decreases it.

The adjustment is live in the sense that the firmware updates the value immediately. It does not require a save to take effect for the current session, but to make it persist across reboots you must save.

Volume range: 0 to 255. WPM range: 5 to 40.

## Saving in CONFIG

Two ways to save:

- Use the web dashboard Save button.
- Hold SW_SEL for about 1 second, which triggers a quick save of VOL and WPM.

The quick-save gesture is handy when you have adjusted volume or WPM with the buttons and do not want to open the dashboard. It persists those two values. It does not save the rest of the configuration — use the dashboard for the full save.

## Portal Lifetime and Buttons

CONFIG mode auto-reverts after 5 minutes without a client. Button activity does not count as a client. If you are using the buttons to adjust values but no device is connected to the portal, the portal still times out.

If you want the portal to stay open while you work with the buttons, keep a client connected, or periodically re-enter CONFIG with the 3-second SW_SEL hold.

## Avoid Accidental Mode Exit

The most common CONFIG mishap is accidentally toggling mode with SW_MODE. To reduce this:

- Treat SW_MODE as off-limits while CONFIG is open unless you intentionally want to leave it.
- Use SW_UP/DN and SW_SEL for configuration-only work.
- If you need to re-enter CONFIG after an accidental mode switch, hold SW_SEL for 3 s again.

## Related Pages

- [Button System Details](/wiki/button-system-details) — full button behavior in every mode.
- [WiFi Configuration Portal](/wiki/wifi-config-portal) — the dashboard walkthrough.
- [CONFIG Mode](/wiki/mode-config) — how CONFIG mode works and when it exits.
