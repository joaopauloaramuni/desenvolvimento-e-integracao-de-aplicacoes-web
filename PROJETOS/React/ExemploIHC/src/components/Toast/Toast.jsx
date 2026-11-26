import { useEffect, useRef, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import "./Toast.css";

const ICONES = { sucesso: FiCheckCircle, erro: FiAlertCircle, info: FiInfo };

/**
 * Um aviso flutuante (feedback de ação - Aula 18 / Nielsen #1).
 * Pausa a contagem enquanto o mouse ou o foco estão nele.
 */
export default function Toast({ tipo, mensagem, acao, duracao, onFechar }) {
  const [pausado, setPausado] = useState(false);
  const restante = useRef(duracao);
  const inicio = useRef(0);

  useEffect(() => {
    if (pausado) return undefined;
    inicio.current = Date.now();
    const timer = setTimeout(onFechar, restante.current);
    return () => {
      clearTimeout(timer);
      restante.current -= Date.now() - inicio.current;
    };
  }, [pausado, onFechar]);

  const Icone = ICONES[tipo] ?? FiInfo;

  return (
    <div
      className={`toast toast-${tipo}`}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <Icone className="toast-icone" aria-hidden="true" />
      <p className="toast-mensagem">{mensagem}</p>

      {acao && (
        <button
          type="button"
          className="toast-acao"
          onClick={() => {
            acao.onClick();
            onFechar();
          }}
        >
          {acao.rotulo}
        </button>
      )}

      <button type="button" className="toast-fechar" onClick={onFechar} aria-label="Fechar aviso">
        <FiX aria-hidden="true" />
      </button>
    </div>
  );
}
