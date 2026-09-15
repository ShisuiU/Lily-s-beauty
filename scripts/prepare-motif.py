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

# Trois découpes du même dessin. Reprendre le motif entier à chaque bloc
# le transformerait en tampon ; on prélève donc des fragments, et chaque
# emploi change en plus de coin, d'échelle et de couleur. Les boîtes sont
# relevées sur la source, dont la structure est stable : la fleur occupe
# le bas-gauche, la tige monte vers le haut-droite.
DECOUPES = {
    'motif-lys.png':           (None,                 620),   # le rameau entier
    'motif-lys-branche.png':   ((500, 0, 1430, 430),  560),   # boutons et feuilles
    'motif-lys-fleur.png':     ((0, 470, 780, 1100),  520),   # la fleur seule
}
SORTIE = pathlib.Path('public')


def main(src: str) -> None:
    source = Image.open(src).convert('RGBA')

    for nom, (boite, largeur) in DECOUPES.items():
        im = source.crop(boite) if boite else source.copy()

        # Rogner au dessin : une découpe laisse toujours du vide autour,
        # et une marge invisible fausserait le placement dans la page.
        a = np.asarray(im)[:, :, 3]
        ys, xs = np.nonzero(a > 6)
        im = im.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))
        im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)

        a = np.asarray(im)[:, :, 3]
        out = SORTIE / nom
        Image.fromarray(np.dstack([np.zeros_like(a), a]), 'LA').save(out, optimize=True)
        print(f'{out}  {im.width}x{im.height}  {out.stat().st_size / 1024:.0f} Ko'
              f'   -> aspect-ratio: {im.width} / {im.height}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
