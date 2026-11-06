// Exportação do ranking para CSV.

export const CSV_FIELDS = [
  "Posição",
  "Nome de Usuário",
  "URL Perfil",
  "Commits Totais",
  "Linhas Inseridas",
  "Linhas Deletadas",
  "Impacto Líquido (Ins - Del)",
  "Último Commit",
  "Dias sem Commit (até hoje)",
  "Commits Fora da Branch Padrão",
  "Branches (não mergeadas)",
];

export const defaultCsvFilename = (repoName) => `ranking_contribuicao_${repoName}.csv`;

// Mesmas regras do módulo csv do Python: aspas só quando necessário
export function csvCell(value, delimiter = ";") {
  const text = String(value ?? "");
  if (text.includes(delimiter) || /["\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/**
 * Monta o CSV do ranking.
 * Usa ";" como separador (padrão do Excel em pt-BR) e quebra de linha \r\n.
 */
export function buildCsv(contributors, delimiter = ";") {
  if (!contributors?.length) throw new Error("Não há dados de ranking para exportar.");
  const lines = [CSV_FIELDS.map((f) => csvCell(f, delimiter)).join(delimiter)];
  for (const c of contributors) {
    const row = c.toRow();
    lines.push(CSV_FIELDS.map((f) => csvCell(row[f], delimiter)).join(delimiter));
  }
  return `${lines.join("\r\n")}\r\n`;
}

/**
 * Baixa o ranking como arquivo CSV.
 * O "\uFEFF" no início é o BOM do UTF-8 (utf-8-sig no Python): faz o Excel
 * exibir os acentos corretamente.
 */
export function exportToCsv(contributors, filename) {
  return downloadCsv(buildCsv(contributors), filename);
}

/** Baixa um texto CSV já montado (com o BOM do UTF-8 para o Excel). */
export function downloadCsv(csvText, filename) {
  const blob = new Blob(["\uFEFF", csvText], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return filename;
}
