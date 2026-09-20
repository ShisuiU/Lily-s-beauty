/**
 * ─────────────────────────────────────────────────────────────
 *  LE SEUL FICHIER À MODIFIER POUR HABILLER LE SITE
 * ─────────────────────────────────────────────────────────────
 *
 *  Tout ce que le visiteur lit est ici : le nom, les textes, les
 *  horaires, la carte des prestations, les photos, les mentions
 *  légales. Les composants ne font que mettre en forme — on ne devrait
 *  pas avoir à les ouvrir pour livrer un premier site.
 *
 *  Les valeurs livrées sont des EXEMPLES. Elles décrivent un institut
 *  imaginaire, assez complet pour que la maquette se regarde en entier.
 *  Remplacez-les par les vôtres : le fichier se lit de haut en bas dans
 *  l'ordre de la page.
 *
 *  `null` ne veut pas dire « vide » mais « pas de donnée » : la ligne
 *  correspondante disparaît de la page au lieu d'afficher un trou.
 *  C'est vrai du téléphone, du lien de réservation, du SIRET, de la
 *  photo de façade.
 */

/* ─────────────────────────── LE GABARIT ─────────────────────────
   Tant que ceci vaut `true`, un bandeau noir en haut de page annonce
   qu'il s'agit d'une démonstration. À passer à `false` le jour où les
   vrais textes, les vraies photos et les vrais tarifs sont en place —
   c'est la dernière chose à faire avant la mise en ligne.            */

export const gabarit = true;

/* ─────────────────────────── L'ENSEIGNE ────────────────────────── */

export const site = {
  name: 'Votre Institut',
  tagline: 'Institut de beauté',
  /** Adresse définitive du site. Doit rester en phase avec `site` dans
      astro.config.mjs (la config Astro est chargée avant l'app, on évite
      d'y importer du TypeScript). */
  url: 'https://votre-institut.vercel.app',
  /** 150 à 160 signes : c'est ce que Google affiche sous le titre.
      On y met le métier, la ville et les prestations phares. */
  description:
    "Institut de beauté à Votre Ville : ongles, cils et sourcils, soins du visage, "
    + "épilation à la cire. Réservation en ligne, du mardi au samedi.",
} as const;

/** Logo de l'en-tête et du pied de page.

    Tant que c'est `null`, le nom s'écrit en toutes lettres dans la
    fonte du site — ce qui est très bien tant que l'institut n'a pas de
    logo, et évite le placeholder gris qui traîne sur la moitié des
    maquettes.

    Pour poser un vrai logo : déposer le fichier dans `public/`,
    renseigner son chemin et son rapport largeur/hauteur. L'en-tête le
    peint en **masque** (voir `.brand` dans global.css) : le fichier doit
    donc porter la forme dans sa transparence — un PNG détouré ou un SVG
    monochrome — et non des couleurs, puisque c'est la page qui les
    donne. C'est ce qui permet au logo d'être blanc sur la photo du haut
    puis encre une fois la barre devenue opaque. */
export const brand = {
  /** Fichier monochrome pour l'en-tête, déposé dans `public/`.
      Ex. '/logo-mark.png' ou '/logo-mark.svg'. */
  logo: null as string | null,
  /** Rapport du fichier, tel quel : '560 / 132'. */
  logoRatio: '560 / 132',
  /** Hauteur d'affichage dans l'en-tête, en pixels. Vérifié de 27 à 40. */
  logoHeight: 34,

  /** Le même logo, mais en couleurs, pour le pied de page : là il est
      posé sur le blanc de la page et n'a plus à s'adapter au fond.
      `null` → le nom s'écrit en toutes lettres, comme dans l'en-tête. */
  logoCouleur: null as string | null,
  logoCouleurRatio: '1300 / 366',
};

/* ─────────────────────────── RÉSERVATION ────────────────────────
   Trois cas, dans cet ordre de préséance :

   1. `url` renseignée  → le bouton ouvre l'agenda en ligne.
   2. `url` à null mais un téléphone plus bas → le bouton appelle.
   3. ni l'un ni l'autre → le bouton descend à la section « Rendez-vous ».

   `enseigne` est le nom du service de réservation (Planity, Treatwell,
   Kiute, Wavy…). Il apparaît dans la section « Rendez-vous » et dans les
   mentions légales. Mettre `null` si la prise de rendez-vous se fait par
   téléphone ou par message.                                          */

