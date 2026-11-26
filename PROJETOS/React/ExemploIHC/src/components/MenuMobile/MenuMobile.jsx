import { NavLink } from "react-router-dom";
import { MENU } from "../../config/appConfig";
import "./MenuMobile.css";

/**
 * Barra de navegação inferior, só no celular (Aula 18 - "thumb zones").
 * As ações mais usadas ficam embaixo, onde o polegar alcança com uma mão.
 * Cada item tem ícone + TEXTO (ícone sozinho é ambíguo) e alvo >= 44px.
 */
export default function MenuMobile() {
  return (
    <nav className="menu-mobile no-print" aria-label="Menu principal">
      <ul>
        {MENU.filter((m) => m.emMobile).map(({ rota, rotulo, rotuloCurto, icone: Icone }) => (
          <li key={rota}>
            <NavLink to={rota} end={rota === "/"} className="menu-mobile-link">
              <Icone aria-hidden="true" />
              <span>{rotuloCurto ?? rotulo}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
