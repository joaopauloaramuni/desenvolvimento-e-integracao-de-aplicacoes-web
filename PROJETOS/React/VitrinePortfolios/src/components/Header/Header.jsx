import logoPuc from "../../assets/images/pucminas-logo.png";
import logoCc from "../../assets/images/logo-ciencia-computacao.png";
import logoEs from "../../assets/images/logo-engenharia-software.png";
import VITRINE_CONFIG from "../../config/vitrineConfig";
import ProfessorCard from "../ProfessorCard/ProfessorCard";
import "./Header.css";

export default function Header({ onAbrirPreview }) {
  const { TITULO, DISCIPLINAS, SEMESTRE, CAMPI, PROFESSOR } = VITRINE_CONFIG;
  const [diw, diaw] = DISCIPLINAS;

  return (
    <header className="cabecalho">
      <div className="cabecalho-conteudo">
        <img className="cabecalho-logo" src={logoPuc} alt="Brasão da PUC Minas" width="660" height="900" />

        <div className="cabecalho-texto">
          <h1 className="cabecalho-titulo">{TITULO}</h1>
          <p className="cabecalho-descricao">
            Estes trabalhos foram realizados durante as disciplinas de <strong>{diw.nome}</strong> do curso de{" "}
            {diw.curso} e <strong>{diaw.nome}</strong> do curso de {diaw.curso} da PUC Minas, nos campi {CAMPI.join(" e ")}, no{" "}
            {SEMESTRE.replace("2º", "segundo")},
            sob orientação do {PROFESSOR.nome} (
            <a href={PROFESSOR.site} target="_blank" rel="noopener noreferrer">
              aramuni.dev
            </a>
            ).
          </p>
          <ProfessorCard onAbrirPreview={onAbrirPreview} />
        </div>

        {/* Uma logo por curso, na mesma ordem das disciplinas do texto */}
        <ul className="cabecalho-cursos" aria-label="Cursos">
          <li>
            <img src={logoCc} alt={`Logo do curso de ${diw.curso}`} width="172" height="200" />
          </li>
          <li>
            <img src={logoEs} alt={`Logo do curso de ${diaw.curso}`} width="348" height="400" />
          </li>
        </ul>
      </div>
    </header>
  );
}
