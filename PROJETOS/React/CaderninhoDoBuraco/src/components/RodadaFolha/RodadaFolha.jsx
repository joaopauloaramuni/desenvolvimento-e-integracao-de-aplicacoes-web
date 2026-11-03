import { LuPencil, LuTrash2 } from "react-icons/lu";
import { Link } from "react-router-dom";
import { formatNumero } from "../../utils/format";
import Carta from "../Carta/Carta";
import JogadorAvatar from "../JogadorAvatar/JogadorAvatar";
import { textoDoSelo } from "../MaoEditor/tiposDeJogo";
import "./RodadaFolha.css";

/** A conta por extenso: "mesa 125 + canastras 200 + batida 100 − mão 30 = 395" */
function contaEscrita(p) {
  const partes = [`mesa ${formatNumero(p.pontosCartas)}`];
  const somar = (nome, valor) => {
    if (valor > 0) partes.push(`+ ${nome} ${formatNumero(valor)}`);
    if (valor < 0) partes.push(`− ${nome} ${formatNumero(Math.abs(valor))}`);
  };
  somar("canastras", p.pontosCanastras);
  somar("batida", p.pontosBatida);
  const maoEmCartas = p.maoTexto && !/^\s*[-−]?\d+\s*$/.test(p.maoTexto);
  somar(maoEmCartas ? `mão (${p.maoTexto})` : "mão", p.pontosMao);
  somar("acertos", p.ajuste);
  return `${partes.join(" ")} = ${formatNumero(p.total)}`;
}

/** A mesa que foi digitada (cartas lidas, mão e a conta). */
function DetalheDaMesa({ p }) {
  if (p.modo === "total") {
    return <p className="rodada__nota">Lançado só o total.</p>;
  }
  return (
    <div className="rodada__mesa">
      {p.jogos.length === 0 && <p className="rodada__nota">Nenhum jogo baixado.</p>}
      {p.jogos.map((jogo, i) => (
        <div key={i} className="rodada__jogo">
          <span className="rodada__cartas">
            {jogo.cartas.map((c, j) => (
              <Carta key={j} valor={c.valor} naipe={jogo.naipe} curinga={c.curinga && c.valor !== "JOKER"} tamanho="mini" />
            ))}
          </span>
          {jogo.tipo !== "jogo" && <span className={`selo selo--${jogo.tipo}`}>{textoDoSelo(jogo.tipo)}</span>}
          <b>{jogo.pontos}</b>
        </div>
      ))}
      <p className="rodada__conta">{contaEscrita(p)}</p>
    </div>
  );
}

/**
 * Uma rodada como folha do caderninho:
 *   Mariana - 500 pontos - bateu e ganhou a rodada
 *   João Paulo - 300 pontos
 */
function RodadaFolha({ rodada, partidaId, jogadoresPorId, onExcluir, excluindo = false }) {
  const linhas = [...rodada.pontuacoes].sort((a, b) => b.total - a.total);

  return (
    <article className="folha folha--espiral rodada" aria-labelledby={`rodada-${rodada.id}`}>
      <header className="rodada__topo">
        <h3 id={`rodada-${rodada.id}`} className="manuscrito">
          Rodada {rodada.numero}
        </h3>
        <div className="rodada__acoes">
          <Link className="botao botao--tinta botao--pequeno" to={`/partidas/${partidaId}/rodadas/${rodada.id}`}>
            <LuPencil aria-hidden="true" /> Editar
          </Link>
          <button
            type="button"
            className="botao botao--perigo botao--icone"
            onClick={() => onExcluir(rodada)}
            disabled={excluindo}
            aria-label={`Excluir a rodada ${rodada.numero}`}
          >
            <LuTrash2 aria-hidden="true" />
          </button>
        </div>
      </header>

      <ol className="rodada__linhas">
        {linhas.map((p) => {
          const jogador = jogadoresPorId.get(p.jogadorId);
          return (
            <li key={p.jogadorId} className={p.venceu ? "rodada__linha--venceu" : ""}>
              <details>
                <summary>
                  <JogadorAvatar jogador={jogador} tamanho="pequena" mostrarNome />
                  <span className="rodada__pontos">
                    <b>{formatNumero(p.total)}</b> pontos
                  </span>
                  <span className="rodada__selos">
                    {p.bateu && <span className="selo selo--bateu">bateu</span>}
                    {p.venceu && <span className="selo selo--venceu">ganhou a rodada</span>}
                  </span>
                </summary>
                <DetalheDaMesa p={p} />
              </details>
            </li>
          );
        })}
      </ol>
    </article>
  );
}

export default RodadaFolha;
