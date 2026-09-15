/**
 * ─────────────────────────────────────────────────────────────
 *  LE SEUL FICHIER À MODIFIER POUR METTRE LE SITE À JOUR
 * ─────────────────────────────────────────────────────────────
 *
 *  Horaires et tarifs sont recopiés de la fiche Planity du salon
 *  (relevé du 14 septembre 2026). Planity reste la source de
 *  vérité : en cas d'écart c'est Planity qui a raison, et le site
 *  y renvoie pour la réservation.
 *
 *  Tout ce qui vaut `null` est traité comme « à compléter » :
 *  le champ est masqué ou souligné en pointillés selon le cas.
 */

export const site = {
  name: "Lily's Beauty",
  tagline: 'Institut de beauté',
  url: 'https://lilysbeauty.vercel.app',
  description:
    "Institut de beauté à Laudun-l'Ardoise : prothésie ongulaire, extensions de cils, rehaussement, teinture et épilation des sourcils, épilation au fil. Réservation en ligne sur Planity.",
} as const;

export const planityUrl: string | null =
  'https://www.planity.com/lilys-beauty-30290-laudun-lardoise';

/** Destination du bouton « Réserver ». On vise Planity directement : un
    bouton d'action doit agir, pas faire défiler vers un paragraphe qui
    explique l'action. La section #reserver reste dans le fil de la page.
    Repli sur cette section tant que le lien Planity n'est pas renseigné. */
export const bookHref = planityUrl ?? '#reserver';
export const bookIsExternal = planityUrl !== null;

export const contact = {
  /** Décision du salon : pas de numéro public. Tout passe par Planity.
      Renseigner ici ferait réapparaître la ligne « Téléphone ». */
  phone: null as string | null,
  email: null as string | null,
};

export const address = {
  streetNumber: '254',
  street: 'Rue de la République',
  postalCode: '30290',
  city: "Laudun-l'Ardoise",
  country: 'FR',
  directions: null as string | null,
};

/** Coordonnées du salon, relevées sur sa fiche Planity.
    La carte affichée est une image générée au build à partir de ces
    coordonnées : aucun service tiers n'est appelé chez le visiteur.
    Pour la régénérer après un déménagement : scripts/generate-map.py */
export const geo = { lat: 44.1055174, lon: 4.6590543 };

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lon}`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${geo.lat},${geo.lon}`;

/** Les ancres de la page, partagées par l'en-tête, le menu mobile et le pied.
    Une seule liste : ajouter une section ici la fait apparaître aux trois
    endroits. L'ordre suit celui des sections dans la page.

    « Rendez-vous » mène à la section qui explique comment la réservation
    fonctionne — à ne pas confondre avec le bouton « Réserver », qui ouvre
    Planity. L'un renseigne, l'autre agit.

    « Nous trouver » désigne la section qui porte l'adresse, le plan et le
    lien d'itinéraire. Elle s'appelait « Le salon », ce qui ne disait pas
    qu'on y trouve la localisation. */
/** Lien vers une section, depuis n'importe quelle page du site.

    Écrit « /#tarifs » et non « #tarifs ». Une ancre seule désigne une
    cible dans la page courante : depuis /mentions-legales, où ces
    sections n'existent pas, les liens de l'en-tête ne faisaient
    strictement rien. Sur l'accueil les deux formes se valent, le chemin
    étant identique — le navigateur ne recharge pas. */
export const lienSection = (href: string) => '/' + href;

export const sections = [
  { href: '#tarifs', label: 'Prestations et tarifs' },
  { href: '#horaires', label: 'Horaires' },
  { href: '#reserver', label: 'Rendez-vous' },
  { href: '#acces', label: 'Nous trouver' },
];

/** Les deux praticiennes, telles que Planity les attribue aux prestations.
    `instagram` : URL propre du compte, sans le paramètre `?stkn=` que
    l'application ajoute au partage — c'est un jeton lié au compte qui a
    copié le lien, il n'a rien à faire sur une page publique. */
export const practitioners = [
  {
    name: 'Fiacrine',
    craft: 'Les ongles',
    instagram: 'https://www.instagram.com/lesonglesdefia/',
  },
  {
    name: 'Juliette',
    craft: "Les cils, les sourcils et l'épilation",
    instagram: 'https://www.instagram.com/joliscils30/',
  },
];

/** « https://www.instagram.com/joliscils30/ » → « @joliscils30 » */
export const pseudo = (url: string) =>
  '@' + url.replace(/\/+$/, '').split('/').pop();

