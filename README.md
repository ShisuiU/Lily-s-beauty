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
python3 scripts/prepare-motif.py brand/motif-lys-original.png  # src/assets/motif-lys*.webp
python3 scripts/prepare-hero.py                    # les deux photos du bandeau (une par orientation)
python3 scripts/prepare-galerie.py                 # src/assets/salon-*.jpg
python3 scripts/verifie-tarifs.py                  # compare la grille du site à Planity
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

Côté téléphone, la photo est la même prise que la première du ruban — le
coin d'attente et son canapé — mais en pleine résolution et servie en
trois largeurs : c'est le plus gros fichier de la page, et un écran à
deux pixels par point n'a pas à télécharger celui des écrans à trois.

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

**Le voile du téléphone s'ancre en bas, en pixels — pas en
pourcentages.** C'était un vrai défaut, trouvé en changeant de photo : le
réglage était calé sur une seule taille d'écran, celle où il avait été
mesuré. Le texte du bandeau, lui, est ancré en bas et garde la même
hauteur partout — son sommet se tient entre 443 et 499 px du bas, de
320x700 à 700x1000 — alors qu'un pourcentage se promène, sur ces mêmes
écrans, entre 52 % et 67 % de la hauteur. Avant correction : le titre
tombait à 2,70:1 sur un 360x640 et le surtitre à 1,89:1 sur un 390x700,
alors que tout passait à 390x844. **Mesurer sur une seule taille ne prouve
rien.**

Mesuré au pire pixel de chaque bloc — sur dix formats de téléphone pour
le voile du bas, sur six formats de 390 à 1600 de large pour celui de
l'ordinateur. Les pires de chaque série : téléphone, surtitre 5,34:1,
accroche 6,30:1, titre 5,74:1, infos 10,37:1, logo 7,78:1 ; ordinateur,
surtitre 4,84:1, accroche 7,14:1, infos 10,15:1, titre 5,09:1, logo
9,04:1. La bande couverte par la barre fixe du bas est exclue : elle est
opaque et passe par-dessus. **Changer une photo du bandeau oblige à
refaire cette mesure.**

**Les masques pèsent 77 Ko, pas 166.** Les trois lys étaient des PNG en
niveaux de gris + alpha, 166 Ko à eux trois — dont 137 chargés dès le
premier écran, pour de l'ornement posé à 10 % d'opacité. Ils sont passés
en **WebP sans perte, à 420 px** : 77 Ko, dont 63 sur le premier écran.

420 px, c'est moins que le double de la plus grande taille d'affichage
(340 px), et c'est assumé. Comparé à la pleine résolution, à la taille
réellement affichée sur un écran à double densité et **une fois les 10 %
d'opacité appliqués**, l'écart de rendu est de 0,25 sur 255 en moyenne et
de 8,9 au pire pixel. C'est la mesure qui décide, pas la règle du double.

Le WebP est sans perte : l'alpha *est* la forme, et une compression avec
perte y ferait baver les contours pour quelques kilo-octets.

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

**La grille venait de Planity, mais tronquée.** La page Planity n'affiche
que **les cinq premières prestations de chaque catégorie** ; le reste
attend un clic sur « voir les N autres », et ces lignes-là ne sont pas
dans le HTML livré. Une première reprise s'est donc arrêtée à 44
prestations sur 77 sans que rien ne le signale : chaque catégorie
paraissait complète, et sept d'entre elles comptaient exactement cinq
lignes — le seul indice, et il n'a pas été vu.

La liste entière est pourtant dans la page, ailleurs : un objet JSON
`"services"` dans l'état de l'application, celui qui sert justement à
déplier la suite. `scripts/verifie-tarifs.py` lit celui-là, écarte ce qui
est supprimé ou masqué — au dernier relevé, 167 entrées stockées pour 77
réellement proposées, le salon gardant ses anciennes grilles — et
compare à `src/data/site.ts` : manquantes, en trop, tarifs et durées
différents. Sortie non nulle s'il y a un écart. **Relancer ce script
plutôt que recopier.**

