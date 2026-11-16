import { useEffect, useRef, useState } from "react";
import { FiCompass, FiInfo, FiMapPin, FiMaximize, FiNavigation, FiSearch, FiX } from "react-icons/fi";
import { autocomplete, search } from "../../services/locationIqService";
import { formatCoordinates } from "../../utils/format";

/**
 * Aba "Buscar":
 *  - enquanto digita → Autocomplete API (sugestões)
 *  - ao apertar Enter → Search API (forward geocoding completo)
 *  - lista das unidades da PUC Minas
 */
export default function SearchPanel({ places, selectedPlaceId, point, onChoosePlace, onShowAll, onChoosePoint, onGo }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState(null); // null = ainda não buscou
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const skipNextRef = useRef(false);

  // Autocomplete enquanto digita, esperando 400 ms sem teclar (debounce)
  useEffect(() => {
    const text = query.trim();
    if (skipNextRef.current || text.length < 3) {
      skipNextRef.current = false;
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        setSuggestions(await autocomplete(text, { signal: controller.signal }));
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Enter → busca completa (Search API)
  const runSearch = async (event) => {
    event.preventDefault();
    const text = query.trim();
    if (!text) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setSuggestions([]);
    setLoading(true);
    try {
      setResults(await search(text, { signal: controller.signal }));
      setError(null);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const choose = (item) => {
    skipNextRef.current = true; // escrever o nome no campo não dispara outro autocomplete
    setQuery(item.name);
    setSuggestions([]);
    onChoosePoint(item);
  };

  const clear = () => {
    abortRef.current?.abort();
    setQuery("");
    setResults(null);
    setSuggestions([]);
    setError(null);
  };

  return (
    <div className="liq-panel">
      <form className="liq-search" onSubmit={runSearch} role="search">
        <FiSearch className="liq-search-icon" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Endereço, lugar ou CEP"
          aria-label="Buscar endereço, lugar ou CEP"
          autoComplete="off"
        />
        {query && (
          <button type="button" className="liq-search-clear" onClick={clear} aria-label="Limpar busca">
            <FiX aria-hidden="true" />
          </button>
        )}

        {(suggestions.length > 0 || loading || error) && (
          <ul className="liq-dropdown" role="listbox" aria-label="Sugestões">
            {loading && <li className="liq-info">Buscando...</li>}
            {error && <li className="liq-info error">{error}</li>}
            {suggestions.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => choose(item)}>
                  <strong>{item.name}</strong>
                  <span>{item.address}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>
      <p className="liq-hint">Digite para ver sugestões (Autocomplete). Aperte Enter para a busca completa (Search).</p>

      {/* ---------- Ponto escolhido + atalhos ---------- */}
      {point && (
        <div className="liq-point-card">
          <strong>{point.name}</strong>
          <span>{point.address || formatCoordinates(point.coordinates)}</span>
          <div className="liq-point-actions">
            <button type="button" onClick={() => onGo("ponto")}>
              <FiInfo aria-hidden="true" /> Endereço
            </button>
            <button type="button" onClick={() => onGo("perto")}>
              <FiCompass aria-hidden="true" /> Perto
            </button>
            <button type="button" onClick={() => onGo("rota")}>
              <FiNavigation aria-hidden="true" /> Rota até aqui
            </button>
          </div>
        </div>
      )}

      {/* ---------- Resultados do Enter (Search API) ---------- */}
      {results && (
        <>
          <div className="liq-section-head">
            <h3>Resultados da busca</h3>
            <span>{results.length}</span>
          </div>
          {results.length === 0 ? (
            <p className="liq-empty">Nada encontrado para “{query}”. Tente incluir a cidade.</p>
          ) : (
            <ul className="liq-list">
              {results.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => choose(item)}>
                    <FiMapPin className="liq-list-icon" aria-hidden="true" />
                    <span className="liq-list-text">
                      <strong>{item.name}</strong>
                      <span>{item.address}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* ---------- Unidades da PUC ---------- */}
      <div className="liq-section-head">
        <h3>Unidades PUC Minas</h3>
        <button type="button" onClick={onShowAll}>
          <FiMaximize aria-hidden="true" /> Ver todas
        </button>
      </div>
      <ol className="liq-list">
        {places.map((place, index) => (
          <li key={place.id}>
            <button
              type="button"
              className={place.id === selectedPlaceId ? "active" : ""}
              aria-pressed={place.id === selectedPlaceId}
              onClick={() => onChoosePlace(place.id)}
            >
              <span className="liq-number">{index + 1}</span>
              <span className="liq-list-text">
                <strong>{place.name}</strong>
                <span>{place.city}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
