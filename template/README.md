# Gabarit « institut de beauté »

Le design du site de Lily's Beauty, vidé de son contenu, prêt à être
rhabillé pour un autre institut.

Tout y est : le bandeau d'accueil photographique, la carte des
prestations repliable, la grille des réalisations avec vue agrandie, le
ruban de photos qui défile, les horaires qui affichent « ouvert » ou
« fermé » en temps réel, le bloc de réservation, le plan, les mentions
légales. Ce qui a changé, ce sont les textes, les photos et la couleur —
c'est-à-dire tout ce qu'un nouvel institut apporte de toute façon.

**Astro 7** en sortie statique (aucun JavaScript de framework servi au
visiteur), **Tailwind CSS 4** pour les jetons, polices et plan hébergés
sur le site : aucune requête vers un domaine tiers, donc pas de bannière
cookies à installer.

---

## Regarder le gabarit

```bash
npm install
npm run dev          # http://localhost:4321
```

Un bandeau noir annonce « Gabarit de démonstration » en haut de page :
c'est voulu, et c'est utile quand on montre la maquette à un client. Il
disparaît en passant `gabarit` à `false` dans `src/data/site.ts`.

```bash
npm run build        # site statique dans dist/
npm run preview      # relire le résultat construit
npm run check        # types et accessibilité de base
```

Les images d'exemple sont fabriquées, pas photographiées :
`npm run placeholders` les régénère. Aucune photo d'un autre institut
n'est livrée ici — c'est ce qui permet de montrer le gabarit à qui l'on
veut sans poser de question de droits.

---

## Les trois fichiers à connaître

| Fichier | Ce qu'on y règle |
| --- | --- |
| `src/data/site.ts` | **Tout le contenu.** Nom, textes, horaires, tarifs, photos, équipe, mentions légales. |
| `src/styles/theme.css` | **L'identité visuelle.** Couleurs, polices, marges. Trois palettes de rechange y sont écrites, prêtes à coller. |
| `src/pages/index.astro` | **L'ordre des sections** de la page d'accueil. |

Le reste — les composants, la feuille de style principale — n'a pas
besoin d'être ouvert pour livrer un premier site.

---

## Habiller le gabarit pour un institut

Dans l'ordre, et tout tient dans `src/data/site.ts` sauf mention
contraire.

