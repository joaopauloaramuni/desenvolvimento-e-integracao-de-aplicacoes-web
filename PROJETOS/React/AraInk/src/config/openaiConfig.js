// openaiConfig.js
// Configurações da API de imagens da OpenAI (GPT Image), usada quando VITE_IMAGE_PROVIDER=openai.
//
// Este projeto NÃO tem back-end: a chave vem do .env.local (VITE_OPENAI_API_KEY)
// e entra no JavaScript do navegador na hora do build. A chave da OpenAI não pode
// ser restrita por site: use o app localmente e veja "Segurança" no README.

const env = import.meta.env;

const QUALIDADES = ["low", "medium", "high"];
const qualidade = (env.VITE_OPENAI_IMAGE_QUALITY ?? "").trim().toLowerCase();

const OPENAI_CONFIG = {
  API_KEY: (env.VITE_OPENAI_API_KEY ?? "").trim(),

  // Modelo de imagem (troque no .env.local, se quiser)
  MODEL: (env.VITE_OPENAI_IMAGE_MODEL ?? "").trim() || "gpt-image-1",

  // low = mais barato e rápido | medium = equilíbrio (padrão) | high = mais caro e detalhado
  QUALITY: QUALIDADES.includes(qualidade) ? qualidade : "medium",

  BASE_URL: "https://api.openai.com/v1/images",

  // Gerar com qualidade alta pode passar de um minuto
  TIMEOUT_MS: 180_000,

  // Variações pedidas ao mesmo tempo (contas novas têm limite baixo de imagens por minuto)
  SIMULTANEOS: 2,
};

export default OPENAI_CONFIG;
