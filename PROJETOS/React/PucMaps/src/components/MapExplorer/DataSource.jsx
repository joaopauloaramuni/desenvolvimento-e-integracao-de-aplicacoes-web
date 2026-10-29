import { FiDatabase, FiRefreshCw } from "react-icons/fi";

const LABELS = {
  overpass: "OpenStreetMap, ao vivo (API Overpass)",
  cache: "OpenStreetMap, do cache deste navegador",
  snapshot: "cópia local (public/data)",
};

function timeAgo(ts) {
  if (!ts) return null;
  const min = Math.round((Date.now() - ts) / 60000);
  if (min < 1) return "agora há pouco";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 48) return `há ${h} h`;
  return `há ${Math.round(h / 24)} dias`;
}

/** Rodapé da lateral: de onde vieram os dados e botão para baixar de novo. */
export default function DataSource({ meta, campus, updating, onReload }) {
  if (!meta) return null;
  const ago = timeAgo(meta.fetchedAt);

  return (
    <footer className="data-source">
      <FiDatabase aria-hidden="true" />
      <div>
        <p>
          Dados: <strong>{LABELS[meta.source]}</strong>
          {ago && meta.source !== "snapshot" ? `, ${ago}` : ""}
          {meta.source === "snapshot" && meta.fetchedAt
            ? `, gerada em ${new Date(meta.fetchedAt).toLocaleDateString("pt-BR")}`
            : ""}
        </p>
        {campus && (
          <p className="data-source-small">
            {campus.elementCount.toLocaleString("pt-BR")} elementos OSM → {campus.places.length} locais, processados em{" "}
            {campus.processMs} ms
          </p>
        )}
        {updating && (
          <p className="data-source-small busy">
            <span className="data-source-spinner" aria-hidden="true" /> Buscando a versão ao vivo no OpenStreetMap...
          </p>
        )}
        {!updating && meta.fallbackReason && (
          <p className="data-source-small warn">O Overpass não respondeu; seguindo com a cópia local.</p>
        )}
      </div>
      <button type="button" onClick={onReload} disabled={updating} title="Baixar os dados de novo">
        <FiRefreshCw aria-hidden="true" />
        <span className="sr-only">Baixar os dados de novo</span>
      </button>
    </footer>
  );
}
