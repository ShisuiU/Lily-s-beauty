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

Trois scripts produisent des fichiers versionnés dans le dépôt. Ils ne
tournent **pas** au build : on les relance à la main quand la source
change.

```bash
python3 scripts/fetch-fonts.py    # public/fonts/ + src/styles/fonts.css
python3 scripts/generate-map.py   # src/assets/plan-salon.jpg
python3 scripts/generate-og.py    # public/og.jpg
```

Dépendances : `pip install Pillow fonttools brotli`.

---

## Déployer sur Vercel

Vercel détecte Astro tout seul ; `vercel.json` fait le reste.

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

**Astro plutôt que Next.js.** Vitrine à contenu stable, beaucoup de
photo, fort enjeu de référencement local. Astro n'expédie aucun
JavaScript ici, ce qui donne les meilleurs scores de performance — et la
performance pèse sur le classement en recherche locale.

**Couleurs tirées de l'enseigne du salon.** L'encre du script, le rose du
lys, le blanc du panneau. Les valeurs vivent sous `@theme` dans
`src/styles/global.css` et nulle part ailleurs. Contrastes vérifiés
WCAG AA : `--rose` plafonne à 2,87:1 et reste donc **décoratif** ; dès
qu'il s'agit de texte ou de bouton, c'est `--rose-ink`, à 5,03:1.

**Une seule calligraphie.** Le script ne sert qu'au nom ; le reste est en
Cormorant Garamond et Instrument Sans. Deux écritures manuscrites qui se
disputent l'attention, c'est ce qui fait vieillir un site de salon.

**Aucun service tiers.** Les polices sont hébergées par le site, le plan
du quartier est une image fabriquée au build depuis les tuiles
OpenStreetMap. Un visiteur ne contacte aucun autre domaine : pas de
Google Fonts, pas d'iframe Maps, donc pas de cookie ni de transfert d'IP
à consentir. C'est ce qui permet à la page de mentions légales de
l'affirmer sans réserve.

**Éléments natifs d'abord.** Les tarifs se replient avec `<details>`, le
menu mobile s'ouvre avec l'API Popover. Le clavier, les lecteurs d'écran,
la touche Échap et la fermeture au clic extérieur viennent gratuitement ;
le script ne fait que ce que la plateforme ne fait pas.

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
3. **Remplacer la calligraphie par le logo vectoriel** du salon (AI, EPS
   ou SVG). Pinyon Script n'en est qu'une approximation.
4. **Un nom de domaine en `.fr`.** Sans effet sur la vitesse, beaucoup
   sur la confiance et le référencement local.
5. **Pages dédiées** « Ongles », « Cils », « Sourcils et épilation », pour
   que des recherches distinctes n'atterrissent pas sur la même page.
