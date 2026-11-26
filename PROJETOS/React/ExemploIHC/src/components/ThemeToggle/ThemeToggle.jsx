import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { lerTexto, salvarTexto } from "../../utils/storage";

const sistemaEscuro = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

function temaInicial() {
  const salvo = document.documentElement.dataset.theme; // aplicado pelo script do index.html
  if (salvo === "light" || salvo === "dark") return salvo;
  return sistemaEscuro() ? "dark" : "light";
}

/**
 * Tema claro / escuro (flexibilidade e personalização - Aula 18).
 * Sem escolha salva, segue o sistema operacional. A escolha fica salva.
 */
export default function ThemeToggle() {
  const [tema, setTema] = useState(temaInicial);
  const escuro = tema === "dark";

  useEffect(() => {
    const midia = window.matchMedia("(prefers-color-scheme: dark)");
    const aoMudar = (e) => {
      if (!lerTexto("tema")) setTema(e.matches ? "dark" : "light");
    };
    midia.addEventListener("change", aoMudar);
    return () => midia.removeEventListener("change", aoMudar);
  }, []);

  function alternar() {
    const novo = escuro ? "light" : "dark";
    document.documentElement.dataset.theme = novo;
    salvarTexto("tema", novo);
    setTema(novo);
  }

  return (
    <button
      type="button"
      className="ferramenta"
      onClick={alternar}
      aria-pressed={escuro}
      title={escuro ? "Usar tema claro" : "Usar tema escuro"}
    >
      {escuro ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
      <span className="ferramenta-texto">Tema escuro</span>
    </button>
  );
}
