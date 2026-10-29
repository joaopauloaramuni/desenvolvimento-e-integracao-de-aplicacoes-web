// classify.js
// Regras para decidir o TIPO de cada destino a partir das tags do OSM e do nome.
// É o mesmo raciocínio das "specifications" do back-end original
// (code/api/src/map/infrastructure/repositories/utils/specifications), em JS puro.
// A ordem importa: vale a primeira regra que bater.

const includesAny = (text, words) => words.some((w) => text.includes(w));

const RULES = [
  {
    type: "BANK",
    test: (name, _b, amenity) =>
      includesAny(name, [
        "banco",
        "agencia bancaria",
        "caixa",
        "itau",
        "bradesco",
        "santander",
        "caixa economica",
        "banco do brasil",
      ]) || amenity === "bank",
  },
  { type: "GATE", test: (_n, _b, _a, barrier) => barrier === "gate" },
  {
    type: "LIBRARY",
    test: (name, _b, amenity) => name.includes("biblioteca") || amenity === "library",
  },
  { type: "LAB", test: (name) => includesAny(name, ["laboratorio", "lab."]) },
  {
    type: "CAFETERIA",
    test: (name, _b, amenity) =>
      includesAny(name, [
        "cantina",
        "lanche",
        "restaurante",
        "cafe",
        "refeitorio",
        "fast food",
        "comida",
        "alimenta",
      ]) ||
      ["food_court", "restaurant", "cafe", "fast_food", "bar", "pub", "canteen"].includes(amenity),
  },
  {
    type: "SPORTS",
    test: (name, building, amenity) =>
      includesAny(name, [
        "quadra",
        "ginasio",
        "estadio",
        "piscina",
        "educacao fisica",
        "esporte",
        "atletico",
      ]) ||
      ["gymnasium", "sports_hall", "stadium", "grandstand"].includes(building) ||
      amenity === "gym",
  },
  {
    type: "SERVICE",
    test: (name, building, amenity) =>
      includesAny(name, [
        "posto medico",
        "clinica",
        "banco",
        "agencia",
        "pastoral",
        "secretaria",
        "apoio",
        "atendimento",
        "servico",
        "adm",
        "estacionamento",
        "parqueamento",
        "religioso",
        "convento",
        "mosteiro",
        "capela",
        "igreja",
      ]) ||
      ["chapel", "church", "shrine", "place_of_worship"].includes(building) ||
      [
        "place_of_worship",
        "toilets",
        "bench",
        "fountain",
        "vending_machine",
        "bank",
        "atm",
      ].includes(amenity),
  },
  {
    type: "ACADEMIC",
    test: (name, building, amenity) =>
      includesAny(name, [
        "auditorio",
        "teatro",
        "museu",
        "planetario",
        "sala de aula",
        "diretorio academico",
        "departamento",
        "instituto",
        "faculdade",
        "predio",
        "p.",
        "cto",
        "pos-graduacao",
        "graduacao",
        "pesquisa",
        "ensino",
        "mestrado",
        "doutorado",
        "especializacao",
        "bloco",
        "unidade",
        "emaus",
      ]) ||
      ["university", "school", "college", "kindergarten", "academy"].includes(building) ||
      amenity === "university",
  },
  {
    type: "CONSTRUCTION",
    test: (name, building) =>
      includesAny(name, ["canteiro de obras", "canteiro em obras", "obra", "construcao", "reforma"]) ||
      building === "construction",
  },
];

/** Tira acentos e deixa minúsculo: "Prédio 34" -> "predio 34" */
export const normalizeText = (text = "") =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/** Tipo do destino (ACADEMIC, CAFETERIA, GATE...). */
export function classifyDestination(name, tags = {}) {
  const clean = normalizeText(name);
  const rule = RULES.find((r) => r.test(clean, tags.building || "", tags.amenity, tags.barrier));
  return rule ? rule.type : "UNKNOWN";
}

/** "Prédio 34 - ICEI" -> "34" (usado como código do prédio, como no original). */
export function extractCode(name, fallback) {
  const match =
    name.match(/Prédio\s+(\d+)/i) || name.match(/P\.\s*(\d+)/i) || name.match(/Predio\s+(\d+)/i);
  return match ? match[1] : fallback;
}

// Tipos de construção pequenos demais para virar destino (telhados, garagens...)
const MINOR_STRUCTURES = [
  "roof",
  "shed",
  "carport",
  "garage",
  "garages",
  "cabin",
  "static_caravan",
  "greenhouse",
  "cowshed",
];

/** O elemento do OSM pode ser um destino navegável? (NavigableDestinationSpecification) */
export function isNavigableDestination(element) {
  const tags = element.tags || {};
  if (element.type === "node") return tags.barrier === "gate";
  if (tags.barrier === "gate") return true;
  if (tags.indoor === "room") return false; // salas internas ficaram de fora desta versão

  const isBuilding = !!tags.building && tags.building !== "no";
  const isParking = tags.amenity === "parking";
  const isPark = tags.leisure === "park";
  const isBank = tags.amenity === "bank";
  if (!isBuilding && !isParking && !isPark && !isBank) return false;
  return !(isBuilding && MINOR_STRUCTURES.includes(tags.building));
}

/** A entrada (nó com tag entrance=*) é pública? (PublicEntranceSpecification) */
export const isPublicEntrance = (tags = {}) =>
  ["yes", "main", "secondary", "service"].includes(tags.entrance);

// ---------------------------------------------------------------------------
// Regras das arestas (caminhos) do grafo
// ---------------------------------------------------------------------------

export const WALKABLE_HIGHWAYS = [
  "footway",
  "path",
  "pedestrian",
  "steps",
  "service",
  "residential",
  "living_street",
  "tertiary",
  "secondary",
  "unclassified",
];

const ROUGH_SURFACES = ["ground", "grass", "gravel", "unpaved", "sand", "mud", "earth", "dirt"];

/**
 * Peso e acessibilidade de um trecho de caminho:
 * - escada: tempo x3 e NÃO acessível (StepsSpecification)
 * - piso irregular (terra, grama...): tempo x1,5 (RoughSurfaceSpecification)
 * - wheelchair=no: NÃO acessível (WheelchairInaccessibleSpecification)
 */
export function edgeAttributes(tags = {}) {
  let multiplier = 1;
  let accessible = true;
  if (tags.highway === "steps") {
    multiplier *= 3;
    accessible = false;
  }
  if (ROUGH_SURFACES.includes(tags.surface)) multiplier *= 1.5;
  if (tags.wheelchair === "no") accessible = false;
  return { multiplier, accessible };
}