1. **L'enseigne** — `site.name`, `site.tagline`, `site.description`
   (150 à 160 signes : c'est ce que Google affiche), `site.url`. Reporter
   la même URL dans `astro.config.mjs`.
2. **L'adresse et les coordonnées GPS** — `address`, puis `geo`. Les
   coordonnées se relèvent d'un clic droit sur Google Maps.
3. **La réservation** — `reservation.url` et `reservation.enseigne`
   (Planity, Treatwell, Kiute…). Sans lien mais avec un téléphone dans
   `contact.phone`, le bouton « Réserver » devient « Appeler » : rien
   d'autre à changer.
4. **Les horaires** — `hours`. En minutes depuis minuit, `open: null`
   pour un jour de fermeture. La mention « Ouvert · ferme à 19 h » se
   calcule toute seule, chez le visiteur, sur l'heure de Paris.
5. **Les prestations** — `universes`. Quatre univers, chacun replié
   derrière son titre, avec des catégories et des lignes. Les durées sont
   celles réellement bloquées dans l'agenda : c'est ce qui rend la grille
   utile plutôt que décorative.
6. **L'équipe** — `equipe`. Une praticienne ou quatre, la mise en page
   suit. Pour un institut tenu seul : une seule entrée, et `by: null`
   sur les univers pour retirer les mentions « avec X ».
7. **Les textes** — `hero`, `about`, `galerieIntro`, `travailIntro`,
   `plan.legende`.
8. **Les photos** — voir la section suivante.
9. **Les mentions légales** — `legal`. Les champs laissés à `null`
   s'affichent en pointillés sur la page : ils se voient, et c'est fait
   pour. Le SIRET se retrouve sur `annuaire-entreprises.data.gouv.fr`.
10. **Les avis** — `rating`. Les chiffres livrés sont des exemples. Mettre
    les vrais, ou passer `show` à `false`. Une note inventée se retourne
    contre l'institut le jour où un visiteur va vérifier.
11. **La couleur** — `src/styles/theme.css`, une paire de valeurs à
    changer (voir plus bas).
12. **Le bandeau** — `gabarit: false` une fois le reste en place.

---

## Les photos

Format attendu par chaque emplacement — les rapports comptent plus que
les tailles exactes, les composants se chargent de produire les
variantes AVIF et WebP à la construction.

| Fichier dans `src/assets/` | Taille | Où il apparaît |
| --- | --- | --- |
| `hero-large.jpg` | 1600 × 1100 | Bandeau d'accueil sur ordinateur, et photo de la section « Nous trouver » |
| `hero-portrait.jpg` | 1200 × 2132 | Bandeau d'accueil sur téléphone |
| `salon-1…4.jpg` | 900 × 1600 | Le ruban défilant « Le salon » |
| `travail-*.jpg` | 1290 × 1290 | La grille des réalisations |
| `plan.jpg` | 1200 × 620 | Le plan du quartier |
| `public/og.jpg` | 1200 × 630 | La vignette des liens partagés |

Le bandeau montre **deux photos différentes**, pas deux cadrages : une
bande large pour l'ordinateur, une verticale pour le téléphone, où un
cadrage paysage ne montrerait qu'une tranche. Pour n'en avoir qu'une,
faire pointer les deux imports de `Hero.astro` sur le même fichier.

Déposer les originaux dans `brand/` et lancer :

```bash
pip install Pillow
python3 scripts/prepare-photos.py
```

Le script recadre, réduit, **et efface les métadonnées**. Ce dernier
point n'est pas une précaution de principe : un fichier sorti d'un
téléphone embarque le modèle de l'appareil, la date de la prise et,
selon les réglages, les coordonnées GPS du lieu.

Ajouter une photo, c'est deux gestes : le fichier, et son entrée dans
`site.ts`. Un fichier annoncé mais absent arrête la construction — c'est
voulu : mieux vaut une erreur qu'un trou dans la page.

Le texte `alt` n'est pas un titre : c'est la description lue à voix haute
par un lecteur d'écran, et ce qui s'affiche si l'image ne charge pas. On
y décrit ce qu'on voit, pas ce qu'on voudrait vendre.

---

## Le logo

Tant que `brand.logo` vaut `null`, le nom s'écrit en toutes lettres dans
la fonte serif du site. Ce n'est pas un pis-aller : à cette taille, une
police dessinée tient mieux qu'un logo réduit, et c'est ce que font la
moitié des enseignes de quartier.

Pour poser un vrai logo, deux fichiers, deux rôles :

- `brand.logo` — l'en-tête. Le fichier y est peint **en masque** : il
  doit donc porter sa forme dans sa **transparence** (PNG détouré ou SVG
  monochrome), pas dans ses couleurs. C'est ce qui lui permet d'être
  blanc sur la photo du haut, puis encre une fois la barre devenue
  opaque. Un PNG noir sur fond blanc sera invisible en haut de page.
- `brand.logoCouleur` — le pied de page. Là, le logo est posé sur le
  blanc : il peut porter ses couleurs.

Déposer les fichiers dans `public/`, renseigner les chemins et les
rapports largeur/hauteur dans `site.ts`.

---

## La couleur

Toute la page tourne autour d'**une seule teinte**, déclinée en deux :

- `--accent` — la teinte de marque, **décorative**. Filets, ornements,
  puces, étoiles. Jamais du texte sur fond clair.
- `--accent-ink` — la même, assombrie jusqu'à passer le seuil AA
  (4,5:1 sur blanc). Elle porte les liens, les prix, les contours de
  focus.

Séparer les deux est ce qui permet de changer de couleur sans casser
l'accessibilité : on remplace une paire, pas quarante règles.

Trois palettes de rechange sont écrites dans `theme.css`, contrastes
déjà vérifiés : **sauge & lin**, **or & encre**, **rose & lin**. La
dernière est celle du premier site construit sur ce gabarit : à éviter si
les deux instituts peuvent se croiser.

Après tout changement de couleur, refaire le calcul de contraste
(n'importe quel vérificateur en ligne le fait en dix secondes) et
reporter les valeurs dans le commentaire en tête de `theme.css`.

Les ornements végétaux (`src/assets/motif*.svg`) sont posés en masque :
seule leur forme compte, la couleur vient de la palette. Les remplacer
par un fragment du vrai logo est la première chose à faire quand
l'institut en a un — un ornement, c'est la marque répétée en filigrane,
pas une image de stock.

---

## Mettre en ligne

Le site est statique : n'importe quel hébergeur fait l'affaire.
`vercel.json` est livré réglé pour Vercel — URLs sans `.html`, cache long
sur les images et les polices, en-têtes de sécurité dont une politique de
contenu stricte.

```bash
npm run build      # dist/ contient tout le site
```

Sur Vercel : importer le dépôt, framework « Astro », rien d'autre à
régler. Brancher ensuite le vrai nom de domaine et reporter l'adresse
dans `site.url` **et** dans `astro.config.mjs` — sans cela, la balise
canonique et le plan du site annoncent l'ancienne adresse.

Si la politique de contenu (CSP) de `vercel.json` doit accueillir un
script tiers — un outil de mesure d'audience, par exemple —, il faut
l'ajouter explicitement. C'est la contrepartie d'une CSP stricte, et
c'est le bon défaut : le site n'appelle personne.

---

## Ce que le gabarit ne fait pas, volontairement

- **Aucun formulaire.** La réservation part vers un agenda en ligne qui
  gère les créneaux, les rappels et les annulations. Un formulaire de
  contact promet une réponse que personne n'a le temps de donner.
- **Aucun cookie, aucune mesure d'audience.** Rien à demander au
  visiteur, aucune bannière à afficher.
- **Aucune carte tierce.** Le plan est une image fabriquée à la
  construction à partir des coordonnées GPS (`scripts/generate-map.py`,
  fond OpenStreetMap, attribution affichée sous la carte).
- **Aucun CMS.** Le contenu vit dans un fichier versionné. Pour un site
  de cette taille, une interface d'administration coûte plus cher qu'elle
  ne rapporte — mais si le client veut modifier ses tarifs lui-même,
  c'est le premier chantier à ouvrir, et il est faisable.
- **Pas de thème sombre servi.** La palette existe dans `theme.css` mais
  n'est pas activée : l'identité d'un institut est claire, et la page est
  très photographique — les photos, elles, ne s'inversent pas. Pour
  l'activer, retirer `data-theme="light"` du `<html>` dans
  `src/layouts/Base.astro`.

---

## Structure

```
src/
  data/site.ts          tout le contenu
  styles/
    theme.css           couleurs, polices, marges
    global.css          la feuille de style du site
    fonts.css           @font-face (généré par scripts/fetch-fonts.py)
  layouts/Base.astro    <head>, données structurées, menu, horloge d'ouverture
  components/           une section = un composant
  pages/
    index.astro         l'ordre des sections
    mentions-legales.astro
    404.astro
    robots.txt.ts
  assets/               photos et ornements
public/
  fonts/                les polices, servies depuis le site
  favicon.svg  og.jpg
scripts/
  placeholders.mjs      fabrique les images d'exemple (à supprimer ensuite)
  prepare-photos.py     recadre les vraies photos et efface les métadonnées
  generate-map.py       fabrique le plan depuis les coordonnées GPS
  generate-og.py        fabrique la vignette de partage
  fetch-fonts.py        télécharge les polices et écrit fonts.css
```

---

## Crédits et licences

- Polices **Cormorant Garamond** et **Instrument Sans**, sous licence
  SIL Open Font License, hébergées dans `public/fonts/`. Pour en changer,
  éditer `scripts/fetch-fonts.py` et le relancer.
- Fond de carte **OpenStreetMap**, sous licence ODbL : l'attribution
  affichée sous le plan est une obligation, ne pas la retirer.
- Ornements, images d'exemple, icône : fabriqués pour ce gabarit,
  réutilisables librement.
- Aucune photo, aucun texte et aucune marque d'un institut existant n'est
  livré dans ce dossier.
