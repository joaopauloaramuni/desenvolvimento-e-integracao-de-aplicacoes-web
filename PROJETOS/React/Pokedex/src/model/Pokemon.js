import { animatedUrl, artworkUrl, spriteUrl } from "../config/appConfig";
import { formatarNumero, normalizar } from "../utils/text";
import { createPokemonType, TYPELESS } from "./PokemonType";

/** Os seis atributos, na ordem em que aparecem na tela. */
export const STATS = [
  { key: "hp", label: "HP", short: "HP" },
  { key: "attack", label: "Ataque", short: "Atq" },
  { key: "defense", label: "Defesa", short: "Def" },
  { key: "specialAttack", label: "Ataque Especial", short: "AtE" },
  { key: "specialDefense", label: "Defesa Especial", short: "DfE" },
  { key: "speed", label: "Velocidade", short: "Vel" },
];

/**
 * Um Pokémon do pokedex-data.json, pronto para a tela.
 *
 * Além dos campos do JSON, ganha: número formatado (#025), soma dos atributos,
 * nome normalizado para a pesquisa e as URLs das imagens.
 * Pokémon sem tipo no JSON (o Mew, #151) recebe o tipo "Typeless".
 */
export function createPokemon(raw) {
  const tipos = raw.types?.length ? raw.types : [TYPELESS];
  const stats = Object.fromEntries(STATS.map(({ key }) => [key, Number(raw.stats?.[key] ?? 0)]));

  return Object.freeze({
    id: raw.id,
    name: raw.name,
    number: formatarNumero(raw.id),
    searchName: normalizar(raw.name),
    types: tipos.map(createPokemonType),
    stats,
    total: Object.values(stats).reduce((soma, valor) => soma + valor, 0),
    sprite: spriteUrl(raw.id),
    artwork: artworkUrl(raw.id),
    animated: animatedUrl(raw.id),
  });
}
