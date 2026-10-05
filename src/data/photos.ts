/*
 * Photos d'illustration, en attendant les vraies photos du restaurant.
 * Toutes sont sous licence Unsplash (usage commercial libre, sans attribution obligatoire) ;
 * on crédite quand même les photographes dans le pied de page.
 * Pour remplacer une photo : changer `id` (l'identifiant « photo-… » de l'image) et le crédit.
 */

export interface Photo {
  /** Identifiant de l'image sur images.unsplash.com, sans le préfixe « photo- ». */
  id: string;
  alt: string;
  auteur: string;
  page: string;
}

export const photos = {
  disque: {
    id: '1593560708920-61dd98c46a4e',
    alt: 'Une pizza entière vue de dessus, roquette et mozzarella',
    auteur: 'Saundarya Srinivasan',
    page: 'https://unsplash.com/photos/60nzTP7_hMQ',
  },
  spritz: {
    id: '1725541592916-83dc6c458b53',
    alt: 'Un verre de spritz posé sur une table',
    auteur: 'Stanislav Rozhkov',
    page: 'https://unsplash.com/photos/FySgIa7sKTE',
  },
  pizzeHaut: {
    id: '1716237389458-be18cf75fafe',
    alt: 'Une pizza au basilic sur une planche en bois sombre',
    auteur: 'Aldward Castillo',
    page: 'https://unsplash.com/photos/G6ptCJ_6NbA',
  },
  antipasti: {
    id: '1649400454485-b8ad827f929d',
    alt: 'Une burrata entourée de tomates sur une table en bois',
    auteur: 'Paras Kapoor',
    page: 'https://unsplash.com/photos/NNTV0JhNmis',
  },
  insalate: {
    id: '1529312266912-b33cfce2eefd',
    alt: 'Des tranches de tomate et de mozzarella au basilic',
    auteur: 'Markus Spiske',
    page: 'https://unsplash.com/photos/_GM0Zvw3PzY',
  },
  pasta: {
    id: '1664214649076-7b17006db5b5',
    alt: 'Un bol de tagliatelle en sauce',
    auteur: 'Rodrigo Lezcano',
    page: 'https://unsplash.com/photos/iZQPLaerwos',
  },
  dolci: {
    id: '1714385905983-6f8e06fffae1',
    alt: 'Une part de tiramisu sur une assiette blanche',
    auteur: 'Faezeh Taheri',
    page: 'https://unsplash.com/photos/HqTX3zRRHrk',
  },
  bar: {
    id: '1570598912132-0ba1dc952b7d',
    alt: 'Deux spritz avec glaçons et romarin, vus de dessus',
    auteur: 'Olena Bohovyk',
    page: 'https://unsplash.com/photos/JjGLEN7T8xI',
  },
  vini: {
    id: '1630369160812-26c7604cbd8c',
    alt: 'Du vin rouge versé dans un verre',
    auteur: 'Saman Taheri',
    page: 'https://unsplash.com/photos/MXMs8q2OjeA',
  },
} satisfies Record<string, Photo>;

/** Image servie par le CDN d'Unsplash, recadrée et compressée à la largeur demandée. */
export function srcPhoto(p: Photo, largeur: number, hauteur?: number): string {
  const h = hauteur ? `&h=${hauteur}` : '';
  return `https://images.unsplash.com/photo-${p.id}?w=${largeur}${h}&q=72&auto=format&fit=crop`;
}

export function srcsetPhoto(p: Photo, largeurs: number[], ratio?: number): string {
  return largeurs.map((l) => `${srcPhoto(p, l, ratio ? Math.round(l / ratio) : undefined)} ${l}w`).join(', ');
}
