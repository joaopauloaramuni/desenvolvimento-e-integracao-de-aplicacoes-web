// dadosService.js
// Lê os arquivos que o `npm run dados` gerou em public/data.
// Cada arquivo é baixado uma vez só: a Promise fica guardada num Map.

import { DADOS } from "../config/appConfig";

const cache = new Map();

async function baixarJson(caminho) {
  const resposta = await fetch(`${DADOS.PASTA}/${caminho}`);
  // O Vite devolve o index.html (200, text/html) para arquivos que não existem
  const tipo = resposta.headers.get("Content-Type") ?? "";
  if (!resposta.ok || !tipo.includes("json")) {
    throw new Error(
      resposta.status === 404 || tipo.includes("html")
        ? "Os dados das linhas ainda não foram gerados. Rode `npm run dados` e recarregue a página."
        : `Erro ${resposta.status} ao ler ${caminho}.`
    );
  }
  return resposta.json();
}

function carregar(caminho) {
  if (!cache.has(caminho)) {
    const promessa = baixarJson(caminho).catch((erro) => {
      cache.delete(caminho); // deixa tentar de novo
      throw erro;
    });
    cache.set(caminho, promessa);
  }
  return cache.get(caminho);
}

/** Índice de todas as linhas: { meta, linhas: [{ id, codigo, nome, cor, arquivo, sentidos }] } */
export const carregarIndice = () => carregar("linhas.json");

/** Uma linha completa: sentidos com traçado, pontos e horários */
export const carregarLinha = (arquivo) => carregar(`linhas/${encodeURIComponent(arquivo)}.json`);

/** Linhas perto de cada campus da PUC Minas */
export const carregarCampus = () => carregar("campus.json");
