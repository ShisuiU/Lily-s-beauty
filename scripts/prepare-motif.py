#!/usr/bin/env python3
"""
Prépare les trois fragments de lys repris dans les angles des blocs.

Le fichier fourni est déjà un PNG transparent au trait noir pur : rien à
détourer. Trois choses seulement.

Il est réduit — 620 px de large suffisent pour un décor affiché au plus
à 340 px, écrans à forte densité compris — et surtout il est réenregistré
en **niveaux de gris + alpha**, la forme portée par l'alpha.

C'est ce que lit un masque CSS. Le réflexe d'enregistrer la silhouette en
luminance produit une image opaque, donc un masque qui ne masque rien :
la page affiche un rectangle plein à la place du dessin. Le décor tirant
sa couleur de la feuille de style, les canaux de couleur du fichier ne
servent à rien et partent à zéro.

La troisième, c'est le **fondu**. Un fragment prélevé dans un dessin d'un
seul tenant est forcément coupé quelque part, et une découpe franche se
voit : elle passe au milieu d'un pétale et le dessin a l'air cassé. La
fleur est donc détourée non pas par une boîte mais par un halo — pleine
au centre, éteinte avant le bord — si bien que la fleur est entière et
que ce sont la tige et les feuilles, elles, qui se dissipent. Une tige
qui s'efface se lit comme une tige qui continue ; un pétale tranché, non.

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
#
# `halo` : (cx, cy, plein, nul) en coordonnées de la source — opaque
# jusqu'au rayon `plein`, éteint à partir de `nul`.
# `bords` : largeur du fondu en pixels sur (haut, droite, bas, gauche),
# pour les extrémités que le halo laisse encore vives. Le dessin d'origine
# est lui-même coupé par son cadre en bas à gauche.
DECOUPES = {
    # le rameau entier
    'motif-lys.png': dict(boite=None, largeur=620),
    # boutons et feuilles
    'motif-lys-branche.png': dict(boite=(500, 0, 1430, 430), largeur=560),
    # la fleur entière, dissipée dans sa tige
    'motif-lys-fleur.png': dict(
        boite=(0, 300, 1050, 1101),
        largeur=560,
        halo=(310, 735, 360, 600),
        bords=(0, 0, 120, 110),
    ),
}
SORTIE = pathlib.Path('public')


def halo(alpha: np.ndarray, boite, reglage) -> np.ndarray:
    x0, y0 = boite[0], boite[1]
    cx, cy, plein, nul = reglage
    yy, xx = np.mgrid[y0 : y0 + alpha.shape[0], x0 : x0 + alpha.shape[1]]
    return alpha * np.clip((nul - np.hypot(xx - cx, yy - cy)) / (nul - plein), 0, 1)


def bords(alpha: np.ndarray, largeurs) -> np.ndarray:
    h, w = alpha.shape
    haut, droite, bas, gauche = largeurs
    if haut:
        alpha = alpha * np.clip(np.arange(h)[:, None] / haut, 0, 1)
    if bas:
        alpha = alpha * np.clip((h - 1 - np.arange(h))[:, None] / bas, 0, 1)
    if gauche:
        alpha = alpha * np.clip(np.arange(w)[None, :] / gauche, 0, 1)
    if droite:
        alpha = alpha * np.clip((w - 1 - np.arange(w))[None, :] / droite, 0, 1)
    return alpha


def main(src: str) -> None:
    source = Image.open(src).convert('RGBA')

    for nom, reglages in DECOUPES.items():
        boite = reglages['boite'] or (0, 0, source.width, source.height)
        a = np.asarray(source.crop(boite))[:, :, 3].astype(np.float32)

        if 'halo' in reglages:
            a = halo(a, boite, reglages['halo'])
        if 'bords' in reglages:
            a = bords(a, reglages['bords'])

        # Rogner au dessin : une découpe laisse toujours du vide autour,
        # et une marge invisible fausserait le placement dans la page. Le
        # seuil vaut 6 sur 255, et il rogne donc aussi la toute fin des
        # fondus — à 2 % du trait plein, et le décor n'étant affiché qu'à
        # 10 % d'opacité, il n'y restait de toute façon rien de visible.
        ys, xs = np.nonzero(a > 6)
        a = a[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]

        largeur = reglages['largeur']
        im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'L')
        im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)

        fini = np.asarray(im)
        out = SORTIE / nom
        Image.fromarray(np.dstack([np.zeros_like(fini), fini]), 'LA').save(out, optimize=True)
        print(f'{out}  {im.width}x{im.height}  {out.stat().st_size / 1024:.0f} Ko'
              f'   -> aspect-ratio: {im.width} / {im.height}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
