import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import "./ThemeToggle.css";

const CHAVE = "vitrine-tema";
const sistemaEscuro = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

function temaInicial() {
  const salvo = document.documentElement.dataset.theme; // aplicado pelo script do index.html
  if (salvo === "light" || salvo === "dark") return salvo;
  return sistemaEscuro() ? "dark" : "light";
}

// Botão Tema claro / Tema escuro. A escolha fica salva no localStorage;
// sem escolha salva, a página segue o tema do sistema.
export default function ThemeToggle() {
  const [tema, setTema] = useState(temaInicial);
  const escuro = tema === "dark";

  // Sem escolha salva, acompanha quando o sistema troca de tema
  useEffect(() => {
    const midia = window.matchMedia("(prefers-color-scheme: dark)");
    const aoMudar = (e) => {
      if (!document.documentElement.dataset.theme) setTema(e.matches ? "dark" : "light");
    };
    midia.addEventListener("change", aoMudar);
    return () => midia.removeEventListener("change", aoMudar);
  }, []);

  function alternar() {
    const novo = escuro ? "light" : "dark";
    document.documentElement.dataset.theme = novo;
    try {
      localStorage.setItem(CHAVE, novo);
    } catch {
      // navegação privada: o tema vale só nesta visita
    }
    setTema(novo);
  }

  return (
    <button
      type="button"
      className="tema"
      onClick={alternar}
      aria-label={escuro ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
      title={escuro ? "Tema claro" : "Tema escuro"}
    >
      {escuro ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
      <span>{escuro ? "Tema claro" : "Tema escuro"}</span>
    </button>
  );
}
