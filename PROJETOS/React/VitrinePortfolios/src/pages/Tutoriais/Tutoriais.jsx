import { FiCloud, FiGithub, FiGlobe, FiAward } from "react-icons/fi";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import StudentPack from "./conteudo/StudentPack";
import Dominios from "./conteudo/Dominios";
import GithubPages from "./conteudo/GithubPages";
import Vercel from "./conteudo/Vercel";
import "./Tutoriais.css";

// Cada tutorial tem um endereço próprio (#tutoriais-<id>), que pode ser compartilhado
const TUTORIAIS = [
  { id: "student", titulo: "GitHub Student Developer Pack", resumo: "Selo GitHub Pro e benefícios grátis", Icone: FiAward, Conteudo: StudentPack },
  { id: "dominios", titulo: "Domínios .dev e .me", resumo: "Name.com, Namecheap e DNS na Vercel", Icone: FiGlobe, Conteudo: Dominios },
  { id: "pages", titulo: "GitHub Pages", resumo: "Sites HTML, CSS e JS direto do repositório", Icone: FiGithub, Conteudo: GithubPages },
  { id: "vercel", titulo: "Deploy na Vercel", resumo: "Projetos React/Vite no ar a cada push", Icone: FiCloud, Conteudo: Vercel },
];

export default function Tutoriais() {
  return (
    <main className="tutoriais" aria-labelledby="tutoriais-titulo">
      <div className="tutoriais-topo">
        <div>
          <h2 id="tutoriais-titulo" className="turma-titulo">
            Tutoriais
          </h2>
          <p className="tutoriais-intro">
            Do selo de estudante ao portfólio no ar com domínio próprio. Siga na ordem ou vá direto ao que precisa.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="tutoriais-layout">
        <nav className="tutoriais-indice" aria-label="Tutoriais nesta página">
          <ol>
            {TUTORIAIS.map(({ id, titulo, resumo, Icone }, i) => (
              <li key={id}>
                <a href={`#tutoriais-${id}`}>
                  <span className="tutoriais-indice-numero" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="tutoriais-indice-texto">
                    <span className="tutoriais-indice-titulo">
                      <Icone aria-hidden="true" /> {titulo}
                    </span>
                    <span className="tutoriais-indice-resumo">{resumo}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="tutoriais-conteudo">
          {TUTORIAIS.map(({ id, titulo, Icone, Conteudo }, i) => (
            <article key={id} id={`tutoriais-${id}`} className="tut" aria-labelledby={`tutoriais-${id}-titulo`}>
              <header className="tut-cabecalho">
                <span className="tut-numero" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 id={`tutoriais-${id}-titulo`} className="tut-titulo">
                  <Icone aria-hidden="true" />
                  {titulo}
                </h3>
                <a className="tut-topo" href="#tutoriais">
                  Voltar ao índice
                </a>
              </header>
              <div className="tut-corpo">
                <Conteudo />
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
