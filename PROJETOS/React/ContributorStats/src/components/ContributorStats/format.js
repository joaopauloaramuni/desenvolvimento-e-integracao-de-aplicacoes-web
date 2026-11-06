// Formatação compartilhada pelos componentes (pt-BR)

/** 1234 -> "1.234"; com signed: +1.234 / -1.234 */
export function formatInt(value = 0, signed = false) {
  const text = new Intl.NumberFormat("pt-BR").format(Math.abs(value));
  if (value < 0) return `-${text}`;
  return signed ? `+${text}` : text;
}

/** 12.345 -> "12,3" */
export const formatDecimal = (value = 0, digits = 1) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

export const formatTime = (date = new Date()) => date.toLocaleTimeString("pt-BR");

/** 0.425 -> "42,5%" (digits = casas decimais) */
export const formatPercent = (share = 0, digits = 1) =>
  `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: digits }).format(share * 100)}%`;

/** "2026-10-16" -> "16/10" */
export const formatDayMonth = (isoDay) => (isoDay ? `${isoDay.slice(8, 10)}/${isoDay.slice(5, 7)}` : "");

/** Nível de cor (0 a 4) de uma célula de mapa de calor, como no gráfico de contribuições do GitHub. */
export function heatLevel(value, max) {
  if (!value) return 0;
  return Math.min(4, Math.max(1, Math.ceil((value / max) * 4)));
}
