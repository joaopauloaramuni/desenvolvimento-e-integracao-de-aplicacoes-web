// campus.js
// Transforma a resposta "crua" do OpenStreetMap (elementos node/way/relation)
// em dados prontos para o mapa:
//   - places: prédios, portarias, estacionamentos e áreas verdes do campus
//   - base:   GeoJSON com ruas, calçadas, prédios e áreas verdes (o "fundo" vetorial)
//
// É a versão em JS do que o back-end original fazia em
// campus-data-mapping.util.ts e destination-processor.util.ts.
import { CAMPUS_POLYGON } from "../config/mapConfig.js";
import {
  classifyDestination,
  extractCode,
  isNavigableDestination,
  isPublicEntrance,
  normalizeText,
} from "./classify.js";
import { isPointInPolygon, joinRings, labelPoint, ringCentroid } from "./geometry.js";

export const insideCampus = (coord) => isPointInPolygon(coord, CAMPUS_POLYGON);

/** Índices para achar rápido as coordenadas de um nó e os nós de um caminho. */
export function indexElements(elements) {
  const nodes = new Map(); // id -> { coord: [lon, lat], tags }
  const ways = new Map(); // id -> { nodes: [ids], tags }
  for (const el of elements) {
    if (el.type === "node") nodes.set(el.id, { coord: [el.lon, el.lat], tags: el.tags });
    else if (el.type === "way") ways.set(el.id, { nodes: el.nodes, tags: el.tags });
  }
  return { nodes, ways };
}

const wayCoords = (nodeIds, nodes) =>
  nodeIds.map((id) => nodes.get(id)?.coord).filter(Boolean);

const isClosed = (coords) =>
  coords.length >= 4 &&
  coords[0][0] === coords[coords.length - 1][0] &&
  coords[0][1] === coords[coords.length - 1][1];

/** Anéis externos de um way fechado ou de uma relação multipolygon. */
function outerRings(el, index) {
  if (el.type === "way") {
    const coords = wayCoords(el.nodes, index.nodes);
    return isClosed(coords) ? [coords] : [];
  }
  if (el.type === "relation") {
    const parts = (el.members || [])
      .filter((m) => m.type === "way" && (m.role === "outer" || m.role === ""))
      .map((m) => index.ways.get(m.ref))
      .filter(Boolean)
      .map((w) => wayCoords(w.nodes, index.nodes));
    return joinRings(parts);
  }
  return [];
}

/** IDs dos nós que formam o contorno (para achar as entradas). */
function outlineNodeIds(el, index) {
  if (el.type === "way") return el.nodes;
  if (el.type === "node") return [el.id];
  return (el.members || []).flatMap((m) => {
    if (m.type === "node") return [m.ref];
    if (m.type === "way" && m.role === "outer") return index.ways.get(m.ref)?.nodes ?? [];
    return [];
  });
}

/** Um elemento do OSM -> um destino do campus (ou null se não for destino). */
function toPlace(el, index) {
  const tags = el.tags || {};
  const isGate = tags.barrier === "gate";
  const isParking = tags.amenity === "parking";
  const isPark = tags.leisure === "park";
  const ref = tags.ref;
  const rawName = tags.name || tags.description;

  // Mesma heurística do original: sem nome, sem ref e sem ser portaria/estacionamento/parque, descarta.
  if (!ref && !rawName && !isParking && !isPark && !isGate) return null;

  let name = rawName || (ref ? `Prédio ${ref}` : null);
  if (!name) name = isParking ? "Estacionamento" : isPark ? "Parque" : "Portão";

  const rings = outerRings(el, index);
  const ring = rings[0] ?? null;
  const centroid = el.type === "node" ? [el.lon, el.lat] : ring ? ringCentroid(ring) : null;
  if (!centroid || !insideCampus(centroid)) return null;

  const kind = isParking || isPark ? "area" : "building";
  const type = isParking ? "PARKING_LOT" : isPark ? "PARK" : classifyDestination(name, tags);

  // Entradas: nós do contorno com entrance=yes|main|secondary|service
  const entrances = [];
  for (const nodeId of new Set(outlineNodeIds(el, index))) {
    const node = index.nodes.get(nodeId);
    if (node?.tags && isPublicEntrance(node.tags)) {
      entrances.push({
        osmId: nodeId,
        coord: node.coord,
        name: node.tags.name || null,
        level: node.tags.level || tags.level || "0",
      });
    }
  }

  return {
    id: `${el.type}/${el.id}`,
    osmUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
    code: ref || extractCode(name, String(el.id)),
    name,
    search: normalizeText(`${name} ${ref ?? ""}`),
    type,
    kind,
    center: ring ? labelPoint(ring) : centroid,
    centroid,
    rings,
    entrances,
    level: tags.level || "0",
    tags,
  };
}

