#!/usr/bin/env python3
"""Generate favicon files from images/favicon.webp for Thompson Valley Disposal."""

from PIL import Image
from pathlib import Path

SOURCE = Path("images/favicon.webp")
OUTPUT_DIR = Path("assets/logos")

SIZES = {
    "favicon-16.png": 16,
    "favicon-32.png": 32,
    "favicon-48.png": 48,
    "favicon-64.png": 64,
    "favicon-128.png": 128,
    "favicon-192.png": 192,
    "favicon-512.png": 512,
    "apple-touch-icon.png": 180,
}

ICO_SIZES = [16, 32, 48]


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with Image.open(SOURCE) as img:
        # Convert to RGBA if needed
        if img.mode != "RGBA":
            img = img.convert("RGBA")

        # Generate individual PNG favicons
        for filename, size in SIZES.items():
            favicon = img.copy()
            favicon = favicon.resize((size, size), Image.Resampling.LANCZOS)
            output_path = OUTPUT_DIR / filename
            favicon.save(output_path, "PNG", optimize=True)
            print(f"Generated {output_path}")

        # Generate multi-size ICO
        ico_images = []
        for size in ICO_SIZES:
            ico_img = img.copy()
            ico_img = ico_img.resize((size, size), Image.Resampling.LANCZOS)
            ico_images.append(ico_img)

        ico_path = OUTPUT_DIR / "favicon.ico"
        ico_images[0].save(
            ico_path,
            format="ICO",
            sizes=[(s, s) for s in ICO_SIZES],
            append_images=ico_images[1:],
        )
        print(f"Generated {ico_path}")

        # Also replace the generic favicon.png
        favicon_png = img.copy()
        favicon_png = favicon_png.resize((32, 32), Image.Resampling.LANCZOS)
        favicon_png.save(OUTPUT_DIR / "favicon.png", "PNG", optimize=True)
        print(f"Generated {OUTPUT_DIR / 'favicon.png'}")


if __name__ == "__main__":
    main()
