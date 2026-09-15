# Lily's Beauty — site de l'institut

Site vitrine d'un institut de beauté à Laudun-l'Ardoise : prothésie
ongulaire, extensions et rehaussement de cils, sourcils, épilation. Page
d'accueil unique plus une page de mentions légales, réservation déléguée
à Planity.

**Astro 7** en sortie statique — zéro fichier JavaScript servi — et
**Tailwind CSS 4** pour les jetons de design.

---

## Modifier le contenu

Tout ce qui change vit dans **un seul fichier** :

```
src/data/site.ts
```

Horaires, tarifs, adresse, coordonnées, comptes Instagram, sections de
navigation, mentions légales. Aucun de ces textes n'est écrit en dur dans
un composant.

Le fichier suit une convention : **tout ce qui vaut `null` est considéré
comme absent**. Selon le champ, le site masque la ligne (le téléphone,
par exemple) ou l'affiche en pointillés roses (les champs légaux).
Remplacer le `null` par une vraie valeur suffit ; rien d'autre à toucher.

### Ce qui reste à renseigner

Uniquement sur `/mentions-legales`, dans l'objet `legal` :

| Donnée | Champ | Où la trouver |
| --- | --- | --- |
| Nom et prénom de chaque exploitante | `entreprises[].denomination` | vous |
| SIRET de chacune | `entreprises[].siret` | annuaire-entreprises.data.gouv.fr |
| Responsable de la publication | `directricePublication` | une décision à prendre |

Ces champs sont volontairement **hors du tableau `pending`**, qui pilote
le bandeau d'aperçu en haut du site : le remplir ferait réapparaître ce
bandeau sur la page d'accueil que voient les clientes.

### Mettre à jour horaires et tarifs

Ils sont recopiés de la fiche Planity du salon, qui reste la source de
vérité. Après une modification là-bas, reporter ici et ajuster
`pricesCheckedOn`, affiché sous la grille.

Les horaires s'expriment en minutes depuis minuit pour que l'affichage et
le calcul « ouvert / fermé » lisent la même donnée : `9 h 30` s'écrit
`9 * 60 + 30`.

---

