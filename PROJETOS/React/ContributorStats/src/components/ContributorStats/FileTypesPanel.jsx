import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiFileText,
  FiPlay,
  FiRefreshCw,
  FiSearch,
  FiSquare,
} from "react-icons/fi";
import CONFIG from "../../config/contributorStatsConfig";
import {
  aggregateFileTypes,
  defaultFileTypeCsvFilename,
  defaultGroupFileTypeCsvFilename,
  describeShares,
  describeTypeOwners,
  exportFileTypesToCsv,
  exportGroupFileTypesToCsv,
  FILE_TYPE_METRICS,
  groupFileTypes,
} from "../../core";
import { formatDecimal, formatInt } from "./format";
import "./ContributorStats.css";

const percent = (share) => `${formatDecimal(share * 100)}%`;

/**
 * Barra empilhada: um segmento por tipo de arquivo.
 * `share` é a largura de cada segmento (0–1). Na aba "por grupo" os segmentos
 * somam só a parte do aluno, e o resto da barra fica vazio (o total do grupo).
 */
function StackedBar({ types, label, scaled = false }) {
  const visible = types.filter((t) => t.value > 0);
  return (
    <span className={`cs-stack${scaled ? " is-scaled" : ""}`} role="img" aria-label={label}>
      {visible.map((t) => (
        <span
          key={t.type}
          className="cs-stack-seg"
          style={{ width: `${t.share * 100}%`, background: t.color }}
          title={`${t.type}: ${percent(t.share)} (${formatInt(t.value)} linhas)`}
        />
      ))}
    </span>
  );
}

/** Legenda com cor, tipo, percentual e linhas. */
function Legend({ types, limit = Infinity }) {
  const visible = types.filter((t) => t.value > 0).slice(0, limit);
  return (
    <ul className="cs-legend">
      {visible.map((t) => (
        <li key={t.type}>
          <span className="cs-legend-dot" style={{ background: t.color }} aria-hidden="true" />
          <strong>{t.type}</strong> {percent(t.share)}
          <span className="cs-legend-lines">({formatInt(t.value)} linhas)</span>
        </li>
      ))}
    </ul>
  );
}

/** Quantos commits a análise vai ler (para avisar o custo antes de começar). */
function estimateCommits(result) {
  if (!result) return 0;
  if (result.commitRefs) return result.commitRefs.filter((r) => !r.isMerge).length;
  return result.totalCommits;
}

/**
 * Abas "Tipos de arquivo por aluno" e "Tipos de arquivo por grupo".
 *
 *   view="student" → percentual sobre o total do próprio aluno
 *                    (ex.: 70% CSS — 700 linhas, 30% JavaScript — 300 linhas)
 *   view="group"   → percentual sobre o total do grupo
 *                    (o grupo alterou 1.000 linhas; 100 de JSON do aluno = 10% JSON)
 *
 * As duas abas usam a mesma busca (feita uma vez só, sob demanda, porque custa
 * 1 requisição por commit) e as mesmas opções (métrica e arquivos gerados).
 */
