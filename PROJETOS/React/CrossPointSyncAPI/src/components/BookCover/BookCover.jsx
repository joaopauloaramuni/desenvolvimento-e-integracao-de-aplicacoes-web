import { useState } from "react";
import "./BookCover.css";

// Cores de tecido de encadernação para as capas geradas
const TECIDOS = ["#2f5d50", "#7a2e2e", "#26446b", "#5b4a2f", "#4a3a63", "#3f5a2a", "#6b3f55", "#2d4f5c"];

/** Mesmo livro, mesma cor: um hash simples do id do documento + título. */
function corDe(chave = "") {
  let h = 2166136261;
  for (const c of chave) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  return TECIDOS[h % TECIDOS.length];
}

/**
 * Capa do livro. Usa a cover_url do servidor (iTunes / Open Library);
 * sem capa (ou se a imagem falhar), desenha uma capa de tecido com o título.
 */
function BookCover({ livro, titulo, tamanho = "md" }) {
  const [falhou, setFalhou] = useState(false);
  const temImagem = livro.cover_url && !falhou;

  if (temImagem) {
    return (
      <div className={`cover cover-${tamanho}`}>
        <img src={livro.cover_url} alt="" loading="lazy" onError={() => setFalhou(true)} />
      </div>
    );
  }

  return (
    <div className={`cover cover-${tamanho} cover-cloth`} style={{ "--cloth": corDe(`${livro.document}${titulo}`) }} aria-hidden="true">
      <div className="cover-frame">
        <span className="cover-title">{titulo}</span>
        {livro.author && <span className="cover-author">{livro.author}</span>}
      </div>
    </div>
  );
}

export default BookCover;