export const reservation = {
  enseigne: 'Planity' as string | null,
  url: 'https://www.planity.com/' as string | null,
  /** Les quatre lignes de la colonne de droite dans « Rendez-vous ». */
  etapes: [
    "Choisissez la prestation : la durée et le tarif s'affichent avant de valider.",
    "Prenez un créneau réellement disponible dans l'agenda de l'institut.",
    'Laissez un numéro : le rappel part automatiquement la veille.',
    "Un empêchement ? L'annulation se fait depuis le même lien, sans appeler.",
  ],
};

export const contact = {
  /** Renseigner fait apparaître la ligne « Téléphone » dans « Nous
      trouver », et sert de repli au bouton « Réserver ». */
  phone: null as string | null,
  email: null as string | null,
};

export const bookHref = reservation.url ?? (contact.phone ? `tel:${contact.phone.replace(/\s/g, '')}` : '#reserver');
export const bookIsExternal = reservation.url !== null;
export const bookLabel = reservation.url || !contact.phone ? 'Réserver' : 'Appeler';

/* ──────────────────────────── L'ADRESSE ───────────────────────── */

export const address = {
  streetNumber: '12',
  street: 'Rue des Exemples',
  postalCode: '00000',
  city: 'Votre Ville',
  country: 'FR',
  /** Une précision d'accès : « parking gratuit devant », « au fond de la
      cour », « entrée par la rue latérale ». `null` masque la ligne. */
  directions: null as string | null,
};

/** Coordonnées GPS. La carte affichée est une image fabriquée à la
    construction du site à partir de ces deux nombres : aucun service
    tiers n'est appelé chez le visiteur, donc aucune bannière cookies à
    cause d'une carte embarquée.
    Pour la régénérer après un déménagement : scripts/generate-map.py
    (les coordonnées se relèvent d'un clic droit sur Google Maps). */
export const geo = { lat: 48.858370, lon: 2.294481 };

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lon}`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${geo.lat},${geo.lon}`;

/* ──────────────────────────── LA PAGE ─────────────────────────── */

/** Les ancres de la page, partagées par l'en-tête, le menu mobile et le
    pied. Une seule liste : retirer une section ici la fait disparaître
    des trois endroits. L'ordre suit celui des sections dans la page —
    à tenir en phase avec src/pages/index.astro.

    « Rendez-vous » mène à la section qui explique comment réserver, à ne
    pas confondre avec le bouton « Réserver », qui ouvre l'agenda. L'un
    renseigne, l'autre agit. */
export const sections = [
  { href: '#tarifs', label: 'Prestations et tarifs' },
  { href: '#travail', label: 'Le travail' },
  { href: '#horaires', label: 'Horaires' },
  { href: '#reserver', label: 'Rendez-vous' },
  { href: '#acces', label: 'Nous trouver' },
];

/** Lien vers une section depuis n'importe quelle page du site.

    Écrit « /#tarifs » et non « #tarifs ». Une ancre seule désigne une
    cible dans la page courante : depuis /mentions-legales, où ces
    sections n'existent pas, les liens de l'en-tête ne feraient
    strictement rien. */
export const lienSection = (href: string) => '/' + href;

/* ──────────────────────── LE BANDEAU D'ACCUEIL ──────────────────
   Le titre se compose en trois morceaux pour que le fragment du milieu
   passe en italique — c'est la seule fantaisie typographique de la page,
   elle mérite d'être choisie. Mettre `accent: null` pour un titre d'un
   seul tenant.                                                       */

export const hero = {
  titre: {
    avant: 'Ongles, ',
    accent: 'cils et sourcils',
    apres: ', soins et épilation',
  },
  lead:
    "Manucure et pose gel, rehaussement et extensions de cils, soins du visage, "
    + "épilation à la cire. Sur rendez-vous, du mardi au samedi.",
  /** Second bouton, discret, à côté de « Réserver ». `null` le retire. */
  lienSecondaire: { href: '#tarifs', label: 'Voir les tarifs' } as { href: string; label: string } | null,
};

