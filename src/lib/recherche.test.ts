import { describe, expect, it } from 'vitest';
import { normaliser, rechercherPlats } from './recherche';
import { sections } from '../data/carte';

const noms = (q: string) => rechercherPlats(sections, q).map((r) => r.plat.nom);

describe('normaliser', () => {
  it('ignore la casse, les accents et les ligatures', () => {
    expect(normaliser('Bœuf SÉCHÉ')).toBe('boeuf seche');
  });
});

describe('rechercherPlats', () => {
  it('trouve un plat par son nom', () => {
    expect(noms('margherita')).toContain('Margherita');
  });

  it('trouve un plat par un ingrédient, sans accent', () => {
    expect(noms('chevre')).toEqual(expect.arrayContaining(['Millefeuille de betterave', '4 Formaggi', 'Miele']));
  });

  it('exige tous les mots de la recherche', () => {
    const r = noms('saumon roquette');
    expect(r).toContain('Al salmone');
    expect(r).not.toContain('Bistecca di salmone');
  });

  it('indique la rubrique de chaque résultat', () => {
    const [premier] = rechercherPlats(sections, 'tiramisu');
    expect(premier.rubrique).toBe('Dolci e gelato');
    expect(premier.idRubrique).toBe('dolci');
  });

  it('ignore les suppléments', () => {
    const r = rechercherPlats(sections, 'burrata');
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((x) => !x.plat.supplement)).toBe(true);
  });

  it('ne renvoie rien pour une recherche vide ou trop courte', () => {
    expect(noms('')).toEqual([]);
    expect(noms(' a ')).toEqual([]);
  });
});
