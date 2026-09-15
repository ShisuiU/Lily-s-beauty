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
#
# `rogne_haut` et `rogne_droite` retirent une bande avant tout le reste.
# Les réalisations sont des captures d'Instagram et portent l'interface de
# l'application par-dessus la photo : le compteur du carrousel en haut à
# droite des ongles (« 1/3 », « 3/3 »), la barre de défilement au bord
# droit des cils. Ce n'est pas la photo, c'est l'écran du téléphone : on
# le coupe. L'image est ensuite ramenée au carré en prenant le centre de
# ce qui reste, pour que les huit gardent le même format.
FAMILLES = {
    'salon-*.jpg': dict(largeur=900),   # le ruban : 290 px au plus
    'ongles-*.jpg': dict(largeur=900, rogne_haut=0.09, carre=True),
    'cils-*.jpg': dict(largeur=900, rogne_droite=0.025, carre=True),
}


def main() -> None:
    fichiers = [(f, reglages) for motif, reglages in FAMILLES.items()
                for f in sorted(SOURCE.glob(motif))]
    if not fichiers:
        raise SystemExit('aucune photo dans brand/')

    for f, reglages in fichiers:
        im = Image.open(f)

        haut = reglages.get('rogne_haut', 0)
        droite = reglages.get('rogne_droite', 0)
        if haut or droite:
            im = im.crop((0, round(im.height * haut),
                          im.width - round(im.width * droite), im.height))
        if reglages.get('carre'):
            cote = min(im.width, im.height)
            gauche = (im.width - cote) // 2
            im = im.crop((gauche, 0, gauche + cote, cote))

        LARGEUR = reglages['largeur']
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
