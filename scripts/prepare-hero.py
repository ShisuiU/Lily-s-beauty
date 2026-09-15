#!/usr/bin/env python3
"""
Prépare les deux photos du bandeau d'accueil — une par orientation.

Le bandeau ne montre pas la même chose selon la forme de l'écran, et ce
n'est pas qu'une affaire de cadrage : ce sont deux photos différentes.

  · Ordinateur — la devanture, recadrée en bande depuis
    `brand/devanture-large.jpg`. Le salon a fourni deux prises de la
    façade ; `devanture-serree.jpg` cadre l'enseigne et la porte,
    `devanture-large.jpg` recule et prend le mur de pierre, les volets,
    la porte voisine et le trottoir. C'est la seconde qui sert : la
    première donnait un gros plan dont on ne pouvait pas sortir, puisque
    le mur n'y est pas photographié.

    Une troisième prise, plus large encore, dort dans l'historique du
    dépôt (commit c793383). Elle est inutilisable : netteté mesurée à 69
    contre 1 034 pour celle-ci, quinze fois moins. C'est pour cette
    raison qu'elle avait été remplacée ; ne pas y revenir sans la
    mesurer.

    La hauteur de départ de la bande est le seul réglage à toucher pour
    recomposer : la monter fait entrer les volets, la descendre fait
    entrer le trottoir. On ne recadre qu'en réduisant — l'ancienne
    version paysage était un agrandissement 1,5× de la prise serrée, et
    ce grossissement est ce qui faisait baver les pleins de l'enseigne.

  · Téléphone — l'intérieur : le coin d'attente, le canapé sous la
    lampe. Le salon l'a demandé ainsi. C'est la même prise que la
    première photo du ruban, mais en pleine résolution : le ruban
    travaille sur des vignettes de 900 px, trop courtes pour un fond
    plein écran sur un téléphone à trois pixels physiques par pixel CSS.

    Le format d'origine (0,56) est plus large qu'un écran de téléphone
    (~0,46) : l'image est donc rognée sur les côtés, jamais en hauteur.
    Rien à régler.

    Attention : chaque photo a son propre profil de lumière, et le voile
    du bandeau se remesure à chaque changement. Celle-ci est sombre en
    haut (moyenne 70 sur le premier cinquième) mais claire en bas
    (101 sur le dernier), là justement où se pose le texte — l'inverse
    de la précédente.

    pip install Pillow
    python3 scripts/prepare-hero.py
"""
import pathlib

from PIL import Image

FACADE = pathlib.Path('brand/devanture-large.jpg')
CANAPE = pathlib.Path('brand/salon-1-attente.jpg')

PAYSAGE = pathlib.Path('src/assets/salon-facade.jpg')
PORTRAIT = pathlib.Path('src/assets/salon-attente-portrait.jpg')

RAPPORT = 1.31    # celui d'un écran d'ordinateur courant
DEPART = 430      # hauteur où commence la bande : le seul curseur de cadrage
LARGEUR = 1200    # plafond du portrait : 3× la largeur d'un téléphone courant
QUALITE = 88


def poids(chemin: pathlib.Path) -> str:
    return f'{chemin.stat().st_size / 1024:.0f} Ko'


def main() -> None:
    facade = Image.open(FACADE)
    w, h = facade.size
    bande = round(w / RAPPORT)
    depart = min(DEPART, h - bande)
    facade.crop((0, depart, w, depart + bande)).save(PAYSAGE, quality=QUALITE, optimize=True)
    print(f'{PAYSAGE}          {w}x{bande}  depuis y={depart}  {poids(PAYSAGE)}')

    poste = Image.open(CANAPE)
    if poste.width > LARGEUR:
        poste = poste.resize(
            (LARGEUR, round(poste.height * LARGEUR / poste.width)), Image.LANCZOS
        )
    # Réenregistrement complet, sans le bloc de métadonnées d'origine :
    # la prise vient d'un téléphone et portait date et coordonnées GPS.
    propre = Image.frombytes(poste.mode, poste.size, poste.tobytes())
    propre.save(PORTRAIT, quality=QUALITE, optimize=True)
    print(f'{PORTRAIT}  {propre.width}x{propre.height}  {poids(PORTRAIT)}')


if __name__ == '__main__':
    main()
