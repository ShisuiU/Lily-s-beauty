import type { APIRoute } from 'astro';

/* Généré depuis `site` pour qu'il n'y ait pas une troisième URL
   à maintenir à la main à côté de site.ts et astro.config.mjs. */
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
