import { formatInt, formatPercent } from "./format";
import "./ContributorStats.css";

const short = (name, limit = 20) => (name.length <= limit ? name : `${name.slice(0, limit - 1)}…`);

/**
 * Participação de cada integrante: % dos commits e % das linhas alteradas,
 * com uma linha tracejada na "parte justa" (100% ÷ nº de integrantes).
 */
export default function ParticipationChart({ analysis }) {
  const { members, group } = analysis;
  const fair = group.fairShare;
  // Escala: o maior percentual (ou a parte justa) ocupa a barra inteira
  const max = Math.max(fair * 1.25, ...members.map((m) => Math.max(m.shareCommits, m.shareChanges)), 0.01);
  const width = (share) => `${Math.min(100, (share / max) * 100)}%`;

  return (
    <section className="cs-card">
      <div className="cs-card-head">
        <div>
          <h3>Participação no grupo</h3>
          <p className="cs-card-note">
            Linha tracejada = parte esperada ({formatPercent(fair, 1)} para {formatInt(members.length)}{" "}
            integrante(s))
          </p>
        </div>
        <ul className="cs-mini-legend">
          <li>
            <span className="cs-legend-dot is-commits" aria-hidden="true" /> Commits
          </li>
          <li>
            <span className="cs-legend-dot is-lines" aria-hidden="true" /> Linhas
          </li>
        </ul>
      </div>

      {!members.length ? (
        <p className="cs-empty">Nenhum integrante com commits no período.</p>
      ) : (
        <ol className="cs-part">
          {members.map((m) => {
            const low = members.length >= 3 && m.shareCommits < fair * 0.5 && m.shareChanges < fair * 0.5;
            return (
              <li key={m.key} className={low || m.missing ? "is-low" : undefined}>
                <span className="cs-part-name" title={m.username}>
                  {short(m.username)}
                </span>
                <span className="cs-part-bars" style={{ "--fair": width(fair) }}>
                  <span className="cs-part-track">
                    <span
                      className="cs-part-bar is-commits"
                      style={{ width: width(m.shareCommits) }}
                      title={`${formatInt(m.commits)} commit(s)`}
                    />
                  </span>
                  <span className="cs-part-track">
                    <span
                      className="cs-part-bar is-lines"
                      style={{ width: width(m.shareChanges) }}
                      title={`${formatInt(m.changes)} linha(s) alterada(s)`}
                    />
                  </span>
                </span>
                <span className="cs-part-values">
                  <span>{formatPercent(m.shareCommits, 0)}</span>
                  <span>{formatPercent(m.shareChanges, 0)}</span>
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
