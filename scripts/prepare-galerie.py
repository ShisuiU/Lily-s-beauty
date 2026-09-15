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
FAMILLES = {
    'salon-*.jpg': dict(largeur=900),               # le ruban : 290 px au plus
    'ongles-*.jpg': dict(largeur=900, carre=True),  # « Le travail » : 420 px au plus
    'cils-*.jpg': dict(largeur=900, carre=True),
}

# Bandes d'interface à retirer, **fichier par fichier**. Certaines
# réalisations sont des captures d'Instagram et portent l'interface de
# l'application par-dessus la photo : le compteur du carrousel en haut à
# droite, la barre de défilement au bord droit. Ce n'est pas la photo,
# c'est l'écran du téléphone, et on le coupe — puis l'image est ramenée
# au carré par son centre.
#
# Au fichier et non à la famille, parce que la plupart n'ont rien à
# retirer : rogner les quatre pour le compte de l'une aurait mangé le
# cadrage des trois autres sans raison.
#
# Cette table se périme. Le salon peut renvoyer une photo qu'il a
# recadrée lui-même, sous le même nom : la ligne d'ici continuerait alors
# à rogner une bande qui n'existe plus. Le contrôle plus bas n'attrape
# que le fichier disparu, pas celui-là — d'où le rappel du rognage
# appliqué dans la sortie du script : une bande annoncée sur une photo
# qu'on vient de corriger se voit.
INTERFACE = {
    'ongles-3-french-couleurs.jpg': dict(rogne_droite=0.025),  # barre de défilement
    'cils-3.jpg': dict(rogne_droite=0.025),                    # barre de défilement
}


def main() -> None:
    fichiers = [(f, reglages) for motif, reglages in FAMILLES.items()
                for f in sorted(SOURCE.glob(motif))]
    inconnus = set(INTERFACE) - {f.name for f, _ in fichiers}
    if inconnus:
        raise SystemExit('INTERFACE vise des fichiers absents : ' + ', '.join(sorted(inconnus)))
    if not fichiers:
        raise SystemExit('aucune photo dans brand/')

    for f, famille in fichiers:
        reglages = {**famille, **INTERFACE.get(f.name, {})}
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
        coupes = ', '.join(
            f'{cote} {part:.0%}'
            for cote, part in (('haut', haut), ('droite', droite)) if part
        )
        print(f'{out}  {propre.width}x{propre.height}  '
              f'{out.stat().st_size / 1024:.0f} Ko  métadonnées restantes : {reste}'
              + (f'  ← rogné : {coupes}' if coupes else ''))


if __name__ == '__main__':
    main()
