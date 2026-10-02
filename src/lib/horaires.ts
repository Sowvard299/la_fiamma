/** 1 = lundi … 7 = dimanche (ISO 8601). */
export type JourIso = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Une plage de service, en heure de Paris, au format "HH:MM". */
export interface Plage {
  debut: string;
  fin: string;
}

export type Semaine = Record<JourIso, Plage[]>;
