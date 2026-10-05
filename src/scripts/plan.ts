/*
 * Plan d'accès. MapLibre et les tuiles OpenFreeMap (libres, sans clé) ne sont chargés
 * que lorsque la section approche de l'écran. Le fond de carte est recoloré aux teintes du site.
 */

interface Lieu {
  latitude: number;
  longitude: number;
  nom: string;
}

const COULEURS = {
  fond: '#ece6da',
  eau: '#c5d0d2',
  vert: '#dcd8c2',
  bati: '#ddd4c4',
  sol: '#e6dfd2',
  route: '#ffffff',
  rail: '#cfc6b5',
  texte: '#4f5b64',
};

export function preparerPlan(conteneur: HTMLElement, lieu: Lieu) {
  const observateur = new IntersectionObserver(
    (entrees) => {
      if (!entrees.some((e) => e.isIntersecting)) return;
      observateur.disconnect();
      void dessiner(conteneur, lieu);
    },
    { rootMargin: '600px 0px' },
  );
  observateur.observe(conteneur);
}

async function dessiner(conteneur: HTMLElement, lieu: Lieu) {
  const [maplibregl, , { default: urlWorker }] = await Promise.all([
    import('maplibre-gl'),
    import('maplibre-gl/dist/maplibre-gl.css'),
    // Le worker de MapLibre est compilé à part par Vite : sans ça, il est introuvable une fois le site construit.
    import('maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'),
  ]);
  maplibregl.setWorkerUrl(urlWorker);

  const carte = new maplibregl.Map({
    container: conteneur,
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: [lieu.longitude, lieu.latitude],
    zoom: 15.6,
    minZoom: 11,
    maxZoom: 18,
    attributionControl: { compact: true },
    cooperativeGestures: true,
    locale: {
      'CooperativeGesturesHandler.WindowsHelpText': 'Ctrl + molette pour zoomer sur le plan',
      'CooperativeGesturesHandler.MacHelpText': '⌘ + molette pour zoomer sur le plan',
      'CooperativeGesturesHandler.MobileHelpText': 'Deux doigts pour déplacer le plan',
      'NavigationControl.ZoomIn': 'Zoomer',
      'NavigationControl.ZoomOut': 'Dézoomer',
    },
  });
  carte.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

  carte.on('style.load', () => {
    for (const couche of carte.getStyle().layers ?? []) {
      const id = couche.id;
      if (couche.type === 'background') carte.setPaintProperty(id, 'background-color', COULEURS.fond);
      if (couche.type === 'fill') {
        const couleur = /water/.test(id)
          ? COULEURS.eau
          : /park|wood|grass|landcover/.test(id)
            ? COULEURS.vert
            : /building/.test(id)
              ? COULEURS.bati
              : COULEURS.sol;
        carte.setPaintProperty(id, 'fill-color', couleur);
      }
      if (couche.type === 'line') {
        if (/water/.test(id)) carte.setPaintProperty(id, 'line-color', COULEURS.eau);
        else if (/rail/.test(id)) carte.setPaintProperty(id, 'line-color', COULEURS.rail);
        else if (/highway|road|street|path|bridge|tunnel/.test(id)) carte.setPaintProperty(id, 'line-color', COULEURS.route);
      }
      if (couche.type === 'symbol') {
        carte.setPaintProperty(id, 'text-color', COULEURS.texte);
        carte.setPaintProperty(id, 'text-halo-color', COULEURS.fond);
      }
    }
  });

  const repere = document.createElement('div');
  repere.className = 'plan-repere';
  repere.innerHTML = `<span>${lieu.nom}</span>`;
  new maplibregl.Marker({ element: repere, anchor: 'bottom' })
    .setLngLat([lieu.longitude, lieu.latitude])
    .addTo(carte);

  conteneur.dataset.charge = 'oui';
}
