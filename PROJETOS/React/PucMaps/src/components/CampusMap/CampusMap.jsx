// O MapLibre 6 só tem exports nomeados (sem "default"): importamos tudo como um objeto
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// O MapLibre desenha os dados num Web Worker (outra thread). Na versão 6 ele procura
// o arquivo do worker "ao lado" do próprio código, o que não funciona depois do build.
// Com "?worker&url" o Vite empacota o worker num arquivo próprio e devolve a URL dele.
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { useEffect, useRef, useState } from "react";
import MAP_CONFIG from "../../config/mapConfig";
import { boundsOf } from "../../core/geometry";
import { iconId, PLACE_TYPES } from "../../core/placeTypes";
import "./CampusMap.css";

maplibregl.setWorkerUrl(workerUrl);

const EMPTY = { type: "FeatureCollection", features: [] };
const BRAND = "#005380";
const ROUTE = "#103347"; // mesma cor da rota no projeto original

// Cores do estilo padrão do projeto original (default-style.constant.ts)
const COLORS = {
  background: "#f2efe9",
  green: "#c8facc",
  water: "#aad3df",
  parking: "#e9e5df",
  pedestrian: "#e7e3dc",
  building: "#d9d0c9",
  buildingLine: "#c4bab2",
  campus: "#3388ff",
};

