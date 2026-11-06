import { FiGitCommit, FiMinusCircle, FiPlusCircle, FiUsers } from "react-icons/fi";
import { formatDecimal, formatInt } from "./format";
import "./ContributorStats.css";

/**
 * Indicadores: colaboradores, commits, linhas inseridas e deletadas.
 *
 * <ContributorStatCards result={analysisResult} />
 */
export default function ContributorStatCards({ result }) {
  const n = result?.contributors.length ?? 0;
  const net = result?.totalNetImpact ?? 0;

  const items = [
    {
      icon: FiUsers,
      label: "Colaboradores",
      value: result ? formatInt(n) : "—",
      note: result ? "com ao menos um commit" : null,
    },
    {
      icon: FiGitCommit,
      label: "Commits",
      value: result ? formatInt(result.totalCommits) : "—",
      note: result ? `média de ${formatDecimal(n ? result.totalCommits / n : 0)} por colaborador` : null,
    },
    {
      icon: FiPlusCircle,
      label: "Linhas inseridas",
      value: result ? formatInt(result.totalAdditions) : "—",
      note: result ? "linhas adicionadas" : null,
      tone: "success",
    },
    {
      icon: FiMinusCircle,
      label: "Linhas deletadas",
      value: result ? formatInt(result.totalDeletions) : "—",
      note: result ? `impacto líquido ${formatInt(net, true)}` : null,
      noteTone: net >= 0 ? "success" : "danger",
      tone: "danger",
    },
  ];

  return (
    <ul className="cs-kpis">
      {items.map(({ icon: Icon, label, value, note, tone, noteTone }) => (
        <li key={label} className={`cs-kpi${tone ? ` is-${tone}` : ""}`}>
          <span className="cs-kpi-label">
            <Icon aria-hidden="true" /> {label}
          </span>
          <span className="cs-kpi-value">{value}</span>
          <span className={`cs-kpi-note${noteTone ? ` is-${noteTone}` : ""}`}>{note ?? " "}</span>
        </li>
      ))}
    </ul>
  );
}
