import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// O MapLibre 6 roda o desenho num Web Worker: o Vite empacota o worker e nos dá a URL dele
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { useEffect, useRef } from "react";
import LOCATIONIQ_CONFIG, { styleUrl } from "../../config/locationIqConfig";
import "./LiqMap.css";

maplibregl.setWorkerUrl(workerUrl);

/**
 * Mapa do MapLibre GL JS desenhado com os vector tiles do LocationIQ.
 *
 * O maplibre-gl não é um componente React: ele desenha num <div> que nós
 * entregamos. O mapa é criado UMA vez num useEffect, fica num useRef, e as
 * mudanças de props viram chamadas aos métodos dele (setStyle, flyTo, fitBounds...).
 *
 * <LiqMap places={PLACES} point={...} pois={[...]} route={...} focus={...} onMapClick={fn} />
 */

const ROUTE_SOURCE = "liq-route";

// Popup montado com textContent: nada do que vem da API vira HTML
function popupContent(title, subtitle) {
  const box = document.createElement("div");
  box.className = "liq-popup";
  const strong = document.createElement("strong");
  strong.textContent = title;
  box.append(strong);
  if (subtitle) {
    const span = document.createElement("span");
    span.textContent = subtitle;
    box.append(span);
  }
  return box;
}

const popup = (title, subtitle, offset = 22) =>
  new maplibregl.Popup({ offset, closeButton: false, maxWidth: "260px" }).setDOMContent(popupContent(title, subtitle));

function pinElement(className, label, text = "") {
  const element = document.createElement("button");
  element.type = "button";
  element.className = className;
  element.setAttribute("aria-label", label);
  // O MapLibre posiciona o marcador com "transform" no próprio elemento,
  // então o pino girado fica num <span> de dentro
  const pin = document.createElement("span");
  pin.className = "liq-marker-pin";
  const inner = document.createElement("span");
  inner.textContent = text;
  pin.append(inner);
  element.append(pin);
  return element;
}

// Linha da rota: some quando o estilo muda, então é (re)desenhada a cada "style.load"
function drawRoute(map, route) {
  if (!map.isStyleLoaded()) return;
  if (map.getLayer(`${ROUTE_SOURCE}-line`)) map.removeLayer(`${ROUTE_SOURCE}-line`);
  if (map.getLayer(`${ROUTE_SOURCE}-casing`)) map.removeLayer(`${ROUTE_SOURCE}-casing`);
  if (map.getSource(ROUTE_SOURCE)) map.removeSource(ROUTE_SOURCE);
  if (!route) return;

  map.addSource(ROUTE_SOURCE, { type: "geojson", data: { type: "Feature", geometry: route.geometry } });
  const layout = { "line-join": "round", "line-cap": "round" };
  map.addLayer({
    id: `${ROUTE_SOURCE}-casing`,
    type: "line",
    source: ROUTE_SOURCE,
    layout,
    paint: { "line-color": "#00334f", "line-width": 9, "line-opacity": 0.35 },
  });
  map.addLayer({
    id: `${ROUTE_SOURCE}-line`,
    type: "line",
    source: ROUTE_SOURCE,
    layout,
    paint: { "line-color": "#0a6ea6", "line-width": 5 },
  });
}

