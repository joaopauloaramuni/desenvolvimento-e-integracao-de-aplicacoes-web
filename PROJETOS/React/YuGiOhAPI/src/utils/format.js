/** 46986414 -> "46986414" com zeros à esquerda (passcodes têm 8 dígitos). */
export function formatarPasscode(id) {
  return String(id).padStart(8, "0");
}

/** "1.23" -> "$1.23" (en-US) ou "US$ 1,23" (pt-BR). Valores zerados ou ausentes viram null. */
export function formatarDolar(valor, locale = "en-US") {
  const n = Number(valor);
  return Number.isFinite(n) && n > 0 ? new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(n) : null;
}

export function formatarEuro(valor, locale = "en-US") {
  const n = Number(valor);
  return Number.isFinite(n) && n > 0 ? new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(n) : null;
}

export function formatarNumero(valor, locale = "en-US") {
  return new Intl.NumberFormat(locale).format(valor);
}

/** ATK/DEF: "?" na API vem como -1 ou null. */
export function formatarStat(valor) {
  if (valor === null || valor === undefined) return "—";
  return valor < 0 ? "?" : String(valor);
}
