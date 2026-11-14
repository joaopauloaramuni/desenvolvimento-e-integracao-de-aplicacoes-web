import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import PortfolioGrid from "./components/PortfolioGrid/PortfolioGrid";
import PreviewModal from "./components/PreviewModal/PreviewModal";
import Footer from "./components/Footer/Footer";
import PORTFOLIOS from "./data/portfolios";
import { filtrarPorNome } from "./utils/portfolio";

// Turma em ordem alfabética (o professor fica no destaque, fora da lista)
const TURMA = [...PORTFOLIOS].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

export default function App() {
  const [termo, setTermo] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const campoBusca = useRef(null);

  const encontrados = useMemo(() => filtrarPorNome(TURMA, termo), [termo]);
  const fecharPreview = useCallback(() => setSelecionado(null), []);

  // Atalho "/" foca a busca (como no GitHub)
  useEffect(() => {
    const aoTeclar = (e) => {
      const digitando = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
      if (e.key === "/" && !digitando && !selecionado) {
        e.preventDefault();
        campoBusca.current?.focus();
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [selecionado]);

  return (
    <>
      <Header onAbrirPreview={setSelecionado} />

      <main className="turma" aria-labelledby="turma-titulo">
        <h2 id="turma-titulo" className="turma-titulo">
          Portfólios dos alunos
        </h2>
        <SearchBar
          ref={campoBusca}
          valor={termo}
          onChange={setTermo}
          total={TURMA.length}
          encontrados={encontrados.length}
        />
        <PortfolioGrid
          portfolios={encontrados}
          termo={termo}
          onLimpar={() => setTermo("")}
          onAbrirPreview={setSelecionado}
        />
      </main>

      <Footer />

      {selecionado && <PreviewModal key={selecionado.id} portfolio={selecionado} onFechar={fecharPreview} />}
    </>
  );
}
