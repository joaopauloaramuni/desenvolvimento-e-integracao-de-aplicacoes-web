import { useEffect, useRef } from "react";
import "./ContributorStats.css";

/** Aba "Log de execução": o histórico de cada etapa da análise. */
export default function ExecutionLog({ entries }) {
  const boxRef = useRef(null);

  // Rola (só a caixa do log) para o fim a cada nova linha
  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [entries.length]);

  return (
    <section className="cs-card">
      <div ref={boxRef} className="cs-log" role="log" aria-live="polite">
        {!entries.length && <p className="cs-empty">Nenhuma análise executada ainda.</p>}
        {entries.map((e) => (
          <p key={e.id} className={`cs-log-line is-${e.level}`}>
            <time>{e.time}</time> {e.message}
          </p>
        ))}
      </div>
    </section>
  );
}
