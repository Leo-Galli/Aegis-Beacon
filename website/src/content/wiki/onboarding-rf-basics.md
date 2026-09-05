---
title: Radio Basics for Complete Beginners
description: What a radio signal is, what 433 MHz means, and why Morse still works when every digital network is gone.
---

# Radio Basics for Complete Beginners

If you have never thought about radio before, this page gives you the mental model you need. No math, just concepts.

## What a radio signal is

A radio signal is an electromagnetic wave, like light, but at a frequency your eyes cannot see. The beacon generates a wave at **433 MHz**, meaning the wave oscillates 433 million times per second.

## Frequency and wavelength

Frequency and wavelength are two ways of describing the same wave. Higher frequency = shorter wavelength. At 433 MHz the wavelength is about 69 cm. A quarter of that is about 17 cm, which is exactly why the beacon's antenna is a 17.3 cm wire.

## How the beacon transmits information

The beacon switches the carrier wave on and off in a pattern. Short on/off bursts are Morse dots, long bursts are dashes. A receiver that hears the carrier turning on and off can decode the pattern by ear or with software.

This is called **CW** (continuous wave) keying. It is the oldest digital transmission mode, and it is also the most robust: a simple carrier burst survives noise and weak signals far better than complex digital modulation.

## Why this matters for rescue

Every digital system needs a decoder, a protocol, and often a network. CW needs only a receiver and a human ear (or a cheap SDR). That is the whole design bet of Aegis-Beacon: a rescuer with any scanner or SDR can hear your SOS and coordinates without any proprietary equipment.

## Range in one sentence

Range depends on transmit power, antenna, and terrain. On flat line-of-sight terrain, the beacon reaches up to 15 km; in mountains with ridges in the way, expect much less, which is why beacon placement and search patterns matter.