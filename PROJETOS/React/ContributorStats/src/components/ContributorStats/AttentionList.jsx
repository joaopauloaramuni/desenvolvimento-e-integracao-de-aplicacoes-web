import { useState } from "react";
import { FiAlertOctagon, FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi";
import { formatInt } from "./format";
import "./ContributorStats.css";

const LEVELS = {
  danger: { icon: FiAlertOctagon, label: "Crítico" },
  warning: { icon: FiAlertTriangle, label: "Verificar" },
  info: { icon: FiInfo, label: "Contexto" },
};

// Quantos alertas aparecem antes do "Ver todos"
const COLLAPSED = 8;

/**
 * "Pontos de atenção": alertas gerados a partir dos indicadores
 * (participação baixa, inatividade, reta final, commits grandes...).
 */
export default function AttentionList({ alerts }) {
  const [expanded, setExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const list = showInfo ? alerts : alerts.filter((a) => a.level !== "info");
  const visible = expanded ? list : list.slice(0, COLLAPSED);
  const count = (level) => alerts.filter((a) => a.level === level).length;

  return (
    <section className="cs-card">
      <div className="cs-card-head">
        <div>
          <h3>Pontos de atenção</h3>
          <p className="cs-card-note">
            {formatInt(count("danger"))} crítico(s) · {formatInt(count("warning"))} a verificar ·{" "}
            {formatInt(count("info"))} de contexto
          </p>
        </div>
        <label className="cs-check">
          <input type="checkbox" checked={showInfo} onChange={(e) => setShowInfo(e.target.checked)} />
          Mostrar alertas de contexto
        </label>
      </div>

      {!list.length ? (
        <p className="cs-alert-ok">
          <FiCheckCircle aria-hidden="true" /> Nenhum ponto de atenção com os filtros atuais.
        </p>
      ) : (
        <ul className="cs-alerts">
          {visible.map((a, i) => {
            const { icon: Icon, label } = LEVELS[a.level];
            return (
              <li key={`${a.who}-${a.title}-${i}`} className={`cs-alert is-${a.level}`}>
                <Icon className="cs-alert-icon" aria-label={label} />
                <div>
                  <p className="cs-alert-title">
                    <strong>{a.who}</strong> · {a.title}
                  </p>
                  <p className="cs-alert-detail">{a.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {list.length > COLLAPSED && (
        <button type="button" className="cs-link-button" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Mostrar menos" : `Ver todos (${formatInt(list.length)})`}
        </button>
      )}
    </section>
  );
}
