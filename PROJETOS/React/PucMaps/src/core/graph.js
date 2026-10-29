// graph.js
// O "coração" do PUCMaps: um GRAFO de caminhos a pé dentro do campus.
//   - nós (vértices)  = cruzamentos de calçadas, escadas, entradas dos prédios
//   - arestas         = trechos de caminho, com distância, tempo e se são acessíveis
// Com o grafo pronto, a rota mais rápida é calculada com o algoritmo de Dijkstra.
//
// Versão em JS de path-processor.util.ts e graph-processor.util.ts do back-end original.
import MAP_CONFIG from "../config/mapConfig.js";
import { edgeAttributes, WALKABLE_HIGHWAYS } from "./classify.js";
import { insideCampus } from "./campus.js";
import { closestPointOnRing, distanceMeters } from "./geometry.js";

const SNAP_EXACT_M = 0.1; // entrada "em cima" de um nó de caminho
const SNAP_RADIUS_M = 15; // procura caminhos até 15 m da entrada
const SNAP_MAX_LINKS = 2; // liga em no máximo 2 nós (evita o efeito "leque")
const LEVEL_CHANGE = { meters: 3, seconds: 10 }; // escada/elevador entre andares

/**
 * Monta o grafo a partir dos elementos do OSM e dos destinos já extraídos.
 * Retorna { nodes: Map, edges: Map, adjacency: Map, placeNodes: Map, stats }.
 */
export function buildGraph(elements, index, places) {
  const nodes = new Map(); // id -> { id, coord, level, placeId? }
  const edges = new Map(); // id -> { id, a, b, meters, seconds, accessible, generated, kind, coords }
  let edgeSeq = 0;

  const addNode = (id, coord, level, placeId) => {
    const existing = nodes.get(id);
    if (existing) {
      if (placeId && !existing.placeId) existing.placeId = placeId;
      return existing;
    }
    const node = { id, coord, level, placeId };
    nodes.set(id, node);
    return node;
  };

  const addEdge = (a, b, data) => {
    if (a === b) return;
    const id = `e${edgeSeq++}`;
    edges.set(id, { id, a, b, ...data });
  };

  // 1) Caminhos a pé (highway=footway, steps, service...) viram arestas
  for (const el of elements) {
    if (el.type !== "way" || !el.tags || !WALKABLE_HIGHWAYS.includes(el.tags.highway)) continue;
    const tags = el.tags;
    const levels = String(tags.level ?? "0")
      .split(";")
      .map((l) => l.trim() || "0");
    const level = levels[0];
    const { multiplier, accessible } = edgeAttributes(tags);

    // Corta o caminho em trechos quando ele sai do contorno do campus
    const segments = [];
    let current = [];
    for (const osmId of el.nodes) {
      const node = index.nodes.get(osmId);
      if (!node) continue;
      if (!insideCampus(node.coord)) {
        if (current.length) segments.push(current);
        current = [];
        continue;
      }
      current.push(addNode(`${osmId}@${level}`, node.coord, level).id);
    }
    if (current.length) segments.push(current);

    for (const seg of segments) {
      for (let i = 0; i + 1 < seg.length; i++) {
        const a = nodes.get(seg[i]);
        const b = nodes.get(seg[i + 1]);
        const meters = distanceMeters(a.coord, b.coord);
        addEdge(a.id, b.id, {
          meters,
          seconds: (meters / MAP_CONFIG.WALKING_SPEED_MPS) * multiplier,
          accessible,
          generated: false,
          kind: tags.highway,
          coords: [a.coord, b.coord],
        });
      }
    }

    // Caminho em vários andares (level=0;1): liga o mesmo ponto entre os andares
    for (let j = 0; j + 1 < levels.length; j++) {
      for (const osmId of el.nodes) {
        const node = index.nodes.get(osmId);
        if (!node || !insideCampus(node.coord)) continue;
        const n1 = addNode(`${osmId}@${levels[j]}`, node.coord, levels[j]);
        const n2 = addNode(`${osmId}@${levels[j + 1]}`, node.coord, levels[j + 1]);
        addEdge(n1.id, n2.id, {
          meters: LEVEL_CHANGE.meters,
          seconds: LEVEL_CHANGE.seconds,
          accessible: true,
          generated: false,
          kind: "level",
          coords: [n1.coord, n2.coord],
        });
      }
    }
  }

  const pathNodes = [...nodes.values()];
  const pathNodeIds = new Set(nodes.keys());

  // 2) Cada destino ganha nós: as entradas marcadas no OSM ou, sem entradas,
  //    um ponto no contorno do prédio virado para o caminho mais próximo.
  const placeNodes = new Map(); // placeId -> [nodeIds]
  for (const place of places) {
    const ids = [];
    if (place.entrances.length) {
      for (const ent of place.entrances) {
        ids.push(addNode(`${ent.osmId}@${ent.level}`, ent.coord, ent.level, place.id).id);
      }
    } else {
      let coord = place.centroid;
      if (place.rings[0] && pathNodes.length) {
        const nearest = nearestNodes(coord, pathNodes, 1)[0];
        if (nearest) coord = closestPointOnRing(nearest.node.coord, place.rings[0]);
      }
      ids.push(addNode(`place:${place.id}`, coord, place.level, place.id).id);
    }
    placeNodes.set(place.id, ids);
  }

  // 3) Liga cada nó de destino à malha de caminhos (arestas "geradas", tracejadas no mapa)
  if (pathNodes.length) {
    for (const ids of placeNodes.values()) {
      for (const id of ids) {
        const node = nodes.get(id);
        if (pathNodeIds.has(id)) continue; // a entrada já é um nó de caminho
        // Está praticamente em cima de um nó de caminho? Liga só nele.
        let near = nearestNodes(node.coord, pathNodes, SNAP_MAX_LINKS, SNAP_EXACT_M);
        if (!near.length) near = nearestNodes(node.coord, pathNodes, SNAP_MAX_LINKS, SNAP_RADIUS_M);
        if (!near.length) near = nearestNodes(node.coord, pathNodes, 1);
        for (const { node: target, meters } of near) {
          addEdge(node.id, target.id, {
            meters,
            seconds: meters / MAP_CONFIG.WALKING_SPEED_MPS,
            accessible: true,
            generated: true,
            kind: "link",
            coords: [node.coord, target.coord],
          });
        }
      }
    }
  }

  // 4) Simplifica: remove nós "de passagem" (só 2 vizinhos), como no original
  const protectedIds = new Set([...placeNodes.values()].flat());
  simplify(nodes, edges, protectedIds);

  const adjacency = buildAdjacency(edges);
  const islands = countIslands(nodes, adjacency);

  return {
    nodes,
    edges,
    adjacency,
    placeNodes,
    stats: {
      nodes: nodes.size,
      edges: edges.size,
      islands,
      generated: [...edges.values()].filter((e) => e.generated).length,
      steps: [...edges.values()].filter((e) => e.kind === "steps").length,
    },
  };
}

