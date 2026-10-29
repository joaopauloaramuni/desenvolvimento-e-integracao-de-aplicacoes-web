// overpassService.js
// Busca os dados do campus no OpenStreetMap pela API Overpass (pública, sem chave,
// com CORS liberado: o navegador chama direto, sem back-end).
//
// Estratégia "mostra já, atualiza depois" (stale-while-revalidate):
//   1. cache no localStorage (válido por 7 dias): abre na hora
//   2. sem cache: abre na hora com a cópia local (public/data/campus-overpass.json)
//      e, em segundo plano, busca a versão ao vivo nos servidores Overpass
//   3. quando o Overpass responde, o mapa troca para os dados ao vivo e salva no cache
import MAP_CONFIG, { CAMPUS_BBOX } from "../config/mapConfig.js";

/**
 * Consulta Overpass QL. É a mesma do back-end original (overpass-campus.gateway.ts)
 * com algumas áreas a mais (verde, água) só para o fundo do mapa ficar bonito.
 */
export function buildQuery(bbox = CAMPUS_BBOX) {
  const b = `${bbox.south},${bbox.west},${bbox.north},${bbox.east}`;
  return `[out:json][timeout:60];
(
  node["barrier"="gate"](${b});
  way["barrier"="gate"](${b});
  way["building"](${b});
  relation["building"](${b});
  way["amenity"="parking"](${b});
  relation["amenity"="parking"](${b});
  way["leisure"](${b});
  relation["leisure"="park"](${b});
  way["landuse"](${b});
  way["natural"~"wood|scrub|grassland|water"](${b});
  way["highway"~"footway|path|pedestrian|steps|service|residential|living_street|tertiary|secondary|primary|unclassified"](${b});
  node["entrance"](${b});
);
(._; >;);
out body;`;
}

export function readCache() {
  try {
    const raw = localStorage.getItem(MAP_CONFIG.CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.fetchedAt > MAP_CONFIG.CACHE_TTL_MS) return null;
    return cached;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(MAP_CONFIG.CACHE_KEY, JSON.stringify(data));
  } catch {
    // localStorage cheio ou bloqueado: segue sem cache
  }
}

export function clearCache() {
  try {
    localStorage.removeItem(MAP_CONFIG.CACHE_KEY);
  } catch {
    // ignora
  }
}

async function fetchWithTimeout(url, options, ms, outerSignal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException("timeout", "TimeoutError")), ms);
  const onAbort = () => controller.abort(outerSignal.reason);
  outerSignal?.addEventListener("abort", onAbort);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    outerSignal?.removeEventListener("abort", onAbort);
  }
}

export async function fromOverpass(signal) {
  const body = new URLSearchParams({ data: buildQuery() });
  const errors = [];

  for (const url of MAP_CONFIG.OVERPASS_URLS) {
    const started = performance.now();
    try {
      const res = await fetchWithTimeout(
        url,
        { method: "POST", body },
        MAP_CONFIG.OVERPASS_TIMEOUT_MS,
        signal,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.elements?.length) throw new Error("resposta vazia");
      return {
        elements: json.elements,
        source: "overpass",
        url,
        fetchedAt: Date.now(),
        ms: Math.round(performance.now() - started),
      };
    } catch (error) {
      if (signal?.aborted) throw error;
      errors.push(`${new URL(url).host}: ${error.name === "TimeoutError" ? "tempo esgotado" : error.message}`);
    }
  }
  throw new Error(errors.join(" · "));
}

export async function fromSnapshot(signal) {
  const res = await fetch(MAP_CONFIG.SNAPSHOT_URL, { signal });
  if (!res.ok) throw new Error(`cópia local: HTTP ${res.status}`);
  const json = await res.json();
  return {
    elements: json.elements,
    source: "snapshot",
    url: MAP_CONFIG.SNAPSHOT_URL,
    fetchedAt: json.fetchedAt ?? null,
    note: json.generator ?? null,
  };
}

/** Busca ao vivo no Overpass e, se der certo, guarda no cache. */
export async function fetchLive(signal) {
  const data = await fromOverpass(signal);
  writeCache(data);
  return data;
}
