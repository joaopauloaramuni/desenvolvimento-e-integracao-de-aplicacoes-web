import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { STORAGE_KEYS } from "../config/appConfig";
import { gravarStorage, lerStorage } from "../utils/storage";
import en from "./locales/en.json";
import pt from "./locales/pt.json";

/**
 * Tradução do site inteiro com i18next + react-i18next.
 *
 * - Os textos ficam em src/i18n/locales/pt.json e en.json (mesmas chaves nos dois).
 * - O idioma escolhido no topo fica salvo no localStorage ("yugioh:language").
 * - Na primeira visita, usa o idioma do navegador (pt → Português; qualquer outro → English).
 * - O mesmo idioma vai para a API da YGOPRODeck (parâmetro "language"), que traduz
 *   os nomes e os textos das cartas.
 */
export const IDIOMAS = ["pt", "en"];

function idiomaInicial() {
  const salvo = lerStorage(STORAGE_KEYS.language);
  if (IDIOMAS.includes(salvo)) return salvo;
  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

/** Atualiza o <html lang> e o título da aba. */
function aplicarNoDocumento(lng) {
  document.documentElement.lang = lng === "pt" ? "pt-BR" : "en";
  document.title = i18n.t("meta.title");
}

i18n.use(initReactI18next).init({
  resources: { pt: { translation: pt }, en: { translation: en } },
  lng: idiomaInicial(),
  fallbackLng: "pt",
  supportedLngs: IDIOMAS,
  interpolation: { escapeValue: false }, // o React já escapa o HTML
  returnNull: false,
});

aplicarNoDocumento(i18n.language);
i18n.on("languageChanged", (lng) => {
  gravarStorage(STORAGE_KEYS.language, lng);
  aplicarNoDocumento(lng);
});

/** Locale do Intl (números e moedas) para cada idioma. */
export function localeDe(lng) {
  return lng === "pt" ? "pt-BR" : "en-US";
}

export default i18n;
