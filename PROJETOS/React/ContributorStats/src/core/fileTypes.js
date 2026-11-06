// Abas "Tipos de arquivo por aluno" e "Tipos de arquivo por grupo": classifica
// os arquivos alterados em cada commit e agrega, por colaborador, quantas linhas
// foram modificadas em cada tipo.
//
//   • por aluno: o percentual é sobre o total do PRÓPRIO aluno
//     (ex.: fulano — 70% CSS (700 linhas) e 30% JavaScript (300 linhas));
//   • por grupo: o percentual é sobre o total do GRUPO (todos os colaboradores)
//     (ex.: o grupo alterou 1.000 linhas e fulano, 100 de JSON → 10% JSON).
//
// Este módulo não faz requisições: recebe os arquivos de cada commit (buscados
// por analyzeFileTypes, em service.js) e só calcula.
import { csvCell, downloadCsv } from "./exporter";

/* =====================================================================
   Classificação dos arquivos
   ===================================================================== */

// Extensão -> tipo. As cores seguem as do GitHub (linguist), para o gráfico
// ficar parecido com a barra de linguagens do repositório.
const TYPES = {
  JavaScript: { color: "#f1e05a", ext: ["js", "mjs", "cjs"] },
  "JavaScript (JSX)": { color: "#e0b100", ext: ["jsx"] },
  TypeScript: { color: "#3178c6", ext: ["ts", "mts", "cts"] },
  "TypeScript (TSX)": { color: "#1e4f8a", ext: ["tsx"] },
  HTML: { color: "#e34c26", ext: ["html", "htm", "xhtml"] },
  CSS: { color: "#663399", ext: ["css"] },
  SCSS: { color: "#c6538c", ext: ["scss", "sass"] },
  Less: { color: "#1d365d", ext: ["less"] },
  Vue: { color: "#41b883", ext: ["vue"] },
  Svelte: { color: "#ff3e00", ext: ["svelte"] },
  Java: { color: "#b07219", ext: ["java"] },
  Kotlin: { color: "#a97bff", ext: ["kt", "kts"] },
  Python: { color: "#3572a5", ext: ["py", "pyw", "ipynb"] },
  "C#": { color: "#178600", ext: ["cs", "cshtml", "razor"] },
  C: { color: "#555555", ext: ["c", "h"] },
  "C++": { color: "#f34b7d", ext: ["cpp", "cc", "cxx", "hpp", "hh", "hxx"] },
  Go: { color: "#00add8", ext: ["go"] },
  Rust: { color: "#dea584", ext: ["rs"] },
  PHP: { color: "#4f5d95", ext: ["php"] },
  Ruby: { color: "#701516", ext: ["rb", "erb"] },
  Dart: { color: "#00b4ab", ext: ["dart"] },
  Swift: { color: "#f05138", ext: ["swift"] },
  SQL: { color: "#e38c00", ext: ["sql"] },
  Shell: { color: "#89e051", ext: ["sh", "bash", "zsh", "bat", "cmd", "ps1"] },
  JSON: { color: "#292929", ext: ["json", "jsonc", "json5"] },
  YAML: { color: "#cb171e", ext: ["yml", "yaml"] },
  XML: { color: "#0060ac", ext: ["xml", "xsd", "xsl", "plist"] },
  Markdown: { color: "#083fa1", ext: ["md", "mdx", "markdown"] },
  Texto: { color: "#9aa5b1", ext: ["txt", "csv", "tsv", "log", "rst"] },
  Configuração: {
    color: "#6e7781",
    ext: ["env", "ini", "toml", "cfg", "conf", "properties", "gradle", "editorconfig"],
  },
  Imagens: { color: "#a3b86c", ext: ["png", "jpg", "jpeg", "gif", "svg", "webp", "ico", "bmp", "avif"] },
  Outros: { color: "#c3ccd6", ext: [] },
};

const EXT_TO_TYPE = new Map(
  Object.entries(TYPES).flatMap(([type, { ext }]) => ext.map((e) => [e, type]))
);

// Arquivos sem extensão (ou com nome especial) reconhecidos pelo nome
const NAME_TO_TYPE = {
  dockerfile: "Configuração",
  makefile: "Configuração",
  procfile: "Configuração",
  ".gitignore": "Configuração",
  ".gitattributes": "Configuração",
  ".npmrc": "Configuração",
  ".nvmrc": "Configuração",
  ".prettierrc": "Configuração",
  ".eslintrc": "Configuração",
  ".babelrc": "Configuração",
  license: "Texto",
  readme: "Markdown",
};