**La grille ne se met jamais à jour toute seule, et une action
hebdomadaire s'assure qu'on le sache.** Le site est statique : les tarifs
sont recopiés dans `site.ts` et rien ne contacte Planity, ni à la
construction ni chez le visiteur. `.github/workflows/tarifs.yml` lance
donc le script chaque lundi. Écart trouvé, elle ouvre une alerte — ou met
à jour celle qui est déjà ouverte, plutôt que d'en empiler une par
semaine. Aucun écart, elle referme l'alerte s'il y en avait une et remet
`pricesCheckedOn` à la date du jour, puisque c'est exactement ce que
cette date annonce sous la grille. Une exécution qui ne change rien ne
laisse aucune trace.

Elle **signale, elle ne corrige pas**, et c'est délibéré : l'extraction
repose sur un objet JSON interne à la page Planity, que Planity peut
changer sans prévenir, et une grille de prix qui part en ligne sans
relecture n'est pas une bonne idée. La date, elle, ne bouge pas tant
qu'un écart subsiste — vérifié : avec un écart en place, `--noter` sort
en 1 sans toucher au fichier.

Les comparaisons se font sur des **listes**, pas sur des valeurs uniques :
le même intitulé existe des deux côtés du catalogue avec des tarifs
différents — « Aisselles » vaut 12 € en 15 min chez la femme, 14 € en
20 min chez l'homme. Écrasées sur une seule clé, ces paires s'annulent et
un écart passe.

**« Le travail » est dans le menu**, en deuxième position, juste après les
tarifs — l'ordre du menu suit celui des sections. Une section de photos
qu'on n'atteint qu'en faisant défiler est la plus rentable du site, et
elle était cachée. Cinq entrées tiennent : au plus étroit où le menu
s'affiche encore, il reste 24 px avant le bouton « Réserver ». Les liens
passent en `white-space: nowrap`, faute de quoi « Prestations et tarifs »
repassait à la ligne entre 881 et 1 000 px et donnait un en-tête sur deux
hauteurs.

**« Le travail », posé juste après les tarifs.** On vient de lire le prix
d'une pose complète : on veut voir à quoi elle ressemble. Fond blanc et
non crème, contrairement aux tarifs juste au-dessus — les photos y
ressortent mieux, et le changement marque le chapitre. Deux groupes, un
par praticienne, quatre photos chacun, en carré et à angles vifs.

**Le script ne recadre pas.** Une version précédente rognait les bandes
d'interface qu'Instagram laisse sur les captures — le compteur du
carrousel, la barre de défilement. C'était fragile et de trop : le salon
recadre lui-même ce qu'il veut recadrer, et il l'a fait. `prepare-galerie.py`
réduit et retire les métadonnées, rien d'autre ; le cadrage carré de
l'affichage est l'affaire de la feuille de style.

**Un appui, un clic : la photo s'ouvre — mais pas de la même façon des
deux côtés**, parce que la place disponible n'est pas la même.

Sur téléphone, la grille fait deux colonnes sur deux lignes, donc un
carré : la photo ouverte se pose en absolu sur toute la grille et occupe
exactement la place des quatre. Les trois autres gardent la leur dans le
flux — la hauteur de la section ne bouge pas d'un pixel — mais passent en
`visibility: hidden`, ce qui les retire du même coup de la tabulation et
des lecteurs d'écran le temps de la vue. Un second appui referme, Échap
aussi.

Sur ordinateur, les quatre sont sur une seule ligne : plus de carré à
remplir sur place, la photo s'ouvre donc **au-dessus de la page**, dans
un `<dialog>` natif — pas une division qu'on empile. Il prend le focus,
le retient, se ferme à Échap et s'affiche au-dessus de tout sans qu'on
ait à inventer un `z-index`. Un clic à côté referme, et le focus revient
sur la vignette d'où l'on est parti.

