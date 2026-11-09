import { trainerSpriteUrls } from "../config/appConfig";

/**
 * Um treinador do pokedex-data.json, com os Pokémon já resolvidos pelo ID.
 * sprites: URLs da imagem do treinador no Pokémon Showdown, em ordem de preferência.
 * pokemonIds pode repetir (o Koga tem três Venonat): a ordem e as repetições são mantidas.
 */
export function createTrainer(raw, buscarPokemon) {
  return Object.freeze({
    id: raw.id,
    name: raw.name,
    sprites: trainerSpriteUrls(raw.name),
    badges: Number(raw.badges ?? 0),
    pokemonIds: [...raw.pokemonIds],
    pokemon: raw.pokemonIds.map(buscarPokemon).filter(Boolean),
  });
}
