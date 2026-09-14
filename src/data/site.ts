/**
 * ─────────────────────────────────────────────────────────────
 *  LE SEUL FICHIER À MODIFIER POUR METTRE LE SITE À JOUR
 * ─────────────────────────────────────────────────────────────
 *
 *  Tout ce qui vaut `null` est considéré comme « à compléter » :
 *  le site l'affiche en pointillés roses et garde le bandeau
 *  d'aperçu en haut de page. Dès que vous remplacez un `null`
 *  par une vraie valeur, le pointillé disparaît tout seul.
 *
 *  Quand plus rien ne vaut `null`, le bandeau disparaît aussi.
 */

export const site = {
  name: "Lily's Beauty",
  tagline: 'Institut de beauté',
  /** Adresse publique du site. À corriger après le premier déploiement Vercel. */
  url: 'https://lilysbeauty.vercel.app',
  description:
    "Institut de beauté spécialisé en prothésie ongulaire et extension de cils. Pose gel, semi-permanent, cil à cil, volume russe et rehaussement. Réservation en ligne.",
} as const;

/** Lien de réservation Planity du salon. Ex. https://www.planity.com/lilys-beauty-00000 */
export const planityUrl: string | null = null;

export const contact = {
  /** Numéro affiché et cliquable. Ex. '05 46 00 00 00' */
  phone: null as string | null,
  /** Ex. 'contact@lilysbeauty.fr' */
  email: null as string | null,
  /** Ex. 'https://www.instagram.com/…' */
  instagram: null as string | null,
};

export const address = {
  streetNumber: '254',
  /** Ex. 'rue de la République' */
  street: null as string | null,
  /** Ex. '17000' */
  postalCode: null as string | null,
  /** Ex. 'La Rochelle' */
  city: null as string | null,
  country: 'FR',
  /** Stationnement, arrêt de bus, repères… */
  directions: null as string | null,
  /** Lien Google Maps du salon. */
  mapsUrl: null as string | null,
};

/* ─────────────────────────── HORAIRES ───────────────────────────
   `day` suit la convention JavaScript : 0 = dimanche … 6 = samedi.
   Les heures sont en minutes depuis minuit (9 h 30 → 9 * 60 + 30).
   `null` sur `open` signifie « fermé ce jour-là ».
   Passez `confirmed` à true quand ce sont vos vrais horaires.       */

export const hoursConfirmed = false;

export type Day = {
  day: number;
  label: string;
  open: number | null;
  close: number | null;
};

export const hours: Day[] = [
  { day: 1, label: 'lundi', open: null, close: null },
  { day: 2, label: 'mardi', open: 9 * 60 + 30, close: 18 * 60 + 30 },
  { day: 3, label: 'mercredi', open: 9 * 60 + 30, close: 18 * 60 + 30 },
  { day: 4, label: 'jeudi', open: 9 * 60 + 30, close: 19 * 60 },
  { day: 5, label: 'vendredi', open: 9 * 60 + 30, close: 19 * 60 },
  { day: 6, label: 'samedi', open: 9 * 60, close: 17 * 60 },
  { day: 0, label: 'dimanche', open: null, close: null },
];

/* ─────────────────────────── TARIFS ─────────────────────────────
   `minutes` sert à afficher la durée ET à indiquer au client
   combien de temps bloquer. `price` est en euros.
   Passez `confirmed` à true quand c'est votre vraie grille.        */

export const pricesConfirmed = false;

export type Service = { name: string; minutes: number | null; price: number | null };

export const services: { key: string; label: string; blurb: string; items: Service[] }[] = [
  {
    key: 'ongles',
    label: 'Ongles',
    blurb:
      'Pose gel sur capsule ou chablon, remplissage, semi-permanent, nail art. Séances d’une heure à une heure trente.',
    items: [
      { name: 'Pose gel complète', minutes: 90, price: 45 },
      { name: 'Remplissage gel', minutes: 75, price: 35 },
      { name: 'Vernis semi-permanent', minutes: 45, price: 25 },
      { name: 'Beauté des mains', minutes: 45, price: 30 },
      { name: 'Nail art, par ongle', minutes: null, price: 3 },
      { name: 'Dépose seule', minutes: 30, price: 15 },
    ],
  },
  {
    key: 'cils',
    label: 'Cils',
    blurb:
      'Extension cil à cil, volume russe, rehaussement et teinture. Comptez deux heures pour une pose complète.',
    items: [
      { name: 'Extension cil à cil', minutes: 120, price: 70 },
      { name: 'Volume russe', minutes: 150, price: 90 },
      { name: 'Remplissage cils', minutes: 75, price: 45 },
      { name: 'Rehaussement de cils', minutes: 45, price: 50 },
      { name: 'Rehaussement + teinture', minutes: 60, price: 60 },
      { name: 'Dépose seule', minutes: 30, price: 15 },
    ],
  },
];

/* ───────────────────── CE QUI RESTE À COMPLÉTER ───────────────── */

export const pending = [
  planityUrl === null && 'le lien Planity',
  address.street === null && 'la rue',
  address.city === null && 'la ville',
  contact.phone === null && 'le téléphone',
  !hoursConfirmed && 'les horaires',
  !pricesConfirmed && 'les tarifs',
].filter(Boolean) as string[];
