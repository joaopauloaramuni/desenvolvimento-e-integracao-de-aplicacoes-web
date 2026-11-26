import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import "./StatusBadge.css";

// Status = cor + ícone + texto. Nunca só a cor (WCAG 1.4.1).
const STATUS = {
  pendente: { texto: "Pendente", icone: FiClock },
  confirmada: { texto: "Confirmada", icone: FiCheckCircle },
  rejeitada: { texto: "Rejeitada", icone: FiXCircle },
};

export default function StatusBadge({ status }) {
  const { texto, icone: Icone } = STATUS[status];
  return (
    <span className={`status status-${status}`}>
      <Icone aria-hidden="true" />
      {texto}
    </span>
  );
}
