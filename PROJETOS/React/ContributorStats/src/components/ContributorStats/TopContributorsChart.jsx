import { useState } from "react";
import { formatInt } from "./format";
import "./ContributorStats.css";

const CHART_METRICS = {
  Commits: (c) => c.commits,
  "Linhas inseridas": (c) => c.additions,
  "Linhas deletadas": (c) => c.deletions,
  "Impacto líquido": (c) => c.netImpact,
};

const short = (name, limit = 22) => (name.length <= limit ? name : `${name.slice(0, limit - 1)}…`);

/**
 * Gráfico de barras horizontais (Top 10) feito só com CSS, sem bibliotecas.
 * Valores negativos (impacto líquido) aparecem em vermelho.
 */
export default function TopContributorsChart({ result }) {
  const [metric, setMetric] = useState("Commits");
  const value = CHART_METRICS[metric];

  const top = result
    ? [...result.contributors].sort((a, b) => value(b) - value(a)).slice(0, 10)
    : [];
  const max = Math.max(1, ...top.map((c) => Math.abs(value(c))));

  return (
    <section className="cs-card">
      <div className="cs-card-head">
        <div>
          <h3>Top 10</h3>
          <p className="cs-card-note">Comparativo por métrica</p>
        </div>
        <select
          className="cs-select"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          aria-label="Métrica do gráfico"
        >
          {Object.keys(CHART_METRICS).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      {!top.length ? (
        <p className="cs-empty">Os dados aparecerão aqui após a análise.</p>
      ) : (
        <ol className="cs-chart">
          {top.map((c, i) => {
            const v = value(c);
            return (
              <li key={c.rank}>
                <span className="cs-chart-label" title={c.username}>
                  {short(c.username)}
                </span>
                <span className="cs-chart-track">
                  <span
                    className={`cs-chart-bar${v < 0 ? " is-negative" : ""}`}
                    style={{
                      width: `${Math.max(2, (Math.abs(v) / max) * 100)}%`,
                      "--i": i,
                    }}
                  />
                </span>
                <span className="cs-chart-value">{formatInt(v)}</span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
