// format.js
// Pequenos formatadores de texto em português.
import CROSSPOINT_CONFIG from "../config/crosspointConfig";

const relativo = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
const numero = new Intl.NumberFormat("pt-BR");
const data = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" });

/** 1752345678 (segundos) -> "há 2 horas" */
export function haQuantoTempo(timestamp) {
  if (!timestamp) return "";
  const segundos = timestamp - Date.now() / 1000;
  const passos = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.35, "week"],
    [12, "month"],
    [Infinity, "year"],
  ];
  let valor = segundos;
  for (const [tamanho, unidade] of passos) {
    if (Math.abs(valor) < tamanho) return relativo.format(Math.round(valor), unidade);
    valor /= tamanho;
  }
  return "";
}

export const formatarData = (timestamp) => (timestamp ? data.format(new Date(timestamp * 1000)) : "");

export const formatarNumero = (n) => numero.format(n ?? 0);

/** 0.4867 -> "49%" (nunca mostra 100% antes de terminar de verdade) */
export function formatarPorcentagem(p) {
  const valor = Math.max(0, Math.min(1, p ?? 0)) * 100;
  return `${valor >= 99.5 && valor < 100 ? 99 : Math.round(valor)}%`;
}

/** Página aproximada a partir da porcentagem e do total impresso. */
export function paginaAtual(livro) {
  if (!livro.page_count) return null;
  return Math.max(1, Math.round((livro.percentage ?? 0) * livro.page_count));
}

export const veioDoKindle = (linha) => linha?.device_id === CROSSPOINT_CONFIG.KINDLE_DEVICE_ID;

/** "Amazon Kindle (Whispersync)" -> "Kindle"; "Boox Palma (KOReader)" -> "Boox Palma" */
export function nomeDoAparelho(linha) {
  if (veioDoKindle(linha)) return "Kindle";
  const nome = (linha?.device || linha?.device_id || "").replace(/\s*\(.*\)\s*$/, "").trim();
  return nome || "Aparelho";
}

/** Título para exibir: título, senão nome do arquivo, senão o hash. */
export function tituloDe(livro) {
  if (livro.title) return livro.title;
  if (livro.filename) return livro.filename.replace(/\.(epub|pdf|mobi|azw3?|fb2|txt)$/i, "");
  return `Documento ${livro.document.slice(0, 8)}`;
}
