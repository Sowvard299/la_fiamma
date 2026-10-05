---
name: La Fiamma
description: Pizzeria et cuisine italienne à Courbevoie. Une trattoria moderne, chaleureuse et lisible.
colors:
  pierre: "#ece6da"
  pierre-claire: "#f4efe6"
  pierre-ombre: "#ddd4c4"
  trait: "#d3cab9"
  encre: "#1b2730"
  encre-douce: "#4f5b64"
  nuit: "#16232c"
  nuit-profonde: "#0f181f"
  nuit-trait: "#2c3b46"
  pierre-douce: "#b9b2a5"
  braise: "#c8873a"
  braise-vive: "#e3a257"
  braise-texte: "#7e5016"
  olive: "#4d5226"
  olive-trait: "#6b7040"
  ouvert: "#4f9a5a"
  erreur: "#e58a6f"
typography:
  titre:
    fontFamily: "Bodoni Moda Variable, Bodoni 72, Didot, Georgia, serif"
    fontSize: "clamp(3rem, 1.4rem + 5.2vw, 6.75rem)"
    fontWeight: 500
    lineHeight: 0.96
    letterSpacing: "-0.03em"
  section:
    fontFamily: "Bodoni Moda Variable, Georgia, serif"
    fontSize: "clamp(2.75rem, 1.6rem + 4.4vw, 5.25rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  groupe:
    fontFamily: "Bodoni Moda Variable, Georgia, serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.6vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  plat:
    fontFamily: "Bodoni Moda Variable, Georgia, serif"
    fontSize: "clamp(1.125rem, 1.02rem + 0.35vw, 1.3125rem)"
    fontWeight: 500
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
  disque: "50%"
spacing:
  e-1: "0.5rem"
  e-2: "1rem"
  e-3: "1.5rem"
  e-4: "2.5rem"
  e-5: "4rem"
  e-6: "6.5rem"
  e-7: "9rem"
  marge: "clamp(1.25rem, 5vw, 5rem)"
  entete: "4.5rem"
components:
  bouton-braise:
    backgroundColor: "{colors.braise}"
    textColor: "{colors.nuit-profonde}"
    rounded: "{rounded.vif}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  bouton-braise-hover:
    backgroundColor: "{colors.braise-vive}"
  bouton-nuit:
    backgroundColor: "{colors.nuit}"
    textColor: "{colors.pierre}"
    rounded: "{rounded.vif}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  bouton-ligne:
    backgroundColor: "transparent"
    textColor: "{colors.encre}"
    rounded: "{rounded.vif}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  ligne-de-plat:
    textColor: "{colors.encre}"
    typography: "{typography.plat}"
---

# Design System: La Fiamma

## Overview

Une trattoria moderne : un fond pierre clair, des titres en Bodoni (le caractère italien né à Parme), de grandes photos de plats et les couleurs du logo posées en aplats francs. Le haut de page dit tout de suite ce qu'on mange et où (« Pizze, pasta & antipasti à Courbevoie »), montre une pizza entière découpée en disque, et donne les trois informations utiles : ouvert ou fermé maintenant, le téléphone, la note TheFork.

Le site reste factuel : chaque phrase est vérifiable. Les photos sont des photos d'illustration sous licence Unsplash, créditées et signalées comme telles dans le pied de page, en attendant les vraies.

Aucune icône décorative : pas de flamme, pas d'emoji. Le nom « La Fiamma » écrit en Bodoni tient lieu de logo dans l'en-tête ; le favicon est un « F » en Bodoni sur bleu nuit.

## Colors

### Primary

- **Braise** `#c8873a` : actions principales (Réserver une table), étiquette de la pizza du mois, esperluette du titre, soulignés des liens forts, étoiles des avis. Jamais en texte sur la pierre : on passe alors à **Braise texte** `#7e5016` (prix de la carte, 5,6:1).
- **Nuit** `#16232c` : bandeau défilant, section Réserver, bouton Réserver de l'en-tête.

### Secondary

- **Olive** `#4d5226` : l'aplat derrière la pizza du haut de page, le bloc des pizzas blanches, toute la section Avis.

### Neutral

- **Pierre** `#ece6da` : le fond de la page. **Pierre ombrée** `#ddd4c4` : le pied de page. **Trait** `#d3cab9` : filets.
- **Encre** `#1b2730` et **encre douce** `#4f5b64` : texte et texte secondaire.
- **Ouvert** `#4f9a5a` : la pastille du statut quand le restaurant est ouvert ; grise sinon.

### Named Rules

**Une couleur, une région.** Braise, olive et nuit occupent des blocs entiers (étiquette, aplat, section) au lieu de se disperser en accents.

## Typography

