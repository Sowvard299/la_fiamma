# La Fiamma

Site de La Fiamma, pizzeria et cuisine italienne au 61 rue de Bitche, 92400 Courbevoie.

Une page d'accueil : la carte complète en onglets avec recherche par plat ou ingrédient, le statut d'ouverture en direct (heure de Paris), les notes Google et TheFork, un plan d'accès, et la réservation par téléphone, sur TheFork ou par e-mail pré-rempli (heures proposées selon les horaires du jour choisi). Plus une page de mentions légales et une page 404.

## Modifier le contenu

Tout le contenu vit dans `src/data/`. Il n'y a rien d'autre à toucher.

| Pour changer… | Fichier | Où |
|---|---|---|
| un plat, un prix, une description | `src/data/carte.ts` | `sections` |
| la pizza du mois | `src/data/carte.ts` | `pizzaDuMois` (nom, ingrédients, prix) |
| les vins | `src/data/carte.ts` | `vins` |
| les horaires d'ouverture | `src/data/infos.ts` | `horaires` (1 = lundi … 7 = dimanche, heures de Paris) |
| téléphone, e-mail, adresse, position sur le plan | `src/data/infos.ts` | en haut du fichier |
| les notes Google et TheFork | `src/data/avis.ts` | `sources` (et `releveLe`, la date du relevé) |
| les photos | `src/data/photos.ts` | `id` de l'image et crédit |
| le lien TheFork, la vente à emporter | `src/data/infos.ts` | `theFork`, `aEmporter` |
| les mentions légales (raison sociale, SIRET, directeur de la publication) | `src/data/infos.ts` | `editeur` (un champ vide n'est pas affiché) |

Les prix sont des nombres (`4.5` s'affiche « 4,50 »). Après une modification, `npm test` vérifie que la carte est cohérente (prix positifs, pas de pizza perdue, etc.).

## Travailler en local

Il faut Node.js 22 ou plus récent.

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # tests : horaires, e-mail de réservation, carte, données structurées
npm run build    # site statique dans dist/
```

## Mise en ligne

Le fichier de déploiement automatique est rangé dans `docs/deploiement/deploy.yml` : GitHub refuse qu'un jeton sans le droit `workflow` envoie un fichier dans `.github/workflows/`. Pour l'activer, une seule fois :

1. Sur GitHub, dans le dépôt : **Add file → Create new file**, nommer le fichier `.github/workflows/deploy.yml`, coller le contenu de `docs/deploiement/deploy.yml`, puis **Commit changes**.
2. **Settings → Pages → Source : GitHub Actions**. Sur un compte gratuit, GitHub Pages demande un dépôt public.
3. En local, faire `git pull` pour récupérer le fichier.

Ensuite, chaque push sur `main` teste, construit et publie le site sur `https://sowvard299.github.io/la_fiamma/`.

### Passer sur le domaine du restaurant

Pour servir le site sur `lafiamma92.fr`, dans le workflow, remplacer `BASE_PATH: /la_fiamma` par `BASE_PATH: /` et `SITE_URL` par `https://www.lafiamma92.fr`, puis déclarer le domaine dans **Settings → Pages → Custom domain** et faire pointer le DNS chez le registrar. Le contenu de `dist/` peut aussi être déposé tel quel chez n'importe quel hébergeur.

## Comment c'est fait

- [Astro](https://astro.build) en sortie statique : la carte est du vrai HTML, lisible sans JavaScript.
- Polices auto-hébergées, Bodoni Moda (titres) et Hanken Grotesk (textes) : aucun appel à Google Fonts.
- La carte est en onglets (`src/lib/onglets.ts`), lisible aussi sans JavaScript.
- Le plan d'accès utilise MapLibre et les tuiles libres OpenFreeMap (sans clé), chargés seulement à l'approche de la section (`src/scripts/plan.ts`).
- Les photos sont servies par le CDN d'Unsplash, redimensionnées selon l'écran. Quand les vraies photos du restaurant arrivent, les mettre dans `public/photos/` et adapter `src/data/photos.ts`.
- Le logo illustré a été vectorisé depuis l'ancien site (`src/assets/logo-illustration.svg`, via `scripts/vectoriser-logo.py`) ; il n'est plus affiché, mais reste disponible.
- Données structurées schema.org `Restaurant` (adresse, horaires, carte) pour les moteurs de recherche.

## À confirmer avec le restaurant avant la mise en ligne

- **Les mentions légales** (obligatoires en France) : raison sociale, SIRET et directeur de la publication, à remplir dans `editeur` (`src/data/infos.ts`). Piste relevée au registre du commerce, sans certitude (aucune enseigne déclarée) : FAMI, SAS, SIREN 944 650 902, siège au 61 rue de Bitche.
- La vente à emporter, affichée d'après la fiche Google du restaurant.
- Les photos : celles du site sont des photos d'illustration libres de droits, à remplacer par les leurs.
- L'envie de montrer des avis clients en entier (le site n'affiche que les notes et renvoie vers Google et TheFork).
- Les corrections faites sur la carte de l'ancien site : « 4 Formaggi », « Valpolicella DOC », « Côtes de Provence », « Get 27 ».
