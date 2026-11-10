/**
 * Configurações gerais do projeto.
 */

/** API pública da YGOPRODeck (sem chave). Limite: ~20 requisições por segundo. */
export const API_BASE = "https://db.ygoprodeck.com/api/v7";

/** Cartas por página na lista. */
export const PAGE_SIZE = 24;

/** Quantas cartas do deck do Yugi aparecem em destaque na home. */
export const FEATURED_COUNT = 6;

/**
 * Cartas clássicas do deck do Yugi (ids/passcodes da YGOPRODeck).
 * A home sorteia FEATURED_COUNT delas; "Sortear outras" refaz o sorteio.
 * Um id que a API não encontrar é simplesmente ignorado.
 */
export const YUGI_DECK = [
  46986414, // Dark Magician
  38033121, // Dark Magician Girl
  40640057, // Kuriboh
  33396948, // Exodia the Forbidden One
  70781052, // Summoned Skull
  91152256, // Celtic Guardian
  6368038, // Gaia The Fierce Knight
  28279543, // Curse of Dragon
  65240384, // Big Shield Gardna
  99785935, // Alpha The Magnet Warrior
  39256679, // Beta The Magnet Warrior
  11549357, // Gamma The Magnet Warrior
  5405694, // Black Luster Soldier
  30208479, // Magician of Black Chaos
  78193831, // Buster Blader
  10000020, // Slifer the Sky Dragon
  2314238, // Dark Magic Attack
  72302403, // Swords of Revealing Light
  83764718, // Monster Reborn
  24094653, // Polymerization
  4031928, // Change of Heart
  44095762, // Mirror Force
  81210420, // Magical Hats
  18807108, // Spellbinding Circle
  40703222, // Multiply
];

/** Chaves do localStorage. */
export const STORAGE_KEYS = {
  ownerToken: "yugioh:owner-token",
  theme: "yugioh:theme",
  language: "yugioh:language",
  music: "yugioh:music",
};

/** Volume da música de fundo (0 a 1). */
export const MUSIC_VOLUME = 0.35;

/**
 * Fumaça do React Bits (SplashCursor) na home.
 * Âmbar: poeira de areia dourada na luz do templo.
 * Troque por "#FFD66B" (ouro do Milênio), "#B5441F" (brasa) ou "#7A4BE0" (violeta do Reino das Sombras).
 */
export const SMOKE_COLOR = "#E39A2D";

/** Imagens das cartas (CDN da YGOPRODeck). */
export const imageUrl = (id) => `https://images.ygoprodeck.com/images/cards/${id}.jpg`;
export const imageSmallUrl = (id) => `https://images.ygoprodeck.com/images/cards_small/${id}.jpg`;

/** Friso decorativo: Olho de Hórus, ankh, escaravelho, Olho de Rá, leão, pilar djed, sol, serpente, coruja. */
export const FRISO = "𓂀 𓋹 𓆣 𓁹 𓃭 𓊽 𓇳 𓆓 𓅓 𓂀 𓋹 𓆣 𓁹 𓃭 𓊽 𓇳 𓆓 𓅓 𓂀 𓋹 𓆣 𓁹 𓃭 𓊽 𓇳 𓆓 𓅓 𓂀 𓋹 𓆣";