/** Estilo inicial: todas as camadas existem desde o começo; depois só trocamos dados e visibilidade. */
function initialStyle() {
  return {
    version: 8,
    glyphs: MAP_CONFIG.GLYPHS_URL,
    sources: {
      osm: {
        type: "raster",
        tiles: MAP_CONFIG.RASTER_TILES,
        tileSize: 256,
        maxzoom: 19,
        attribution: MAP_CONFIG.RASTER_ATTRIBUTION,
      },
      base: { type: "geojson", data: EMPTY },
      places: { type: "geojson", data: EMPTY },
      graph: { type: "geojson", data: EMPTY },
      route: { type: "geojson", data: EMPTY },
    },
    layers: [
      { id: "background", type: "background", paint: { "background-color": COLORS.background } },
      { id: "osm-raster", type: "raster", source: "osm", layout: { visibility: "none" } },

      // ---------- Fundo vetorial ----------
      {
        id: "base-land",
        type: "fill",
        source: "base",
        filter: ["==", ["get", "layer"], "land"],
        paint: {
          "fill-color": [
            "match",
            ["get", "kind"],
            "green",
            COLORS.green,
            "water",
            COLORS.water,
            "parking",
            COLORS.parking,
            COLORS.pedestrian,
          ],
        },
      },
      {
        id: "base-street-casing",
        type: "line",
        source: "base",
        filter: [
          "all",
          ["==", ["get", "layer"], "street"],
          ["in", ["get", "kind"], ["literal", ["primary", "secondary", "tertiary", "residential", "unclassified", "living_street"]]],
        ],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#cfc8bf",
          "line-width": ["interpolate", ["linear"], ["zoom"], 15, 4, 19, 16],
        },
      },
      {
        id: "base-street",
        type: "line",
        source: "base",
        filter: ["==", ["get", "layer"], "street"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": [
            "match",
            ["get", "kind"],
            "primary",
            "#fec157",
            "secondary",
            "#fed7a5",
            "tertiary",
            "#ffffb3",
            ["footway", "path", "pedestrian", "steps", "service"],
            "#a1a1a1",
            "#ffffff",
          ],
          // Só pode haver UM "interpolate" por zoom, e ele precisa ficar por fora
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            ["match", ["get", "kind"], ["footway", "path", "pedestrian", "steps", "service"], 0.8, 2.5],
            19,
            ["match", ["get", "kind"], ["footway", "path", "pedestrian", "steps", "service"], 2.5, 12],
          ],
          "line-dasharray": [
            "case",
            ["==", ["get", "kind"], "steps"],
            ["literal", [0.6, 0.6]],
            ["literal", [1, 0]],
          ],
        },
      },
      {
        id: "base-building",
        type: "fill",
        source: "base",
        filter: ["==", ["get", "layer"], "building"],
        paint: { "fill-color": COLORS.building, "fill-opacity": 0.8 },
      },
      {
        id: "base-building-line",
        type: "line",
        source: "base",
        filter: ["==", ["get", "layer"], "building"],
        paint: { "line-color": COLORS.buildingLine, "line-width": 0.6 },
      },

      // ---------- Destinos do campus (camada "campus" do original) ----------
      {
        id: "campus-fill",
        type: "fill",
        source: "places",
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "fill-color": ["match", ["get", "kind"], "area", "#22a39a", COLORS.campus],
          "fill-opacity": ["match", ["get", "kind"], "area", 0.18, 0.22],
        },
      },
      {
        id: "campus-selected-fill",
        type: "fill",
        source: "places",
        filter: ["==", ["get", "id"], ""],
        paint: { "fill-color": BRAND, "fill-opacity": 0.35 },
      },
      {
        id: "campus-selected-line",
        type: "line",
        source: "places",
        filter: ["==", ["get", "id"], ""],
        paint: { "line-color": BRAND, "line-width": 2.5 },
      },

      // ---------- Grafo de caminhos ----------
      {
        id: "graph-edges",
        type: "line",
        source: "graph",
        filter: ["==", ["geometry-type"], "LineString"],
        layout: { visibility: "none", "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": [
            "case",
            ["get", "generated"],
            "#ff9800",
            ["get", "steps"],
            "#e53935",
            "#2196f3",
          ],
          "line-width": ["interpolate", ["linear"], ["zoom"], 15, 1.2, 19, 3],
          "line-dasharray": ["case", ["get", "generated"], ["literal", [2, 1.5]], ["literal", [1, 0]]],
        },
      },
      {
        id: "graph-nodes",
        type: "circle",
        source: "graph",
        filter: ["==", ["geometry-type"], "Point"],
        layout: { visibility: "none" },
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 15, 1.8, 19, 5],
          "circle-color": ["case", ["get", "destination"], "#ff9800", "#ffffff"],
          "circle-stroke-width": 1,
          "circle-stroke-color": "#1f2937",
        },
      },

      // ---------- Rota ----------
      {
        id: "route-casing",
        type: "line",
        source: "route",
        filter: ["==", ["geometry-type"], "LineString"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#ffffff", "line-width": ["interpolate", ["linear"], ["zoom"], 15, 5, 19, 11] },
      },
      {
        id: "route-line",
        type: "line",
        source: "route",
        filter: ["==", ["geometry-type"], "LineString"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": ROUTE, "line-width": ["interpolate", ["linear"], ["zoom"], 15, 2.5, 19, 6] },
      },
      {
        id: "route-ends",
        type: "circle",
        source: "route",
        filter: ["==", ["geometry-type"], "Point"],
        paint: {
          "circle-radius": 7,
          "circle-color": ["match", ["get", "end"], "start", "#2e7d32", ROUTE],
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
        },
      },

      // ---------- Ícones e nomes ----------
      {
        id: "campus-symbol",
        type: "symbol",
        source: "places",
        filter: ["==", ["get", "point"], true],
        layout: {
          "icon-image": ["concat", "icon-", ["get", "type"]],
          "icon-size": ["interpolate", ["linear"], ["zoom"], 15, 0.55, 18, 0.85, 21, 1.2],
          "icon-allow-overlap": true,
          "icon-anchor": "bottom",
          "text-field": ["get", "name"],
          "text-font": MAP_CONFIG.FONT_MEDIUM,
          "text-size": ["interpolate", ["linear"], ["zoom"], 15, 10, 18, 12, 21, 15],
          "text-max-width": 9,
          "text-offset": [0, 0.35],
          "text-anchor": "top",
          "text-optional": true,
        },
        paint: {
          "text-color": "#1f2937",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.4,
        },
      },
    ],
  };
}

const VECTOR_LAYERS = ["base-land", "base-street-casing", "base-street", "base-building", "base-building-line"];

/** Carrega os SVGs dos tipos como imagens do mapa (em 2x para ficar nítido). */
async function loadIcons(map) {
  await Promise.all(
    Object.entries(PLACE_TYPES).map(async ([type, info]) => {
      if (map.hasImage(iconId(type))) return;
      const img = new Image(48, 48);
      img.src = info.icon;
      await img.decode();
      if (!map.hasImage(iconId(type))) map.addImage(iconId(type), img, { pixelRatio: 2 });
    }),
  );
}

/**
 * Mapa do campus com MapLibre GL.
 *
 * <CampusMap
 *   campus={campus}            // saída do useCampusData()
 *   baseId="vector"            // "vector" | "raster"
 *   showGraph={false}
 *   selected={place}           // destino destacado (ou null)
 *   onSelect={(id) => ...}     // clique num prédio/área
 *   route={route}              // { coords, from, to } (ou null)
 *   fitKey={0}                 // mude para enquadrar o campus inteiro
 * />
 */
