import { imageSmallUrl, imageUrl } from "../config/appConfig";
import { getFrame } from "./FrameType";

/**
 * Transforma uma carta da API da YGOPRODeck em um objeto pronto para a tela.
 * Guarda os valores originais da API (frameType, race, attribute...): os nomes
 * traduzidos saem do i18next na hora de mostrar (veja src/i18n/useCardLabels.js).
 */
export function createCard(api) {
  const isMonster = api.type?.includes("Monster") ?? false;
  const isLink = api.frameType === "link";
  const isXyz = api.frameType?.startsWith("xyz") ?? false;
  const imagem = api.card_images?.[0];

  return {
    id: api.id,
    name: api.name, // já vem traduzido pela API quando language=pt
    type: api.type,
    frameType: api.frameType,
    frame: getFrame(api.frameType),
    desc: api.desc ?? "",
    // Cartas de Pêndulo trazem os dois textos separados
    pendDesc: api.pend_desc ?? null,
    monsterDesc: api.monster_desc ?? null,
    isMonster,
    isLink,
    isXyz,
    atk: api.atk ?? null,
    def: isLink ? null : (api.def ?? null),
    level: api.level ?? null,
    linkval: api.linkval ?? null,
    linkmarkers: api.linkmarkers ?? [],
    scale: api.scale ?? null,
    race: api.race ?? null,
    attribute: api.attribute ?? null,
    archetype: api.archetype ?? null,
    typeline: api.typeline ?? [],
    sets: api.card_sets ?? [],
    prices: api.card_prices?.[0] ?? null,
    image: imagem?.image_url ?? imageUrl(api.id),
    imageSmall: imagem?.image_url_small ?? imageSmallUrl(api.id),
    url: api.ygoprodeck_url ?? `https://ygoprodeck.com/card/?search=${api.id}`,
  };
}
