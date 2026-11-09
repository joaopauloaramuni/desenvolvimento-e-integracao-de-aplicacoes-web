import dados from "../data/pokedex-data.json";
import { createPokemon, STATS } from "../model/Pokemon";
import { createPokemonType } from "../model/PokemonType";
import { createTrainer } from "../model/Trainer";
import { normalizar } from "../utils/text";

/**
 * Tudo que a Pokédex sabe vem do pokedex-data.json (src/data).
 * Os dados são estáticos, então são preparados uma vez só, quando o módulo carrega.
 */

const POKEMON = dados.pokemon.map(createPokemon).sort((a, b) => a.id - b.id);
const POR_ID = new Map(POKEMON.map((p) => [p.id, p]));
const TREINADORES = dados.trainers.map((t) => createTrainer(t, (id) => POR_ID.get(id)));

export function getAllPokemon() {
  return POKEMON;
}

export function getPokemonById(id) {
  return POR_ID.get(Number(id)) ?? null;
}

export function getTrainers() {
  return TREINADORES;
}

/** Treinadores que têm este Pokémon no time. */
export function getTrainersOf(pokemonId) {
  return TREINADORES.filter((t) => t.pokemonIds.includes(pokemonId));
}

/**
 * Tipos para o filtro: só os que aparecem em algum Pokémon do arquivo,
 * na ordem da lista "types" do JSON. "Typeless" entra porque o Mew vem sem tipo.
 */
export function getAvailableTypes() {
  const usados = new Set(POKEMON.flatMap((p) => p.types.map((t) => t.name)));
  return dados.types.filter((t) => usados.has(t.name)).map(createPokemonType);
}

/** Quantos Pokémon da lista têm cada tipo: Map("Fire" -> 12). */
export function countByType(lista) {
  const contagem = new Map();
  for (const pokemon of lista) {
    for (const tipo of pokemon.types) {
      contagem.set(tipo.name, (contagem.get(tipo.name) ?? 0) + 1);
    }
  }
  return contagem;
}

const ID_REGEX = /^#?\s*0*(\d{1,3})$/;

/**
 * Pesquisa por nome ou ID e filtro por tipo.
 * - "bulba", "BULBA", "mr mime" -> nome contém o texto (sem acento e pontuação)
 * - "25", "#25", "025"          -> ID exato
 */
export function filterPokemon(lista, { busca = "", tipo = null } = {}) {
  const texto = busca.trim();
  const numero = texto.match(ID_REGEX);
  const nome = normalizar(texto);

  return lista.filter((pokemon) => {
    if (tipo && !pokemon.types.some((t) => t.name === tipo)) return false;
    if (!texto) return true;
    if (numero) return pokemon.id === Number(numero[1]);
    return nome !== "" && pokemon.searchName.includes(nome);
  });
}

/** Opções de ordenação: ID, nome, cada atributo e o total. */
export const SORT_OPTIONS = [
  { value: "id", label: "Número", direcaoPadrao: "asc" },
  { value: "name", label: "Nome", direcaoPadrao: "asc" },
  ...STATS.map((s) => ({ value: s.key, label: s.label, direcaoPadrao: "desc" })),
  { value: "total", label: "Total de atributos", direcaoPadrao: "desc" },
];

const comparadorNome = new Intl.Collator("pt-BR", { sensitivity: "base" });

function valorDe(pokemon, campo) {
  if (campo === "id") return pokemon.id;
  if (campo === "total") return pokemon.total;
  return pokemon.stats[campo] ?? 0;
}

/** Ordena sem alterar a lista original. Empate desempata pelo número. */
export function sortPokemon(lista, { campo = "id", direcao = "asc" } = {}) {
  const sinal = direcao === "desc" ? -1 : 1;
  return [...lista].sort((a, b) => {
    const diferenca =
      campo === "name"
        ? comparadorNome.compare(a.name, b.name)
        : valorDe(a, campo) - valorDe(b, campo);
    return diferenca !== 0 ? diferenca * sinal : a.id - b.id;
  });
}

/**
 * Posição de um atributo entre os 151 (1 = o maior). Empates dividem a posição:
 * se dois Pokémon têm o maior valor, os dois ficam em 1º.
 */
export function getStatRank(pokemon, campo) {
  const valor = valorDe(pokemon, campo);
  return POKEMON.filter((p) => valorDe(p, campo) > valor).length + 1;
}

/** O melhor atributo do Pokémon e a posição dele entre os 151. */
export function getBestStat(pokemon) {
  const melhor = STATS.reduce((a, b) => (pokemon.stats[b.key] > pokemon.stats[a.key] ? b : a));
  return { ...melhor, valor: pokemon.stats[melhor.key], posicao: getStatRank(pokemon, melhor.key) };
}

/** Outros Pokémon com o mesmo tipo principal, em ordem de número. */
export function getSameTypePokemon(pokemon) {
  const tipo = pokemon.types[0].name;
  return POKEMON.filter((p) => p.id !== pokemon.id && p.types.some((t) => t.name === tipo));
}
