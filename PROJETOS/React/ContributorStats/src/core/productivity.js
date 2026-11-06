// Aba "Produtividade": indicadores para o professor avaliar o trabalho em grupo.
//
// Este módulo não faz requisições nem depende de React: recebe o resultado da
// análise (AnalysisResult) e calcula tudo localmente. Por isso trocar o
// período, o prazo ou a lista de integrantes NÃO gasta chamadas à API.
//
// - Modo "todas as branches": usa cada commit (data/hora de autoria, linhas,
//   mensagem), então todos os indicadores ficam disponíveis.
// - Modo "só a branch padrão": o /stats/contributors só informa totais por
//   SEMANA; os indicadores diários (dias ativos, horários, mensagens, commits
//   grandes...) ficam indisponíveis (null).
import CONFIG from "../config/contributorStatsConfig";
import { csvCell, downloadCsv } from "./exporter";
import { formatDateBR } from "./models";

/* =====================================================================
   Datas ("AAAA-MM-DD", sem fuso)
   ===================================================================== */

const DAY_MS = 86_400_000;

const toDayNumber = (day) => Date.parse(`${day}T00:00:00Z`) / DAY_MS;
const fromDayNumber = (n) => new Date(n * DAY_MS).toISOString().slice(0, 10);

/** Diferença em dias entre duas datas "AAAA-MM-DD" (b - a). */
export const daysBetween = (a, b) => Math.round(toDayNumber(b) - toDayNumber(a));

export const addDays = (day, n) => fromDayNumber(toDayNumber(day) + n);

/** Segunda-feira da semana de `day`. */
export function weekStart(day) {
  const n = toDayNumber(day);
  const weekday = (new Date(n * DAY_MS).getUTCDay() + 6) % 7; // 0 = segunda
  return fromDayNumber(n - weekday);
}

/** Todas as segundas-feiras entre `start` e `end` (inclusive). */
export function weeksBetween(start, end) {
  if (!start || !end || end < start) return [];
  const weeks = [];
  for (let w = weekStart(start); w <= end; w = addDays(w, 7)) weeks.push(w);
  return weeks;
}

/**
 * Data, hora e dia da semana do commit no horário de quem fez o commit.
 *
 * O GitHub costuma devolver a data com o fuso do autor ("...T23:10:00-03:00");
 * nesse caso usamos esse relógio. Se vier em UTC ("Z"), usamos o fuso do
 * navegador (normalmente o mesmo da turma).
 */
export function localParts(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const offset = /([+-])(\d{2}):?(\d{2})$/.exec(iso);
  let d;
  if (offset) {
    const sign = offset[1] === "-" ? -1 : 1;
    const minutes = sign * (Number(offset[2]) * 60 + Number(offset[3]));
    d = new Date(date.getTime() + minutes * 60_000);
    return {
      day: d.toISOString().slice(0, 10),
      hour: d.getUTCHours(),
      weekday: (d.getUTCDay() + 6) % 7, // 0 = segunda … 6 = domingo
    };
  }
  d = date;
  const pad = (n) => String(n).padStart(2, "0");
  return {
    day: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    hour: d.getHours(),
    weekday: (d.getDay() + 6) % 7,
  };
}

export const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/* =====================================================================
   Mensagens de commit
   ===================================================================== */

// Mensagens que não dizem o que foi feito ("update", "ajustes", "fix"...)
const GENERIC_RE = new RegExp(
  "^(" +
    [
      "update[sd]?",
      "atualiza(r|do|da|ção|cao|ções|coes)?",
      "fix(es|ed)?",
      "corrig(e|ido|indo)",
      "corre(ção|cao|ções|coes)",
      "ajuste?s?",
      "altera(ção|cao|ções|coes|do|da)?",
      "mudan(ça|ca|ças|cas)",
      "modifica(ção|cao|ções|coes|do)?",
      "teste?s?",
      "test(ing)?",
      "commit",
      "wip",
      "changes?",
      "minor( changes| fixes)?",
      "add(ed)?",
      "adiciona(do|ndo)?",
      "arquivos?",
      "files?",
      "initial commit",
      "first commit",
      "primeiro commit",
      "ok",
      "pronto",
      "final",
      "vers(ão|ao) final",
      "entrega",
      "v\\d+(\\.\\d+)*",
      "[.\\-_!?]+",
    ].join("|") +
    ")( \\d+)?$",
  "i"
);
// Mensagens padrão da interface web do GitHub ("Update README.md", "Create index.html")
const WEB_DEFAULT_RE = /^(update|create|delete|rename|add)\s+[^\s]+\.[a-z0-9]+$/i;
const UPLOAD_RE = /^add files via upload$/i;

