---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

# Surface : page d'accueil (une page)

Mode : Persuade. Le visiteur vient voir la carte, savoir si c'est ouvert et réserver.
Direction épinglée par le commanditaire (« A. La Fiamma, la nuit ») : pas de tirage concept-seed. Pas de génération d'image disponible : build code-led.

## Direction contract

THESIS: la page est un feu qu'on regarde de près, puis la carte qu'on lit à sa lumière. Refuse le hero photo + titre centré + bouton + trois cartes « spécialités / ambiance / livraison ».

OWN-WORLD: palette pleine, chaque couleur possède une région : nuit #1C2E3B (feu, réserver), braise #C8873A (bande pizza du mois), pierre #E4DED1 (carte), olive #4D5226 (bloc pizze bianche), pierre-ombre #D3CBBB (pied de page avec le dessin du logo). Young Serif pour tout ce qui se nomme, Hanken Grotesk pour ce qui se lit et se compte (chiffres tabulaires). Lignes de plats à points de conduite, comme une carte imprimée ; boutons à angles vifs ; pas de cartes, pas d'ombres, pas d'eyebrow.

STORY: on voit la flamme et le nom, on sait tout de suite si c'est ouvert et où c'est ; on lit la carte sans effort sur téléphone ; on appelle ou on prépare un e-mail en un geste.

FIRST VIEWPORT: plein écran nuit, canvas WebGL. Nav fine en haut : flamme du logo à gauche, Carte / Horaires / Réserver à droite. « La » puis « Fiamma » en Young Serif géant (~25vw) ancré en bas à gauche, ondulant dans une chaleur qui monte du bas, braises qui s'élèvent. Sous le nom, une bande : statut en direct avec flamme allumée/éteinte, adresse (lien itinéraire), action principale « Appeler » (braise, plein) et « Voir la carte ».

FORM: direction A de la liste présentée (1/3), épinglée par l'utilisateur ; seed key : aucun (direction épinglée). Signature : le curseur (ou le doigt) chauffe l'air autour de lui, la chaleur refroidit quand on quitte le feu en défilant. Motion : un seul moment, la chaleur ; ailleurs, seul l'index de la carte glisse (ease-out expo).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
