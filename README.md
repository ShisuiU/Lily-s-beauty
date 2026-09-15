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

Sept scripts produisent des fichiers versionnés dans le dépôt. Ils ne
tournent **pas** au build : on les relance à la main quand la source
change.

```bash
python3 scripts/fetch-fonts.py                     # public/fonts/ + src/styles/fonts.css
python3 scripts/generate-map.py                    # src/assets/plan-salon.jpg
python3 scripts/generate-og.py                     # public/og.jpg
python3 scripts/prepare-logo.py brand/logo-original.png   # src/assets/logo.png
python3 scripts/prepare-motif.py brand/motif-lys-original.png  # src/assets/motif-lys*.png
python3 scripts/prepare-hero.py                    # les deux photos du bandeau (une par orientation)
python3 scripts/prepare-galerie.py                 # src/assets/salon-*.jpg
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

**Le bandeau ne montre pas la même chose selon l'écran.** Deux photos, pas
deux cadrages : l'ordinateur reçoit la devanture, le téléphone reçoit
l'intérieur — le poste de soin sous la guirlande. C'est une demande du
salon.

Côté devanture, le salon a fourni deux cadrages. Celui qui servait était
le serré, recadré puis **agrandi 1,5 fois** : d'où une enseigne qui
remplissait le tiers de l'écran, coupée aux deux bouts, et des pleins qui
bavaient. La prise large donne le mur de pierre, l'enseigne entière, la
porte voisine et le trottoir — et, étant moins grossie, elle est plus
piquée malgré ses 900 px.

Côté téléphone, la photo est la même prise que la deuxième du ruban, mais
en pleine résolution et servie en trois largeurs : c'est le plus gros
fichier de la page, et un écran à deux pixels par point n'a pas à
télécharger celui des écrans à trois.

`alt` y est **vide, et c'est voulu** : l'attribut est unique alors que la
photo change avec la largeur d'écran ; il décrirait une devanture aux uns
et un intérieur aux autres. Les deux sont décrites là où elles portent
une information — la devanture dans « Accès », le poste de soin dans le
ruban.

**Le voile de lecture se remesure à chaque changement de photo.** Il l'a
été deux fois. D'abord sur la devanture, plus claire que la photo qu'elle
remplaçait : le titre y tombait à 2,51:1 et le corps à 3,52:1. Puis pour
le **surtitre**, 11 px : le plus petit texte de la page, donc celui qui
exige 4,5:1, et il n'y était nulle part — 3,29:1 à 1440, 3,12:1 à 1024.
Le défaut datait d'avant le changement de photo ; il n'avait simplement
jamais été mesuré. Il est passé en blanc plein, et la montée du voile a
été avancée vers le quart haut, là où il se pose.

Le téléphone a son propre réglage, la photo y étant tout autre et bien
plus claire en haut (moyennes 114 et 124 sur les deux premiers
cinquièmes). La fenêtre où la photo se voit vraiment est remontée entre
l'en-tête et le texte.

Mesuré au pire pixel de chaque bloc, sur six formats de 390 à 1600 de
large ; les pires de la série : surtitre 4,84:1, accroche 7,14:1, infos
10,15:1 (seuil 4,5) et titre 5,09:1 (seuil 3 à cette taille), logo de
l'en-tête 9,04:1. **Changer une photo du bandeau oblige à refaire cette
mesure.**

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

Les deux fleurs sont **posées**, pas accrochées à un bord — et c'est le
fichier lui-même qui le permet. Un fragment prélevé au rectangle dans un
dessin d'un seul tenant est coupé quelque part, et une coupe franche se
voit : la première version tranchait un pétale, et le dessin avait l'air
cassé. La fleur est donc détourée par un **halo** plutôt que par une
boîte : pleine au centre, éteinte avant le bord. La fleur reste entière ;
ce sont la tige et les feuilles qui se dissipent. Une tige qui s'efface
se lit comme une tige qui continue, un pétale tranché non.

Deux conditions, et la seconde a été manquée une première fois. Le halo
travaille sur le dessin **entier**, élargi d'une marge transparente :
découper d'abord et fondre ensuite ne sert à rien, c'est la découpe qui
tranche et le fondu arrive trop tard. Et le dessin doit s'éteindre avant
le bord du fichier — `prepare-motif.py` relit les quatre bords de sa
sortie et **refuse d'écrire** si l'encre y dépasse 8 sur 255. Le contrôle
tient de lui-même : le dessin d'origine ne touche pas son propre cadre,
son encre s'arrête à 27 px du plus proche.

**Les motifs sont dans `src/`, pas dans `public/`.** Un fichier de
`public/` est servi sous le nom qu'on lui donne : son adresse ne change
jamais. Ces trois-là étaient posés là, avec un cache d'une journée — et
une correction du dessin est restée invisible pendant ce temps sur les
téléphones qui avaient déjà vu la page, alors que le fichier corrigé
était bien en ligne. Passés par `src/`, ils reçoivent une empreinte de
contenu dans leur nom : à contenu changé, adresse changée, et le cache
d'un an devient non seulement sûr mais correct. Le HTML, lui, se
revalide à chaque visite, si bien qu'un simple rechargement suffit
toujours.

La règle de `vercel.json` qui leur donnait ce cache d'une journée a
disparu avec eux. **Tout fichier de `public/` amené à changer sous le
même nom pose le même problème** : la place d'un fichier versionné est
dans `src/`.

Dans la carte « en ce moment », elle est réglée par sa **hauteur** et non
par sa largeur. La carte n'a pas la même forme selon la colonne : 175 px
de haut en une seule colonne, 383 en deux. Une largeur en pourcentage
donnait, entre 450 et 860 px de large, une fleur plus haute que la carte,
dont le haut repassait sous le bord. Vérifié de 360 à 2 560 px : elle
tient partout, avec de la marge.

Sur les pages de texte, l'ornement comble un vide que seule la mise en
page large laisse, et il disparaît avec lui : `display: none` sous
1 000 px, où le paragraphe d'introduction venait sinon se poser dessus et
tombait à 4,56:1, à six centièmes du seuil.

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

**Le ruban défile en poussant sa propre barre de défilement.** Ce n'est
pas une animation posée sur une boîte fermée, mais une vraie zone
défilable qu'un script fait avancer image par image. La différence tient
en une phrase : on peut la prendre en main **en plein mouvement**. On
glisse au doigt, à la souris ou aux flèches, le ruban suit, puis il
repart de là où on l'a laissé — sans rien à mettre en pause d'abord.

Quatre copies de la série se suivent. Le défilement vit dans la deuxième
et saute d'une série entière dès qu'il en sort ; les séries étant
identiques, le raccord ne se voit pas. Il reste ainsi une demi-série de
marge de chaque côté, de quoi absorber un geste vif sans recaler en plein
élan — et pendant un élan tactile, on n'écrit dans la barre qu'au moment
du raccord, sinon l'élan s'arrêterait net.

Deux détails font toute la différence entre ce motif et sa version
cassée. L'écart entre les vignettes est une **marge**, jamais un `gap` :
avec un `gap`, la piste mesure seize vignettes et quinze écarts, le quart
exact ne tombe plus sur une série entière, et le raccord saute d'un écart
à chaque tour. Et la largeur d'une série se **mesure entre deux séries
voisines**, jamais en divisant la largeur totale : celle-ci est arrondie
au pixel entier, et le demi-pixel d'erreur qui en résultait décalait le
raccord d'autant. Mesuré : à 400 px de large, où la série tombe juste, les
deux poses à une série d'écart sont identiques au canal près ; à 390 px,
où elle vaut 913,6 px, il reste le demi-pixel d'arrondi de la barre de
défilement elle-même, et rien de plus — la phase, elle, est gardée en
virgule flottante et ne dérive pas.

**Quatre choses l'interrompent, une seule est définitive.** Le doigt ou
la souris pendant le geste, puis 1,2 s de temps mort le temps que l'élan
retombe. Le survol, tant qu'on regarde. Le focus clavier — mais seulement
le focus clavier : toucher le ruban le fait défiler et lui donne le focus
du même geste, si bien que sans ce tri un simple effleurement l'arrêtait
jusqu'à ce qu'on touche autre chose. Et le bouton, jusqu'à ce qu'on le
represse.

**Le bouton d'arrêt ne se montre qu'au clavier**, comme le lien
d'évitement en haut de page. À la souris et au doigt il ne servirait à
rien : le survol suspend déjà et un geste emmène le ruban où l'on veut.
Au clavier ces deux gestes n'existent pas, et une image qui bouge en
permanence doit pouvoir être arrêtée : c'est une règle, pas un avis. D'où
un bouton réel, atteignable en tabulant, posé en absolu dans le creux sous
le ruban pour qu'en apparaissant il ne pousse rien. Le mouvement réduit
supprime le défilement automatique et retire le bouton, qui n'aurait plus
rien à arrêter ; le glisser, lui, reste.

Les copies portent `aria-hidden` et un `alt` vide : un lecteur d'écran
énonce les quatre photos une fois, pas seize. La bande porte `tabindex`
et un nom, sans quoi une zone défilable n'est atteignable qu'à la souris.

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

1. **Photographies du travail réalisé.** La galerie montre désormais
   l'intérieur — le poste de soin sous deux angles, le coin manucure,
   celui d'attente —
   mais toujours pas un ongle ni un regard. Sur ce métier, c'est ce qui
   convertit, et les deux comptes Instagram en regorgent. Les déposer
   dans `brand/` sous le nom `salon-*.jpg` et relancer
   `scripts/prepare-galerie.py` suffit ; leur description s'écrit dans
   `galerie` de `src/data/site.ts`.
2. **Compléter les mentions légales** (tableau plus haut).
3. **Obtenir le logo en vectoriel** (AI, EPS ou SVG). Le PNG fourni tient
   partout où il sert — en-tête et pied de page. Un vectoriel resterait
   préférable : il supprimerait le masque au profit d'un tracé, et
   permettrait de le poser plus petit sans que les déliés pâlissent.

4. **Une photo de devanture en paysage**, prise d'où l'a été la large,
   en 2 000 px au moins. Le bandeau d'ordinateur se contente aujourd'hui
   d'une bande découpée dans une photo verticale de 900 px : ça tient,
   mais c'est le plafond de qualité de la page d'accueil. Le bandeau de
   téléphone, lui, n'a plus ce plafond depuis qu'il montre l'intérieur.

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
