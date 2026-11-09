import PokemonImage from "../PokemonImage/PokemonImage";
import TrainerAvatar from "../TrainerAvatar/TrainerAvatar";

const SLOTS_DE_INSIGNIA = 8;

function textoInsignias(quantidade) {
  if (quantidade === 0) return "Nenhuma insígnia";
  return quantidade === 1 ? "1 insígnia" : `${quantidade} insígnias`;
}

/** Um treinador: imagem (Pokémon Showdown), nome, insígnias e o time. Cada Pokémon do time abre os detalhes. */
export default function TrainerCard({ treinador, destacado, onOpen }) {
  const slots = Math.max(SLOTS_DE_INSIGNIA, treinador.badges);
  const tituloId = `treinador-${treinador.id}-nome`;

  return (
    <li>
      <article
        id={`treinador-${treinador.id}`}
        className={`trainer-card ${destacado ? "is-highlighted" : ""}`.trim()}
        tabIndex={-1}
        aria-labelledby={tituloId}
      >
        <header className="trainer-card__head">
          <TrainerAvatar treinador={treinador} />
          <div className="trainer-card__title">
            <h2 id={tituloId} className="trainer-card__name">
              {treinador.name}
            </h2>
            <p className="trainer-card__meta">
              {textoInsignias(treinador.badges)}, {treinador.pokemon.length} Pokémon
            </p>
          </div>
        </header>

        <div className="trainer-card__badges" aria-hidden="true">
          {Array.from({ length: slots }, (_, i) => (
            <span key={i} className={`badge-pip ${i < treinador.badges ? "is-on" : ""}`.trim()} />
          ))}
        </div>

        <ul className="trainer-card__team" aria-label={`Time de ${treinador.name}`}>
          {treinador.pokemon.map((pokemon, indice) => (
            // O mesmo Pokémon pode aparecer mais de uma vez no time: a chave usa a posição.
            <li key={`${pokemon.id}-${indice}`}>
              <button
                type="button"
                className="team-slot"
                style={{ "--type-color": pokemon.types[0].color }}
                onClick={() => onOpen(pokemon.id, treinador.pokemonIds, indice)}
              >
                <span className="team-slot__window">
                  <PokemonImage src={pokemon.sprite} alt="" pixelated size={72} />
                </span>
                <span className="team-slot__name">{pokemon.name}</span>
                <span className="team-slot__number">{pokemon.number}</span>
              </button>
            </li>
          ))}
        </ul>
      </article>
    </li>
  );
}
