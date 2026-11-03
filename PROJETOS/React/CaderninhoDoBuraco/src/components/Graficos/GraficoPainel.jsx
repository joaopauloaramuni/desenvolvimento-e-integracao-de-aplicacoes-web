import "./Graficos.css";

/** A moldura de cada gráfico: título, uma frase do que ele mostra e o gráfico. */
function GraficoPainel({ titulo, descricao, children, largo = false }) {
  return (
    <section className={`painel grafico${largo ? " grafico--largo" : ""}`}>
      <h3>{titulo}</h3>
      {descricao && <p>{descricao}</p>}
      <div className="grafico__area">{children}</div>
    </section>
  );
}

export default GraficoPainel;
