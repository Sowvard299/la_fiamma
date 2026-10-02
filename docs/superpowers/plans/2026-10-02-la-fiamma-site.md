# La Fiamma : site vitrine — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un site une page pour La Fiamma (Courbevoie) : carte complète, statut d'ouverture en direct, réservation par téléphone ou e-mail pré-rempli, identité « la nuit » avec effet de chaleur WebGL.

**Architecture:** Astro en sortie statique. Le contenu vit dans deux fichiers de données typés (`carte.ts`, `infos.ts`). La logique (horaires, composition de l'e-mail) est en TypeScript pur testé par Vitest. Le rendu est en composants `.astro` sans framework client ; trois petits scripts vanilla (chaleur WebGL, statut, index de la carte, formulaire).

**Tech Stack:** Astro (dernière stable), TypeScript, Vitest, Fontsource (Young Serif, Hanken Grotesk), WebGL 1 brut, GitHub Actions → GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-02-la-fiamma-site-design.md`

## Global Constraints

- Langue `fr`, contenu factuel uniquement (rien d'inventé : pas d'histoire, pas d'avis, pas de « four à bois »).
- Aucune police interdite (Inter, Space Grotesk, Geist, Instrument Serif, Fraunces, Playfair). Aucun appel à fonts.googleapis.com.
- Aucun tiret cadratin (—) dans les textes visibles. Pas d'emoji. Pas d'eyebrow majuscule espacé au-dessus d'un titre. Pas de numérotation décorative.
- Couleurs uniquement via les tokens de la spec (`--nuit`, `--nuit-profonde`, `--braise`, `--braise-texte`, `--olive`, `--pierre`, `--pierre-ombre`, `--encre`).
- Heures toujours évaluées en `Europe/Paris`, quel que soit le fuseau du visiteur.
- `prefers-reduced-motion: reduce` ⇒ aucune animation continue.
- Base path configurable (`BASE_PATH`, défaut `/la_fiamma`) : tous les liens internes et assets passent par `import.meta.env.BASE_URL`.

## Review Focus

- Visiteur hors de France (ex. New York) : le statut doit refléter l'heure de Paris, pas l'heure locale.
- Changement d'heure (25 oct. 2026) : statut juste de part et d'autre.
- Date choisie dans le formulaire : `new Date("2026-10-10")` décale d'un jour dans les fuseaux négatifs ; le jour affiché doit être celui saisi.
- Accents et retours à la ligne dans le mailto : doivent arriver intacts dans Gmail / Mail (pas de `+` pour les espaces).
- Navigateur sans WebGL ou mouvement réduit : le nom « La Fiamma » doit rester visible et lisible.

---

### Task 1: Scaffold Astro + Vitest + polices

**Files:** Create `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro` (temporaire), `src/env.d.ts`.

- [ ] `git init`, branche `main`, remote `origin` → `https://github.com/Sowvard299/la_fiamma.git`.
- [ ] `npm i astro` ; `npm i -D vitest typescript @astrojs/check` ; `npm i @fontsource/young-serif @fontsource-variable/hanken-grotesk`.
- [ ] `astro.config.mjs` :

```js
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://sowvard299.github.io',
  base: process.env.BASE_PATH ?? '/la_fiamma',
  trailingSlash: 'ignore',
});
```

- [ ] Scripts : `"dev": "astro dev"`, `"build": "astro build"`, `"preview": "astro preview"`, `"test": "vitest run"`, `"check": "astro check"`.
- [ ] `npm run build` passe ; `npm test` tourne (0 test). Commit `chore: scaffold Astro + Vitest`.

### Task 2: Données (infos + carte)

**Files:** Create `src/data/infos.ts`, `src/data/carte.ts`, `src/data/carte.test.ts`.

**Interfaces — Produces:**

```ts
// infos.ts
export const infos: {
  nom: 'La Fiamma'; adresse: { rue: string; codePostal: string; ville: string };
  telephone: { affichage: string; lien: string }; email: string;
  horaires: Semaine; // importé de src/lib/horaires.ts
};
// carte.ts
export interface Plat { nom: string; detail?: string; prix: number; volume?: string; supplement?: boolean; maison?: boolean }
export interface Groupe { titre?: string; note?: string; plats: Plat[] }
export interface Section { id: string; titre: string; traduction: string; groupes: Groupe[] }
export interface LigneVin { nom: string; prix: number[] }
export interface Vins { colonnes: string[]; regions: { titre: string; couleurs: { titre: string; vins: LigneVin[] }[] }[]; pichet: { colonnes: string[]; vins: LigneVin[] } }
export const pizzaDuMois: Plat;
export const sections: Section[];   // antipasti, insalate, pizze, pasta, dolci, bar
export const vins: Vins;
export function prixFr(n: number): string; // 17 → "17", 4.5 → "4,50", 2.5 → "2,50"
```

- [ ] Test : ids uniques, tout prix > 0, `prixFr` (17 → "17", 4.5 → "4,50", 1.5 → "1,50"), aucune chaîne ne contient « — ».
- [ ] Recopier intégralement la carte du site actuel avec les corrections listées dans la spec. Les deux plats nommés « Fiamma » ont `maison: true` (ils portent le nom de la maison, rien de plus n'est affirmé).
- [ ] `npm test` vert. Commit `feat: données de la carte et infos`.

### Task 3: Logique des horaires (TDD)

**Files:** Create `src/lib/horaires.ts`, `src/lib/horaires.test.ts`.

**Interfaces — Produces:**

```ts
export type JourIso = 1|2|3|4|5|6|7;                 // 1 = lundi
export interface Plage { debut: string; fin: string } // "HH:MM" heure de Paris
export type Semaine = Record<JourIso, Plage[]>;
export type Statut =
  | { ouvert: true; fermeA: string }
  | { ouvert: false; prochaine: { jour: JourIso; heure: string; dansJours: number } | null };
export const NOMS_JOURS: Record<JourIso, string>;
export function momentAParis(date: Date): { jour: JourIso; minutes: number };
export function statut(date: Date, semaine: Semaine): Statut;
export function libelleStatut(s: Statut): string;
export function heureFr(hhmm: string): string;        // "12:00" → "12h", "14:30" → "14h30"
export function ouvertA(jour: JourIso, hhmm: string, semaine: Semaine): boolean;
export function plagesFr(plages: Plage[]): string;     // "12h à 14h30, 19h à 22h30" | "Fermé"
```

- [ ] Tests d'abord (dates avec offset explicite, 2026-10-05 = lundi) :
  - lundi 13:00+02:00 → `{ouvert:true, fermeA:'14:30'}` ; libellé « Ouvert jusqu'à 14h30 »
  - lundi 12:00 pile → ouvert ; lundi 14:30 pile → fermé
  - lundi 15:00 → prochaine lundi 19:00, dansJours 0 ; libellé « Fermé, on rouvre ce soir à 19h »
  - lundi 09:00 → libellé « Fermé, on ouvre à 12h »
  - vendredi 23:00 → samedi 19:00 ; « Fermé, on rouvre demain à 19h »
  - samedi 23:00 → lundi 12:00 dansJours 2 ; « Fermé, on rouvre lundi à 12h »
  - visiteur à New York : `2026-10-05T07:00:00-04:00` (= 13:00 Paris) → ouvert
  - heure d'hiver : `2026-12-07T11:30:00Z` → ouvert (12:30 Paris) ; `2026-12-07T10:30:00Z` → fermé
  - semaine vide → `{ouvert:false, prochaine:null}`, libellé « Fermé »
- [ ] Vérifier l'échec, implémenter (Intl.DateTimeFormat `en-GB`, `timeZone: 'Europe/Paris'`, `hourCycle: 'h23'`), vérifier le vert. Commit.

### Task 4: Composition de l'e-mail de réservation (TDD)

**Files:** Create `src/lib/reservation.ts`, `src/lib/reservation.test.ts`.

**Interfaces — Produces:**

```ts
export interface DemandeReservation { nom: string; date: string; heure: string; couverts: number; telephone?: string; message?: string }
export function jourIsoDeDate(isoDate: string): JourIso;   // sans passer par le fuseau local
export function dateFr(isoDate: string): string;            // "2026-10-10" → "samedi 10 octobre"
export function lienMail(destinataire: string, d: DemandeReservation): string;
```

- [ ] Tests : `dateFr('2026-10-10') === 'samedi 10 octobre'` ; `jourIsoDeDate('2026-10-11') === 7` ; le lien commence par `mailto:lafiamma92400@gmail.com?subject=` ; contient `%C3%A9` (é), `%0D%0A`, aucun `+` ; sujet « Réservation samedi 10 octobre à 20h, 4 personnes » ; singulier « 1 personne » ; ligne téléphone absente si vide.
- [ ] Implémenter (`Date.UTC` + `getUTCDay`, `encodeURIComponent`, lignes jointes par `\r\n`). Vert. Commit.

### Task 5: Logo vectorisé + favicon

**Files:** Create `src/assets/logo-illustration.svg`, `src/assets/flamme.svg`, `public/favicon.svg`, `scripts/vectoriser-logo.py` (outil, non livré au build).

- [ ] Depuis l'image du logo extraite du PDF : détourer le fond grège (distance couleur + bord doux), découper l'illustration (sans le texte) et la flamme seule, vectoriser (vtracer, mode couleur, palette réduite).
- [ ] `flamme.svg` monochrome en `currentColor` (inline dans la nav, recolorable). `favicon.svg` = flamme braise sur nuit.
- [ ] Contrôle visuel des SVG. Commit.

### Task 6: Base (layout, tokens, SEO)

**Files:** Create `src/layouts/Base.astro`, `src/styles/tokens.css`, `src/styles/base.css`, `src/lib/jsonld.ts`, `src/lib/jsonld.test.ts`.

- [ ] Tokens couleur de la spec + échelle typographique fluide (`clamp`) + espacements. Fontsource importé dans `base.css`.
- [ ] `<head>` : title « La Fiamma, pizzeria et cuisine italienne à Courbevoie », description factuelle, OG, favicon via BASE_URL, `theme-color` nuit, JSON-LD.
- [ ] `jsonld.ts` : `restaurantJsonLd(infos, sections, vins)` → objet schema.org Restaurant (adresse, téléphone E.164 `+33143337758`, `openingHoursSpecification` dérivé de `infos.horaires`, `servesCuisine`, `hasMenu`). Test : 6 jours avec horaires (lun–sam), dimanche absent, `telephone` en E.164.
- [ ] Commit.

### Task 7: Hero « nuit » + chaleur WebGL

**Files:** Create `src/components/Nav.astro`, `src/components/Hero.astro`, `src/components/Statut.astro`, `src/scripts/chaleur.ts`, `src/scripts/statut.ts`.

- [ ] `h1` réel : `<span class="la">La</span><span class="fiamma">Fiamma</span>`, Young Serif, `Fiamma` ≈ 24vw, ancré en bas à gauche, `line-height` fixé.
- [ ] `chaleur.ts` : canvas plein hero ; texture 2D du texte dessinée aux positions DOM exactes des deux spans (baseline = top + (L − (A+D))/2 + A via `measureText().fontBoundingBox*`) après `document.fonts.load`. Shader : déplacement fbm qui monte, amplitude croissante vers le bas + autour du curseur (énergie qui décroît), lueur de braise texturée en bas, braises en cellules hachées sur 2 couches, grain. Quand le canvas tourne, le `h1` passe en `color: transparent` (reste sélectionnable / lu). DPR ≤ 1.5, pause hors écran (IntersectionObserver) et onglet caché, resize debouncé. Reduced motion : une seule image fixe. Pas de WebGL : rien ne change, le `h1` reste visible.
- [ ] `statut.ts` : remplit `[data-statut]` via `libelleStatut(statut(new Date(), infos.horaires))`, rafraîchi chaque minute ; l'indicateur flamme est allumé si ouvert.
- [ ] Vérif navigateur : desktop + mobile, console propre. Commit.

### Task 8: Pizza del mese + La Carta

**Files:** Create `src/components/PizzaDuMois.astro`, `src/components/Carta.astro`, `src/components/ListePlats.astro`, `src/components/TableVins.astro`, `src/scripts/carta-index.ts`.

- [ ] Pizza du mois sur fond nuit : « Ce mois-ci, la Pepe. », ingrédients, prix.
- [ ] Feuille « papier » (grain SVG feTurbulence en data URI, très léger) ; sur desktop marges nuit autour de la feuille.
- [ ] Index collant (gauche desktop, barre horizontale mobile) ; `carta-index.ts` marque la section active (IntersectionObserver) et fait défiler la barre mobile vers l'item actif.
- [ ] Lignes de plat : nom (Young Serif) + points de conduite + prix (chiffres tabulaires) ; détail en dessous. Pizze : Rossa en 2 colonnes, Bianca + suppléments en bandeau. Vins en vrai `<table>`.
- [ ] Mention allergies / prix nets. Vérif navigateur. Commit.

### Task 9: Réserver, infos, pied de page

**Files:** Create `src/components/Reserver.astro`, `src/components/Horaires.astro`, `src/components/PiedDePage.astro`, `src/components/BarreMobile.astro`, `src/scripts/reservation.ts`.

- [ ] Numéro géant `tel:`. Formulaire (nom, date, heure, couverts 1–20, téléphone optionnel, message) → `location.href = lienMail(...)` ; avertissement si `!ouvertA(jourIsoDeDate(date), heure, horaires)` (« Attention, le restaurant est fermé à ce moment-là. ») sans bloquer.
- [ ] Horaires lun → dim via `plagesFr`, ligne du jour (heure de Paris) surlignée par script.
- [ ] Liens itinéraire Google Maps / Apple Plans (adresse encodée).
- [ ] Barre mobile fixe (Appeler / Réserver) visible après le hero, cachée sur la section Réserver.
- [ ] Pied de page sur pierre avec l'illustration couleur. Commit.

### Task 10: Passe design + accessibilité + perf

- [ ] Relecture contre la liste d'anti-patterns (grep `—`, polices, eyebrow, emojis).
- [ ] Focus visibles, contrastes, ordre clavier, `prefers-reduced-motion`, rendu sans JS.
- [ ] Vérif à 375, 768, 1280, 1920 px. Corriger. Commit.

### Task 11: Déploiement + README + push

**Files:** Create `.github/workflows/deploy.yml`, `README.md`, `public/og.png`.

- [ ] Workflow : checkout, setup-node 22, `npm ci`, `npm test`, `npm run build`, upload-pages-artifact, deploy-pages.
- [ ] README (FR) : modifier la carte / la pizza du mois / les horaires, lancer en local, passer sur le domaine `lafiamma92.fr` (`BASE_PATH=/`, `SITE_URL`).
- [ ] Image OG 1200×630 (nom + flamme sur nuit).
- [ ] Push sur `main`.
