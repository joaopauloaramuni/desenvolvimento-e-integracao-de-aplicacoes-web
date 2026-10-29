import { useCallback, useEffect, useMemo, useState } from "react";
import { extractBase, extractPlaces, indexElements, placesToGeoJSON } from "../core/campus.js";
import { buildGraph, graphToGeoJSON } from "../core/graph.js";
import { clearCache, fetchLive, fromSnapshot, readCache } from "../services/overpassService.js";

/**
 * Baixa os dados do OSM e monta tudo o que o mapa precisa:
 * destinos, fundo vetorial e o grafo de caminhos.
 *
 * Para não deixar ninguém esperando o Overpass (que às vezes demora), o mapa
 * abre na hora com o cache ou com a cópia local, e a versão ao vivo chega depois.
 *
 * const { status, error, meta, campus, updating, reload } = useCampusData();
 */
export default function useCampusData() {
  const [state, setState] = useState({ status: "loading", error: null, meta: null, elements: null });
  const [updating, setUpdating] = useState(false); // buscando a versão ao vivo em segundo plano
  const [reloadKey, setReloadKey] = useState({ n: 0, force: false });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const show = ({ elements, ...meta }) => setState({ status: "ready", error: null, meta, elements });

    async function load() {
      // 1. Cache válido: abre na hora e pronto
      const cached = reloadKey.force ? null : readCache();
      if (cached) {
        show({ ...cached, source: "cache" });
        return;
      }

      // 2. Cópia local: abre na hora
      let hasData = false;
      try {
        show(await fromSnapshot(signal));
        hasData = true;
      } catch (error) {
        if (signal.aborted) return;
        console.warn("Cópia local indisponível:", error.message);
      }

      // 3. Versão ao vivo em segundo plano
      setUpdating(true);
      try {
        show(await fetchLive(signal));
      } catch (error) {
        if (signal.aborted) return;
        if (hasData) {
          setState((s) => ({ ...s, meta: { ...s.meta, fallbackReason: error.message } }));
        } else {
          setState({ status: "error", error: error.message, meta: null, elements: null });
        }
      } finally {
        if (!signal.aborted) setUpdating(false);
      }
    }

    load();
    return () => controller.abort();
  }, [reloadKey]);

  // Processamento (roda só quando chegam elementos novos)
  const campus = useMemo(() => {
    if (!state.elements) return null;
    const started = performance.now();
    const index = indexElements(state.elements);
    const places = extractPlaces(state.elements, index);
    const base = extractBase(state.elements, index);
    const graph = buildGraph(state.elements, index, places);
    return {
      places,
      placesById: new Map(places.map((p) => [p.id, p])),
      base,
      placesGeoJSON: placesToGeoJSON(places),
      graph,
      graphGeoJSON: graphToGeoJSON(graph),
      elementCount: state.elements.length,
      processMs: Math.round(performance.now() - started),
    };
  }, [state.elements]);

  // Botão de recarregar: ignora o cache e busca ao vivo de novo
  const reload = useCallback(() => {
    clearCache();
    setReloadKey((k) => ({ n: k.n + 1, force: true }));
  }, []);

  return { status: state.status, error: state.error, meta: state.meta, campus, updating, reload };
}