/**
 * Classifica a mensagem (primeira linha) de um commit.
 * - generic: não descreve o que foi feito
 * - upload:  "Add files via upload" (arquivos enviados pelo navegador, sem git)
 */
export function classifyMessage(headline) {
  const text = String(headline ?? "")
    .trim()
    .replace(/\s+/g, " ");
  const upload = UPLOAD_RE.test(text);
  const generic =
    upload || text.length < CONFIG.MIN_MESSAGE_LENGTH || GENERIC_RE.test(text) || WEB_DEFAULT_RE.test(text);
  return { generic, upload };
}

/* =====================================================================
   Estatística
   ===================================================================== */

/**
 * Coeficiente de Gini (0 = todos contribuíram igual, 1 = uma pessoa fez tudo).
 * O "equilíbrio" exibido na tela é 1 - Gini.
 */
export function gini(values) {
  const xs = values.filter((v) => v >= 0);
  const n = xs.length;
  const sum = xs.reduce((s, v) => s + v, 0);
  if (n < 2 || sum === 0) return 0;
  const sorted = [...xs].sort((a, b) => a - b);
  // Fórmula com a lista ordenada: G = (2 Σ i·x_i) / (n Σ x) - (n + 1) / n
  const weighted = sorted.reduce((s, v, i) => s + (i + 1) * v, 0);
  return (2 * weighted) / (n * sum) - (n + 1) / n;
}

export function median(values) {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Rótulo do equilíbrio (1 - Gini). */
export function balanceLabel(balance) {
  if (balance >= 0.75) return { label: "Equilibrado", tone: "success" };
  if (balance >= 0.55) return { label: "Moderado", tone: "warning" };
  return { label: "Concentrado", tone: "danger" };
}

/** Maior sequência de dias consecutivos com commit. */
function longestStreak(days) {
  const nums = [...days].map(toDayNumber).sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev = null;
  for (const n of nums) {
    run = prev !== null && n - prev === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = n;
  }
  return best;
}

/* =====================================================================
   Integrantes
   ===================================================================== */

const isBotKey = (key, name = "") => /\[bot\]$/i.test(key) || /\[bot\]$/i.test(name);

/** "aluno1, aluno2;aluno3\naluno4" -> ["aluno1", "aluno2", "aluno3", "aluno4"] */
export function parseMembers(text) {
  return [
    ...new Set(
      String(text ?? "")
        .split(/[\s,;]+/)
        .map((s) => s.trim().replace(/^@/, "").toLowerCase())
        .filter(Boolean)
    ),
  ];
}

const emptyHours = () => Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));

function emptyRow(contributor) {
  return {
    key: contributor.key,
    username: contributor.username,
    profileUrl: contributor.profileUrl ?? "",
    rank: contributor.rank ?? null,
    isBot: isBotKey(contributor.key, contributor.username),
    missing: false, // integrante esperado sem nenhum commit
    commits: 0,
    additions: 0,
    deletions: 0,
    changes: 0,
    shareCommits: 0,
    shareChanges: 0,
    weekly: new Map(), // segunda-feira -> commits
    activeWeeks: 0,
    firstCommit: null,
    lastCommit: null,
    daysSinceLast: null,
    unmerged: contributor.unmergedCommits ?? null,
    // Só no modo detalhado (todas as branches); null = indisponível
    activeDays: null,
    longestStreak: null,
    medianChanges: null,
    largeCommits: null,
    genericCount: null,
    uploadCount: null,
    finalStretch: null,
    late: 0,
    hours: null,
    commitList: null, // commits do período (mais recentes primeiro)
  };
}

/* =====================================================================
   Cálculo principal
   ===================================================================== */

