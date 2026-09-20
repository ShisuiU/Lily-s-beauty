/**
 * Fabrique les images d'exemple du gabarit.
 *
 *     npm run placeholders
 *
 * Ce ne sont pas des photos : ce sont des aplats colorés, au bon format
 * et au bon poids, qui tiennent la place le temps que l'institut fournisse
 * les siennes. Ils sont fabriqués ici plutôt que téléchargés, pour trois
 * raisons : aucune image d'une banque à créditer, aucun visage de modèle
 * à faire signer, et une maquette qui ne se fait pas passer pour un site
 * fini devant un client.
 *
 * Quand les vraies photos arrivent, ce script n'a plus lieu d'être :
 * passer par scripts/prepare-photos.py, qui recadre, réduit et efface les
 * métadonnées EXIF des fichiers livrés, et supprimer ce fichier.
 *
 * Les dimensions ci-dessous ne sont pas décoratives : elles sont celles
 * que les composants attendent (voir les `widths` dans Hero, Galerie,
 * Travail et Access). Garder les rapports en changeant les photos.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

/* Les teintes du gabarit, déclinées. Rien de saturé : ce sont des fonds,
   et ils doivent supporter le texte blanc du bandeau d'accueil. */
const TONS = {
  sable: ['#e9ddd0', '#d2bda6'],
  argile: ['#dcc3ae', '#b98f6e'],
  lin: ['#eae4da', '#cfc4b4'],
  rose: ['#e8d6cf', '#cfa899'],
  pierre: ['#dedbd4', '#bdb5aa'],
  the: ['#e1e0d4', '#b9bba6'],
};

const ENCRE = '#4a4340';

/** Un aplat : dégradé en diagonale, halo, filet intérieur, et la
    légende qui dit ce que la photo montrera.

    `ancre` déplace cette légende. Sur les deux photos du bandeau
    d'accueil, le titre du site vient se poser par-dessus : centrée, la
    légende passait sous les mots. On la range donc là où la page est
    vide — à droite sur la bande large, en haut sur la verticale. */
