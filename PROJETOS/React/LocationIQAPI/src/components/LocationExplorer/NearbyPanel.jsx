import { FiCompass } from "react-icons/fi";
import LOCATIONIQ_CONFIG from "../../config/locationIqConfig";
import { formatDistance } from "../../utils/format";

/**
 * Aba "Perto": Nearby API (pontos de interesse ao redor de um ponto).
 * A busca só roda no botão, para não gastar a cota a cada troca de filtro.
 */
export default function NearbyPanel({ center, tag, radius, onTag, onRadius, state, pois, onSearch, onFocusPoi }) {
  return (
    <div className="liq-panel">
      <div className="liq-section-head">
        <h3>Ao redor de</h3>
      </div>
      <p className="liq-center">
        {center ? center.name : "Escolha um ponto na busca, numa unidade ou com um clique no mapa."}
      </p>

      <div className="liq-section-head">
        <h3>O que procurar</h3>
      </div>
      <div className="liq-chips" role="group" aria-label="Categoria">
        {LOCATIONIQ_CONFIG.NEARBY_TAGS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === tag ? "active" : ""}
            aria-pressed={item.id === tag}
            onClick={() => onTag(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="liq-section-head">
        <h3>Raio</h3>
      </div>
      <div className="liq-segmented" role="group" aria-label="Raio da busca">
        {LOCATIONIQ_CONFIG.NEARBY_RADIUS.map((value) => (
          <button
            key={value}
            type="button"
            className={value === radius ? "active" : ""}
            aria-pressed={value === radius}
            onClick={() => onRadius(value)}
          >
            {formatDistance(value)}
          </button>
        ))}
      </div>

      <button type="button" className="liq-primary" onClick={onSearch} disabled={!center || state.loading}>
        <FiCompass aria-hidden="true" /> {state.loading ? "Buscando..." : "Buscar ao redor"}
      </button>

      {state.error && <p className="liq-info error">{state.error}</p>}
      {state.done && !state.error && pois.length === 0 && (
        <p className="liq-empty">Nada dessa categoria neste raio. Aumente o raio ou troque a categoria.</p>
      )}

      {pois.length > 0 && (
        <>
          <div className="liq-section-head">
            <h3>Encontrados</h3>
            <span>{pois.length}</span>
          </div>
          <ul className="liq-list">
            {pois.map((poi) => (
              <li key={poi.id}>
                <button type="button" onClick={() => onFocusPoi(poi)}>
                  <span className="liq-dot" aria-hidden="true" />
                  <span className="liq-list-text">
                    <strong>{poi.name}</strong>
                    <span>{poi.address}</span>
                  </span>
                  <span className="liq-distance">{formatDistance(poi.distance)}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
