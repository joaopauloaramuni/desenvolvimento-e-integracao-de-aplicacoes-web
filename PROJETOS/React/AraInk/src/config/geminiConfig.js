// geminiConfig.js
// Configurações da API do Gemini (usada quando VITE_IMAGE_PROVIDER=gemini).
//
// Este projeto NÃO tem back-end: a chave vem do .env.local (VITE_GEMINI_API_KEY)
// e entra no JavaScript do navegador na hora do build. Veja "Segurança" no README.
// Na API, a geração de imagens exige faturamento ativo (o plano gratuito tem limite 0).

const env = import.meta.env;

const GEMINI_CONFIG = {
  API_KEY: (env.VITE_GEMINI_API_KEY ?? "").trim(),

  // Modelo que gera imagens (troque no .env.local, se quiser)
  MODEL: (env.VITE_GEMINI_IMAGE_MODEL ?? "").trim() || "gemini-2.5-flash-image",

  BASE_URL: "https://generativelanguage.googleapis.com/v1beta/models",

  TIMEOUT_MS: 90_000,

  // Variações pedidas ao mesmo tempo
  SIMULTANEOS: 4,
};

export default GEMINI_CONFIG;
