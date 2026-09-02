---
title: "3D Printing the Enclosure"
description: "Guide to 3D printing and assembling the Aegis-Beacon enclosure"
order: 18
---

# 3D Printing the Enclosure

The Aegis-Beacon enclosure is designed for FDM 3D printing. This guide covers print settings, material selection, assembly, and weatherproofing.

## Design Files

The enclosure STL files are available in the `hardware/enclosure/` directory of the repository:

- `beacon-top.stl` -- Upper half with OLED window and button cutouts
- `beacon-bottom.stl` -- Lower half with battery compartment
- `beacon-lid.stl` -- Battery cover (snap-fit)
- `beacon-clip.stl` -- Belt/pocket clip accessory

## Recommended Print Settings

| Parameter | Value | Notes |
|-----------|-------|-------|
| Layer Height | 0.2 mm | Balance of speed and quality |
| Infill | 20% | Sufficient for non-structural parts |
| Walls | 3 perimeters | Strength for SMA connector mounting |
| Top/Bottom | 4 layers | Ensures rigidity |
| Supports | Yes (overhangs >45 deg) | Required for button holes and SMA cutout |
| Bed Adhesion | Brim (5mm) | Prevents warping on corners |

## Material Selection

### PLA (Polylactic Acid)

- **Pros:** Easy to print, biodegradable, low warping
- **Cons:** Low heat resistance (60C), UV degradation
- **Verdict:** Fine for indoor use and testing. Not recommended for permanent outdoor deployment.

### PETG (Polyethylene Terephthalate Glycol)

- **Pros:** Good heat resistance (80C), UV resistant, chemical resistant, slightly flexible
- **Cons:** Stringing, requires higher print temperature
- **Verdict:** **Recommended** for most deployments. Good balance of durability and printability.

### ABS (Acrylonitrile Butadiene Styrene)

- **Pros:** High heat resistance (100C), excellent impact resistance, acetone-smoothable
- **Cons:** Warps easily, requires enclosed printer, emits fumes
- **Verdict:** Best for hot climates or demanding environments.

### ASA (Acrylonitrile Styrene Acrylate)

- **Pros:** Like ABS but UV resistant, outdoor-safe
- **Cons:** Same printing challenges as ABS
- **Verdict:** Best choice for permanent outdoor installations.

> [!TIP]
> PETG is the recommended material for most users. It prints almost as easily as PLA, resists UV radiation, and withstands the temperature range expected in field deployment.

## Print Quality Checks

After printing, inspect each part:

1. **Layer adhesion:** Gently squeeze the part. Layers should not separate.
2. **Dimensional accuracy:** The battery compartment should hold an 18650 cell snugly without excessive force.
3. **Button holes:** Tactile switches should fit through the holes without modification.
4. **SMA connector hole:** The SMA bulkhead connector should thread through cleanly.
5. **OLED window:** If using the snap-in OLED, verify the window cutout matches the display dimensions.

## Assembly

### Required Tools

- Phillips screwdriver (PH1)
- Needle-nose pliers
- Flush cutters
- Deburring tool or file
- Isopropyl alcohol and cloth

### Step-by-Step Assembly

1. **Prepare the bottom half:**
   - Deburr all holes and edges.
   - Test-fit the 18650 battery holder.
   - Route the battery wires through the internal channel.

2. **Install the charging board:**
   - Mount the TP4056 board in the designated slot.
   - The USB-C port should align with the cutout in the enclosure wall.
   - Secure with a small drop of hot glue or M2 screws.

3. **Mount the main PCB:**
   - Insert standoffs into the bottom half.
   - Place the PCB and secure with M2.5 screws.
   - Verify SMA connector aligns with the enclosure hole.

4. **Connect the antenna:**
   - Thread the SMA bulkhead connector through the enclosure wall.
   - Secure with the SMA washer and nut (finger-tight plus 1/4 turn).

5. **Install the display:**
   - Connect the SSD1309 OLED to the PCB via I2C header.
   - Route the ribbon cable and secure with the display bracket.

6. **Connect the battery:**
   - Plug the JST connector into the PCB battery header.
   - Tuck excess wire into the battery compartment.

7. **Close the enclosure:**
   - Align top and bottom halves.
   - Secure with 4x M2.5 screws (included in BOM).
   - Do not overtighten -- the plastic threads can strip.

> [!WARNING]
> Before closing the enclosure, verify that no wires are pinched between the PCB and the enclosure wall. A pinched wire can cause a short circuit and damage the ESP32.

## Weatherproofing

For outdoor deployments, add weatherproofing:

1. Apply a thin bead of silicone sealant around the SMA connector entry point.
2. Install a rubber gasket between the top and bottom halves (cut from a sheet of 1mm silicone).
3. Apply conformal coating to the PCB (optional but recommended).
4. Use self-amalgamating tape on any external cable joints.

## Modifications

### External Antenna Mount

For fixed installations with a remote antenna:

1. Remove the SMA bulkhead from the antenna hole.
2. Install an SMA panel-mount connector.
3. Use a short SMA jumper cable to connect to an external antenna.
4. Seal the cable entry point with silicone.

### Belt Clip

The optional `beacon-clip.stl` part snaps onto the bottom half:

1. Print the clip in PETG or ABS (PLA will break under repeated stress).
2. Slide it onto the bottom half until it clicks.
3. The clip accommodates belts up to 50mm wide.

## Post-Processing

For a professional finish:

- **Sanding:** 400-600 grit for smooth surfaces.
- **Primer:** Spray filler primer fills layer lines.
- **Paint:** Use spray paint rated for the enclosure material.
- **Clear coat:** UV-resistant clear coat protects the finish.
- **Labels:** Use a label maker or engraved plate for the model name and frequency.
