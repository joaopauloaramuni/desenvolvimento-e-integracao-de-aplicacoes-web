// periodo.js
// O filtro de período do placar e das estatísticas (mês, ano, todo o tempo...).
// Fica na URL (?periodo=mes&mes=2026-11) para dar para salvar e mandar o link.

import { formatData, formatMesAno, hojeIso } from "./format";

export const TIPOS_PERIODO = [
  { id: "tudo", nome: "Todo o tempo" },
  { id: "mes", nome: "Mês" },
  { id: "ano", nome: "Ano" },
  { id: "intervalo", nome: "Entre datas" },
];

function ultimoDiaDoMes(ano, mes) {
  return new Date(ano, mes, 0).getDate();
}

/** O período padrão: o mês atual. */
export function periodoPadrao() {
  return { tipo: "mes", mes: hojeIso().slice(0, 7), ano: hojeIso().slice(0, 4), inicio: "", fim: "" };
}

/** Lê o período dos parâmetros da URL (URLSearchParams). */
export function periodoDaUrl(params) {
  const padrao = periodoPadrao();
  const tipo = TIPOS_PERIODO.some((t) => t.id === params.get("periodo")) ? params.get("periodo") : padrao.tipo;
  const mes = /^\d{4}-\d{2}$/.test(params.get("mes") ?? "") ? params.get("mes") : padrao.mes;
  const ano = /^\d{4}$/.test(params.get("ano") ?? "") ? params.get("ano") : padrao.ano;
  const data = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(v ?? "") ? v : "");
  return { tipo, mes, ano, inicio: data(params.get("inicio")), fim: data(params.get("fim")) };
}

/** O contrário: período -> parâmetros da URL (só o que importa para o tipo). */
export function periodoParaUrl(periodo) {
  const p = { periodo: periodo.tipo };
  if (periodo.tipo === "mes") p.mes = periodo.mes;
  if (periodo.tipo === "ano") p.ano = periodo.ano;
  if (periodo.tipo === "intervalo") {
    if (periodo.inicio) p.inicio = periodo.inicio;
    if (periodo.fim) p.fim = periodo.fim;
  }
  return p;
}

/** Período -> { inicio, fim } em "AAAA-MM-DD" (null = sem limite). */
export function intervaloDoPeriodo(periodo) {
  switch (periodo.tipo) {
    case "mes": {
      const [a, m] = periodo.mes.split("-").map(Number);
      return { inicio: `${periodo.mes}-01`, fim: `${periodo.mes}-${String(ultimoDiaDoMes(a, m)).padStart(2, "0")}` };
    }
    case "ano":
      return { inicio: `${periodo.ano}-01-01`, fim: `${periodo.ano}-12-31` };
    case "intervalo":
      return { inicio: periodo.inicio || null, fim: periodo.fim || null };
    default:
      return { inicio: null, fim: null };
  }
}

/** Texto do período para os títulos: "novembro de 2026", "2026", "todo o tempo"... */
export function descreverPeriodo(periodo) {
  switch (periodo.tipo) {
    case "mes":
      return formatMesAno(periodo.mes);
    case "ano":
      return periodo.ano;
    case "intervalo": {
      const { inicio, fim } = periodo;
      if (inicio && fim) return `de ${formatData(inicio)} a ${formatData(fim)}`;
      if (inicio) return `desde ${formatData(inicio)}`;
      if (fim) return `até ${formatData(fim)}`;
      return "todo o tempo";
    }
    default:
      return "todo o tempo";
  }
}
