import { memo } from "react";
import { STATS } from "../../model/Pokemon";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import PokemonImage from "../PokemonImage/PokemonImage";
import StatBar from "../StatBar/StatBar";
import TypeBadge from "../TypeBadge/TypeBadge";
import "./PokemonCard.css";

/**
 * Um Pokémon na lista: número, nome, tipos e os seis atributos.
 * O card inteiro abre os detalhes; a estrela fica fora do botão (botão dentro de botão não é permitido).
 * memo: favoritar um Pokémon redesenha só o card que mudou.
 */
function PokemonCard({
  pokemon,
  isFavorite,
  isSaving,
  favoritesEnabled,
  onOpen,
  onToggleFavorite,
}) {
  const cor = pokemon.types[0].color;

  return (
    <li className="pokemon-card" style={{ "--type-color": cor }}>
      <button type="button" className="pokemon-card__open" onClick={() => onOpen(pokemon.id)}>
        <span className="pokemon-card__window">
          <PokemonImage src={pokemon.sprite} alt="" pixelated size={96} />
        </span>

        <span className="pokemon-card__info">
          <span className="pokemon-card__number">{pokemon.number}</span>
          <span className="pokemon-card__name">{pokemon.name}</span>
          <span className="pokemon-card__types">
            {pokemon.types.map((tipo) => (
              <TypeBadge key={tipo.id} type={tipo} size="sm" />
            ))}
          </span>
        </span>

        <span className="pokemon-card__stats">
          {STATS.map((stat) => (
            <StatBar
              key={stat.key}
              variant="compact"
              label={stat.label}
              shortLabel={stat.short}
              value={pokemon.stats[stat.key]}
              color={cor}
            />
          ))}
        </span>
      </button>

      <FavoriteButton
        className="pokemon-card__favorite"
        pokemon={pokemon}
        isFavorite={isFavorite}
        isSaving={isSaving}
        enabled={favoritesEnabled}
        onToggle={onToggleFavorite}
      />
    </li>
  );
}

export default memo(PokemonCard);
