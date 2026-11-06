import { Fragment, useMemo, useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiDownload,
  FiExternalLink,
  FiGitBranch,
  FiHelpCircle,
  FiSearch,
} from "react-icons/fi";
import CONFIG from "../../config/contributorStatsConfig";
import { todayISO } from "../../core";
import { formatInt } from "./format";
import "./ContributorStats.css";

// Colunas da tabela: id -> título, alinhamento e valor usado na ordenação
const COLUMNS = [
  { id: "rank", title: "#", align: "center", value: (c) => c.rank },
  { id: "user", title: "Usuário", align: "left", value: (c) => c.username.toLowerCase() },
  { id: "commits", title: "Commits", align: "right", value: (c) => c.commits },
  { id: "add", title: "Inseridas", align: "right", value: (c) => c.additions },
  { id: "del", title: "Deletadas", align: "right", value: (c) => c.deletions },
  { id: "net", title: "Impacto líquido", align: "right", value: (c) => c.netImpact },
  { id: "last", title: "Último commit", align: "center", value: (c) => c.lastCommit ?? "" },
  {
    id: "idle",
    title: "Dias sem commit",
    align: "right",
    // Sem data conhecida vai para o fim (como se fossem “mais dias”)
    value: (c) => c.daysWithoutCommit() ?? Number.MAX_SAFE_INTEGER,
    help:
      "Dias corridos desde o último commit da pessoa até hoje. " +
      `Em destaque a partir de ${CONFIG.INACTIVE_DAYS} dias. Com “~”, a data do último commit é aproximada.`,
  },
  {
    id: "unmerged",
    title: "Fora da padrão",
    align: "right",
    value: (c) => c.unmergedCommits ?? 0,
    help:
      "Commits da pessoa que estão só em outras branches e ainda não chegaram à branch padrão " +
      "(normalmente a main): o trabalho existe, mas não foi mergeado. Só é calculado com " +
      "“Considerar todas as branches” marcado; clique no ícone de branch da linha para ver quais.",
  },
];

/** Interrogação com explicação ao passar o mouse (ou ao focar com o teclado). */
function HelpTip({ id, text }) {
  return (
    <span className="cs-help" tabIndex={0} aria-describedby={id} onClick={(e) => e.stopPropagation()}>
      <FiHelpCircle aria-hidden="true" />
      <span className="cs-help-text" role="tooltip" id={id}>
        {text}
      </span>
    </span>
  );
}

/** Texto do "Ver branches não mergeadas" (o menu de contexto do Python). */
function branchesText(c) {
  if (c.unmergedCommits === null) {
    return 'Ative "Considerar todas as branches" e analise novamente.';
  }
  if (!c.branches.length) return "Todos os commits deste colaborador estão na branch padrão.";
  return `${c.unmergedCommits} commit(s) fora da branch padrão, em:`;
}

/**
 * Tabela do ranking: filtro por usuário, ordenação ao clicar no cabeçalho,
 * destaque do Top 3, link para o perfil, copiar usuário e ver branches.
 */
