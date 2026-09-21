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
  { href: '#travail', label: 'Le travail' },
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
    craft: "La beauté du visage et l'épilation",
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

/* ─────────────────────────── LA GALERIE ─────────────────────────
   Photos de l'intérieur, dans l'ordre d'affichage. La clé correspond au
   nom du fichier dans src/assets/ ; les images sont préparées par
   scripts/prepare-galerie.py depuis les originaux de brand/.

   `alt` n'est pas un titre : c'est la description lue à voix haute par
   un lecteur d'écran, et ce qui s'affiche si l'image ne charge pas.
   On y décrit ce qu'on voit, pas ce qu'on voudrait vendre.            */

export const galerie = [
  {
    fichier: 'salon-1-attente.jpg',
    alt: "Le coin d'attente : un canapé en bouclette crème avec un plaid rose, "
      + "une grande lampe à abat-jour de lin, un mur framboise et un bahut peint en rose.",
  },
  {
    fichier: 'salon-2-poste-guirlande.jpg',
    alt: 'Le poste de soin vu depuis l\'entrée : table d\'esthétique, lampe loupe '
      + 'en demi-lune, rideau de guirlandes lumineuses au mur et suspension en rotin.',
  },
  {
    fichier: 'salon-3-poste-fenetre.jpg',
    alt: 'Le même poste vu de l\'autre côté, face à la fenêtre : voilages clairs, '
      + 'mur rose, miroir rond lumineux et commode blanche.',
  },
  {
    fichier: 'salon-4-manucure.jpg',
    alt: 'Le poste de manucure : plan de travail en bois clair, deux lampes '
      + "d'architecte, lampes UV, et l'enseigne au néon « Les ongles de Fia ».",
  },
];

export const galerieIntro = {
  titre: 'Le salon',
  lead: 'Un poste de soin, un coin manucure, et un canapé pour attendre.',
};

/* ───────────────────── LE TRAVAIL (réalisations) ─────────────────
   Photos fournies par le salon. Les noms de fichiers des cils sont
   volontairement neutres : on ne distingue pas à l'œil une pose cil à
   cil d'une mixte ou d'un volume russe, et nommer au hasard aurait fini
   par écrire une bêtise dans le texte de remplacement. Les descriptions
   ci-dessous disent ce qu'on voit, pas la technique employée — si le
   salon précise laquelle est laquelle, c'est ici qu'on l'écrit.        */

export type Realisation = { fichier: string; alt: string };

export const travailIntro = {
  titre: 'Le travail',
  lead: 'Quelques poses faites ici, par chacune sur sa spécialité.',
};

export const travail: { titre: string; by: string; photos: Realisation[] }[] = [
  {
    titre: 'Ongles',
    by: 'Fiacrine',
    photos: [
      {
        fichier: 'ongles-1-fleur-strass.jpg',
        alt: "Ongles amande nude ornés de strass roses, de perles dorées et d'une fleur rose en relief.",
      },
      {
        fichier: 'ongles-2-leopard-fleur.jpg',
        alt: 'Ongles nude aux pointes mouchetées de noir et fleur rose peinte, devant un laurier-rose.',
      },
      {
        fichier: 'ongles-3-french-couleurs.jpg',
        alt: 'Deux mains aux ongles rosés, pointes colorées et motifs en strass.',
      },
      {
        fichier: 'ongles-4-pois-petales.jpg',
        alt: 'Ongles rose pâle à pois framboise, pétales peints et dégradé nacré.',
      },
    ],
  },
  {
    titre: 'Cils et sourcils',
    by: 'Juliette',
    photos: [
      { fichier: 'cils-1.jpg', alt: "Gros plan d'un œil aux cils allongés et recourbés, sourcil net." },
      { fichier: 'cils-2.jpg', alt: "Gros plan d'un œil aux cils fournis et au sourcil brossé vers le haut." },
      { fichier: 'cils-3.jpg', alt: "Gros plan d'un œil aux cils longs et courbés, sourcil dessiné." },
      { fichier: 'cils-4.jpg', alt: "Gros plan de profil d'un œil aux cils longs et recourbés." },
    ],
  },
];

/* ─────────────────────────── HORAIRES ───────────────────────────
   `day` suit la convention JavaScript : 0 = dimanche … 6 = samedi.
   Heures en minutes depuis minuit (9 h 30 → 9 * 60 + 30).
   `open: null` = fermé ce jour-là.                                 */

export const hoursConfirmed = true;

export type Day = { day: number; label: string; open: number | null; close: number | null };

export const hours: Day[] = [
  { day: 1, label: 'lundi', open: 9 * 60 + 30, close: 19 * 60 + 30 },
  { day: 2, label: 'mardi', open: 9 * 60 + 30, close: 19 * 60 + 30 },
  { day: 3, label: 'mercredi', open: 9 * 60 + 30, close: 19 * 60 + 30 },
  { day: 4, label: 'jeudi', open: 9 * 60 + 30, close: 19 * 60 + 30 },
  { day: 5, label: 'vendredi', open: 9 * 60 + 30, close: 19 * 60 + 30 },
  { day: 6, label: 'samedi', open: 8 * 60, close: 12 * 60 },
  { day: 0, label: 'dimanche', open: null, close: null },
];

