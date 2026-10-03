---
name: La Fiamma
description: Pizzeria et cuisine italienne à Courbevoie. Un feu qu'on regarde de près, puis la carte qu'on lit à sa lumière.
colors:
  nuit: "#1c2e3b"
  nuit-profonde: "#14222c"
  nuit-trait: "#34495a"
  braise: "#c8873a"
  braise-vive: "#e3a257"
  braise-texte: "#7e5016"
  olive: "#4d5226"
  olive-trait: "#6b7040"
  pierre: "#e4ded1"
  pierre-ombre: "#d3cbbb"
  pierre-douce: "#b9b4a8"
  encre: "#1e2a33"
  encre-douce: "#4a5560"
  erreur: "#e58a6f"
typography:
  nom:
    fontFamily: "Young Serif, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "min(calc((100cqi - 2 * var(--marge)) / 4.05), 44svh)"
    fontWeight: 400
    lineHeight: 0.88
    letterSpacing: "-0.03em"
  rubrique:
    fontFamily: "Young Serif, Georgia, serif"
    fontSize: "clamp(3rem, 1.4rem + 5.6vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  groupe:
    fontFamily: "Young Serif, Georgia, serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.6vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  plat:
    fontFamily: "Young Serif, Georgia, serif"
    fontSize: "clamp(1.1875rem, 1.05rem + 0.4vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  texte:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 420
    lineHeight: 1.55
    letterSpacing: "normal"
  petit:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 420
    lineHeight: 1.45
    letterSpacing: "normal"
  prix:
    fontFamily: "Hanken Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  vif: "2px"
  aucun: "0"
spacing:
  e-1: "0.5rem"
  e-2: "1rem"
  e-3: "1.5rem"
  e-4: "2.5rem"
  e-5: "4rem"
  e-6: "6.5rem"
  e-7: "10.5rem"
  marge: "clamp(1rem, 4.5vw, 4rem)"
components:
  bouton-braise:
    backgroundColor: "{colors.braise}"
    textColor: "{colors.nuit-profonde}"
    rounded: "{rounded.vif}"
    padding: "0.7rem 1.4rem"
    height: "3rem"
  bouton-braise-hover:
    backgroundColor: "{colors.braise-vive}"
  bouton-nuit:
    backgroundColor: "{colors.nuit}"
    textColor: "{colors.pierre}"
    rounded: "{rounded.vif}"
    padding: "0.7rem 1.4rem"
    height: "3rem"
  champ:
    backgroundColor: "transparent"
    textColor: "{colors.pierre}"
    rounded: "{rounded.aucun}"
    padding: "0.65rem 0.1rem"
    height: "3rem"
  ligne-de-plat:
    textColor: "{colors.encre}"
    typography: "{typography.plat}"
---

# Design System: La Fiamma

## Overview

La page est un feu qu'on regarde de près, puis la carte qu'on lit à sa lumière. Tout part du logo du restaurant : une flamme ocre au-dessus de bûches vert olive, une olive bleu nuit, un lettrage serif sur fond grège. Il n'y a aucune photo. L'identité tient à la typographie, au dessin du logo vectorisé et à un seul effet WebGL : la chaleur qui fait onduler le nom au-dessus du feu.

Chaque couleur possède une région entière de la page au lieu de servir d'accent : la nuit (haut de page, réservation), la braise (bande de la pizza du mois), la pierre (la carte), l'olive (le bloc des pizzas blanches), la pierre ombrée (pied de page avec le dessin). Le visiteur passe du feu à la carte, puis revient à la nuit pour réserver.

La carte se compose comme une carte imprimée : noms en serif, points de conduite, prix en chiffres tabulaires, ingrédients en petit. Rien n'est inventé : chaque phrase est un fait vérifiable sur le restaurant.

## Colors

### Primary

- **Nuit** `#1c2e3b` : le bleu du lettrage du logo. Fond du haut de page et de la réservation. Jamais remplacée par un noir.
- **Braise** `#c8873a` : la flamme du logo. Bande de la pizza du mois, boutons d'action, téléphone, flamme de l'index. Sur papier, elle n'est jamais du texte : on passe à **Braise texte** `#7e5016` (5,1:1 sur pierre).

### Secondary

- **Olive** `#4d5226` : les bûches et la branche. Porte le bloc des pizzas blanches, en texte pierre.

### Neutral

- **Pierre** `#e4ded1` : le fond grège du logo, éclairci. Le papier de la carte.
- **Pierre ombrée** `#d3cbbb` : le pied de page, sous l'illustration en couleurs.
- **Encre** `#1e2a33` et **encre douce** `#4a5560` : texte et détails sur papier (10,9:1 et 5,7:1).
- **Pierre douce** `#b9b4a8` : texte secondaire sur nuit (6,8:1).
- **Nuit profonde** `#14222c` : surface du formulaire, texte des boutons braise.

### Named Rules

**La règle des régions.** Une couleur occupe une région entière ou n'apparaît pas. Pas de dégradé décoratif, pas de lueur colorée autour des éléments : la seule lumière de la page est celle du feu, dans le shader.

**La règle de lisibilité sur le feu.** Tout texte posé sur la lueur du haut de page est en pierre pleine. La lueur reste assez sombre et rouge pour garder 4,5:1.

