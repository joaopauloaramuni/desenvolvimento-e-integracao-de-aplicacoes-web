import { FiClock, FiCrosshair } from "react-icons/fi";
import { staticMapUrl } from "../../services/locationIqService";
import { formatCoordinates, formatOffset, localTime } from "../../utils/format";

// Campos do endereço (addressdetails=1) que vale a pena mostrar, na ordem
const FIELDS = [
  ["road", "Rua"],
  ["house_number", "Número"],
  ["neighbourhood", "Vizinhança"],
  ["suburb", "Bairro"],
  ["city", "Cidade"],
  ["state", "Estado"],
  ["postcode", "CEP"],
  ["country", "País"],
];

/**
 * Aba "Ponto": Reverse Geocoding + Timezone + Static Map de um ponto.
 * O ponto vem de um clique no mapa, de uma busca ou de uma unidade da PUC.
 */
export default function PointPanel({ point, info }) {
  if (!point) {
    return (
      <div className="liq-panel">
        <div className="liq-empty-state">
          <FiCrosshair aria-hidden="true" />
          <p>Clique em qualquer lugar do mapa para descobrir o endereço daquele ponto.</p>
        </div>
      </div>
    );
  }

  const { loading, error, reverse, timezone } = info;
  const fields = reverse ? FIELDS.filter(([key]) => reverse.details[key]) : [];

  return (
    <div className="liq-panel">
      <div className="liq-section-head">
        <h3>Reverse geocoding</h3>
      </div>

      <div className="liq-detail">
        <span className="liq-coords">{formatCoordinates(point.coordinates)}</span>
        {loading && <p className="liq-info">Buscando endereço...</p>}
        {error && <p className="liq-info error">{error}</p>}
        {!loading && !error && !reverse && <p className="liq-empty">Nenhum endereço encontrado neste ponto.</p>}

        {reverse && (
          <>
            <strong className="liq-detail-title">{reverse.name}</strong>
            <p className="liq-detail-address">{reverse.displayName}</p>
            {fields.length > 0 && (
              <dl className="liq-fields">
                {fields.map(([key, label]) => (
                  <div key={key}>
                    <dt>{label}</dt>
                    <dd>{reverse.details[key]}</dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        )}
      </div>

      {timezone && (
        <>
          <div className="liq-section-head">
            <h3>Fuso horário</h3>
          </div>
          <div className="liq-timezone">
            <FiClock aria-hidden="true" />
            <div>
              <strong>{localTime(timezone.name)}</strong>
              <span>
                {timezone.name} · {formatOffset(timezone.offsetSec)}
                {timezone.nowInDst && " · horário de verão"}
              </span>
            </div>
          </div>
        </>
      )}

      <div className="liq-section-head">
        <h3>Static map</h3>
      </div>
      <img
        className="liq-static-map"
        src={staticMapUrl(point.coordinates)}
        alt={`Mapa estático de ${reverse?.name ?? "ponto escolhido"}`}
        loading="lazy"
      />
      <p className="liq-hint">Uma imagem PNG pronta, gerada só com a URL. Boa para e-mails e PDFs.</p>
    </div>
  );
}
