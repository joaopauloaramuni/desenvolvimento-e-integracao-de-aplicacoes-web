import { useEffect, useRef, useState } from "react";
import { FaAmazon } from "react-icons/fa";
import { LuTablet, LuX } from "react-icons/lu";
import {
  formatarData,
  formatarPorcentagem,
  haQuantoTempo,
  nomeDoAparelho,
  paginaAtual,
  tituloDe,
  veioDoKindle,
} from "../../utils/format";
import BookCover from "../BookCover/BookCover";
import "./BookDetails.css";

const STATUS = {
  reading: "Lendo",
  paused: "Pausado",
  finished: "Concluído",
  dnf: "Abandonado",
};

/**
 * Painel (<dialog>) de um livro: a posição salva em CADA aparelho,
 * vinda do GET /api/v1/progress/{document}. O servidor guarda uma linha por
 * aparelho e o leitor sempre retoma da mais recente.
 */
function BookDetails({ livro, carregarAparelhos, onFechar }) {
  const dialogRef = useRef(null);
  const [aparelhos, setAparelhos] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
  }, []);

  useEffect(() => {
    const controle = new AbortController();
    carregarAparelhos(livro.document, { signal: controle.signal })
      .then(setAparelhos)
      .catch((e) => {
        if (!controle.signal.aborted) setErro(e.message);
      });
    return () => controle.abort();
  }, [livro.document, carregarAparelhos]);

  const titulo = tituloDe(livro);
  const pagina = paginaAtual(livro);

  // Clique no fundo escuro fecha
  const cliqueFora = (evento) => {
    if (evento.target === dialogRef.current) onFechar();
  };

  return (
    <dialog ref={dialogRef} className="details" onClose={onFechar} onClick={cliqueFora} aria-labelledby="details-titulo">
      <div className="details-body">
        <button type="button" className="details-close" onClick={onFechar} aria-label="Fechar">
          <LuX aria-hidden="true" />
        </button>

        <div className="details-cover">
          <BookCover livro={livro} titulo={titulo} tamanho="lg" />
        </div>

        <div className="details-info">
          <span className={`status-pill status-${livro.status}`}>{STATUS[livro.status] ?? "Lendo"}</span>
          <h2 id="details-titulo">{titulo}</h2>
          {livro.author && <p className="details-author">{livro.author}</p>}

          <p className="details-progress">
            <strong>{formatarPorcentagem(livro.percentage)}</strong>
            {pagina && ` · página ${pagina} de ${livro.page_count}`}
          </p>

          <h3>Onde você parou em cada aparelho</h3>

          {erro && <p className="alert alert-error">{erro}</p>}
          {!erro && !aparelhos && <p className="details-loading">Carregando aparelhos…</p>}

          {aparelhos && (
            <ul className="devices">
              {aparelhos.map((linha, i) => {
                const kindle = veioDoKindle(linha);
                const pct = Math.max(0, Math.min(1, linha.percentage ?? 0));
                return (
                  <li key={linha.device_id} className={`device ${i === 0 ? "device-latest" : ""}`}>
                    <span className={`device-icon ${kindle ? "device-icon-kindle" : ""}`} aria-hidden="true">
                      {kindle ? <FaAmazon /> : <LuTablet />}
                    </span>
                    <span className="device-name">
                      <span title={linha.device}>{nomeDoAparelho(linha)}</span>
                      {i === 0 && <span className="device-tag">mais recente</span>}
                    </span>
                    <span className="device-pct">{formatarPorcentagem(pct)}</span>
                    <span className="progress device-bar" aria-hidden="true">
                      <span className="progress-fill" style={{ width: `${pct * 100}%` }} />
                    </span>
                    <span className="device-when" title={formatarData(linha.timestamp)}>
                      {haQuantoTempo(linha.timestamp)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {livro.filename && <p className="details-file">{livro.filename}</p>}
        </div>
      </div>
    </dialog>
  );
}

export default BookDetails;