/** Présentation du salon, reprise du texte Planity et resserrée. */
export const about = {
  lead: "Un cocon au cœur de Laudun-l'Ardoise.",
  body: [
    "Décoration claire, lumière douce, et deux professionnelles qui prennent le temps de faire les choses correctement.",
    "Épilation nette, rehaussement de cils pour un regard ouvert, sourcils redessinés et teintés, extensions, pose et dépose de faux ongles, gel et remplissage : la carte est large, mais chaque prestation est tenue par celle qui en a fait sa spécialité.",
  ],
};

/* ─────────────────────────── HORAIRES ───────────────────────────
   `day` suit la convention JavaScript : 0 = dimanche … 6 = samedi.
   Heures en minutes depuis minuit (9 h 30 → 9 * 60 + 30).
   `open: null` = fermé ce jour-là.                                 */

export const hoursConfirmed = true;

export type Day = { day: number; label: string; open: number | null; close: number | null };

export const hours: Day[] = [
  { day: 1, label: 'lundi', open: 9 * 60, close: 20 * 60 },
  { day: 2, label: 'mardi', open: 9 * 60, close: 20 * 60 },
  { day: 3, label: 'mercredi', open: 9 * 60, close: 20 * 60 },
  { day: 4, label: 'jeudi', open: 9 * 60, close: 20 * 60 },
  { day: 5, label: 'vendredi', open: 9 * 60, close: 20 * 60 },
  { day: 6, label: 'samedi', open: 8 * 60, close: 17 * 60 },
  { day: 0, label: 'dimanche', open: null, close: null },
];

/* ─────────────────────────── PRESTATIONS ────────────────────────
   Intitulés recopiés mot pour mot de Planity, regroupés en trois
   univers pour rester lisibles sur une page unique.               */

export const pricesConfirmed = true;
export const pricesCheckedOn = '14 septembre 2026';

export type Service = { name: string; minutes: number; price: number };
export type Category = { title: string; by: string; items: Service[] };
export type Universe = { key: string; label: string; blurb: string; categories: Category[] };

export const universes: Universe[] = [
  {
    key: 'ongles',
    label: 'Ongles',
    blurb: 'Pose gel avec ou sans extensions, remplissage, semi-permanent mains et pieds, nail art.',
    categories: [
      {
        title: 'Ongles en gel',
        by: 'Fiacrine',
        items: [
          { name: 'Pose complète popit (avec extensions)', minutes: 90, price: 45 },
          { name: 'Gel sur ongles naturels', minutes: 60, price: 35 },
          { name: 'Remplissage', minutes: 90, price: 38 },
          { name: 'Nail art niv. 1', minutes: 15, price: 5 },
          { name: 'Nail art niv. 2', minutes: 15, price: 10 },
        ],
      },
      {
        title: 'Semi permanent (mains et/ou pieds)',
        by: 'Fiacrine',
        items: [
          { name: 'Vernis semi permanent mains', minutes: 45, price: 30 },
          { name: 'Vernis semi permanent pieds', minutes: 45, price: 30 },
          { name: 'French/baby', minutes: 15, price: 5 },
          { name: 'Forfait mains + pieds (semi permanent uniquement)', minutes: 75, price: 40 },
          { name: 'Dépose + repose semi permanent mains + pieds', minutes: 90, price: 50 },
        ],
      },
    ],
  },
  {
    key: 'cils',
    label: 'Cils',
    blurb: 'Extensions cil à cil ou mixte, remplissage, rehaussement et teinture.',
    categories: [
      {
        title: 'Extensions de cils',
        by: 'Juliette',
        items: [
          { name: 'Pose complète Cil à Cil', minutes: 90, price: 50 },
          { name: 'Remplissage 2 semaines Cil à Cil', minutes: 45, price: 30 },
          { name: 'Remplissage 3/4 semaines Cil à Cil', minutes: 60, price: 45 },
          { name: 'Pose complète Mixte', minutes: 105, price: 60 },
          { name: 'Remplissage 2 semaines Mixte', minutes: 60, price: 40 },
        ],
      },
      {
        title: 'Rehaussement et teinture des cils',
        by: 'Juliette',
        items: [
          { name: 'Rehaussement de cils + Teinture noir classique', minutes: 90, price: 40 },
          { name: 'Teinture classique des cils noir', minutes: 30, price: 15 },
        ],
      },
    ],
  },
  {
    key: 'sourcils',
    label: 'Sourcils et épilation',
    blurb:
      'Browlift, teinture classique ou hybride, épilation à la cire ou au fil, forfaits, prestations homme.',
    categories: [
      {
        title: 'Browlift',
        by: 'Juliette',
        items: [
          { name: 'Browlift', minutes: 30, price: 40 },
          { name: 'Browlift + Epilation', minutes: 45, price: 45 },
          { name: 'Browlift + Teinture + Epilation', minutes: 70, price: 50 },
        ],
      },
      {
        title: 'Teintures des sourcils',
        by: 'Juliette',
        items: [
          { name: 'Teinture Classique des Sourcils', minutes: 30, price: 17 },
          { name: 'Teinture Classique des sourcils + Epilation', minutes: 60, price: 30 },
          { name: 'Teinture hybride', minutes: 30, price: 20 },
          { name: 'Teinture hybride + épilation', minutes: 60, price: 35 },
        ],
      },
      {
        title: 'Épilation du visage au fil',
        by: 'Juliette',
        items: [
          { name: 'Sourcils au fil', minutes: 20, price: 15 },
          { name: 'Lèvre au fil', minutes: 20, price: 10 },
          { name: 'Menton au fil', minutes: 15, price: 7 },
          { name: 'Joues au fil', minutes: 30, price: 12 },
          { name: 'Sourcils + Lèvre au fil', minutes: 30, price: 20 },
        ],
      },
      {
        title: 'Épilations femme',
        by: 'Juliette',
        items: [
          { name: 'Sourcils entretien', minutes: 20, price: 12 },
          { name: 'Lèvre', minutes: 10, price: 9 },
          { name: 'Menton', minutes: 10, price: 6 },
          { name: 'Joues', minutes: 11, price: 8 },
          { name: 'Aisselles', minutes: 15, price: 12 },
        ],
      },
      {
        title: 'Forfaits épilation à la cire femme',
        by: 'Juliette',
        items: [
          { name: 'Sourcils + lèvres', minutes: 30, price: 17 },
          { name: 'Lèvre + Menton', minutes: 25, price: 12 },
          { name: 'Sourcils + lèvres + menton', minutes: 30, price: 23 },
          { name: 'Sourcils + lèvres + menton + joues', minutes: 45, price: 32 },
          { name: 'Aisselles + demi-jambes + maillot échancré', minutes: 45, price: 38 },
        ],
      },
      {
        title: 'Épilations homme',
        by: 'Juliette',
        items: [
          { name: 'Sourcils', minutes: 20, price: 15 },
          { name: 'Oreilles', minutes: 15, price: 10 },
          { name: 'Nez', minutes: 10, price: 6 },
          { name: 'Aisselles', minutes: 20, price: 14 },
          { name: 'Torse', minutes: 30, price: 20 },
        ],
      },
    ],
  },
];

