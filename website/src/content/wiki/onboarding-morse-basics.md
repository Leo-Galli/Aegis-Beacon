---
title: Morse Code for Beginners
description: How Morse code works, how to read SOS, and the three letters that matter most for a rescue beacon.
---

# Morse Code for Beginners

You do not need to be a Morse expert to use or understand the beacon, but the three letters SOS are worth knowing by heart.

## The alphabet in dots and dashes

Morse encodes letters as patterns of short marks (dots) and long marks (dashes). The length of a dot is the base unit; a dash is three dots long.

| Letter | Code  |
|--------|-------|
| S      | ...   |
| O      | ---   |
| D      | -..   |
| E      | .     |
| N      | -.    |
| A      | .-    |

## SOS

SOS is `... --- ...` (three dots, three dashes, three dots). It is the universal distress signal, and it is the default message the beacon transmits.

## What the beacon sends

A full emergency payload looks like this in Morse:

```
SOS DE MARIO ROSSI PSN N4553 E01230
```

Which decodes to: *"SOS from Mario Rossi, position N 45.53 E 12.30"*. Each word is separated by a longer gap.

## Timing

The beacon uses standard PARIS timing: at 13 WPM, one dot is 92 ms. SOS takes about 2.7 seconds. The full payload with name and GPS takes about 45 seconds. This is why you are advised to keep names short: every extra letter costs airtime and battery.

## Learning to copy

You do not need to learn the whole alphabet to verify the beacon works. Listen for `... --- ...` on a receiver: if you can pick out SOS, the beacon is working. For deeper practice, see the Receiving & Morse section of this wiki.