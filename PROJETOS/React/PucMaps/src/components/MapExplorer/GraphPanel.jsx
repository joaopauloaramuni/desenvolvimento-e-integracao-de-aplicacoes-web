/**
 * Liga/desliga o desenho do grafo de caminhos e mostra os números dele.
 */
export default function GraphPanel({ stats, showGraph, onShowGraph }) {
  return (
    <div className="graph-panel">
      <p className="map-panel-hint">
        O GPS não funciona bem entre prédios. Por isso o PUCMaps transforma as calçadas, escadas e entradas do
        campus em um <strong>grafo</strong>: cada cruzamento vira um nó e cada trecho vira uma aresta com
        distância e tempo. A rota é o caminho de menor tempo nesse grafo (algoritmo de Dijkstra).
      </p>

      <button
        type="button"
        className={`graph-toggle ${showGraph ? "active" : ""}`}
        aria-pressed={showGraph}
        onClick={() => onShowGraph(!showGraph)}
      >
        {showGraph ? "Ocultar grafo" : "Mostrar grafo no mapa"}
      </button>

      <dl className="graph-stats">
        <div>
          <dt>Nós</dt>
          <dd>{stats.nodes.toLocaleString("pt-BR")}</dd>
        </div>
        <div>
          <dt>Arestas</dt>
          <dd>{stats.edges.toLocaleString("pt-BR")}</dd>
        </div>
        <div>
          <dt>Trechos de escada</dt>
          <dd>{stats.steps.toLocaleString("pt-BR")}</dd>
        </div>
        <div>
          <dt>Ilhas (partes soltas)</dt>
          <dd>{stats.islands.toLocaleString("pt-BR")}</dd>
        </div>
      </dl>

      <h3 className="graph-legend-title">Legenda</h3>
      <ul className="graph-legend">
        <li>
          <i className="line blue" aria-hidden="true" /> Caminho a pé (calçada, rua interna)
        </li>
        <li>
          <i className="line red" aria-hidden="true" /> Escada (não acessível)
        </li>
        <li>
          <i className="line orange dashed" aria-hidden="true" /> Ligação gerada entre prédio e caminho
        </li>
        <li>
          <i className="dot white" aria-hidden="true" /> Nó (cruzamento)
        </li>
        <li>
          <i className="dot orange" aria-hidden="true" /> Entrada de um local
        </li>
      </ul>
    </div>
  );
}
