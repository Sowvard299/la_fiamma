import { defineConfig } from 'astro/config';

// En local le site est servi à la racine. La CI fixe BASE_PATH=/la_fiamma pour GitHub Pages ;
// sur le domaine lafiamma92.fr, laisser BASE_PATH vide et fixer SITE_URL.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://sowvard299.github.io',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  // Sur Windows, « localhost » se résout en IPv6 (::1) : on écoute explicitement en IPv4,
  // sinon les outils qui visent 127.0.0.1 (aperçu de l'app Claude, certains navigateurs) ne voient rien.
  server: { host: '127.0.0.1' },
});
