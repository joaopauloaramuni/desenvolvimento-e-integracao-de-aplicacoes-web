import { FaAmazon } from "react-icons/fa";
import { formatarPorcentagem, haQuantoTempo, nomeDoAparelho, paginaAtual, tituloDe, veioDoKindle } from "../../utils/format";
import BookCover from "../BookCover/BookCover";
import "./BookCard.css";

/** Um livro da estante. Clicar abre o painel com a posição de cada aparelho. */
function BookCard({ livro, onAbrir }) {
  const titulo = tituloDe(livro);
  const kindle = veioDoKindle(livro);
  const pagina = paginaAtual(livro);
  const pct = Math.max(0, Math.min(1, livro.percentage ?? 0));

  return (
    <li className="book">
      <button type="button" className="book-button" onClick={() => onAbrir(livro)}>
        <div className="book-cover-wrap">
          <BookCover livro={livro} titulo={titulo} />
          {kindle && (
            <span className="kindle-chip book-kindle">
              <FaAmazon aria-hidden="true" /> Kindle
            </span>
          )}
        </div>

        <span className="book-title">{titulo}</span>
        {livro.author && <span className="book-author">{livro.author}</span>}

        <span
          className="progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct * 100)}
          aria-label={`Progresso de ${titulo}`}
        >
          <span className="progress-fill" style={{ width: `${pct * 100}%` }} />
        </span>

        <span className="book-meta">
          <strong>{formatarPorcentagem(pct)}</strong>
          {pagina && <span> · p. {pagina} de {livro.page_count}</span>}
        </span>
        <span className="book-when">
          {nomeDoAparelho(livro)} · {haQuantoTempo(livro.timestamp)}
        </span>
      </button>
    </li>
  );
}

export default BookCard;
