import { useMemo, useState } from "react";
import { FiAlertTriangle, FiGitBranch, FiList, FiNavigation, FiRefreshCw } from "react-icons/fi";
import MAP_CONFIG from "../../config/mapConfig";
import { findRoute } from "../../core/graph";
import useCampusData from "../../hooks/useCampusData";
import CampusMap from "../CampusMap/CampusMap";
import DataSource from "./DataSource";
import GraphPanel from "./GraphPanel";
import PlaceList from "./PlaceList";
import RoutePanel from "./RoutePanel";
import "./MapExplorer.css";

const TABS = [
  { id: "places", label: "Locais", icon: FiList },
  { id: "routes", label: "Rotas", icon: FiNavigation },
  { id: "graph", label: "Grafo", icon: FiGitBranch },
];

/**
 * Lateral com abas (Locais, Rotas, Grafo) + mapa do campus.
 * Os dados vêm do OpenStreetMap; nada de back-end ou banco de dados.
 */
export default function MapExplorer() {
  const { status, error, meta, campus, updating, reload } = useCampusData();

  const [tab, setTab] = useState("places");
  const [baseId, setBaseId] = useState(MAP_CONFIG.BASES[0].id);
  const [selectedId, setSelectedId] = useState(null);
  const [fitKey, setFitKey] = useState(0);

  // Rotas
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const selected = campus?.placesById.get(selectedId) ?? null;

  // A rota é recalculada sempre que origem, destino ou "acessível" mudam (Dijkstra roda em ms)
  const route = useMemo(() => {
    if (!campus || !fromId || !toId || fromId === toId) return null;
    const result = findRoute(campus.graph, fromId, toId, { accessibleOnly });
    return result ? { ...result, fromId, toId } : { notFound: true, fromId, toId };
  }, [campus, fromId, toId, accessibleOnly]);

  // Clique no mapa: na aba Rotas preenche origem/destino; nas outras, seleciona o local
  const handleMapSelect = (id) => {
    if (tab === "routes") {
      if (!fromId || (fromId && toId)) {
        setFromId(id);
        setToId("");
      } else if (id !== fromId) {
        setToId(id);
      }
      return;
    }
    setSelectedId(id);
  };

  const showAll = () => {
    setSelectedId(null);
    setFitKey((k) => k + 1);
  };

  return (
    <div className="map-explorer">
      {/* ---------- Lateral ---------- */}
      <aside className="map-sidebar">
        <div className="map-tabs" role="tablist" aria-label="Painéis">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              <Icon aria-hidden="true" /> {label}
            </button>
          ))}
        </div>

        <div className="map-panel" role="tabpanel">
          {status === "loading" && !campus && <p className="map-panel-info">Carregando os locais do campus...</p>}

          {status === "error" && (
            <div className="map-panel-error">
              <FiAlertTriangle aria-hidden="true" />
              <p>Não foi possível carregar os dados do campus: {error}</p>
              <button type="button" onClick={reload}>
                <FiRefreshCw aria-hidden="true" /> Tentar de novo
              </button>
            </div>
          )}

          {campus && tab === "places" && (
            <PlaceList
              places={campus.places}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onShowAll={showAll}
              onRouteTo={(id) => {
                setToId(id);
                if (fromId === id) setFromId("");
                setTab("routes");
              }}
            />
          )}

          {campus && tab === "routes" && (
            <RoutePanel
              places={campus.places}
              placesById={campus.placesById}
              fromId={fromId}
              toId={toId}
              onFrom={setFromId}
              onTo={setToId}
              accessibleOnly={accessibleOnly}
              onAccessibleOnly={setAccessibleOnly}
              route={route}
            />
          )}

          {campus && tab === "graph" && (
            <GraphPanel stats={campus.graph.stats} showGraph={showGraph} onShowGraph={setShowGraph} />
          )}
        </div>

        <DataSource meta={meta} campus={campus} updating={updating} onReload={reload} />
      </aside>

      {/* ---------- Mapa ---------- */}
      <div className="map-stage">
        <div className="map-bases" role="group" aria-label="Fundo do mapa">
          {MAP_CONFIG.BASES.map((b) => (
            <button
              key={b.id}
              type="button"
              className={b.id === baseId ? "active" : ""}
              aria-pressed={b.id === baseId}
              onClick={() => setBaseId(b.id)}
            >
              {b.label}
            </button>
          ))}
        </div>

        {!campus && status !== "error" && (
          <div className="map-loading" role="status">
            <span className="map-spinner" aria-hidden="true" />
            Carregando os prédios e caminhos do campus...
          </div>
        )}

        <CampusMap
          campus={campus}
          baseId={baseId}
          showGraph={showGraph}
          selected={selected}
          onSelect={handleMapSelect}
          route={route && !route.notFound ? route : null}
          fitKey={fitKey}
        />
      </div>
    </div>
  );
}