export default function CampusMap({ campus, baseId, showGraph, selected, onSelect, route, fitKey }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const fittedRef = useRef(false);
  const [ready, setReady] = useState(false);

  onSelectRef.current = onSelect;

  // Cria o mapa UMA vez
  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: initialStyle(),
      center: MAP_CONFIG.CENTER,
      zoom: MAP_CONFIG.ZOOM,
      minZoom: MAP_CONFIG.MIN_ZOOM,
      maxZoom: MAP_CONFIG.MAX_ZOOM,
      maxBounds: MAP_CONFIG.MAX_BOUNDS,
      attributionControl: { compact: true, customAttribution: "Dados © colaboradores do OpenStreetMap" },
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    map.addControl(new maplibregl.FullscreenControl(), "top-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

    map.on("load", async () => {
      await loadIcons(map);
      setReady(true);
    });

    const pick = (e) => {
      const id = e.features?.[0]?.properties?.id;
      if (id) onSelectRef.current?.(id);
    };
    for (const layer of ["campus-fill", "campus-symbol"]) {
      map.on("click", layer, pick);
      map.on("mouseenter", layer, () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""));
    }

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Dados do campus
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !campus) return;
    map.getSource("base").setData(campus.base);
    map.getSource("places").setData(campus.placesGeoJSON);
    map.getSource("graph").setData(campus.graphGeoJSON);

    // Na primeira carga, enquadra todos os locais que vieram nos dados
    if (!fittedRef.current && campus.places.length) {
      fittedRef.current = true;
      map.fitBounds(boundsOf(campus.places.map((p) => p.center)), { padding: 50, duration: 0 });
    }
  }, [ready, campus]);

  // Fundo: vetorial (desenhado com os dados) ou raster (blocos do OSM)
  useEffect(() => {
    const map = mapRef.current;
    if (!ready) return;
    const raster = baseId === "raster";
    map.setLayoutProperty("osm-raster", "visibility", raster ? "visible" : "none");
    for (const id of VECTOR_LAYERS) map.setLayoutProperty(id, "visibility", raster ? "none" : "visible");
  }, [ready, baseId]);

  // Grafo
  useEffect(() => {
    const map = mapRef.current;
    if (!ready) return;
    for (const id of ["graph-edges", "graph-nodes"]) {
      map.setLayoutProperty(id, "visibility", showGraph ? "visible" : "none");
    }
  }, [ready, showGraph]);

  // Destino escolhido: destaca, voa até ele e abre o popup
  useEffect(() => {
    const map = mapRef.current;
    if (!ready) return;
    const filter = ["==", ["get", "id"], selected?.id ?? ""];
    map.setFilter("campus-selected-fill", ["all", ["==", ["geometry-type"], "Polygon"], filter]);
    map.setFilter("campus-selected-line", ["all", ["==", ["geometry-type"], "Polygon"], filter]);

    popupRef.current?.remove();
    if (!selected) return;

    map.flyTo({ center: selected.center, zoom: Math.max(map.getZoom(), 17.6), duration: 900 });

    // Popup montado com textContent: nada vira HTML (sem risco de XSS)
    const box = document.createElement("div");
    box.className = "campus-popup";
    const title = document.createElement("strong");
    title.textContent = selected.name;
    const type = document.createElement("span");
    type.textContent = PLACE_TYPES[selected.type]?.label ?? "";
    box.append(title, type);
    popupRef.current = new maplibregl.Popup({ offset: 22, closeButton: false, maxWidth: "240px" })
      .setLngLat(selected.center)
      .setDOMContent(box)
      .addTo(map);
  }, [ready, selected]);

  // Rota
  useEffect(() => {
    const map = mapRef.current;
    if (!ready) return;
    if (!route) {
      map.getSource("route").setData(EMPTY);
      return;
    }
    popupRef.current?.remove();
    const { coords } = route;
    map.getSource("route").setData({
      type: "FeatureCollection",
      features: [
        { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } },
        { type: "Feature", properties: { end: "start" }, geometry: { type: "Point", coordinates: coords[0] } },
        { type: "Feature", properties: { end: "end" }, geometry: { type: "Point", coordinates: coords.at(-1) } },
      ],
    });
    map.fitBounds(boundsOf(coords), { padding: 70, maxZoom: 18.5, duration: 900 });
  }, [ready, route]);

  // Enquadrar o campus inteiro
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !campus || !fitKey) return;
    popupRef.current?.remove();
    const coords = campus.places.map((p) => p.center);
    if (coords.length) map.fitBounds(boundsOf(coords), { padding: 40, duration: 900 });
  }, [ready, campus, fitKey]);

  return <div ref={containerRef} className="campus-map" />;
}
