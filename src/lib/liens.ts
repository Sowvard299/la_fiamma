import { infos } from '../data/infos';

const adresse = `${infos.nom}, ${infos.adresse.rue}, ${infos.adresse.codePostal} ${infos.adresse.ville}`;

export const itineraire = {
  google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresse)}`,
  apple: `https://maps.apple.com/?q=${encodeURIComponent(adresse)}`,
};
