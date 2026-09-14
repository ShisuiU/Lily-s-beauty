# Lily's Beauty — site de l'institut

Site vitrine d'un institut de beauté spécialisé en prothésie ongulaire et
extension de cils. Page d'accueil unique, réservation déléguée à Planity.

**Astro 7** (statique, quasi zéro JavaScript envoyé au navigateur) et
**Tailwind CSS 4** pour les jetons de design.

---

## Modifier le contenu

Tout ce qui change régulièrement vit dans **un seul fichier** :

```
src/data/site.ts
```

Horaires, tarifs, adresse, téléphone, lien Planity. Aucun de ces textes
n'est écrit en dur dans une page.

Le fichier suit une convention simple : **tout ce qui vaut `null` est
considéré comme « à compléter »**. Le site l'affiche alors en pointillés
roses et garde un bandeau d'aperçu en haut de page. Dès qu'une vraie
valeur remplace le `null`, le pointillé disparaît — et quand plus rien ne
manque, le bandeau disparaît aussi. Rien d'autre à toucher.

### Ce qui reste à renseigner

| Donnée | Où | Forme attendue |
| --- | --- | --- |
| Lien Planity | `planityUrl` | `https://www.planity.com/…` |
| Rue, code postal, ville | `address` | chaînes de caractères |
| Téléphone | `contact.phone` | `'05 46 00 00 00'` |
| Horaires réels | `hours` puis `hoursConfirmed = true` | minutes depuis minuit |
| Grille tarifaire | `services` puis `pricesConfirmed = true` | minutes et euros |

Les horaires sont exprimés en minutes depuis minuit pour que l'affichage
et le calcul « ouvert / fermé » lisent la même source : `9 h 30` s'écrit
`9 * 60 + 30`.

---

## Développer

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère dist/
npm run preview  # sert dist/ localement
```

---

## Déployer sur Vercel

Le dépôt contient déjà `vercel.json`. Vercel détecte Astro tout seul.

Le fichier règle trois familles de cache. Les fichiers de `/_astro/`
portent une empreinte dans leur nom : cache d'un an, immuable. Les
polices de `/fonts/` ont un nom stable mais ne bougent jamais : même
traitement, avec la contrepartie décrite dans `scripts/fetch-fonts.py`.
L'image de partage et le favicon sont régénérables : un jour, avec
rafraîchissement en arrière-plan.

**JSON n'accepte pas de commentaires**, et le schéma Vercel refuse toute
clé inconnue dans une règle d'en-tête — y compris `comment`. En ajouter
fait rejeter la configuration en silence : les en-têtes ne s'appliquent
plus et rien ne le signale. D'où cette explication ici plutôt que dans le
fichier.

1. Sur [vercel.com/new](https://vercel.com/new), importer ce dépôt GitHub.
2. Laisser les réglages proposés — `astro build`, dossier `dist`.
3. Déployer.

Après le premier déploiement, reporter l'adresse réelle à **deux endroits**
qui doivent rester en phase :

- `site.url` dans `src/data/site.ts` — sert aux balises canoniques et au
  partage sur les réseaux ;
- `site:` dans `astro.config.mjs` — sert au plan de site.

---

## Choix techniques

**Astro plutôt que Next.js.** Le site est une vitrine : contenu stable,
beaucoup de photo, fort enjeu de référencement local. Astro n'expédie
presque aucun JavaScript, ce qui donne les meilleurs scores de performance
— et la performance pèse directement sur le classement en recherche
locale.

**Couleurs tirées de l'enseigne.** L'encre du script, le rose du lys, le
blanc du panneau. Les valeurs vivent dans `src/styles/global.css`, sous
`@theme`, et nulle part ailleurs. Contrastes vérifiés WCAG AA : `--rose`
plafonne à 2,87:1 et reste donc **décoratif** (filets, ornements) ; dès
qu'il s'agit de texte ou de bouton, c'est `--rose-ink` à 5,03:1.

**Une seule calligraphie.** Le script ne sert qu'au nom. Le reste est en
Cormorant Garamond et Instrument Sans. Deux écritures manuscrites qui se
disputent l'attention, c'est ce qui fait vieillir un site de salon.

**« Ouvert / fermé » calculé chez le visiteur.** Le site étant statique,
un calcul au moment du build serait figé. Le petit script lit `hours`,
résout l'heure de Paris via `Intl`, surligne le jour courant et annonce la
prochaine ouverture.

**Fiche établissement.** Un bloc JSON-LD `BeautySalon` est généré depuis
les mêmes données : c'est lui qui alimente la recherche locale Google. Il
n'émet que les champs réellement renseignés.

**Images.** La photo de façade est servie en AVIF avec repli WebP puis
JPEG, et recadrée différemment selon l'écran — cadrage large sur
ordinateur, serré sur la devanture en portrait.

---

## À faire ensuite

1. **Héberger les polices en propre.** Elles viennent aujourd'hui de
   Google Fonts, donc d'un serveur tiers à chaque visite. Pour un site
   d'entreprise française c'est un point RGPD discutable, et une requête
   externe de moins accélérerait le premier rendu.
2. **Reprendre la photo de façade.** Le fichier d'origine fait 1180 px de
   large : en plein écran sur un grand moniteur, ça reste doux. Une reprise
   au téléphone par temps lumineux, de face, suffirait.
3. **Remplacer la calligraphie par le logo vectoriel** (AI, EPS ou SVG).
4. **Pages dédiées** « Ongles » et « Cils », pour que les recherches
   distinctes n'atterrissent pas sur la même page générique.
5. **Photographies du travail réalisé** — c'est ce qui convertit sur ce
   métier.