/* ─────────────────────────── PRESTATIONS ────────────────────────
   Intitulés, durées et prix relevés sur Planity, regroupés en quatre
   univers pour rester lisibles sur une page unique. `note` reprend la
   précision que Planity affiche sous certaines prestations.

   La liste complète tient dans la page Planity, mais **le HTML livré
   n'en montre que les cinq premières par catégorie** — le reste attend
   un clic sur « voir les N autres ». Une première reprise s'était donc
   arrêtée à 44 prestations sur 77. `scripts/verifie-tarifs.py` relit la
   source et signale tout écart : le lancer plutôt que recopier à la
   main.                                                            */

export const pricesConfirmed = true;
export const pricesCheckedOn = '21 septembre 2026';

export type Service = { name: string; minutes: number; price: number; note?: string };
export type Category = { title: string; items: Service[] };
/** Chaque univers est tenu par une seule praticienne : `by` est donc
    porté ici, et non répété sur chaque catégorie. */
export type Universe = {
  key: string;
  label: string;
  by: string;
  blurb: string;
  categories: Category[];
};

export const universes: Universe[] = [
  {
    key: 'ongles',
    label: 'Ongles',
    by: 'Fiacrine',
    blurb:
      'Pose gel avec ou sans extensions, remplissage, semi-permanent mains et pieds, nail art, dépose et réparation.',
    categories: [
      {
        title: 'Ongles en gel',
        items: [
          { name: 'Pose complète popit (avec extensions)', minutes: 90, price: 45, note: 'Rallongement en gel' },
          { name: 'Gel sur ongles naturels', minutes: 60, price: 35, note: 'Pose de gel (Sans extensions, sans dépose)' },
          { name: 'Remplissage', minutes: 90, price: 38, note: 'Dépose + repose de gel' },
          { name: 'Nail art niv. 1', minutes: 15, price: 5, note: 'French/baby/chrome' },
          { name: 'Nail art niv. 2', minutes: 15, price: 10, note: 'Double nail art (French + chrome/ French + baby)' },
          { name: 'Nail art niv. 3', minutes: 30, price: 15, note: 'Nail art technique (citron, 3D, dessins)' },
          { name: 'Dépose gel + soin', minutes: 45, price: 15 },
          { name: 'Réparation ongle cassé', minutes: 15, price: 2, note: 'par ongle' },
        ],
      },
      {
        title: 'Semi-permanent, mains et pieds',
        items: [
          { name: 'Vernis semi permanent mains', minutes: 45, price: 30, note: 'Pas de gel (couleur uniquement)' },
          { name: 'Vernis semi permanent pieds', minutes: 45, price: 30, note: 'Pas de gel' },
          { name: 'French/baby', minutes: 15, price: 5 },
          { name: 'Forfait mains + pieds (semi permanent uniquement)', minutes: 75, price: 40, note: 'Sans gel' },
          { name: 'Dépose + repose semi permanent mains + pieds', minutes: 90, price: 50 },
          { name: 'Dépose semi permanent + soin', minutes: 30, price: 10 },
        ],
      },
    ],
  },
  {
    key: 'cils',
    label: 'Cils',
    by: 'Juliette',
    blurb:
      'Extensions cil à cil, mixte ou volume russe, remplissages, dépose, rehaussement et teinture.',
    categories: [
      {
        title: 'Extensions de cils',
        items: [
          { name: 'Pose complète Cil à Cil', minutes: 90, price: 50, note: 'une extension sur un cil naturel sur l\'intégralité de l\'œil' },
          { name: 'Remplissage 2 semaines Cil à Cil', minutes: 45, price: 30 },
          { name: 'Remplissage 3/4 semaines Cil à Cil', minutes: 60, price: 45 },
          { name: 'Pose complète Mixte', minutes: 105, price: 60, note: 'une extension sur un cil naturel et un bouquet sur un cil naturel pour donner un peu plus de volume sur l\'intégralité de l\'œil' },
          { name: 'Remplissage 2 semaines Mixte', minutes: 60, price: 40 },
          { name: 'Remplissage 3/4 semaines Mixte', minutes: 75, price: 55 },
          { name: 'Pose complète Volume Russe', minutes: 120, price: 70, note: 'un bouquet sur un cil naturel sur l\'intégralité de l\'œil' },
          { name: 'Remplissage 2 semaines Volume Russe', minutes: 70, price: 50 },
          { name: 'Remplissage 3/4 semaines Volume Russe', minutes: 90, price: 65 },
          { name: 'Dépose Extensions de cils de ma pose (rajout selon la durée)', minutes: 30, price: 10 },
          { name: 'Dépose Extensions de cils d\'une autre Technicienne de cils (rajout selon la durée)', minutes: 30, price: 15 },
        ],
      },
      {
        title: 'Rehaussement et teinture des cils',
        items: [
          { name: 'Rehaussement de cils + Teinture noir classique', minutes: 90, price: 40, note: 'Recourbement des cils naturel sur une durée de 5 à 6 semaines' },
          { name: 'Teinture classique des cils noir', minutes: 30, price: 15 },
        ],
      },
    ],
  },
  {
    key: 'visage',
    label: 'Sourcils et visage',
    by: 'Juliette',
    blurb:
      'Browlift, teinture classique ou hybride, épilation du visage au fil.',
    categories: [
      {
        title: 'Browlift',
        items: [
          { name: 'Browlift', minutes: 30, price: 40 },
          { name: 'Browlift + Epilation', minutes: 45, price: 45 },
          { name: 'Browlift + Teinture + Epilation', minutes: 70, price: 50 },
        ],
      },
      {
        title: 'Teintures des sourcils',
        items: [
          { name: 'Teinture Classique des Sourcils', minutes: 30, price: 17, note: 'Teint la peau pendant quelques jours et les poils jusqu\'à 3 semaines' },
          { name: 'Teinture Classique des sourcils + Epilation', minutes: 60, price: 30 },
          { name: 'Teinture hybride', minutes: 30, price: 20, note: 'Teint la peau et le poil' },
          { name: 'Teinture hybride + épilation', minutes: 60, price: 35, note: 'Teint la peau et le poil' },
        ],
      },
      {
        title: 'Épilation du visage au fil',
        items: [
          { name: 'Sourcils au fil', minutes: 20, price: 15 },
          { name: 'Lèvre au fil', minutes: 20, price: 10 },
          { name: 'Menton au fil', minutes: 15, price: 7 },
          { name: 'Joues au fil', minutes: 30, price: 12 },
          { name: 'Sourcils + Lèvre au fil', minutes: 30, price: 20 },
          { name: 'Sourcils + Lèvre + Menton au fil', minutes: 35, price: 27 },
          { name: 'Menton + Joues au fil', minutes: 40, price: 15 },
        ],
      },
    ],
  },
  {
    key: 'epilation',
    label: 'Épilation à la cire',
    by: 'Juliette',
    blurb:
      'Du sourcil aux jambes complètes, à l\'unité ou en forfait, pour elle et pour lui.',
    categories: [
      {
        title: 'Femme, à l’unité',
        items: [
          { name: 'Sourcils entretien', minutes: 20, price: 12 },
          { name: 'Lèvre', minutes: 10, price: 9 },
          { name: 'Menton', minutes: 10, price: 6 },
          { name: 'Joues', minutes: 11, price: 8 },
          { name: 'Aisselles', minutes: 15, price: 12 },
          { name: 'Demi-bras', minutes: 15, price: 16 },
          { name: 'Bras complet', minutes: 18, price: 18 },
          { name: 'Bas du dos', minutes: 15, price: 8 },
          { name: 'Nombril', minutes: 10, price: 5 },
          { name: 'Maillot Simple', minutes: 15, price: 12 },
          { name: 'Maillot échancré', minutes: 20, price: 15 },
          { name: 'Maillot brésilien', minutes: 30, price: 18 },
          { name: 'Maillot brésilien + sif', minutes: 45, price: 23 },
          { name: 'Maillot Intégral', minutes: 40, price: 22 },
          { name: 'Maillot intégral + sif', minutes: 50, price: 25 },
          { name: 'Cuisses', minutes: 25, price: 18 },
          { name: 'Demi-jambes', minutes: 20, price: 15 },
          { name: 'Jambes complètes', minutes: 35, price: 28 },
        ],
      },
      {
        title: 'Femme, forfaits',
        items: [
          { name: 'Sourcils + lèvres', minutes: 30, price: 17 },
          { name: 'Lèvre + Menton', minutes: 25, price: 12 },
          { name: 'Sourcils + lèvres + menton', minutes: 30, price: 23 },
          { name: 'Sourcils + lèvres + menton + joues', minutes: 45, price: 32 },
          { name: 'Aisselles + demi-jambes + maillot échancré', minutes: 45, price: 38 },
          { name: 'Aisselles + jambes complètes + maillot échancré', minutes: 60, price: 48 },
          { name: 'Aisselles + demi-jambes + maillot intégral + sif', minutes: 80, price: 48 },
          { name: 'Aisselles + jambes complètes + maillot intégral + sif', minutes: 90, price: 58 },
        ],
      },
      {
        title: 'Homme',
        items: [
          { name: 'Sourcils', minutes: 20, price: 15 },
          { name: 'Oreilles', minutes: 15, price: 10 },
          { name: 'Nez', minutes: 10, price: 6 },
          { name: 'Aisselles', minutes: 20, price: 14 },
          { name: 'Torse', minutes: 30, price: 20 },
          { name: 'Nombril', minutes: 10, price: 7 },
          { name: 'Dos', minutes: 30, price: 25 },
          { name: 'Demi-jambes', minutes: 25, price: 18 },
          { name: 'Jambes complètes', minutes: 30, price: 30 },
          { name: 'Torse + Dos + Nombril', minutes: 60, price: 48 },
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
      activite: 'Beauté du visage et épilation',
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