// Arquivos gerados automaticamente: costumam ter milhares de linhas e
// distorcem a análise (não foram escritos pelo aluno).
const GENERATED_NAMES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
  "composer.lock",
  "gemfile.lock",
  "poetry.lock",
  "pipfile.lock",
  "cargo.lock",
  "go.sum",
  ".ds_store",
  "thumbs.db",
]);
const GENERATED_DIRS = [
  "node_modules",
  "dist",
  "build",
  "out",
  "target",
  "bin",
  "obj",
  "vendor",
  "coverage",
  ".next",
  ".nuxt",
  ".vercel",
  ".idea",
  ".vscode",
  "__pycache__",
  ".venv",
  "venv",
];
const GENERATED_RE = /\.(min\.(js|css)|map|lock)$/i;

/**
 * Classifica um caminho de arquivo.
 * classifyFile("src/App.jsx") -> { type: "JavaScript (JSX)", generated: false }
 */
export function classifyFile(path) {
  const parts = String(path).toLowerCase().split("/");
  const name = parts[parts.length - 1];
  const dirs = parts.slice(0, -1);

  const generated =
    GENERATED_NAMES.has(name) ||
    GENERATED_RE.test(name) ||
    dirs.some((d) => GENERATED_DIRS.includes(d));

  // 1) nome exato · 2) extensão · 3) nome-base (ex.: "Dockerfile.dev", "README.pt")
  let type = NAME_TO_TYPE[name];
  // ".env.local" / ".env.example" também são configuração
  if (!type && name.startsWith(".env")) type = "Configuração";
  if (!type) {
    const dot = name.lastIndexOf(".");
    if (dot >= 0 && dot < name.length - 1) type = EXT_TO_TYPE.get(name.slice(dot + 1));
  }
  if (!type) type = NAME_TO_TYPE[name.split(".")[0]];
  return { type: type ?? "Outros", generated };
}

export const typeColor = (type) => TYPES[type]?.color ?? TYPES.Outros.color;

/* =====================================================================
   Métricas
   ===================================================================== */

/** Métrica usada nos percentuais (selecionável na tela). */
export const FILE_TYPE_METRICS = [
  {
    value: "changes",
    label: "Linhas alteradas (inseridas + deletadas)",
    short: "linhas alteradas",
  },
  { value: "additions", label: "Linhas inseridas", short: "linhas inseridas" },
  { value: "deletions", label: "Linhas deletadas", short: "linhas deletadas" },
];

const emptyStats = () => ({ additions: 0, deletions: 0, changes: 0, files: new Set(), commits: 0 });

function addTo(stats, path, additions, deletions) {
  stats.additions += additions;
  stats.deletions += deletions;
  stats.changes += additions + deletions;
  stats.files.add(path);
}

// Map(tipo -> stats) em lista ordenada, com o percentual de cada tipo
function toTypeList(byType, metric) {
  const total = [...byType.values()].reduce((sum, s) => sum + s[metric], 0);
  return [...byType.entries()]
    .map(([type, s]) => ({
      type,
      color: typeColor(type),
      additions: s.additions,
      deletions: s.deletions,
      changes: s.changes,
      files: s.files.size,
      value: s[metric],
      share: total ? s[metric] / total : 0,
    }))
    .filter((t) => t.value > 0 || t.files > 0)
    .sort((a, b) => b.value - a.value || b.files - a.files || a.type.localeCompare(b.type));
}

/**
 * Agrega os arquivos dos commits por colaborador e por tipo.
 *
 * @param analysis      resultado de analyzeFileTypes ({ commits: [{ oid, authorKey, files }] })
 * @param contributors  colaboradores do ranking (na ordem do ranking)
 * @param options.metric          "changes" | "additions" | "deletions"
 * @param options.ignoreGenerated ignora lockfiles, node_modules/, dist/, *.min.js...
 */
