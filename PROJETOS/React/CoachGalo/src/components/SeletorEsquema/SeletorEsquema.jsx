import { FORMACOES } from "../../config/formacoes";
import "./SeletorEsquema.css";

// Mini campo com os pontinhos do esquema, dentro de cada botão
const Miniatura = ({ vagas }) => (
  <svg viewBox="0 0 68 80" className="esquema-mini" aria-hidden="true">
    {vagas.map((v, i) => (
      <circle key={i} cx={(v.x / 100) * 68} cy={(v.y / 100) * 80} r="5" />
    ))}
  </svg>
);

export default function SeletorEsquema({ atual, onTrocar }) {
  return (
    <section aria-labelledby="esquema-titulo">
      <h2 id="esquema-titulo" className="secao-titulo">
        Esquema tático
      </h2>
      <div className="esquemas" role="radiogroup" aria-labelledby="esquema-titulo">
        {FORMACOES.map((f) => (
          <button
            type="button"
            role="radio"
            aria-checked={atual === f.id}
            key={f.id}
            className={`esquema ${atual === f.id ? "is-ativo" : ""}`}
            onClick={() => onTrocar(f.id)}
          >
            <Miniatura vagas={f.vagas} />
            <span>{f.id}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