function carte({ w, h, tons, titre, detail, motif = true, ancre = [0.5, 0.5] }) {
  const [a, b] = TONS[tons];
  const corps = Math.max(13, Math.round(Math.min(w, h) * 0.028));
  const petit = Math.round(corps * 0.72);
  const marge = Math.round(Math.min(w, h) * 0.045);
  const [ax, ay] = [w * ancre[0], h * ancre[1]];
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.7" cy="0.25" r="0.75">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ombre" cx="0.5" cy="0.5" r="0.78">
      <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#3a2f28" stop-opacity="0.16"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#halo)"/>
  <rect width="${w}" height="${h}" fill="url(#ombre)"/>
  <rect x="${marge}" y="${marge}" width="${w - marge * 2}" height="${h - marge * 2}"
        fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.2"/>
  ${motif ? brin(w, h) : ''}
  <g text-anchor="middle" font-family="Liberation Serif, Georgia, serif" fill="${ENCRE}">
    <text x="${ax}" y="${ay}" font-size="${corps}" letter-spacing="${corps * 0.22}"
          fill-opacity="0.78">${titre.toUpperCase()}</text>
    <text x="${ax}" y="${ay + corps * 2}" font-size="${petit}" letter-spacing="${petit * 0.08}"
          fill-opacity="0.5">${detail}</text>
  </g>
</svg>`);
}

/** Le rameau du gabarit, posé en filigrane dans un angle. */
function brin(w, h) {
  const t = Math.round(Math.min(w, h) * 0.42);
  return `<g transform="translate(${w - t * 1.05} ${h - t * 0.9}) scale(${t / 420})" fill="#ffffff" fill-opacity="0.22">
    <path d="M24,300 C120,300 250,230 300,96" fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M78,286 Q131,243 150,190 Q100,236 78,286 Z"/>
    <path d="M78,286 Q17,264 8,214 Q46,258 78,286 Z"/>
    <path d="M136,268 Q186,222 203,170 Q156,217 136,268 Z"/>
    <path d="M136,268 Q78,243 72,194 Q107,239 136,268 Z"/>
    <path d="M186,240 Q233,193 247,142 Q203,189 186,240 Z"/>
    <path d="M186,240 Q131,212 128,164 Q160,210 186,240 Z"/>
    <path d="M228,200 Q271,152 282,102 Q242,149 228,200 Z"/>
    <path d="M228,200 Q177,169 177,123 Q205,170 228,200 Z"/>
  </g>`;
}

const IMAGES = [
  // le bandeau d'accueil — légendes rangées hors du chemin du titre
  ['src/assets/hero-large.jpg', 1600, 1100, 'argile', 'La devanture', 'Photo large · 1600 × 1100', [0.74, 0.26]],
  ['src/assets/hero-portrait.jpg', 1200, 2132, 'sable', 'L’intérieur', 'Photo verticale · 1200 × 2132', [0.5, 0.2]],
  // le ruban « Le salon »
  ['src/assets/salon-1.jpg', 900, 1600, 'lin', 'Le coin d’attente', '900 × 1600'],
  ['src/assets/salon-2.jpg', 900, 1600, 'rose', 'Le poste de soin', '900 × 1600'],
  ['src/assets/salon-3.jpg', 900, 1600, 'pierre', 'La cabine', '900 × 1600'],
  ['src/assets/salon-4.jpg', 900, 1600, 'the', 'Le poste de manucure', '900 × 1600'],
  // les réalisations
  ['src/assets/travail-ongles-1.jpg', 1290, 1290, 'rose', 'Réalisation', 'Ongles · 1290 × 1290'],
  ['src/assets/travail-ongles-2.jpg', 1290, 1290, 'sable', 'Réalisation', 'Ongles · 1290 × 1290'],
  ['src/assets/travail-ongles-3.jpg', 1290, 1290, 'lin', 'Réalisation', 'Ongles · 1290 × 1290'],
  ['src/assets/travail-ongles-4.jpg', 1290, 1290, 'argile', 'Réalisation', 'Ongles · 1290 × 1290'],
  ['src/assets/travail-regard-1.jpg', 1290, 1290, 'pierre', 'Réalisation', 'Regard · 1290 × 1290'],
  ['src/assets/travail-regard-2.jpg', 1290, 1290, 'the', 'Réalisation', 'Regard · 1290 × 1290'],
  ['src/assets/travail-regard-3.jpg', 1290, 1290, 'rose', 'Réalisation', 'Regard · 1290 × 1290'],
  ['src/assets/travail-regard-4.jpg', 1290, 1290, 'lin', 'Réalisation', 'Regard · 1290 × 1290'],
];

await mkdir('src/assets', { recursive: true });
for (const [out, w, h, tons, titre, detail, ancre] of IMAGES) {
  await sharp(carte({ w, h, tons, titre, detail, ancre }))
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(out);
  console.log(`${out} — ${w}×${h}`);
}

/* Le plan : un faux fond de carte, le temps que scripts/generate-map.py
   fabrique le vrai à partir des coordonnées de l'institut. */
const P = { w: 1200, h: 620 };
const rues = [];
for (let i = -6; i <= 8; i++) {
  rues.push(`<path d="M${i * 150} 0 L${i * 150 + 320} ${P.h}" stroke="#ffffff" stroke-width="${i % 3 === 0 ? 16 : 7}" stroke-opacity="0.85" fill="none"/>`);
  rues.push(`<path d="M0 ${i * 92} L${P.w} ${i * 92 - 120}" stroke="#ffffff" stroke-width="${i % 2 === 0 ? 13 : 6}" stroke-opacity="0.8" fill="none"/>`);
}
const plan = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${P.w}" height="${P.h}">
  <rect width="${P.w}" height="${P.h}" fill="#e9e5dd"/>
  <rect x="120" y="60" width="300" height="200" fill="#dfe6d8"/>
  <rect x="760" y="330" width="360" height="240" fill="#dfe6d8"/>
  <rect x="470" y="410" width="180" height="150" fill="#dfe2ea"/>
  ${rues.join('\n  ')}
  <g transform="translate(${P.w / 2} ${P.h / 2})">
    <circle r="30" fill="#9a5f3e" fill-opacity="0.22"/>
    <circle r="14" fill="#ffffff"/>
    <circle r="9.5" fill="#9a5f3e"/>
  </g>
  <text x="${P.w / 2}" y="${P.h / 2 + 68}" text-anchor="middle" font-family="Liberation Serif, Georgia, serif"
        font-size="20" letter-spacing="3" fill="#4a4340" fill-opacity="0.62">PLAN D’EXEMPLE — scripts/generate-map.py</text>
</svg>`);
await sharp(plan).jpeg({ quality: 84, progressive: true, mozjpeg: true }).toFile('src/assets/plan.jpg');
console.log('src/assets/plan.jpg — 1200×620');

/* L'image de partage : ce qui s'affiche quand le lien est collé dans
   WhatsApp, en story ou sur Facebook. Sans elle, la vignette est vide —
   pour un institut qui circule de bouche à oreille, c'est la première
   impression qui se perd. La vraie se fabrique avec
   scripts/generate-og.py, à partir d'une photo et du nom de l'enseigne. */
const og = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#dcc3ae"/><stop offset="1" stop-color="#a97f60"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="630" fill="#1e1b18" fill-opacity="0.22"/>
  ${brin(1200, 630)}
  <g font-family="Liberation Serif, Georgia, serif" fill="#ffffff">
    <rect x="84" y="286" width="72" height="2" fill="#ffffff" fill-opacity="0.85"/>
    <text x="84" y="266" font-size="30" letter-spacing="7" fill-opacity="0.86">INSTITUT DE BEAUTÉ</text>
    <text x="84" y="376" font-size="76">Votre Institut</text>
    <text x="84" y="436" font-size="30" fill-opacity="0.9">Ongles · Regard · Soins · Épilation</text>
    <text x="84" y="500" font-size="26" fill-opacity="0.72">12 Rue des Exemples, Votre Ville</text>
  </g>
</svg>`);
await mkdir('public', { recursive: true });
await sharp(og).jpeg({ quality: 86, progressive: true, mozjpeg: true }).toFile('public/og.jpg');
console.log('public/og.jpg — 1200×630');
