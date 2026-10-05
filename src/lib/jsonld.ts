import type { Plat, Section, Vins } from '../data/carte';
import type { infos as Infos } from '../data/infos';
import type { JourIso } from './horaires';

const JOURS_SCHEMA: Record<JourIso, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

interface Entree {
  infos: typeof Infos;
  sections: Section[];
  vins: Vins;
  pizzaDuMois: Plat;
  url: string;
}

const offre = (prix: number) => ({ '@type': 'Offer', price: prix.toFixed(2), priceCurrency: 'EUR' });

const article = (p: Plat) => ({
  '@type': 'MenuItem',
  name: p.nom,
  ...(p.detail ? { description: p.detail } : {}),
  offers: offre(p.prix),
});

/** Données structurées schema.org/Restaurant, pour les moteurs de recherche et les cartes. */
export function restaurantJsonLd({ infos, sections, vins, pizzaDuMois, url }: Entree) {
  const horaires = (Object.keys(infos.horaires).map(Number) as JourIso[]).flatMap((jour) =>
    infos.horaires[jour].map((plage) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${JOURS_SCHEMA[jour]}`,
      opens: plage.debut,
      closes: plage.fin,
    })),
  );

  const sectionsCarte = sections.map((s) => ({
    '@type': 'MenuSection',
    name: s.titre,
    description: s.traduction,
    hasMenuItem: s.groupes.flatMap((g) => g.plats.filter((p) => !p.supplement).map(article)),
  }));

  const sectionVins = {
    '@type': 'MenuSection',
    name: 'Vini',
    description: 'Vins',
    hasMenuItem: [
      ...vins.regions.flatMap((r) => r.couleurs.flatMap((c) => c.vins)),
      ...vins.pichet.vins,
    ].map((v) => ({ '@type': 'MenuItem', name: v.nom, offers: offre(v.prix[0]) })),
  };

  const sectionDuMois = {
    '@type': 'MenuSection',
    name: 'Pizza del mese',
    description: 'Pizza du mois',
    hasMenuItem: [article({ ...pizzaDuMois, nom: `Pizza ${pizzaDuMois.nom}` })],
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: infos.nom,
    description: `${infos.description} à ${infos.adresse.ville}`,
    url,
    telephone: infos.telephone.international,
    email: infos.email,
    servesCuisine: ['Italienne', 'Pizza'],
    acceptsReservations: true,
    address: {
      '@type': 'PostalAddress',
      streetAddress: infos.adresse.rue,
      postalCode: infos.adresse.codePostal,
      addressLocality: infos.adresse.ville,
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: infos.coordonnees.latitude,
      longitude: infos.coordonnees.longitude,
    },
    openingHoursSpecification: horaires,
    hasMenu: {
      '@type': 'Menu',
      inLanguage: 'fr',
      hasMenuSection: [sectionDuMois, ...sectionsCarte, sectionVins],
    },
  };
}
