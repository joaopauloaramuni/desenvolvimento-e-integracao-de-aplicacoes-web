import { useState } from "react";
import { capturaLocal, dominio } from "../../utils/portfolio";
import "./PreviewImage.css";

// Mostra a captura de public/previews/<id>.png (gerada pelo npm run previews).
// Se ela não existir, mostra um cartão com o domínio.
export default function PreviewImage({ portfolio, eager = false }) {
  const [semCaptura, setSemCaptura] = useState(false);

  if (semCaptura) {
    return (
      <div className="preview-reserva" role="img" aria-label={`Sem captura de ${dominio(portfolio.site)}`}>
        <span className="preview-reserva-dominio">{dominio(portfolio.site)}</span>
        <span className="preview-reserva-dica">Abra o preview para ver o site ao vivo</span>
      </div>
    );
  }

  return (
    <img
      className="preview-img"
      src={capturaLocal(portfolio.id)}
      alt={`Página inicial do portfólio de ${portfolio.nome}`}
      loading={eager ? "eager" : "lazy"}
      width="1280"
      height="800"
      onError={() => setSemCaptura(true)}
    />
  );
}
