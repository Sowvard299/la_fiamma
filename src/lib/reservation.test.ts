import { describe, expect, it } from 'vitest';
import { dateFr, jourIsoDeDate, lienMail, type DemandeReservation } from './reservation';

const DEST = 'lafiamma92400@gmail.com';
const demande: DemandeReservation = {
  nom: 'Hélène Martin',
  date: '2026-10-10',
  heure: '20:00',
  couverts: 4,
  telephone: '06 12 34 56 78',
  message: 'Une chaise haute si possible.',
};

const decode = (lien: string) => {
  const [, requete] = lien.split('?');
  const params = Object.fromEntries(requete.split('&').map((p) => p.split('=')));
  return { sujet: decodeURIComponent(params.subject), corps: decodeURIComponent(params.body) };
};

describe('dates saisies', () => {
  it("donne le jour tel qu'il a été saisi, sans décalage de fuseau", () => {
    expect(dateFr('2026-10-10')).toBe('samedi 10 octobre');
    expect(dateFr('2026-01-01')).toBe('jeudi 1er janvier');
  });

  it('donne le jour ISO de la date saisie', () => {
    expect(jourIsoDeDate('2026-10-11')).toBe(7);
    expect(jourIsoDeDate('2026-10-05')).toBe(1);
  });
});

describe('lienMail', () => {
  it("s'adresse au restaurant", () => {
    expect(lienMail(DEST, demande).startsWith(`mailto:${DEST}?subject=`)).toBe(true);
  });

  it('résume la demande dans le sujet', () => {
    expect(decode(lienMail(DEST, demande)).sujet).toBe('Réservation samedi 10 octobre à 20h, 4 personnes');
  });

  it('accorde « personne » au singulier', () => {
    expect(decode(lienMail(DEST, { ...demande, couverts: 1 })).sujet).toContain('1 personne');
    expect(decode(lienMail(DEST, { ...demande, couverts: 1 })).sujet).not.toContain('personnes');
  });

  it('encode accents et retours à la ligne pour les clients mail', () => {
    const lien = lienMail(DEST, demande);
    expect(lien).toContain('%C3%A9');
    expect(lien).toContain('%0D%0A');
    expect(lien).not.toContain('+');
    expect(lien).not.toContain(' ');
  });

  it('reprend nom, téléphone et message dans le corps', () => {
    const { corps } = decode(lienMail(DEST, demande));
    expect(corps).toContain('Nom : Hélène Martin');
    expect(corps).toContain('Téléphone : 06 12 34 56 78');
    expect(corps).toContain('Une chaise haute si possible.');
  });

  it("n'écrit pas de ligne téléphone vide", () => {
    const { corps } = decode(lienMail(DEST, { ...demande, telephone: '  ' }));
    expect(corps).not.toContain('Téléphone');
  });
});
