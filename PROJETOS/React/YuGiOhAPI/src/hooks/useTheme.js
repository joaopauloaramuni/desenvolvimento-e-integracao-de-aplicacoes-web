import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "../config/appConfig";
import { gravarStorage } from "../utils/storage";

/** Tema claro/escuro. O index.html já aplicou o tema antes do React carregar. */
export function useTheme() {
  const [tema, setTema] = useState(() => document.documentElement.dataset.theme || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    document.documentElement.style.colorScheme = tema;
  }, [tema]);

  const alternar = useCallback(() => {
    setTema((atual) => {
      const novo = atual === "dark" ? "light" : "dark";
      gravarStorage(STORAGE_KEYS.theme, novo);
      return novo;
    });
  }, []);

  return { tema, alternar };
}
