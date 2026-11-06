// demoLibrary.js
// Estante de demonstração, no MESMO formato que o crosspoint-sync devolve.
// Serve para testar o app (e o GitHub Pages) sem ter uma conta.
//
// Os "aparelhos" imitam o que o servidor grava:
// - CrossPoint / KOReader: o próprio leitor envia o progresso;
// - Kindle: o conector Kindle (beta) puxa a posição do Whispersync e grava
//   uma linha com device_id "kindle" e device "Amazon Kindle (Whispersync)".

const AGORA = Math.floor(Date.now() / 1000);
const HORA = 3600;
const DIA = 24 * HORA;

const KINDLE = { device_id: "kindle", device: "Amazon Kindle (Whispersync)" };
const CROSSPOINT = { device_id: "crossink-a1b2c3", device: "CrossPoint" };
const KOREADER = { device_id: "koreader-boox", device: "Boox Palma (KOReader)" };

// [documento, título, autor, páginas, status, aparelhos: [aparelho, %, há quanto tempo]]
const LIVROS = [
  ["a1f0c2", "Torto Arado", "Itamar Vieira Junior", 264, "reading", [
    [KINDLE, 0.62, 2 * HORA],
    [CROSSPOINT, 0.58, 1 * DIA],
  ]],
  ["b2e1d3", "Duna", "Frank Herbert", 680, "reading", [
    [CROSSPOINT, 0.31, 5 * HORA],
    [KINDLE, 0.29, 2 * DIA],
  ]],
  ["c3d2e4", "Grande Sertão: Veredas", "João Guimarães Rosa", 560, "reading", [
    [KOREADER, 0.17, 1 * DIA + 3 * HORA],
  ]],
  ["d4c3f5", "O Programador Pragmático", "Andrew Hunt, David Thomas", 352, "reading", [
    [KINDLE, 0.44, 3 * DIA],
  ]],
  ["e5b4a6", "A Hora da Estrela", "Clarice Lispector", 88, "finished", [
    [CROSSPOINT, 1, 6 * DIA],
    [KINDLE, 0.97, 7 * DIA],
  ]],
  ["f6a5b7", "Dom Casmurro", "Machado de Assis", 256, "finished", [
    [KINDLE, 0.99, 12 * DIA],
  ]],
  ["a7f6c8", "Vidas Secas", "Graciliano Ramos", 176, "finished", [
    [KOREADER, 1, 20 * DIA],
  ]],
  ["b8e7d9", "Sapiens", "Yuval Noah Harari", 464, "paused", [
    [KINDLE, 0.38, 34 * DIA],
  ]],
  ["c9d8ea", "Código Limpo", "Robert C. Martin", 440, "paused", [
    [CROSSPOINT, 0.22, 41 * DIA],
  ]],
  ["dac9fb", "Capitães da Areia", "Jorge Amado", 280, "finished", [
    [CROSSPOINT, 1, 52 * DIA],
  ]],
  ["ebdaac", "Ulysses", "James Joyce", 1104, "dnf", [
    [KINDLE, 0.09, 90 * DIA],
  ]],
];

const hash = (curto) => curto.padEnd(32, "0");

function linhas(aparelhos) {
  return aparelhos
    .map(([aparelho, percentage, atras]) => ({
      ...aparelho,
      percentage,
      progress: `/body/DocFragment[${Math.max(1, Math.round(percentage * 30))}]/body/p[12]`,
      position: aparelho === KINDLE ? null : { pctQ: Math.round(percentage * 1e6) },
      timestamp: AGORA - atras,
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
}

/** Igual ao GET /api/v1/progress: a linha mais nova de cada livro + metadados. */
export const DEMO_ITEMS = LIVROS.map(([doc, title, author, pages, status, aparelhos]) => {
  const [maisNova] = linhas(aparelhos);
  return {
    document: hash(doc),
    title,
    author,
    filename: `${title} - ${author}.epub`,
    status,
    status_at: null,
    cover_url: null, // sem capa: o app desenha uma capa de tecido
    page_count: pages,
    ...maisNova,
  };
}).sort((a, b) => b.timestamp - a.timestamp);

/** Igual ao GET /api/v1/progress/{document}: todas as linhas, mais nova primeiro. */
export const DEMO_DEVICES = Object.fromEntries(
  LIVROS.map(([doc, , , , , aparelhos]) => [hash(doc), linhas(aparelhos)])
);

/** Igual (resumido) ao GET /api/v1/stats/activity. */
export const DEMO_ACTIVITY = {
  pages_total: 3184,
  books: DEMO_ITEMS.map((livro) => ({
    document: livro.document,
    percentage: livro.percentage,
    finished_at: livro.status === "finished" ? livro.timestamp : null,
    page_count: livro.page_count,
  })),
  days: [],
};