/* ─────────────────────────── L'ÉQUIPE ───────────────────────────
   Une praticienne, deux, quatre : la mise en page suit. `instagram`
   attend l'URL propre du compte, sans le paramètre `?stkn=` que
   l'application ajoute au partage — c'est un jeton lié au compte qui a
   copié le lien, il n'a rien à faire sur une page publique.
   Mettre la liste à vide retire le bloc.                             */

export const equipe = {
  lead: "Un institut de quartier tenu par <em>deux praticiennes</em>, chacune sur sa spécialité.",
  body:
    "Camille s'occupe des ongles, Manon du regard, des soins et de l'épilation. Chaque "
    + "prestation est réservée pour sa durée réelle : dix minutes pour un sourcil, près de "
    + "deux heures pour une pose complète. Personne n'est expédié.",
  membres: [
    {
      name: 'Camille',
      craft: 'Les ongles',
      instagram: null as string | null,
    },
    {
      name: 'Manon',
      craft: "Le regard, les soins et l'épilation",
      instagram: null as string | null,
    },
  ],
};

/** « https://www.instagram.com/monsalon/ » → « @monsalon » */
export const pseudo = (url: string) =>
  '@' + url.replace(/\/+$/, '').split('/').pop();

/** Présentation de l'institut, dans la section « Nous trouver ».
    Deux paragraphes suffisent : ce n'est pas une page « à propos », le
    visiteur cherche surtout l'adresse. */
export const about = {
  lead: 'Un cocon au cœur de Votre Ville.',
  /** Description de la photo qui accompagne le texte. */
  photoAlt: "La façade de l'institut vue depuis la rue.",
  body: [
    "Décoration claire, lumière douce, et des professionnelles qui prennent le temps de "
    + "faire les choses correctement.",
    "Épilation nette, rehaussement de cils pour un regard ouvert, sourcils redessinés, "
    + "pose et remplissage de gel, soins du visage : la carte est large, mais chaque "
    + "prestation est tenue par celle qui en a fait sa spécialité.",
  ],
};

/* ─────────────────────────── LA GALERIE ─────────────────────────
   Les photos de l'intérieur, dans l'ordre du ruban défilant. La clé est
   le nom du fichier dans src/assets/ ; les images livrées sont des
   aplats de couleur qui tiennent la place. Préparez les vraies avec
   scripts/prepare-photos.py (recadrage, réduction, effacement des
   métadonnées EXIF — un fichier sorti d'un téléphone embarque le modèle
   de l'appareil et parfois les coordonnées GPS du lieu).

   `alt` n'est pas un titre : c'est la description lue à voix haute par
   un lecteur d'écran, et ce qui s'affiche si l'image ne charge pas. On y
   décrit ce qu'on voit, pas ce qu'on voudrait vendre.                */

export const galerieIntro = {
  titre: 'Le salon',
  lead: 'Un poste de soin, un coin manucure, et un fauteuil pour attendre.',
};

export const galerie = [
  { fichier: 'salon-1.jpg', alt: "Le coin d'attente : un fauteuil clair, une grande lampe et un mur pastel." },
  { fichier: 'salon-2.jpg', alt: "Le poste de soin vu depuis l'entrée : table d'esthétique et lampe loupe." },
  { fichier: 'salon-3.jpg', alt: 'Le même poste face à la fenêtre : voilages clairs et miroir rond lumineux.' },
  { fichier: 'salon-4.jpg', alt: 'Le poste de manucure : plan de travail en bois clair et lampes UV.' },
];

/* ───────────────────── LE TRAVAIL (réalisations) ─────────────────
   Deux groupes de quatre photos ici, mais la grille accepte d'autres
   nombres. `by` nomme la praticienne sous le titre du groupe ; `null`
   retire la mention — c'est le réglage d'un institut tenu seul.      */

export type Realisation = { fichier: string; alt: string };

export const travailIntro = {
  titre: 'Le travail',
  lead: 'Quelques réalisations faites ici, par chacune sur sa spécialité.',
};

