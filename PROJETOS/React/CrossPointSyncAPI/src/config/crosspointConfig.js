// crosspointConfig.js
// Configurações do app que lê a sua estante no crosspoint-sync.
//
// O crosspoint-sync é um servidor de sincronização compatível com o KOSync
// (o mesmo protocolo do KOReader). O app conversa com ele direto do navegador:
// o servidor libera CORS para /users/* e /api/v1/*, então não precisa de backend.
// Repositório do servidor: https://github.com/crosspoint-reader/crosspoint-sync
const CROSSPOINT_CONFIG = {
  // Servidor hospedado oficial. Se você roda o seu (Docker, Railway, Raspberry Pi...),
  // troque no formulário de entrada ou aqui.
  DEFAULT_SERVER: "https://sync.crosspointreader.com",

  // Rotas usadas (todas GET, autenticadas com x-auth-user / x-auth-key)
  ROUTES: {
    AUTH: "/users/auth",
    PROGRESS: "/api/v1/progress", // lista de livros com progresso + metadados
    DEVICES: (documento) => `/api/v1/progress/${encodeURIComponent(documento)}`, // progresso por aparelho
    ACTIVITY: "/api/v1/stats/activity", // páginas lidas e livros concluídos
  },

  // Quantos livros por página no GET /api/v1/progress (máximo do servidor: 500)
  PAGE_LIMIT: 200,

  // Limite de segurança de páginas buscadas em sequência
  MAX_PAGES: 10,

  // Tempo máximo de cada requisição (ms)
  TIMEOUT: 15000,

  // O conector Kindle grava o progresso como se fosse um "aparelho" com este id.
  // É assim que o app sabe que a última leitura veio do Kindle (Whispersync).
  KINDLE_DEVICE_ID: "kindle",

  // Abas da estante. "status" vem pronto do servidor:
  // manual, senão "finished" a partir de 98%, senão "reading".
  TABS: [
    { id: "reading", label: "Lendo agora" },
    { id: "paused", label: "Pausados" },
    { id: "finished", label: "Concluídos" },
    { id: "dnf", label: "Abandonados" },
    { id: "all", label: "Todos" },
  ],

  // Chaves do localStorage. A do tema também é usada no index.html.
  STORAGE_KEYS: {
    THEME: "crosspoint:theme",
    SESSION: "crosspoint:session",
  },
};

export default CROSSPOINT_CONFIG;
