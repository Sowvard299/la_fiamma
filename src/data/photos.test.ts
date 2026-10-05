import { describe, expect, it } from 'vitest';
import { photos, srcPhoto, srcsetPhoto } from './photos';
import { avis } from './avis';

describe('photos', () => {
  it('donne une adresse Unsplash redimensionnée et compressée', () => {
    const url = srcPhoto(photos.pizzeHaut, 800);
    expect(url).toMatch(/^https:\/\/images\.unsplash\.com\/photo-[\w-]+\?/);
    expect(url).toContain('w=800');
    expect(url).toContain('auto=format');
    expect(url).toContain('fit=crop');
  });

  it('propose plusieurs largeurs pour les écrans haute densité', () => {
    const srcset = srcsetPhoto(photos.pizzeHaut, [400, 800, 1200]);
    expect(srcset.split(', ')).toHaveLength(3);
    expect(srcset).toMatch(/w=1200&[^ ]* 1200w$/);
  });

  it('décrit chaque photo et crédite son auteur', () => {
    for (const p of Object.values(photos)) {
      expect(p.alt.length).toBeGreaterThan(10);
      expect(p.auteur.length).toBeGreaterThan(1);
      expect(p.page).toMatch(/^https:\/\/unsplash\.com\/photos\//);
    }
  });
});

describe('avis', () => {
  it('ne donne que des notes cohérentes avec leur barème', () => {
    for (const a of avis.sources) {
      expect(a.note).toBeGreaterThan(0);
      expect(a.note).toBeLessThanOrEqual(a.sur);
      expect(a.nombre).toBeGreaterThan(0);
      expect(a.url).toMatch(/^https:\/\//);
    }
  });

  it('date le relevé des notes', () => {
    expect(avis.releveLe).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
