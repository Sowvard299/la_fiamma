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

const STYLE = 'https://tiles.openfreemap.org/styles/positron';

type Couche = { id: string; type: string; paint?: Record<string, unknown> };

/* Recolore le fond de carte aux teintes du site avant le premier affichage, et retire les
   panneaux de routes américaines du style, inutiles ici et source d'avertissements. */
function recolorer(couches: Couche[]): Couche[] {
  return couches
    .filter((c) => !/shield/.test(c.id))
    .map((c) => {
      const peinture = (c.paint ??= {});
      const id = c.id;
      if (c.type === 'background') peinture['background-color'] = COULEURS.fond;
      if (c.type === 'fill') {
        peinture['fill-color'] = /water/.test(id)
          ? COULEURS.eau
          : /park|wood|grass|landcover/.test(id)
            ? COULEURS.vert
            : /building/.test(id)
              ? COULEURS.bati
              : COULEURS.sol;
      }
      if (c.type === 'line') {
        if (/water/.test(id)) peinture['line-color'] = COULEURS.eau;
        else if (/rail/.test(id)) peinture['line-color'] = COULEURS.rail;
        else if (/highway|road|street|path|bridge|tunnel/.test(id)) peinture['line-color'] = COULEURS.route;
      }
      if (c.type === 'symbol') {
        peinture['text-color'] = COULEURS.texte;
        peinture['text-halo-color'] = COULEURS.fond;
      }
      return c;
    });
}

/* La feuille de style de MapLibre est ajoutée seulement maintenant : importée comme un module,
   elle finirait dans l'en-tête de la page et bloquerait le premier affichage. */
async function chargerFeuille() {
  const { default: url } = await import('maplibre-gl/dist/maplibre-gl.css?url');
  await new Promise<void>((resolu, rejete) => {
    const lien = document.createElement('link');
    lien.rel = 'stylesheet';
    lien.href = url;
    lien.onload = () => resolu();
    lien.onerror = () => rejete(new Error('feuille MapLibre'));
    document.head.append(lien);
  });
}

async function dessiner(conteneur: HTMLElement, lieu: Lieu) {
  // En cas d'échec (réseau coupé…), l'adresse et le lien Google Maps restent affichés.
  try {
    const [maplibregl, , { default: urlWorker }, style] = await Promise.all([
      import('maplibre-gl'),
      chargerFeuille(),
      // Le worker de MapLibre est compilé à part par Vite : sans ça, il est introuvable une fois le site construit.
      import('maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'),
      fetch(STYLE).then((r) => {
        if (!r.ok) throw new Error(`style ${r.status}`);
        return r.json();
      }),
    ]);
    maplibregl.setWorkerUrl(urlWorker);
    style.layers = recolorer(style.layers);

    const carte = new maplibregl.Map({
      container: conteneur,
      style,
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

    const repere = document.createElement('div');
    repere.className = 'plan-repere';
    repere.textContent = lieu.nom;
    new maplibregl.Marker({ element: repere, anchor: 'bottom' }).setLngLat([lieu.longitude, lieu.latitude]).addTo(carte);

    carte.once('load', () => (conteneur.dataset.charge = 'oui'));
  } catch (erreur) {
    console.warn('[plan] non chargé :', erreur);
  }
}
