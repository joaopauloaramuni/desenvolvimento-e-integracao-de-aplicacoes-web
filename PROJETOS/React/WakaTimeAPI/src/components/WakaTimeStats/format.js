// Formatação usada pelo <WakaTimeStats /> (pt-BR)

// 457722 s → "127 h 8 min" (arredonda para baixo, como o WakaTime)
export function formatDuration(seconds = 0) {
  const minutes = Math.floor(seconds / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

// 31.76 → "31,8%"
export function formatPercent(percent = 0) {
  if (percent > 0 && percent < 0.1) return "<0,1%";
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(percent / 100);
}

// "2025-09-01" → "1 de set. de 2025"
export function formatDate(value) {
  if (!value) return null;
  // Meio-dia: a data não "volta" um dia em nenhum fuso
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export const formatNumber = (value) => new Intl.NumberFormat("pt-BR").format(value);

// timestamp em ms → "14:32"
export const formatTime = (ms) =>
  new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(ms);

// Quanto tempo atrás: "agora há pouco" | "há 3 min" | "há 2 h"
export function formatAgo(ms, now = Date.now()) {
  const minutes = Math.max(0, Math.floor((now - ms) / 60000));
  if (minutes < 1) return "agora há pouco";
  if (minutes < 60) return `há ${minutes} min`;
  return `há ${Math.floor(minutes / 60)} h`;
}
