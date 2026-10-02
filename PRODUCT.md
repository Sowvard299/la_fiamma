# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Astro en sortie statique, TypeScript vanilla côté client, WebGL écrit à la main. Choisi pour une carte en vrai HTML (référencement, lecture sans JS), un poids minimal sur mobile et un hébergement gratuit (GitHub Pages, puis le domaine lafiamma92.fr).

## Users

- Habitants et salariés du quartier (Courbevoie, La Défense toute proche) qui regardent la carte sur leur téléphone avant de venir ou pour choisir quoi commander.
- Personnes qui veulent savoir si c'est ouvert maintenant, où c'est, et comment réserver.

## Product Purpose

Le site de La Fiamma, pizzeria et cuisine italienne au 61 rue de Bitche, 92400 Courbevoie. Il doit montrer la carte complète avec les prix, dire si le restaurant est ouvert, et permettre de réserver par téléphone ou par e-mail. Le site est offert au restaurant ; il remplace un site existant jugé peu soigné.

## Positioning

Un restaurant de quartier dont le nom et le logo parlent de feu : une flamme ocre au-dessus de bûches, une branche d'olivier. Rien d'autre n'est revendiqué.

## Operating Context

- Ouvert du lundi au vendredi de 12h à 14h30 et de 19h à 22h30, le samedi de 19h à 22h30, fermé le dimanche (repris des annuaires, à confirmer).
- Réservation par téléphone (01 43 33 77 58) ou par e-mail (lafiamma92400@gmail.com). Pas de système de réservation en ligne.
- La pizza du mois change : elle doit se modifier en une ligne.

## Capabilities and Constraints

- Une seule page en français.
- Le contenu (carte, horaires, contacts) vit dans `src/data/` et ne doit être modifié qu'à cet endroit.
- Le formulaire de réservation compose un e-mail dans la messagerie du visiteur ; il n'envoie rien lui-même.
- Mentions légales à compléter par le restaurant (raison sociale, SIRET, hébergeur).

## Brand Commitments

- Nom : La Fiamma. Logo existant : flamme ocre, bûches et branche d'olivier vert olive, olive bleu nuit, lettrage serif bleu nuit sur fond grège (vectorisé dans `src/assets/`).
- Pas de photos (choix du commanditaire) : identité portée par la typographie, le dessin du logo et un effet de chaleur en WebGL.
- Le site ne doit pas avoir l'air généré par une IA (exigence explicite du commanditaire).

## Evidence on Hand

- Carte complète et prix (repris de l'ancien site, quelques coquilles corrigées).
- Adresse, téléphone, e-mail, horaires.
- Aucune photo, aucun avis client, aucune histoire de la maison : ne rien inventer (pas de date de fondation, pas de « four à bois », pas de témoignages, pas de note chiffrée).

## Product Principles

- La carte d'abord : c'est la raison n°1 de la visite, elle doit se lire vite sur un téléphone.
- Dire la vérité utile : ouvert ou fermé, maintenant, en heure de Paris.
- Réserver en un geste : le numéro est toujours à portée de pouce.
- Rien d'inventé : chaque phrase du site est un fait vérifiable.

## Accessibility & Inclusion

- Contrastes WCAG AA, navigation clavier, lecteurs d'écran (le nom en WebGL reste du vrai texte), respect de « réduire les animations ».
