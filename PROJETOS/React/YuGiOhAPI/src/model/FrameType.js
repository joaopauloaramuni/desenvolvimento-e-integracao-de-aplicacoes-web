/**
 * Cor da moldura de cada "frameType" devolvido pela API (as cores das cartas físicas).
 * Os NOMES de tipos, atributos e raças ficam nos arquivos de tradução (src/i18n/locales).
 */
export const FRAME_TYPES = {
  normal: { color: "#C9A55B", text: "#2A1E08" },
  effect: { color: "#C46A35", text: "#FFFFFF" },
  ritual: { color: "#5B7FC7", text: "#FFFFFF" },
  fusion: { color: "#8C5FB5", text: "#FFFFFF" },
  synchro: { color: "#E4E4E4", text: "#1C1838" },
  xyz: { color: "#2B2B2B", text: "#F2E7C4" },
  link: { color: "#1E4FA8", text: "#FFFFFF" },
  spell: { color: "#1D8F78", text: "#FFFFFF" },
  trap: { color: "#B4497E", text: "#FFFFFF" },
  token: { color: "#8E8A98", text: "#FFFFFF" },
  skill: { color: "#2C7FB8", text: "#FFFFFF" },
  normal_pendulum: { color: "#C9A55B", text: "#2A1E08", pendulum: true },
  effect_pendulum: { color: "#C46A35", text: "#FFFFFF", pendulum: true },
  ritual_pendulum: { color: "#5B7FC7", text: "#FFFFFF", pendulum: true },
  fusion_pendulum: { color: "#8C5FB5", text: "#FFFFFF", pendulum: true },
  synchro_pendulum: { color: "#E4E4E4", text: "#1C1838", pendulum: true },
  xyz_pendulum: { color: "#2B2B2B", text: "#F2E7C4", pendulum: true },
};

const DESCONHECIDO = { color: "#8E8A98", text: "#FFFFFF" };

/** { key, color, text }: "key" é a chave da tradução em "frame.<key>". */
export function getFrame(frameType) {
  return FRAME_TYPES[frameType] ? { key: frameType, ...FRAME_TYPES[frameType] } : { key: "unknown", ...DESCONHECIDO };
}

/** Valores aceitos pelo filtro "type" da API (nome traduzido em "cardTypes.<valor>"). */
export const CARD_TYPES = [
  { value: "Normal Monster", frame: "normal" },
  { value: "Effect Monster", frame: "effect" },
  { value: "Ritual Effect Monster", frame: "ritual" },
  { value: "Fusion Monster", frame: "fusion" },
  { value: "Synchro Monster", frame: "synchro" },
  { value: "XYZ Monster", frame: "xyz" },
  { value: "Link Monster", frame: "link" },
  { value: "Pendulum Effect Monster", frame: "effect_pendulum" },
  { value: "Spell Card", frame: "spell" },
  { value: "Trap Card", frame: "trap" },
];

/** Valores aceitos pelo filtro "attribute" (nome traduzido em "attributes.<valor>"). */
export const ATTRIBUTES = ["DARK", "LIGHT", "EARTH", "WATER", "FIRE", "WIND", "DIVINE"];

/** Valores aceitos pelo parâmetro "sort" (nome traduzido em "sort.<valor>"). */
export const SORT_OPTIONS = ["name", "new", "atk", "def", "level"];
