import { useMemo } from "react";
import { FiAlertTriangle, FiClock, FiRepeat, FiTrendingUp, FiX } from "react-icons/fi";
import { TbStairs, TbWheelchair } from "react-icons/tb";
import { typeInfo } from "../../core/placeTypes";

const formatMeters = (m) => (m >= 1000 ? `${(m / 1000).toFixed(2).replace(".", ",")} km` : `${Math.round(m)} m`);
const formatTime = (s) => {
  const min = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return min ? `${min} min ${sec.toString().padStart(2, "0")} s` : `${sec} s`;
};

/**
 * Origem + destino + "rota acessível". A rota é calculada com Dijkstra no navegador.
 * Dica: com esta aba aberta, clique no mapa para escolher origem e destino.
 */
export default function RoutePanel({
  places,
  placesById,
  fromId,
  toId,
  onFrom,
  onTo,
  accessibleOnly,
  onAccessibleOnly,
  route,
}) {
  // Opções agrupadas por tipo (<optgroup>)
  const groups = useMemo(() => {
    const map = new Map();
    for (const p of places) {
      const label = typeInfo(p.type).label;
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(p);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], "pt-BR"));
  }, [places]);

  const options = (
    <>
      <option value="">Escolha um local</option>
      {groups.map(([label, list]) => (
        <optgroup key={label} label={label}>
          {list.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </optgroup>
      ))}
    </>
  );

  const swap = () => {
    onFrom(toId);
    onTo(fromId);
  };

  const clear = () => {
    onFrom("");
    onTo("");
  };

  return (
    <div className="route-panel">
      <p className="map-panel-hint">Escolha nas listas ou clique no mapa: o 1º clique é a origem, o 2º o destino.</p>

      <label className="route-field">
        <span>
          <i className="route-dot start" aria-hidden="true" /> Origem
        </span>
        <select value={fromId} onChange={(e) => onFrom(e.target.value)}>
          {options}
        </select>
      </label>

      <div className="route-tools">
        <button type="button" onClick={swap} disabled={!fromId && !toId}>
          <FiRepeat aria-hidden="true" /> Inverter
        </button>
        <button type="button" onClick={clear} disabled={!fromId && !toId}>
          <FiX aria-hidden="true" /> Limpar
        </button>
      </div>

      <label className="route-field">
        <span>
          <i className="route-dot end" aria-hidden="true" /> Destino
        </span>
        <select value={toId} onChange={(e) => onTo(e.target.value)}>
          {options}
        </select>
      </label>

      <label className="route-check">
        <input type="checkbox" checked={accessibleOnly} onChange={(e) => onAccessibleOnly(e.target.checked)} />
        <TbWheelchair aria-hidden="true" />
        Rota acessível (evita escadas)
      </label>

      {fromId && toId && fromId === toId && (
        <p className="map-panel-info">Origem e destino são o mesmo local.</p>
      )}

      {route?.notFound && (
        <div className="route-empty">
          <FiAlertTriangle aria-hidden="true" />
          <p>
            Não há caminho entre esses dois locais nos dados do OpenStreetMap
            {accessibleOnly ? " sem passar por escadas. Desmarque “Rota acessível” para ver o caminho mais rápido." : "."}
          </p>
        </div>
      )}

      {route && !route.notFound && (
        <div className="route-card">
          <div className="route-card-ends">
            <div>
              <small>Origem</small>
              <strong>{placesById.get(route.fromId)?.name}</strong>
            </div>
            <div>
              <small>Destino</small>
              <strong>{placesById.get(route.toId)?.name}</strong>
            </div>
          </div>
          <dl className="route-card-stats">
            <div>
              <dt>
                <FiTrendingUp aria-hidden="true" /> Distância
              </dt>
              <dd>{formatMeters(route.meters)}</dd>
            </div>
            <div>
              <dt>
                <FiClock aria-hidden="true" /> Tempo a pé
              </dt>
              <dd>{formatTime(route.seconds)}</dd>
            </div>
            <div>
              <dt>
                <TbStairs aria-hidden="true" /> Escadas
              </dt>
              <dd>{route.stairs ? `${route.stairs} trecho${route.stairs > 1 ? "s" : ""}` : "nenhuma"}</dd>
            </div>
          </dl>
          <p className="route-card-note">
            Tempo estimado a 1,4 m/s; escadas contam 3× e piso irregular 1,5×, como no projeto original.
          </p>
        </div>
      )}
    </div>
  );
}