## Développer

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère dist/
npm run preview  # sert dist/ localement
```

### Scripts de génération

Six scripts produisent des fichiers versionnés dans le dépôt. Ils ne
tournent **pas** au build : on les relance à la main quand la source
change.

```bash
python3 scripts/fetch-fonts.py                     # public/fonts/ + src/styles/fonts.css
python3 scripts/generate-map.py                    # src/assets/plan-salon.jpg
python3 scripts/generate-og.py                     # public/og.jpg
python3 scripts/prepare-logo.py brand/logo-original.png   # src/assets/logo.png
python3 scripts/prepare-motif.py brand/motif-lys-original.png  # public/motif-lys.png
python3 scripts/prepare-hero.py                    # les deux photos du bandeau
```

Dépendances : `pip install Pillow fonttools brotli numpy scipy`.

Les fichiers livrés par le salon sont conservés tels quels dans
`brand/` ; les scripts en tirent les versions qu'affiche le site.

`prepare-logo.py` reconnaît deux formes de livraison. Un PNG **déjà
transparent** n'est que rogné et réduit. Un logo posé sur un **aplat
opaque** est détouré, et le script y retire en plus ce qui ne doit pas
partir sur le site : ligne d'adresse, feuillage débordant, bavures de
gomme. Ces découpes sont **relevées sur le fichier** au lieu d'être
codées en dur, et il imprime ce qu'il a trouvé — après un nouveau logo,
lire ces nombres avant de faire confiance au résultat.

Confondre les deux formes est destructeur : sous les pixels transparents
le RGB vaut le plus souvent noir, si bien que la chaîne de détourage
relèverait un « fond noir » et effacerait le dessin au lieu du vide.

---

## Déployer sur Vercel

Vercel détecte Astro tout seul ; `vercel.json` fait le reste.

Il pose aussi les en-têtes de sécurité, **Content-Security-Policy**
comprise. Elle est stricte parce qu'elle peut l'être : le site ne charge
rien d'ailleurs, donc `default-src 'self'` suffit, et `object-src 'none'`
avec `base-uri 'self'` ferment deux voies d'injection classiques. Seul
`'unsafe-inline'` reste nécessaire, pour les trois scripts écrits dans la
page. Après toute modification d'en-tête, vérifier la console du
navigateur : une CSP trop serrée casse en silence.

Ce fichier règle trois familles de cache. Les fichiers de `/_astro/`
portent une empreinte dans leur nom : un an, immuable. Les polices de
`/fonts/` ont un nom stable mais ne changent jamais : même traitement,
avec la contrepartie signalée en tête de `scripts/fetch-fonts.py`.
L'image de partage et le favicon sont régénérables : un jour, avec
rafraîchissement en arrière-plan.

> **JSON n'accepte pas de commentaires**, et le schéma Vercel refuse
> toute clé inconnue dans une règle d'en-tête — `comment` compris. En
> ajouter fait rejeter la configuration **sans aucune erreur visible** :
> les en-têtes cessent simplement de s'appliquer. D'où ces explications
> ici plutôt que dans le fichier.

Une page **404** est servie depuis `src/pages/404.astro` : Vercel la
prend automatiquement pour toute URL inconnue.

Après un changement d'adresse, la reporter à **deux endroits** qui
doivent rester en phase : `site.url` dans `src/data/site.ts` (balises
canoniques, partage) et `site:` dans `astro.config.mjs` (plan du site).
Le `robots.txt` est généré depuis la première, il n'y a rien à y faire.

### Région Vercel

Il n'y a rien à régler. Le paramètre « Region » d'un projet Vercel
détermine où s'exécutent les fonctions serveur ; ce site n'en a aucune.
Les fichiers statiques sont répliqués sur tout le réseau de diffusion et
servis depuis le point de présence le plus proche de chaque visiteur.

---

## Choix techniques

**Le CSS ne scanne que `src/`.** `@import 'tailwindcss' source('../')`,
et ce n'est pas cosmétique : laissé à sa détection automatique, Tailwind
lisait aussi `.claude/skills/**`, des documents de référence remplis
d'exemples de classes. Il les compilait dans la feuille de production,
qui pesait **40 % de plus** pour des règles que rien n'utilise.

**Astro plutôt que Next.js.** Vitrine à contenu stable, beaucoup de
photo, fort enjeu de référencement local. Aucun *fichier* JavaScript
n'est servi : il ne reste que trois scripts en clair dans la page, courts
et sans dépendance — le menu mobile, le calcul « ouvert / fermé » et les
apparitions au défilement. Pas de framework à télécharger ni à exécuter
avant l'affichage, ce qui donne les meilleurs scores de performance, et
la performance pèse sur le classement en recherche locale.

**Couleurs tirées de l'enseigne du salon.** L'encre du script, le rose du
lys, le blanc du panneau. Les valeurs vivent sous `@theme` dans
`src/styles/global.css` et nulle part ailleurs. Contrastes vérifiés
WCAG AA : `--rose` plafonne à 2,87:1 et reste donc **décoratif** ; dès
qu'il s'agit de texte ou de bouton, c'est `--rose-ink`, à 5,03:1.

**Deux polices, pas trois.** Cormorant Garamond et Instrument Sans. Une
calligraphie, Pinyon Script, a longtemps tenu lieu de nom du salon ; le
vrai logo l'a remplacée partout et elle a été retirée — police, fichiers
et jeton. Deux écritures manuscrites qui se disputent l'attention, c'est
ce qui fait vieillir un site de salon ; une police qu'on télécharge sans
l'afficher, c'est simplement du poids.

**Aucun service tiers.** Les polices sont hébergées par le site, le plan
du quartier est une image fabriquée au build depuis les tuiles
OpenStreetMap. Un visiteur ne contacte aucun autre domaine : pas de
Google Fonts, pas d'iframe Maps, donc pas de cookie ni de transfert d'IP
à consentir. C'est ce qui permet à la page de mentions légales de
l'affirmer sans réserve.

**Éléments natifs d'abord.** Les tarifs se replient avec `<details>` :
le clavier, les lecteurs d'écran et le repli viennent gratuitement. Le
menu mobile a d'abord utilisé l'API Popover, abandonnée depuis — ses
styles par défaut imposent `width: fit-content`, ce qui annulait
l'`inset: 0` du panneau et le laissait couvrir 60 % de l'écran. Il est
désormais tenu par un script court, qui ne fait que ce que la plateforme
ne fait pas : `inert`, la touche Échap et le retour du focus.

**Le site s'affiche en clair, toujours.** Une palette sombre existe dans
`global.css`, mais `<html>` porte `data-theme="light"` et elle n'est
jamais servie. C'est un choix de marque, pas un oubli : l'identité du
salon est crème, rose et encre, et l'inversion la dénature — le logo est
dessiné pour un fond clair, les photos de la façade aussi. Un téléphone
réglé en sombre affiche donc le site tel qu'il a été composé.
`color-scheme: light` étend la consigne aux ascenseurs et aux contrôles
natifs. Pour rendre la main au réglage du téléphone : retirer
`data-theme` du `<html>` dans `Base.astro`.

**Le logo de l'en-tête est un masque.** Le nom en Pinyon Script a cédé
la place au vrai logo, à toutes les largeurs. Il n'est pas servi en `<img>` : la
barre est transparente sur la photo du haut — enseigne blanche — puis
opaque au défilement, où l'enseigne passe à l'encre, avec une transition
entre les deux. Un PNG noir y serait invisible en haut de page. Le masque
se peint avec `currentColor`, si bien que la règle de couleur écrite pour
le texte continue de le piloter sans rien savoir de lui. Le nom reste
dans le balisage, masqué visuellement : les lecteurs d'écran le lisent.

Il y est posé à 34 px et non aux 27 px du texte qu'il remplace, parce que
les lys montent au-dessus du mot : à 27 px les déliés viraient au gris
pâle. La hauteur de l'en-tête ne bouge pas pour autant, elle est fixée
par ailleurs — vérifié de 27 à 35 px.

**La photo du bandeau vient de la prise large.** Le salon a fourni deux
cadrages. Celui qui servait était le serré, recadré puis **agrandi 1,5
fois** : d'où une enseigne qui remplissait le tiers de l'écran, coupée
aux deux bouts, et des pleins qui bavaient. La prise large donne le mur
de pierre, l'enseigne entière, la porte voisine et le trottoir — et,
étant moins grossie, elle est plus piquée malgré ses 900 px.

Le voile de lecture a dû être recalé dessus : elle est plus claire là où
le texte se pose, et au réglage précédent le titre tombait à 2,51:1, le
corps à 3,52:1. Après recalage, 4,30:1 et 7,26:1 — au-dessus des seuils
(3:1 pour un titre de cette taille, 4,5:1 pour le corps). **Changer la
photo du bandeau oblige à remesurer ces deux valeurs.**

**Le rameau du logo, décliné.** Il est servi en masque CSS et non en
`<img>` : le fichier ne porte qu'un alpha, la couleur vient de la
palette, et un pseudo-élément est par construction invisible aux lecteurs
d'écran — ce qui est exactement son statut.

Quatre emplois, jamais le même deux fois. Le rameau entier en haut à
droite du bloc crème ; ses feuilles seules, en clair, en bas à gauche du
bloc sombre, l'angle opposé, pour que les deux tracent une diagonale dans
la page ; la fleur seule dans les horaires et sur les pages de texte. Les
fichiers sortent tous du **même dessin**, découpé par
`scripts/prepare-motif.py` — aucune image supplémentaire n'a été
demandée. Répété à l'identique, un ornement devient un tampon ; c'est en
changeant de fragment, de coin, d'échelle et de couleur qu'il reste un
ornement.

Les deux fleurs sont **posées**, pas accrochées à un bord : elles
comblent un vide que la mise en page large laisse — sous la carte
« en ce moment » pour les horaires, à droite du titre pour les pages de
texte. Ce vide disparaît quand la page passe en colonne, et l'ornement
avec lui : `display: none` sous 860 px pour les horaires, sous 1000 px
pour les pages de texte, où le paragraphe d'introduction venait sinon se
poser dessus et tombait à 4,56:1, à six centièmes du seuil.

**Avant de déplacer un motif, mesurer.** Les tests de chevauchement par
boîte englobante sur-signalent : la boîte d'un titre fait toute la
largeur de la colonne alors que ses lettres s'arrêtent bien avant. Il
faut comparer l'étendue réelle des glyphes (`Range.getClientRects`), puis
lire le contraste au pixel. Trois des cinq « chevauchements » relevés à
la boîte n'en étaient pas, et un quatrième se produit derrière un bouton
opaque.

**Les apparitions au défilement.** Les blocs concernés portent la classe
`monte` dans leur composant ; un script en tête de page les confie à un
`IntersectionObserver` et pose `vu` quand ils franchissent le quart bas
de la fenêtre. La transition vit sur `vu`, donc l'apparition ne se rejoue
pas à l'envers, et `unobserve` la rend définitive.

Une première version se passait de script, avec
`animation-timeline: view()`. Techniquement plus propre, et abandonnée :
une animation accrochée au défilement est *scrubbée*, l'élément est
dessiné selon sa position plutôt qu'animé, et l'œil ne le lit pas comme
une apparition. Sur téléphone, on ne voyait presque rien. Une durée à
soi, jouée une fois, demande un observateur — c'est le prix, il est
assumé.

Deux choses portent la sécurité du procédé. L'état masqué dépend de la
classe `js-monte`, que le script ne pose qu'après avoir vérifié
`IntersectionObserver` et `prefers-reduced-motion` : sans JavaScript ou
en mouvement réduit, **rien n'est jamais masqué**. Et cette classe est
posée depuis le `<head>`, avant le premier rendu, sinon la page
s'afficherait puis se masquerait — ce qui se voit.

Le décalage en cascade n'est appliqué qu'aux blocs qui franchissent la
ligne **dans la même fournée** : au défilement posé chacun arrive seul et
part sans retard, au doigt rapide ou en arrivant par une ancre ils se
suivent. Le décalage se paie là où il sert.

**« Ouvert / fermé » calculé chez le visiteur.** Le site étant statique,
un calcul au build serait figé. Le script lit `hours`, résout l'heure de
Paris via `Intl`, surligne le jour courant et annonce la prochaine
ouverture.

**Fiche établissement.** Un bloc JSON-LD `BeautySalon` est généré depuis
les mêmes données — 44 prestations avec leurs prix, horaires, note,
adresse, coordonnées, comptes Instagram. C'est lui qui alimente la
recherche locale.

---

## À faire ensuite

1. **Photographies du travail réalisé.** Le site montre une façade et un
   plan, jamais un ongle ni un regard. Sur ce métier, c'est ce qui
   convertit — et les deux comptes Instagram en regorgent.
2. **Compléter les mentions légales** (tableau plus haut).
3. **Obtenir le logo en vectoriel** (AI, EPS ou SVG). Le PNG fourni tient
   partout où il sert — en-tête et pied de page. Un vectoriel resterait
   préférable : il supprimerait le masque au profit d'un tracé, et
   permettrait de le poser plus petit sans que les déliés pâlissent.

4. **Une photo de devanture en paysage**, prise d'où l'a été la large,
   en 2 000 px au moins. Le bandeau se contente aujourd'hui d'une bande
   découpée dans une photo verticale de 900 px : ça tient, mais c'est le
   plafond de qualité de la page d'accueil.

   Les livraisons précédentes portaient une ligne d'adresse fausse
   (« 30290 Rue de la République Laudun ») ; celle en place ne porte plus
   d'adresse du tout. Si le fichier fautif a servi à l'enseigne ou aux
   cartes de visite, l'erreur y est toujours.
5. **Un nom de domaine en `.fr`.** Sans effet sur la vitesse, beaucoup
   sur la confiance et le référencement local.
6. **Pages dédiées par univers** — `/ongles`, `/cils`,
   `/sourcils-epilation`. Aujourd'hui une seule page vise tout à la fois,
   or Google ne classe qu'une page par requête : elle est donc diluée sur
   chaque sujet. Trois pages distinctes se présenteraient chacune sur son
   métier et sa ville.

   **À ne faire qu'après les points 1 et 2.** Techniquement c'est presque
   gratuit — les données sont déjà groupées par univers dans `site.ts`,
   une route dynamique suffit. Mais trois pages qui ne seraient que des
   grilles tarifaires relèvent du contenu maigre : non seulement elles ne
   se classeraient pas, mais elles affaibliraient l'ensemble. Il faut des
   photos et 200 à 300 mots utiles par univers, écrits par la praticienne
   concernée.
