import { formatNumero, formatPercentual, formatPontos } from "../../utils/format";
import JogadorAvatar from "../JogadorAvatar/JogadorAvatar";
import "./RankingTabela.css";

/**
 * O total geral: quem ganhou mais rodadas no período. Na Home aparece só
 * com vitórias e pontos (compacta).
 */
function RankingTabela({ ranking, compacta = false }) {
  return (
    <div className="ranking-rolagem">
      <table className={`ranking${compacta ? " ranking--compacta" : ""}`}>
        <thead>
          <tr>
            <th scope="col" className="ranking__posicao">
              <span className="visualmente-oculto">Posição</span>
            </th>
            <th scope="col">Jogador</th>
            <th scope="col">Vitórias</th>
            {!compacta && <th scope="col">Rodadas</th>}
            {!compacta && <th scope="col">Aproveit.</th>}
            <th scope="col">Pontos</th>
            {!compacta && <th scope="col">Média</th>}
            {!compacta && <th scope="col">Batidas</th>}
            {!compacta && (
              <th scope="col">
                <abbr title="Canastras limpas / sujas / reais (Ás a Ás)">Canastras L/S/R</abbr>
              </th>
            )}
            {!compacta && <th scope="col">Na mão</th>}
          </tr>
        </thead>
        <tbody>
          {ranking.map((r, i) => (
            <tr key={r.jogador.id} className={i === 0 && r.vitorias > 0 ? "ranking__primeiro" : ""}>
              <td className="ranking__posicao">{i + 1}º</td>
              <th scope="row">
                <JogadorAvatar jogador={r.jogador} tamanho="pequena" mostrarNome />
              </th>
              <td className="ranking__vitorias">
                <b>{r.vitorias}</b> <span>{r.vitorias === 1 ? "vitória" : "vitórias"}</span>
              </td>
              {!compacta && <td>{r.rodadas}</td>}
              {!compacta && <td>{formatPercentual(r.aproveitamento)}</td>}
              <td className="ranking__numero">{formatNumero(r.pontos)}</td>
              {!compacta && <td className="ranking__numero">{formatNumero(r.media)}</td>}
              {!compacta && <td>{r.batidas}</td>}
              {!compacta && (
                <td>
                  {r.limpas}/{r.sujas}/<span className={r.reais ? "ranking__real" : ""}>{r.reais}</span>
                </td>
              )}
              {!compacta && <td className="ranking__numero">{formatPontos(r.pontosMao)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RankingTabela;
