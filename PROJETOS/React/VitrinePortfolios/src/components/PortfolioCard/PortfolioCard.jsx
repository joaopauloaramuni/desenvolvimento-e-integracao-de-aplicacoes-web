import { FaGithub, FaLock } from "react-icons/fa6";
import { GoRepo } from "react-icons/go";
import PreviewImage from "../PreviewImage/PreviewImage";
import { dominio, githubUrl, repoUrl } from "../../utils/portfolio";
import "./PortfolioCard.css";

export default function PortfolioCard({ portfolio, onAbrirPreview }) {
  const { nome, site, github, repo } = portfolio;

  return (
    <article className="card">
      {/* Barra de endereço: o domínio é o link para o site */}
      <div className="card-barra">
        <FaLock aria-hidden="true" className="card-cadeado" />
        <a className="card-dominio" href={site} target="_blank" rel="noopener noreferrer">
          {dominio(site)}
        </a>
      </div>

      <button
        type="button"
        className="card-preview"
        onClick={() => onAbrirPreview(portfolio)}
        aria-label={`Abrir preview do portfólio de ${nome}`}
      >
        <PreviewImage portfolio={portfolio} />
        <span className="card-preview-acao" aria-hidden="true">Ver preview</span>
      </button>

      <div className="card-info">
        <h3 className="card-nome">{nome}</h3>

        <ul className="card-links">
          <li>
            <FaGithub aria-hidden="true" />
            {github ? (
              <a href={githubUrl(github)} target="_blank" rel="noopener noreferrer">
                github.com/{github}
              </a>
            ) : (
              <span className="card-vazio">GitHub não informado</span>
            )}
          </li>
          <li>
            <GoRepo aria-hidden="true" />
            {github && repo ? (
              <a href={repoUrl(github, repo)} target="_blank" rel="noopener noreferrer">
                {repo}
              </a>
            ) : (
              <span className="card-vazio">Repositório não informado</span>
            )}
          </li>
        </ul>
      </div>
    </article>
  );
}