// Ordem "humana": Prédio 2 antes de Prédio 10
const collator = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });

/** Lista de destinos do campus. */
export function extractPlaces(elements, index) {
  const places = [];
  const seen = new Set();
  for (const el of elements) {
    if (!isNavigableDestination(el)) continue;
    const place = toPlace(el, index);
    if (place && !seen.has(place.id)) {
      seen.add(place.id);
      places.push(place);
    }
  }
  return places.sort((a, b) => collator.compare(a.name, b.name));
}

// ---------------------------------------------------------------------------
// Fundo vetorial (o que no original vinha dos "vector tiles" gerados no servidor)
// ---------------------------------------------------------------------------

const GREEN_LANDUSE = ["grass", "forest", "meadow", "village_green", "recreation_ground"];
const GREEN_NATURAL = ["wood", "scrub", "grassland"];
const GREEN_LEISURE = ["park", "garden", "pitch", "playground", "track"];

function landKind(tags) {
  if (tags.natural === "water" || tags.water || tags.leisure === "swimming_pool") return "water";
  if (GREEN_LANDUSE.includes(tags.landuse) || GREEN_NATURAL.includes(tags.natural)) return "green";
  if (GREEN_LEISURE.includes(tags.leisure)) return "green";
  if (tags.amenity === "parking") return "parking";
  return null;
}

/** GeoJSON com o fundo do mapa: áreas, prédios, ruas e calçadas. */
export function extractBase(elements, index) {
  const features = [];

  for (const el of elements) {
    const tags = el.tags;
    if (!tags || el.type === "node") continue;

    // Áreas (água, verde, estacionamento)
    const land = landKind(tags);
    if (land) {
      for (const ring of outerRings(el, index)) {
        features.push({
          type: "Feature",
          properties: { layer: "land", kind: land },
          geometry: { type: "Polygon", coordinates: [ring] },
        });
      }
    }

    // Prédios (todos, mesmo os sem nome, para o desenho ficar completo)
    if (tags.building && tags.building !== "no") {
      for (const ring of outerRings(el, index)) {
        features.push({
          type: "Feature",
          properties: { layer: "building" },
          geometry: { type: "Polygon", coordinates: [ring] },
        });
      }
    }

    // Ruas e caminhos
    if (el.type === "way" && tags.highway) {
      const coords = wayCoords(el.nodes, index.nodes);
      if (coords.length < 2) continue;
      if (tags.area === "yes" && isClosed(coords)) {
        features.push({
          type: "Feature",
          properties: { layer: "land", kind: "pedestrian" },
          geometry: { type: "Polygon", coordinates: [coords] },
        });
        continue;
      }
      features.push({
        type: "Feature",
        properties: { layer: "street", kind: tags.highway, name: tags.name || "" },
        geometry: { type: "LineString", coordinates: coords },
      });
    }
  }

  return { type: "FeatureCollection", features };
}

/** Destinos -> GeoJSON (polígonos para o preenchimento e pontos para ícone + nome). */
export function placesToGeoJSON(places) {
  const features = [];
  for (const p of places) {
    for (const ring of p.rings) {
      features.push({
        type: "Feature",
        properties: { id: p.id, kind: p.kind, type: p.type },
        geometry: { type: "Polygon", coordinates: [ring] },
      });
    }
    features.push({
      type: "Feature",
      properties: { id: p.id, kind: p.kind, type: p.type, name: p.name, point: true },
      geometry: { type: "Point", coordinates: p.center },
    });
  }
  return { type: "FeatureCollection", features };
}
