import OPENAI_CONFIG from "../config/openaiConfig";
import { PROVIDERS } from "../config/providerConfig";
import { ImageError } from "./imageErrors";

const erro = (code, detalhe = "") => new ImageError(code, PROVIDERS.openai, detalhe);

/* =========================================================
   ERROS
   ========================================================= */

function erroDaResposta(status, body) {
  const info = body?.error ?? {};
  const mensagem = info.message ?? "";
  const codigo = info.code ?? "";

  if (status === 401) return erro("invalid_key", mensagem);
  if (status === 403 && /verif/i.test(mensagem)) return erro("org_not_verified", mensagem);
  if (status === 403) return erro("permission", mensagem);
  if (status === 404) return erro("model_not_found", mensagem);
  if (codigo === "insufficient_quota" || codigo === "billing_hard_limit_reached" || /billing|quota/i.test(codigo)) {
    return erro("no_credit", mensagem);
  }
  if (status === 429) return erro("quota", mensagem);
  if (codigo === "moderation_blocked" || /safety|moderation/i.test(mensagem)) {
    return erro("blocked", mensagem);
  }
  if (status >= 500) return erro("server", mensagem);

  const falha = erro("bad_request", mensagem);
  falha.message = `${falha.message} ${mensagem}`.trim();
  return falha;
}

/* =========================================================
   CHAMADA À API
   ========================================================= */

async function chamar(endpoint, { body, json }, signal) {
  if (!OPENAI_CONFIG.API_KEY) throw erro("missing_key");

  // Cancela se o usuário clicar em "Parar" ou se passar do tempo limite
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), OPENAI_CONFIG.TIMEOUT_MS);
  const aoCancelar = () => controller.abort("user");
  signal?.addEventListener("abort", aoCancelar);

  let response;
  try {
    response = await fetch(`${OPENAI_CONFIG.BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_CONFIG.API_KEY}`,
        // Em multipart (edits), o navegador monta o Content-Type com o boundary sozinho
        ...(json ? { "Content-Type": "application/json" } : {}),
      },
      body: json ? JSON.stringify(json) : body,
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

  const resposta = await response.json().catch(() => ({}));
  if (!response.ok) throw erroDaResposta(response.status, resposta);

  // O GPT Image devolve a imagem em base64 (b64_json)
  const base64 = resposta.data?.[0]?.b64_json;
  if (!base64) throw erro("no_image");
  return `data:image/png;base64,${base64}`;
}

/**
 * Gera uma imagem: POST /v1/images/generations
 *
 * gerarImagem({ prompt, size: "1024x1024", signal? }) -> data URL (PNG)
 */
export function gerarImagem({ prompt, size = "1024x1024", signal }) {
  return chamar(
    "generations",
    {
      json: {
        model: OPENAI_CONFIG.MODEL,
        prompt,
        n: 1,
        size,
        quality: OPENAI_CONFIG.QUALITY,
        output_format: "png",
      },
    },
    signal
  );
}

/** data URL -> Blob (para mandar a imagem atual no multipart do edits) */
async function dataUrlParaBlob(dataUrl) {
  return (await fetch(dataUrl)).blob();
}

/**
 * Edita uma imagem com um pedido ("linhas mais finas"): POST /v1/images/edits
 *
 * editarImagem({ src, prompt, size, signal? }) -> data URL (PNG)
 */
export async function editarImagem({ src, prompt, size = "1024x1024", signal }) {
  const formulario = new FormData();
  formulario.append("model", OPENAI_CONFIG.MODEL);
  formulario.append("image", await dataUrlParaBlob(src), "tatuagem.png");
  formulario.append("prompt", prompt);
  formulario.append("size", size);
  formulario.append("quality", OPENAI_CONFIG.QUALITY);
  formulario.append("output_format", "png");
  return chamar("edits", { body: formulario }, signal);
}
