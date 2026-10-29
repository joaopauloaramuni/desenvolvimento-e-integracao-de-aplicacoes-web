// mapConfig.js
// Tudo o que define "qual campus" e "como o mapa se parece" fica aqui.
// Não há token nem chave: os dados vêm do OpenStreetMap (API Overpass, pública)
// e o desenho do mapa é feito pelo próprio MapLibre GL, no navegador.

// Contorno do Campus Coração Eucarístico, copiado do projeto original
// (code/web/src/app/features/map/domain/constants/map-polygon.constants.ts).
// Formato GeoJSON: [longitude, latitude].
export const CAMPUS_POLYGON = [
  [-43.9931561, -19.9265094], [-43.9935349, -19.9261996], [-43.994691, -19.9252537],
  [-43.9947586, -19.9252024], [-43.9947685, -19.9251948], [-43.9948024, -19.9251684],
  [-43.9953415, -19.9247483], [-43.9953936, -19.9247076], [-43.9954264, -19.9246775],
  [-43.9954542, -19.924652], [-43.9956135, -19.9245254], [-43.9957558, -19.9244116],
  [-43.9959104, -19.9242879], [-43.9960301, -19.9240788], [-43.9960738, -19.923957],
  [-43.996102, -19.9238392], [-43.9961217, -19.9236723], [-43.9961175, -19.9235373],
  [-43.9960581, -19.9233044], [-43.9955881, -19.923102], [-43.995256, -19.9229684],
  [-43.9948, -19.9228337], [-43.9945899, -19.9227293], [-43.9942335, -19.9225101],
  [-43.9941599, -19.9222655], [-43.9940819, -19.9222279], [-43.9941085, -19.9219368],
  [-43.9943083, -19.921917], [-43.9943106, -19.9215611], [-43.9943146, -19.9209274],
  [-43.9943925, -19.9204686], [-43.9943178, -19.9204275], [-43.9943289, -19.9203849],
  [-43.9943404, -19.9203414], [-43.9944179, -19.9203308], [-43.994401, -19.9201627],
  [-43.9938376, -19.9193684], [-43.9936828, -19.9189487], [-43.9940307, -19.918647],
  [-43.9939158, -19.9185036], [-43.9938926, -19.9184747], [-43.9939235, -19.9184469],
  [-43.9938067, -19.918153], [-43.993449, -19.9184416], [-43.9921437, -19.9175797],
  [-43.9910932, -19.9191036], [-43.9901863, -19.9199747], [-43.9885191, -19.9213661],
  [-43.9894023, -19.922361], [-43.9896358, -19.9226238], [-43.9899484, -19.9229587],
  [-43.9906402, -19.9236996], [-43.9913213, -19.9244388], [-43.9913821, -19.9245093],
  [-43.9914284, -19.9245628], [-43.9915389, -19.9246906], [-43.9915708, -19.9247276],
  [-43.9924103, -19.9256988], [-43.9924508, -19.9257445], [-43.992829, -19.9261546],
  [-43.9931561, -19.9265094],
];

// Retângulo (bbox) que envolve o contorno, com uma folga para o entorno aparecer.
const lons = CAMPUS_POLYGON.map((p) => p[0]);
const lats = CAMPUS_POLYGON.map((p) => p[1]);
const MARGIN = 0.0015; // ~160 m

export const CAMPUS_BBOX = {
  west: Math.min(...lons) - MARGIN,
  south: Math.min(...lats) - MARGIN,
  east: Math.max(...lons) + MARGIN,
  north: Math.max(...lats) + MARGIN,
};

// import.meta.env só existe dentro do Vite; o "?." deixa o arquivo funcionar também no Node
// (o script scripts/snapshot.mjs reaproveita a mesma configuração).
const BASE_URL = import.meta.env?.BASE_URL ?? "/";

const MAP_CONFIG = {
  // Centro e zoom iniciais
  CENTER: [-43.9925, -19.9221],
  ZOOM: 16.4,
  MIN_ZOOM: 14.5,
  MAX_ZOOM: 20,

  // Não deixa o mapa "fugir" muito do campus
  MAX_BOUNDS: [
    [CAMPUS_BBOX.west - 0.01, CAMPUS_BBOX.south - 0.01],
    [CAMPUS_BBOX.east + 0.01, CAMPUS_BBOX.north + 0.01],
  ],

  // Fontes dos rótulos: arquivos .pbf em public/fonts (sem depender de servidor externo)
  GLYPHS_URL: `${BASE_URL}fonts/{fontstack}/{range}.pbf`,
  FONT_REGULAR: ["Noto Sans Regular"],
  FONT_MEDIUM: ["Noto Sans Medium"],

  // Fundos de mapa (o "Vetorial" é desenhado com os próprios dados do campus,
  // igual ao estilo padrão do projeto original; o "Raster" usa os blocos do OSM)
  BASES: [
    { id: "vector", label: "Vetorial" },
    { id: "raster", label: "Raster (OSM)" },
  ],
  RASTER_TILES: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
  RASTER_ATTRIBUTION:
    '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',

  // API Overpass: tenta um servidor e, se falhar, o próximo
  OVERPASS_URLS: [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  ],
  OVERPASS_TIMEOUT_MS: 30000,

  // Cópia local (usada quando o Overpass não responde)
  SNAPSHOT_URL: `${BASE_URL}data/campus-overpass.json`,

  // Cache no localStorage para não baixar tudo a cada visita
  CACHE_KEY: "pucmaps:overpass:v1",
  CACHE_TTL_MS: 7 * 24 * 60 * 60 * 1000, // 7 dias

  // Velocidade média de caminhada usada no original (m/s)
  WALKING_SPEED_MPS: 1.4,
};

export default MAP_CONFIG;