/** Os k nós mais próximos de um ponto (opcionalmente só até maxMeters). */
function nearestNodes(coord, candidates, k, maxMeters = Infinity) {
  const found = [];
  for (const node of candidates) {
    const meters = distanceMeters(coord, node.coord);
    if (meters > maxMeters) continue;
    found.push({ node, meters });
  }
  return found.sort((a, b) => a.meters - b.meters).slice(0, k);
}

function buildAdjacency(edges) {
  const adj = new Map();
  for (const e of edges.values()) {
    if (!adj.has(e.a)) adj.set(e.a, []);
    if (!adj.has(e.b)) adj.set(e.b, []);
    adj.get(e.a).push(e);
    adj.get(e.b).push(e);
  }
  return adj;
}

/** Contração de nós de grau 2: A—N—B vira A——B com a geometria somada. */
function simplify(nodes, edges, protectedIds) {
  const incident = new Map();
  for (const e of edges.values()) {
    for (const end of [e.a, e.b]) {
      if (!incident.has(end)) incident.set(end, new Set());
      incident.get(end).add(e.id);
    }
  }

  // Array.from: copia a lista, porque vamos apagar nós enquanto percorremos
  for (const node of Array.from(nodes.values())) {
    if (protectedIds.has(node.id)) continue;
    const ids = incident.get(node.id);
    if (!ids || ids.size !== 2) continue;
    const [e1, e2] = [...ids].map((id) => edges.get(id));
    const a = e1.a === node.id ? e1.b : e1.a;
    const b = e2.a === node.id ? e2.b : e2.a;
    if (a === b) continue; // laço: deixa como está
    if (e1.kind === "link" || e2.kind === "link") continue;

    // Geometria orientada A -> N -> B
    const c1 = e1.a === a ? e1.coords : [...e1.coords].reverse();
    const c2 = e2.a === node.id ? e2.coords : [...e2.coords].reverse();
    const merged = {
      id: `${e1.id}+${e2.id}`,
      a,
      b,
      meters: e1.meters + e2.meters,
      seconds: e1.seconds + e2.seconds,
      accessible: e1.accessible && e2.accessible,
      generated: e1.generated || e2.generated,
      kind: e1.kind === e2.kind ? e1.kind : e1.kind === "steps" ? "steps" : e2.kind,
      coords: c1.concat(c2.slice(1)),
    };

    edges.delete(e1.id);
    edges.delete(e2.id);
    edges.set(merged.id, merged);
    incident.get(a).delete(e1.id);
    incident.get(a).add(merged.id);
    incident.get(b).delete(e2.id);
    incident.get(b).add(merged.id);
    incident.delete(node.id);
    nodes.delete(node.id);
  }
}

