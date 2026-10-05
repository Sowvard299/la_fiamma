import { describe, expect, it } from 'vitest';
import { ongletVise } from './onglets';

describe('ongletVise', () => {
  it('passe à l’onglet suivant avec la flèche droite', () => {
    expect(ongletVise(2, 7, 'ArrowRight')).toBe(3);
  });

  it('revient au premier après le dernier', () => {
    expect(ongletVise(6, 7, 'ArrowRight')).toBe(0);
  });

  it('revient au dernier avant le premier', () => {
    expect(ongletVise(0, 7, 'ArrowLeft')).toBe(6);
  });

  it('va au début et à la fin', () => {
    expect(ongletVise(3, 7, 'Home')).toBe(0);
    expect(ongletVise(3, 7, 'End')).toBe(6);
  });

  it('ignore les autres touches', () => {
    expect(ongletVise(3, 7, 'Enter')).toBeNull();
  });
});
