import { useCallback, useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "../config/appConfig.js";

// Tema claro/escuro. O valor inicial já foi aplicado pelo script do index.html.
export function useTheme() {
  const [tema, setTema] = useState(() => document.documentElement.dataset.theme || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, tema);
    } catch {
      // modo privado ou storage bloqueado: o tema só não fica salvo
    }
  }, [tema]);

  const alternar = useCallback(() => setTema((t) => (t === "dark" ? "light" : "dark")), []);

  return { tema, alternar };
}