**Bodoni Moda** (variable, axe de taille optique) pour tout ce qui se nomme : titres, rubriques, plats, notes, téléphone, nom du restaurant. **Hanken Grotesk** (variable) pour tout ce qui se lit et se compte : textes, ingrédients, prix, horaires, formulaires. Les deux polices sont auto-hébergées.

### Hierarchy

- **Titre** de la page : 3 à 6,75 rem, interligne 0,96.
- **Section** (La carte, Ce qu'en disent nos clients, Nous trouver, Réserver) : 2,75 à 5,25 rem.
- **Rubrique** de la carte : 2,25 à 3,75 rem, soulignée d'un filet encre ; traduction française alignée à droite.
- **Plat** : 1,125 à 1,31 rem, points de conduite, prix en chiffres tabulaires.

### Named Rules

**Pas d'eyebrow, pas d'icône.** Aucun petit label au-dessus d'un titre, aucune icône décorative. Les seuls signes graphiques sont la pastille de statut et les étoiles des notes.

## Layout

- En-tête collant (4,5 rem), transparent en haut de page, pierre pleine avec un filet dès qu'on défile.
- Haut de page en deux colonnes : texte à gauche, scène à droite (aplat olive, disque de pizza, verre, étiquette braise). Sur mobile, la scène passe au-dessus du texte.
- La carte est en onglets collants sous l'en-tête. Chaque rubrique : photo à gauche (collante sur ordinateur), plats à droite. Sans JavaScript, toutes les rubriques s'affichent l'une sous l'autre.
- Rythme vertical sur une base de 8 px ; sections espacées de 9 rem.
- Sous 48 rem, une barre « Appeler / Réserver » apparaît en bas une fois le haut de page quitté.

## Elevation & Depth

Une seule ombre, douce et décalée vers le bas, sous les objets posés de la scène (disque, étiquette) et le repère du plan. Partout ailleurs, la profondeur vient des aplats.

## Shapes

Angles vifs (2 px) pour les boutons, 0 pour les blocs et les photos. Une seule forme ronde : le disque de la pizza, parce que la pizza est ronde.

## Components

### Buttons

- **Braise** : action principale. **Nuit** : Réserver dans l'en-tête, barre mobile. **Ligne** : action secondaire (Voir la carte), qui se remplit d'encre au survol.

### Navigation

Nom en Bodoni à gauche, trois liens et un bouton nuit à droite. Sur mobile : nom, « La carte » et le bouton.

### Onglets de la carte (signature)

Noms italiens en Bodoni ; l'onglet actif est souligné de braise. Les liens profonds (`#carte-pizze`) ouvrent la bonne rubrique ; flèches, Début et Fin au clavier.

### Scène du haut de page (signature)

La pizza tourne lentement quand on fait défiler la page (animation liée au défilement, coupée en mouvement réduit). L'étiquette « Pizza du mois » est lue dans les données de la carte.

### Navigation

Sur ordinateur, le lien de la section en cours de lecture est souligné de braise. Sur mobile (sous 52 rem), un bouton texte « Menu » ouvre un panneau pierre plein écran : sections en Bodoni, téléphone et adresse ; il se ferme au clic sur un lien ou avec Échap. Un lien « Aller au contenu » apparaît au premier Tab.

### Recherche dans la carte

Champ souligné au-dessus des onglets. Dès deux lettres, les rubriques laissent place à la liste des plats trouvés (nom, ingrédients, sans accents), chacun avec un lien vers sa rubrique ; Échap, « Effacer » ou un onglet rendent la carte normale.

### Réservation

Trois voies, dans cet ordre : le téléphone en grand, TheFork en lien, l'e-mail pré-rempli. Le champ Heure est une liste des créneaux du jour choisi (toutes les 15 min, jusqu'à 30 min avant la fermeture, groupés Midi / Soir) ; un jour fermé le dit en clair.

### Plan d'accès

MapLibre avec les tuiles libres OpenFreeMap, recolorées aux teintes du site ; repère « La Fiamma » en Bodoni sur fond nuit. Chargé seulement à l'approche de la section ; le défilement de la page n'est jamais capturé (Ctrl + molette ou deux doigts pour zoomer).

## Do's and Don'ts

### Do:

- **Do** lire toute information du restaurant dans `src/data/` (carte, horaires, avis, photos).
- **Do** dater les notes d'avis et citer leur source.
- **Do** créditer chaque photo d'illustration et la signaler comme telle.
- **Do** utiliser des chiffres tabulaires pour les prix et les horaires.

### Don't:

- **Don't** ajouter d'icône flamme ou d'emoji.
- **Don't** inventer d'histoire, de faux avis ou de photo de salle qui ne serait pas la leur.
- **Don't** mettre de texte braise sur la pierre.
- **Don't** écrire de tiret cadratin dans les textes visibles.
