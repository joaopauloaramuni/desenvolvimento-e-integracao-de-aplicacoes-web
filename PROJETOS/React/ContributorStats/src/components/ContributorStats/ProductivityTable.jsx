import { Fragment, useMemo, useState } from "react";
import { FiChevronDown, FiChevronUp, FiExternalLink, FiGitBranch, FiUser } from "react-icons/fi";
import { formatDateBR, WEEKDAYS } from "../../core";
import { formatDayMonth, formatInt, formatPercent } from "./format";
import "./ContributorStats.css";

const dash = "–";
const opt = (v, fmt = formatInt) => (v === null || v === undefined ? dash : fmt(v));

// Colunas: id -> título, dica e valor usado na ordenação
const COLUMNS = [
  { id: "user", title: "Integrante", align: "left", value: (r) => r.username.toLowerCase() },
  { id: "commits", title: "Commits", hint: "Commits no período (% do grupo)", value: (r) => r.commits },
  { id: "changes", title: "Linhas alteradas", hint: "Inseridas + deletadas (% do grupo)", value: (r) => r.changes },
  { id: "days", title: "Dias ativos", hint: "Dias distintos com commit", value: (r) => r.activeDays ?? -1 },
  { id: "median", title: "Linhas / commit", hint: "Mediana de linhas alteradas por commit", value: (r) => r.medianChanges ?? -1 },
  { id: "large", title: "Commits grandes", hint: "Commits muito grandes (ver configuração)", value: (r) => r.largeCommits?.length ?? -1 },
  { id: "generic", title: "Msgs genéricas", hint: "Mensagens como “update”, “ajustes”, “fix”", value: (r) => r.genericCount ?? -1 },
  { id: "stretch", title: "Reta final", hint: "Commits nos últimos dias antes do prazo", value: (r) => r.finalStretch ?? -1 },
  { id: "late", title: "Após prazo", hint: "Commits depois do prazo (fora das métricas)", value: (r) => r.late },
  { id: "last", title: "Último commit", hint: "Dias sem commit até o fim do período", align: "center", value: (r) => r.lastCommit ?? "" },
];

/** Hora mais frequente de commits ("Qua 20h"). */
function peakHour(hours) {
  let best = null;
  hours?.forEach((line, d) =>
    line.forEach((n, h) => {
      if (n && (!best || n > best.n)) best = { d, h, n };
    })
  );
  return best ? `${WEEKDAYS[best.d]} ${best.h}h` : dash;
}

/** Uma linha da lista de commits da ficha (data, mensagem com link e linhas). */
function CommitItem({ c, url }) {
  return (
    <li>
      <span className="cs-commit-date">{formatDayMonth(c.day)}</span>
      <a href={url} target="_blank" rel="noreferrer" className="cs-commit-msg" title={c.headline}>
        {c.headline || "(sem mensagem)"}
      </a>
      {c.generic && <span className="cs-tag is-warning">genérica</span>}
      <span className="cs-commit-lines">
        <span className="cs-pos">+{formatInt(c.additions)}</span>{" "}
        <span className="cs-neg">−{formatInt(c.deletions)}</span>
      </span>
    </li>
  );
}

