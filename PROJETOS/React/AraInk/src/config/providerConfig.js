// providerConfig.js
// Qual serviço desenha as tatuagens. Escolha no .env.local:
//   VITE_IMAGE_PROVIDER=openai   (GPT Image, padrão)
//   VITE_IMAGE_PROVIDER=gemini   (Google Gemini)
// Os dois são pagos: cada imagem gerada ou ajustada é cobrada.

import GEMINI_CONFIG from "./geminiConfig";
import OPENAI_CONFIG from "./openaiConfig";

const QUALIDADES = { low: "baixa", medium: "média", high: "alta" };

export const PROVIDERS = {
  openai: {
    id: "openai",
    nome: "GPT Image",
    empresa: "OpenAI",
    variavelChave: "VITE_OPENAI_API_KEY",
    modelo: OPENAI_CONFIG.MODEL,
    detalhe: `qualidade ${QUALIDADES[OPENAI_CONFIG.QUALITY]}`,
    simultaneos: OPENAI_CONFIG.SIMULTANEOS,
    temChave: OPENAI_CONFIG.API_KEY.length > 0,
  },
  gemini: {
    id: "gemini",
    nome: "Gemini",
    empresa: "Google",
    variavelChave: "VITE_GEMINI_API_KEY",
    modelo: GEMINI_CONFIG.MODEL,
    detalhe: "",
    simultaneos: GEMINI_CONFIG.SIMULTANEOS,
    temChave: GEMINI_CONFIG.API_KEY.length > 0,
  },
};

const escolhido = (import.meta.env.VITE_IMAGE_PROVIDER ?? "").trim().toLowerCase();

export const PROVIDER = PROVIDERS[escolhido] ?? PROVIDERS.openai;

/** O provedor escolhido tem chave configurada? */
export const providerPronto = () => PROVIDER.temChave;