export const travail: { titre: string; by: string | null; photos: Realisation[] }[] = [
  {
    titre: 'Ongles',
    by: 'Camille',
    photos: [
      { fichier: 'travail-ongles-1.jpg', alt: 'Ongles amande nude ornés de strass et de motifs peints.' },
      { fichier: 'travail-ongles-2.jpg', alt: 'French colorée sur ongles courts, finition nacrée.' },
      { fichier: 'travail-ongles-3.jpg', alt: 'Pose gel rose pâle avec dégradé et fleurs en relief.' },
      { fichier: 'travail-ongles-4.jpg', alt: 'Ongles bordeaux brillants, forme carrée arrondie.' },
    ],
  },
  {
    titre: 'Cils et sourcils',
    by: 'Manon',
    photos: [
      { fichier: 'travail-regard-1.jpg', alt: "Gros plan d'un œil aux cils allongés et recourbés, sourcil net." },
      { fichier: 'travail-regard-2.jpg', alt: "Gros plan d'un œil aux cils fournis et au sourcil brossé vers le haut." },
      { fichier: 'travail-regard-3.jpg', alt: "Gros plan d'un œil aux cils longs et courbés, sourcil dessiné." },
      { fichier: 'travail-regard-4.jpg', alt: "Gros plan de profil d'un œil aux cils longs et recourbés." },
    ],
  },
];

/* ─────────────────────────── HORAIRES ───────────────────────────
   `day` suit la convention JavaScript : 0 = dimanche … 6 = samedi.
   Heures en minutes depuis minuit (9 h 30 → 9 * 60 + 30).
   `open: null` = fermé ce jour-là.

   L'ouverture affichée en haut de page (« Ouvert · ferme à 19 h ») est
   calculée chez le visiteur, sur l'heure de Paris, à partir de cette
   grille : rien d'autre à tenir à jour.                              */

export const hoursConfirmed = true;

export type Day = { day: number; label: string; open: number | null; close: number | null };

export const hours: Day[] = [
  { day: 1, label: 'lundi', open: null, close: null },
  { day: 2, label: 'mardi', open: 9 * 60, close: 19 * 60 },
  { day: 3, label: 'mercredi', open: 9 * 60, close: 19 * 60 },
  { day: 4, label: 'jeudi', open: 9 * 60, close: 19 * 60 },
  { day: 5, label: 'vendredi', open: 9 * 60, close: 19 * 60 },
  { day: 6, label: 'samedi', open: 9 * 60, close: 17 * 60 },
  { day: 0, label: 'dimanche', open: null, close: null },
];

/* ─────────────────────────── PRESTATIONS ────────────────────────
   Quatre univers, chacun replié derrière son titre : c'est ce qui
   permet de tenir une carte de soixante lignes sur une page unique sans
   noyer le visiteur.

   Une catégorie = une carte blanche. Une prestation = une ligne, avec
   son prix à droite, sa durée en dessous et, si besoin, une précision.
   Les durées sont celles réellement bloquées dans l'agenda : c'est ce
   qui rend la grille utile plutôt que décorative.                    */

export const pricesConfirmed = true;
/** Date affichée sous la grille. */
export const tarifsMajLe = '1er janvier 2026';

export type Service = { name: string; minutes: number; price: number; note?: string };
export type Category = { title: string; items: Service[] };
/** Chaque univers est tenu par une seule praticienne : `by` est donc
    porté ici, et non répété sur chaque catégorie. `null` le masque. */
export type Universe = {
  key: string;
  label: string;
  by: string | null;
  blurb: string;
  categories: Category[];
};

