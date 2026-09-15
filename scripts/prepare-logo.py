#!/usr/bin/env python3
"""
Prépare src/assets/logo.png à partir du logo fourni par le salon.

Deux formes de livraison se présentent, et le script reconnaît laquelle
il a reçu. Un PNG **déjà transparent** n'est que rogné et réduit. Tout ce
qui suit ne concerne que l'autre cas.

Le fichier sur fond crème, sans transparence, avec
une ligne d'adresse sous l'enseigne. Trois transformations :

1. Le fond crème devient transparent, pour que le logo se pose aussi
   bien sur le blanc de la page que sur le crème d'un encart. Le fond du
   fichier source est uni à deux valeurs près (bruit mesuré : 2/255), on
   peut donc détourer sur la distance au fond sans toucher au dessin.

   L'opacité suit cette distance, mais la couleur du pixel est conservée
   telle quelle : la « démultiplication » habituelle suppose une encre
   sombre sur fond clair et transforme le rose tendre des lys en
   framboise saturée. Ici les lys gardent la teinte qu'on leur a donnée.

2. La ligne d'adresse est retirée. Elle porte « 30290 Rue de la
   République Laudun » : le code postal occupe la place du numéro, le
   254 manque et la commune est amputée de « l'Ardoise ». Le site
   affiche l'adresse en texte, correctement ; le logo n'a pas à la
   répéter, encore moins fausse. À faire corriger sur le fichier source.

3. Une bavure est effacée. Le fichier source porte, dans le blanc du
   « u » de Beauty, une goutte grise d'une trentaine de pixels : un
   reste de gomme floue, posée dans le vide, qui ne recouvre aucun
   trait. Elle se distingue du dessin sans ambiguïté — l'antialiasing
   des lettres ne s'éloigne jamais de plus de 2 ou 3 pixels de l'encre
   franche, la bavure s'en écarte de 14 — et c'est ce critère, non un
   cadre codé en dur, qui la désigne.

4. Le feuillage du coin haut-gauche est écarté : il déborde des bords
   dans le fichier d'origine, et un rameau coupé net au ras d'un bloc ne
   ressemble pas à une intention.

Les deux découpes sont **relevées sur le fichier**, pas codées en dur :
l'adresse est la dernière bande de pixels isolée par un grand blanc, le
feuillage est le groupe de colonnes que sépare du script la plus large
gouttière. Un logo re-livré avec d'autres marges passe donc sans
retoucher ce script. Il imprime ce qu'il a trouvé : vérifier ces
nombres après un changement de source.

    pip install Pillow numpy
    python3 scripts/prepare-logo.py brand/logo-original.png
"""
import pathlib
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, distance_transform_edt, label

OUT = pathlib.Path('src/assets/logo.png')
LARGEUR_MAX = 1300   # le pied de page l'affiche à 268 px au plus
ENCRE = 18          # distance au fond à partir de laquelle c'est du dessin
SEUIL, RAMPE = 3.0, 14.0
BLANC_ADRESSE = 60  # lignes vides qui détachent l'adresse de l'enseigne
GOUTTIERE = 60      # colonnes vides qui détachent le feuillage du script


def effacer_bavures(ecart, rose, franc, journal):
    """Retire les nappes floues posées loin de toute encre franche.

    Les lettres portent un liseré d'antialiasing et une ombre douce, tous
    deux collés au trait. Une gomme floue oubliée, elle, laisse une masse
    étendue dans le blanc. On sépare les deux à la distance : on repère
    les amas de pixels tièdes à plus de LOIN pixels de l'encre, puis on
    efface, autour de chaque amas seulement, ce qui dépasse COLLE pixels.

    Le rognage est borné à la boîte de l'amas : sans cela l'effacement
    remonterait le long des ombres et dépouillerait tout le mot.
    """
    LOIN, COLLE, AMAS, MARGE = 3.0, 2.0, 40, 12

    dist = distance_transform_edt(~(franc | rose))
    doux = (ecart > 6) & ~franc & ~rose
    amas, n = label(doux & (dist > LOIN))

    retrait = np.zeros_like(doux)
    for i in range(1, n + 1):
        ys, xs = np.nonzero(amas == i)
        if len(ys) < AMAS:
            continue
        t, b = max(0, ys.min() - MARGE), ys.max() + MARGE + 1
        l, r = max(0, xs.min() - MARGE), xs.max() + MARGE + 1
        fenetre = np.zeros_like(doux)
        fenetre[t:b, l:r] = True
        # la nappe entière : ce qui, dans la fenêtre, se tient à distance
        # de l'encre et communique avec l'amas repéré.
        candidat = doux & fenetre & (dist > COLLE)
        morceaux, _ = label(candidat)
        garder = set(morceaux[amas == i].ravel().tolist()) - {0}
        nappe = np.isin(morceaux, list(garder))
        retrait |= nappe
        journal.append(f'bavure x {xs.min()}-{xs.max()} y {ys.min()}-{ys.max()}, '
                       f'{int(nappe.sum())} px effacés')
    return retrait


def milieu(groupes_, i):
    """Milieu du blanc qui sépare le groupe i-1 du groupe i.

    On coupe au centre de la gouttière, jamais au bord d'une bande : la
    détection des bandes travaille sur l'encre franche, alors que le
    détourage descend jusqu'aux pixels à peine teintés. Couper au ras
    d'une bande laisse donc passer l'antialiasing du voisin — le haut des
    lettres de l'adresse, par exemple — ou ampute les déliés du script.
    """
    return (groupes_[i - 1][1] + groupes_[i][0]) // 2


