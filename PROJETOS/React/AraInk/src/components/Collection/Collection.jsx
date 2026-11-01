import { LuBookmark, LuDownload, LuTrash2, LuTriangleAlert } from "react-icons/lu";
import { STYLES, findById } from "../../config/tattooOptions";
import { baixarImagem, rotuloBaixar } from "../../utils/download";
import "./Collection.css";

const formatarData = (timestamp) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(
    timestamp
  );

/** "Sua coleção": as variações guardadas neste navegador (IndexedDB). */
function Collection({ itens, carregando, erro, onRemover }) {
  const confirmarRemocao = (item) => {
    if (window.confirm("Excluir esta tatuagem da coleção?")) onRemover(item.id);
  };

  return (
    <section className="collection" aria-labelledby="colecao-titulo">
      <div className="section-head">
        <h2 className="section-title" id="colecao-titulo">
          Sua coleção
          {itens.length > 0 && <span className="section-count">{itens.length}</span>}
        </h2>
        <p className="section-hint">Fica salva só neste navegador. Baixe as que quiser levar para o tatuador.</p>
      </div>

      {erro && (
        <div className="form-message error" role="alert">
          <LuTriangleAlert aria-hidden="true" />
          <span>{erro}</span>
        </div>
      )}

      {!carregando && itens.length === 0 && (
        <div className="collection-empty">
          <LuBookmark aria-hidden="true" />
          <p>
            Nada guardado ainda. Na bancada, use o marcador embaixo de uma variação para guardar o desenho aqui.
          </p>
        </div>
      )}

      {itens.length > 0 && (
        <ul className="collection-grid">
          {itens.map((item) => {
            const estilo = findById(STYLES, item.estilo);
            return (
              <li key={item.id} className="collection-item">
                <div className="collection-paper">
                  <img
                    src={item.src ?? item.dataUrl}
                    alt={`${item.ideia}, estilo ${estilo.nome}`}
                    loading="lazy"
                  />
                </div>
                <div className="collection-body">
                  <p className="collection-idea" title={item.ideia}>
                    {item.ideia}
                  </p>
                  <p className="collection-meta">
                    {estilo.nome}, {formatarData(item.criadoEm)}
                  </p>
                  <div className="collection-actions">
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => baixarImagem(item.src ?? item.dataUrl, { estilo: item.estilo, ideia: item.ideia })}
                      aria-label={rotuloBaixar(item.src ?? item.dataUrl)}
                      title={rotuloBaixar(item.src ?? item.dataUrl)}
                    >
                      <LuDownload />
                    </button>
                    <button
                      type="button"
                      className="btn-icon danger"
                      onClick={() => confirmarRemocao(item)}
                      aria-label="Excluir da coleção"
                      title="Excluir da coleção"
                    >
                      <LuTrash2 />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default Collection;
