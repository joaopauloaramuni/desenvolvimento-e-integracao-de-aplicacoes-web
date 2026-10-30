// O MapLibre 6 só tem exports nomeados (sem "default"): importamos tudo como um objeto
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// O MapLibre desenha os dados num Web Worker. Na versão 6 ele procura o arquivo do
// worker "ao lado" do próprio código, o que não funciona depois do build.
// Com "?worker&url" o Vite empacota o worker num arquivo próprio e devolve a URL dele.
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { useEffect, useRef } from "react";
import pucLogo from "../../assets/images/pucminas-logo.png";
import { MAPA } from "../../config/appConfig";
import { limites } from "../../core/geometria";
import "./Mapa.css";

maplibregl.setWorkerUrl(workerUrl);

const VAZIO = { type: "FeatureCollection", features: [] };
const COR = {
  rota: "#0a6ea6",
  rotaBorda: "#ffffff",
  ponto: "#005380",
  destaque: "#ffb21a",
  marinho: "#00334f",
  raio: "#4fa8d8",
};

/* =====================================================================
   GeoJSON a partir dos dados do app
   ===================================================================== */

const geoTracado = (tracado) =>
  tracado?.length > 1
    ? { type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: tracado } }] }
    : VAZIO;

const geoPontos = (paradas, selecionada) => ({
  type: "FeatureCollection",
  features: (paradas ?? []).map((p) => ({
    type: "Feature",
    properties: { id: p.id, nome: p.nome, detalhe: p.detalhe ?? "", selecionada: p.id === selecionada },
    geometry: { type: "Point", coordinates: [p.lon, p.lat] },
  })),
});

const geoOnibus = (onibus) => ({
  type: "FeatureCollection",
  features: (onibus ?? []).map((o) => ({
    type: "Feature",
    properties: {
      id: o.id,
      rotulo: o.rotulo ?? o.id,
      kmh: o.kmh ?? -1,
      timestamp: o.timestamp ?? 0,
      rumo: o.rumo ?? 0,
      temRumo: Number.isFinite(o.rumo),
    },
    geometry: { type: "Point", coordinates: [o.lon, o.lat] },
  })),
});

// Círculo (polígono de 64 lados) com o raio de busca em volta do campus
function geoRaios(campi, raioM) {
  if (!raioM) return VAZIO;
  return {
    type: "FeatureCollection",
    features: (campi ?? []).map(({ coords: [lon, lat] }) => {
      const anel = [];
      for (let i = 0; i <= 64; i += 1) {
        const a = (i / 64) * 2 * Math.PI;
        const dLat = (raioM / 111_320) * Math.sin(a);
        const dLon = ((raioM / 111_320) * Math.cos(a)) / Math.cos((lat * Math.PI) / 180);
        anel.push([lon + dLon, lat + dLat]);
      }
      return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [anel] } };
    }),
  };
}

/* =====================================================================
   Ícone do ônibus: desenhado num <canvas>, sem arquivo de imagem
   ===================================================================== */

