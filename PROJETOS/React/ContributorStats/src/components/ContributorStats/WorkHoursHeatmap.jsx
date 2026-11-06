import { useState } from "react";
import { WEEKDAYS } from "../../core";
import { formatInt, formatPercent, heatLevel } from "./format";
import "./ContributorStats.css";

const HOURS = Array.from({ length: 24 }, (_, h) => h);

function summarize(hours) {
  let total = 0;
  let night = 0;
  let weekend = 0;
  let peak = { d: 0, h: 0, n: 0 };
  hours.forEach((line, d) =>
    line.forEach((n, h) => {
      total += n;
      if (h < 6) night += n;
      if (d >= 5) weekend += n;
      if (n > peak.n) peak = { d, h, n };
    })
  );
  return { total, night, weekend, peak };
}

/**
 * "Quando trabalham": commits por dia da semana × hora (horário do autor),
 * do grupo inteiro ou de um integrante.
 */
export default function WorkHoursHeatmap({ analysis }) {
  const [who, setWho] = useState("__group__");
  const { members, group, detailed } = analysis;

  const selected = who === "__group__" ? null : members.find((m) => m.key === who);
  const hours = selected ? selected.hours : group.hours;
  const max = hours ? Math.max(1, ...hours.flat()) : 1;
  const info = hours ? summarize(hours) : null;

  return (
    <section className="cs-card">
      <div className="cs-card-head">
        <div>
          <h3>Quando trabalham</h3>
          <p className="cs-card-note">Commits por dia da semana e hora (horário de quem fez o commit)</p>
        </div>
        <select
          className="cs-select"
          value={who}
          onChange={(e) => setWho(e.target.value)}
          aria-label="Integrante"
          disabled={!detailed}
        >
          <option value="__group__">Grupo inteiro</option>
          {members.map((m) => (
            <option key={m.key} value={m.key}>
              {m.username}
            </option>
          ))}
        </select>
      </div>

      {!detailed || !hours ? (
        <p className="cs-empty">Disponível quando a análise considera todas as branches.</p>
      ) : (
        <>
          <div className="cs-table-scroll">
            <div className="cs-hours" role="img" aria-label="Mapa de calor de commits por dia e hora">
              <span />
              {HOURS.map((h) => (
                <span key={h} className="cs-hours-label is-hour">
                  {h % 3 === 0 ? `${h}h` : ""}
                </span>
              ))}
              {WEEKDAYS.map((day, d) => (
                <div key={day} className="cs-hours-row">
                  <span className="cs-hours-label">{day}</span>
                  {HOURS.map((h) => {
                    const n = hours[d][h];
                    return (
                      <span
                        key={h}
                        className={`cs-heat is-l${heatLevel(n, max)}`}
                        title={`${day} ${h}h: ${formatInt(n)} commit(s)`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {info.total > 0 ? (
            <p className="cs-card-note cs-hours-summary">
              Pico: <strong>{WEEKDAYS[info.peak.d]} às {info.peak.h}h</strong> · madrugada (0h–6h):{" "}
              <strong>{formatPercent(info.night / info.total, 0)}</strong> · fim de semana:{" "}
              <strong>{formatPercent(info.weekend / info.total, 0)}</strong>
            </p>
          ) : (
            <p className="cs-card-note cs-hours-summary">Nenhum commit no período.</p>
          )}
        </>
      )}
    </section>
  );
}
