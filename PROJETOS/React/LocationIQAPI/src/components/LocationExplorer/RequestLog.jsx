import { useEffect, useState } from "react";
import { FiActivity, FiRefreshCw } from "react-icons/fi";
import { balance, onRequest } from "../../services/locationIqService";

/**
 * Painel "Requisições": cada chamada feita ao LocationIQ, com a URL (token
 * escondido), o status HTTP e o tempo. Bom para ver a API "por dentro".
 */
export default function RequestLog() {
  const [items, setItems] = useState([]);
  const [credits, setCredits] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => onRequest((item) => setItems((list) => [item, ...list].slice(0, 8))), []);

  const checkBalance = async () => {
    setChecking(true);
    try {
      setCredits(await balance());
    } catch {
      setCredits(null);
    } finally {
      setChecking(false);
    }
  };

  return (
    <section className="liq-log" aria-label="Requisições ao LocationIQ">
      <header className="liq-log-head">
        <h3>
          <FiActivity aria-hidden="true" /> Requisições ao LocationIQ
        </h3>
        <button type="button" onClick={checkBalance} disabled={checking}>
          <FiRefreshCw aria-hidden="true" />
          {credits ? `Restam hoje: ${Number(credits.day).toLocaleString("pt-BR")}` : "Ver saldo do dia"}
        </button>
      </header>

      {items.length === 0 ? (
        <p className="liq-log-empty">Faça uma busca, clique no mapa ou trace uma rota: as chamadas aparecem aqui.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <span className={`liq-status ${item.status >= 200 && item.status < 300 ? "ok" : "fail"}`}>
                {item.status || "—"}
              </span>
              <strong>{item.name}</strong>
              <code>{item.url}</code>
              <small>{item.ms} ms</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
