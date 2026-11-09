/**
 * Tipos dos Pokémon: nome em pt-BR e cor de cada tipo.
 * O nome original (em inglês) continua sendo o que vem do pokedex-data.json.
 */

export const TYPELESS = { id: 0, name: "Typeless" };

const TIPOS = {
  Typeless: { label: "Sem tipo", color: "#8E9AA0" },
  Normal: { label: "Normal", color: "#A8A77A" },
  Fire: { label: "Fogo", color: "#EE8130" },
  Water: { label: "Água", color: "#6390F0" },
  Grass: { label: "Planta", color: "#7AC74C" },
  Electric: { label: "Elétrico", color: "#F7D02C" },
  Ice: { label: "Gelo", color: "#96D9D6" },
  Fighting: { label: "Lutador", color: "#C22E28" },
  Poison: { label: "Venenoso", color: "#A33EA1" },
  Ground: { label: "Terrestre", color: "#E2BF65" },
  Flying: { label: "Voador", color: "#A98FF3" },
  Psychic: { label: "Psíquico", color: "#F95587" },
  Bug: { label: "Inseto", color: "#A6B91A" },
  Rock: { label: "Pedra", color: "#B6A136" },
  Ghost: { label: "Fantasma", color: "#735797" },
  Dark: { label: "Sombrio", color: "#705746" },
  Dragon: { label: "Dragão", color: "#6F35FC" },
  Steel: { label: "Aço", color: "#B7B7CE" },
};

/** Luminância relativa (WCAG) de uma cor #RRGGBB. */
function luminancia(hex) {
  const canais = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = canais.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const TINTA_CLARA = "#FFFFFF";
const TINTA_ESCURA = "#1A1408";

/** Escolhe a cor do texto (branco ou escuro) com mais contraste sobre a cor do tipo. */
function tintaPara(hex) {
  const l = luminancia(hex);
  const contrasteBranco = 1.05 / (l + 0.05);
  const contrasteEscuro = (l + 0.05) / (luminancia(TINTA_ESCURA) + 0.05);
  return contrasteBranco >= contrasteEscuro ? TINTA_CLARA : TINTA_ESCURA;
}

/** { id, name } do JSON -> { id, name, label, color, ink } */
export function createPokemonType({ id, name }) {
  const info = TIPOS[name] ?? { label: name, color: TIPOS.Typeless.color };
  return { id, name, label: info.label, color: info.color, ink: tintaPara(info.color) };
}
