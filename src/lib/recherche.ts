import type { Plat, Section } from '../data/carte';

export interface Resultat {
  rubrique: string;
  idRubrique: string;
  plat: Plat;
}

export const normaliser = (s: string) =>
  s
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

/** Plats dont le nom ou la description contient tous les mots recherchés. */
export function rechercherPlats(sections: Section[], requete: string): Resultat[] {
  const mots = normaliser(requete).split(/\s+/).filter((m) => m.length >= 2);
  if (mots.length === 0) return [];
  return sections.flatMap((s) =>
    s.groupes.flatMap((g) =>
      g.plats
        .filter((p) => !p.supplement)
        .filter((p) => {
          const texte = normaliser(`${p.nom} ${p.detail ?? ''} ${g.titre ?? ''}`);
          return mots.every((m) => texte.includes(m));
        })
        .map((plat) => ({ rubrique: s.titre, idRubrique: s.id, plat })),
    ),
  );
}