/**
 * Calcula os indicadores de produtividade.
 *
 * @param result  AnalysisResult
 * @param options.start           "AAAA-MM-DD" — commits antes desta data são ignorados
 * @param options.deadline        "AAAA-MM-DD" — prazo de entrega: commits depois dele
 *                                não entram nas métricas e são contados como "após o prazo"
 * @param options.members         logins (ou e-mails) dos integrantes esperados
 * @param options.ignoreBots      ignora contas [bot] (ex.: github-classroom[bot])
 * @param options.largeCommitLines  commit com mais linhas alteradas que isto é "grande"
 * @param options.finalStretchDays  dias antes do prazo considerados "reta final"
 * @param options.inactiveDays      dias sem commit (antes do fim do período) para alertar
 */
export function computeProductivity(
  result,
  {
    start = "",
    deadline = "",
    members = [],
    ignoreBots = true,
    largeCommitLines = CONFIG.LARGE_COMMIT_LINES,
    finalStretchDays = CONFIG.FINAL_STRETCH_DAYS,
    inactiveDays = CONFIG.INACTIVE_DAYS,
  } = {}
) {
  const detailed = Array.isArray(result?.commitRecords);
  const expected = new Set(members.map((m) => m.toLowerCase()));
  const rowsByKey = new Map();
  const groupHours = emptyHours();
  let lateTotal = 0;

  const rowFor = (contributor) => {
    let row = rowsByKey.get(contributor.key);
    if (!row) {
      row = emptyRow(contributor);
      rowsByKey.set(contributor.key, row);
    }
    return row;
  };
  for (const c of result?.contributors ?? []) rowFor(c);

  const inStart = (day) => !start || day >= start;
  const afterDeadline = (day) => Boolean(deadline) && day > deadline;

  /* ---------------- Coleta ---------------- */

  if (detailed) {
    for (const commit of result.commitRecords) {
      if (commit.isMerge) continue; // o merge repete o trabalho dos commits originais
      const parts = localParts(commit.authoredDate || commit.committedDate);
      if (!parts || !inStart(parts.day)) continue;
      const row = rowFor({
        key: commit.authorKey,
        username: commit.authorName,
        profileUrl: commit.profileUrl,
      });
      if (afterDeadline(parts.day)) {
        row.late += 1;
        lateTotal += 1;
        continue;
      }
      const changes = commit.additions + commit.deletions;
      const message = classifyMessage(commit.messageHeadline);
      row.commits += 1;
      row.additions += commit.additions;
      row.deletions += commit.deletions;
      row.changes += changes;
      row.hours ??= emptyHours();
      row.hours[parts.weekday][parts.hour] += 1;
      row.commitList ??= [];
      row.commitList.push({
        oid: commit.oid,
        day: parts.day,
        hour: parts.hour,
        headline: commit.messageHeadline,
        additions: commit.additions,
        deletions: commit.deletions,
        changes,
        generic: message.generic,
        upload: message.upload,
        branch: commit.inDefaultBranch ? null : commit.branch,
      });
    }
  } else {
    // Só a branch padrão: totais por semana (w = domingo, em segundos)
    for (const c of result?.contributors ?? []) {
      const row = rowFor(c);
      for (const week of c.weeks ?? []) {
        if (!week.c) continue;
        // Domingo + 1 = segunda-feira da semana "de trabalho"
        const day = addDays(new Date(week.w * 1000).toISOString().slice(0, 10), 1);
        if (!inStart(day)) continue;
        if (afterDeadline(day)) {
          row.late += week.c;
          lateTotal += week.c;
          continue;
        }
        row.commits += week.c;
        row.additions += week.a ?? 0;
        row.deletions += week.d ?? 0;
        row.changes += (week.a ?? 0) + (week.d ?? 0);
        row.weekly.set(day, (row.weekly.get(day) ?? 0) + week.c);
        if (!row.firstCommit || day < row.firstCommit) row.firstCommit = day;
        const end = addDays(day, 6);
        if (!row.lastCommit || end > row.lastCommit) row.lastCommit = end;
      }
    }
  }

  /* ---------------- Integrantes ---------------- */

  for (const key of expected) {
    if (!rowsByKey.has(key)) {
      const row = emptyRow({ key, username: key, profileUrl: `https://github.com/${key}` });
      row.missing = true;
      rowsByKey.set(key, row);
    }
  }

  const all = [...rowsByKey.values()];
  const isMember = (row) => {
    if (ignoreBots && row.isBot) return false;
    if (expected.size) return expected.has(row.key);
    return row.commits > 0 || row.late > 0;
  };
  const membersRows = all.filter(isMember);
  const others = all.filter((r) => !isMember(r) && (r.commits > 0 || r.late > 0));

  /* ---------------- Período ---------------- */

  let firstDay = null;
  let lastDay = null;
  for (const row of all) {
    if (row.commitList) {
      for (const c of row.commitList) {
        if (!firstDay || c.day < firstDay) firstDay = c.day;
        if (!lastDay || c.day > lastDay) lastDay = c.day;
      }
    } else if (row.firstCommit) {
      if (!firstDay || row.firstCommit < firstDay) firstDay = row.firstCommit;
      if (!lastDay || row.lastCommit > lastDay) lastDay = row.lastCommit;
    }
  }
  const periodStart = start || firstDay;
  // Fim do período: o prazo (se informado) ou o último commit
  const periodEnd = deadline || lastDay;
  const weeks = weeksBetween(periodStart, periodEnd);
  const stretchStart = deadline ? addDays(deadline, -(finalStretchDays - 1)) : null;

  /* ---------------- Indicadores por pessoa ---------------- */

  for (const row of all) {
    if (row.commitList) {
      row.commitList.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : b.hour - a.hour));
      const days = new Set(row.commitList.map((c) => c.day));
      for (const c of row.commitList) {
        const w = weekStart(c.day);
        row.weekly.set(w, (row.weekly.get(w) ?? 0) + 1);
      }
      row.activeDays = days.size;
      row.longestStreak = longestStreak(days);
      row.firstCommit = row.commitList.at(-1)?.day ?? null;
      row.lastCommit = row.commitList[0]?.day ?? null;
      row.medianChanges = median(row.commitList.map((c) => c.changes));
      row.largeCommits = row.commitList
        .filter((c) => c.changes >= largeCommitLines)
        .sort((a, b) => b.changes - a.changes);
      row.genericCount = row.commitList.filter((c) => c.generic).length;
      row.uploadCount = row.commitList.filter((c) => c.upload).length;
      row.finalStretch = stretchStart ? row.commitList.filter((c) => c.day >= stretchStart).length : null;
      row.hours.forEach((line, d) =>
        line.forEach((n, h) => {
          if (isMember(row)) groupHours[d][h] += n;
        })
      );
    } else if (detailed) {
      // Integrante sem commits no modo detalhado
      row.activeDays = 0;
      row.longestStreak = 0;
      row.medianChanges = 0;
      row.largeCommits = [];
      row.genericCount = 0;
      row.uploadCount = 0;
      row.finalStretch = stretchStart ? 0 : null;
      row.commitList = [];
      row.hours = emptyHours();
    }
    row.activeWeeks = [...row.weekly.values()].filter((n) => n > 0).length;
    if (row.lastCommit && periodEnd) {
      row.daysSinceLast = Math.max(0, daysBetween(row.lastCommit > periodEnd ? periodEnd : row.lastCommit, periodEnd));
    }
  }

  /* ---------------- Grupo ---------------- */

  const totalCommits = membersRows.reduce((s, r) => s + r.commits, 0);
  const totalChanges = membersRows.reduce((s, r) => s + r.changes, 0);
  for (const row of membersRows) {
    row.shareCommits = totalCommits ? row.commits / totalCommits : 0;
    row.shareChanges = totalChanges ? row.changes / totalChanges : 0;
  }

  const groupWeekly = new Map();
  for (const row of membersRows) {
    for (const [w, n] of row.weekly) groupWeekly.set(w, (groupWeekly.get(w) ?? 0) + n);
  }
  const activeWeeks = weeks.filter((w) => (groupWeekly.get(w) ?? 0) > 0).length;
  const sum = (field) =>
    detailed ? membersRows.reduce((s, r) => s + (r[field] === null ? 0 : Array.isArray(r[field]) ? r[field].length : r[field]), 0) : null;

  const group = {
    members: membersRows.length,
    commits: totalCommits,
    changes: totalChanges,
    fairShare: membersRows.length ? 1 / membersRows.length : 0,
    balanceCommits: 1 - gini(membersRows.map((r) => r.commits)),
    balanceChanges: 1 - gini(membersRows.map((r) => r.changes)),
    weeks: weeks.length,
    activeWeeks,
    weekly: groupWeekly,
    largeCommits: sum("largeCommits"),
    genericCount: sum("genericCount"),
    uploadCount: sum("uploadCount"),
    finalStretch: detailed && stretchStart ? sum("finalStretch") : null,
    late: membersRows.reduce((s, r) => s + r.late, 0),
    lateAll: lateTotal,
    hours: detailed ? groupHours : null,
  };

  // Ordem: posição no ranking; quem não está no ranking (sem commits) vai para o fim
  const byRank = (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity) || b.commits - a.commits;
  membersRows.sort(byRank);
  others.sort(byRank);

  const analysis = {
    detailed,
    options: { start, deadline, members, ignoreBots, largeCommitLines, finalStretchDays, inactiveDays },
    period: { start: periodStart, end: periodEnd, firstCommit: firstDay, lastCommit: lastDay, weeks, stretchStart },
    members: membersRows,
    others,
    group,
  };
  analysis.alerts = buildAlerts(analysis);
  return analysis;
}