/** Quantos pedaços desconectados ("ilhas") o grafo tem. */
function countIslands(nodes, adjacency) {
  const seen = new Set();
  let islands = 0;
  for (const id of nodes.keys()) {
    if (seen.has(id)) continue;
    islands++;
    const stack = [id];
    seen.add(id);
    while (stack.length) {
      const cur = stack.pop();
      for (const e of adjacency.get(cur) ?? []) {
        const next = e.a === cur ? e.b : e.a;
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      }
    }
  }
  return islands;
}

// ---------------------------------------------------------------------------
// Dijkstra
// ---------------------------------------------------------------------------

/** Fila de prioridade (min-heap) bem simples para o Dijkstra. */
class MinHeap {
  constructor() {
    this.items = [];
  }
  get size() {
    return this.items.length;
  }
  push(item) {
    const a = this.items;
    a.push(item);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p].cost <= a[i].cost) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.items;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && a[l].cost < a[m].cost) m = l;
        if (r < a.length && a[r].cost < a[m].cost) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

/**
 * Rota mais rápida (menor tempo de caminhada) entre dois destinos.
 * Parte de QUALQUER entrada da origem e chega em QUALQUER entrada do destino.
 * Com accessibleOnly = true, ignora escadas e trechos wheelchair=no.
 */
export function findRoute(graph, fromPlaceId, toPlaceId, { accessibleOnly = false } = {}) {
  const sources = graph.placeNodes.get(fromPlaceId) ?? [];
  const targets = new Set(graph.placeNodes.get(toPlaceId) ?? []);
  if (!sources.length || !targets.size) return null;

  const cost = new Map();
  const prev = new Map(); // nodeId -> { from, edge }
  const heap = new MinHeap();
  for (const s of sources) {
    cost.set(s, 0);
    heap.push({ id: s, cost: 0 });
  }

  let reached = null;
  while (heap.size) {
    const { id, cost: c } = heap.pop();
    if (c > (cost.get(id) ?? Infinity)) continue;
    if (targets.has(id)) {
      reached = id;
      break;
    }
    for (const e of graph.adjacency.get(id) ?? []) {
      if (accessibleOnly && !e.accessible) continue;
      const next = e.a === id ? e.b : e.a;
      const nc = c + e.seconds;
      if (nc < (cost.get(next) ?? Infinity)) {
        cost.set(next, nc);
        prev.set(next, { from: id, edge: e });
        heap.push({ id: next, cost: nc });
      }
    }
  }
  if (!reached) return null;

  // Refaz o caminho de trás para frente, juntando a geometria de cada aresta
  const steps = [];
  for (let cur = reached; prev.has(cur); cur = prev.get(cur).from) steps.unshift(prev.get(cur));

  let coords = [graph.nodes.get(steps[0]?.from ?? reached).coord];
  let meters = 0;
  let seconds = 0;
  let stairs = 0;
  for (const { from, edge } of steps) {
    const piece = edge.a === from ? edge.coords : [...edge.coords].reverse();
    coords = coords.concat(piece.slice(1));
    meters += edge.meters;
    seconds += edge.seconds;
    if (edge.kind === "steps") stairs++;
  }

  return { coords, meters, seconds, stairs, hops: steps.length };
}

/** Grafo -> GeoJSON (arestas e nós) para desenhar no mapa. */
export function graphToGeoJSON(graph) {
  const features = [];
  for (const e of graph.edges.values()) {
    features.push({
      type: "Feature",
      properties: { generated: e.generated, steps: e.kind === "steps", accessible: e.accessible },
      geometry: { type: "LineString", coordinates: e.coords },
    });
  }
  for (const n of graph.nodes.values()) {
    features.push({
      type: "Feature",
      properties: { destination: !!n.placeId },
      geometry: { type: "Point", coordinates: n.coord },
    });
  }
  return { type: "FeatureCollection", features };
}