export default function FileTypesPanel({
  view = "student",
  options,
  onOptionsChange,
  result,
  analysis,
  status,
  error,
  busy,
  hasToken,
  onStart,
  onCancel,
  addLog,
  setMessage,
}) {
  // Opções vindas do pai (compartilhadas entre as duas abas) ou locais
  const [localOptions, setLocalOptions] = useState({
    metric: "changes",
    ignoreGenerated: CONFIG.DEFAULT_IGNORE_GENERATED,
  });
  const { metric, ignoreGenerated } = options ?? localOptions;
  const setOptions = (patch) => {
    const next = { metric, ignoreGenerated, ...patch };
    if (onOptionsChange) onOptionsChange(next);
    else setLocalOptions(next);
  };
  const isGroup = view === "group";
  const [filter, setFilter] = useState("");
  const [openRow, setOpenRow] = useState(null);

  const aggregate = useMemo(
    () =>
      analysis && result
        ? aggregateFileTypes(analysis, result.contributors, { metric, ignoreGenerated })
        : null,
    [analysis, result, metric, ignoreGenerated]
  );

  const group = useMemo(() => (isGroup && aggregate ? groupFileTypes(aggregate) : null), [isGroup, aggregate]);

  const rows = useMemo(() => {
    const term = filter.trim().toLowerCase();
    const list = (group ?? aggregate)?.contributors ?? [];
    return term ? list.filter((r) => r.contributor.username.toLowerCase().includes(term)) : list;
  }, [aggregate, group, filter]);

  const metricInfo = FILE_TYPE_METRICS.find((m) => m.value === metric);
  const running = status === "running";
  const estimate = estimateCommits(result);

  const handleExport = () => {
    try {
      const file = isGroup
        ? exportGroupFileTypesToCsv(group, defaultGroupFileTypeCsvFilename(result.repo))
        : exportFileTypesToCsv(aggregate, defaultFileTypeCsvFilename(result.repo));
      addLog(`Tipos de arquivo ${isGroup ? "por grupo " : "por aluno "}exportados para ${file}`, "success");
      setMessage(`CSV salvo como ${file}`);
    } catch (err) {
      addLog(`Erro ao exportar: ${err.message}`, "error");
    }
  };

  /* ---------------- Estados sem dados ---------------- */

  if (!result) {
    return (
      <section className="cs-card">
        <p className="cs-empty">
          {isGroup
            ? "Analise um repositório para ver quanto cada colaborador fez de cada tipo de arquivo do grupo."
            : "Analise um repositório para ver os tipos de arquivo de cada colaborador."}
        </p>
      </section>
    );
  }

  if (!analysis) {
    return (
      <section className="cs-card cs-files-intro">
        <FiFileText className="cs-files-icon" aria-hidden="true" />
        {isGroup ? (
          <>
            <h3>Tipos de arquivo por grupo</h3>
            <p>
              Descubra quanto do código do grupo cada pessoa fez em cada tipo de arquivo — por exemplo,
              se o grupo alterou 1.000 linhas e fulano alterou 100 linhas de JSON,{" "}
              <em>“fulano fez 10% do código do grupo em JSON”</em>.
            </p>
          </>
        ) : (
          <>
            <h3>Tipos de arquivo por aluno</h3>
            <p>
              Descubra em que tipo de arquivo cada pessoa trabalhou — por exemplo,{" "}
              <em>“70% CSS (700 linhas) e 30% JavaScript (300 linhas)”</em>.
            </p>
          </>
        )}
        <p className="cs-card-note">
          {result.fullName} · {result.scopeLabel} · cerca de {formatInt(estimate)} commit(s) a ler
          (1 requisição à API do GitHub por commit
          {estimate > CONFIG.FILE_TYPES_MAX_COMMITS
            ? `; serão lidos só os ${formatInt(CONFIG.FILE_TYPES_MAX_COMMITS)} mais recentes`
            : ""}
          ). Commits de merge são ignorados.
        </p>
        {hasToken === false && estimate > 50 && (
          <p className="cs-token-hint is-warning">
            Sem GITHUB_TOKEN o limite é de 60 requisições/hora: o resultado pode sair parcial.
          </p>
        )}
        {status === "error" && error && (
          <div className="cs-message" role="alert">
            <strong>Não foi possível analisar os tipos de arquivo</strong>
            <span>{error.message}</span>
          </div>
        )}
        <div className="cs-files-actions">
          {running ? (
            <button type="button" className="cs-button cs-button-ghost" onClick={onCancel}>
              <FiSquare aria-hidden="true" /> Cancelar
            </button>
          ) : (
            <button type="button" className="cs-button" onClick={onStart} disabled={busy}>
              <FiPlay aria-hidden="true" />
              {status === "error" || status === "cancelled" ? "Tentar novamente" : "Analisar tipos de arquivo"}
            </button>
          )}
        </div>
      </section>
    );
  }

  /* ---------------- Resultado ---------------- */

  const notes = [
    `${formatInt(analysis.analyzed)} commit(s) lido(s)`,
    analysis.skippedMerges ? `${formatInt(analysis.skippedMerges)} merge(s) ignorado(s)` : null,
    analysis.limited ? `limitado aos ${formatInt(CONFIG.FILE_TYPES_MAX_COMMITS)} mais recentes` : null,
    analysis.partial ? "resultado parcial (limite da API)" : null,
    ignoreGenerated && aggregate.ignoredFiles
      ? `${formatInt(aggregate.ignoredLines)} linha(s) de arquivos gerados ignorada(s)`
      : null,
  ].filter(Boolean);

  return (
    <div className="cs-sections">
      <section className="cs-card">
        <div className="cs-card-head">
          <div>
            <h3>{isGroup ? "Código do grupo por tipo de arquivo" : "Tipos de arquivo no repositório"}</h3>
            <p className="cs-card-note">
              {result.fullName} · {notes.join(" · ")}
            </p>
          </div>
          <div className="cs-table-tools">
            <select
              className="cs-select"
              value={metric}
              onChange={(e) => setOptions({ metric: e.target.value })}
              aria-label="Métrica dos percentuais"
            >
              {FILE_TYPE_METRICS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="cs-button cs-button-small cs-button-ghost"
              onClick={onStart}
              disabled={busy}
              title="Buscar novamente os arquivos dos commits"
            >
              <FiRefreshCw aria-hidden="true" /> Atualizar
            </button>
          </div>
        </div>

        <label className="cs-check cs-files-check">
          <input
            type="checkbox"
            checked={ignoreGenerated}
            onChange={(e) => setOptions({ ignoreGenerated: e.target.checked })}
          />
          Ignorar arquivos gerados e dependências (package-lock.json, node_modules/, dist/, *.min.js…)
        </label>

        {aggregate.repo.value ? (
          <>
            <StackedBar types={aggregate.repo.types} label="Distribuição por tipo de arquivo" />
            <Legend types={aggregate.repo.types} />
          </>
        ) : (
          <p className="cs-empty">Nenhuma linha de {metricInfo.short} encontrada.</p>
        )}
      </section>

      <section className="cs-card">
        <div className="cs-card-head">
          <div>
            <h3>Por colaborador</h3>
            <p className="cs-card-note">
              {isGroup
                ? `Percentual sobre o total do grupo (${formatInt(aggregate.repo.value)} ${metricInfo.short}): a barra inteira é o grupo`
                : `Percentual de ${metricInfo.short} em cada tipo de arquivo, sobre o total de cada colaborador`}
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
              />
            </div>
            <button
              type="button"
              className="cs-button cs-button-small"
              onClick={handleExport}
              disabled={!aggregate.repo.value}
            >
              <FiDownload aria-hidden="true" /> Exportar CSV
            </button>
          </div>
        </div>

        {!rows.length && <p className="cs-empty">Nenhum usuário corresponde ao filtro.</p>}

        <ol className="cs-files-list">
          {rows.map((row) => {
            const { contributor: c } = row;
            const open = openRow === c.key;
            return (
              <li key={c.key} className="cs-files-item">
                <div className="cs-files-row">
                  <span className="cs-rank">{c.rank ? `${c.rank}º` : "–"}</span>
                  <div className="cs-files-main">
                    <div className="cs-files-top">
                      {c.profileUrl ? (
                        <a className="cs-files-user" href={c.profileUrl} target="_blank" rel="noreferrer">
                          {c.username}
                        </a>
                      ) : (
                        <span className="cs-files-user">{c.username}</span>
                      )}
                      <span className="cs-files-total">
                        {isGroup && (
                          <strong className="cs-files-group-share">{percent(row.groupShare)} do grupo · </strong>
                        )}
                        {formatInt(row.value)} {metricInfo.short}
                      </span>
                    </div>
                    <StackedBar
                      types={row.types}
                      scaled={isGroup}
                      label={
                        isGroup
                          ? `${c.username}: ${percent(row.groupShare)} do código do grupo`
                          : `Tipos de arquivo de ${c.username}`
                      }
                    />
                    <p className="cs-files-summary">
                      {isGroup && row.value > 0 ? "Do código do grupo: " : ""}
                      {describeShares(row.types)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="cs-files-toggle"
                    onClick={() => setOpenRow(open ? null : c.key)}
                    aria-expanded={open}
                    disabled={!row.types.length}
                    title="Ver detalhes por tipo de arquivo"
                  >
                    {open ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>

                {open && (
                  <div className="cs-table-scroll cs-files-detail">
                    <table className="cs-table">
                      <thead>
                        <tr>
                          <th className="cs-th-static">Tipo</th>
                          <th className="cs-th-static is-right">Inseridas</th>
                          <th className="cs-th-static is-right">Deletadas</th>
                          <th className="cs-th-static is-right">Alteradas</th>
                          <th className="cs-th-static is-right">Arquivos</th>
                          {isGroup ? (
                            <>
                              <th className="cs-th-static is-right" title="Percentual sobre o total do próprio aluno">
                                % do aluno
                              </th>
                              <th
                                className="cs-th-static is-right"
                                title="Quanto deste tipo de arquivo, no grupo todo, foi feito pelo aluno"
                              >
                                % do tipo no grupo
                              </th>
                              <th
                                className="cs-th-static is-right"
                                title="Percentual sobre o total do grupo (todos os tipos e colaboradores)"
                              >
                                % do grupo
                              </th>
                            </>
                          ) : (
                            <th className="cs-th-static is-right">%</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {row.types.map((t) => (
                            <tr key={t.type}>
                              <td>
                                <span
                                  className="cs-legend-dot"
                                  style={{ background: t.color }}
                                  aria-hidden="true"
                                />{" "}
                                {t.type}
                              </td>
                              <td className="is-right cs-pos">{formatInt(t.additions)}</td>
                              <td className="is-right cs-neg">{formatInt(t.deletions)}</td>
                              <td className="is-right">{formatInt(t.changes)}</td>
                              <td className="is-right">{formatInt(t.files)}</td>
                              {isGroup && (
                                <>
                                  <td className="is-right">{percent(t.ownShare)}</td>
                                  <td className="is-right">{percent(t.typeShare)}</td>
                                </>
                              )}
                              <td className="is-right">
                                <strong>{percent(t.share)}</strong>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <p className="cs-card-note cs-tip">
          {isGroup
            ? "Somando todos os colaboradores e tipos, o total é 100% · os tipos são identificados pela extensão do arquivo · commits de merge não entram na conta"
            : "Os tipos são identificados pela extensão do arquivo · “Arquivos” conta arquivos distintos tocados pelo colaborador · commits de merge não entram na conta"}
        </p>
      </section>

      {isGroup && group.types.length > 0 && (
        <section className="cs-card">
          <div className="cs-card-head">
            <div>
              <h3>Quem fez cada tipo de arquivo</h3>
              <p className="cs-card-note">
                Parte de cada tipo no código do grupo e quanto dele cada colaborador fez
              </p>
            </div>
          </div>
          <ul className="cs-owners">
            {group.types.map((t) => (
              <li key={t.type}>
                <span className="cs-owners-type">
                  <span className="cs-legend-dot" style={{ background: t.color }} aria-hidden="true" />
                  {t.type}
                </span>
                <span className="cs-owners-bar" aria-hidden="true">
                  <span style={{ width: `${t.share * 100}%`, background: t.color }} />
                </span>
                <span className="cs-owners-value">
                  <strong>{percent(t.share)}</strong> ({formatInt(t.value)} linhas)
                </span>
                <span className="cs-owners-who">{describeTypeOwners(t.contributors)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
