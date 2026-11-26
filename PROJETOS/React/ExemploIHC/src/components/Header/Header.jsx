import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/pucminas-logo.png";
import { APP, MENU } from "../../config/appConfig";
import ControleFonte from "../ControleFonte/ControleFonte";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Header.css";

/**
 * Cabeçalho global.
 *  - Faixa azul PUC: identidade (logo + nome do sistema) e ferramentas de
 *    personalização (tamanho do texto e tema).
 *  - Barra de navegação (só no desktop/tablet). No celular, a navegação
 *    principal vai para a barra inferior, na zona do polegar (MenuMobile).
 *  - NavLink marca a página atual com aria-current="page" + sublinhado
 *    (não só cor).
 */
export default function Header() {
  return (
    <header className="header no-print">
      <div className="header-faixa">
        <div className="header-interno">
          <Link to="/" className="header-marca">
            <img src={logo} alt="PUC Minas" className="header-logo" width="44" height="44" />
            <span className="header-nome">
              {APP.nome}
              <span className="header-sub">{APP.disciplina}</span>
            </span>
          </Link>

          <div className="header-ferramentas">
            <ControleFonte />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <nav className="header-nav" aria-label="Menu principal">
        <ul className="header-interno header-nav-lista">
          {MENU.map(({ rota, rotulo, icone: Icone }) => (
            <li key={rota}>
              <NavLink to={rota} end={rota === "/"} className="header-nav-link">
                <Icone aria-hidden="true" />
                {rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
