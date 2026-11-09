import { useId, useState } from "react";
import { fotosDe } from "../../services/elencoService";
import "./FotoJogador.css";

// Silhueta com a camisa listrada, usada quando não há foto (ou ela não carrega)
function Silhueta({ numero }) {
  const id = useId();
  return (
    <svg className="foto-silhueta" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <pattern id={`listras${id}`} width="16" height="10" patternUnits="userSpaceOnUse">
          <rect width="8" height="10" fill="#000" />
          <rect x="8" width="8" height="10" fill="#fff" />
        </pattern>
      </defs>
      <circle cx="50" cy="34" r="17" fill="#3a3a3a" />
      <path d="M14 100 C16 72 30 60 50 60 C70 60 84 72 86 100 Z" fill={`url(#listras${id})`} stroke="#000" strokeWidth="2" />
      {numero != null && (
        <text x="50" y="90" textAnchor="middle" className="foto-silhueta-num">
          {numero}
        </text>
      )}
    </svg>
  );
}

/** Foto do jogador: local, depois a oficial do site, depois a silhueta */
export default function FotoJogador({ jogador, className = "" }) {
  const fotos = fotosDe(jogador);
  const [falhas, setFalhas] = useState(() => new Set());
  const url = fotos.find((f) => !falhas.has(f));

  return (
    <div className={`foto ${className}`}>
      {url ? (
        <img
          key={url}
          src={url}
          alt=""
          loading="lazy"
          draggable="false"
          onError={() => setFalhas((atual) => new Set(atual).add(url))}
        />
      ) : (
        <Silhueta numero={jogador?.numero} />
      )}
    </div>
  );
}
