import { nivelDaCarta } from "../../config/appConfig";
import { POSICOES } from "../../config/posicoes";
import { encaixe, overallNaPosicao } from "../../services/escalacaoService";
import FotoJogador from "../FotoJogador/FotoJogador";
import "./CartaJogador.css";

const TEXTO_ENCAIXE = {
  natural: "na posição dele",
  secundaria: "em posição que ele também faz",
  vizinha: "adaptado",
  improvisado: "improvisado",
  goleiro: "totalmente fora de posição",
};

/**
 * Carta estilo FIFA. Com "pos", mostra o overall naquela posição
 * e uma bolinha verde, amarela ou vermelha conforme o encaixe.
 */
export default function CartaJogador({ jogador, pos, tamanho = "campo", selecionada = false, className = "" }) {
  const naPosicao = pos ?? jogador.posicao;
  const overall = overallNaPosicao(jogador, naPosicao);
  const tipo = encaixe(jogador, naPosicao);
  const titulo = pos
    ? `${jogador.nome}: ${overall} como ${POSICOES[pos].nome.toLowerCase()} (${TEXTO_ENCAIXE[tipo]})`
    : `${jogador.nome}, ${POSICOES[jogador.posicao].nome.toLowerCase()}, overall ${jogador.overall}`;

  return (
    <div
      className={`carta carta--${tamanho} carta--${nivelDaCarta(jogador.overall)} ${selecionada ? "is-selecionada" : ""} ${className}`}
      title={titulo}
    >
      <div className="carta-topo">
        <span className="carta-ovr">{overall}</span>
        <span className="carta-pos">{naPosicao}</span>
      </div>
      <FotoJogador jogador={jogador} className="carta-foto" />
      <div className="carta-nome">{jogador.nome}</div>
      {pos && <span className={`carta-encaixe encaixe--${tipo}`} aria-hidden="true" />}
    </div>
  );
}
