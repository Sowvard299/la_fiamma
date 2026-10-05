# La Fiamma : refonte du site (spec de design)

Date : 2026-10-02
Statut : validée (carte blanche donnée sur les détails)

## Objectif

Refaire gratuitement le site de La Fiamma, pizzeria et cuisine italienne au 61 rue de Bitche, 92400 Courbevoie, avec un design très travaillé qui ne ressemble pas à un site généré par IA. Le site sert à trois choses, dans cet ordre : consulter la carte (surtout sur mobile), savoir si c'est ouvert et où c'est, réserver (téléphone ou e-mail).

## Ce qui a été décidé

- Pas de photos. Identité typographique + dessin du logo + un seul effet WebGL qui a un sens (la chaleur d'une flamme).
- Réservation : bouton d'appel + mini-formulaire qui compose un e-mail pré-rempli (mailto) vers lafiamma92400@gmail.com. Aucun serveur, aucun compte tiers.
- Direction « La Fiamma, la nuit » : haut et bas de page en bleu nuit, carte composée sur papier grège.

## Anti-patterns interdits (recherche « AI slop », oct. 2026)

Typo : Inter, Space Grotesk, Geist, Instrument Serif, Fraunces, Playfair Display, serif italique géante en hero.
Couleur : dégradés violet/bleu, titres en dégradé, lueurs colorées, crème + terracotta, noir + un accent acide, vert émeraude par défaut.
Layout : hero centré + deux boutons, eyebrow (petit label majuscule espacé au-dessus d'un titre), trois cartes à icône, numérotation décorative 01/02/03, bordure colorée sur un côté des cartes, emojis en navigation, rangée de statistiques.
Composants : `rounded-2xl shadow-lg` partout, glassmorphism, icône dans un carré arrondi, flèche collée aux CTA.
Motion : même fade-up sur chaque section, easing rebond, compteurs animés, mouvement qui ignore `prefers-reduced-motion`.
Texte : tirets cadratins, « sublimer », « expérience unique », « savourez », faux avis, fausses stats, histoire inventée.

## Identité

Couleurs (tirées du logo) :

| Token | Valeur | Usage |
|---|---|---|
| `--nuit` | `#1C2E3B` | fonds hero / réserver / footer |
| `--nuit-profonde` | `#14222C` | ombres internes, bas du hero |
| `--braise` | `#C8873A` | flamme, accents sur fond nuit |
| `--braise-texte` | `#8A5A1C` | accents texte sur papier (contraste AA) |
| `--olive` | `#4D5226` | filets, détails, pizza bianca |
| `--pierre` | `#E4DED1` | papier de la carte |
| `--pierre-ombre` | `#D3CBBB` | séparations, surfaces secondaires |
| `--encre` | `#1E2A33` | texte sur papier |

Typographies (auto-hébergées) : **Young Serif** (nom, titres, noms de plats) et **Hanken Grotesk** (ingrédients, prix en chiffres tabulaires, infos, navigation).

Logo : l'illustration (flamme ocre, bûches, branche d'olivier) est vectorisée depuis le PDF fourni. La flamme seule sert de favicon et de signature.

## Structure de la page (une seule page)

1. **Nuit** (100svh). Navigation minimale : marque, Carte, Infos, Réserver (+ téléphone cliquable sur mobile). « La Fiamma » en Young Serif géant, ancré en bas à gauche, rendu dans un canvas WebGL avec une distorsion de chaleur (bruit animé, plus forte en bas) et des braises qui montent ; le curseur ajoute de la chaleur localement. Le `h1` reste du vrai texte dans le DOM. Sous le nom : statut en direct (« Ouvert jusqu'à 22h30 » / « Fermé, on rouvre lundi à 12h »), adresse, « Pizzeria et cuisine italienne ».
2. **Pizza del mese** : Pizza Pepe (base tomate, œuf, pepperoni, parmesan, 17 €), mise en avant à la transition nuit → papier.
3. **La Carta** : index des sections collant à gauche (desktop) / barre horizontale collante (mobile), avec section active surlignée. Sections : Antipasti (individuels, à partager), Insalate, Pizze (Rossa / Bianca côte à côte sur desktop, suppléments), Pasta & Piatti (note garniture), Dolci & Gelato, Bar, Vini (tableau verre / bouteille / pichet). Mention allergies + prix nets service compris.
4. **Réserver & infos** (retour nuit) : numéro géant cliquable, formulaire e-mail (nom, date, heure, couverts, message) qui ouvre la messagerie avec un message pré-rempli, horaires avec le jour courant surligné, adresse + liens Google Maps / Apple Plans.
5. **Pied de page** : illustration du logo, contact, mentions.

## Technique

- Astro (sortie statique), aucun framework client. Scripts en TypeScript vanilla.
- `src/data/carte.ts` : toute la carte (source unique). `src/data/infos.ts` : adresse, téléphone, e-mail, horaires.
- `src/lib/horaires.ts` : logique pure « ouvert / fermé / prochaine ouverture » en heure de Paris, testée avec Vitest.
- WebGL fait main (pas de three.js) : un quad plein écran, texture du texte dessinée sur un canvas 2D après chargement des polices, shader de distorsion + braises. DPR plafonné, pause hors écran et onglet caché, version statique si `prefers-reduced-motion` ou pas de WebGL.
- Polices via Fontsource (aucun appel à Google Fonts).
- SEO : `schema.org/Restaurant` en JSON-LD (adresse, horaires, téléphone, carte, cuisine), meta, image Open Graph.
- Accessibilité : contrastes AA, focus visibles, navigation clavier, landmarks, langue `fr`.
- Déploiement : GitHub Actions → GitHub Pages sur `Sowvard299/la_fiamma` (base path configurable pour un futur domaine `lafiamma92.fr`).

## Vérification

- `npm test` (horaires), `npm run build` sans erreur.
- Contrôle visuel desktop + mobile dans le navigateur, console sans erreur, test `prefers-reduced-motion`.
- Relecture contre la liste d'anti-patterns ci-dessus.

## Corrections de contenu par rapport au site actuel (à faire valider)

- « 4 Fromaggi » → « 4 Formaggi »
- « Valpolicella OGC » → « Valpolicella DOC »
- « Get27 » → « Get 27 » ; « IPA (Indian) » → « IPA »
- Horaires repris des annuaires (Mappy / PagesJaunes) : lun–ven 12h–14h30 et 19h–22h30, sam 19h–22h30, dim fermé. À confirmer.
- Mentions légales (raison sociale, SIRET, hébergeur) à fournir par le restaurant.

## Révision du 5 octobre 2026 : direction « Trattoria »

Le commanditaire a jugé la première version (nuit + chaleur WebGL, sans photos) pas assez professionnelle et a demandé de retirer la flamme, perçue comme un emoji. Trois maquettes de haut de page lui ont été présentées (Plein cadre, Diptyque, Trattoria) ; il a choisi **Trattoria**.

- Fond pierre clair `#ece6da`, titres en Bodoni Moda, textes en Hanken Grotesk, couleurs du logo en aplats (braise, olive, nuit).
- Photos d'illustration Unsplash (licence libre), créditées dans le pied de page et signalées « non contractuelles ».
- Haut de page : « Pizze, pasta & antipasti à Courbevoie », disque de pizza qui tourne au défilement, étiquette « Pizza du mois » lue dans les données, statut en direct, téléphone, note TheFork.
- Carte en onglets avec une photo par rubrique. Nouvelles sections : avis (notes Google et TheFork vérifiées et datées, liens vers les plateformes, sans citer d'avis) et accès (plan MapLibre + OpenFreeMap recoloré, horaires, itinéraires).
- Plus aucune icône flamme ni emoji ; favicon en monogramme « F ».
- Retirés : effet WebGL, Young Serif, logo illustré affiché.
