import "./TypeFilter.css";

/**
 * Filtro por tipo: um botão por tipo presente no pokedex-data.json.
 * Clicar no tipo selecionado (ou em "Todos") tira o filtro.
 */
export default function TypeFilter({ tipos, contagem, total, selecionado, onAlternar, onLimpar }) {
  return (
    <fieldset className="type-filter">
      <legend className="type-filter__legend">Tipo</legend>
      <div className="type-filter__chips">
        <button
          type="button"
          className="type-chip type-chip--all"
          aria-pressed={selecionado === null}
          onClick={onLimpar}
        >
          Todos <span className="type-chip__count">{total}</span>
        </button>

        {tipos.map((tipo) => {
          const quantidade = contagem.get(tipo.name) ?? 0;
          return (
            <button
              key={tipo.id}
              type="button"
              className="type-chip"
              aria-pressed={selecionado === tipo.name}
              data-empty={quantidade === 0 || undefined}
              style={{ "--chip-color": tipo.color, "--chip-ink": tipo.ink }}
              onClick={() => onAlternar(tipo.name)}
            >
              <span className="type-chip__dot" aria-hidden="true" />
              {tipo.label}
              <span className="type-chip__count">{quantidade}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
