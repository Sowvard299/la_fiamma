/*
 * Recherche dans la carte. Tant qu'une recherche est en cours, les rubriques laissent la place
 * à la liste des plats trouvés ; un clic sur un onglet ou sur « Effacer » rend la carte normale.
 */
import { prixFr, sections } from '../data/carte';
import { rechercherPlats } from '../lib/recherche';

export function activerRecherche(carte: HTMLElement) {
  const formulaire = carte.querySelector<HTMLFormElement>('[data-recherche]');
  const champ = carte.querySelector<HTMLInputElement>('[data-recherche-champ]');
  const effacer = carte.querySelector<HTMLButtonElement>('[data-recherche-effacer]');
  const zone = carte.querySelector<HTMLElement>('[data-resultats]');
  if (!formulaire || !champ || !effacer || !zone) return;

  formulaire.hidden = false;

  const element = (tag: string, classe: string, texte?: string) => {
    const el = document.createElement(tag);
    el.className = classe;
    if (texte !== undefined) el.textContent = texte;
    return el;
  };

  function afficher() {
    const requete = champ!.value;
    const resultats = rechercherPlats(sections, requete);
    const active = requete.trim().length >= 2;
    carte.dataset.recherche = active ? 'active' : '';
    effacer!.hidden = requete.length === 0;
    zone!.hidden = !active;
    zone!.replaceChildren();
    if (!active) return;

    const bilan = element(
      'p',
      'resultats__bilan',
      resultats.length === 0
        ? `Aucun plat ne correspond à « ${requete.trim()} ».`
        : `${resultats.length} ${resultats.length > 1 ? 'plats' : 'plat'} pour « ${requete.trim()} »`,
    );
    zone!.append(bilan);

    const liste = element('ul', 'resultats__liste');
    for (const r of resultats) {
      const li = element('li', 'resultat');
      li.append(
        element('span', 'resultat__nom', r.plat.nom),
        element('span', 'resultat__points'),
        element('span', 'resultat__prix chiffres', `${prixFr(r.plat.prix)} €`),
      );
      if (r.plat.detail) li.append(element('span', 'resultat__detail', r.plat.detail));
      const lien = element('a', 'resultat__rubrique', r.rubrique) as HTMLAnchorElement;
      lien.href = `#carte-${r.idRubrique}`;
      lien.lang = 'it';
      lien.addEventListener('click', (e) => {
        e.preventDefault();
        carte.querySelector<HTMLElement>(`#onglet-${r.idRubrique}`)?.click();
        carte.scrollIntoView({ block: 'start' });
      });
      li.append(lien);
      liste.append(li);
    }
    zone!.append(liste);
  }

  function vider() {
    champ!.value = '';
    afficher();
  }

  champ.addEventListener('input', afficher);
  formulaire.addEventListener('submit', (e) => e.preventDefault());
  effacer.addEventListener('click', () => {
    vider();
    champ!.focus();
  });
  champ.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') vider();
  });
  for (const onglet of carte.querySelectorAll('[role="tab"]')) onglet.addEventListener('click', vider);
}
