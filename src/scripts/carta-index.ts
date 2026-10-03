/*
 * Suit la rubrique en cours de lecture : la marque dans l'index (aria-current),
 * fait glisser la flamme dessus (bureau) ou fait défiler la barre jusqu'à elle (mobile).
 */
export function suivreIndex(carta: HTMLElement) {
  const index = carta.querySelector<HTMLElement>('[data-index]');
  const liste = carta.querySelector<HTMLElement>('[data-index-liste]');
  const curseur = carta.querySelector<HTMLElement>('[data-index-curseur]');
  if (!index || !liste || !curseur) return;

  const liens = new Map(
    [...liste.querySelectorAll<HTMLAnchorElement>('[data-index-lien]')].map((a) => [a.dataset.indexLien!, a]),
  );
  const visibles = new Set<string>();
  let actuel = '';

  function activer(id: string) {
    if (id === actuel) return;
    actuel = id;
    for (const [cle, lien] of liens) {
      if (cle === id) lien.setAttribute('aria-current', 'true');
      else lien.removeAttribute('aria-current');
    }
    const lien = liens.get(id);
    if (!lien) return;
    index!.dataset.actif = '';
    curseur!.style.setProperty('--y', `${lien.offsetTop + lien.offsetHeight / 2 - curseur!.offsetHeight / 2}px`);

    // Barre mobile : on amène le lien actif en vue sans toucher au défilement de la page.
    if (liste!.scrollWidth > liste!.clientWidth) {
      const cible = lien.offsetLeft - (liste!.clientWidth - lien.offsetWidth) / 2;
      liste!.scrollTo({ left: cible, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }

  const ordre = [...liens.keys()];
  const observateur = new IntersectionObserver(
    (entrees) => {
      for (const e of entrees) {
        if (e.isIntersecting) visibles.add(e.target.id);
        else visibles.delete(e.target.id);
      }
      const premier = ordre.find((id) => visibles.has(id));
      if (premier) activer(premier);
    },
    // Une rubrique est « en cours » quand elle traverse la bande haute de l'écran.
    { rootMargin: '-20% 0px -70% 0px' },
  );
  for (const rubrique of carta.querySelectorAll<HTMLElement>('[data-rubrique]')) observateur.observe(rubrique);
}
