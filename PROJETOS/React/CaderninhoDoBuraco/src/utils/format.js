// format.js
// Datas e números em pt-BR.

const numero = new Intl.NumberFormat("pt-BR");
const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

export { MESES };

/**
 * "2026-11-02" -> Date no fuso do navegador (meio-dia, para não voltar um
 * dia por causa do fuso, como aconteceria com new Date("2026-11-02")).
 */
export function dataLocal(iso) {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d, 12);
}

/** Hoje como "2026-11-02" (no fuso do navegador). */
export function hojeIso() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/** "2026-11-02" -> "02/11/2026" */
export function formatData(iso) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

/** "2026-11-02" -> "02/11" */
export function formatDiaMes(iso) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

/** "2026-11-02" -> "segunda, 2 de novembro de 2026" */
export function formatDataExtensa(iso) {
  const d = dataLocal(iso);
  return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

/** "2026-11" -> "novembro de 2026" */
export function formatMesAno(anoMes) {
  const [a, m] = anoMes.split("-").map(Number);
  return `${MESES[m - 1]} de ${a}`;
}

/** "2026-11" -> "nov/26" (eixo dos gráficos) */
export function formatMesCurto(anoMes) {
  const [a, m] = anoMes.split("-").map(Number);
  return `${MESES[m - 1].slice(0, 3)}/${String(a).slice(2)}`;
}

/** 1234 -> "1.234" */
export function formatNumero(n) {
  return numero.format(n);
}

/** 1225 -> "+1.225", -30 -> "−30", 0 -> "0" (com o sinal de menos tipográfico) */
export function formatPontos(n) {
  if (n > 0) return `+${numero.format(n)}`;
  if (n < 0) return `−${numero.format(Math.abs(n))}`;
  return "0";
}

/** "1 vitória", "2 vitórias" */
export function plural(n, singular, pluralTexto = `${singular}s`) {
  return `${numero.format(n)} ${n === 1 ? singular : pluralTexto}`;
}

/** 0.5 -> "50%" */
export function formatPercentual(fracao) {
  return `${Math.round(fracao * 100)}%`;
}
