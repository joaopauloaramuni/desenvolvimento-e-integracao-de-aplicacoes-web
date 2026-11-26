import { FiCompass } from "react-icons/fi";
import { Link } from "react-router-dom";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina";
import EstadoVazio from "../../components/EstadoVazio/EstadoVazio";
import usePaginaTitulo from "../../hooks/usePaginaTitulo";

/**
 * Página 404 que ajuda a sair do erro (Nielsen #9): explica em linguagem
 * simples e oferece caminhos, em vez de "Error 404 Not Found".
 */
export default function NaoEncontrada() {
  const tituloRef = usePaginaTitulo("Página não encontrada");
  return (
    <>
      <CabecalhoPagina ref={tituloRef} titulo="Página não encontrada" />
      <EstadoVazio icone={FiCompass} titulo="O endereço que você abriu não existe aqui">
        <p>O link pode estar quebrado ou a página mudou de lugar. Tente um destes caminhos:</p>
        <ul className="nao-encontrada-links">
          <li><Link to="/">Página inicial</Link></li>
          <li><Link to="/recursos">Recursos disponíveis</Link></li>
          <li><Link to="/reservar">Reservar um recurso</Link></li>
        </ul>
      </EstadoVazio>
    </>
  );
}