export default function LiqMap({
  styleId = LOCATIONIQ_CONFIG.STYLES[0].id,
  places = [],
  selectedPlaceId = null,
  onSelectPlace,
  point = null,
  pois = [],
  route = null,
  routeEnds = [],
  focus = null,
  onMapClick,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const styleRef = useRef(styleId);
  const routeRef = useRef(route);
  const placeMarkersRef = useRef(new Map());
  const callbacksRef = useRef({ onSelectPlace, onMapClick });

  // Sempre as versões mais novas das funções, sem recriar o mapa
  useEffect(() => {
    callbacksRef.current = { onSelectPlace, onMapClick };
  }, [onSelectPlace, onMapClick]);

  /* ---------- Cria o mapa uma única vez ---------- */
  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl(styleRef.current),
      center: LOCATIONIQ_CONFIG.CENTER,
      zoom: LOCATIONIQ_CONFIG.ZOOM,
      attributionControl: { compact: true },
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(new maplibregl.FullscreenControl(), "top-right");
    map.addControl(
      new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }),
      "top-right"
    );
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

    map.on("click", (event) => callbacksRef.current.onMapClick?.([event.lngLat.lng, event.lngLat.lat]));
    map.on("style.load", () => drawRoute(map, routeRef.current));

    mapRef.current = map;
    return () => {
      // Libera o WebGL quando o componente sai da tela
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* ---------- Troca de estilo (ruas, claro, escuro) ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleRef.current === styleId) return;
    styleRef.current = styleId;
    // diff: false → carrega o estilo do zero e dispara "style.load" (que redesenha a rota)
    map.setStyle(styleUrl(styleId), { diff: false });
  }, [styleId]);

  /* ---------- Unidades da PUC (marcadores numerados) ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = placeMarkersRef.current;

    places.forEach((place, index) => {
      const element = pinElement("liq-marker", place.name, String(index + 1));
      element.addEventListener("click", (event) => {
        event.stopPropagation(); // não conta como clique no mapa
        callbacksRef.current.onSelectPlace?.(place.id);
      });
      const marker = new maplibregl.Marker({ element, anchor: "bottom" })
        .setLngLat(place.coordinates)
        .setPopup(popup(place.name, `${place.address} · ${place.city}`))
        .addTo(map);
      markers.set(place.id, { marker, element });
    });

    return () => {
      markers.forEach(({ marker }) => marker.remove());
      markers.clear();
    };
  }, [places]);

  /* ---------- Unidade escolhida: destaca e abre o popup ---------- */
  useEffect(() => {
    placeMarkersRef.current.forEach(({ marker, element }, id) => {
      const active = id === selectedPlaceId;
      element.classList.toggle("active", active);
      const placePopup = marker.getPopup();
      if (active && !placePopup.isOpen()) marker.togglePopup();
      if (!active && placePopup.isOpen()) placePopup.remove();
    });
  }, [selectedPlaceId]);

  /* ---------- Ponto escolhido (busca ou clique): pino vermelho ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !point) return;
    const element = pinElement("liq-marker liq-marker-point", point.name);
    element.addEventListener("click", (event) => event.stopPropagation());
    const marker = new maplibregl.Marker({ element, anchor: "bottom" })
      .setLngLat(point.coordinates)
      .setPopup(popup(point.name, point.address))
      .addTo(map)
      .togglePopup();
    return () => marker.remove();
  }, [point]);

  /* ---------- Pontos de interesse (Nearby) ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = pois.map((poi) => {
      const element = document.createElement("button");
      element.type = "button";
      element.className = "liq-poi";
      element.setAttribute("aria-label", poi.name);
      element.addEventListener("click", (event) => event.stopPropagation());
      return new maplibregl.Marker({ element })
        .setLngLat(poi.coordinates)
        .setPopup(popup(poi.name, poi.address, 12))
        .addTo(map);
    });
    return () => markers.forEach((marker) => marker.remove());
  }, [pois]);

  /* ---------- Rota: linha + marcadores A e B ---------- */
  useEffect(() => {
    const map = mapRef.current;
    routeRef.current = route;
    if (map) drawRoute(map, route);
  }, [route]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = routeEnds.filter(Boolean).map((end) => {
      const element = pinElement(`liq-marker liq-marker-${end.role}`, end.name, end.role === "origin" ? "A" : "B");
      element.addEventListener("click", (event) => event.stopPropagation());
      return new maplibregl.Marker({ element, anchor: "bottom" })
        .setLngLat(end.coordinates)
        .setPopup(popup(end.name, end.address))
        .addTo(map);
    });
    return () => markers.forEach((marker) => marker.remove());
  }, [routeEnds]);

  /* ---------- Câmera: voa até um ponto ou enquadra vários ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focus) return;
    if (focus.bounds?.length) {
      const bounds = new maplibregl.LngLatBounds();
      focus.bounds.forEach((coordinates) => bounds.extend(coordinates));
      map.fitBounds(bounds, { padding: 60, maxZoom: focus.maxZoom ?? 15 });
    } else if (focus.center) {
      map.flyTo({ center: focus.center, zoom: focus.zoom ?? 15, essential: true });
    }
  }, [focus]);

  return <div ref={containerRef} className="liq-map" />;
}
