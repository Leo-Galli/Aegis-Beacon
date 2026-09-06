---
title: "Termux: Serial Bridge on Android"
description: "Run the Aegis-Beacon serial bridge on an Android phone with Termux and an OTG adapter, and stream positions from the field."
---

# Termux: Serial Bridge on Android

The [serial bridge](serial-bridge-guide) is a single Python file, so it runs on Android too. With **Termux** (a terminal emulator) and an [OTG adapter](android-otg-guide), your phone becomes the bridge: it reads the beacon over USB and pushes positions to the Report Position page, exactly like a laptop.

## Install Termux

1. Install **Termux** from F-Droid (the Play Store version is outdated).
2. Open Termux and allow storage access when asked.

## Install Python and pyserial

```bash
pkg update && pkg upgrade
pkg install python
pip install pyserial
```

## Copy the bridge onto the phone

Option A, clone the repo (needs git and internet):

```bash
pkg install git
git clone https://github.com/Leo-Galli/Aegis-Beacon
cd Aegis-Beacon/bridge
```

Option B, transfer just the script: copy `aegis-serial-bridge.py` into the phone's Download folder and run it from there:

```bash
cd /sdcard/Download
python aegis-serial-bridge.py
```

## USB permission

Android must grant the terminal access to the USB serial device:

1. Plug in the OTG adapter and beacon.
2. When the "USB device connected" dialog appears, choose to open it in Termux (or grant permission in the notification).
3. If nothing happens, unplug and replug; some phones require the screen on.

## Find and use the port

```bash
ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null
```

Then run the bridge with the explicit port:

```bash
python aegis-serial-bridge.py --port /dev/ttyACM0
```

Or, if the phone maps it elsewhere:

```bash
python aegis-serial-bridge.py --port /dev/ttyUSB0
```

## Keep the phone awake

- Disable battery optimization for Termux (Settings, Apps, Termux, Battery).
- Keep the screen on, or run with `termux-wake-lock`.

## Caveats

- The bridge opens the phone's browser with the site; if the phone has no internet, it cannot open the page (positions are still parsed and printed, and you can use `--no-open` to just log).
- Phones that power the beacon from a weak OTG port may drop the link under load; keep the beacon on its own battery.

## Related

- [Android OTG Guide](android-otg-guide)
- [Bridge Troubleshooting](bridge-troubleshooting)
- [Serial Bridge Guide](serial-bridge-guide)