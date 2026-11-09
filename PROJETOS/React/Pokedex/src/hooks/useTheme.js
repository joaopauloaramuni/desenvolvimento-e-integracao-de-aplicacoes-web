import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "../config/appConfig";
import { aplicarAparencia } from "../utils/aparencia";
import { gravarStorage } from "../utils/storage";

/**
 * Tema claro/escuro da tela do aparelho.
 * O index.html já aplica o tema (sistema ou escolha salva) antes do React carregar;
 * aqui o React só lê esse valor e salva quando a pessoa aperta o botão "Noturno".
 */
export default function useTheme() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    aplicarAparencia({ theme });
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const proximo = theme === "dark" ? "light" : "dark";
    gravarStorage(STORAGE_KEYS.theme, proximo);
    setTheme(proximo);
  }, [theme]);

  return { theme, toggleTheme };
}
