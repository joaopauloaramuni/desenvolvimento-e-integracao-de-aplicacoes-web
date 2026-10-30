// appConfig.js
// Tudo o que define "de onde vêm os dados" e "como o mapa se parece" fica aqui.
// O script scripts/dados.mjs também importa este arquivo (no Node), por isso o
// import.meta.env vem com "?.": fora do Vite ele não existe.

const BASE_URL = import.meta.env?.BASE_URL ?? "/";

// Campi da PUC Minas usados na consulta "Linhas perto da PUC".
// Coordenadas no formato GeoJSON: [longitude, latitude].
// Mudou alguma coordenada? Rode `npm run dados` de novo: a lista de linhas
// próximas é calculada pelo script, a partir dos pontos de parada do GTFS.
export const CAMPI = [
  {
    id: "coracao-eucaristico",
    nome: "Coração Eucarístico",
    endereco: "Av. Dom José Gaspar, 500 - Coração Eucarístico",
    // Centro do contorno do campus (o mesmo do projeto PucMaps)
    coords: [-43.9925, -19.9221],
  },
  {
    id: "lourdes",
    nome: "Lourdes",
    endereco: "Bairro de Lourdes, região Centro-Sul",
    // Ponto aproximado da unidade: confira no mapa e ajuste se precisar
    coords: [-43.9445, -19.9335],
  },
];

export const DADOS = {
  // GTFS estático da BHTrans (linhas, pontos, trajetos e quadro de horários).
  // Dá para trocar sem mexer no código: PBH_GTFS_URL=... npm run dados
  GTFS_URL: "https://s3.amazonaws.com/mobilibus-uploads/gtfs/GTFSBHTRANS.zip",

  // Arquivos gerados pelo `npm run dados` (servidos como estáticos pelo Vite)
  PASTA: `${BASE_URL}data`,

  // Raio, em metros, para um ponto de ônibus contar como "perto do campus"
  RAIO_CAMPUS_M: 500,

  // Simplificação do traçado (graus; ~4 m). Deixa os arquivos bem menores.
  TOLERANCIA_TRACADO: 0.00004,
};

export const MAPA = {
  // Fundo vetorial do OpenFreeMap: gratuito, sem chave e sem cadastro
  ESTILO_URL: "https://tiles.openfreemap.org/styles/positron",

  // Reserva: se o OpenFreeMap não responder, o mapa usa os blocos do OpenStreetMap
  RASTER_TILES: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
  RASTER_ATRIBUICAO: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  GLYPHS_URL: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",

  // Centro de Belo Horizonte (Praça Sete)
  CENTRO: [-43.9386, -19.9191],
  ZOOM: 12,
  MIN_ZOOM: 9,
  MAX_ZOOM: 19,
};

export const TEMPO_REAL = {
  // Rota do próprio site: em produção é a Vercel Function api/pbh.js,
  // no npm run dev é um middleware do vite.config.js
  PATH: "/api/pbh",

  // O feed GTFS-RT da PBH gera uma foto nova a cada ~20 s
  INTERVALO_MS: 20_000,
};