## Typography

**Young Serif** pour tout ce qui se nomme : le nom, les rubriques, les groupes, les plats, le téléphone, le statut. **Hanken Grotesk** (variable) pour tout ce qui se lit ou se compte : ingrédients, prix, horaires, formulaire, navigation. Les deux polices sont auto-hébergées.

### Hierarchy

- **Nom** : « Fiamma » remplit exactement la largeur utile (4,04 em avec un tracking de -0,03 em par ligne). « La » mesure 0,34 fois cette taille.
- **Rubrique** : 3 à 6 rem, interligne 0,95. Titres en italien (`lang="it"`), traduction française alignée à droite sur la même ligne de base.
- **Groupe** : 1,375 à 1,75 rem. La note éventuelle (« Base tomate ») suit en Hanken petit.
- **Plat** : 1,19 à 1,375 rem. Prix en Hanken 600, chiffres tabulaires.
- **Texte** : 17 px, interligne 1,55. **Petit** : 15 px.

### Named Rules

**Pas d'eyebrow.** Aucun petit label en majuscules espacées au-dessus d'un titre. La traduction d'une rubrique vient après, jamais au-dessus.

## Layout

- Une seule page : feu → pizza du mois → carte → réserver → pied de page.
- Marge latérale fluide `clamp(1rem, 4.5vw, 4rem)`, largeur de lecture maximale 82 rem.
- Rythme vertical sur une base de 8 px. Les rubriques sont séparées de 10,5 rem, et l'espace au-dessus d'un titre est toujours plus grand que l'espace en dessous.
- La carte varie de densité selon la rubrique : deux groupes côte à côte (antipasti, pâtes, desserts), liste en deux colonnes (salades, pizzas), trois colonnes serrées (bar), vrai tableau (vins).
- Sous 64 rem, l'index devient une barre horizontale collante. Sous 48 rem, une barre « Appeler / Réserver » apparaît en bas une fois le haut de page quitté.

## Elevation & Depth

Aucune ombre. La profondeur vient des aplats de couleur et de la lumière du feu, rendue dans le shader. Les séparations sont des filets de 1 px teintés (encre à 14-18 %, ou `nuit-trait` sur fond nuit).

## Shapes

Angles vifs : 2 px pour les boutons, 0 pour les champs, les blocs et les bandes. Les seules formes organiques sont celles du logo vectorisé.

## Components

### Buttons

- **Braise** : fond braise, texte nuit profonde, Hanken 600, hauteur minimale 3 rem. Au survol, il passe en braise vive. C'est l'action principale (appeler, envoyer).
- **Nuit** : fond nuit, texte pierre. Action secondaire de la barre mobile.
- **Lien fort** : texte souligné braise de 2 px (« Voir la carte », « Réserver une table »).

### Inputs / Fields

Champs soulignés sur nuit profonde : pas de cadre, filet pierre douce de 1 px, qui devient braise de 2 px au focus et passe en couleur `erreur` sur saisie invalide (`:user-invalid`). Libellé visible au-dessus ; « (facultatif) » en pierre douce.

### Navigation

Flamme du logo à gauche (lien vers le haut), trois liens à droite. « Réserver » est en braise. Au survol, un soulignement de 1 px se déroule de gauche à droite.

### Ligne de plat (signature)

Nom en serif, points de conduite, prix aligné à droite, détail en dessous. Sur l'olive, les prix et le texte passent en pierre. Les plats qui portent le nom de la maison reçoivent la flamme du logo.

### Index de la carte (signature)

Liste des rubriques, collante. La flamme glisse devant la rubrique en cours (ease-out exponentiel, 0,6 s). Sur mobile, c'est une barre qui défile seule jusqu'à la rubrique active, soulignée de braise.

### Chaleur (signature)

Canvas WebGL plein haut de page. Le nom y est redessiné à la position exacte du `h1`, puis déformé par un bruit qui monte, plus fort près du bas et autour du pointeur. Des braises s'élèvent et s'éteignent avant le haut de l'écran. L'effet faiblit quand on fait défiler la page, s'arrête hors écran ou quand l'onglet est caché, devient une image fixe en mouvement réduit, et disparaît au profit du texte normal sans WebGL.

## Do's and Don'ts

### Do:

- **Do** tirer toute nouvelle couleur du logo, et lui donner une région entière.
- **Do** écrire les faits du restaurant et rien d'autre ; les horaires et la carte viennent de `src/data/`.
- **Do** garder les titres de rubrique en italien avec `lang="it"`, la traduction française à côté.
- **Do** utiliser des chiffres tabulaires pour tout prix ou horaire.
- **Do** respecter `prefers-reduced-motion` pour toute animation continue.

### Don't:

- **Don't** utiliser Inter, Playfair, Fraunces, Instrument Serif, Space Grotesk ou Geist.
- **Don't** ajouter d'eyebrow, de numérotation décorative, d'emoji, de cartes à ombre ou d'effet de verre.
- **Don't** écrire de tiret cadratin dans les textes visibles.
- **Don't** ajouter de photo de banque d'images, de faux avis, de note chiffrée ou d'histoire de la maison.
- **Don't** mettre de texte braise sur le papier : utiliser braise texte.
