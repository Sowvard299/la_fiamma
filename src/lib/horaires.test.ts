import { describe, expect, it } from 'vitest';
import { heureFr, libelleStatut, ouvertA, plagesFr, statut, type Semaine } from './horaires';

const midiEtSoir = [
  { debut: '12:00', fin: '14:30' },
  { debut: '19:00', fin: '22:30' },
];
const SEMAINE: Semaine = {
  1: midiEtSoir,
  2: midiEtSoir,
  3: midiEtSoir,
  4: midiEtSoir,
  5: midiEtSoir,
  6: [{ debut: '19:00', fin: '22:30' }],
  7: [],
};

// Les dates portent un décalage explicite : le résultat ne dépend pas du fuseau de la machine.
// 2026-10-05 est un lundi ; Paris est en UTC+2 jusqu'au 25 octobre 2026.
const a = (iso: string) => statut(new Date(iso), SEMAINE);
const libelle = (iso: string) => libelleStatut(a(iso));

describe('statut', () => {
  it('est ouvert pendant le service du midi', () => {
    expect(a('2026-10-05T13:00:00+02:00')).toEqual({ ouvert: true, fermeA: '14:30' });
    expect(libelle('2026-10-05T13:00:00+02:00')).toBe("Ouvert jusqu'à 14h30");
  });

  it("ouvre à l'heure pile et ferme à l'heure pile", () => {
    expect(a('2026-10-05T12:00:00+02:00').ouvert).toBe(true);
    expect(a('2026-10-05T14:30:00+02:00').ouvert).toBe(false);
  });

  it("annonce le service du soir entre midi et soir", () => {
    expect(a('2026-10-05T15:00:00+02:00')).toEqual({
      ouvert: false,
      prochaine: { jour: 1, heure: '19:00', dansJours: 0 },
    });
    expect(libelle('2026-10-05T15:00:00+02:00')).toBe('Fermé, on rouvre ce soir à 19h');
  });

  it('annonce le service du midi le matin', () => {
    expect(libelle('2026-10-05T09:00:00+02:00')).toBe('Fermé, on ouvre à 12h');
  });

  it('annonce le lendemain après le dernier service', () => {
    expect(libelle('2026-10-09T23:00:00+02:00')).toBe('Fermé, on rouvre demain à 19h');
  });

  it('saute le dimanche fermé', () => {
    expect(a('2026-10-10T23:00:00+02:00')).toEqual({
      ouvert: false,
      prochaine: { jour: 1, heure: '12:00', dansJours: 2 },
    });
    expect(libelle('2026-10-10T23:00:00+02:00')).toBe('Fermé, on rouvre lundi à 12h');
  });

  it("utilise l'heure de Paris pour un visiteur à New York", () => {
    expect(a('2026-10-05T07:00:00-04:00')).toEqual({ ouvert: true, fermeA: '14:30' });
  });

  it("reste juste à l'heure d'hiver", () => {
    expect(a('2026-12-07T11:30:00Z').ouvert).toBe(true);
    expect(a('2026-12-07T10:30:00Z').ouvert).toBe(false);
  });

  it('ne boucle pas sur une semaine sans aucun service', () => {
    const vide: Semaine = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    const s = statut(new Date('2026-10-05T13:00:00+02:00'), vide);
    expect(s).toEqual({ ouvert: false, prochaine: null });
    expect(libelleStatut(s)).toBe('Fermé');
  });
});

describe('heureFr', () => {
  it('écrit les heures à la française', () => {
    expect(heureFr('12:00')).toBe('12h');
    expect(heureFr('14:30')).toBe('14h30');
    expect(heureFr('09:05')).toBe('9h05');
  });
});

describe('plagesFr', () => {
  it('liste les services de la journée', () => {
    expect(plagesFr(midiEtSoir)).toBe('12h à 14h30, 19h à 22h30');
  });

  it('dit fermé quand il n’y a pas de service', () => {
    expect(plagesFr([])).toBe('Fermé');
  });
});

describe('ouvertA', () => {
  it('reconnaît une heure pendant le service', () => {
    expect(ouvertA(5, '20:00', SEMAINE)).toBe(true);
  });

  it('reconnaît une heure hors service', () => {
    expect(ouvertA(6, '13:00', SEMAINE)).toBe(false);
    expect(ouvertA(7, '20:00', SEMAINE)).toBe(false);
  });
});
