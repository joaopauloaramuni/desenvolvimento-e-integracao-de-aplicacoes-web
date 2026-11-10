import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/**
 * Nomes traduzidos de uma carta (tipo da moldura, atributo, raça, typeline...).
 * Valores que não estão nos arquivos de tradução aparecem como vieram da API.
 */
export function useCardLabels() {
  const { t } = useTranslation();

  return useMemo(() => {
    const traduzir = (grupo, valor) => (valor ? t(`${grupo}.${valor}`, { defaultValue: valor }) : null);

    return {
      frame: (card) => t(`frame.${card.frame.key}.label`),
      frameShort: (card) => t(`frame.${card.frame.key}.short`),
      attribute: (card) => traduzir("attributes", card.attribute),
      race: (card) => (card.isMonster ? traduzir("races", card.race) : traduzir("spellTrapRaces", card.race)),
      typeline: (card) => card.typeline.map((p) => t(`races.${p}`, { defaultValue: t(`typeline.${p}`, { defaultValue: p }) })),
      levelLabel: (card) => (card.isXyz ? t("card.rank") : t("card.level")),
      linkMarker: (m) => traduzir("linkMarkers", m),
    };
  }, [t]);
}
