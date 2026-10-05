import { momentAParis, type Semaine } from './horaires';
import { jourIsoDeDate } from './reservation';

const PAS = 15;
// Dernière table acceptée une demi-heure avant la fermeture du service.
const MARGE = 30;

const enMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const enHeure = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

/** Date ("AAAA-MM-JJ") et minute de la journée à Paris. */
export function aujourdhuiAParis(date: Date): { date: string; minutes: number } {
  const jour = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(date);
  return { date: jour, minutes: momentAParis(date).minutes };
}

/** Heures de réservation proposées pour une date, en tenant compte des horaires et de l'heure actuelle. */
export function creneaux(
  isoDate: string,
  semaine: Semaine,
  maintenant?: { date: string; minutes: number },
): string[] {
  const deja = maintenant?.date === isoDate ? maintenant.minutes : -1;
  return semaine[jourIsoDeDate(isoDate)].flatMap((plage) => {
    const liste: string[] = [];
    for (let m = enMinutes(plage.debut); m <= enMinutes(plage.fin) - MARGE; m += PAS) {
      if (m > deja) liste.push(enHeure(m));
    }
    return liste;
  });
}
