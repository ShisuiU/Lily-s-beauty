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
 *  LES TEXTES LIVRÉS NE SONT PAS DU CONTENU : chacun décrit ce qui doit
 *  venir à sa place, sa longueur utile et ce qu'il doit dire. Ils
 *  tiennent la maquette debout le temps qu'on les remplace. Rien ici ne
 *  suppose un métier : institut de beauté, massages, coiffure,
 *  onglerie, barbier, cabinet de soins — la structure est la même, le
 *  vocabulaire vous appartient.
 *
 *  `null` ne veut pas dire « vide » mais « pas de donnée » : la ligne
 *  correspondante disparaît de la page, ou s'y affiche en pointillés
 *  quand la loi l'exige. C'est vrai du téléphone, du lien de
 *  réservation, du SIRET, du prix d'une prestation.
 *
 *  Le fichier se lit dans l'ordre de la page.
 */

/* ─────────────────────── LE BANDEAU D'APERÇU ────────────────────
   Un bandeau noir en haut de page, qui énumère ce qui reste à
   compléter (voir `pending`, tout en bas). Utile pendant la mise au
   point, à laisser sur `false` pour montrer la maquette ou mettre en
   ligne.                                                            */

export const bandeauApercu = false;

/* ─────────────────────────── L'ENSEIGNE ────────────────────────── */

export const site = {
  /** Le nom tel qu'il s'écrit sur la devanture. Il s'affiche en
      toutes lettres dans l'en-tête et le pied tant qu'aucun logo n'est
      fourni : au-delà d'une vingtaine de signes, vérifier qu'il tient
      sur un écran de téléphone. */
  name: 'Votre Enseigne',
  /** Ce que vous êtes, en deux ou trois mots. S'affiche au-dessus du
      titre, à côté de la ville, et dans la barre du bas sur téléphone.
      « Institut de beauté », « Massages bien-être », « Barbier »… */
  tagline: 'Votre activité',
  /** Adresse définitive du site. À tenir en phase avec `site` dans
      astro.config.mjs (la config Astro est chargée avant l'app, on
      évite d'y importer du TypeScript). */
  url: 'https://votre-site.vercel.app',
  /** 150 à 160 signes : c'est ce que Google affiche sous le titre, et
      ce qui décide du clic. Le métier, la ville, les prestations
      phares, la façon de prendre rendez-vous. Ni slogan ni majuscules. */
  description:
    "Une phrase de 150 à 160 signes : votre métier, votre ville, vos prestations principales "
    + "et la façon de prendre rendez-vous. C'est le texte que Google affiche sous le titre.",
  /** Catégorie de l'établissement pour les moteurs de recherche
      (schema.org). `LocalBusiness` convient à tout le monde ; plus c'est
      précis, mieux la recherche locale s'y retrouve :
      BeautySalon, NailSalon, HairSalon, BarberShop, DaySpa,
      HealthAndBeautyBusiness, MassageTherapy… */
  schemaType: 'LocalBusiness',
} as const;

/** Logo de l'en-tête et du pied de page.

    Tant que c'est `null`, le nom s'écrit en toutes lettres dans la
    fonte serif du site — ce qui est très bien tant qu'il n'y a pas de
    logo, et évite le rectangle gris qui traîne sur les maquettes en
    attente.

    Pour poser un vrai logo : déposer le fichier dans `public/`,
    renseigner son chemin et son rapport largeur/hauteur. L'en-tête le
    peint en **masque** (voir `.brand-logo` dans global.css) : le fichier
    doit donc porter la forme dans sa transparence — un PNG détouré ou un
    SVG monochrome — et non des couleurs, puisque c'est la page qui les
    donne. C'est ce qui permet au logo d'être blanc sur la photo du haut
    puis encre une fois la barre devenue opaque. */
export const brand = {
  /** Fichier monochrome pour l'en-tête. Ex. '/logo-mark.svg'. */
  logo: null as string | null,
  /** Rapport du fichier, tel quel : '560 / 132'. */
  logoRatio: '560 / 132',
  /** Hauteur d'affichage dans l'en-tête, en pixels. Vérifié de 27 à 40. */
  logoHeight: 34,

  /** Le même logo en couleurs, pour le pied de page : là il est posé
      sur le blanc de la page et n'a plus à s'adapter au fond. */
  logoCouleur: null as string | null,
  logoCouleurRatio: '1300 / 366',
};

