// Lugares que aparecem no mapa. Troque pelos seus: onde você estudou,
// trabalhou, viajou, fez um projeto...
//   coordinates → [longitude, latitude] (o MapLibre usa lng ANTES de lat!)
// Dica: no Google Maps, clique com o botão direito num ponto para copiar
// "latitude, longitude" e inverta a ordem aqui.

const PLACES = [
  {
    id: "coreu",
    name: "PUC Minas Coração Eucarístico",
    city: "Belo Horizonte",
    address: "Av. Dom José Gaspar, 500 - Coração Eucarístico",
    coordinates: [-43.9917, -19.9221],
  },
  {
    id: "praca",
    name: "PUC Minas Praça da Liberdade",
    city: "Belo Horizonte",
    address: "Av. Brasil, 2023 - Savassi",
    coordinates: [-43.9372, -19.9334],
  },
  {
    id: "sao-gabriel",
    name: "PUC Minas São Gabriel",
    city: "Belo Horizonte",
    address: "Rua Walter Ianni, 255 - São Gabriel",
    coordinates: [-43.9187, -19.8596],
  },
  {
    id: "barreiro",
    name: "PUC Minas Barreiro",
    city: "Belo Horizonte",
    address: "Av. Afonso Vaz de Melo, 1200 - Barreiro",
    coordinates: [-44.0264, -19.9773],
  },
  {
    id: "contagem",
    name: "PUC Minas Contagem",
    city: "Contagem",
    address: "Rua Rio Comprido, 4580 - Cinco",
    coordinates: [-44.0761, -19.9416],
  },
  {
    id: "betim",
    name: "PUC Minas Betim",
    city: "Betim",
    address: "Rua do Rosário, 1081",
    coordinates: [-44.1984, -19.9551],
  },
  {
    id: "pocos",
    name: "PUC Minas Poços de Caldas",
    city: "Poços de Caldas",
    address: "Av. Padre Cletus Francis Cox, 1661",
    coordinates: [-46.5995, -21.7999],
  },
];

export default PLACES;
