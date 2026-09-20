#!/usr/bin/env python3
"""
Régénère src/assets/plan.jpg à partir des coordonnées de l'institut.

La carte est une image fabriquée ici, une fois, et servie depuis le site.
Aucun iframe, aucun script tiers : le visiteur ne contacte ni Google ni
OpenStreetMap, ce qui évite le sujet RGPD des cartes embarquées.

    pip install Pillow
    python3 scripts/generate-map.py

Les tuiles viennent d'OpenStreetMap, dont la licence impose d'afficher
l'attribution — elle figure sous la carte dans Access.astro. Ne pas
transformer ce script en téléchargement de masse : la politique d'usage
des tuiles ne l'autorise pas.
"""
import io
import math
import time
import urllib.request

from PIL import Image, ImageDraw

# ── les trois lignes à régler ────────────────────────────────────────
LAT, LON = 48.858370, 2.294481             # doit rester en phase avec `geo` dans src/data/site.ts
ZOOM = 17                                  # 16 = le quartier, 17 = la rue, 18 = le pâté de maisons
UA = 'SiteInstitut/1.0 (carte statique fabriquée à la construction; contact@exemple.fr)'
# ─────────────────────────────────────────────────────────────────────
# Le User-Agent doit identifier le site : c'est une exigence de la
# politique d'usage des tuiles OpenStreetMap, pas une formalité.

WIDTH, HEIGHT = 1200, 620
OUT = 'src/assets/plan.jpg'
ACCENT = (154, 95, 62)                     # --accent-ink de src/styles/theme.css


def to_pixels(lat: float, lon: float, zoom: int) -> tuple[float, float]:
    """Projection Web Mercator, en pixels absolus au niveau de zoom donné."""
    n = 2**zoom
    x = (lon + 180.0) / 360.0 * n
    r = math.radians(lat)
    y = (1.0 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2.0 * n
    return x * 256, y * 256


def main() -> None:
    cx, cy = to_pixels(LAT, LON, ZOOM)
    left, top = cx - WIDTH / 2, cy - HEIGHT / 2
    tx0, ty0 = int(left // 256), int(top // 256)
    tx1, ty1 = int((left + WIDTH) // 256), int((top + HEIGHT) // 256)

    canvas = Image.new('RGB', ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256), (238, 238, 234))
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            url = f'https://tile.openstreetmap.org/{ZOOM}/{tx}/{ty}.png'
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=25) as resp:
                tile = Image.open(io.BytesIO(resp.read())).convert('RGB')
            canvas.paste(tile, ((tx - tx0) * 256, (ty - ty0) * 256))
            time.sleep(0.12)               # on reste poli avec le serveur de tuiles

    ox, oy = int(left - tx0 * 256), int(top - ty0 * 256)
    img = canvas.crop((ox, oy, ox + WIDTH, oy + HEIGHT))

    draw = ImageDraw.Draw(img, 'RGBA')
    mx, my = WIDTH // 2, HEIGHT // 2
    draw.ellipse([mx - 26, my - 26, mx + 26, my + 26], fill=(*ACCENT, 46))
    draw.ellipse([mx - 13, my - 13, mx + 13, my + 13], fill=(255, 255, 255, 255))
    draw.ellipse([mx - 9, my - 9, mx + 9, my + 9], fill=(*ACCENT, 255))

    img.save(OUT, 'JPEG', quality=84, optimize=True, progressive=True)
    print(f'{OUT} — {img.size[0]}×{img.size[1]}')


if __name__ == '__main__':
    main()