/* ─────────────────────────── RÉSERVATION ────────────────────────
   Trois cas, dans cet ordre de préséance :

   1. `url` renseignée  → le bouton ouvre l'agenda en ligne.
   2. `url` à null mais un téléphone plus bas → le bouton appelle.
   3. ni l'un ni l'autre → le bouton descend à la section « Rendez-vous ».

   `enseigne` est le nom du service de réservation, s'il y en a un
   (Planity, Treatwell, Kiute, Wavy, Calendly…). Il apparaît dans la
   section « Rendez-vous » et dans les mentions légales.               */

export const reservation = {
  enseigne: null as string | null,
  url: null as string | null,

  /** Titre et paragraphe de la section « Rendez-vous ».

      Laisser `null` les compose tout seuls à partir du mode de
      réservation : « La réservation se fait sur X. » avec le texte qui
      va avec, ou la version téléphone. Les textes ci-dessous ne sont là
      que pour décrire l'emplacement tant que rien n'est branché. */
  titre: 'Comment on prend rendez-vous.' as string | null,
  intro: ("Trois ou quatre lignes qui lèvent l'hésitation : par où passer, ce qui se confirme "
    + "tout de suite, ce qui se passe en cas d'empêchement. Branchez un agenda en ligne "
    + "plus haut, et ce paragraphe s'écrit tout seul.") as string | null,

  /** Les quatre lignes numérotées de la colonne de droite. Elles
      rassurent sur le déroulé : ce sont souvent les dernières lues
      avant le clic. */
  etapes: [
    "Première étape : ce que le visiteur choisit en premier — la prestation, la personne, le créneau.",
    'Deuxième étape : ce qu\'il renseigne, et ce qu\'il reçoit en retour (confirmation, rappel).',
    'Troisième étape : ce qui se passe le jour même — l\'accueil, le temps prévu, où se garer.',
    "Quatrième étape : l'annulation ou le report, et le délai que vous demandez.",
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
  streetNumber: '00',
  street: 'Rue à compléter',
  postalCode: '00000',
  city: 'Votre ville',
  country: 'FR',
  /** Une précision d'accès : « parking gratuit devant », « au fond de
      la cour », « premier étage, sonner à l'interphone ». `null` masque
      la ligne. */
  directions: null as string | null,
};

/** Coordonnées GPS. La carte affichée est une image fabriquée à la
    construction du site à partir de ces deux nombres : aucun service
    tiers n'est appelé chez le visiteur, donc aucune bannière cookies à
    cause d'une carte embarquée.
    Pour la régénérer : scripts/generate-map.py (les coordonnées se
    relèvent d'un clic droit sur Google Maps). */
export const geo = { lat: 48.858370, lon: 2.294481 };

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lon}`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${geo.lat},${geo.lon}`;

/* ──────────────────────────── LA PAGE ─────────────────────────── */

/** Les ancres de la page, partagées par l'en-tête, le menu mobile et le
    pied. Une seule liste : retirer une section ici la fait disparaître
    des trois endroits. L'ordre suit celui des sections dans la page —
    à tenir en phase avec src/pages/index.astro.

    Les libellés se renomment librement : « Prestations et tarifs »
    peut devenir « La carte », « Les soins », « Les massages ». */
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
   La première chose vue, et souvent la seule. Le titre se compose en
   trois morceaux pour que celui du milieu passe en italique — c'est la
   seule fantaisie typographique de la page, elle mérite d'être choisie.
   Mettre `accent: null` pour un titre d'un seul tenant.

   Viser court : huit à douze mots. Ce qui ne tient pas dans le titre
   tient dans la ligne en dessous.                                    */

export const hero = {
  titre: {
    avant: 'Votre titre — ',
    accent: 'ce que vous faites',
    apres: ', en une ligne.',
  },
  lead:
    "Deux ou trois lignes sous le titre : vos prestations principales, votre ville, et ce qui "
    + "distingue la maison. C'est le seul paragraphe que tout le monde lit.",
  /** Second bouton, discret, à côté de « Réserver ». `null` le retire. */
  lienSecondaire: { href: '#tarifs', label: 'Voir les tarifs' } as { href: string; label: string } | null,
};

/* ──────────────────────── QUI TIENT LA MAISON ───────────────────
   Le bloc livré est réglé pour une personne seule. Ajouter une entrée
   à `membres` suffit à passer à deux, puis à quatre : la mise en page
   suit, et chaque univers de prestations peut alors nommer la personne
   qui le tient (`by`, plus bas).

   `instagram` attend l'URL propre du compte, sans le paramètre `?stkn=`
   que l'application ajoute au partage — c'est un jeton lié au compte qui
   a copié le lien, il n'a rien à faire sur une page publique.
   Vider `membres` retire le bloc.                                    */

