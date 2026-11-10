import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { localeDe } from "../i18n";

/**
 * Idioma atual (i18next). O mesmo idioma traduz a interface (pt.json / en.json)
 * e vai para a API da YGOPRODeck, que traduz os nomes e textos das cartas.
 */
export function useLanguage() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const setLanguage = useCallback((lng) => i18n.changeLanguage(lng), [i18n]);
  return { language, setLanguage, locale: localeDe(language) };
}
