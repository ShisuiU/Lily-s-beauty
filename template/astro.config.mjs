// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// `site` doit rester en phase avec `site.url` dans src/data/site.ts.
// La config Astro est chargée avant l'app : on évite d'y importer du TS.
export default defineConfig({
  site: 'https://votre-institut.vercel.app',
  // Vercel sert /mentions-legales et redirige /mentions-legales/ en 308
  // (cleanUrls + trailingSlash dans vercel.json). Sans cette ligne, Astro
  // écrirait la barre finale dans la balise canonique et le plan du site :
  // les deux annonceraient donc une URL qui redirige.
  trailingSlash: 'never',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
});
