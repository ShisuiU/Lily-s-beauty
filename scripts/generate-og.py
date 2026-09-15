#!/usr/bin/env python3
"""
Fabrique public/og.jpg, l'image qui s'affiche quand on partage le lien.

Sans elle, le lien envoyé par WhatsApp, posté en story ou collé sur
Facebook produit une vignette vide — ce qui, pour un salon qui circule
surtout de bouche à oreille, revient à perdre la première impression.

    pip install Pillow fonttools brotli
    python3 scripts/generate-og.py

Les polices sont converties à la volée depuis les .woff2 déjà présents
dans public/fonts/ : l'image emploie donc exactement les caractères du
site, sans fichier supplémentaire à maintenir.
"""
import io
import pathlib

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630                       # format attendu par Facebook, WhatsApp, X, LinkedIn
FONTS = pathlib.Path('public/fonts')
SOURCE = 'src/assets/salon-facade.jpg'
OUT = 'public/og.jpg'
ROSE = (196, 135, 158)


def charger(nom: str, taille: int) -> ImageFont.FreeTypeFont:
    """Ouvre une woff2 du dépôt comme police utilisable par Pillow."""
    f = TTFont(FONTS / f'{nom}.woff2')
    f.flavor = None
    buf = io.BytesIO()
    f.save(buf)
    buf.seek(0)
    return ImageFont.truetype(buf, taille)


def etoile(draw, cx, cy, r, fill):
    """Étoile tracée en polygone : aucune police latine ne porte le glyphe ★."""
    import math
    pts = []
    for i in range(10):
        a = math.radians(-90 + i * 36)
        d = r if i % 2 == 0 else r * 0.42
        pts.append((cx + d * math.cos(a), cy + d * math.sin(a)))
    draw.polygon(pts, fill=fill)


def main() -> None:
    photo = Image.open(SOURCE).convert('RGB')
    echelle = max(W / photo.width, H / photo.height)
    photo = photo.resize((round(photo.width * echelle), round(photo.height * echelle)), Image.LANCZOS)
    # Cadrage haut : l'enseigne occupe la moitié supérieure et donne le nom.
    # On n'écrit donc pas « Lily's Beauty » par-dessus — ce serait le dire deux fois.
    img = photo.crop((0, 0, W, H))

    # Voile en deux temps : léger en haut pour laisser l'enseigne lisible,
    # franc en bas pour porter le texte sur la vitrine.
    voile = Image.new('RGBA', (W, H))
    vd = ImageDraw.Draw(voile)
    for y in range(H):
        t = y / H
        a = 26 if t < 0.46 else int(26 + 214 * ((t - 0.46) / 0.54) ** 1.35)
        vd.line([(0, y), (W, y)], fill=(20, 17, 14, min(a, 236)))
    img = Image.alpha_composite(img.convert('RGBA'), voile).convert('RGB')

    d = ImageDraw.Draw(img)
    x0 = 84

    d.line([(x0, 404), (x0 + 72, 404)], fill=ROSE, width=2)

    d.text((x0, 432), 'Ongles · Beauté du visage · Épilation',
           font=charger('instrument-sans-500-lat', 33), fill=(255, 255, 255))

    d.text((x0, 484), "254 Rue de la République, Laudun-l'Ardoise",
           font=charger('instrument-sans-400-lat', 25), fill=(219, 212, 208))

    # La preuve sociale ferme l'image : c'est elle qui fait cliquer.
    for i in range(5):
        etoile(d, x0 + 10 + i * 26, 552, 10, ROSE)
    d.text((x0 + 152, 540), '4,99 sur 5, 130 avis vérifiés',
           font=charger('instrument-sans-500-lat', 24), fill=(240, 235, 232))

    img.save(OUT, 'JPEG', quality=86, optimize=True, progressive=True)
    ko = pathlib.Path(OUT).stat().st_size / 1024
    print(f'{OUT} — {W}×{H}, {ko:.0f} Ko')


if __name__ == '__main__':
    main()
