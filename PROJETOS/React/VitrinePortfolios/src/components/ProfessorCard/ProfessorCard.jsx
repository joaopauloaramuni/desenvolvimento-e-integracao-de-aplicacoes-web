import { FaGithub } from "react-icons/fa6";
import { GoRepo } from "react-icons/go";
import logoAramuni from "../../assets/images/aramuni-logo.svg";
import PreviewImage from "../PreviewImage/PreviewImage";
import VITRINE_CONFIG from "../../config/vitrineConfig";
import { dominio, githubUrl, repoUrl } from "../../utils/portfolio";
import "./ProfessorCard.css";

// Faixa compacta do professor orientador, dentro do cabeçalho.
export default function ProfessorCard({ onAbrirPreview }) {
  const professor = VITRINE_CONFIG.PROFESSOR;

  return (
    <section className="professor" aria-label="Professor orientador">
      <button
        type="button"
        className="professor-miniatura"
        onClick={() => onAbrirPreview(professor)}
        aria-label={`Abrir preview do portfólio de ${professor.nome}`}
      >
        <PreviewImage portfolio={professor} eager />
      </button>

      <div className="professor-texto">
        <p className="professor-papel">Professor orientador</p>
        <p className="professor-nome">{professor.nome}</p>
        <ul className="professor-links">
          <li>
            <a className="professor-dominio" href={professor.site} target="_blank" rel="noopener noreferrer">
              {dominio(professor.site)}
            </a>
          </li>
          <li>
            <FaGithub aria-hidden="true" />
            <a href={githubUrl(professor.github)} target="_blank" rel="noopener noreferrer">
              {professor.github}
            </a>
          </li>
          <li>
            <GoRepo aria-hidden="true" />
            <a href={repoUrl(professor.github, professor.repo)} target="_blank" rel="noopener noreferrer">
              {professor.repo}
            </a>
          </li>
        </ul>
      </div>

      <a className="professor-logo" href={professor.site} target="_blank" rel="noopener noreferrer">
        <img src={logoAramuni} alt="Logo Aramuni" width="254" height="302" />
      </a>
    </section>
  );
}
