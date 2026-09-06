# Aegis-Beacon Serial Bridge

One Python file that connects your beacon to the official website over USB.
It works on **Windows, macOS and Linux** with a single dependency.

## What it does

The firmware (`AegisBeacon.ino`) prints machine-readable `AEGIS:` lines on the
USB serial port. The bridge reads those lines and:

1. turns every GPS fix into a link with the coordinates, pointing at the
   official **Report Position** page:
   `https://aegis-beacon.vercel.app/report-position?lat=..&lng=..&freq=..`
2. if that page is already open in your browser, it detects it (the page polls
   the bridge's tiny loopback server) and streams new fixes into it live,
   without opening new tabs;
3. if the page is not open, it opens it for you, already filled in.

No API keys, no accounts, no cloud services. The bridge itself only listens on
`127.0.0.1`.

## Requirements

- Python 3.8 or newer
- `pyserial`

```bash
pip install pyserial
```

On Windows, use `py -m pip install pyserial` if `pip` is not on your PATH.

## Usage

```bash
# auto-detect the port and run
python bridge/aegis-serial-bridge.py

# Windows: if `python` is not found, use
py bridge/aegis-serial-bridge.py

# list detected serial ports
python bridge/aegis-serial-bridge.py --list

# pick the port explicitly
python bridge/aegis-serial-bridge.py --port COM3
python bridge/aegis-serial-bridge.py --port /dev/ttyUSB0
python bridge/aegis-serial-bridge.py --port /dev/cu.usbserial-0001
```

Useful options:

| Option          | Meaning                                                    |
| --------------- | ---------------------------------------------------------- |
| `--port X`      | Serial port (auto-detected if omitted)                     |
| `--baud N`      | Baud rate, default `115200`                                |
| `--http-port N` | Loopback port the page talks to, default `8765`            |
| `--site URL`    | Site base URL, default the official one                    |
| `--no-open`     | Never open a browser tab, only print links                 |
| `--verbose`     | Print all serial traffic                                   |

The beacon does not need a special mode: the serial commands and position
reporting work in BEACON, SEARCH and CONFIG modes.

## Setting the frequency over serial

While the bridge is running you can type commands in the same terminal that
runs it (they are forwarded to the device), or use any serial monitor:

```
FREQ 433.500        set the desired frequency (410-525 MHz), persisted
FREQ?               list configured frequencies
WPM 14              set Morse speed, persisted
MODE BEACON         switch mode (BEACON | SEARCH | CONFIG | EMERGENCY)
POS                 print the current GPS fix immediately
STATUS              print the current state
HELP                list commands
```

To listen to the Morse while homing in on a beacon, switch the receiving
device to SEARCH mode (`MODE SEARCH`) and follow the signal; the bridge keeps
streaming the position in the background.

## Phones

- **Android**: works with an OTG adapter and a USB-A/USB-C cable. Install
  Termux, then `pkg install python` and `pip install pyserial`. The port is
  usually `/dev/ttyACM0` or `/dev/ttyUSB0`:
  `python aegis-serial-bridge.py --port /dev/ttyACM0`.
- **iPhone / iPad**: a Python script cannot run on iOS, but you do not need
  one. The bridge on any other computer produces a normal link with the
  coordinates; open that link on the phone and the page fills itself in.

## Browser notes

- Chrome, Edge and Firefox allow the HTTPS page to talk to the loopback
  bridge, so live streaming works there.
- Safari blocks loopback HTTP from HTTPS pages. The page still works: the
  bridge opens it with the coordinates already in the URL, and the form is
  filled from the link. Only the live-update polling is unavailable.

## Protocol reference

The firmware prints (never ANSI-colored):

```
AEGIS:HELLO:ver=5.5;mode=BEACON;freq=433.500;wpm=12;vol=64
AEGIS:POS:lat=45.123456;lng=11.123456;alt=412;sats=8;freq=433.500;mode=BEACON;fix=1;age=87;payload=SOS PSN N4553 E01130
AEGIS:STATE:mode=SEARCH;freq=433.500;wpm=12;vol=64;heap=184320;boot=1;tx=0;hits=0;gpsFix=1;sats=8
AEGIS:FREQ:0=433.500
AEGIS:WPM:14
AEGIS:MODE:SEARCH
AEGIS:ERR:<message>
```

The `fix` and `age` fields flag whether a position is a fresh live fix (`fix=1`)
or a repeated last-known one (`fix=0`); the bridge only bumps its stream
counter when the position actually changes, so the website draws a track of
real movement rather than repeated dots.

The bridge only acts on `AEGIS:POS:` lines; everything else is printed for
visibility. See the wiki pages **Serial Bridge Guide** and **Serial Command
Protocol** for the full details.