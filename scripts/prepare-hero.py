#!/usr/bin/env python3
"""
Prépare les deux photos du bandeau d'accueil depuis brand/devanture-large.jpg.

Le salon a fourni deux prises. `devanture-serree.jpg` cadre l'enseigne et
la porte ; `devanture-large.jpg` recule et prend le mur de pierre, les
volets, la porte voisine et le trottoir. C'est la seconde qui sert ici :
la première donnait un gros plan dont on ne pouvait pas sortir, puisque
le mur n'y est pas photographié.

Une troisième prise, plus large encore, dort dans l'historique du dépôt
(commit c793383). Elle est inutilisable : netteté mesurée à 69 contre
1 034 pour celle-ci, quinze fois moins. C'est pour cette raison qu'elle
avait été remplacée ; ne pas y revenir sans la mesurer.

Deux sorties, une par orientation, parce que le bon cadrage n'est pas le
même selon la forme de l'écran. Le téléphone reçoit la photo entière.
L'ordinateur reçoit une bande, dont la hauteur de départ est le seul
réglage à toucher pour recomposer : la monter fait entrer les volets, la
descendre fait entrer le trottoir.

L'ancienne version paysage était un recadrage agrandi 1,5 fois de la
prise serrée. Ce grossissement est ce qui faisait baver les pleins de
l'enseigne ; on n'agrandit plus rien ici.

    pip install Pillow
    python3 scripts/prepare-hero.py
"""
import pathlib

from PIL import Image

SOURCE = pathlib.Path('brand/devanture-large.jpg')
PAYSAGE = pathlib.Path('src/assets/salon-facade.jpg')
PORTRAIT = pathlib.Path('src/assets/salon-facade-portrait.jpg')

RAPPORT = 1.31   # celui d'un écran d'ordinateur courant
DEPART = 430     # hauteur où commence la bande : le seul curseur de cadrage
QUALITE = 88


def main() -> None:
    photo = Image.open(SOURCE)
    w, h = photo.size

    photo.save(PORTRAIT, quality=QUALITE, optimize=True)
    print(f'{PORTRAIT}  {w}x{h}  {PORTRAIT.stat().st_size / 1024:.0f} Ko')

    bande = round(w / RAPPORT)
    depart = min(DEPART, h - bande)
    photo.crop((0, depart, w, depart + bande)).save(PAYSAGE, quality=QUALITE, optimize=True)
    print(f'{PAYSAGE}   {w}x{bande}  depuis y={depart}  '
          f'{PAYSAGE.stat().st_size / 1024:.0f} Ko')


if __name__ == '__main__':
    main()
