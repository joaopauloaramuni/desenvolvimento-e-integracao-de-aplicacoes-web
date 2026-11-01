import { LuArrowUp } from "react-icons/lu";
import { EXAMPLES, FINISHES, STYLES, findById } from "../../config/tattooOptions";
import "./ExampleGallery.css";

/**
 * Folha de flash com exemplos em vários estilos (imagens em public/exemplos).
 * "Usar esta ideia" leva a ideia e as escolhas do exemplo para o estúdio.
 */
function ExampleGallery({ onUsar }) {
  return (
    <section className="examples" aria-labelledby="exemplos-titulo">
      <div className="section-head">
        <h2 className="section-title" id="exemplos-titulo">
          Exemplos de flash
        </h2>
        <p className="section-hint">
          Seis desenhos em estilos diferentes. Escolha um como ponto de partida e mude o que quiser.
        </p>
      </div>

      <ul className="examples-grid">
        {EXAMPLES.map((exemplo) => {
          const estilo = findById(STYLES, exemplo.estilo);
          const acabamento = findById(FINISHES, exemplo.acabamento);
          return (
            <li key={exemplo.id} className="example-card">
              <div className="example-paper">
                <img src={exemplo.src} alt={`Exemplo ${estilo.nome}: ${exemplo.ideia}`} loading="lazy" />
              </div>
              <div className="example-body">
                <p className="example-style">
                  {estilo.nome}
                  <span>{acabamento.nome}</span>
                </p>
                <p className="example-idea">{exemplo.ideia}</p>
                <button type="button" className="btn btn-sm" onClick={() => onUsar(exemplo)}>
                  <LuArrowUp aria-hidden="true" /> Usar esta ideia
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default ExampleGallery;
