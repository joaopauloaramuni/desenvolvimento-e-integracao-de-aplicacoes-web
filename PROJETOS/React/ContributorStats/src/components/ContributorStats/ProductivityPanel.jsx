import { useMemo } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiCalendar,
  FiClock,
  FiDownload,
  FiInfo,
  FiRotateCcw,
  FiUsers,
} from "react-icons/fi";
import {
  balanceLabel,
  computeProductivity,
  defaultProductivityCsvFilename,
  exportProductivityToCsv,
  formatDateBR,
  parseMembers,
} from "../../core";
import AttentionList from "./AttentionList";
import ParticipationChart from "./ParticipationChart";
import ProductivityTable from "./ProductivityTable";
import WeeklyHeatmap from "./WeeklyHeatmap";
import WorkHoursHeatmap from "./WorkHoursHeatmap";
import { formatInt, formatPercent } from "./format";
import "./ContributorStats.css";

/**
 * Aba "Produtividade": indicadores para o professor avaliar o trabalho em grupo.
 *
 * Tudo é calculado no navegador a partir do resultado da análise: mudar o
 * período, o prazo ou os integrantes NÃO faz novas chamadas à API.
 *
 * <ProductivityPanel result={analysisResult} options={...} onOptionsChange={...} />
 */
export default function ProductivityPanel({ result, options, onOptionsChange, addLog, setMessage }) {
  const set = (field) => (event) =>
    onOptionsChange({
      ...options,
      [field]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    });

  const analysis = useMemo(
    () =>
      result
        ? computeProductivity(result, {
            start: options.start,
            deadline: options.deadline,
            members: parseMembers(options.members),
            ignoreBots: options.ignoreBots,
          })
        : null,
    [result, options]
  );

  if (!result) {
    return (
      <section className="cs-card">
        <p className="cs-empty">Analise um repositório para ver os indicadores de produtividade do grupo.</p>
      </section>
    );
  }

  const { group, period, detailed } = analysis;
  const invalidPeriod = options.start && options.deadline && options.deadline < options.start;

  const handleExport = () => {
    try {
      const file = exportProductivityToCsv(analysis, defaultProductivityCsvFilename(result.repo));
      addLog(`Produtividade exportada para ${file}`, "success");
      setMessage(`CSV salvo como ${file}`);
    } catch (err) {
      addLog(`Erro ao exportar: ${err.message}`, "error");
    }
  };

  const balance = balanceLabel(group.balanceCommits);
  const critical = analysis.alerts.filter((a) => a.level === "danger").length;
  const toCheck = analysis.alerts.filter((a) => a.level === "warning").length;

  const kpis = [
    {
      icon: FiUsers,
      label: "Equilíbrio do grupo",
      value: group.members >= 2 ? formatPercent(group.balanceCommits, 0) : "—",
      note:
        group.members >= 2
          ? `${balance.label} · linhas ${formatPercent(group.balanceChanges, 0)}`
          : "precisa de 2+ integrantes",
      noteTone: group.members >= 2 ? balance.tone : null,
    },
    {
      icon: FiCalendar,
      label: "Semanas com commits",
      value: group.weeks ? `${formatInt(group.activeWeeks)} / ${formatInt(group.weeks)}` : "—",
      note: group.weeks ? `${formatPercent(group.activeWeeks / group.weeks, 0)} das semanas do período` : null,
    },
    {
      icon: FiClock,
      label: "Reta final",
      value:
        group.finalStretch !== null && group.commits
          ? formatPercent(group.finalStretch / group.commits, 0)
          : "—",
      note: !detailed
        ? "requer todas as branches"
        : options.deadline
          ? `dos commits nos últimos ${analysis.options.finalStretchDays} dias`
          : "informe o prazo de entrega",
    },
    {
      icon: FiAlertTriangle,
      label: "Pontos de atenção",
      value: formatInt(critical + toCheck),
      note: `${formatInt(critical)} crítico(s) · ${formatInt(toCheck)} a verificar`,
      noteTone: critical ? "danger" : toCheck ? "warning" : "success",
      tone: critical ? "danger" : null,
    },
  ];

  return (
    <div className="cs-sections">
      {/* ---------------- Configuração da avaliação ---------------- */}
      <section className="cs-card">
        <div className="cs-card-head">
          <div>
            <h3>Avaliação do trabalho em grupo</h3>
            <p className="cs-card-note">
              {result.fullName} · {result.scopeLabel}
              {period.start && period.end
                ? ` · período de ${formatDateBR(period.start)} a ${formatDateBR(period.end)}`
                : ""}
            </p>
          </div>
          <div className="cs-table-tools">
            <button
              type="button"
              className="cs-button cs-button-small cs-button-ghost"
              onClick={() => onOptionsChange({ ...options, start: "", deadline: "" })}
              disabled={!options.start && !options.deadline}
              title="Voltar a usar o período inteiro dos commits"
            >
              <FiRotateCcw aria-hidden="true" /> Limpar período
            </button>
            <button
              type="button"
              className="cs-button cs-button-small"
              onClick={handleExport}
              disabled={!analysis.members.length}
            >
              <FiDownload aria-hidden="true" /> Exportar CSV
            </button>
          </div>
        </div>

        <div className="cs-prod-form">
          <label className="cs-field">
            <span>Início do trabalho</span>
            <input type="date" value={options.start} onChange={set("start")} max={options.deadline || undefined} />
          </label>
          <label className="cs-field">
            <span>Prazo de entrega</span>
            <input type="date" value={options.deadline} onChange={set("deadline")} min={options.start || undefined} />
          </label>
          <label className="cs-field cs-prod-members">
            <span>Integrantes do grupo (logins do GitHub)</span>
            <input
              value={options.members}
              onChange={set("members")}
              placeholder="aluno1, aluno2, aluno3… (opcional: detecta quem não fez commit)"
              spellCheck="false"
              autoComplete="off"
            />
          </label>
        </div>
        <label className="cs-check cs-files-check">
          <input type="checkbox" checked={options.ignoreBots} onChange={set("ignoreBots")} />
          Ignorar contas de bot (ex.: github-classroom[bot]) no equilíbrio do grupo
        </label>

        {invalidPeriod && (
          <p className="cs-token-hint is-warning">O prazo de entrega é anterior ao início do trabalho.</p>
        )}
        {!detailed && (
          <p className="cs-prod-notice">
            <FiInfo aria-hidden="true" />
            Esta análise usou só a branch padrão, e o GitHub informa apenas totais por semana: dias ativos,
            horários, mensagens e commits grandes ficam indisponíveis. Marque{" "}
            <strong>Considerar todas as branches</strong> e analise de novo para ver tudo.
          </p>
        )}
      </section>

      {/* ---------------- Indicadores do grupo ---------------- */}
      <ul className="cs-kpis">
        {kpis.map(({ icon: Icon, label, value, note, tone, noteTone }) => (
          <li key={label} className={`cs-kpi${tone ? ` is-${tone}` : ""}`}>
            <span className="cs-kpi-label">
              <Icon aria-hidden="true" /> {label}
            </span>
            <span className="cs-kpi-value">{value}</span>
            <span className={`cs-kpi-note${noteTone ? ` is-${noteTone}` : ""}`}>{note ?? " "}</span>
          </li>
        ))}
      </ul>

      <AttentionList alerts={analysis.alerts} />

      <div className="cs-prod-grid">
        <ParticipationChart analysis={analysis} />
        <WorkHoursHeatmap analysis={analysis} />
      </div>

      <WeeklyHeatmap analysis={analysis} />

      <ProductivityTable analysis={analysis} result={result} />

      <p className="cs-card-note cs-prod-footnote">
        <FiActivity aria-hidden="true" />
        <span>
          Os indicadores ajudam a <strong>direcionar a conversa</strong> com o grupo, não substituem a avaliação:
          quantidade de commits e de linhas não mede qualidade, e programação em par (duas pessoas, um commit)
          não aparece aqui.
        </span>
      </p>
    </div>
  );
}
