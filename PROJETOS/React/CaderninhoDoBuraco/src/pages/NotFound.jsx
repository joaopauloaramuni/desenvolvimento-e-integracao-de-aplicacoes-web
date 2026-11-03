import { Link } from "react-router-dom";
import jokerBobo from "../assets/images/joker-bobo.webp";
import EstadoVazio from "../components/EstadoVazio/EstadoVazio";

/** Qualquer endereço que não existe. */
function NotFound() {
  return (
    <div className="conteudo">
      <title>Página não encontrada - Caderninho do Buraco</title>
      <EstadoVazio
        imagem={jokerBobo}
        titulo="Essa carta não está no baralho"
        acao={
          <Link className="botao" to="/">
            Voltar para a mesa
          </Link>
        }
      >
        O endereço não existe. Confira o link ou volte para o início.
      </EstadoVazio>
    </div>
  );
}

export default NotFound;
