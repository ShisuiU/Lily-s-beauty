#!/usr/bin/env python3
"""
Prépare les photos de l'intérieur du salon pour la galerie d'accueil.

Les originaux sont les fichiers `brand/salon-*.jpg` livrés par le salon :
des photos de téléphone en 1450 x 2576. On les réduit à la taille utile
et on les réenregistre **sans métadonnées**.

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
LARGEUR = 900      # affichée à 280 px au plus, écrans à forte densité compris
QUALITE = 84


def main() -> None:
    fichiers = sorted(SOURCE.glob('salon-*.jpg'))
    if not fichiers:
        raise SystemExit('aucun brand/salon-*.jpg')

    for f in fichiers:
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
