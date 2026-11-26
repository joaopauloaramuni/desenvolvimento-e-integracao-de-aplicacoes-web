import { FiCheck } from "react-icons/fi";
import "./Stepper.css";

/**
 * Indicador de etapas de um formulário longo (Aula 18: "quebre formulários
 * longos em etapas"). Mostra onde o usuário está e quanto falta
 * (Nielsen #1 - visibilidade do status do sistema).
 */
export default function Stepper({ etapas, atual }) {
  return (
    <nav aria-label="Etapas da reserva" className="stepper">
      <p className="stepper-resumo">
        Etapa {atual + 1} de {etapas.length}: <strong>{etapas[atual]}</strong>
      </p>
      <ol className="stepper-lista">
        {etapas.map((etapa, i) => {
          const estado = i < atual ? "feita" : i === atual ? "atual" : "futura";
          return (
            <li key={etapa} className={`stepper-item stepper-${estado}`} aria-current={i === atual ? "step" : undefined}>
              <span className="stepper-marcador" aria-hidden="true">
                {estado === "feita" ? <FiCheck /> : i + 1}
              </span>
              <span className="stepper-rotulo">
                {etapa}
                {estado === "feita" && <span className="sr-only"> (concluída)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
