import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="topo">
      <NavLink to="/" className="topo-marca">
        <img src="/escudo-galo.svg" alt="Escudo do Atlético Mineiro" className="topo-escudo" />
        <span className="topo-titulo">
          Craque do Jogo
          <small>Galo 2026</small>
        </span>
      </NavLink>

      <nav className="topo-menu">
        <NavLink to="/" end>Início</NavLink>
        <NavLink to="/votacao">Votar</NavLink>
        <NavLink to="/resultado">Resultado</NavLink>
      </nav>
    </header>
  );
}

export default Header;
