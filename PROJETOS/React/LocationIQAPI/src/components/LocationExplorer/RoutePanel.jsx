import { FiNavigation, FiRepeat, FiTrash2, FiX } from "react-icons/fi";
import LOCATIONIQ_CONFIG from "../../config/locationIqConfig";
import { formatDistance, formatDuration, maneuverText } from "../../utils/format";

function RouteEnd({ role, label, value, places, point, onChange }) {
  const usePlace = (event) => {
    const place = places.find((p) => p.id === event.target.value);
    if (place) onChange({ name: place.name, address: place.address, coordinates: place.coordinates });
    event.target.value = "";
  };

  return (
    <div className={`liq-route-end ${role}`}>
      <span className="liq-route-badge">{role === "origin" ? "A" : "B"}</span>
      <div className="liq-route-end-body">
        <span className="liq-route-label">{label}</span>
        {value ? (
          <strong title={value.address}>{value.name}</strong>
        ) : (
          <span className="liq-route-placeholder">Clique no mapa ou escolha abaixo</span>
        )}
        <div className="liq-route-end-actions">
          <select defaultValue="" onChange={usePlace} aria-label={`${label}: unidade PUC Minas`}>
            <option value="" disabled>
              Unidade PUC Minas
            </option>
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
          {point && (
            <button type="button" onClick={() => onChange({ ...point })}>
              Ponto escolhido
            </button>
          )}
        </div>
      </div>
      {value && (
        <button type="button" className="liq-route-clear" onClick={() => onChange(null)} aria-label={`Limpar ${label}`}>
          <FiX aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/**
 * Aba "Rota": Directions API (carro, a pé ou bicicleta) entre A e B,
 * com a linha no mapa e o passo a passo em português.
 */
export default function RoutePanel({
  places,
  point,
  origin,
  destination,
  onOrigin,
  onDestination,
  onSwap,
  profile,
  onProfile,
  state,
  route,
  onRoute,
  onClear,
}) {
  return (
    <div className="liq-panel">
      <div className="liq-route-ends">
        <RouteEnd role="origin" label="Origem" value={origin} places={places} point={point} onChange={onOrigin} />
        <button type="button" className="liq-swap" onClick={onSwap} aria-label="Inverter origem e destino">
          <FiRepeat aria-hidden="true" />
        </button>
        <RouteEnd
          role="destination"
          label="Destino"
          value={destination}
          places={places}
          point={point}
          onChange={onDestination}
        />
      </div>

      <div className="liq-segmented" role="group" aria-label="Meio de transporte">
        {LOCATIONIQ_CONFIG.PROFILES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === profile ? "active" : ""}
            aria-pressed={item.id === profile}
            onClick={() => onProfile(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button type="button" className="liq-primary" onClick={() => onRoute()} disabled={!origin || !destination || state.loading}>
        <FiNavigation aria-hidden="true" /> {state.loading ? "Calculando..." : "Traçar rota"}
      </button>

      {state.error && <p className="liq-info error">{state.error}</p>}
      {state.done && !state.error && !route && <p className="liq-empty">Não há rota entre esses pontos.</p>}

      {route && (
        <>
          <div className="liq-route-summary">
            <div>
              <strong>{formatDuration(route.duration)}</strong>
              <span>{formatDistance(route.distance)}</span>
            </div>
            <button type="button" onClick={onClear}>
              <FiTrash2 aria-hidden="true" /> Limpar
            </button>
          </div>

          <ol className="liq-steps">
            {route.steps.map((step, index) => (
              <li key={index}>
                <span>{maneuverText(step)}</span>
                {step.distance > 0 && <small>{formatDistance(step.distance)}</small>}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
