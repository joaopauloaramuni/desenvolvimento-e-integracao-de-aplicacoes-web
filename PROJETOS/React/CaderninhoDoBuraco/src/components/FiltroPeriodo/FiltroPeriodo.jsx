import { MESES, hojeIso } from "../../utils/format";
import { TIPOS_PERIODO } from "../../utils/periodo";
import "./FiltroPeriodo.css";

/** Anos para escolher: do mais antigo com jogo (ou 5 anos atrás) até o atual. */
function anosDisponiveis(desde) {
  const atual = Number(hojeIso().slice(0, 4));
  const primeiro = Math.min(desde ?? atual - 4, atual - 4);
  return Array.from({ length: atual - primeiro + 1 }, (_, i) => String(atual - i));
}

/**
 * Filtro de período: Todo o tempo, Mês, Ano ou Entre datas.
 * O estado fica na URL (hook usePeriodo); aqui só desenha e avisa a mudança.
 */
function FiltroPeriodo({ periodo, onChange, anoMaisAntigo }) {
  const anos = anosDisponiveis(anoMaisAntigo);
  const [anoDoMes, mesDoMes] = periodo.mes.split("-");

  return (
    <div className="filtro" role="group" aria-label="Período">
      <div className="filtro__tipos">
        {TIPOS_PERIODO.map((t) => (
          <button
            key={t.id}
            type="button"
            className="filtro__tipo"
            aria-pressed={periodo.tipo === t.id}
            onClick={() => onChange({ tipo: t.id })}
          >
            {t.nome}
          </button>
        ))}
      </div>

      {periodo.tipo === "mes" && (
        <div className="filtro__campos">
          <label className="filtro__campo">
            <span className="visualmente-oculto">Mês</span>
            <select
              className="entrada"
              value={mesDoMes}
              onChange={(e) => onChange({ mes: `${anoDoMes}-${e.target.value}` })}
            >
              {MESES.map((nome, i) => (
                <option key={nome} value={String(i + 1).padStart(2, "0")}>
                  {nome}
                </option>
              ))}
            </select>
          </label>
          <label className="filtro__campo">
            <span className="visualmente-oculto">Ano do mês</span>
            <select
              className="entrada"
              value={anoDoMes}
              onChange={(e) => onChange({ mes: `${e.target.value}-${mesDoMes}` })}
            >
              {anos.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {periodo.tipo === "ano" && (
        <div className="filtro__campos">
          <label className="filtro__campo">
            <span className="visualmente-oculto">Ano</span>
            <select className="entrada" value={periodo.ano} onChange={(e) => onChange({ ano: e.target.value })}>
              {anos.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {periodo.tipo === "intervalo" && (
        <div className="filtro__campos">
          <label className="filtro__campo">
            <span>De</span>
            <input
              type="date"
              className="entrada"
              value={periodo.inicio}
              max={periodo.fim || undefined}
              onChange={(e) => onChange({ inicio: e.target.value })}
            />
          </label>
          <label className="filtro__campo">
            <span>Até</span>
            <input
              type="date"
              className="entrada"
              value={periodo.fim}
              min={periodo.inicio || undefined}
              onChange={(e) => onChange({ fim: e.target.value })}
            />
          </label>
        </div>
      )}
    </div>
  );
}

export default FiltroPeriodo;
