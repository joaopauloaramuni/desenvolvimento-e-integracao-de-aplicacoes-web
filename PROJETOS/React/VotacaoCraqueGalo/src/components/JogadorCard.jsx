// Texto do selo exibido de acordo com a situação do jogador.
// Jogadores do elenco ('elenco') não têm selo.
const SELOS = {
  indicado: 'Indicado',
  suspenso: 'Suspenso',
};

function JogadorCard({ jogador, selecionado = false, onSelecionar }) {
  const { nome, numero, posicao, foto, situacao } = jogador;
  const selo = SELOS[situacao];

  return (
    <article className={`card card-${situacao}${selecionado ? ' card-selecionado' : ''}`}>
      {selo && <span className={`selo selo-${situacao}`}>{selo}</span>}

      <img src={foto} alt={nome} className="card-foto" />

      <div className="card-corpo">
        <h3 className="card-nome">
          <span className="card-numero">{numero}</span> {nome}
        </h3>
        <p className="card-posicao">{posicao}</p>

        {onSelecionar && (
          <button
            type="button"
            className="botao botao-selecionar"
            aria-pressed={selecionado}
            onClick={() => onSelecionar(jogador)}
          >
            {selecionado ? '✓ Selecionado' : 'Selecionar'}
          </button>
        )}
      </div>
    </article>
  );
}

export default JogadorCard;
