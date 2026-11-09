import { useCallback, useMemo } from "react";
import PokemonCard from "../PokemonCard/PokemonCard";
import "./PokemonList.css";

/**
 * Lista de Pokémon (renderizada com map). Sem itens, mostra o estado vazio recebido.
 * Ao abrir um Pokémon, manda junto a ordem da lista: os botões Anterior/Próximo
 * dos detalhes seguem exatamente o que está na tela.
 */
export default function PokemonList({
  pokemons,
  favoriteIds,
  salvando,
  favoritesEnabled,
  onOpen,
  onToggleFavorite,
  vazio,
}) {
  const ids = useMemo(() => pokemons.map((p) => p.id), [pokemons]);
  const abrir = useCallback((id) => onOpen(id, ids), [onOpen, ids]);

  if (pokemons.length === 0) return vazio;

  return (
    <ul className="pokemon-list">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          isFavorite={favoriteIds.has(pokemon.id)}
          isSaving={salvando.has(pokemon.id)}
          favoritesEnabled={favoritesEnabled}
          onOpen={abrir}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ul>
  );
}