function iconeOnibus(comSeta) {
  const lado = 64; // desenhado em 2x para ficar nítido
  const canvas = document.createElement("canvas");
  canvas.width = lado;
  canvas.height = lado;
  const ctx = canvas.getContext("2d");
  const c = lado / 2;

  if (comSeta) {
    // Ponta indicando o rumo (o MapLibre gira o ícone pelo "rumo" do GTFS-RT)
    ctx.fillStyle = COR.marinho;
    ctx.beginPath();
    ctx.moveTo(c, 2);
    ctx.lineTo(c + 11, 17);
    ctx.lineTo(c - 11, 17);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = COR.marinho;
  ctx.beginPath();
  ctx.arc(c, c + 3, 20, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = COR.destaque;
  ctx.beginPath();
  ctx.arc(c, c + 3, 14, 0, 2 * Math.PI);
  ctx.fill();

  // Janela do ônibus
  ctx.fillStyle = COR.marinho;
  ctx.fillRect(c - 7, c - 4, 14, 7);
  ctx.fillRect(c - 7, c + 6, 3, 3);
  ctx.fillRect(c + 4, c + 6, 3, 3);

  return ctx.getImageData(0, 0, lado, lado);
}

/* =====================================================================
   Estilo reserva (OpenStreetMap raster) se o OpenFreeMap não responder
   ===================================================================== */

const estiloRaster = () => ({
  version: 8,
  glyphs: MAPA.GLYPHS_URL,
  sources: {
    osm: { type: "raster", tiles: MAPA.RASTER_TILES, tileSize: 256, maxzoom: 19, attribution: MAPA.RASTER_ATRIBUICAO },
  },
  layers: [
    { id: "fundo", type: "background", paint: { "background-color": "#eef2f5" } },
    { id: "osm", type: "raster", source: "osm", paint: { "raster-saturation": -0.6 } },
  ],
});

/* =====================================================================
   Camadas do app (adicionadas de novo sempre que o estilo de fundo carrega)
   ===================================================================== */

function adicionarCamadas(map) {
  if (!map.hasImage("onibus-seta")) map.addImage("onibus-seta", iconeOnibus(true), { pixelRatio: 2 });
  if (!map.hasImage("onibus")) map.addImage("onibus", iconeOnibus(false), { pixelRatio: 2 });

  for (const id of ["raios", "tracado", "pontos", "onibus"]) {
    if (!map.getSource(id)) map.addSource(id, { type: "geojson", data: VAZIO });
  }

  const camadas = [
    { id: "raio-fill", type: "fill", source: "raios", paint: { "fill-color": COR.raio, "fill-opacity": 0.08 } },
    {
      id: "raio-line",
      type: "line",
      source: "raios",
      paint: { "line-color": COR.raio, "line-width": 1.5, "line-dasharray": [2, 2] },
    },
    {
      id: "tracado-borda",
      type: "line",
      source: "tracado",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": COR.rotaBorda, "line-width": ["interpolate", ["linear"], ["zoom"], 11, 6, 16, 12] },
    },
    {
      id: "tracado-linha",
      type: "line",
      source: "tracado",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": COR.rota, "line-width": ["interpolate", ["linear"], ["zoom"], 11, 3, 16, 7] },
    },
    {
      id: "pontos-circulo",
      type: "circle",
      source: "pontos",
      paint: {
        // "zoom" só pode aparecer no interpolate de fora: o "case" vai dentro dele
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, ["case", ["get", "selecionada"], 6, 2.5], 16, ["case", ["get", "selecionada"], 9, 5.5]],
        "circle-color": ["case", ["get", "selecionada"], COR.destaque, "#ffffff"],
        "circle-stroke-color": ["case", ["get", "selecionada"], COR.marinho, COR.ponto],
        "circle-stroke-width": ["case", ["get", "selecionada"], 3, 2],
      },
    },
    {
      id: "onibus-icone",
      type: "symbol",
      source: "onibus",
      layout: {
        "icon-image": ["case", ["get", "temRumo"], "onibus-seta", "onibus"],
        "icon-rotate": ["get", "rumo"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "icon-size": ["interpolate", ["linear"], ["zoom"], 11, 0.8, 16, 1.1],
      },
    },
  ];
  for (const camada of camadas) if (!map.getLayer(camada.id)) map.addLayer(camada);
}

function popupTexto(map, coords, titulo, detalhe) {
  const caixa = document.createElement("div");
  caixa.className = "mapa-popup";
  const t = document.createElement("strong");
  t.textContent = titulo; // textContent: nada do dado vira HTML (sem XSS)
  caixa.append(t);
  if (detalhe) {
    const d = document.createElement("span");
    d.textContent = detalhe;
    caixa.append(d);
  }
  return new maplibregl.Popup({ offset: 14, closeButton: false, maxWidth: "260px" }).setLngLat(coords).setDOMContent(caixa).addTo(map);
}

function tempoDesde(timestamp) {
  if (!timestamp) return "";
  const s = Math.max(0, Math.round(Date.now() / 1000 - timestamp));
  return s < 60 ? `posição de ${s} s atrás` : `posição de ${Math.round(s / 60)} min atrás`;
}

/* =====================================================================
   Componente
   ===================================================================== */

/**
 * <Mapa
 *   tracado={[[lon, lat], ...]}
 *   paradas={[{ id, nome, lon, lat, detalhe }]}
 *   paradaSelecionada="id"
 *   onibus={[{ id, rotulo, lon, lat, rumo, kmh, timestamp }]}
 *   campi={[{ id, nome, coords }]}  raioCampus={500}
 *   enquadrar="chave"   ← quando muda, o mapa se ajusta ao traçado/pontos
 *   onSelecionarParada={(id) => ...}
 * />
 */
export default function Mapa({ tracado, paradas, paradaSelecionada, onibus, campi, raioCampus, enquadrar, onSelecionarParada, rotulo }) {
  const container = useRef(null);
  const mapa = useRef(null);
  const props = useRef({});
  const marcadores = useRef([]);
  props.current = { tracado, paradas, paradaSelecionada, onibus, campi, raioCampus, onSelecionarParada };

  // Passa os dados atuais para as fontes do mapa
  const aplicar = () => {
    const map = mapa.current;
    if (!map?.getSource("pontos")) return;
    const p = props.current;
    map.getSource("tracado").setData(geoTracado(p.tracado));
    map.getSource("pontos").setData(geoPontos(p.paradas, p.paradaSelecionada));
    map.getSource("onibus").setData(geoOnibus(p.onibus));
    map.getSource("raios").setData(geoRaios(p.campi, p.raioCampus));
  };

  const enquadrarDados = (animar) => {
    const map = mapa.current;
    if (!map) return;
    const p = props.current;
    const pontos = [...(p.tracado ?? []), ...(p.paradas ?? []).map((x) => [x.lon, x.lat]), ...(p.campi ?? []).map((c) => c.coords)];
    if (!pontos.length) return;
    map.fitBounds(limites(pontos), { padding: 48, maxZoom: 16, duration: animar ? 700 : 0 });
  };

  // Cria o mapa uma vez (o MapLibre não é um componente React)
  useEffect(() => {
    const map = new maplibregl.Map({
      container: container.current,
      style: MAPA.ESTILO_URL,
      center: MAPA.CENTRO,
      zoom: MAPA.ZOOM,
      minZoom: MAPA.MIN_ZOOM,
      maxZoom: MAPA.MAX_ZOOM,
      attributionControl: { compact: true },
      cooperativeGestures: false,
    });
    mapa.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    // Se o fundo vetorial não carregar em 8 s (ou der erro), troca para o raster do OSM
    let trocou = false;
    const reserva = () => {
      if (trocou || map.isStyleLoaded()) return;
      trocou = true;
      map.setStyle(estiloRaster());
    };
    const timer = setTimeout(reserva, 8000);
    map.on("error", (e) => {
      if (!map.isStyleLoaded() && String(e?.error?.message ?? "").match(/style|fetch|Failed/i)) reserva();
    });

    map.on("style.load", () => {
      clearTimeout(timer);
      adicionarCamadas(map);
      aplicar();
    });
    map.once("load", () => enquadrarDados(false));

    // Cliques: ponto → seleciona; ônibus → popup
    map.on("click", "pontos-circulo", (e) => {
      const f = e.features?.[0];
      if (!f) return;
      props.current.onSelecionarParada?.(f.properties.id);
      popupTexto(map, f.geometry.coordinates, f.properties.nome, f.properties.detalhe);
    });
    map.on("click", "onibus-icone", (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const { rotulo: r, kmh, timestamp } = f.properties;
      const detalhes = [kmh >= 0 ? `${kmh} km/h` : null, tempoDesde(timestamp)].filter(Boolean).join(", ");
      popupTexto(map, f.geometry.coordinates, `Ônibus ${r}`, detalhes);
    });
    for (const camada of ["pontos-circulo", "onibus-icone"]) {
      map.on("mouseenter", camada, () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", camada, () => (map.getCanvas().style.cursor = ""));
    }

    return () => {
      clearTimeout(timer);
      map.remove();
      mapa.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dados mudaram → atualiza as fontes
  useEffect(aplicar, [tracado, paradas, paradaSelecionada, onibus, campi, raioCampus]);

  // Trocou de linha/sentido/campus → reenquadra
  useEffect(() => {
    if (mapa.current?.loaded()) enquadrarDados(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enquadrar]);

  // Ponto escolhido fora do mapa (na lista) → o mapa vai até ele
  useEffect(() => {
    const map = mapa.current;
    const p = (paradas ?? []).find((x) => x.id === paradaSelecionada);
    if (map && p) map.easeTo({ center: [p.lon, p.lat], zoom: Math.max(map.getZoom(), 15.5), duration: 600 });
  }, [paradaSelecionada, paradas]);

  // Marcadores da PUC Minas (HTML, com a logo)
  useEffect(() => {
    const map = mapa.current;
    if (!map) return undefined;
    marcadores.current.forEach((m) => m.remove());
    marcadores.current = (campi ?? []).map((c) => {
      const el = document.createElement("div");
      el.className = "mapa-campus";
      el.title = `PUC Minas ${c.nome}`;
      const img = document.createElement("img");
      img.src = pucLogo;
      img.alt = "";
      const nome = document.createElement("span");
      nome.textContent = c.nome;
      el.append(img, nome);
      return new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat(c.coords).addTo(map);
    });
    return () => marcadores.current.forEach((m) => m.remove());
  }, [campi]);

  return <div ref={container} className="mapa" role="region" aria-label={rotulo ?? "Mapa"} />;
}
