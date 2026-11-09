"""Shrink photos uploaded through the admin screen so the site stays fast.

Phone photos are often 3-5 MB and 4000+ pixels wide. This resizes any photo
in the given folder whose longest side is over 1600 px (or that is over
700 KB) and re-saves it in place. Photos that are already small are left alone.
Runs automatically each time Netlify publishes the site (see netlify.toml).
"""
import os
import sys

from PIL import Image, ImageOps

MAX_SIDE = 1600
MAX_BYTES = 700_000

folder = sys.argv[1] if len(sys.argv) > 1 else "images/pieces"
changed = 0
for name in sorted(os.listdir(folder)):
    path = os.path.join(folder, name)
    ext = os.path.splitext(name)[1].lower()
    if ext not in (".jpg", ".jpeg", ".png", ".webp") or not os.path.isfile(path):
        continue
    with Image.open(path) as im:
        if max(im.size) <= MAX_SIDE and os.path.getsize(path) <= MAX_BYTES:
            continue
        im = ImageOps.exif_transpose(im)
        im.thumbnail((MAX_SIDE, MAX_SIDE))
        if ext in (".jpg", ".jpeg"):
            im.convert("RGB").save(path, "JPEG", quality=82, optimize=True, progressive=True)
        elif ext == ".png":
            im.save(path, "PNG", optimize=True)
        else:
            im.save(path, "WEBP", quality=82)
    changed += 1
    print(f"shrank {name}")
print(f"{changed} photo(s) resized")