export default function RankingTable({ result, onExport, onCopied }) {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState(null); // { col, desc }
  const [openRow, setOpenRow] = useState(null);
  const [lastResult, setLastResult] = useState(result);

  // Novo resultado (nova análise ou novo critério): volta para a ordem do ranking
  if (result !== lastResult) {
    setLastResult(result);
    setSort(null);
    setOpenRow(null);
  }

  const today = todayISO();

  const rows = useMemo(() => {
    let items = [...(result?.contributors ?? [])];
    const term = filter.trim().toLowerCase();
    if (term) items = items.filter((c) => c.username.toLowerCase().includes(term));
    if (sort) {
      const { value } = COLUMNS.find((col) => col.id === sort.col);
      items.sort((a, b) => {
        const x = value(a);
        const y = value(b);
        const cmp = x < y ? -1 : x > y ? 1 : 0;
        return sort.desc ? -cmp : cmp;
      });
    }
    return items;
  }, [result, filter, sort]);

  const sortBy = (col) =>
    setSort((current) =>
      current?.col === col
        ? { col, desc: !current.desc }
        : // Texto começa crescente; números começam decrescente
          { col, desc: !["user", "rank"].includes(col) }
    );

  const copyUsername = async (c) => {
    try {
      await navigator.clipboard.writeText(c.username);
      onCopied?.(`'${c.username}' copiado para a área de transferência.`);
    } catch {
      onCopied?.("Não foi possível copiar (permissão da área de transferência).");
    }
  };

  const openProfile = (c) => c.profileUrl && window.open(c.profileUrl, "_blank", "noopener");

  return (
    <section className="cs-card">
      <div className="cs-card-head">
        <div>
          <h3>Ranking de colaboradores</h3>
          <p className="cs-card-note">
            {result ? `${result.fullName} · ${result.scopeLabel}` : "Nenhum repositório analisado"}
          </p>
        </div>
        <div className="cs-table-tools">
          <div className="cs-input-icon cs-filter">
            <FiSearch aria-hidden="true" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrar usuário"
              aria-label="Filtrar usuário"
              disabled={!result}
            />
          </div>
          <button
            type="button"
            className="cs-button cs-button-small"
            onClick={onExport}
            disabled={!result?.contributors.length}
            title="Exportar CSV (Ctrl+E / Cmd+E)"
          >
            <FiDownload aria-hidden="true" /> Exportar CSV
          </button>
        </div>
      </div>

      <div className="cs-table-scroll">
        <table className="cs-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.id} className={`is-${col.align}`} aria-sort={
                  sort?.col === col.id ? (sort.desc ? "descending" : "ascending") : undefined
                }>
                  <span className="cs-th-inner">
                    <button type="button" onClick={() => sortBy(col.id)}>
                      {col.title}
                      {sort?.col === col.id && (sort.desc ? <FiChevronDown /> : <FiChevronUp />)}
                    </button>
                    {col.help && <HelpTip id={`cs-help-${col.id}`} text={col.help} />}
                  </span>
                </th>
              ))}
              <th className="is-center cs-th-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {!rows.length && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="cs-empty">
                  {result
                    ? result.contributors.length
                      ? "Nenhum usuário corresponde ao filtro."
                      : "Nenhum colaborador encontrado."
                    : "Os dados aparecerão aqui após a análise."}
                </td>
              </tr>
            )}
            {rows.map((c) => {
              const open = openRow === c.rank;
              return (
                <Fragment key={c.rank}>
                  <tr
                    className={c.rank <= 3 ? `is-top is-top-${c.rank}` : undefined}
                    onDoubleClick={() => openProfile(c)}
                    title={c.profileUrl ? "Duplo clique abre o perfil no GitHub" : undefined}
                  >
                    <td className="is-center">
                      <span className="cs-rank">{c.rank}º</span>
                    </td>
                    <td className="cs-user">
                      {c.profileUrl ? (
                        <a href={c.profileUrl} target="_blank" rel="noreferrer">
                          {c.username}
                        </a>
                      ) : (
                        <span title="sem perfil vinculado">{c.username}</span>
                      )}
                    </td>
                    <td className="is-right">{formatInt(c.commits)}</td>
                    <td className="is-right cs-pos">{formatInt(c.additions)}</td>
                    <td className="is-right cs-neg">{formatInt(c.deletions)}</td>
                    <td className={`is-right ${c.netImpact >= 0 ? "cs-pos" : "cs-neg"}`}>
                      {formatInt(c.netImpact, true)}
                    </td>
                    <td className="is-center">{c.lastCommitDisplay}</td>
                    <td
                      className={`is-right${
                        (c.daysWithoutCommit(today) ?? 0) >= CONFIG.INACTIVE_DAYS ? " cs-idle-warn" : ""
                      }`}
                    >
                      {c.daysWithoutCommitDisplay(today)}
                    </td>
                    <td className="is-right">
                      {c.unmergedCommits === null ? "–" : formatInt(c.unmergedCommits)}
                    </td>
                    <td className="is-center cs-row-actions">
                      <button
                        type="button"
                        onClick={() => setOpenRow(open ? null : c.rank)}
                        title="Ver branches não mergeadas"
                        aria-expanded={open}
                        className={open ? "is-active" : undefined}
                      >
                        <FiGitBranch aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => copyUsername(c)} title="Copiar nome de usuário">
                        <FiCopy aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openProfile(c)}
                        title="Abrir perfil no GitHub"
                        disabled={!c.profileUrl}
                      >
                        <FiExternalLink aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr className="cs-branches-row">
                      <td colSpan={COLUMNS.length + 1}>
                        <strong>Branches de {c.username}:</strong> {branchesText(c)}
                        {c.branches.length > 0 && (
                          <ul className="cs-branch-list">
                            {c.branches.map((b) => (
                              <li key={b}>
                                <FiGitBranch aria-hidden="true" /> {b}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="cs-card-note cs-tip">
        Dica: clique no cabeçalho para ordenar · passe o mouse no “?” para ver o que a coluna
        significa · duplo clique abre o perfil no GitHub · o ícone de branch mostra os commits
        ainda não mergeados
      </p>
    </section>
  );
}
