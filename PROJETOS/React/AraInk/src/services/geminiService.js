import GEMINI_CONFIG from "../config/geminiConfig";
import { PROVIDERS } from "../config/providerConfig";
import { ImageError } from "./imageErrors";

const erro = (code, detalhe = "") => new ImageError(code, PROVIDERS.gemini, detalhe);

// Motivos de bloqueio que o Gemini pode devolver em finishReason / blockReason
const BLOCK_REASONS = new Set([
  "SAFETY",
  "PROHIBITED_CONTENT",
  "BLOCKLIST",
  "SPII",
  "IMAGE_SAFETY",
  "IMAGE_PROHIBITED_CONTENT",
  "OTHER",
]);

function erroDaResposta(status, body) {
  const mensagem = body?.error?.message ?? "";
  if (status === 400 && /api key/i.test(mensagem)) return erro("invalid_key", mensagem);
  if (status === 400 && /billing/i.test(mensagem)) return erro("no_credit", mensagem);
  if (status === 401) return erro("invalid_key", mensagem);
  if (status === 403) return erro("permission", mensagem);
  if (status === 404) return erro("model_not_found", mensagem);
  // "limit: 0" no free tier = o modelo não tem cota gratuita (esperar não resolve)
  if (status === 429 && /free_tier[\s\S]*limit: 0/.test(mensagem)) return erro("no_free_tier", mensagem);
  if (status === 429) return erro("quota", mensagem);
  if (status >= 500) return erro("server", mensagem);
  const falha = erro("bad_request", mensagem);
  falha.message = `${falha.message} ${mensagem}`.trim();
  return falha;
}

/**
 * Chama o generateContent do Gemini e devolve a primeira imagem da resposta.
 * Com image, o Gemini edita a imagem enviada.
 */
async function generateContent({ prompt, aspectRatio = "1:1", image = null, signal }) {
  if (!GEMINI_CONFIG.API_KEY) throw erro("missing_key");

  const parts = [];
  if (image) parts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
  parts.push({ text: prompt });

  // Cancela se o usuário clicar em "Parar" ou se passar do tempo limite
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), GEMINI_CONFIG.TIMEOUT_MS);
  const aoCancelar = () => controller.abort("user");
  signal?.addEventListener("abort", aoCancelar);

  let response;
  try {
    response = await fetch(`${GEMINI_CONFIG.BASE_URL}/${GEMINI_CONFIG.MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_CONFIG.API_KEY },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio } },
      }),
      signal: controller.signal,
    });
  } catch (falha) {
    if (signal?.aborted) throw new DOMException("Cancelado", "AbortError");
    if (controller.signal.aborted) throw erro("timeout");
    throw erro("network", falha?.message);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", aoCancelar);
  }

  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw erroDaResposta(response.status, json);

  // Pedido bloqueado antes de gerar
  if (json.promptFeedback?.blockReason) throw erro("blocked", json.promptFeedback.blockReason);

  const candidate = json.candidates?.[0];
  const partes = candidate?.content?.parts ?? [];
  const imagem = partes.find((parte) => parte.inlineData?.data || parte.inline_data?.data);

  if (!imagem) {
    if (BLOCK_REASONS.has(candidate?.finishReason)) throw erro("blocked", candidate.finishReason);
    throw erro("no_image");
  }

  const inline = imagem.inlineData ?? imagem.inline_data;
  const mimeType = inline.mimeType ?? inline.mime_type ?? "image/png";
  return `data:${mimeType};base64,${inline.data}`;
}

/** Separa um data URL em { mimeType, data } para mandar a imagem de volta ao Gemini. */
function dataUrlParaInline(dataUrl) {
  const [cabecalho, data] = dataUrl.split(",");
  const mimeType = cabecalho.match(/data:(.*?);base64/)?.[1] ?? "image/png";
  return { mimeType, data };
}

/** Gera uma imagem. gerarImagem({ prompt, aspectRatio, signal? }) -> data URL */
export function gerarImagem({ prompt, aspectRatio, signal }) {
  return generateContent({ prompt, aspectRatio, signal });
}

/** Edita uma imagem com um pedido. editarImagem({ src, prompt, aspectRatio, signal? }) -> data URL */
export function editarImagem({ src, prompt, aspectRatio, signal }) {
  return generateContent({ prompt, aspectRatio, image: dataUrlParaInline(src), signal });
}