def groupes(occupe, minimum):
    """Suites d'indices occupés, séparées par au moins `minimum` vides."""
    out, debut, vide = [], None, 0
    for i, n in enumerate(occupe):
        if n:
            if debut is None:
                debut = i
            vide = 0
        elif debut is not None:
            vide += 1
            if vide >= minimum:
                out.append((debut, i - vide))
                debut = None
    if debut is not None:
        out.append((debut, len(occupe) - 1))
    return out


def deja_detoure(src: str) -> bool:
    """Le fichier porte-t-il déjà sa transparence ?

    Les livraisons alternent entre deux formes : un aplat crème opaque,
    qu'il faut détourer, et un PNG déjà transparent. Confondre les deux
    est destructeur — sous les pixels transparents le RGB vaut souvent
    noir, si bien que la chaîne de détourage relèverait un « fond noir »
    et effacerait le dessin au lieu du vide.
    """
    im = Image.open(src)
    if im.mode not in ('RGBA', 'LA'):
        return False
    alpha = np.asarray(im.convert('RGBA'))[:, :, 3]
    return bool((alpha < 10).mean() > 0.2)


def reduire(im: Image.Image) -> Image.Image:
    if im.width <= LARGEUR_MAX:
        return im
    return im.resize((LARGEUR_MAX, round(im.height * LARGEUR_MAX / im.width)), Image.LANCZOS)


def enregistrer(im: Image.Image) -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    im.save(OUT, optimize=True)
    print(f'{OUT}  {im.width}x{im.height}  {OUT.stat().st_size / 1024:.0f} Ko')


def passer_tel_quel(src: str) -> None:
    """Rogner et réduire, rien de plus : le fichier est déjà propre."""
    im = Image.open(src).convert('RGBA')
    alpha = np.asarray(im)[:, :, 3]
    ys, xs = np.nonzero(alpha > 6)
    im = im.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))
    print('fichier déjà transparent : rognage et réduction seulement')
    enregistrer(reduire(im))


def main(src: str) -> None:
    if deja_detoure(src):
        return passer_tel_quel(src)

    rgb = np.asarray(Image.open(src).convert('RGB')).astype(np.float64)
    h, w, _ = rgb.shape

    # Le fond, relevé dans un coin plutôt que supposé.
    fond = np.median(rgb[h - 30:h - 2, w - 30:w - 2].reshape(-1, 3), axis=0)
    ecart = np.abs(rgb - fond).max(axis=2)
    dessin = ecart > ENCRE
    print(f'source {w}x{h}, fond rgb{tuple(int(c) for c in fond)}')

    # 1. L'adresse : dernière bande, si un vrai blanc la détache.
    bandes = groupes(dessin.any(axis=1), BLANC_ADRESSE)
    bas = milieu(bandes, len(bandes) - 1) if len(bandes) > 1 else h
    print(f'  bandes {bandes} -> on coupe sous y={bas}')

    # 2. Le feuillage : dans la moitié basse, là où le script est seul à
    #    gauche, c'est le groupe que la plus large gouttière précède.
    cols = dessin[int(bas * 0.45):bas].any(axis=0)
    cg = groupes(cols, GOUTTIERE)
    gauche = milieu(cg, 1) if len(cg) > 1 else 0
    print(f'  colonnes {cg} -> on coupe à gauche de x={gauche}')

    # 3. Le rameau se déploie vers la droite et dépasse cette coupe : il
    #    reste des feuilles au-dessus du script. Elles forment leur propre
    #    bande, que sépare un large blanc. Le script étant le plus haut de
    #    ce qui subsiste, on part de sa bande à lui.
    restant = groupes(dessin[:bas, gauche:].any(axis=1), BLANC_ADRESSE)
    plus_haute = max(range(len(restant)), key=lambda i: restant[i][1] - restant[i][0])
    haut = milieu(restant, plus_haute) if plus_haute else 0
    print(f'  bandes restantes {restant} -> on coupe au-dessus de y={haut}')

    # 4. Les bavures du fichier source, avant tout rognage : la mesure
    #    de distance a besoin du dessin entier autour d'elles.
    rose = (rgb[:, :, 0] - rgb[:, :, 1]) > 25
    journal = []
    bavure = effacer_bavures(ecart, rose, ecart >= 90, journal)
    for ligne in journal:
        print(f'  {ligne}')
    if not journal:
        print('  aucune bavure détectée')

    alpha = np.clip((ecart - SEUIL) / RAMPE, 0, 1)
    # Effacement adouci sur un pixel, pour ne pas substituer une arête
    # nette au flou qu'on retire.
    lisiere = binary_dilation(bavure) & ~bavure
    alpha[bavure] = 0
    alpha[lisiere] *= 0.5

    alpha = alpha[haut:bas, gauche:]
    rgb = rgb[haut:bas, gauche:]

    # Rogner au dessin, pour que la mise en page du site n'ait pas à
    # compenser une marge invisible.
    ys, xs = np.where(alpha > 0.06)
    t, b = ys.min(), ys.max() + 1
    l, r = xs.min(), xs.max() + 1
    rgb, alpha = rgb[t:b, l:r], alpha[t:b, l:r]

    # Sous les pixels transparents, le crème d'origine subsiste et gonfle
    # le fichier pour rien : PNG compresse par ligne, un aplat se répète
    # beaucoup mieux que du bruit.
    rgb[alpha == 0] = 0

    arr = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    enregistrer(reduire(Image.fromarray(arr, 'RGBA')))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
