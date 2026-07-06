#!/usr/bin/env python3
"""
Generate placeholder images for the JRO Construction website framework.
Run once, then delete or keep for future updates.
"""

from PIL import Image, ImageDraw, ImageFont
import os

ASSETS = "assets"
GALLERY = os.path.join(ASSETS, "gallery")
LOGOS = os.path.join(ASSETS, "logos")

os.makedirs(GALLERY, exist_ok=True)
os.makedirs(LOGOS, exist_ok=True)

# Earth-tone palette
COLORS = {
    "cream": (250, 248, 245),
    "stone": (184, 169, 154),
    "sage": (107, 127, 89),
    "terracotta": (180, 95, 56),
    "charcoal": (44, 44, 44),
    "rust_dark": (143, 74, 42),
    "sand": (216, 201, 184),
}


def get_font(size):
    """Try a few common fonts, fall back to default."""
    candidates = [
        "arial.ttf",
        "Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ]
    for font_path in candidates:
        try:
            return ImageFont.truetype(font_path, size)
        except Exception:
            continue
    return ImageFont.load_default()


def draw_placeholder(path, width, height, bg, fg, label, sublabel=""):
    img = Image.new("RGB", (width, height), bg)
    draw = ImageDraw.Draw(img)

    # Decorative bar / accent
    bar_height = max(8, height // 40)
    draw.rectangle([0, height - bar_height, width, height], fill=COLORS["terracotta"])

    # Main label
    font_large = get_font(max(24, min(width, height) // 18))
    bbox = draw.textbbox((0, 0), label, font=font_large)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (width - text_w) // 2
    y = (height - text_h) // 2 - (20 if sublabel else 0)
    draw.text((x, y), label, fill=fg, font=font_large)

    # Sub-label
    if sublabel:
        font_small = get_font(max(14, min(width, height) // 35))
        bbox2 = draw.textbbox((0, 0), sublabel, font=font_small)
        text_w2 = bbox2[2] - bbox2[0]
        y2 = y + text_h + 16
        draw.text(((width - text_w2) // 2, y2), sublabel, fill=fg, font=font_small)

    # File extension decides format
    ext = os.path.splitext(path)[1].lower()
    if ext in (".jpg", ".jpeg"):
        img.save(path, "JPEG", quality=90)
    else:
        img.save(path, "PNG")
    print(f"Created {path}")


def draw_logo(path, width, height, dark=True):
    bg = COLORS["charcoal"] if dark else COLORS["cream"]
    fg = COLORS["cream"] if dark else COLORS["charcoal"]
    img = Image.new("RGB", (width, height), bg)
    draw = ImageDraw.Draw(img)

    font = get_font(max(20, width // 10))
    label = "JRO Construction"
    bbox = draw.textbbox((0, 0), label, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    # Accent block to left of text
    block_w = max(6, width // 30)
    x_text = (width - text_w) // 2 + block_w
    y_text = (height - text_h) // 2
    draw.rectangle([x_text - block_w - 8, y_text, x_text - 8, y_text + text_h], fill=COLORS["terracotta"])
    draw.text((x_text, y_text), label, fill=fg, font=font)

    img.save(path, "PNG")
    print(f"Created {path}")


def draw_favicon(path, size=64):
    img = Image.new("RGB", (size, size), COLORS["terracotta"])
    draw = ImageDraw.Draw(img)
    font = get_font(size // 2)
    label = "J"
    bbox = draw.textbbox((0, 0), label, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    draw.text(((size - text_w) // 2, (size - text_h) // 2 - 2), label, fill=COLORS["cream"], font=font)
    img.save(path, "PNG")
    print(f"Created {path}")


if __name__ == "__main__":
    # Hero
    draw_placeholder(
        os.path.join(ASSETS, "hero-placeholder.jpg"),
        1600, 900,
        COLORS["sand"], COLORS["charcoal"],
        "Hero Image Placeholder",
        "Replace with retaining wall or job-site photo"
    )

    # About section image
    draw_placeholder(
        os.path.join(GALLERY, "about-placeholder.jpg"),
        900, 700,
        COLORS["stone"], COLORS["cream"],
        "About Photo Placeholder",
        "Replace with crew or equipment photo"
    )

    # Project card images
    project_labels = [
        ("project-01-placeholder.jpg", "Retaining Wall Project"),
        ("project-02-placeholder.jpg", "Driveway / Earthworks"),
        ("project-03-placeholder.jpg", "Drainage & Landscaping"),
    ]
    for filename, label in project_labels:
        draw_placeholder(
            os.path.join(GALLERY, filename),
            800, 600,
            COLORS["sage"], COLORS["cream"],
            label,
            "Replace with project photo"
        )

    # Masonry gallery placeholders (mixed aspect ratios)
    gallery_specs = [
        ("placeholder-01.jpg", 800, 600, "Retaining wall construction"),
        ("placeholder-02.jpg", 600, 800, "Excavation work"),
        ("placeholder-03.jpg", 800, 500, "Drainage install"),
        ("placeholder-04.jpg", 700, 900, "Finish grading"),
        ("placeholder-05.jpg", 800, 600, "Driveway base"),
        ("placeholder-06.jpg", 600, 700, "Site clearing"),
        ("placeholder-07.jpg", 800, 500, "Irrigation install"),
        ("placeholder-08.jpg", 700, 800, "Final seeding"),
    ]
    colors = [COLORS["terracotta"], COLORS["sage"], COLORS["stone"], COLORS["rust_dark"]]
    for i, (filename, w, h, label) in enumerate(gallery_specs):
        bg = colors[i % len(colors)]
        draw_placeholder(
            os.path.join(GALLERY, filename),
            w, h,
            bg, COLORS["cream"],
            label,
            "Replace with project photo"
        )

    # Before / after placeholders
    draw_placeholder(
        os.path.join(GALLERY, "before-placeholder.jpg"),
        1200, 675,
        (139, 126, 116), COLORS["cream"],
        "BEFORE",
        "Replace with before photo"
    )
    draw_placeholder(
        os.path.join(GALLERY, "after-placeholder.jpg"),
        1200, 675,
        COLORS["sage"], COLORS["cream"],
        "AFTER",
        "Replace with after photo"
    )

    # Logo and favicon
    draw_logo(os.path.join(LOGOS, "logo-placeholder.png"), 320, 80, dark=True)
    draw_favicon(os.path.join(LOGOS, "favicon-placeholder.png"), 64)
