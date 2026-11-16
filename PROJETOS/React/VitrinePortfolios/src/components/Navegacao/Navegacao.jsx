import { FiBookOpen, FiGrid } from "react-icons/fi";
import "./Navegacao.css";

// Abas entre a vitrine e a página de tutoriais
export default function Navegacao({ rota }) {
  const abas = [
    { id: "vitrine", href: "#portfolios", rotulo: "Portfólios", Icone: FiGrid },
    { id: "tutoriais", href: "#tutoriais", rotulo: "Tutoriais", Icone: FiBookOpen },
  ];

  return (
    <nav className="navegacao" aria-label="Páginas">
      <ul className="navegacao-lista">
        {abas.map(({ id, href, rotulo, Icone }) => (
          <li key={id}>
            <a className="navegacao-aba" href={href} aria-current={rota === id ? "page" : undefined}>
              <Icone aria-hidden="true" />
              {rotulo}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
