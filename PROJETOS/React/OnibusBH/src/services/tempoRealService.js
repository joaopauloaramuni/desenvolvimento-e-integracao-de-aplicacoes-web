// tempoRealService.js
// Conversa com a rota /api/pbh do próprio site (nunca direto com a PBH:
// a chave do feed fica no servidor).

import { TEMPO_REAL } from "../config/appConfig";

async function getJson(params) {
  const url = `${TEMPO_REAL.PATH}?${new URLSearchParams(params)}`;
  let resposta;
  try {
    resposta = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  } catch {
    throw Object.assign(new Error("Sem conexão com o servidor do site."), { codigo: "rede" });
  }
  const tipo = resposta.headers.get("Content-Type") ?? "";
  // Sem a rota /api (ex.: site estático sem a Vercel Function), chega HTML
  if (!tipo.includes("json")) {
    throw Object.assign(new Error("A rota /api/pbh não está disponível neste servidor."), { codigo: "sem_api" });
  }
  const corpo = await resposta.json();
  if (!resposta.ok) throw Object.assign(new Error(corpo.message ?? `Erro ${resposta.status}`), { codigo: corpo.error });
  return corpo;
}

/** { tempoReal: boolean } — o servidor diz se o PBH_GTFS_RT_URL está configurado */
export const statusTempoReal = () => getJson({ recurso: "status" });

/** { atualizadoEm, totalNaCidade, veiculos: [...] } das linhas (route_id) pedidas */
export const buscarOnibus = (rotas) => getJson({ recurso: "onibus", rotas: rotas.join(",") });
