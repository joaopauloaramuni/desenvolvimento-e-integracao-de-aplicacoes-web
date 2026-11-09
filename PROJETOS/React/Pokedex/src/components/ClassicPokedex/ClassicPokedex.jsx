import pokedexClassica from "../../assets/images/pokedex-classica.webp";
import PokemonImage from "../PokemonImage/PokemonImage";
import "./ClassicPokedex.css";

/**
 * A Pokédex clássica (imagem em src/assets/images/pokedex-classica.webp) com o
 * sprite do Pokémon escolhido aparecendo na telinha dela.
 *
 * O painel direito também ganha vida: número e nome no visor preto e os tipos
 * nos dois retângulos de baixo.
 *
 * As posições foram medidas na imagem original (684 x 523 px) e estão em
 * porcentagem no CSS, então tudo acompanha a imagem em qualquer tamanho:
 * tela x 105-269 / y 202-318, visor x 406-615 / y 169-228,
 * retângulos x 405-493 e 520-619 / y 407-438.
 */
export default function ClassicPokedex({ pokemon }) {
  return (
    <figure className="classic-pokedex" style={{ "--type-color": pokemon.types[0].color }}>
      <div className="classic-pokedex__device">
        <img
          className="classic-pokedex__image"
          src={pokedexClassica}
          alt=""
          width={684}
          height={523}
          draggable="false"
        />
        <div className="classic-pokedex__screen">
          {/* key: a tela "pisca" de novo a cada Pokémon */}
          <PokemonImage
            key={pokemon.id}
            className="classic-pokedex__sprite"
            src={pokemon.sprite}
            alt={`${pokemon.name} na tela da Pokédex clássica`}
            pixelated
            eager
            size={96}
          />
        </div>

        {/* Painel direito: número e nome no visor, tipos nos dois retângulos de baixo */}
        <div className="classic-pokedex__display" aria-hidden="true" key={`visor-${pokemon.id}`}>
          <span className="classic-pokedex__display-number">{pokemon.number}</span>
          <span className="classic-pokedex__display-name">{pokemon.name}</span>
        </div>
        {[0, 1].map((i) => {
          const tipo = pokemon.types[i];
          return (
            <span
              key={i}
              className={`classic-pokedex__slot classic-pokedex__slot--${i + 1}`}
              style={tipo ? { "--slot-color": tipo.color } : undefined}
              aria-hidden="true"
            >
              {tipo ? tipo.label : "---"}
            </span>
          );
        })}
      </div>
      <figcaption className="classic-pokedex__caption">Pokédex clássica</figcaption>
    </figure>
  );
}
