import { FaGithub } from "react-icons/fa6";
import VITRINE_CONFIG from "../../config/vitrineConfig";
import { githubUrl, repoUrl } from "../../utils/portfolio";
import "./Footer.css";

export default function Footer() {
  const { INSPIRACAO, PROFESSOR, REPO_VITRINE } = VITRINE_CONFIG;

  return (
    <footer className="rodape">
      <div className="rodape-conteudo">
        <p>
          Inspirado na vitrine criada por{" "}
          <a href={githubUrl(INSPIRACAO.github)} target="_blank" rel="noopener noreferrer">
            {INSPIRACAO.autor}
          </a>{" "}
          durante a oficina de DIW (
          <a href={repoUrl(INSPIRACAO.github, INSPIRACAO.repo)} target="_blank" rel="noopener noreferrer">
            {INSPIRACAO.repo}
          </a>
          ). Obrigado pela iniciativa!
        </p>
        <p>
          PUC Minas, 2026.{" "}
          <a href={PROFESSOR.site} target="_blank" rel="noopener noreferrer">
            aramuni.dev
          </a>
        </p>
        <p>
          <a className="rodape-repo" href={REPO_VITRINE} target="_blank" rel="noopener noreferrer">
            <FaGithub aria-hidden="true" /> Código desta vitrine
          </a>
        </p>
      </div>
    </footer>
  );
}
