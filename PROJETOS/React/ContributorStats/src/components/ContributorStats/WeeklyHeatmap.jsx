import { formatDateBR } from "../../core";
import { formatDayMonth, formatInt, heatLevel } from "./format";
import "./ContributorStats.css";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const short = (name, limit = 18) => (name.length <= limit ? name : `${name.slice(0, limit - 1)}…`);

/**
 * Atividade semanal: uma linha por integrante e uma coluna por semana do
 * período. Mostra quem trabalhou com constância e quem sumiu (ou só apareceu
 * no fim).
 */
export default function WeeklyHeatmap({ analysis }) {
  const { members, group, period } = analysis;
  const weeks = period.weeks;
  const max = Math.max(1, ...members.flatMap((m) => weeks.map((w) => m.weekly.get(w) ?? 0)));
  const groupMax = Math.max(1, ...weeks.map((w) => group.weekly.get(w) ?? 0));
  // Semana do prazo (destacada com contorno)
  const deadlineWeek = analysis.options.deadline
    ? weeks.findLast((w) => w <= analysis.options.deadline)
    : null;

  // Rótulo do mês na primeira semana de cada mês
  const monthLabel = (w, i) => {
    const month = Number(w.slice(5, 7)) - 1;
    const prev = i ? Number(weeks[i - 1].slice(5, 7)) - 1 : -1;
    return month !== prev ? MONTHS[month] : "";
  };

  const cell = (w, n, m, key) => (
    <span
      key={key}
      className={`cs-heat is-l${heatLevel(n, m)}${w === deadlineWeek ? " is-deadline" : ""}`}
      title={`Semana de ${formatDateBR(w)}: ${formatInt(n)} commit(s)`}
    />
  );

  return (
    <section className="cs-card">
      <div className="cs-card-head">
        <div>
          <h3>Atividade semanal</h3>
          <p className="cs-card-note">
            Commits por semana de cada integrante
            {period.start && period.end
              ? ` · ${formatInt(weeks.length)} semana(s), de ${formatDayMonth(period.start)} a ${formatDayMonth(period.end)}`
              : ""}
            {deadlineWeek ? " · contorno = semana do prazo" : ""}
          </p>
        </div>
        <span className="cs-heat-scale" aria-hidden="true">
          menos
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={`cs-heat is-l${l}`} />
          ))}
          mais
        </span>
      </div>

      {!weeks.length || !members.length ? (
        <p className="cs-empty">Nenhum commit no período.</p>
      ) : (
        <div className="cs-table-scroll">
          <div className="cs-weekly" style={{ "--weeks": weeks.length }}>
            <span />
            {weeks.map((w, i) => (
              <span key={w} className="cs-weekly-month">
                {monthLabel(w, i)}
              </span>
            ))}
            <span />

            {members.map((m) => (
              <div key={m.key} className="cs-weekly-row">
                <span className="cs-weekly-name" title={m.username}>
                  {short(m.username)}
                </span>
                {weeks.map((w) => cell(w, m.weekly.get(w) ?? 0, max, w))}
                <span className="cs-weekly-total" title="Semanas com pelo menos um commit">
                  {formatInt(m.activeWeeks)}/{formatInt(weeks.length)}
                </span>
              </div>
            ))}

            <div className="cs-weekly-row is-group">
              <span className="cs-weekly-name">Grupo</span>
              {weeks.map((w) => cell(w, group.weekly.get(w) ?? 0, groupMax, w))}
              <span className="cs-weekly-total">
                {formatInt(group.activeWeeks)}/{formatInt(weeks.length)}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
