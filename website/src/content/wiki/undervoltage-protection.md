---
title: Undervoltage Protection
description: "Protecting the cell from over-discharge: the firmware cutoff, the protected cell's circuit, and the thresholds that keep the battery alive."
---

# Undervoltage Protection

A lithium cell below about 2.5 V starts to be damaged: internal shorts form, capacity is lost, and in the worst case the cell becomes a fire risk when recharged. Undervoltage protection is the layered system that prevents this.

## The three layers

| Layer | What it does | Speed |
| --- | --- | --- |
| Firmware warning | Reports low battery, warns the user | Soft, advisory |
| Firmware cutoff | Refuses to transmit below the threshold | Seconds |
| Protected cell circuit | Physically disconnects the cell | Instant, hardware |

## The firmware's role

The battery monitor (see [Battery Monitor Details](battery-monitor-details)) drives two thresholds:

| Threshold | Behavior |
| --- | --- |
| Warning (~3.4 V) | OLED warning, shorter beaconing |
| Cutoff (~3.2 V) | TX disabled; the device still powers the display for configuration |

The firmware's cutoff is a software promise: it protects the cell only while the firmware runs.

## The protected cell's role

The protected cell (see [Protected vs Unprotected](protected-vs-unprotected)) is the hardware backstop: its circuit disconnects the cell at about 2.5 - 2.8 V, regardless of the firmware. This is the layer that protects the cell from the firmware's own bugs and from a flat battery left installed for months.

## The layered design

| Failure | Which layer catches it |
| --- | --- |
| Firmware crashes, device left on | Protected cell circuit |
| Cell aged, voltage collapses fast | Firmware warning first, cutoff second |
| User ignores all warnings | Protected cell circuit |

## The restart

After the protected cell disconnects, the beacon appears dead until the cell is recharged. That is correct behavior: a disconnected cell is a protected cell.

## Related pages

- [Protected vs Unprotected](protected-vs-unprotected) for the cells
- [Battery Monitor Details](battery-monitor-details) for the thresholds
- [Cell Discharge Curve](cell-discharge-curve) for the voltage shape