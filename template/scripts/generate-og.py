#!/usr/bin/env python3
"""
Fabrique public/og.jpg, l'image qui s'affiche quand on partage le lien.

Sans elle, le lien envoyé par WhatsApp, posté en story ou collé sur
Facebook produit une vignette vide — ce qui, pour un institut qui circule
surtout de bouche à oreille, revient à perdre la première impression.

    pip install Pillow fonttools brotli
    python3 scripts/generate-og.py

Les polices sont converties à la volée depuis les .woff2 déjà présents
dans public/fonts/ : l'image emploie donc exactement les caractères du
site, sans fichier supplémentaire à maintenir.
"""
import io
import math
import pathlib

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

# ── à régler, en phase avec src/data/site.ts ────────────────────────
NOM = 'Votre Institut'
BASELINE = 'Ongles · Regard · Soins · Épilation'
ADRESSE = '12 Rue des Exemples, Votre Ville'
AVIS = None            # ex. '4,9 sur 5, 120 avis' — None retire la ligne
SOURCE = 'src/assets/hero-large.jpg'
# Mettre à False si la photo porte déjà l'enseigne : écrire le nom
# par-dessus reviendrait à le dire deux fois.
ECRIRE_LE_NOM = True
# ───────────────────────────────────────────────────────────────────

W, H = 1200, 630                       # format attendu par Facebook, WhatsApp, X, LinkedIn
FONTS = pathlib.Path('public/fonts')
OUT = 'public/og.jpg'
ACCENT = (192, 138, 107)               # --accent de src/styles/theme.css


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
    img = photo.crop((0, 0, W, H))

    # Voile en deux temps : léger en haut pour laisser voir la photo,
    # franc en bas pour porter le texte sans qu'il se batte avec elle.
    voile = Image.new('RGBA', (W, H))
    vd = ImageDraw.Draw(voile)
    for y in range(H):
        t = y / H
        a = 26 if t < 0.40 else int(26 + 214 * ((t - 0.40) / 0.60) ** 1.35)
        vd.line([(0, y), (W, y)], fill=(20, 17, 14, min(a, 236)))
    img = Image.alpha_composite(img.convert('RGBA'), voile).convert('RGB')

    d = ImageDraw.Draw(img)
    x0 = 84
    y = 300

    d.line([(x0, y), (x0 + 72, y)], fill=ACCENT, width=2)
    y += 26

    if ECRIRE_LE_NOM:
        d.text((x0, y), NOM, font=charger('cormorant-garamond-400-lat', 86), fill=(255, 255, 255))
        y += 104

    d.text((x0, y), BASELINE, font=charger('instrument-sans-500-lat', 31), fill=(255, 255, 255))
    y += 52

    d.text((x0, y), ADRESSE, font=charger('instrument-sans-400-lat', 25), fill=(219, 212, 208))
    y += 50

    # La preuve sociale ferme l'image : c'est elle qui fait cliquer.
    if AVIS:
        for i in range(5):
            etoile(d, x0 + 10 + i * 26, y + 14, 10, ACCENT)
        d.text((x0 + 152, y), AVIS, font=charger('instrument-sans-500-lat', 24), fill=(240, 235, 232))

    img.save(OUT, 'JPEG', quality=86, optimize=True, progressive=True)
    ko = pathlib.Path(OUT).stat().st_size / 1024
    print(f'{OUT} — {W}×{H}, {ko:.0f} Ko')


if __name__ == '__main__':
    main()