export function aggregateFileTypes(analysis, contributors, { metric = "changes", ignoreGenerated = true } = {}) {
  const repoTypes = new Map();
  const byKey = new Map(); // authorKey -> { types: Map, commits }
  let ignoredLines = 0;
  let ignoredFiles = 0;

  for (const commit of analysis?.commits ?? []) {
    let entry = byKey.get(commit.authorKey);
    if (!entry) {
      entry = { types: new Map(), commits: 0 };
      byKey.set(commit.authorKey, entry);
    }
    entry.commits += 1;

    for (const [path, additions, deletions] of commit.files) {
      const { type, generated } = classifyFile(path);
      if (generated && ignoreGenerated) {
        ignoredLines += additions + deletions;
        ignoredFiles += 1;
        continue;
      }
      if (!entry.types.has(type)) entry.types.set(type, emptyStats());
      if (!repoTypes.has(type)) repoTypes.set(type, emptyStats());
      addTo(entry.types.get(type), path, additions, deletions);
      addTo(repoTypes.get(type), path, additions, deletions);
    }
  }

  const summarize = (types) => {
    const list = toTypeList(types, metric);
    return {
      types: list,
      additions: list.reduce((s, t) => s + t.additions, 0),
      deletions: list.reduce((s, t) => s + t.deletions, 0),
      changes: list.reduce((s, t) => s + t.changes, 0),
      value: list.reduce((s, t) => s + t.value, 0),
    };
  };

  // Mantém a ordem do ranking; autores que não estão no ranking vão para o fim
  const known = new Set();
  const rows = [];
  for (const c of contributors ?? []) {
    known.add(c.key);
    const entry = byKey.get(c.key);
    rows.push({
      contributor: c,
      commits: entry?.commits ?? 0,
      ...summarize(entry?.types ?? new Map()),
    });
  }
  for (const [key, entry] of byKey) {
    if (known.has(key)) continue;
    rows.push({
      contributor: { username: key, key, profileUrl: "", rank: null },
      commits: entry.commits,
      ...summarize(entry.types),
    });
  }

  return {
    metric,
    repo: summarize(repoTypes),
    contributors: rows,
    ignoredLines,
    ignoredFiles,
  };
}

/* =====================================================================
   Texto e CSV
   ===================================================================== */

/**
 * Contexto do grupo: refaz os percentuais de aggregateFileTypes tomando como
 * 100% o total do repositório (todos os colaboradores), e não o total de cada um.
 *
 * Se o grupo alterou 1.000 linhas e fulano alterou 100 linhas de JSON, o JSON
 * de fulano vale 10% do código do grupo.
 *
 * Em cada colaborador:
 *   groupShare        → parte do código do grupo feita por ele (soma dos tipos)
 *   types[].share     → parte do código do grupo naquele tipo (o que a barra mostra)
 *   types[].ownShare  → percentual dentro do próprio total (o da aba "por aluno")
 *   types[].typeShare → parte do tipo feita por ele (ex.: 82% de todo o CSS do grupo)
 *
 * `types` (por tipo) lista quem fez cada tipo de arquivo, do maior para o menor.
 */
