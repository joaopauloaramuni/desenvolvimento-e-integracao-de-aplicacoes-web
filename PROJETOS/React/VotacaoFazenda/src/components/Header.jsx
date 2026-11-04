import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="topo">
      <NavLink to="/" className="topo-marca">
        <img src="/logo-fazenda.jpg" alt="A Fazenda" className="topo-logo" />
        <span className="topo-titulo">Votação 2026</span>
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