Un détail qui coûte une ligne et se voyait de loin sans elle : un
`<dialog>` modal est centré par le navigateur avec `inset: 0` et
`margin: auto`, et la remise à zéro des marges de Tailwind écrase ce
`auto` — la vue se collait en haut à gauche, à moitié hors cadre.

**`sizes` décrit la vignette, pas la photo ouverte.** Il annonçait la
taille d'ouverture, si bien que chacune des huit photos téléchargeait une
variante deux fois trop grande — 421 Ko au lieu de 150 sur un téléphone à
double densité — que la plupart des visiteurs n'agrandiront jamais. Le
téléphone fait donc maintenant ce que fait déjà l'ordinateur : vignette
légère au chargement, version d'ouverture au moment de l'ouverture. Elle
s'y substitue une fois chargée, et `srcset` et `sizes` partent avec elle,
sinon ils l'emportent sur `src` et l'échange n'a pas lieu.

Deux gains d'un coup : 271 Ko de moins sur la page, et une photo ouverte
servie en 1 290 px au lieu de 860 — ce qui règle la douceur qu'on voyait
encore sur les écrans à triple densité. Mesuré : vignettes en 440 px à
double densité, 620 à triple, et 1 290 après l'appui dans les deux cas.

**La vue part de la vignette, pas de la grande version.** Elle est une
seule et même image, remplie à chaque ouverture : lui donner directement
l'adresse de la grande affichait la photo **précédente** pendant tout son
chargement, parce qu'un navigateur garde ce qu'il a peint tant qu'il n'a
pas mieux. On part donc de la vignette, déjà décodée et en cache — la
bonne photo est là tout de suite, simplement plus douce — et la grande
prend sa place dès qu'elle est prête. Un garde évite qu'une grande
version arrivée en retard ne s'installe par-dessus une autre photo
ouverte entre-temps.

Mesuré en retardant les variantes de 1 290 px de deux secondes, puis en
relevant la couleur moyenne de la vue 150 ms après le clic : écart de 1 à
2 sur 255 avec la bonne photo, de 60 à 70 avec la précédente. Avec
l'ancien code, le même test donne l'inverse — c'est ce qui prouve qu'il
mesure la bonne chose.

**720 px de côté, et le nombre vient des photos, pas de l'écran.** Les
originaux font 1 290 px — le maximum qu'Instagram rende, et on ne peut
pas inventer de pixels au-delà. À 720 px la photo est réduite sur un
écran ordinaire, et agrandie de 12 % seulement sur un écran à double
densité : invisible. Ouvrir plus grand demanderait des photos d'origine
plus grandes, pas une autre valeur dans la feuille de style. Les
variantes de 1 290 px ne sont chargées qu'au clic — un million d'octets
que personne ne paie en arrivant sur la page.

Ces mêmes originaux sont désormais conservés en pleine résolution dans
`src/assets` (1 290 px au lieu de 900), et le `<Image>` de la vignette
porte une `width` explicite : sans elle, l'adresse de repli du `<img>`
pointait sur la largeur d'origine, et la construction produisait une
seconde variante de 1 290 px pour rien à côté de celle de la vue.

Le nombre de colonnes est **écrit**, deux puis quatre, et non laissé à un
`auto-fit` : l'ouverture sur place repose sur le fait que la grille est
un carré de quatre, ce qu'un nombre de colonnes variable ne garantit pas.
C'est ce même seuil qui décide lequel des deux gestes s'applique.

L'animation est un **FLIP** : on relève la position de départ, on applique
l'état d'arrivée, on relève la position finale, et on rejoue l'écart à
l'envers. C'est le seul moyen d'animer un passage en `position: absolute`,
qui ne se transitionne pas. Sous mouvement réduit, l'état change sans
animation — vérifié, zéro animation en cours.

Chaque photo est dans un **vrai bouton**, pas dans une image qu'on
écoute : atteignable au clavier et annoncée comme une commande. Son rôle
n'étant pas le même des deux côtés — il déplie sur téléphone, il ouvre
une vue sur ordinateur — le script pose `aria-expanded` ou
`aria-haspopup="dialog"` selon le cas, et bascule de l'un à l'autre si
l'écran change de largeur. Un `aria-expanded` qui ne bougerait jamais sur
ordinateur mentirait à moitié.

