import { NavLink, Link } from "react-router-dom";
import "./Layout.css";

const LINKS = [
  { to: "/", nome: "Início", fim: true },
  { to: "/partidas", nome: "Partidas" },
  { to: "/jogadores", nome: "Jogadores" },
  { to: "/placar", nome: "Placar" },
  { to: "/estatisticas", nome: "Estatísticas" },
];

/** Topo com a marca e o menu, e o rodapé. Todas as páginas passam por aqui. */
function Layout({ children }) {
  return (
    <div className="layout">
      <a href="#conteudo" className="pular">
        Pular para o conteúdo
      </a>

      <header className="topo">
        <div className="topo__faixa">
          <Link to="/" className="marca" aria-label="Caderninho do Buraco: início">
            <span className="marca__naipes" aria-hidden="true">
              <span>♠</span>
              <span className="vermelho">♥</span>
              <span>♣</span>
              <span className="vermelho">♦</span>
            </span>
            <span className="marca__nome">
              Caderninho do Buraco
            </span>
          </Link>

          <nav className="menu" aria-label="Principal">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.fim} className="menu__link">
                {l.nome}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="conteudo">{children}</main>

      <footer className="rodape">
        <p>
          Caderninho do Buraco, feito com React, Vite, Supabase e Recharts. Ilustrações das cartas:
          Freepik.
        </p>
      </footer>
    </div>
  );
}

export default Layout;
