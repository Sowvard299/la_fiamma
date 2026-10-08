/*
 * Notes publiques du restaurant, relevées à la main sur chaque plateforme.
 * À mettre à jour de temps en temps (date de relevé comprise) : le site affiche la date.
 */

export interface SourceAvis {
  nom: 'TheFork' | 'Google';
  note: number;
  sur: number;
  nombre: number;
  url: string;
  /** Ce que la plateforme dit elle-même de ses avis. */
  precision: string;
  details?: { libelle: string; note: number }[];
}

export const avis = {
  releveLe: '2026-10-08',
  sources: [
    {
      nom: 'Google',
      note: 4.8,
      sur: 5,
      nombre: 177,
      url: 'https://www.google.com/maps/search/?api=1&query=La%20Fiamma%2C%2061%20rue%20de%20Bitche%2C%2092400%20Courbevoie',
      precision: 'Avis publics Google',
    },
    {
      nom: 'TheFork',
      note: 9.4,
      sur: 10,
      nombre: 20,
      url: 'https://www.thefork.fr/restaurant/la-fiamma-r849692',
      precision: 'Seuls les clients ayant réservé ou payé avec TheFork peuvent noter',
      details: [
        { libelle: 'Plats', note: 9.2 },
        { libelle: 'Service', note: 9.6 },
        { libelle: 'Ambiance', note: 9.4 },
      ],
    },
  ] satisfies SourceAvis[],
};

export const noteFr = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