/* =====================================================================
   Pontos de atenção
   ===================================================================== */

const pct = (v) => `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(v * 100)}%`;
const int = (n) => new Intl.NumberFormat("pt-BR").format(n);

/**
 * Gera a lista de alertas para o professor.
 * level: danger (exige atenção) | warning (verificar) | info (contexto)
 */
export function buildAlerts({ detailed, members, others, group, period, options }) {
  const alerts = [];
  const add = (level, who, title, detail) => alerts.push({ level, who, title, detail });
  const n = members.length;
  const fair = group.fairShare;

  for (const r of members) {
    if (r.missing || (r.commits === 0 && r.late === 0)) {
      add("danger", r.username, "Nenhum commit no período", "Integrante esperado que não aparece no histórico. Confira também se ele usa outro e-mail/conta.");
      continue;
    }
    if (n >= 2 && r.commits === 0 && r.late > 0) {
      add("danger", r.username, "Só fez commits depois do prazo", `${int(r.late)} commit(s) após ${formatDateBR(options.deadline)}.`);
      continue;
    }
    if (n >= 3 && r.shareCommits < fair * 0.5 && r.shareChanges < fair * 0.5) {
      add(
        "danger",
        r.username,
        "Participação baixa",
        `${pct(r.shareCommits)} dos commits e ${pct(r.shareChanges)} das linhas (o esperado seria ~${pct(fair)} para ${n} integrantes).`
      );
    }
    if (n >= 3 && (r.shareCommits > fair * 1.75 || r.shareChanges > fair * 2) && (r.shareCommits >= 0.35 || r.shareChanges >= 0.4)) {
      add(
        "warning",
        r.username,
        "Concentra boa parte do trabalho",
        `${pct(r.shareCommits)} dos commits e ${pct(r.shareChanges)} das linhas alteradas do grupo.`
      );
    }
    if (r.daysSinceLast !== null && r.daysSinceLast >= options.inactiveDays) {
      add(
        "warning",
        r.username,
        `Sem commits há ${int(r.daysSinceLast)} dias`,
        `Último commit em ${formatDateBR(r.lastCommit)} (fim do período: ${formatDateBR(period.end)}).`
      );
    }
    if (detailed) {
      if (r.finalStretch !== null && r.commits >= 4 && r.finalStretch / r.commits >= 0.5) {
        add(
          "warning",
          r.username,
          "Deixou para a reta final",
          `${pct(r.finalStretch / r.commits)} dos commits nos últimos ${options.finalStretchDays} dia(s) antes do prazo.`
        );
      }
      if (r.largeCommits.length && r.largeCommits[0].changes >= options.largeCommitLines) {
        const big = r.largeCommits[0];
        add(
          "warning",
          r.username,
          `${int(r.largeCommits.length)} commit(s) muito grande(s)`,
          `O maior tem ${int(big.changes)} linhas ("${big.headline}"). Pode ser trabalho acumulado, código copiado ou arquivos gerados — vale abrir o commit.`
        );
      }
      if (r.commits >= 4 && r.genericCount / r.commits >= 0.5) {
        add(
          "info",
          r.username,
          "Mensagens de commit pouco descritivas",
          `${pct(r.genericCount / r.commits)} das mensagens são genéricas ("update", "ajustes", "fix"…).`
        );
      }
      if (r.uploadCount) {
        add(
          "info",
          r.username,
          "Arquivos enviados pelo navegador",
          `${int(r.uploadCount)} commit(s) "Add files via upload": o aluno pode não estar usando o git.`
        );
      }
    }
    if (r.late > 0 && r.commits > 0) {
      add("info", r.username, `${int(r.late)} commit(s) após o prazo`, `Não entram nas métricas (prazo: ${formatDateBR(options.deadline)}).`);
    }
    if (r.unmerged) {
      add("info", r.username, `${int(r.unmerged)} commit(s) fora da branch padrão`, "Trabalho que ainda não foi integrado (mergeado) na branch principal.");
    }
    if (!r.profileUrl && !r.isBot) {
      add("info", r.username, "E-mail do commit sem conta do GitHub", "Pode ser um integrante commitando com outro e-mail. Peça para vincular o e-mail à conta.");
    }
  }

  for (const r of others) {
    if (r.isBot) continue;
    add("info", r.username, "Fora da lista de integrantes", `${int(r.commits)} commit(s) que não entram no equilíbrio do grupo.`);
  }

  if (n >= 2 && group.commits) {
    const { label } = balanceLabel(group.balanceCommits);
    if (label === "Concentrado") {
      add("danger", "Grupo", "Trabalho concentrado", `Equilíbrio de commits de ${pct(group.balanceCommits)} (Gini ${(1 - group.balanceCommits).toFixed(2)}).`);
    }
  }
  if (group.weeks >= 4 && group.activeWeeks / group.weeks < 0.5) {
    add("warning", "Grupo", "Muitas semanas sem atividade", `Commits em só ${int(group.activeWeeks)} de ${int(group.weeks)} semanas do período.`);
  }
  if (group.finalStretch !== null && group.commits >= 10 && group.finalStretch / group.commits >= 0.4) {
    add(
      "warning",
      "Grupo",
      "Grupo concentrou o trabalho perto do prazo",
      `${pct(group.finalStretch / group.commits)} dos commits nos últimos ${options.finalStretchDays} dia(s).`
    );
  }

  const order = { danger: 0, warning: 1, info: 2 };
  return alerts.sort((a, b) => order[a.level] - order[b.level]);
}

