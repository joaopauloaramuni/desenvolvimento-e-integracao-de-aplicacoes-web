import { useCallback, useMemo, useRef, useState } from "react";
import { FiCompass, FiCrosshair, FiExternalLink, FiNavigation, FiSearch } from "react-icons/fi";
import LOCATIONIQ_CONFIG from "../../config/locationIqConfig";
import { directions, nearby, reverse, timezone } from "../../services/locationIqService";
import { formatCoordinates } from "../../utils/format";
import LiqMap from "../LiqMap/LiqMap";
import NearbyPanel from "./NearbyPanel";
import PointPanel from "./PointPanel";
import RequestLog from "./RequestLog";
import RoutePanel from "./RoutePanel";
import SearchPanel from "./SearchPanel";
import TokenMissing from "./TokenMissing";
import "./LocationExplorer.css";

const TABS = [
  { id: "buscar", label: "Buscar", icon: FiSearch },
  { id: "ponto", label: "Ponto", icon: FiCrosshair },
  { id: "perto", label: "Perto", icon: FiCompass },
  { id: "rota", label: "Rota", icon: FiNavigation },
];

const IDLE = { loading: false, error: null, done: false };
const NO_POIS = []; // array fixo: um [] novo a cada render recriaria os marcadores

/**
 * Exemplo completo do LocationIQ, em abas:
 *   Buscar → Autocomplete + Search (forward geocoding)
 *   Ponto  → Reverse geocoding + Timezone + Static map
 *   Perto  → Nearby (pontos de interesse)
 *   Rota   → Directions
 * Embaixo, o painel com cada requisição feita.
 *
 * <LocationExplorer places={PLACES} />
 */
