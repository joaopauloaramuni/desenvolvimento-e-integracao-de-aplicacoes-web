import jokerSaltando from "../../assets/images/joker-saltando.webp";
import "./EstadoVazio.css";

/** Tela vazia: o Coringa saltando da carta e o que fazer a seguir. */
function EstadoVazio({ titulo, children, acao = null, imagem = jokerSaltando }) {
  return (
    <div className="vazio">
      <img src={imagem} alt="" className="vazio__imagem" />
      <div className="vazio__texto">
        <h2>{titulo}</h2>
        {children && <p>{children}</p>}
        {acao && <div className="vazio__acao">{acao}</div>}
      </div>
    </div>
  );
}

export default EstadoVazio;
