// geometry.js
// Contas de geometria usadas para montar o mapa e o grafo de caminhos.
// Coordenadas sempre no formato [longitude, latitude].

const EARTH_RADIUS_M = 6371008.8;
const toRad = (deg) => (deg * Math.PI) / 180;

/** Distância em metros entre dois pontos (fórmula de Haversine). */
export function distanceMeters([lon1, lat1], [lon2, lat2]) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

/** O ponto está dentro do polígono? (ray casting) */
export function isPointInPolygon([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const crosses = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}

/** Centroide de um anel (média ponderada pela área; cai na média simples se a área for ~0). */
export function ringCentroid(ring) {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, y0] = ring[j];
    const [x1, y1] = ring[i];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  if (Math.abs(area) < 1e-14) {
    const n = ring.length;
    return [ring.reduce((s, p) => s + p[0], 0) / n, ring.reduce((s, p) => s + p[1], 0) / n];
  }
  return [cx / (3 * area), cy / (3 * area)];
}

/**
 * Um ponto que com certeza fica DENTRO do polígono, para colocar o ícone.
 * O centroide de um prédio em "L" ou "U" pode cair do lado de fora; nesse caso
 * procuramos, na horizontal que passa pelo centroide, o meio do trecho interno mais largo.
 */
export function labelPoint(ring) {
  const c = ringCentroid(ring);
  if (isPointInPolygon(c, ring)) return c;

  const y = c[1];
  const xs = [];
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y) xs.push(((xj - xi) * (y - yi)) / (yj - yi) + xi);
  }
  xs.sort((a, b) => a - b);
  let best = null;
  for (let k = 0; k + 1 < xs.length; k += 2) {
    const width = xs[k + 1] - xs[k];
    if (!best || width > best.width) best = { width, x: (xs[k] + xs[k + 1]) / 2 };
  }
  return best ? [best.x, y] : c;
}

/** Ponto mais próximo de P no segmento AB (aproximação plana, ótima para distâncias curtas). */
export function closestPointOnSegment(p, a, b) {
  const kx = Math.cos(toRad(p[1])); // corrige a longitude pela latitude
  const ax = a[0] * kx;
  const bx = b[0] * kx;
  const px = p[0] * kx;
  const dx = bx - ax;
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return a;
  let t = ((px - ax) * dx + (p[1] - a[1]) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/** Ponto do contorno do polígono mais próximo de P. */
export function closestPointOnRing(p, ring) {
  let best = ring[0];
  let bestDist = Infinity;
  for (let i = 0; i + 1 < ring.length; i++) {
    const q = closestPointOnSegment(p, ring[i], ring[i + 1]);
    const d = distanceMeters(p, q);
    if (d < bestDist) {
      bestDist = d;
      best = q;
    }
  }
  return best;
}

/** Junta os pedaços de contorno de uma relação OSM (multipolygon) em anéis fechados. */
export function joinRings(segments) {
  const pending = segments.filter((s) => s.length > 1).map((s) => [...s]);
  const rings = [];
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];

  while (pending.length) {
    let ring = pending.shift();
    let grew = true;
    while (!same(ring[0], ring[ring.length - 1]) && grew) {
      grew = false;
      const end = ring[ring.length - 1];
      for (let i = 0; i < pending.length; i++) {
        const seg = pending[i];
        if (same(seg[0], end)) ring = ring.concat(seg.slice(1));
        else if (same(seg[seg.length - 1], end)) ring = ring.concat([...seg].reverse().slice(1));
        else continue;
        pending.splice(i, 1);
        grew = true;
        break;
      }
    }
    if (ring.length >= 4 && same(ring[0], ring[ring.length - 1])) rings.push(ring);
  }
  return rings;
}

/** Retângulo [[oeste, sul], [leste, norte]] que envolve todas as coordenadas. */
export function boundsOf(coords) {
  let w = Infinity;
  let s = Infinity;
  let e = -Infinity;
  let n = -Infinity;
  for (const [x, y] of coords) {
    if (x < w) w = x;
    if (x > e) e = x;
    if (y < s) s = y;
    if (y > n) n = y;
  }
  return [
    [w, s],
    [e, n],
  ];
}
