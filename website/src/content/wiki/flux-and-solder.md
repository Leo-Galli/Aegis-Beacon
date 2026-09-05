---
title: Flux and Solder
description: The types of solder and flux, when to add extra flux, and how to pick the right diameter.
---

# Flux and Solder

Solder and flux are the two consumables. Choosing the right ones avoids most joint-quality problems.

## Solder

- **Rosin-core solder** is the only kind to use. The core contains flux that cleans the joint as it melts.
- **Diameter**: 0.7-1.0 mm is the sweet spot for this project. 0.5 mm is good for fine work; 1.5 mm delivers too much solder for module pads.
- **Composition**:
  - 60/40 lead: easiest to work with, shinier joints. Wash hands after handling.
  - SAC305 lead-free: higher melting point, duller joints, but RoHS-compliant. Work slightly hotter.

## Flux

- Most joints only need the flux in the solder core.
- **Add extra flux** (a flux pen or paste) when:
  - Soldering to ground planes and large copper areas that suck heat.
  - Reworking or desoldering.
  - The joint looks dull and refuses to wet.
- **No-clean flux** can be left on the board; water-soluble flux must be rinsed. For a field device, no-clean is the practical choice.

## A note on lead

Lead solder is fine to use with basic precautions: work ventilated, wash hands after, and never eat at the bench. If you solder regularly, consider lead-free for peace of mind.

## How much to use

A correct joint uses the minimum solder that wets both surfaces and forms a concave fillet. If you cannot see the wire silhouette through the solder, you used too much.

## Testing a joint

A good solder joint conducts. If a device misbehaves, wiggle test suspect joints with insulated tweezers while watching the multimeter; a loose joint will flicker.