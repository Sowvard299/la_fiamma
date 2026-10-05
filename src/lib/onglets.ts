/** Onglet à activer après une touche du clavier (motif « tabs » de l'ARIA), ou null. */
export function ongletVise(courant: number, total: number, touche: string): number | null {
  switch (touche) {
    case 'ArrowRight':
      return (courant + 1) % total;
    case 'ArrowLeft':
      return (courant - 1 + total) % total;
    case 'Home':
      return 0;
    case 'End':
      return total - 1;
    default:
      return null;
  }
}

/*
 * Carte à onglets. Sans JavaScript, toutes les rubriques restent visibles l'une sous l'autre
 * et les onglets sont de simples ancres. Avec, une seule rubrique est affichée à la fois ;
 * les liens profonds (#carte-pizze) ouvrent la bonne rubrique.
 */
export function activerOnglets(racine: HTMLElement) {
  const liste = racine.querySelector<HTMLElement>('[role="tablist"]');
  const onglets = [...racine.querySelectorAll<HTMLAnchorElement>('[role="tab"]')];
  const panneaux = onglets.map((o) => document.getElementById(o.getAttribute('aria-controls')!)!);
  if (!liste || onglets.length === 0) return;

  racine.dataset.onglets = 'actifs';

  function choisir(i: number, { focus = false, defiler = false } = {}) {
    onglets.forEach((o, j) => {
      const actif = i === j;
      o.setAttribute('aria-selected', String(actif));
      o.tabIndex = actif ? 0 : -1;
      panneaux[j].hidden = !actif;
    });
    if (focus) onglets[i].focus();
    // Barre défilante sur mobile : on amène l'onglet actif en vue, sans bouger la page.
    const o = onglets[i];
    const piste = o.parentElement!;
    const doux = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    piste.scrollTo({ left: o.offsetLeft - piste.offsetLeft - (piste.clientWidth - o.offsetWidth) / 2, behavior: doux ? 'smooth' : 'auto' });
    if (defiler) racine.scrollIntoView({ block: 'start' });
  }

  const depuisAncre = () => panneaux.findIndex((p) => `#${p.id}` === location.hash);

  onglets.forEach((o, i) =>
    o.addEventListener('click', (e) => {
      e.preventDefault();
      choisir(i);
      history.replaceState(null, '', `#${panneaux[i].id}`);
    }),
  );

  liste.addEventListener('keydown', (e) => {
    const courant = onglets.findIndex((o) => o.getAttribute('aria-selected') === 'true');
    const vise = ongletVise(courant, onglets.length, e.key);
    if (vise === null) return;
    e.preventDefault();
    choisir(vise, { focus: true });
  });

  window.addEventListener('hashchange', () => {
    const i = depuisAncre();
    if (i >= 0) choisir(i, { defiler: true });
  });

  const initial = depuisAncre();
  choisir(Math.max(initial, 0), { defiler: initial >= 0 });
}
