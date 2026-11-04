function ParticipanteCard({ participante, onVotar }) {
  const { nome, foto, naRoca } = participante;

  return (
    <article className={naRoca ? 'card card-roca' : 'card'}>
      {naRoca && <span className="selo-roca">Na roça</span>}

      <img src={foto} alt={nome} className="card-foto" />

      <div className="card-corpo">
        <h3 className="card-nome">{nome}</h3>

        {onVotar && (
          <button type="button" className="botao botao-votar" onClick={() => onVotar(participante)}>
            Votar para eliminar
          </button>
        )}
      </div>
    </article>
  );
}

export default ParticipanteCard;
