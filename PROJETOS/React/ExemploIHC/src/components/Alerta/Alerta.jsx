import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi";
import "./Alerta.css";

/**
 * Mensagem de status do Design System.
 * Cada tipo tem cor, ÍCONE e TÍTULO próprios: a informação não depende só
 * da cor (WCAG 1.4.1), o que ajuda pessoas daltônicas.
 */
const TIPOS = {
  sucesso: { icone: FiCheckCircle, rotulo: "Sucesso" },
  erro: { icone: FiAlertCircle, rotulo: "Erro" },
  aviso: { icone: FiAlertTriangle, rotulo: "Atenção" },
  info: { icone: FiInfo, rotulo: "Informação" },
};

export default function Alerta({ tipo = "info", titulo, children, className = "", ...props }) {
  const { icone: Icone, rotulo } = TIPOS[tipo];
  return (
    <div className={`alerta alerta-${tipo} ${className}`} {...props}>
      <Icone className="alerta-icone" aria-hidden="true" />
      <div className="alerta-corpo">
        <p className="alerta-titulo">
          {titulo ?? rotulo}
        </p>
        {children && <div className="alerta-texto">{children}</div>}
      </div>
    </div>
  );
}
