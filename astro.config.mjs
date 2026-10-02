import { defineConfig } from 'astro/config';

// BASE_PATH=/ et SITE_URL=https://www.lafiamma92.fr le jour où le site passe sur le domaine.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://sowvard299.github.io',
  base: process.env.BASE_PATH ?? '/la_fiamma',
  trailingSlash: 'ignore',
});
