/**
 * Configurações gerais da Pokédex.
 */

/** Quantidade de Pokémon da primeira geração (Kanto), a mesma do pokedex-data.json. */
export const TOTAL_POKEMON = 151;

/** Maior valor possível de um atributo base. As barras usam essa escala. */
export const STAT_MAX = 255;

/**
 * Imagens da PokéAPI (repositório público PokeAPI/sprites no GitHub).
 * São as mesmas URLs que a API devolve em sprites.front_default e
 * sprites.other["official-artwork"].front_default, montadas direto pelo ID
 * para não precisar de uma requisição por Pokémon.
 */
const SPRITES_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export const spriteUrl = (id) => `${SPRITES_BASE}/${id}.png`;
export const artworkUrl = (id) => `${SPRITES_BASE}/other/official-artwork/${id}.png`;

/**
 * GIF animado do Pokémon Showdown (mesmo arquivo de sprites.other.showdown.front_default).
 * Os detalhes usam este GIF quando não há animação própria (Higgsfield) em public/animations.
 */
export const animatedUrl = (id) => `${SPRITES_BASE}/other/showdown/${id}.gif`;

/**
 * Animação própria do Pokémon (vídeo gerado no Higgsfield e convertido para WebM transparente).
 * Só é usada para os ids listados em src/data/animacoes.json. Passo a passo em docs/animacoes.md.
 */
export const animationVideoUrl = (id) => `${import.meta.env.BASE_URL}animations/${id}.webm`;

/**
 * Imagens dos treinadores (Pokémon Showdown).
 * O Showdown publica os sprites dos treinadores em
 * https://play.pokemonshowdown.com/sprites/trainers/{nome}.png
 * (a lista completa aparece em https://play.pokemonshowdown.com/sprites/trainers/).
 *
 * O pokedex-data.json só tem o nome do treinador, então aqui fica o "apelido"
 * do arquivo no Showdown. Cada treinador tem uma lista: se o primeiro sprite
 * não carregar, o TrainerAvatar tenta o próximo e, no fim, mostra as iniciais.
 */
const TRAINER_SPRITES_BASE = "https://play.pokemonshowdown.com/sprites/trainers";

export const trainerSpriteUrl = (nome) => `${TRAINER_SPRITES_BASE}/${nome}.png`;

/** Nome do treinador no JSON -> arquivos do Showdown, em ordem de preferência. */
export const TRAINER_SPRITES = {
  ash: ["ash", "ash-capbackward", "red"],
  brock: ["brock", "brock-gen3", "brock-gen1"],
  misty: ["misty", "misty-gen3", "misty-gen1"],
  "lt. surge": ["ltsurge", "ltsurge-gen3", "ltsurge-gen1"],
  erika: ["erika", "erika-gen3", "erika-gen1"],
  koga: ["koga", "koga-gen3", "koga-gen1"],
  sabrina: ["sabrina", "sabrina-gen3", "sabrina-gen1"],
  blaine: ["blaine", "blaine-gen3", "blaine-gen1"],
  giovanni: ["giovanni", "giovanni-gen3", "giovanni-gen1"],
  // O Gary é o "Blue" dos jogos (e do Showdown).
  gary: ["blue", "blue-gen3", "blue-gen1"],
  "team rocket": ["teamrocket", "rocketgrunt", "rocketgrunt-gen3"],
  lance: ["lance", "lance-gen3", "lance-gen1"],
};

/** URLs candidatas para a imagem de um treinador (pode ser lista vazia). */
export function trainerSpriteUrls(nomeTreinador) {
  const chave = String(nomeTreinador).trim().toLowerCase();
  const nomes = TRAINER_SPRITES[chave] ?? [chave.replace(/[^a-z0-9]/g, "")];
  return nomes.filter(Boolean).map(trainerSpriteUrl);
}

/** Chaves do localStorage. */
export const STORAGE_KEYS = {
  ownerToken: "pokedex:owner-token",
  theme: "pokedex:theme",
  skin: "pokedex:skin",
};

/**
 * Temas do aparelho (o "visual" da Pokédex). Independem do modo noturno:
 * os dois temas têm luz do dia e noturno.
 * - classico: o aparelho desenhado só com CSS (carcaça vermelha, tela clara).
 * - holo: o fundo src/assets/images/holo-fundo.webp (moldura vermelha + tela azul
 *   holográfica com a Pokébola), com os cards transparentes por cima da arte.
 * O index.html usa os mesmos ids para aplicar o tema antes do React carregar.
 */
export const SKINS = [
  { id: "classico", label: "Clássico" },
  { id: "holo", label: "Holo" },
];