export default function LocationExplorer({ places }) {
  const [tab, setTab] = useState("buscar");
  const [styleId, setStyleId] = useState(LOCATIONIQ_CONFIG.STYLES[0].id);
  const [focus, setFocus] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  // Ponto escolhido (busca ou clique) + o que a API disse sobre ele
  const [point, setPoint] = useState(null);
  const [pointInfo, setPointInfo] = useState({ ...IDLE, key: null, reverse: null, timezone: null });
  const keyRef = useRef(0);
  const pointAbortRef = useRef(null);

  // Nearby
  const [tag, setTag] = useState(LOCATIONIQ_CONFIG.NEARBY_TAGS[0].id);
  const [radius, setRadius] = useState(LOCATIONIQ_CONFIG.NEARBY_RADIUS[1]);
  const [pois, setPois] = useState([]);
  const [nearbyState, setNearbyState] = useState(IDLE);

  // Rota
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [profile, setProfile] = useState(LOCATIONIQ_CONFIG.PROFILES[0].id);
  const [route, setRoute] = useState(null);
  const [routeState, setRouteState] = useState(IDLE);

  const selectedPlace = places.find((p) => p.id === selectedPlaceId) ?? null;
  // "Onde estou olhando": o ponto escolhido ou, se não houver, a unidade selecionada
  const center = point ?? selectedPlace;

  const routeEnds = useMemo(
    () => [origin && { ...origin, role: "origin" }, destination && { ...destination, role: "destination" }],
    [origin, destination]
  );

  /* ---------- Reverse + Timezone de um ponto ---------- */
  const loadPointInfo = useCallback(async (target) => {
    pointAbortRef.current?.abort();
    const controller = new AbortController();
    pointAbortRef.current = controller;
    setPointInfo({ ...IDLE, loading: true, key: target.key, reverse: null, timezone: null });
    try {
      // Uma depois da outra: o serviço respeita o limite de 2 por segundo
      const address = await reverse(target.coordinates, { signal: controller.signal });
      const zone = await timezone(target.coordinates, { signal: controller.signal });
      setPointInfo({ ...IDLE, done: true, key: target.key, reverse: address, timezone: zone });
      // Ponto vindo de um clique: troca "Ponto no mapa" pelo endereço de verdade
      if (target.fromClick && address) {
        setPoint((current) =>
          current?.key === target.key ? { ...current, name: address.name, address: address.address } : current
        );
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setPointInfo({ ...IDLE, error: error.message, key: target.key, reverse: null, timezone: null });
      }
    }
  }, []);

  const choosePoint = (item, { fly = true, fromClick = false } = {}) => {
    const next = { name: item.name, address: item.address, coordinates: item.coordinates, key: ++keyRef.current, fromClick };
    setPoint(next);
    setSelectedPlaceId(null);
    if (fly) setFocus({ center: item.coordinates, zoom: 16 });
    return next;
  };

  const choosePlace = (id) => {
    const place = places.find((p) => p.id === id);
    setPoint(null);
    setSelectedPlaceId(id);
    if (place) setFocus({ center: place.coordinates, zoom: 15 });
  };

  const showAll = () => {
    setSelectedPlaceId(null);
    setPoint(null);
    setFocus({ bounds: places.map((p) => p.coordinates), maxZoom: 13 });
  };

  /* ---------- Troca de aba ---------- */
  const goTo = (id) => {
    setTab(id);
    if (id === "ponto") {
      // Sem ponto mas com unidade selecionada: usa a unidade
      const target = point ?? (selectedPlace && choosePoint(selectedPlace, { fly: false }));
      if (target && pointInfo.key !== target.key) loadPointInfo(target);
    }
    if (id === "rota" && center && !destination) setDestination({ name: center.name, address: center.address, coordinates: center.coordinates });
  };

  /* ---------- Clique no mapa ---------- */
  const handleMapClick = (coordinates) => {
    const clicked = { name: "Ponto no mapa", address: formatCoordinates(coordinates), coordinates };

    if (tab === "rota") {
      // Na aba Rota, o clique preenche a origem e depois o destino
      const end = { ...clicked };
      if (!origin) setOrigin(end);
      else setDestination(end);
      setRoute(null);
      setRouteState(IDLE);
      return;
    }

    const next = choosePoint(clicked, { fly: false, fromClick: true });
    setTab("ponto");
    loadPointInfo(next);
  };

  /* ---------- Nearby ---------- */
  const searchNearby = async () => {
    if (!center) return;
    setNearbyState({ ...IDLE, loading: true });
    try {
      const found = (await nearby(center.coordinates, { tag, radius })).sort((a, b) => a.distance - b.distance);
      setPois(found);
      setNearbyState({ ...IDLE, done: true });
      setFocus({ bounds: [center.coordinates, ...found.map((poi) => poi.coordinates)], maxZoom: 16 });
    } catch (error) {
      setPois([]);
      setNearbyState({ ...IDLE, error: error.message });
    }
  };

  /* ---------- Rota ---------- */
  const traceRoute = async (profileId = profile) => {
    if (!origin || !destination) return;
    setRouteState({ ...IDLE, loading: true });
    try {
      const result = await directions(profileId, origin.coordinates, destination.coordinates);
      setRoute(result);
      setRouteState({ ...IDLE, done: true });
      if (result) setFocus({ bounds: result.geometry.coordinates, maxZoom: 16 });
    } catch (error) {
      setRoute(null);
      setRouteState({ ...IDLE, error: error.message });
    }
  };

  const changeEnd = (setter) => (value) => {
    setter(value);
    setRoute(null);
    setRouteState(IDLE);
  };

  const changeProfile = (id) => {
    setProfile(id);
    if (route) traceRoute(id); // já tinha rota: recalcula com o novo meio
  };

  const swapEnds = () => {
    setOrigin(destination);
    setDestination(origin);
    setRoute(null);
    setRouteState(IDLE);
  };

  const clearRoute = () => {
    setRoute(null);
    setOrigin(null);
    setDestination(null);
    setRouteState(IDLE);
  };

  if (!LOCATIONIQ_CONFIG.TOKEN) return <TokenMissing />;

  return (
    <div className="liq-explorer">
      <div className="liq-grid">
        {/* ---------- Lateral: abas ---------- */}
        <aside className="liq-sidebar">
          <nav className="liq-tabs" role="tablist" aria-label="Recursos do LocationIQ">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={tab === id ? "active" : ""}
                onClick={() => goTo(id)}
              >
                <Icon aria-hidden="true" /> {label}
              </button>
            ))}
          </nav>

          <div className="liq-tab-body" role="tabpanel">
            {tab === "buscar" && (
              <SearchPanel
                places={places}
                selectedPlaceId={selectedPlaceId}
                point={point}
                onChoosePlace={choosePlace}
                onShowAll={showAll}
                onChoosePoint={(item) => choosePoint(item)}
                onGo={goTo}
              />
            )}
            {tab === "ponto" && <PointPanel point={point} info={pointInfo} />}
            {tab === "perto" && (
              <NearbyPanel
                center={center}
                tag={tag}
                radius={radius}
                onTag={setTag}
                onRadius={setRadius}
                state={nearbyState}
                pois={pois}
                onSearch={searchNearby}
                onFocusPoi={(poi) => setFocus({ center: poi.coordinates, zoom: 17 })}
              />
            )}
            {tab === "rota" && (
              <RoutePanel
                places={places}
                point={point}
                origin={origin}
                destination={destination}
                onOrigin={changeEnd(setOrigin)}
                onDestination={changeEnd(setDestination)}
                onSwap={swapEnds}
                profile={profile}
                onProfile={changeProfile}
                state={routeState}
                route={route}
                onRoute={traceRoute}
                onClear={clearRoute}
              />
            )}
          </div>

          {/* O plano gratuito pede este crédito junto dos resultados da busca */}
          <a className="liq-attribution" href="https://locationiq.com/" target="_blank" rel="noopener noreferrer">
            Search by LocationIQ.com <FiExternalLink aria-hidden="true" />
          </a>
        </aside>

        {/* ---------- Mapa + estilos ---------- */}
        <div className="liq-stage">
          <div className="liq-styles" role="group" aria-label="Estilo do mapa">
            {LOCATIONIQ_CONFIG.STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={s.id === styleId ? "active" : ""}
                aria-pressed={s.id === styleId}
                onClick={() => setStyleId(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <LiqMap
            styleId={styleId}
            places={places}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={choosePlace}
            point={point}
            pois={tab === "perto" ? pois : NO_POIS}
            route={route}
            routeEnds={routeEnds}
            focus={focus}
            onMapClick={handleMapClick}
          />

          <p className="liq-map-hint">
            {tab === "rota" ? "Clique no mapa para marcar a origem e o destino" : "Clique no mapa para ver o endereço"}
          </p>
        </div>
      </div>

      <RequestLog />
    </div>
  );
}
