import { heureFr, NOMS_JOURS, type JourIso } from './horaires';

export interface DemandeReservation {
  nom: string;
  /** "AAAA-MM-JJ", tel que renvoyé par <input type="date">. */
  date: string;
  /** "HH:MM", tel que renvoyé par <input type="time">. */
  heure: string;
  couverts: number;
  telephone?: string;
  message?: string;
}

const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

// new Date("2026-10-10") vaut minuit UTC, donc la veille dans les fuseaux à l'ouest de Greenwich.
// On reste en UTC de bout en bout pour retrouver exactement le jour saisi.
function partiesDate(isoDate: string) {
  const [annee, mois, jour] = isoDate.split('-').map(Number);
  return { mois, jour, utc: new Date(Date.UTC(annee, mois - 1, jour)) };
}

export function jourIsoDeDate(isoDate: string): JourIso {
  return (((partiesDate(isoDate).utc.getUTCDay() + 6) % 7) + 1) as JourIso;
}

export function dateFr(isoDate: string): string {
  const { mois, jour } = partiesDate(isoDate);
  return `${NOMS_JOURS[jourIsoDeDate(isoDate)]} ${jour === 1 ? '1er' : jour} ${MOIS[mois - 1]}`;
}

export function lienMail(destinataire: string, d: DemandeReservation): string {
  const quand = `${dateFr(d.date)} à ${heureFr(d.heure)}`;
  const personnes = `${d.couverts} ${d.couverts > 1 ? 'personnes' : 'personne'}`;
  const telephone = d.telephone?.trim();
  const message = d.message?.trim();

  const lignes = [
    'Bonjour,',
    '',
    `Je souhaiterais réserver une table pour ${personnes} le ${quand}.`,
    '',
    `Nom : ${d.nom.trim()}`,
    ...(telephone ? [`Téléphone : ${telephone}`] : []),
    ...(message ? ['', message] : []),
    '',
    'Merci,',
    d.nom.trim(),
  ];

  const sujet = encodeURIComponent(`Réservation ${quand}, ${personnes}`);
  const corps = encodeURIComponent(lignes.join('\r\n'));
  return `mailto:${destinataire}?subject=${sujet}&body=${corps}`;
}