/** Ficha do aluno: commits recentes, maiores commits e resumo. */
function StudentCard({ row, result, analysis }) {
  const commitUrl = (oid) => `https://github.com/${result.owner}/${result.repo}/commit/${oid}`;
  const recent = row.commitList?.slice(0, 6) ?? [];
  const biggest = row.commitList ? [...row.commitList].sort((a, b) => b.changes - a.changes).slice(0, 4) : [];
  const branches = [...new Set((row.commitList ?? []).filter((c) => c.branch).map((c) => c.branch))];

  return (
    <div className="cs-student">
      <dl className="cs-student-facts">
        <div>
          <dt>Primeiro commit</dt>
          <dd>{row.firstCommit ? formatDateBR(row.firstCommit) : dash}</dd>
        </div>
        <div>
          <dt>Último commit</dt>
          <dd>{row.lastCommit ? formatDateBR(row.lastCommit) : dash}</dd>
        </div>
        <div>
          <dt>Semanas ativas</dt>
          <dd>
            {formatInt(row.activeWeeks)} de {formatInt(analysis.period.weeks.length)}
          </dd>
        </div>
        <div>
          <dt>Maior sequência</dt>
          <dd>{opt(row.longestStreak, (v) => `${formatInt(v)} dia(s) seguidos`)}</dd>
        </div>
        <div>
          <dt>Horário mais frequente</dt>
          <dd>{analysis.detailed ? peakHour(row.hours) : dash}</dd>
        </div>
        <div>
          <dt>Linhas inseridas / deletadas</dt>
          <dd>
            <span className="cs-pos">+{formatInt(row.additions)}</span> /{" "}
            <span className="cs-neg">−{formatInt(row.deletions)}</span>
          </dd>
        </div>
        <div>
          <dt>Commits fora da padrão</dt>
          <dd>{opt(row.unmerged)}</dd>
        </div>
        <div>
          <dt>Enviados pelo navegador</dt>
          <dd>{opt(row.uploadCount)}</dd>
        </div>
      </dl>

      {branches.length > 0 && (
        <p className="cs-student-branches">
          <FiGitBranch aria-hidden="true" /> Branches não mergeadas: {branches.join(", ")}
        </p>
      )}

      {analysis.detailed ? (
        <div className="cs-student-cols">
          <div>
            <h4>Commits mais recentes</h4>
            {recent.length ? (
              <ul className="cs-commits">
                {recent.map((c) => (
                  <CommitItem key={c.oid} c={c} url={commitUrl(c.oid)} />
                ))}
              </ul>
            ) : (
              <p className="cs-card-note">Nenhum commit no período.</p>
            )}
          </div>
          <div>
            <h4>Maiores commits</h4>
            {biggest.length ? (
              <ul className="cs-commits">
                {biggest.map((c) => (
                  <CommitItem key={c.oid} c={c} url={commitUrl(c.oid)} />
                ))}
              </ul>
            ) : (
              <p className="cs-card-note">Nenhum commit no período.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="cs-card-note">A lista de commits aparece quando a análise considera todas as branches.</p>
      )}
    </div>
  );
}

/**
 * Indicadores por integrante, com a "ficha do aluno" ao expandir a linha.
 */
export default function ProductivityTable({ analysis, result }) {
  const [sort, setSort] = useState(null); // { col, desc }
  const [open, setOpen] = useState(null);
  const { members, others } = analysis;

  const rows = useMemo(() => {
    const items = [...members, ...others];
    if (!sort) return items;
    const { value } = COLUMNS.find((c) => c.id === sort.col);
    return items.sort((a, b) => {
      const x = value(a);
      const y = value(b);
      const cmp = x < y ? -1 : x > y ? 1 : 0;
      return sort.desc ? -cmp : cmp;
    });
  }, [members, others, sort]);

  const sortBy = (col) =>
    setSort((current) =>
      current?.col === col ? { col, desc: !current.desc } : { col, desc: col !== "user" }
    );

  const memberKeys = new Set(members.map((m) => m.key));

  return (
    <section className="cs-card">
      <div className="cs-card-head">
        <div>
          <h3>Indicadores por integrante</h3>
          <p className="cs-card-note">
            Clique na seta para abrir a ficha do aluno (commits recentes, maiores commits e horários)
          </p>
        </div>
      </div>

      <div className="cs-table-scroll">
        <table className="cs-table cs-prod-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.id}
                  className={`is-${col.align ?? "right"}`}
                  title={col.hint}
                  aria-sort={sort?.col === col.id ? (sort.desc ? "descending" : "ascending") : undefined}
                >
                  <button type="button" onClick={() => sortBy(col.id)}>
                    {col.title}
                    {sort?.col === col.id && (sort.desc ? <FiChevronDown /> : <FiChevronUp />)}
                  </button>
                </th>
              ))}
              <th className="is-center">Ficha</th>
            </tr>
          </thead>
          <tbody>
            {!rows.length && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="cs-empty">
                  Nenhum commit no período.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const isOpen = open === r.key;
              const outside = !memberKeys.has(r.key);
              return (
                <Fragment key={r.key}>
                  <tr className={r.missing ? "is-missing" : outside ? "is-outside" : undefined}>
                    <td className="cs-user">
                      {r.profileUrl ? (
                        <a href={r.profileUrl} target="_blank" rel="noreferrer">
                          {r.username}
                        </a>
                      ) : (
                        <span title="sem perfil vinculado">{r.username}</span>
                      )}
                      {r.missing && <span className="cs-tag is-danger">sem commits</span>}
                      {outside && <span className="cs-tag">{r.isBot ? "bot" : "fora da lista"}</span>}
                    </td>
                    <td className="is-right">
                      {formatInt(r.commits)}
                      {!outside && <span className="cs-share">{formatPercent(r.shareCommits, 0)}</span>}
                    </td>
                    <td className="is-right">
                      {formatInt(r.changes)}
                      {!outside && <span className="cs-share">{formatPercent(r.shareChanges, 0)}</span>}
                    </td>
                    <td className="is-right">{opt(r.activeDays)}</td>
                    <td className="is-right">{opt(r.medianChanges, (v) => formatInt(Math.round(v)))}</td>
                    <td className={`is-right${r.largeCommits?.length ? " cs-warn" : ""}`}>
                      {opt(r.largeCommits?.length ?? null)}
                    </td>
                    <td
                      className={`is-right${r.genericCount && r.commits && r.genericCount / r.commits >= 0.5 ? " cs-warn" : ""}`}
                    >
                      {r.genericCount === null
                        ? dash
                        : `${formatInt(r.genericCount)}${r.commits ? ` (${formatPercent(r.genericCount / r.commits, 0)})` : ""}`}
                    </td>
                    <td
                      className={`is-right${r.finalStretch && r.commits >= 4 && r.finalStretch / r.commits >= 0.5 ? " cs-warn" : ""}`}
                    >
                      {opt(r.finalStretch)}
                    </td>
                    <td className={`is-right${r.late ? " cs-neg" : ""}`}>{formatInt(r.late)}</td>
                    <td className="is-center">
                      {r.lastCommit ? formatDateBR(r.lastCommit) : dash}
                      {r.daysSinceLast !== null && r.daysSinceLast > 0 && (
                        <span
                          className={`cs-share is-block${r.daysSinceLast >= analysis.options.inactiveDays ? " cs-neg" : ""}`}
                        >
                          há {formatInt(r.daysSinceLast)} d
                        </span>
                      )}
                    </td>
                    <td className="is-center cs-row-actions">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : r.key)}
                        title="Ficha do aluno"
                        aria-expanded={isOpen}
                        className={isOpen ? "is-active" : undefined}
                        disabled={r.missing}
                      >
                        <FiUser aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => r.profileUrl && window.open(r.profileUrl, "_blank", "noopener")}
                        title="Abrir perfil no GitHub"
                        disabled={!r.profileUrl}
                      >
                        <FiExternalLink aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="cs-branches-row">
                      <td colSpan={COLUMNS.length + 1}>
                        <StudentCard row={r} result={result} analysis={analysis} />
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
        Commits de merge não entram · “Linhas / commit” é a mediana · commits grandes têm{" "}
        {formatInt(analysis.options.largeCommitLines)}+ linhas alteradas (inclui arquivos gerados, como o
        package-lock.json) · passe o mouse sobre o cabeçalho para ver a explicação de cada coluna
      </p>
    </section>
  );
}
