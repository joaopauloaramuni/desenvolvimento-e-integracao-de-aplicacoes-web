import { FiX } from "react-icons/fi";
import { ATRIBUTOS_GOLEIRO, ATRIBUTOS_LINHA, POSICOES } from "../../config/posicoes";
import CartaJogador from "../CartaJogador/CartaJogador";
import "./FichaJogador.css";

/** Detalhes do jogador selecionado + ações rápidas */
export default function FichaJogador({ jogador, onde, onBanco, onTirar, onFechar }) {
  const atributos = jogador.posicao === "GOL" ? ATRIBUTOS_GOLEIRO : ATRIBUTOS_LINHA;
  const situacao =
    onde.tipo === "titular" ? "Titular" : onde.tipo === "reserva" ? "No banco" : "Fora da escalação";

  return (
    <section className="ficha" aria-labelledby="ficha-titulo">
      <div className="ficha-cabeca">
        <h2 id="ficha-titulo" className="secao-titulo">
          {jogador.nome}
        </h2>
        <button type="button" className="botao-icone" onClick={onFechar} aria-label="Fechar ficha">
          <FiX />
        </button>
      </div>

      <div className="ficha-corpo">
        <CartaJogador jogador={jogador} tamanho="ficha" />
        <div className="ficha-info">
          <p className="ficha-linha">
            {POSICOES[jogador.posicao].nome}
            {jogador.secundarias.length > 0 && <small> · também {jogador.secundarias.join(", ")}</small>}
          </p>
          <p className="ficha-linha ficha-meta">
            {[jogador.nacionalidade, jogador.idade && `${jogador.idade} anos`, jogador.numero != null && `camisa ${jogador.numero}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <dl className="ficha-atributos">
            {atributos.map((a) => (
              <div key={a.id} title={a.nome}>
                <dt>{a.sigla}</dt>
                <dd>{jogador.atributos[a.id] ?? "-"}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <p className="ficha-situacao">
        <strong>{situacao}.</strong>{" "}
        {onde.tipo === "titular" ? "Clique em outro jogador ou vaga para trocar." : "Clique numa vaga do campo ou do banco para escalar."}
      </p>

      <div className="ficha-acoes">
        {onde.tipo !== "reserva" && (
          <button type="button" className="botao" onClick={onBanco}>
            Mandar para o banco
          </button>
        )}
        {onde.tipo !== "elenco" && (
          <button type="button" className="botao botao--perigo" onClick={onTirar}>
            Tirar da escalação
          </button>
        )}
      </div>
      {jogador.revisar && <p className="ficha-revisar">Jogador novo no elenco: confira posição e overall no elenco.json.</p>}
    </section>
  );
}