export function groupFileTypes(aggregate) {
  const total = aggregate?.repo.value ?? 0;
  const typeTotals = new Map((aggregate?.repo.types ?? []).map((t) => [t.type, t.value]));
  const ofTotal = (value) => (total ? value / total : 0);

  const contributors = (aggregate?.contributors ?? []).map((row) => ({
    ...row,
    groupShare: ofTotal(row.value),
    types: row.types.map((t) => {
      const typeTotal = typeTotals.get(t.type) ?? 0;
      return {
        ...t,
        ownShare: t.share,
        share: ofTotal(t.value),
        typeShare: typeTotal ? t.value / typeTotal : 0,
      };
    }),
  }));

  const types = (aggregate?.repo.types ?? [])
    .filter((t) => t.value > 0)
    .map((t) => ({
      ...t,
      contributors: contributors
        .map((row) => {
          const own = row.types.find((x) => x.type === t.type);
          return own?.value ? { contributor: row.contributor, value: own.value, share: own.typeShare } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.value - a.value),
    }));

  return {
    metric: aggregate?.metric,
    total,
    repo: aggregate?.repo,
    contributors,
    types,
    ignoredLines: aggregate?.ignoredLines ?? 0,
    ignoredFiles: aggregate?.ignoredFiles ?? 0,
  };
}

/**
 * Frase-resumo de quem fez um tipo de arquivo:
 * "aluno1 82% · aluno2 12% · aluno4 6%". Os demais são somados em "outros".
 */
export function describeTypeOwners(owners, limit = 3) {
  if (!owners.length) return "";
  const head = owners.slice(0, limit).map((o) => `${o.contributor.username} ${pct(o.share)}`);
  const rest = owners.slice(limit);
  if (rest.length) {
    head.push(`${pct(rest.reduce((s, o) => s + o.share, 0))} em ${rest.length} outro(s)`);
  }
  return head.join(" · ");
}



const pct = (share) =>
  `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(share * 100)}%`;
const int = (n) => new Intl.NumberFormat("pt-BR").format(n);

/**
 * Frase-resumo: "70% CSS (700 linhas) · 30% JavaScript (300 linhas)".
 * Tipos além de `limit` são somados em "outros".
 */
export function describeShares(types, limit = 4) {
  const visible = types.filter((t) => t.value > 0);
  if (!visible.length) return "Nenhuma linha alterada.";
  const head = visible.slice(0, limit).map((t) => `${pct(t.share)} ${t.type} (${int(t.value)} linhas)`);
  const rest = visible.slice(limit);
  if (rest.length) {
    const share = rest.reduce((s, t) => s + t.share, 0);
    const value = rest.reduce((s, t) => s + t.value, 0);
    head.push(`${pct(share)} em ${rest.length} outro(s) tipo(s) (${int(value)} linhas)`);
  }
  return head.join(" · ");
}

export const defaultFileTypeCsvFilename = (repoName) => `tipos_de_arquivo_${repoName}.csv`;

export const FILE_TYPE_CSV_FIELDS = [
  "Posição",
  "Nome de Usuário",
  "Tipo de Arquivo",
  "Linhas Inseridas",
  "Linhas Deletadas",
  "Linhas Alteradas (Ins + Del)",
  "Arquivos",
  "Percentual (%)",
];

/** Uma linha por colaborador × tipo de arquivo. */
export function buildFileTypeCsv(aggregate, delimiter = ";") {
  const rows = aggregate?.contributors.filter((r) => r.types.length) ?? [];
  if (!rows.length) throw new Error("Não há dados de tipos de arquivo para exportar.");
  const lines = [FILE_TYPE_CSV_FIELDS.map((f) => csvCell(f, delimiter)).join(delimiter)];
  for (const row of rows) {
    for (const t of row.types) {
      lines.push(
        [
          row.contributor.rank ?? "",
          row.contributor.username,
          t.type,
          t.additions,
          t.deletions,
          t.changes,
          t.files,
          (t.share * 100).toFixed(1).replace(".", ","),
        ]
          .map((v) => csvCell(v, delimiter))
          .join(delimiter)
      );
    }
  }
  return `${lines.join("\r\n")}\r\n`;
}

export function exportFileTypesToCsv(aggregate, filename) {
  return downloadCsv(buildFileTypeCsv(aggregate), filename);
}

/* ---------------- CSV da aba "por grupo" ---------------- */

export const defaultGroupFileTypeCsvFilename = (repoName) => `tipos_de_arquivo_grupo_${repoName}.csv`;

export const GROUP_FILE_TYPE_CSV_FIELDS = [
  "Posição",
  "Nome de Usuário",
  "Tipo de Arquivo",
  "Linhas Inseridas",
  "Linhas Deletadas",
  "Linhas Alteradas (Ins + Del)",
  "Arquivos",
  "% do Código do Grupo",
  "% do Tipo no Grupo",
  "% do Total do Aluno",
];

const pctCell = (share) => (share * 100).toFixed(1).replace(".", ",");

/** Uma linha por colaborador × tipo, com os percentuais sobre o total do grupo. */
export function buildGroupFileTypeCsv(group, delimiter = ";") {
  const rows = group?.contributors.filter((r) => r.types.length) ?? [];
  if (!rows.length) throw new Error("Não há dados de tipos de arquivo para exportar.");
  const lines = [GROUP_FILE_TYPE_CSV_FIELDS.map((f) => csvCell(f, delimiter)).join(delimiter)];
  for (const row of rows) {
    for (const t of row.types) {
      lines.push(
        [
          row.contributor.rank ?? "",
          row.contributor.username,
          t.type,
          t.additions,
          t.deletions,
          t.changes,
          t.files,
          pctCell(t.share),
          pctCell(t.typeShare),
          pctCell(t.ownShare),
        ]
          .map((v) => csvCell(v, delimiter))
          .join(delimiter)
      );
    }
  }
  return `${lines.join("\r\n")}\r\n`;
}

export function exportGroupFileTypesToCsv(group, filename) {
  return downloadCsv(buildGroupFileTypeCsv(group), filename);
}
