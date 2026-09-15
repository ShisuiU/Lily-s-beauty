// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Doit rester en phase avec `site.url` dans src/data/site.ts
// (la config Astro est chargée avant l'app, on évite d'y importer du TS).
export default defineConfig({
  site: 'https://lilysbeauty.vercel.app',
  // Vercel sert /mentions-legales et redirige /mentions-legales/ en 308
  // (cleanUrls + trailingSlash dans vercel.json). Sans cette ligne, Astro
  // écrivait la barre finale dans la balise canonique et le plan du site :
  // les deux annonçaient donc une URL qui redirige.
  trailingSlash: 'never',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
});
