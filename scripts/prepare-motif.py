#!/usr/bin/env python3
"""
Prépare public/motif-lys.png, le rameau repris dans l'angle du bloc
« Prestations et tarifs ».

Le fichier fourni est déjà un PNG transparent au trait noir pur : rien à
détourer. Deux choses seulement.

Il est réduit — 620 px de large suffisent pour un décor affiché au plus
à 340 px, écrans à forte densité compris — et surtout il est réenregistré
en **niveaux de gris + alpha**, la forme portée par l'alpha.

C'est ce que lit un masque CSS. Le réflexe d'enregistrer la silhouette en
luminance produit une image opaque, donc un masque qui ne masque rien :
la page affiche un rectangle plein à la place du dessin. Le décor tirant
sa couleur de la feuille de style, les canaux de couleur du fichier ne
servent à rien et partent à zéro.

    pip install Pillow numpy
    python3 scripts/prepare-motif.py brand/motif-lys-original.png
"""
import pathlib
import sys

import numpy as np
from PIL import Image

OUT = pathlib.Path('public/motif-lys.png')
LARGEUR = 620


def main(src: str) -> None:
    im = Image.open(src).convert('RGBA')
    alpha = np.asarray(im)[:, :, 3]

    ys, xs = np.nonzero(alpha > 6)
    im = im.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))
    im = im.resize((LARGEUR, round(im.height * LARGEUR / im.width)), Image.LANCZOS)

    a = np.asarray(im)[:, :, 3]
    Image.fromarray(np.dstack([np.zeros_like(a), a]), 'LA').save(OUT, optimize=True)
    print(f'{OUT}  {im.width}x{im.height}  {OUT.stat().st_size / 1024:.0f} Ko')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
