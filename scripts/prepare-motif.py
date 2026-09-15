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

La troisième, c'est le **halo**. Un fragment prélevé au rectangle dans un
dessin d'un seul tenant est coupé quelque part, et une coupe franche se
voit : elle passe au milieu d'un pétale et le dessin a l'air cassé. La
fleur est donc détourée par un halo — pleine au centre, éteinte avant le
bord — si bien que la fleur reste entière et que ce sont la tige et les
feuilles qui se dissipent. Une tige qui s'efface se lit comme une tige
qui continue ; un pétale tranché, non.

Deux conditions pour que ça marche, et la seconde est vérifiée à la
sortie parce qu'elle avait été manquée une première fois :

  · le halo travaille sur le dessin **entier**, élargi d'une marge
    transparente. Découper d'abord puis fondre ensuite ne sert à rien :
    c'est la découpe qui tranche, et le fondu arrive trop tard ;
  · le dessin doit s'éteindre **avant** le bord du fichier. Le contrôle
    plus bas relit les quatre bords de chaque sortie et refuse d'écrire
    si l'encre y est encore visible. Le dessin d'origine, lui, ne touche
    pas son propre cadre : son encre s'arrête à 27 px du plus proche.

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
# jusqu'au rayon `plein`, éteint à partir de `nul`. Le centre est celui
# de la fleur, là où convergent les étamines ; `plein` couvre le pétale
# le plus long (365 px), `nul` laisse 180 px pour se dissiper.
DECOUPES = {
    # le rameau entier
    'motif-lys.png': dict(boite=None, largeur=620),
    # boutons et feuilles
    'motif-lys-branche.png': dict(boite=(500, 0, 1430, 430), largeur=560),
    # la fleur entière, dissipée dans sa tige
    'motif-lys-fleur.png': dict(boite=None, largeur=560, halo=(295, 740, 380, 560)),
}
SORTIE = pathlib.Path('public')

# Seuil de rognage. Bas pour un fragment au halo, dont la fin du dégradé
# est justement ce qui évite la coupe ; celui d'origine pour les autres,
# qui n'ont pas de dégradé à préserver.
SEUIL_HALO = 2
SEUIL_FRANC = 6

# Au-delà, l'encre sur un bord du fichier se voit comme un trait coupé.
# 6 sur 255, et le décor n'étant posé qu'à 10 % d'opacité, il en reste
# deux millièmes.
BORD_MAX = 8


def pose_halo(alpha: np.ndarray, reglage) -> np.ndarray:
    """Éteint le dessin autour d'un centre, sur un cadre élargi d'autant."""
    cx, cy, plein, nul = reglage
    marge = int(np.ceil(nul)) + 8
    h, w = alpha.shape
    large = np.zeros((h + 2 * marge, w + 2 * marge), np.float32)
    large[marge : marge + h, marge : marge + w] = alpha
    yy, xx = np.mgrid[-marge : h + marge, -marge : w + marge]
    return large * np.clip((nul - np.hypot(xx - cx, yy - cy)) / (nul - plein), 0, 1)


def bord_max(a: np.ndarray) -> float:
    return float(max(a[0].max(), a[-1].max(), a[:, 0].max(), a[:, -1].max()))


def main(src: str) -> None:
    source = Image.open(src).convert('RGBA')

    for nom, reglages in DECOUPES.items():
        boite = reglages['boite'] or (0, 0, source.width, source.height)
        a = np.asarray(source.crop(boite))[:, :, 3].astype(np.float32)

        if 'halo' in reglages:
            a = pose_halo(a, reglages['halo'])

        # Rogner au dessin : une découpe laisse toujours du vide autour,
        # et une marge invisible fausserait le placement dans la page.
        seuil = SEUIL_HALO if 'halo' in reglages else SEUIL_FRANC
        ys, xs = np.nonzero(a > seuil)
        a = a[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]

        largeur = reglages['largeur']
        im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'L')
        im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)

        fini = np.asarray(im)
        if 'halo' in reglages and bord_max(fini) > BORD_MAX:
            raise SystemExit(
                f'{nom} : le dessin touche encore le bord du fichier '
                f'({bord_max(fini):.0f} sur 255, maximum admis {BORD_MAX}). '
                f'Élargir le halo, ou le recentrer.'
            )

        out = SORTIE / nom
        Image.fromarray(np.dstack([np.zeros_like(fini), fini]), 'LA').save(out, optimize=True)
        # Le bord n'est relevé que pour les fragments au halo. Les deux
        # autres sont posés en débordant volontairement de leur bloc :
        # chez eux, de l'encre au bord est le résultat cherché.
        controle = f'   bord {bord_max(fini):.0f}/255' if 'halo' in reglages else ''
        print(f'{out}  {im.width}x{im.height}  {out.stat().st_size / 1024:.0f} Ko'
              f'{controle}   -> aspect-ratio: {im.width} / {im.height}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