export const equipe = {
  /** La phrase d'accroche. Les mots entre <em> passent en italique et
      prennent la couleur d'accent. */
  lead: "Une phrase d'accroche : <em>qui vous êtes</em>, et dans quel esprit vous travaillez.",
  body:
    "Trois ou quatre lignes : le parcours, la façon de travailler, ce à quoi la personne doit "
    + "s'attendre en poussant la porte. On y met ce qui rassure — le temps réservé pour chaque "
    + "prestation, le soin apporté, l'hygiène — plutôt que des superlatifs.",
  membres: [
    {
      name: 'Prénom',
      /** Ce que cette personne tient : « les soins du visage », « les
          massages », « la couleur ». */
      craft: 'Votre spécialité',
      instagram: null as string | null,
    },
  ],
};

/** « https://www.instagram.com/moncompte/ » → « @moncompte » */
export const pseudo = (url: string) =>
  '@' + url.replace(/\/+$/, '').split('/').pop();

/** Présentation du lieu, dans la section « Nous trouver ». Deux
    paragraphes suffisent : ce n'est pas une page « à propos », le
    visiteur y cherche surtout l'adresse. */
export const about = {
  /** Une phrase, affichée en grand à côté de la photo. */
  lead: 'Une phrase sur le lieu : où il se trouve, ce qu’on y ressent.',
  body: [
    "Premier paragraphe : le cadre. L'ambiance, la lumière, le nombre de places, ce qui fait "
    + "qu'on s'y sent bien. Deux ou trois lignes.",
    "Second paragraphe : ce qu'on y trouve. Les grandes familles de prestations, sans reprendre "
    + "la carte complète — elle est juste au-dessus.",
  ],
  /** Description de la photo qui accompagne le texte, lue par les
      lecteurs d'écran. */
  photoAlt: "Décrivez ici la photo : la façade, l'enseigne, la pièce principale.",
};

/* ────────────────────────────── LE LIEU ─────────────────────────
   Le ruban de photos qui défile. La clé `fichier` est le nom du fichier
   dans src/assets/ ; les images livrées sont des aplats de couleur qui
   tiennent la place. Préparez les vraies avec scripts/prepare-photos.py
   (recadrage, réduction, effacement des métadonnées EXIF — un fichier
   sorti d'un téléphone embarque le modèle de l'appareil et parfois les
   coordonnées GPS du lieu).

   `alt` n'est pas un titre : c'est la description lue à voix haute par
   un lecteur d'écran, et ce qui s'affiche si l'image ne charge pas. On
   y décrit ce qu'on voit, pas ce qu'on voudrait vendre.

   Quatre photos, c'est le minimum pour que le ruban tourne sans se
   répéter à l'œil. Il en accepte davantage.                          */

export const lieu = {
  titre: 'Le lieu',
  lead: 'Une ligne : ce que le visiteur verra en poussant la porte.',
  photos: [
    { fichier: 'lieu-1.jpg', alt: 'Décrivez cette photo en une phrase.' },
    { fichier: 'lieu-2.jpg', alt: 'Décrivez cette photo en une phrase.' },
    { fichier: 'lieu-3.jpg', alt: 'Décrivez cette photo en une phrase.' },
    { fichier: 'lieu-4.jpg', alt: 'Décrivez cette photo en une phrase.' },
  ],
};

/* ───────────────────────────── LE TRAVAIL ───────────────────────
   Les réalisations, en groupes. Un clic agrandit la photo.

   C'est la section qui convertit : on n'achète pas une prestation, on
   achète un résultat. Deux groupes de quatre ici ; la grille en accepte
   d'autres nombres, et un seul groupe suffit.

   `by` nomme la personne qui a fait ces réalisations, quand l'équipe
   compte plusieurs praticiens. `null` retire la mention.             */

export type Realisation = { fichier: string; alt: string };

