import { useCallback, useEffect, useState } from "react";
import { getSavedTheme, saveTheme } from "../utils/storage";

/**
 * Tema light/dark.
 * - o index.html já aplica o tema antes do React carregar (sem "piscar");
 * - sem escolha salva, segue o tema do sistema (e muda junto com ele);
 * - ao clicar no botão, a escolha fica salva no localStorage.
 */
export default function useTheme() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)");
    const aoMudar = (evento) => {
      if (!getSavedTheme()) setTheme(evento.matches ? "dark" : "light");
    };
    sistemaEscuro.addEventListener("change", aoMudar);
    return () => sistemaEscuro.removeEventListener("change", aoMudar);
  }, []);

  const toggleTheme = useCallback(() => {
    const proximo = theme === "dark" ? "light" : "dark";
    saveTheme(proximo);
    setTheme(proximo);
  }, [theme]);

  return { theme, toggleTheme };
}
