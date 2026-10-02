import { describe, expect, it } from 'vitest';
import { pizzaDuMois, prixFr, sections, vins } from './carte';
import { infos } from './infos';

const tousLesPlats = sections.flatMap((s) => s.groupes.flatMap((g) => g.plats));
const toutesLesChaines = JSON.stringify({ sections, vins, pizzaDuMois, infos });

describe('prixFr', () => {
  it('affiche les prix ronds sans décimales', () => {
    expect(prixFr(17)).toBe('17');
  });

  it('affiche les prix décimaux avec une virgule et deux chiffres', () => {
    expect(prixFr(4.5)).toBe('4,50');
    expect(prixFr(1.5)).toBe('1,50');
  });
});

describe('carte', () => {
  it('a des identifiants de section uniques', () => {
    const ids = sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("n'a que des prix strictement positifs", () => {
    const prix = [
      ...tousLesPlats.map((p) => p.prix),
      pizzaDuMois.prix,
      ...vins.regions.flatMap((r) => r.couleurs.flatMap((c) => c.vins.flatMap((v) => v.prix))),
      ...vins.pichet.vins.flatMap((v) => v.prix),
    ];
    expect(prix.every((p) => Number.isFinite(p) && p > 0)).toBe(true);
  });

  it('reprend toutes les pizzas du site actuel (14 rossa, 4 bianca)', () => {
    const pizze = sections.find((s) => s.id === 'pizze')!;
    const [rossa, bianca] = pizze.groupes;
    expect(rossa.plats).toHaveLength(14);
    expect(bianca.plats).toHaveLength(4);
  });

  it('a autant de prix que de colonnes pour chaque vin', () => {
    for (const r of vins.regions)
      for (const c of r.couleurs)
        for (const v of c.vins) expect(v.prix).toHaveLength(vins.colonnes.length);
    for (const v of vins.pichet.vins) expect(v.prix).toHaveLength(vins.pichet.colonnes.length);
  });

  it("n'utilise jamais de tiret cadratin", () => {
    expect(toutesLesChaines).not.toContain('—');
  });
});