export const universes: Universe[] = [
  {
    key: 'ongles',
    label: 'Ongles',
    by: 'Camille',
    blurb:
      'Manucure, pose gel avec ou sans extensions, remplissage, semi-permanent mains et pieds, nail art, dépose.',
    categories: [
      {
        title: 'Ongles en gel',
        items: [
          { name: 'Pose complète avec extensions', minutes: 90, price: 55, note: 'Rallongement en gel' },
          { name: 'Pose gel sur ongles naturels', minutes: 60, price: 45, note: 'Sans extensions, sans dépose' },
          { name: 'Remplissage', minutes: 75, price: 45, note: 'Dépose partielle + repose de gel' },
          { name: 'Nail art simple', minutes: 15, price: 5, note: 'French, baby boomer, chrome' },
          { name: 'Nail art travaillé', minutes: 30, price: 15, note: 'Dessins, 3D, incrustations' },
          { name: 'Dépose + soin', minutes: 45, price: 18 },
          { name: 'Réparation d’un ongle cassé', minutes: 15, price: 5, note: 'par ongle' },
        ],
      },
      {
        title: 'Manucure et semi-permanent',
        items: [
          { name: 'Manucure simple', minutes: 30, price: 25, note: 'Mise en forme, cuticules, soin' },
          { name: 'Vernis semi-permanent mains', minutes: 45, price: 35 },
          { name: 'Vernis semi-permanent pieds', minutes: 45, price: 35 },
          { name: 'Beauté des pieds', minutes: 45, price: 40 },
          { name: 'Forfait mains + pieds', minutes: 75, price: 60, note: 'Semi-permanent, sans gel' },
          { name: 'Dépose semi-permanent + soin', minutes: 30, price: 12 },
        ],
      },
    ],
  },
  {
    key: 'regard',
    label: 'Cils et sourcils',
    by: 'Manon',
    blurb:
      'Rehaussement, teinture, extensions cil à cil ou volume, restructuration et brow lift.',
    categories: [
      {
        title: 'Cils',
        items: [
          { name: 'Rehaussement de cils', minutes: 60, price: 55, note: 'Recourbement naturel, tient 5 à 6 semaines' },
          { name: 'Rehaussement + teinture', minutes: 75, price: 65 },
          { name: 'Extensions cil à cil, pose complète', minutes: 120, price: 75 },
          { name: 'Extensions volume, pose complète', minutes: 135, price: 90 },
          { name: 'Remplissage 2 semaines', minutes: 60, price: 40 },
          { name: 'Remplissage 3 semaines', minutes: 75, price: 50 },
          { name: 'Dépose', minutes: 30, price: 15 },
          { name: 'Teinture des cils', minutes: 30, price: 18 },
        ],
      },
      {
        title: 'Sourcils',
        items: [
          { name: 'Restructuration', minutes: 20, price: 15, note: 'Épilation et mise en forme' },
          { name: 'Restructuration + teinture', minutes: 35, price: 25 },
          { name: 'Teinture', minutes: 20, price: 14 },
          { name: 'Brow lift', minutes: 45, price: 45, note: 'Sourcils lissés et redessinés' },
          { name: 'Brow lift + teinture + épilation', minutes: 60, price: 55 },
        ],
      },
    ],
  },
  {
    key: 'visage',
    label: 'Soins du visage',
    by: 'Manon',
    blurb:
      'Du soin express d’une demi-heure au protocole complet, sur peaux sensibles comme mixtes.',
    categories: [
      {
        title: 'Soins',
        items: [
          { name: 'Soin découverte', minutes: 30, price: 35, note: 'Nettoyage, gommage, crème' },
          { name: 'Soin éclat', minutes: 60, price: 60 },
          { name: 'Soin hydratant profond', minutes: 75, price: 70 },
          { name: 'Soin anti-âge', minutes: 90, price: 90 },
          { name: 'Nettoyage de peau', minutes: 60, price: 55, note: 'Extraction des comédons' },
        ],
      },
      {
        title: 'En complément',
        items: [
          { name: 'Massage du visage', minutes: 20, price: 20 },
          { name: 'Masque tissu', minutes: 15, price: 12 },
          { name: 'Patchs contour des yeux', minutes: 10, price: 8 },
        ],
      },
    ],
  },
  {
    key: 'epilation',
    label: 'Épilation à la cire',
    by: 'Manon',
    blurb:
      'Du sourcil aux jambes complètes, à l’unité ou en forfait, pour elle et pour lui.',
    categories: [
      {
        title: 'Femme, à l’unité',
        items: [
          { name: 'Sourcils', minutes: 10, price: 10 },
          { name: 'Lèvre', minutes: 10, price: 8 },
          { name: 'Menton', minutes: 10, price: 8 },
          { name: 'Aisselles', minutes: 15, price: 12 },
          { name: 'Demi-bras', minutes: 15, price: 14 },
          { name: 'Bras complets', minutes: 20, price: 18 },
          { name: 'Maillot simple', minutes: 15, price: 14 },
          { name: 'Maillot échancré', minutes: 20, price: 18 },
          { name: 'Maillot intégral', minutes: 35, price: 25 },
          { name: 'Demi-jambes', minutes: 20, price: 18 },
          { name: 'Jambes complètes', minutes: 35, price: 28 },
        ],
      },
      {
        title: 'Femme, forfaits',
        items: [
          { name: 'Sourcils + lèvre', minutes: 20, price: 16 },
          { name: 'Sourcils + lèvre + menton', minutes: 30, price: 22 },
          { name: 'Aisselles + demi-jambes + maillot simple', minutes: 45, price: 40 },
          { name: 'Aisselles + jambes complètes + maillot échancré', minutes: 60, price: 52 },
        ],
      },
      {
        title: 'Homme',
        items: [
          { name: 'Sourcils', minutes: 15, price: 12 },
          { name: 'Oreilles ou nez', minutes: 10, price: 8 },
          { name: 'Torse', minutes: 30, price: 25 },
          { name: 'Dos', minutes: 30, price: 28 },
          { name: 'Jambes complètes', minutes: 35, price: 32 },
        ],
      },
    ],
  },
];