export const travail = {
  titre: 'Le travail',
  lead: 'Une ligne : ce que montrent ces photos, et ce qu’elles doivent prouver.',
  groupes: [
    {
      titre: 'Nom du premier groupe',
      by: null as string | null,
      photos: [
        { fichier: 'travail-1.jpg', alt: 'Décrivez cette réalisation en une phrase.' },
        { fichier: 'travail-2.jpg', alt: 'Décrivez cette réalisation en une phrase.' },
        { fichier: 'travail-3.jpg', alt: 'Décrivez cette réalisation en une phrase.' },
        { fichier: 'travail-4.jpg', alt: 'Décrivez cette réalisation en une phrase.' },
      ] as Realisation[],
    },
    {
      titre: 'Nom du second groupe',
      by: null as string | null,
      photos: [
        { fichier: 'travail-5.jpg', alt: 'Décrivez cette réalisation en une phrase.' },
        { fichier: 'travail-6.jpg', alt: 'Décrivez cette réalisation en une phrase.' },
        { fichier: 'travail-7.jpg', alt: 'Décrivez cette réalisation en une phrase.' },
        { fichier: 'travail-8.jpg', alt: 'Décrivez cette réalisation en une phrase.' },
      ] as Realisation[],
    },
  ],
};

/* ─────────────────────────── HORAIRES ───────────────────────────
   `day` suit la convention JavaScript : 0 = dimanche … 6 = samedi.
   Heures en minutes depuis minuit (9 h 30 → 9 * 60 + 30).
   `open: null` = fermé ce jour-là.

   La mention « Ouvert · ferme à 19 h » affichée en haut de page est
   calculée chez le visiteur, sur l'heure de Paris, à partir de cette
   grille : il n'y a rien d'autre à tenir à jour.                     */

export const horaires = {
  titre: 'Horaires',
  /** Le petit titre du bloc de droite, celui qui annonce l'état du
      moment. */
  surtitre: 'En ce moment',
  /** Ce qu'il affiche avant que le calcul ne se fasse, et pour les
      navigateurs sans JavaScript. */
  attente: 'Consultez les horaires',
};

/** Passer à `false` tant que la grille n'est pas confirmée : la page le
    signale alors en pointillés. */
export const hoursConfirmed = false;

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
   Trois niveaux, et c'est ce qui permet de tenir une carte de soixante
   lignes sur une page unique sans noyer le visiteur :

     univers    → un titre repliable. Une grande famille de prestations.
                  Trois à cinq, pas davantage.
     catégorie  → une carte blanche. Un groupe à l'intérieur de la
                  famille.
     prestation → une ligne : le nom, le prix à droite, la durée en
                  dessous, et s'il le faut une précision.

   Aucune prestation n'est livrée : la structure ci-dessous est vide et
   décrit ses propres emplacements. Un métier ne se devine pas depuis un
   gabarit.

   `price: null` et `minutes: null` s'affichent en pointillés : ce qui
   manque se voit, et c'est fait pour.

   Les durées sont celles réellement bloquées dans l'agenda. C'est ce
   qui rend la grille utile plutôt que décorative : la personne sait
   combien de temps elle bloque, et vous n'avez pas à le réexpliquer au
   téléphone.                                                         */

export type Service = { name: string; minutes: number | null; price: number | null; note?: string };
export type Category = { title: string; items: Service[] };
/** Un univers est tenu par une seule personne : `by` est donc porté
    ici, et non répété sur chaque catégorie. `null` le masque — c'est le
    réglage d'une maison tenue seule. */
export type Universe = {
  key: string;
  label: string;
  by: string | null;
  blurb: string;
  categories: Category[];
};

const prestationVide = (n: number): Service => ({
  name: `Nom de la prestation ${n}`,
  minutes: null,
  price: null,
  note: n === 1 ? 'La précision utile : ce que comprend la prestation, ou ce qu’elle exclut.' : undefined,
});

export const tarifs = {
  titre: 'Prestations et tarifs',
  /** Phrase au-dessus de la grille. `{n}` est remplacé par le nombre
      réel de prestations : il n'y a rien à recompter à la main. */
  intro:
    "{n} prestations. Une ligne d'introduction : ce que le visiteur doit savoir avant de "
    + "déplier — que les durées sont celles réellement réservées, par exemple.",
  /** Date affichée sous la grille. `null` retire la mention. */
  majLe: null as string | null,

  univers: [
    {
      key: 'univers-1',
      label: 'Première famille',
      by: null,
      blurb:
        'Une ou deux lignes qui résument cette famille : ce qu’elle couvre, à qui elle s’adresse, '
        + 'ce qui la distingue de la suivante.',
      categories: [
        { title: 'Nom du premier groupe', items: [prestationVide(1), prestationVide(2), prestationVide(3)] },
        { title: 'Nom du second groupe', items: [prestationVide(4), prestationVide(5)] },
      ],
    },
    {
      key: 'univers-2',
      label: 'Deuxième famille',
      by: null,
      blurb: 'Une ou deux lignes qui résument cette famille.',
      categories: [
        { title: 'Nom du groupe', items: [prestationVide(1), prestationVide(2), prestationVide(3)] },
      ],
    },
    {
      key: 'univers-3',
      label: 'Troisième famille',
      by: null,
      blurb: 'Une ou deux lignes qui résument cette famille.',
      categories: [
        { title: 'Nom du groupe', items: [prestationVide(1), prestationVide(2)] },
      ],
    },
  ] as Universe[],
};

