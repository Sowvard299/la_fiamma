/*
 * La carte de La Fiamma. C'est le seul endroit à modifier pour changer un plat,
 * un prix ou la pizza du mois : le site se reconstruit à partir de ce fichier.
 * Prix nets en euros.
 */

export interface Plat {
  nom: string;
  detail?: string;
  prix: number;
  volume?: string;
  /** Affiché « +2 » au lieu de « 2 ». */
  supplement?: boolean;
  /** Plat qui porte le nom de la maison. */
  maison?: boolean;
}

export interface Groupe {
  titre?: string;
  note?: string;
  plats: Plat[];
}

export interface Section {
  id: string;
  titre: string;
  traduction: string;
  groupes: Groupe[];
}

export interface LigneVin {
  nom: string;
  prix: number[];
}

export interface Vins {
  colonnes: string[];
  regions: { titre: string; couleurs: { titre: string; vins: LigneVin[] }[] }[];
  pichet: { colonnes: string[]; vins: LigneVin[] };
}

export function prixFr(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',');
}

export const pizzaDuMois: Plat = {
  nom: 'Pepe',
  detail: 'Base tomate, œuf, pepperoni, parmesan',
  prix: 17,
};

export const sections: Section[] = [
  {
    id: 'antipasti',
    titre: 'Antipasti',
    traduction: 'Entrées',
    groupes: [
      {
        titre: 'Pour une personne',
        plats: [
          { nom: 'Millefeuille de betterave', detail: 'Betterave au chèvre, roquette', prix: 10 },
          { nom: 'Millefeuille de tomate', detail: "Tomate, mozzarella, huile d'olive, roquette", prix: 10 },
          { nom: 'Carpaccio di bresaola', detail: 'Bœuf séché, tomates cerises, roquette', prix: 9 },
          { nom: 'Egg muffins', detail: "Au saumon et à l'avocat", prix: 12 },
        ],
      },
      {
        titre: 'À partager',
        plats: [
          { nom: 'Piatto di formaggi', detail: 'Assortiment de fromages italiens', prix: 18 },
          {
            nom: 'Piatto di salumi',
            detail: 'Jambon de Parme, bresaola, jambon cuit, mortadelle, spianata',
            prix: 21,
          },
          {
            nom: 'Piatto salumi e formaggi',
            detail: 'Jambon de Parme, bresaola, jambon cuit, mortadelle, spianata, fromages italiens',
            prix: 25,
          },
        ],
      },
    ],
  },
  {
    id: 'insalate',
    titre: 'Insalate',
    traduction: 'Salades',
    groupes: [
      {
        plats: [
          {
            nom: 'Fiamma',
            detail: 'Salade, tomates cerises, burrata, légumes grillés',
            prix: 17,
            maison: true,
          },
          { nom: 'César', detail: 'Salade, poulet, tomates cerises, parmesan, croûtons, œuf', prix: 17 },
          {
            nom: 'Al salmone',
            detail: 'Salade, saumon fumé, tomates cerises, olives noires, roquette, citron',
            prix: 18,
          },
          {
            nom: 'Carpaccio',
            detail: 'Carpaccio de bœuf servi deux fois, frites maison ou salade verte',
            prix: 19,
          },
        ],
      },
    ],
  },
  {
    id: 'pizze',
    titre: 'Pizze',
    traduction: 'Pizzas',
    groupes: [
      {
        titre: 'Rossa',
        note: 'Base tomate',
        plats: [
          { nom: 'Margherita', detail: 'Mozzarella, basilic', prix: 13 },
          { nom: 'Napoletana', detail: 'Mozzarella, anchois, câpres, olives', prix: 15 },
          { nom: 'Regina', detail: 'Mozzarella, champignons, jambon', prix: 16 },
          { nom: '4 Formaggi', detail: 'Mozzarella, gorgonzola, chèvre, parmesan', prix: 16 },
          { nom: 'Calzone', detail: 'Mozzarella, jambon, œuf', prix: 16 },
          {
            nom: 'Verdure',
            detail: 'Mozzarella, aubergines, courgettes, oignons rouges, poivrons, artichauts',
            prix: 16,
          },
          { nom: '4 Stagioni', detail: 'Mozzarella, jambon, champignons, artichauts, olives', prix: 17 },
          { nom: 'Tonno', detail: 'Mozzarella, thon, œuf, olives, oignons rouges', prix: 17 },
          { nom: 'Diavola', detail: 'Mozzarella, spianata, œuf, oignons rouges', prix: 17 },
          { nom: 'Bresaola', detail: 'Mozzarella, bresaola, roquette, copeaux de parmesan', prix: 18 },
          { nom: 'Fiamma', detail: 'Mozzarella, viande hachée, merguez, œuf', prix: 18, maison: true },
          {
            nom: 'Parma',
            detail: 'Mozzarella, jambon de Parme, roquette, tomates cerises, copeaux de parmesan',
            prix: 18,
          },
          { nom: 'Al salmone', detail: 'Mozzarella, saumon fumé, roquette, citron', prix: 18 },
          {
            nom: 'Burrata',
            detail: 'Mozzarella, burrata, jambon, tomates cerises, roquette',
            prix: 20,
          },
        ],
      },
      {
        titre: 'Bianca',
        note: 'Sans tomate',
        plats: [
          { nom: 'Miele', detail: 'Mozzarella, chèvre, miel, roquette, noix', prix: 16 },
          { nom: 'Al salmone', detail: 'Mozzarella, saumon fumé, roquette, citron', prix: 18 },
          {
            nom: 'Roméo & Juliette',
            detail: 'Mozzarella, jambon de Parme, gorgonzola, champignons, noix',
            prix: 19,
          },
          {
            nom: 'Morta-Bella',
            detail: 'Mozzarella, crème de pistache, mortadelle, stracciatella',
            prix: 19,
          },
        ],
      },
      {
        titre: 'Suppléments',
        plats: [
          { nom: 'Burrata', prix: 6, supplement: true },
          { nom: 'Saumon, Parme ou bresaola', prix: 4, supplement: true },
          { nom: 'Viande ou thon', prix: 3, supplement: true },
          { nom: 'Légumes ou œuf', prix: 2, supplement: true },
        ],
      },
    ],
  },
  {
    id: 'pasta',
    titre: 'Pasta e piatti',
    traduction: 'Pâtes et plats',
    groupes: [
      {
        titre: 'Pasta',
        note: 'Tagliatelle ou penne',
        plats: [
          { nom: 'Gorgonzola', prix: 16 },
          { nom: 'Carbonara', prix: 16 },
          { nom: 'Salmone', prix: 17 },
          { nom: 'Lasagne bolognaise', detail: 'Servies avec une salade', prix: 17 },
        ],
      },
      {
        titre: 'Piatti',
        note: 'Garniture au choix : frites, haricots verts ou pâtes (+4)',
        plats: [
          { nom: 'Bistecca di salmone', detail: "Pavé de saumon grillé, sauce à l'aneth", prix: 20 },
          { nom: 'Scaloppina alla milanese', detail: 'Escalope de poulet panée', prix: 18 },
          { nom: 'Scaloppina ai funghi', detail: 'Escalope de poulet aux champignons', prix: 18 },
        ],
      },
    ],
  },
  {
    id: 'dolci',
    titre: 'Dolci e gelato',
    traduction: 'Desserts et glaces',
    groupes: [
      {
        titre: 'Dolci',
        plats: [
          { nom: 'Tiramisu au café', prix: 8 },
          { nom: 'Crème brûlée', prix: 7 },
          { nom: 'Tarte au citron meringuée', prix: 7 },
          { nom: 'Moelleux au chocolat', prix: 7 },
          { nom: 'Pain perdu', detail: 'Glace vanille, Nutella', prix: 8 },
          { nom: 'Café gourmand', prix: 9 },
        ],
      },
      {
        titre: 'Gelato artigianale',
        plats: [
          { nom: 'Une boule', prix: 4 },
          { nom: 'Deux boules', prix: 7 },
          { nom: 'Boule en plus', prix: 2, supplement: true },
          { nom: 'Chantilly', prix: 1.5, supplement: true },
        ],
      },
    ],
  },
  {
    id: 'bar',
    titre: 'Bar',
    traduction: 'Boissons',
    groupes: [
      {
        titre: 'Sans alcool',
        plats: [
          {
            nom: 'Softs',
            detail: 'Coca, Coca zéro, Oasis, Ice Tea, Orangina, Sprite, Perrier',
            volume: '33 cl',
            prix: 4,
          },
          { nom: 'Jus de fruits', volume: '25 cl', prix: 4 },
          { nom: 'Eau plate ou gazeuse', volume: '50 cl', prix: 4 },
          { nom: 'Eau plate ou gazeuse', volume: '1 l', prix: 7 },
        ],
      },
      {
        titre: 'Apéritifs',
        plats: [
          { nom: 'Spritz', volume: '12 cl', prix: 8 },
          { nom: 'Kir cassis ou pêche', volume: '10 cl', prix: 5 },
          { nom: 'Kir royal', volume: '10 cl', prix: 10 },
          { nom: 'Martini blanc ou rouge', volume: '5 cl', prix: 6 },
          { nom: 'Ricard', volume: '2 cl', prix: 6 },
          { nom: 'J&B', volume: '4 cl', prix: 7 },
          { nom: "Jack Daniel's", volume: '4 cl', prix: 8 },
        ],
      },
      {
        titre: 'Bières',
        plats: [
          { nom: 'Leffe ou Peroni', detail: 'Pression', volume: '25 cl', prix: 4.5 },
          { nom: 'Leffe ou Peroni', detail: 'Pression', volume: '50 cl', prix: 8 },
          { nom: 'Chouffe', detail: 'Bouteille', volume: '33 cl', prix: 6 },
          { nom: 'IPA', detail: 'Bouteille', volume: '33 cl', prix: 7 },
        ],
      },
      {
        titre: 'Champagne Nicolas Feuillatte',
        plats: [
          { nom: 'La coupe', volume: '10 cl', prix: 10 },
          { nom: 'La bouteille', volume: '75 cl', prix: 70 },
        ],
      },
      {
        titre: 'Café Florio',
        note: '100 % arabica',
        plats: [
          { nom: 'Expresso', prix: 2.5 },
          { nom: 'Cappuccino', detail: 'ou double expresso', prix: 4.5 },
          { nom: 'Thé', prix: 4.5 },
        ],
      },
      {
        titre: 'Digestifs',
        plats: [
          { nom: 'Amaretto, limoncello', volume: '4 cl', prix: 7 },
          { nom: 'Get 27, poire Williams', volume: '4 cl', prix: 7 },
          { nom: 'Cognac', volume: '4 cl', prix: 7 },
        ],
      },
    ],
  },
];

export const vins: Vins = {
  colonnes: ['Verre 15 cl', 'Bouteille 75 cl'],
  regions: [
    {
      titre: 'Italie',
      couleurs: [
        {
          titre: 'Rosso',
          vins: [
            { nom: 'Chianti DOCG', prix: [6, 25] },
            { nom: 'Valpolicella DOC', prix: [5, 21] },
          ],
        },
        { titre: 'Rosato', vins: [{ nom: 'Chiaretto di Bardolino', prix: [5, 21] }] },
      ],
    },
    {
      titre: 'France',
      couleurs: [
        { titre: 'Rouge', vins: [{ nom: 'Brouilly AOP', prix: [6, 27] }] },
        {
          titre: 'Rosé',
          vins: [
            { nom: 'Côtes de Provence, Estandon', prix: [5, 25] },
            { nom: 'Gris Blanc', prix: [6, 25] },
          ],
        },
        { titre: 'Blanc', vins: [{ nom: 'Chardonnay', prix: [6, 29] }] },
      ],
    },
  ],
  pichet: {
    colonnes: ['Verre 15 cl', 'Pichet 25 cl', 'Pichet 50 cl'],
    vins: [{ nom: 'Rosso, rosato ou bianco', prix: [4, 7, 11] }],
  },
};
