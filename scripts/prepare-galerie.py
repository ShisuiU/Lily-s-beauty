#!/usr/bin/env python3
"""
Prépare les photos livrées par le salon : l'intérieur pour le ruban
d'accueil, les réalisations pour la section « Le travail ».

Les originaux sont les fichiers `brand/salon-*.jpg`, `brand/ongles-*.jpg`
et `brand/cils-*.jpg`. On les réduit à la taille utile — qui n'est pas la
même selon l'emploi, d'où le tableau plus bas — et on les réenregistre
**sans métadonnées**.

Ce second point n'est pas une précaution de principe. Un fichier sorti
d'un téléphone embarque le modèle de l'appareil, la date de la prise et,
selon les réglages, les coordonnées GPS du lieu. Ici la vérification n'a
trouvé aucun GPS, mais publier une photo sans la relire est une
habitude qui finit par coûter cher : Pillow n'écrit que ce qu'on lui
donne, et on ne lui donne que les pixels.

    pip install Pillow
    python3 scripts/prepare-galerie.py
"""
import pathlib

from PIL import Image

SOURCE = pathlib.Path('brand')
SORTIE = pathlib.Path('src/assets')
QUALITE = 84

# Largeur de sortie par famille, réglée sur la taille d'affichage la plus
# grande, doublée pour les écrans à forte densité.
FAMILLES = {
    'salon-*.jpg': 900,   # le ruban : 290 px au plus
    'ongles-*.jpg': 900,  # « Le travail » : 420 px au plus
    'cils-*.jpg': 900,
}

# On ne recadre pas. Une version de ce script rognait les bandes
# d'interface qu'Instagram laisse sur les captures — le compteur du
# carrousel, la barre de défilement. C'était à la fois fragile et de
# trop : le salon recadre lui-même ce qu'il veut recadrer, et il l'a
# fait. Le script réduit et retire les métadonnées, rien d'autre ; le
# cadrage d'affichage, carré, est l'affaire de la feuille de style.


def main() -> None:
    fichiers = [(f, largeur) for motif, largeur in FAMILLES.items()
                for f in sorted(SOURCE.glob(motif))]
    if not fichiers:
        raise SystemExit('aucune photo dans brand/')

    for f, LARGEUR in fichiers:
        im = Image.open(f)
        if im.width > LARGEUR:
            im = im.resize((LARGEUR, round(im.height * LARGEUR / im.width)), Image.LANCZOS)

        # Recréer l'image à partir des seuls pixels : rien ne suit.
        propre = Image.frombytes(im.mode, im.size, im.tobytes())

        out = SORTIE / f.name
        propre.save(out, 'JPEG', quality=QUALITE, optimize=True, progressive=True)
        reste = len(Image.open(out).getexif())
        print(f'{out}  {propre.width}x{propre.height}  '
              f'{out.stat().st_size / 1024:.0f} Ko  métadonnées restantes : {reste}')


if __name__ == '__main__':
    main()
