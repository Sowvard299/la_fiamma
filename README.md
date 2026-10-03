# La Fiamma

Site de La Fiamma, pizzeria et cuisine italienne au 61 rue de Bitche, 92400 Courbevoie.

Une seule page : la carte complète, le statut d'ouverture en direct (heure de Paris), la réservation par téléphone ou par e-mail pré-rempli, les horaires et l'adresse.

## Modifier le contenu

Tout le contenu vit dans deux fichiers. Il n'y a rien d'autre à toucher.

| Pour changer… | Fichier | Où |
|---|---|---|
| un plat, un prix, une description | `src/data/carte.ts` | `sections` |
| la pizza du mois | `src/data/carte.ts` | `pizzaDuMois` (nom, ingrédients, prix) |
| les vins | `src/data/carte.ts` | `vins` |
| les horaires d'ouverture | `src/data/infos.ts` | `horaires` (1 = lundi … 7 = dimanche, heures de Paris) |
| téléphone, e-mail, adresse | `src/data/infos.ts` | en haut du fichier |

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

Chaque push sur `main` déclenche `.github/workflows/deploy.yml`, qui teste, construit et publie sur GitHub Pages (`https://sowvard299.github.io/la_fiamma/`).

À faire une fois dans GitHub : **Settings → Pages → Source : GitHub Actions**. Sur un compte gratuit, GitHub Pages demande un dépôt public.

### Passer sur le domaine du restaurant

Pour servir le site sur `lafiamma92.fr`, dans le workflow, remplacer `BASE_PATH: /la_fiamma` par `BASE_PATH: /` et `SITE_URL` par `https://www.lafiamma92.fr`, puis déclarer le domaine dans **Settings → Pages → Custom domain** et faire pointer le DNS chez le registrar. Le contenu de `dist/` peut aussi être déposé tel quel chez n'importe quel hébergeur.

## Comment c'est fait

- [Astro](https://astro.build) en sortie statique : la carte est du vrai HTML, lisible sans JavaScript.
- Polices auto-hébergées (Young Serif, Hanken Grotesk) : aucun appel à Google Fonts.
- Le nom en haut de page est dessiné en WebGL (`src/scripts/chaleur.ts`) avec une déformation de chaleur et des braises. Le titre reste du vrai texte. L'effet s'arrête hors écran et devient une image fixe si l'appareil demande moins d'animations.
- Le logo a été vectorisé depuis l'ancien site (`scripts/vectoriser-logo.py`).
- Données structurées schema.org `Restaurant` (adresse, horaires, carte) pour les moteurs de recherche.

## À confirmer avec le restaurant avant la mise en ligne

- Les horaires, repris des annuaires en ligne.
- Les corrections faites sur la carte de l'ancien site : « 4 Formaggi », « Valpolicella DOC », « Côtes de Provence », « Get 27 ».
- Les mentions légales (raison sociale, SIRET, hébergeur), obligatoires en France.
