import { SITE } from "../../config/appConfig.js";
import Icon from "../Icon/Icon.jsx";
import "./Header.css";

export default function Header({ tema, onAlternarTema }) {
  const escuro = tema === "dark";
  return (
    <header className="header">
      <div className="header-marca">
        <img src={`${import.meta.env.BASE_URL}favicon-32.png`} alt="" width="32" height="32" />
        <div>
          <strong>{SITE.titulo}</strong>
          <span>{SITE.subtitulo}</span>
        </div>
      </div>
      <nav className="header-acoes" aria-label="Atalhos">
        <a className="botao botao-icone" href={SITE.repositorio} target="_blank" rel="noreferrer">
          <Icon name="github" />
          <span className="some-no-celular">Código</span>
        </a>
        <button
          type="button"
          className="botao botao-icone"
          onClick={onAlternarTema}
          aria-label={escuro ? "Usar tema claro" : "Usar tema escuro"}
          title={escuro ? "Tema claro" : "Tema escuro"}
        >
          <Icon name={escuro ? "sol" : "lua"} />
        </button>
      </nav>
    </header>
  );
}