/* =====================================================================
   CSV
   ===================================================================== */

export const defaultProductivityCsvFilename = (repoName) => `produtividade_${repoName}.csv`;

export const PRODUCTIVITY_CSV_FIELDS = [
  "Nome de Usuário",
  "Commits",
  "% dos Commits",
  "Linhas Alteradas (Ins + Del)",
  "% das Linhas",
  "Dias Ativos",
  "Semanas Ativas",
  "Maior Sequência (dias)",
  "Mediana Linhas/Commit",
  "Commits Grandes",
  "Mensagens Genéricas",
  "Commits na Reta Final",
  "Commits Após o Prazo",
  "Commits Fora da Branch Padrão",
  "Primeiro Commit",
  "Último Commit",
  "Dias sem Commit (fim do período)",
  "Pontos de Atenção",
];

const dec = (v) => (v * 100).toFixed(1).replace(".", ",");
const opt = (v) => (v === null || v === undefined ? "" : Array.isArray(v) ? v.length : v);

export function buildProductivityCsv(analysis, delimiter = ";") {
  const rows = analysis?.members ?? [];
  if (!rows.length) throw new Error("Não há dados de produtividade para exportar.");
  const lines = [PRODUCTIVITY_CSV_FIELDS.map((f) => csvCell(f, delimiter)).join(delimiter)];
  for (const r of rows) {
    const alerts = analysis.alerts.filter((a) => a.who === r.username).map((a) => a.title);
    lines.push(
      [
        r.username,
        r.commits,
        dec(r.shareCommits),
        r.changes,
        dec(r.shareChanges),
        opt(r.activeDays),
        r.activeWeeks,
        opt(r.longestStreak),
        r.medianChanges === null ? "" : String(Math.round(r.medianChanges)),
        opt(r.largeCommits),
        opt(r.genericCount),
        opt(r.finalStretch),
        r.late,
        opt(r.unmerged),
        formatDateBR(r.firstCommit),
        formatDateBR(r.lastCommit),
        opt(r.daysSinceLast),
        alerts.join(" | "),
      ]
        .map((v) => csvCell(v, delimiter))
        .join(delimiter)
    );
  }
  return `${lines.join("\r\n")}\r\n`;
}

export function exportProductivityToCsv(analysis, filename) {
  return downloadCsv(buildProductivityCsv(analysis), filename);
}
