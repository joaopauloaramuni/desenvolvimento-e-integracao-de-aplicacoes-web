import { FiGithub, FiKey, FiPlay, FiSquare } from "react-icons/fi";
import { SORT_CRITERIA } from "../../core";
import "./ContributorStats.css";

/**
 * Formulário: repositório, critério do ranking, opções e botões.
 * É "controlado": os valores e os setters vêm do componente pai.
 */
export default function AnalysisForm({ values, onChange, onSubmit, onCancel, running, hasToken }) {
  const set = (field) => (event) =>
    onChange({
      ...values,
      [field]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    });

  const tokenHint =
    hasToken === null
      ? "Verificando o token do servidor…"
      : hasToken
        ? "Token carregado do .env.local (fica só no servidor)."
        : "Sem GITHUB_TOKEN: só a branch padrão de repositórios públicos (60 req/h).";

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="cs-card cs-form" onSubmit={handleSubmit}>
      <div className="cs-form-grid">
        <label className="cs-field cs-field-url">
          <span>Repositório</span>
          <div className="cs-input-icon">
            <FiGithub aria-hidden="true" />
            <input
              value={values.url}
              onChange={set("url")}
              placeholder="https://github.com/dono/repositorio ou dono/repositorio"
              autoComplete="off"
              spellCheck="false"
              disabled={running}
            />
          </div>
        </label>

        <label className="cs-field">
          <span>Ordenar ranking por</span>
          <select value={values.criterion} onChange={set("criterion")}>
            {SORT_CRITERIA.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="cs-form-bottom">
        <div className="cs-checks">
          <label className="cs-check">
            <input
              type="checkbox"
              checked={values.allBranches}
              onChange={set("allBranches")}
              disabled={running}
            />
            Considerar todas as branches (não só a padrão)
          </label>
          <label className="cs-check">
            <input
              type="checkbox"
              checked={values.includeMerges}
              onChange={set("includeMerges")}
              disabled={running || !values.allBranches}
            />
            Contar commits de merge
          </label>
          {/* No modo "todas as branches" a data do último commit já é exata */}
          <label className="cs-check">
            <input
              type="checkbox"
              checked={values.fetchExactDates}
              onChange={set("fetchExactDates")}
              disabled={running || values.allBranches}
            />
            Buscar data exata do último commit
          </label>
        </div>

        <div className="cs-actions">
          <button
            type="button"
            className="cs-button cs-button-ghost"
            onClick={onCancel}
            disabled={!running}
            title="Cancelar (Esc)"
          >
            <FiSquare aria-hidden="true" /> Cancelar
          </button>
          <button type="submit" className="cs-button" disabled={running}>
            <FiPlay aria-hidden="true" /> {running ? "Analisando…" : "Analisar repositório"}
          </button>
        </div>
      </div>

      <p className={`cs-token-hint${hasToken === false ? " is-warning" : ""}`}>
        <FiKey aria-hidden="true" /> {tokenHint}
      </p>
    </form>
  );
}
