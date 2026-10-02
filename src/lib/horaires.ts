/** 1 = lundi … 7 = dimanche (ISO 8601). */
export type JourIso = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Une plage de service, en heure de Paris, au format "HH:MM". */
export interface Plage {
  debut: string;
  fin: string;
}

export type Semaine = Record<JourIso, Plage[]>;

export type Statut =
  | { ouvert: true; fermeA: string }
  | { ouvert: false; prochaine: { jour: JourIso; heure: string; dansJours: number } | null };

export const NOMS_JOURS: Record<JourIso, string> = {
  1: 'lundi',
  2: 'mardi',
  3: 'mercredi',
  4: 'jeudi',
  5: 'vendredi',
  6: 'samedi',
  7: 'dimanche',
};

const JOURS_ANGLAIS: Record<string, JourIso> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

const formatParis = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Paris',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function enMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Jour et minute de la journée à Paris, quel que soit le fuseau du visiteur. */
export function momentAParis(date: Date): { jour: JourIso; minutes: number } {
  const parties = formatParis.formatToParts(date);
  const valeur = (type: string) => parties.find((p) => p.type === type)!.value;
  return {
    jour: JOURS_ANGLAIS[valeur('weekday')],
    minutes: Number(valeur('hour')) * 60 + Number(valeur('minute')),
  };
}

function plageEnCours(plages: Plage[], minutes: number): Plage | undefined {
  return plages.find((p) => minutes >= enMinutes(p.debut) && minutes < enMinutes(p.fin));
}

export function ouvertA(jour: JourIso, hhmm: string, semaine: Semaine): boolean {
  return plageEnCours(semaine[jour], enMinutes(hhmm)) !== undefined;
}

export function statut(date: Date, semaine: Semaine): Statut {
  const { jour, minutes } = momentAParis(date);
  const enCours = plageEnCours(semaine[jour], minutes);
  if (enCours) return { ouvert: true, fermeA: enCours.fin };

  // Jusqu'à 7 jours plus loin : couvre une maison qui n'ouvrirait qu'un jour par semaine.
  for (let dansJours = 0; dansJours <= 7; dansJours++) {
    const j = (((jour - 1 + dansJours) % 7) + 1) as JourIso;
    const suivante = [...semaine[j]]
      .sort((x, y) => enMinutes(x.debut) - enMinutes(y.debut))
      .find((p) => dansJours > 0 || enMinutes(p.debut) > minutes);
    if (suivante) return { ouvert: false, prochaine: { jour: j, heure: suivante.debut, dansJours } };
  }
  return { ouvert: false, prochaine: null };
}

export function heureFr(hhmm: string): string {
  const [h, m] = hhmm.split(':');
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

export function plagesFr(plages: Plage[]): string {
  if (plages.length === 0) return 'Fermé';
  return plages.map((p) => `${heureFr(p.debut)} à ${heureFr(p.fin)}`).join(', ');
}

export function libelleStatut(s: Statut): string {
  if (s.ouvert) return `Ouvert jusqu'à ${heureFr(s.fermeA)}`;
  if (!s.prochaine) return 'Fermé';
  const { jour, heure, dansJours } = s.prochaine;
  const h = heureFr(heure);
  if (dansJours === 0) return enMinutes(heure) >= 17 * 60 ? `Fermé, on rouvre ce soir à ${h}` : `Fermé, on ouvre à ${h}`;
  if (dansJours === 1) return `Fermé, on rouvre demain à ${h}`;
  return `Fermé, on rouvre ${NOMS_JOURS[jour]} à ${h}`;
}
