"""Regenerate apple-touch-icon.png and og-banner.png from public/banner.png.

Uses a centered "cover" crop (matching the target aspect ratio) followed by
high-quality Lanczos resampling, so both derived assets stay crisp and keep
the beacon device centered in frame.

Usage: python scripts/generate-og-assets.py
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent / "website" / "public"
SRC = ROOT / "banner.png"

TARGETS = [
    # (filename, width, height, horizontal focus 0..1, vertical focus 0..1)
    ("apple-touch-icon.png", 180, 180, 0.5, 0.42),
    ("og-banner.png", 1200, 630, 0.5, 0.45),
]


def cover_crop(img: Image.Image, target_w: int, target_h: int, fx: float, fy: float) -> Image.Image:
    src_w, src_h = img.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h

    if src_ratio > target_ratio:
        # Source is wider than target: crop width, keep full height.
        new_w = round(src_h * target_ratio)
        max_x = src_w - new_w
        x = round(max_x * fx)
        box = (x, 0, x + new_w, src_h)
    else:
        # Source is taller (relatively) than target: crop height, keep full width.
        new_h = round(src_w / target_ratio)
        max_y = src_h - new_h
        y = round(max_y * fy)
        box = (0, y, src_w, y + new_h)

    cropped = img.crop(box)
    return cropped.resize((target_w, target_h), Image.LANCZOS)


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Source banner not found: {SRC}")

    with Image.open(SRC) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        for filename, w, h, fx, fy in TARGETS:
            out = cover_crop(im, w, h, fx, fy)
            dest = ROOT / filename
            out.save(dest, format="PNG", optimize=True)
            print(f"wrote {dest} ({w}x{h})")


if __name__ == "__main__":
    main()
