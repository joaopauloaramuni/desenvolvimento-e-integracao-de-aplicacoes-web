// Texto do selo exibido de acordo com a situação do participante.
// Peões fora da roça ('peao') não têm selo.
const SELOS = {
  roca: 'Na roça',
  fazendeiro: 'Fazendeiro',
};

function ParticipanteCard({ participante, selecionado = false, onSelecionar }) {
  const { nome, foto, situacao } = participante;
  const selo = SELOS[situacao];

  return (
    <article className={`card card-${situacao}${selecionado ? ' card-selecionado' : ''}`}>
      {selo && <span className={`selo selo-${situacao}`}>{selo}</span>}

      <img src={foto} alt={nome} className="card-foto" />

      <div className="card-corpo">
        <h3 className="card-nome">{nome}</h3>

        {onSelecionar && (
          <button
            type="button"
            className="botao botao-selecionar"
            aria-pressed={selecionado}
            onClick={() => onSelecionar(participante)}
          >
            {selecionado ? '✓ Selecionado' : 'Selecionar'}
          </button>
        )}
      </div>
    </article>
  );
}

export default ParticipanteCard;
