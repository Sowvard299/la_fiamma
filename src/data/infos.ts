import type { Semaine } from '../lib/horaires';

const midiEtSoir = [
  { debut: '12:00', fin: '14:30' },
  { debut: '19:00', fin: '22:30' },
];

export const infos = {
  nom: 'La Fiamma',
  description: 'Pizzeria et cuisine italienne',
  adresse: { rue: '61 rue de Bitche', codePostal: '92400', ville: 'Courbevoie' },
  telephone: { affichage: '01 43 33 77 58', international: '+33143337758' },
  email: 'lafiamma92400@gmail.com',
  // Horaires repris des annuaires (Mappy, PagesJaunes) : à confirmer avec le restaurant.
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