/* ─────────────────── AVIS (relevés sur la fiche Planity) ───────── */

export const rating = { show: true, value: 4.99, count: 130, source: 'Planity' };

/* ─────────────────────── MENTIONS LÉGALES ───────────────────────
   Obligatoires pour tout site professionnel (article 6-III de la LCEN).
   Le salon réunit DEUX auto-entreprises distinctes partageant un local
   et une enseigne : chacune doit donc apparaître avec son propre SIRET.

   Les `null` s'affichent en pointillés sur /mentions-legales et doivent
   être remplis. Le SIRET se retrouve en cherchant son nom sur
   annuaire-entreprises.data.gouv.fr                                   */

export const legal = {
  /** Une seule personne est responsable de la publication du site. */
  directricePublication: null as string | null,

  entreprises: [
    {
      praticienne: 'Fiacrine',
      /** Nom et prénom de l'exploitante, tels qu'immatriculés. */
      denomination: null as string | null,
      forme: 'Entrepreneur individuel (auto-entreprise)',
      siret: null as string | null,
      activite: 'Prothésie ongulaire',
    },
    {
      praticienne: 'Juliette',
      denomination: null as string | null,
      forme: 'Entrepreneur individuel (auto-entreprise)',
      siret: null as string | null,
      activite: 'Soins des cils, des sourcils et épilation',
    },
  ],

  /** Régime de TVA. Vrai tant que le chiffre d'affaires reste sous le seuil. */
  franchiseTva: true,

  hebergeur: {
    nom: 'Vercel Inc.',
    adresse: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis',
    site: 'https://vercel.com',
  },
};

/* ───────────────────── CE QUI RESTE À COMPLÉTER ─────────────────
   Le téléphone n'y figure pas : Planity n'en publie pas, la ligne
   est simplement masquée tant qu'il vaut `null`.                   */

export const pending = [
  planityUrl === null && 'le lien Planity',
  address.street === null && 'la rue',
  !hoursConfirmed && 'les horaires',
  !pricesConfirmed && 'les tarifs',
].filter(Boolean) as string[];
