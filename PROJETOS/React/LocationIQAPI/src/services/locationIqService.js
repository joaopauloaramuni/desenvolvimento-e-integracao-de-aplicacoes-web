import LOCATIONIQ_CONFIG from "../config/locationIqConfig";

/**
 * Todas as chamadas à API do LocationIQ ficam aqui.
 *
 * Cada função monta a URL, espera a vez (limite de 2 req/s do plano gratuito),
 * chama o fetch e devolve os dados já no formato que os componentes usam,
 * sempre com coordinates: [lng, lat].
 *
 * Toda requisição também é registrada (com o token escondido) para o painel
 * "Requisições" mostrar o que foi chamado, o status e o tempo.
 */

const { TOKEN, API_URL, AUTOCOMPLETE_URL, STATIC_MAP_URL, LANGUAGE, COUNTRY, MIN_INTERVAL_MS } = LOCATIONIQ_CONFIG;

/* =========================================================
   REGISTRO DAS REQUISIÇÕES (para o painel)
   ========================================================= */

const listeners = new Set();
let requestId = 0;

export function onRequest(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Troca o token por SEU_TOKEN antes de mostrar a URL na tela
export const maskToken = (url) => url.replace(/([?&]key=)[^&]+/, "$1SEU_TOKEN");

function logRequest(entry) {
  const item = { id: ++requestId, at: new Date(), ...entry, url: maskToken(entry.url) };
  listeners.forEach((listener) => listener(item));
}

/* =========================================================
   FILA: no máximo 2 requisições por segundo
   ========================================================= */

let queue = Promise.resolve();
let lastCall = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function waitTurn() {
  const turn = queue.then(async () => {
    const wait = lastCall + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastCall = Date.now();
  });
  queue = turn;
  return turn;
}

/* =========================================================
   REQUISIÇÃO BASE
   ========================================================= */

const ERRORS = {
  400: "Parâmetros inválidos na requisição.",
  401: "Token do LocationIQ inválido. Confira o VITE_LOCATIONIQ_TOKEN.",
  403: "Acesso negado: confira a restrição por HTTP Referrer do token ou se o serviço está no seu plano.",
  429: "Limite atingido (2 por segundo ou o limite diário do plano). Espere um pouco e tente de novo.",
  500: "Erro no servidor do LocationIQ. Tente de novo em instantes.",
};

/**
 * Chama a API e devolve o JSON.
 * 404 no LocationIQ significa "nada encontrado": devolve null em vez de erro.
 */
async function request(name, baseUrl, params = {}, { signal } = {}) {
  const url = `${baseUrl}?${new URLSearchParams({ key: TOKEN, ...params })}`;

  await waitTurn();
  if (signal?.aborted) throw new DOMException("Cancelada", "AbortError");

  const started = performance.now();
  let status = 0;
  try {
    const response = await fetch(url, { signal });
    status = response.status;
    if (status === 404) return null;
    if (!response.ok) throw new Error(ERRORS[status] ?? `LocationIQ: HTTP ${status}`);
    return await response.json();
  } catch (error) {
    if (error.name === "TypeError") throw new Error("Sem conexão com o LocationIQ.", { cause: error });
    throw error;
  } finally {
    if (!signal?.aborted) logRequest({ name, url, status, ms: Math.round(performance.now() - started) });
  }
}

const toCoordinates = (item) => [Number(item.lon), Number(item.lat)];

// "Rua X, 123, Bairro, Cidade, ..." → primeira parte como nome, o resto como endereço
function splitDisplayName(displayName = "") {
  const [first, ...rest] = displayName.split(", ");
  return { name: first, address: rest.join(", ") };
}

/* =========================================================
   AUTOCOMPLETE: sugestões enquanto a pessoa digita
   GET https://api.locationiq.com/v1/autocomplete
   ========================================================= */

export async function autocomplete(query, { signal } = {}) {
  const data = await request(
    "Autocomplete",
    AUTOCOMPLETE_URL,
    { q: query, limit: "6", countrycodes: COUNTRY, "accept-language": LANGUAGE, dedupe: "1" },
    { signal }
  );
  return (data ?? []).map((item) => ({
    id: item.place_id,
    name: item.display_place ?? splitDisplayName(item.display_name).name,
    address: item.display_address ?? splitDisplayName(item.display_name).address,
    type: item.type,
    coordinates: toCoordinates(item),
  }));
}

/* =========================================================
   FORWARD GEOCODING: texto → coordenadas
   GET /v1/search
   ========================================================= */

export async function search(query, { signal } = {}) {
  const data = await request(
    "Search (forward)",
    `${API_URL}/search`,
    {
      q: query,
      format: "json",
      limit: "6",
      addressdetails: "1",
      normalizeaddress: "1",
      countrycodes: COUNTRY,
      "accept-language": LANGUAGE,
    },
    { signal }
  );
  return (data ?? []).map((item) => ({
    id: item.place_id,
    ...splitDisplayName(item.display_name),
    type: item.type,
    coordinates: toCoordinates(item),
  }));
}

/* =========================================================
   REVERSE GEOCODING: coordenadas → endereço
   GET /v1/reverse
   ========================================================= */

export async function reverse([lng, lat], { signal } = {}) {
  const data = await request(
    "Reverse",
    `${API_URL}/reverse`,
    { lat, lon: lng, format: "json", addressdetails: "1", normalizeaddress: "1", "accept-language": LANGUAGE },
    { signal }
  );
  if (!data) return null;
  return {
    ...splitDisplayName(data.display_name),
    displayName: data.display_name,
    details: data.address ?? {},
    coordinates: toCoordinates(data),
  };
}

/* =========================================================
   TIMEZONE: fuso horário de um ponto
   GET /v1/timezone
   ========================================================= */

export async function timezone([lng, lat], { signal } = {}) {
  const data = await request("Timezone", `${API_URL}/timezone`, { lat, lon: lng, format: "json" }, { signal });
  if (!data?.timezone) return null;
  const { name, short_name: shortName, offset_sec: offsetSec, now_in_dst: nowInDst } = data.timezone;
  return { name, shortName, offsetSec, nowInDst: Boolean(nowInDst) };
}

/* =========================================================
   NEARBY: pontos de interesse ao redor
   GET /v1/nearby
   ========================================================= */

export async function nearby([lng, lat], { tag, radius, signal } = {}) {
  const data = await request(
    "Nearby",
    `${API_URL}/nearby`,
    { lat, lon: lng, tag, radius: String(radius), limit: "30", format: "json", "accept-language": LANGUAGE },
    { signal }
  );
  return (data ?? []).map((item) => {
    const { name, address } = splitDisplayName(item.display_name);
    return {
      id: item.place_id,
      name: item.name || name,
      address,
      distance: Number(item.distance),
      coordinates: toCoordinates(item),
    };
  });
}

/* =========================================================
   DIRECTIONS: rota entre dois pontos
   GET /v1/directions/{perfil}/{lng,lat;lng,lat}
   ========================================================= */

export async function directions(profile, from, to, { signal } = {}) {
  const coords = [from, to].map(([lng, lat]) => `${lng.toFixed(6)},${lat.toFixed(6)}`).join(";");
  const data = await request(
    "Directions",
    `${API_URL}/directions/${profile}/${coords}`,
    { steps: "true", alternatives: "false", geometries: "geojson", overview: "full" },
    { signal }
  );
  const route = data?.routes?.[0];
  if (!route) return null;
  return {
    distance: route.distance, // metros
    duration: route.duration, // segundos
    geometry: route.geometry, // GeoJSON LineString
    steps: route.legs.flatMap((leg) =>
      leg.steps.map((step) => ({
        name: step.name,
        distance: step.distance,
        duration: step.duration,
        maneuver: step.maneuver,
      }))
    ),
  };
}

/* =========================================================
   STATIC MAP: imagem PNG de um mapa (é só uma URL para o <img>)
   GET https://maps.locationiq.com/v3/staticmap
   ========================================================= */

export function staticMapUrl([lng, lat], { zoom = 16, size = "600x300" } = {}) {
  const params = new URLSearchParams({
    key: TOKEN,
    center: `${lat},${lng}`,
    zoom: String(zoom),
    size,
    format: "png",
    markers: `icon:large-red-cutout|${lat},${lng}`,
  });
  return `${STATIC_MAP_URL}?${params}`;
}

/* =========================================================
   BALANCE: quantas requisições ainda restam hoje
   GET /v1/balance
   ========================================================= */

export async function balance({ signal } = {}) {
  const data = await request("Balance", `${API_URL}/balance`, { format: "json" }, { signal });
  return data?.balance ?? null; // { day, bonus }
}
