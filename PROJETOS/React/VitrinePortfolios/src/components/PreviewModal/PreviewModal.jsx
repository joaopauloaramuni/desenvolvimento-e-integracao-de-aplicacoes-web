import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { GoRepo } from "react-icons/go";
import { FiExternalLink, FiX } from "react-icons/fi";
import PreviewImage from "../PreviewImage/PreviewImage";
import { dominio, githubUrl, repoUrl } from "../../utils/portfolio";
import "./PreviewModal.css";

// Preview grande: site ao vivo num iframe (quando o site permite) ou a captura.
export default function PreviewModal({ portfolio, onFechar }) {
  const [modo, setModo] = useState(portfolio.embeddable ? "vivo" : "captura");
  const botaoFechar = useRef(null);
  const { nome, site, github, repo, embeddable } = portfolio;

  useEffect(() => {
    const anterior = document.activeElement;
    botaoFechar.current?.focus();
    document.body.style.overflow = "hidden";

    const aoTeclar = (e) => {
      if (e.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", aoTeclar);

    return () => {
      window.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
      anterior?.focus?.();
    };
  }, [onFechar]);

  return (
    <div className="modal-fundo" onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <header className="modal-topo">
          <div className="modal-identidade">
            <h2 id="modal-titulo">{nome}</h2>
            <a href={site} target="_blank" rel="noopener noreferrer">
              {dominio(site)}
            </a>
          </div>

          <div className="modal-modos" role="tablist" aria-label="Como ver o portfólio">
            <button
              type="button"
              role="tab"
              aria-selected={modo === "vivo"}
              className={modo === "vivo" ? "ativo" : ""}
              onClick={() => setModo("vivo")}
            >
              Site ao vivo
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={modo === "captura"}
              className={modo === "captura" ? "ativo" : ""}
              onClick={() => setModo("captura")}
            >
              Captura
            </button>
          </div>

          <button ref={botaoFechar} type="button" className="modal-fechar" onClick={onFechar} aria-label="Fechar preview">
            <FiX />
          </button>
        </header>

        <div className="modal-corpo">
          {modo === "vivo" ? (
            <iframe
              key={site}
              src={site}
              title={`Portfólio de ${nome}`}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="modal-captura">
              <PreviewImage portfolio={portfolio} eager />
            </div>
          )}
        </div>

        <footer className="modal-rodape">
          <p className="modal-aviso">
            {modo === "vivo" && !embeddable
              ? "Este site não permite ser exibido dentro de outras páginas. Use a captura ou abra o site."
              : modo === "vivo"
                ? "Página em branco? Alguns sites bloqueiam a exibição embutida: use a captura ou abra o site."
                : "Captura da página inicial."}
          </p>
          <div className="modal-acoes">
            {github && (
              <a className="botao botao-claro" href={githubUrl(github)} target="_blank" rel="noopener noreferrer">
                <FaGithub aria-hidden="true" /> GitHub
              </a>
            )}
            {github && repo && (
              <a className="botao botao-claro" href={repoUrl(github, repo)} target="_blank" rel="noopener noreferrer">
                <GoRepo aria-hidden="true" /> Repositório
              </a>
            )}
            <a className="botao" href={site} target="_blank" rel="noopener noreferrer">
              <FiExternalLink aria-hidden="true" /> Abrir site
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
