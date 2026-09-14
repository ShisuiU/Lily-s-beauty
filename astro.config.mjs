// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Doit rester en phase avec `site.url` dans src/data/site.ts
// (la config Astro est chargée avant l'app, on évite d'y importer du TS).
export default defineConfig({
  site: 'https://lilysbeauty.vercel.app',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
});
