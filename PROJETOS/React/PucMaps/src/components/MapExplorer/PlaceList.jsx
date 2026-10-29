import { useMemo, useState } from "react";
import { FiExternalLink, FiMaximize, FiNavigation, FiSearch, FiX } from "react-icons/fi";
import { normalizeText } from "../../core/classify";
import { typeInfo } from "../../core/placeTypes";

/**
 * Busca + filtro por tipo + lista de prédios, portarias e áreas do campus.
 */
export default function PlaceList({ places, selectedId, onSelect, onShowAll, onRouteTo }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");

  // Tipos que existem nos dados, com a quantidade de cada um
  const types = useMemo(() => {
    const count = new Map();
    for (const p of places) count.set(p.type, (count.get(p.type) ?? 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1]);
  }, [places]);

  const visible = useMemo(() => {
    const q = normalizeText(query.trim());
    return places.filter((p) => (type === "ALL" || p.type === type) && (!q || p.search.includes(q)));
  }, [places, query, type]);

  return (
    <>
      <div className="map-search">
        <FiSearch className="map-search-icon" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar prédio, cantina, portaria..."
          aria-label="Buscar local do campus"
          autoComplete="off"
        />
        {query && (
          <button type="button" className="map-search-clear" onClick={() => setQuery("")} aria-label="Limpar busca">
            <FiX aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="map-chips" role="group" aria-label="Filtrar por tipo">
        <button type="button" className={type === "ALL" ? "active" : ""} onClick={() => setType("ALL")}>
          Todos <span>{places.length}</span>
        </button>
        {types.map(([t, n]) => (
          <button key={t} type="button" className={type === t ? "active" : ""} onClick={() => setType(t)}>
            <i style={{ background: typeInfo(t).color }} aria-hidden="true" />
            {typeInfo(t).label} <span>{n}</span>
          </button>
        ))}
      </div>

      <div className="map-list-head">
        <h3>{visible.length === 1 ? "1 local" : `${visible.length} locais`}</h3>
        <button type="button" onClick={onShowAll}>
          <FiMaximize aria-hidden="true" /> Ver o campus todo
        </button>
      </div>

      {visible.length === 0 && (
        <p className="map-panel-info">Nenhum local com esse nome. Tente o número do prédio, ex.: 34.</p>
      )}

      <ul className="map-places">
        {visible.map((p) => {
          const info = typeInfo(p.type);
          const active = p.id === selectedId;
          return (
            <li key={p.id}>
              <button
                type="button"
                className={active ? "active" : ""}
                aria-pressed={active}
                onClick={() => onSelect(p.id)}
              >
                <img src={info.icon} alt="" width="26" height="26" />
                <span className="map-places-text">
                  <strong>{p.name}</strong>
                  <span>{info.label}</span>
                </span>
              </button>

              {active && (
                <div className="map-place-details">
                  <dl>
                    <div>
                      <dt>Código</dt>
                      <dd>{p.code}</dd>
                    </div>
                    <div>
                      <dt>Entradas mapeadas</dt>
                      <dd>{p.entrances.length || "nenhuma (usa o contorno)"}</dd>
                    </div>
                  </dl>
                  <div className="map-place-actions">
                    <button type="button" onClick={() => onRouteTo(p.id)}>
                      <FiNavigation aria-hidden="true" /> Rota até aqui
                    </button>
                    <a href={p.osmUrl} target="_blank" rel="noreferrer">
                      <FiExternalLink aria-hidden="true" /> Ver no OSM
                    </a>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
