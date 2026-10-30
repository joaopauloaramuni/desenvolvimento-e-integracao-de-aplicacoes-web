// geometria.js
// Contas de mapa usadas no navegador e no script scripts/dados.mjs.
// Pontos sempre no formato GeoJSON: [longitude, latitude].

const RAIO_TERRA_M = 6_371_000;
const rad = (graus) => (graus * Math.PI) / 180;

/** Distância em metros entre dois pontos (fórmula de Haversine). */
export function distanciaM([lon1, lat1], [lon2, lat2]) {
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * RAIO_TERRA_M * Math.asin(Math.sqrt(a));
}

/** Tempo a pé (minutos), a 1,3 m/s, arredondado para cima. */
export const minutosAPe = (metros) => Math.max(1, Math.ceil(metros / 1.3 / 60));

/** Retângulo [[oeste, sul], [leste, norte]] que envolve todos os pontos. */
export function limites(pontos) {
  let oeste = Infinity;
  let sul = Infinity;
  let leste = -Infinity;
  let norte = -Infinity;
  for (const [lon, lat] of pontos) {
    if (lon < oeste) oeste = lon;
    if (lon > leste) leste = lon;
    if (lat < sul) sul = lat;
    if (lat > norte) norte = lat;
  }
  return [
    [oeste, sul],
    [leste, norte],
  ];
}

// Distância (em graus) do ponto p até o segmento a-b: usada só para simplificar
function distanciaAoSegmento(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

/**
 * Douglas-Peucker: remove pontos quase alinhados do traçado.
 * Versão com pilha (sem recursão), porque um traçado do GTFS pode ter milhares de pontos.
 */
export function simplificar(pontos, tolerancia) {
  if (pontos.length < 3) return pontos;
  const manter = new Uint8Array(pontos.length);
  manter[0] = 1;
  manter[pontos.length - 1] = 1;
  const pilha = [[0, pontos.length - 1]];
  while (pilha.length) {
    const [inicio, fim] = pilha.pop();
    let maior = 0;
    let indice = -1;
    for (let i = inicio + 1; i < fim; i += 1) {
      const d = distanciaAoSegmento(pontos[i], pontos[inicio], pontos[fim]);
      if (d > maior) {
        maior = d;
        indice = i;
      }
    }
    if (maior > tolerancia && indice !== -1) {
      manter[indice] = 1;
      pilha.push([inicio, indice], [indice, fim]);
    }
  }
  return pontos.filter((_, i) => manter[i]);
}
