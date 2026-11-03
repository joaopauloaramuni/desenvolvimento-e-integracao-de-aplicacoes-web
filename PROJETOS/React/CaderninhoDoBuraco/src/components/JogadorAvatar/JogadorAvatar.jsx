import { imagemDaCarta } from "./imagens";
import "./JogadorAvatar.css";

/**
 * A figura (dama, valete ou coringa) que representa o jogador, com a cor dele.
 * Com mostrarNome, aparece o nome ao lado.
 */
function JogadorAvatar({ jogador, tamanho = "media", mostrarNome = false, className = "" }) {
  if (!jogador) return null;
  return (
    <span className={`avatar avatar--${tamanho} ${className}`} style={{ "--cor-jogador": jogador.cor }}>
      <span className="avatar__carta">
        <img src={imagemDaCarta(jogador.carta)} alt="" draggable="false" />
      </span>
      {mostrarNome && <span className="avatar__nome">{jogador.nome}</span>}
    </span>
  );
}

export default JogadorAvatar;
