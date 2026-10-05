import { describe, expect, it } from 'vitest';
import { restaurantJsonLd } from './jsonld';
import { infos } from '../data/infos';
import { pizzaDuMois, sections, vins } from '../data/carte';

const ld = restaurantJsonLd({ infos, sections, vins, pizzaDuMois, url: 'https://exemple.fr/' });

describe('restaurantJsonLd', () => {
  it('décrit un restaurant schema.org avec son adresse', () => {
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('Restaurant');
    expect(ld.address).toMatchObject({
      streetAddress: '61 rue de Bitche',
      postalCode: '92400',
      addressLocality: 'Courbevoie',
      addressCountry: 'FR',
    });
  });

  it('situe le restaurant sur une carte', () => {
    expect(ld.geo).toEqual({ '@type': 'GeoCoordinates', latitude: 48.8964005, longitude: 2.2460005 });
  });

  it('donne le téléphone au format international', () => {
    expect(ld.telephone).toBe('+33143337758');
  });

  it("déclare les horaires d'ouverture jour par jour, sans le dimanche fermé", () => {
    const jours = ld.openingHoursSpecification.map((o) => o.dayOfWeek);
    expect(jours.filter((j) => j === 'https://schema.org/Monday')).toHaveLength(2);
    expect(jours.filter((j) => j === 'https://schema.org/Saturday')).toHaveLength(1);
    expect(jours).not.toContain('https://schema.org/Sunday');
    expect(ld.openingHoursSpecification[0]).toMatchObject({ opens: '12:00', closes: '14:30' });
  });

  it('expose la carte avec ses sections et ses prix en euros', () => {
    const pizze = ld.hasMenu.hasMenuSection.find((s) => s.name === 'Pizze');
    const margherita = pizze!.hasMenuItem.find((i) => i.name === 'Margherita');
    expect(margherita!.offers).toEqual({ '@type': 'Offer', price: '13.00', priceCurrency: 'EUR' });
  });

  it("n'expose pas les suppléments comme des plats", () => {
    const noms = ld.hasMenu.hasMenuSection.flatMap((s) => s.hasMenuItem.map((i) => i.name));
    expect(noms).not.toContain('Légumes ou œuf');
  });
});
