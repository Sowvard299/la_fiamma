import type { Semaine } from '../lib/horaires';

const midiEtSoir = [
  { debut: '12:00', fin: '14:30' },
  { debut: '19:00', fin: '22:30' },
];

export const infos = {
  nom: 'La Fiamma',
  description: 'Pizzeria et cuisine italienne',
  adresse: { rue: '61 rue de Bitche', codePostal: '92400', ville: 'Courbevoie' },
  // Position de la fiche Google du restaurant.
  coordonnees: { latitude: 48.8964005, longitude: 2.2460005 },
  telephone: { affichage: '01 43 33 77 58', international: '+33143337758' },
  email: 'lafiamma92400@gmail.com',
  // Horaires identiques sur Mappy, PagesJaunes et la fiche Google du restaurant (octobre 2026).
  horaires: {
    1: midiEtSoir,
    2: midiEtSoir,
    3: midiEtSoir,
    4: midiEtSoir,
    5: midiEtSoir,
    6: [{ debut: '19:00', fin: '22:30' }],
    7: [],
  } satisfies Semaine as Semaine,
};