/** Passer à `false` tant que la grille n'est pas confirmée. */
export const pricesConfirmed = false;

/* ─────────────────────────── LES AVIS ───────────────────────────
   Masqué par défaut, et ce n'est pas un oubli : une note ne s'invente
   pas. Pour l'afficher, mettre `show: true` et reporter les vrais
   chiffres, relevés sur Google, sur la plateforme de réservation ou
   ailleurs — `source` nomme l'endroit, c'est lui qui rend la note
   crédible. Le bloc apparaît alors sous le titre d'accueil et dans la
   section « Rendez-vous ».                                           */

export const rating = { show: false, value: 0, count: 0, source: '' };

/* ─────────────────────────── LE PLAN ────────────────────────────
   La légende sous la carte : l'adresse complète, que le composant
   compose tout seul, et cette phrase de repère.                      */

export const plan = {
  legende: 'Une phrase de repère : le quartier, un bâtiment connu, où se garer.',
  /** Description lue par un lecteur d'écran. */
  alt: `Plan du quartier : l’adresse est signalée par un repère au centre de la carte.`,
};

/* ─────────────────────── MENTIONS LÉGALES ───────────────────────
   Obligatoires pour tout site professionnel (article 6-III de la loi du
   21 juin 2004 pour la confiance dans l'économie numérique). Rien n'est
   pré-rempli ici : ce sont des informations juridiques, elles ne se
   devinent pas et une valeur fausse vaut moins que rien.

   Tout ce qui reste à `null` s'affiche en pointillés sur la page
   /mentions-legales : les trous se voient.

   · SIRET et dénomination se retrouvent sur annuaire-entreprises.data.gouv.fr
   · `forme` : « Entrepreneur individuel », « SASU », « EURL », « SARL »…
     Une société ajoute son capital social et son RCS.
   · `tva` : `false` si vous relevez de la franchise en base (la page
     affiche alors la mention de l'article 293 B), sinon le numéro de TVA
     intracommunautaire. `null` tant que ce n'est pas tranché.
   · `hebergeur` : le prestataire qui héberge le site, avec son adresse
     complète — c'est une mention obligatoire. Pour un déploiement sur
     Vercel : « Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA
     91723, États-Unis, vercel.com ».

   Plusieurs entreprises partagent le même local ? En ajouter une au
   tableau : chacune apparaît alors avec ses propres informations.     */

export const legal = {
  /** La personne responsable de la publication du site. */
  responsablePublication: null as string | null,

  editeurs: [
    {
      /** Titre de la fiche. `null` reprend le nom de l'enseigne. */
      titre: null as string | null,
      /** L'activité déclarée, en quelques mots. */
      activite: null as string | null,
      /** Nom et prénom de l'exploitant, ou raison sociale. */
      denomination: null as string | null,
      forme: null as string | null,
      siret: null as string | null,
    },
  ],

  /** `false` → franchise en base de TVA. Une chaîne → numéro de TVA
      intracommunautaire. `null` → à compléter. */
  tva: null as string | false | null,

  hebergeur: {
    nom: null as string | null,
    adresse: null as string | null,
    site: null as string | null,
  },
};

/* ───────────────────── CE QUI RESTE À COMPLÉTER ─────────────────
   Alimente le bandeau d'aperçu et la note du pied de page, tous deux
   commandés par `bandeauApercu` tout en haut. Une donnée absente se
   signale d'elle-même : on ne découvre pas trois mois plus tard que le
   SIRET manquait.                                                    */

export const pending = [
  reservation.url === null && contact.phone === null && 'la réservation',
  address.street === 'Rue à compléter' && 'l’adresse',
  !hoursConfirmed && 'les horaires',
  !pricesConfirmed && 'les tarifs',
  legal.editeurs.some((e) => !e.siret) && 'les mentions légales',
  legal.hebergeur.nom === null && 'l’hébergeur',
].filter(Boolean) as string[];
