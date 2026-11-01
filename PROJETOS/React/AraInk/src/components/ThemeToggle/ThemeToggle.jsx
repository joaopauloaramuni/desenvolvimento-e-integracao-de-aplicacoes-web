import { LuMoon, LuSun } from "react-icons/lu";
import useTheme from "../../hooks/useTheme";
import "./ThemeToggle.css";

/** Botão de tema (light/dark), no canto da faixa roxa. */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const escuro = theme === "dark";
  const rotulo = escuro ? "Usar tema claro" : "Usar tema escuro";

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={rotulo} title={rotulo}>
      {escuro ? <LuSun aria-hidden="true" /> : <LuMoon aria-hidden="true" />}
    </button>
  );
}

export default ThemeToggle;
