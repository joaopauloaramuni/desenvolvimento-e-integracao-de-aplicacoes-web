import "./Skeleton.css";

/**
 * Tela de esqueleto (skeleton screen - Aula 18).
 * Mostra a forma do conteúdo que vai chegar, o que parece mais rápido que
 * um spinner. Para leitores de tela, anuncia só "Carregando...".
 */
export default function Skeleton({ linhas = 3, quantidade = 6, rotulo = "Carregando…" }) {
  return (
    <div role="status" className="skeleton-grade">
      <span className="sr-only">{rotulo}</span>
      {Array.from({ length: quantidade }, (_, i) => (
        <div key={i} className="skeleton-cartao" aria-hidden="true">
          <div className="skeleton-bloco skeleton-titulo" />
          {Array.from({ length: linhas }, (_, j) => (
            <div key={j} className="skeleton-bloco" style={{ width: `${90 - j * 18}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}
