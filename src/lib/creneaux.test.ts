import { describe, expect, it } from 'vitest';
import { creneaux, aujourdhuiAParis } from './creneaux';
import { infos } from '../data/infos';

const semaine = infos.horaires;

describe('creneaux', () => {
  it('propose des créneaux de 15 min, jusqu’à 30 min avant la fermeture', () => {
    const lundi = creneaux('2026-10-05', semaine);
    expect(lundi[0]).toBe('12:00');
    expect(lundi).toContain('14:00');
    expect(lundi).not.toContain('14:15');
    expect(lundi).toContain('19:00');
    expect(lundi.at(-1)).toBe('22:00');
    expect(lundi).toHaveLength(9 + 13);
  });

  it('ne propose que le soir le samedi', () => {
    expect(creneaux('2026-10-10', semaine)[0]).toBe('19:00');
  });

  it('ne propose rien le dimanche', () => {
    expect(creneaux('2026-10-11', semaine)).toEqual([]);
  });

  it('écarte les créneaux déjà passés aujourd’hui', () => {
    const maintenant = { date: '2026-10-05', minutes: 13 * 60 + 10 };
    expect(creneaux('2026-10-05', semaine, maintenant)[0]).toBe('13:15');
  });

  it('ne propose plus rien ce soir une fois le dernier créneau passé', () => {
    const maintenant = { date: '2026-10-05', minutes: 22 * 60 + 5 };
    expect(creneaux('2026-10-05', semaine, maintenant)).toEqual([]);
  });

  it('ne propose rien pour une date déjà passée (Safari iOS ignore la date minimale)', () => {
    const maintenant = { date: '2026-10-08', minutes: 10 * 60 };
    expect(creneaux('2026-10-05', semaine, maintenant)).toEqual([]);
  });

  it('ne touche pas aux autres jours', () => {
    const maintenant = { date: '2026-10-05', minutes: 23 * 60 };
    expect(creneaux('2026-10-06', semaine, maintenant)[0]).toBe('12:00');
  });
});

describe('aujourdhuiAParis', () => {
  it('donne la date et l’heure de Paris, même la nuit en UTC', () => {
    // 23 h 30 UTC un 5 octobre = 1 h 30 le 6 octobre à Paris (heure d'été).
    expect(aujourdhuiAParis(new Date('2026-10-05T23:30:00Z'))).toEqual({ date: '2026-10-06', minutes: 90 });
  });
});
