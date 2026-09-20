#!/usr/bin/env python3
"""
Prépare les photos livrées par l'institut.

Déposez les originaux dans `brand/` (le dossier n'est pas publié), puis :

    pip install Pillow
    python3 scripts/prepare-photos.py

Le script réduit chaque photo à la taille réellement utile — qui n'est
pas la même selon l'emploi, d'où le tableau plus bas — et la réenregistre
**sans métadonnées**.

Ce second point n'est pas une précaution de principe. Un fichier sorti
d'un téléphone embarque le modèle de l'appareil, la date de la prise et,
selon les réglages, les coordonnées GPS du lieu. Publier une photo sans
la relire est une habitude qui finit par coûter cher : Pillow n'écrit que
ce qu'on lui donne, et on ne lui donne que les pixels.

Les noms de sortie sont ceux qu'attend src/data/site.ts. Pour en ajouter
une, ajouter la ligne ici ET l'entrée dans site.ts — l'un sans l'autre
lève une erreur à la construction, ce qui est voulu : un fichier oublié
doit arrêter la construction, pas produire un trou dans la page.
"""
import pathlib

from PIL import Image, ImageOps

SOURCE = pathlib.Path('brand')
SORTIE = pathlib.Path('src/assets')

# (fichier d'origine, fichier produit, largeur, hauteur, qualité)
#
# Les deux photos du bandeau ne sont pas deux cadrages de la même : une
# bande large pour l'ordinateur, une verticale pour le téléphone. Voir le
# commentaire en tête de src/components/Hero.astro.
PHOTOS = [
    ('devanture.jpg',   'hero-large.jpg',        1600, 1100, 82),
    ('interieur.jpg',   'hero-portrait.jpg',     1200, 2132, 80),

    ('salon-1.jpg',     'salon-1.jpg',            900, 1600, 80),
    ('salon-2.jpg',     'salon-2.jpg',            900, 1600, 80),
    ('salon-3.jpg',     'salon-3.jpg',            900, 1600, 80),
    ('salon-4.jpg',     'salon-4.jpg',            900, 1600, 80),

    ('ongles-1.jpg',    'travail-ongles-1.jpg',  1290, 1290, 80),
    ('ongles-2.jpg',    'travail-ongles-2.jpg',  1290, 1290, 80),
    ('ongles-3.jpg',    'travail-ongles-3.jpg',  1290, 1290, 80),
    ('ongles-4.jpg',    'travail-ongles-4.jpg',  1290, 1290, 80),
    ('regard-1.jpg',    'travail-regard-1.jpg',  1290, 1290, 80),
    ('regard-2.jpg',    'travail-regard-2.jpg',  1290, 1290, 80),
    ('regard-3.jpg',    'travail-regard-3.jpg',  1290, 1290, 80),
    ('regard-4.jpg',    'travail-regard-4.jpg',  1290, 1290, 80),
]


def prepare(src: pathlib.Path, dst: pathlib.Path, w: int, h: int, q: int) -> None:
    img = Image.open(src)
    # `exif_transpose` d'abord : une photo prise à la verticale est
    # souvent enregistrée à plat, avec une balise qui dit « tourne-moi ».
    # En effaçant les métadonnées sans cela, on l'enregistrerait couchée.
    img = ImageOps.exif_transpose(img).convert('RGB')
    # Recadrage centré au bon rapport, puis réduction.
    img = ImageOps.fit(img, (w, h), Image.LANCZOS, centering=(0.5, 0.42))
    propre = Image.new('RGB', img.size)      # aucun EXIF ne suit
    propre.putdata(list(img.getdata()))
    propre.save(dst, 'JPEG', quality=q, optimize=True, progressive=True)
    ko = dst.stat().st_size / 1024
    print(f'{dst} — {w}×{h}, {ko:.0f} Ko')


def main() -> None:
    SORTIE.mkdir(parents=True, exist_ok=True)
    manquantes = []
    for nom, sortie, w, h, q in PHOTOS:
        src = SOURCE / nom
        if not src.exists():
            manquantes.append(nom)
            continue
        prepare(src, SORTIE / sortie, w, h, q)
    if manquantes:
        print('\nPas trouvé dans brand/ (l’image d’exemple reste en place) :')
        for nom in manquantes:
            print(f'  · {nom}')


if __name__ == '__main__':
    main()