Les fichiers de cils sont numérotés, pas nommés par technique : on ne
distingue pas à l'œil une pose cil à cil d'une mixte ou d'un volume
russe, et deviner aurait fini par écrire une bêtise dans un texte de
remplacement. Les descriptions disent ce qu'on voit, pas ce qui a été
fait.

**Les deux sœurs, en encre.** Le bloc qui les présente en haut de la
section est passé d'une liste à filets à un seul panneau à fond encre,
partagé par les deux praticiennes. Le fond reprend celui de la bande
« réserver » : le vocabulaire existait déjà.

Le filet qui les sépare est le fond du bloc qui transparaît dans un
écart d'un pixel, et non une bordure. L'écart d'une grille se place tout
seul entre les colonnes quand il y a la place pour deux, et entre les
lignes quand il n'y en a plus ; une bordure aurait fallu la déplacer d'un
côté à l'autre à chaque changement de disposition.

Deux autres fonds ont été essayés et écartés. Le blanc est pris plus bas
par les cartes de prestations, et l'employer ici aurait laissé croire au
même niveau de lecture. Le rosé pâle ne se détache pas du crème de la
section — #fbf5f7 sur #f6f3f1, on ne voyait que la bordure. Mesuré sur
l'encre : le prénom à 17,39:1, le métier à 9,91:1, le pseudo Instagram à
6,05:1, et le contour de focus passé au rose clair, qui y vaut 6,05:1
contre 3,46:1 pour le rose foncé.

**Trois niveaux, trois traitements.** Univers, catégorie, prestation
partageaient presque la même graisse : la catégorie était un titre de
1,02 rem en gras posé sur des prestations de 1 rem, et la liste se lisait
comme un seul bloc. Désormais l'univers est un grand titre au serif sur
sa ligne repliable, avec sa praticienne et son compte ; la catégorie est
une carte blanche sur le fond crème de la section, avec son propre compte
en rose ; la prestation est une ligne dans cette carte, intitulé et prix
sur la première ligne, précision et durée sur la seconde.

La praticienne est portée par l'**univers** et non par chaque catégorie :
chacun n'est tenu que par une personne, et la mention se répétait dix
fois. La précision que Planity affiche sous certaines prestations est
reprise telle quelle : elle donne à la fois une information utile et un
troisième niveau de texte.

Quatre univers, contre trois auparavant : « Sourcils et épilation »
réunissait à lui seul cinquante prestations. Il est coupé en « Sourcils
et visage » (browlift, teintures, fil) et « Épilation à la cire » (femme
à l'unité, forfaits femme, homme).

**« Ouvert / fermé » calculé chez le visiteur.** Le site étant statique,
un calcul au build serait figé. Le script lit `hours`, résout l'heure de
Paris via `Intl`, surligne le jour courant et annonce la prochaine
ouverture.

**Fiche établissement.** Un bloc JSON-LD `BeautySalon` est généré depuis
les mêmes données — 77 prestations avec leurs prix, horaires, note,
adresse, coordonnées, comptes Instagram. C'est lui qui alimente la
recherche locale.

---

## À faire ensuite

1. **Plus de photographies du travail.** La section « Le travail » en
   montre huit, quatre par praticienne. C'est ce qui convertit sur ce
   métier, et les deux comptes Instagram en regorgent : en ajouter est
   la chose la plus rentable qui reste à faire. Les déposer dans
   `brand/` sous le nom `ongles-*.jpg` ou `cils-*.jpg`, relancer
   `scripts/prepare-galerie.py`, et décrire chacune dans `travail` de
   `src/data/site.ts`.

   **À confirmer** : que ces photos sont bien celles du salon et non des
   modèles trouvés ailleurs, et que les clientes photographiées sont
   d'accord pour figurer sur le site. Ni l'un ni l'autre ne se vérifie
   depuis le fichier.
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
