import { PROVIDER } from "../config/providerConfig";
import * as gemini from "./geminiService";
import * as openai from "./openaiService";

/**
 * Ponto único que o app usa para gerar e ajustar tatuagens.
 * Ele manda a chamada para o GPT Image (OpenAI) ou para o Gemini (Google),
 * conforme VITE_IMAGE_PROVIDER no .env.local. Os dois devolvem um data URL.
 *
 * formato: um item de FORMATS (tattooOptions.js), que tem o tamanho de cada provedor:
 *   size (GPT Image: "1024x1536") e aspectRatio (Gemini: "2:3").
 */

export { PROVIDER };

/** Gera uma imagem a partir do prompt. */
export function gerar({ prompt, formato, signal }) {
  return PROVIDER.id === "gemini"
    ? gemini.gerarImagem({ prompt, aspectRatio: formato.aspectRatio, signal })
    : openai.gerarImagem({ prompt, size: formato.size, signal });
}

/** Edita a imagem atual com um pedido ("linhas mais finas"). Os dois provedores editam de verdade. */
export function editar({ src, prompt, formato, signal }) {
  return PROVIDER.id === "gemini"
    ? gemini.editarImagem({ src, prompt, aspectRatio: formato.aspectRatio, signal })
    : openai.editarImagem({ src, prompt, size: formato.size, signal });
}