/** Phrase au-dessus de la grille. `{n}` est remplacé par le nombre réel
    de prestations — il n'y a donc rien à recompter à la main. */
export const tarifsIntro =
  "{n} prestations, les durées sont celles réellement bloquées dans l'agenda. "
  + "Dépliez l'univers qui vous intéresse.";

/* ─────────────────────────── LES AVIS ───────────────────────────
   ATTENTION : les chiffres livrés sont des exemples. Mettre les vôtres,
   relevés sur Google ou sur la plateforme de réservation, ou passer
   `show` à `false`. Publier une note inventée se voit, et se retourne
   contre l'institut le jour où un visiteur va vérifier.              */

export const rating = { show: true, value: 4.9, count: 120, source: 'Google' };

/* ─────────────────────────── LE PLAN ────────────────────────────
   La légende sous la carte. Deux lignes : l'adresse complète, que le
   composant compose tout seul, et cette phrase de repère.            */

export const plan = {
  legende: 'En plein centre, à deux pas de la place du marché.',
  /** Description lue par un lecteur d'écran. */
  alt: `Plan du centre de ${address.city} : l'institut est situé ${address.street}.`,
};

/* ─────────────────────── MENTIONS LÉGALES ───────────────────────
   Obligatoires pour tout site professionnel (article 6-III de la LCEN).
   Un institut tenu par deux auto-entreprises distinctes qui partagent un
   local doit faire apparaître les DEUX, chacune avec son SIRET : d'où
   une liste. Pour une seule entreprise, n'en garder qu'une.

   Les `null` s'affichent en pointillés sur /mentions-legales : ils se
   voient, et c'est fait pour. Le SIRET se retrouve en cherchant le nom
   sur annuaire-entreprises.data.gouv.fr                               */

export const legal = {
  /** La personne responsable de la publication du site. */
  responsablePublication: null as string | null,

  entreprises: [
    {
      praticienne: 'Camille',
      /** Nom et prénom de l'exploitante, tels qu'immatriculés. */
      denomination: null as string | null,
      forme: 'Entrepreneur individuel (auto-entreprise)',
      siret: null as string | null,
      activite: 'Prothésie ongulaire',
    },
    {
      praticienne: 'Manon',
      denomination: null as string | null,
      forme: 'Entrepreneur individuel (auto-entreprise)',
      siret: null as string | null,
      activite: 'Soins esthétiques et épilation',
    },
  ],

  /** Régime de TVA. Vrai tant que le chiffre d'affaires reste sous le
      seuil de la franchise. */
  franchiseTva: true,

  hebergeur: {
    nom: 'Vercel Inc.',
    adresse: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis',
    site: 'https://vercel.com',
  },
};

/* ───────────────────── CE QUI RESTE À COMPLÉTER ─────────────────
   Alimente le bandeau d'aperçu en haut de page et la note du pied. Une
   donnée absente se signale d'elle-même : on ne découvre pas trois mois
   plus tard que le SIRET manquait.                                   */

export const pending = [
  gabarit && 'les textes et les photos d’exemple',
  gabarit && rating.show && 'les avis',
  reservation.url === null && contact.phone === null && 'le lien de réservation',
  address.street === null && 'la rue',
  !hoursConfirmed && 'les horaires',
  !pricesConfirmed && 'les tarifs',
  legal.entreprises.some((e) => !e.siret) && 'les mentions légales',
].filter(Boolean) as string[];
