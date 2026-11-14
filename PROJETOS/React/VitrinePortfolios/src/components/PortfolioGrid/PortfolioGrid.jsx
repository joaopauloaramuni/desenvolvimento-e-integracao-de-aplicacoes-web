import PortfolioCard from "../PortfolioCard/PortfolioCard";
import "./PortfolioGrid.css";

export default function PortfolioGrid({ portfolios, termo, onLimpar, onAbrirPreview }) {
  if (portfolios.length === 0) {
    return (
      <div className="grid-vazia">
        <p>
          Nenhum aluno com <strong>“{termo}”</strong> no nome. Confira a grafia ou mostre a turma inteira.
        </p>
        <button type="button" className="botao" onClick={onLimpar}>
          Mostrar todos
        </button>
      </div>
    );
  }

  return (
    <ul className="grid">
      {portfolios.map((p) => (
        <li key={p.id}>
          <PortfolioCard portfolio={p} onAbrirPreview={onAbrirPreview} />
        </li>
      ))}
    </ul>
  );
}
