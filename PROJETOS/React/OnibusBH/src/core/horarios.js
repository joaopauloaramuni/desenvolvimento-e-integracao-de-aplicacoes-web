// horarios.js
// O quadro de horários da BHTrans tem três tabelas: dias úteis, sábado e
// domingo/feriado. Aqui ficam as regras para saber qual vale "agora" e quais
// são as próximas partidas.
//
// Os horários chegam do scripts/dados.mjs em MINUTOS desde a meia-noite do dia
// de operação (ex.: 5h10 = 310). Como no GTFS, passam de 24h: 25h05 = 1h05 da
// madrugada seguinte, ainda contando como "o mesmo dia" de operação.

export const TIPOS_DE_DIA = [
  { id: "util", nome: "Dias úteis" },
  { id: "sabado", nome: "Sábado" },
  { id: "domingo", nome: "Domingo e feriado" },
];

const FUSO_BH = "America/Sao_Paulo";

/** Data e hora de agora no fuso de BH, qualquer que seja o fuso do computador. */
export function agoraEmBH(data = new Date()) {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: FUSO_BH,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(data)
      .map((p) => [p.type, p.value])
  );
  const ano = Number(partes.year);
  const mes = Number(partes.month);
  const dia = Number(partes.day);
  return {
    ano,
    mes,
    dia,
    diaDaSemana: new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay(), // 0 = domingo
    minutos: Number(partes.hour) * 60 + Number(partes.minute),
  };
}

// Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher), em UTC
function pascoa(ano) {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return Date.UTC(ano, mes - 1, dia);
}

const DIA_MS = 86_400_000;
const chave = (mes, dia) => `${mes}-${dia}`;

/** Feriados nacionais e municipais de BH (fixos e móveis) de um ano. */
export function feriados(ano) {
  const fixos = [
    [1, 1], // Confraternização Universal
    [4, 21], // Tiradentes
    [5, 1], // Dia do Trabalho
    [8, 15], // Assunção de Nossa Senhora (BH)
    [9, 7], // Independência
    [10, 12], // Nossa Senhora Aparecida
    [11, 2], // Finados
    [11, 15], // Proclamação da República
    [11, 20], // Consciência Negra
    [12, 8], // Imaculada Conceição (BH)
    [12, 25], // Natal
  ].map(([m, d]) => chave(m, d));

  const p = pascoa(ano);
  const moveis = [p - 2 * DIA_MS, p + 60 * DIA_MS] // Sexta-feira Santa e Corpus Christi
    .map((ms) => new Date(ms))
    .map((d) => chave(d.getUTCMonth() + 1, d.getUTCDate()));

  return new Set([...fixos, ...moveis]);
}

/** Qual tabela vale para a data: "util", "sabado" ou "domingo" (domingo e feriado). */
export function tipoDoDia(agora = agoraEmBH()) {
  if (agora.diaDaSemana === 0 || feriados(agora.ano).has(chave(agora.mes, agora.dia))) return "domingo";
  if (agora.diaDaSemana === 6) return "sabado";
  return "util";
}

/** 310 -> "05:10"; 1505 -> "01:05" (madrugada do dia seguinte). */
export function formatarHora(minutos) {
  const m = ((minutos % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** "daqui a 7 min", "daqui a 1 h 05". */
export function formatarEspera(minutos) {
  if (minutos <= 0) return "agora";
  if (minutos < 60) return `em ${minutos} min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m ? `em ${h} h ${String(m).padStart(2, "0")}` : `em ${h} h`;
}

/**
 * Próximas passagens a partir de agora.
 * `apos` = minutos entre a saída do ponto inicial e o ponto escolhido (0 = ponto inicial).
 * A madrugada (até as 4h) ainda pertence ao dia de operação anterior,
 * então 0h30 é procurado como 24h30 na tabela de ontem.
 */
export function proximasPartidas(horarios, { agora = agoraEmBH(), quantidade = 3, apos = 0 } = {}) {
  if (!horarios) return [];
  const resultado = [];

  if (agora.minutos < 4 * 60) {
    const ontem = agoraEmBH(new Date(Date.now() - DIA_MS));
    const alvo = agora.minutos + 1440;
    for (const h of horarios[tipoDoDia(ontem)] ?? []) {
      if (h + apos >= alvo) resultado.push({ minutos: h + apos, espera: h + apos - alvo });
    }
  }

  for (const h of horarios[tipoDoDia(agora)] ?? []) {
    if (h + apos >= agora.minutos) resultado.push({ minutos: h + apos, espera: h + apos - agora.minutos });
  }

  return resultado.slice(0, quantidade);
}

/** Agrupa a tabela por hora, como no quadro impresso: [[5, [310, 325]], [6, [...]]]. */
export function agruparPorHora(horarios = []) {
  const grupos = new Map();
  for (const h of horarios) {
    const hora = Math.floor(h / 60);
    if (!grupos.has(hora)) grupos.set(hora, []);
    grupos.get(hora).push(h);
  }
  return [...grupos.entries()];
}
