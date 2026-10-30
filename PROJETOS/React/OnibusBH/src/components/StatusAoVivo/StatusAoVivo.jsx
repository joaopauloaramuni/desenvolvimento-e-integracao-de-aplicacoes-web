import { FiAlertTriangle, FiWifiOff } from "react-icons/fi";
import "./StatusAoVivo.css";

const hora = (timestamp) =>
  timestamp
    ? new Date(timestamp * 1000).toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" })
    : null;

/** Faixa sobre o mapa: quantos ônibus da linha estão rodando agora. */
export default function StatusAoVivo({ situacao, veiculos, atualizadoEm, erro }) {
  if (situacao === "carregando") {
    return <div className="ao-vivo ao-vivo-neutro">Procurando os ônibus desta linha...</div>;
  }

  if (situacao === "desligado") {
    return (
      <div className="ao-vivo ao-vivo-neutro" title={erro ?? undefined}>
        <FiWifiOff aria-hidden="true" />
        <span>
          Posição ao vivo desligada neste servidor. Configure o <code>PBH_GTFS_RT_URL</code> (veja o README).
        </span>
      </div>
    );
  }

  if (situacao === "erro") {
    return (
      <div className="ao-vivo ao-vivo-erro" role="status">
        <FiAlertTriangle aria-hidden="true" />
        <span>{erro} Tentando de novo em instantes.</span>
      </div>
    );
  }

  const n = veiculos.length;
  return (
    <div className="ao-vivo" role="status">
      <span className="ao-vivo-pulso" aria-hidden="true" />
      <span>
        <strong>
          {n === 0 ? "Nenhum ônibus desta linha" : n === 1 ? "1 ônibus" : `${n} ônibus`}
        </strong>{" "}
        rodando agora
        {atualizadoEm && <small> · atualizado às {hora(atualizadoEm)}</small>}
      </span>
    </div>
  );
}
