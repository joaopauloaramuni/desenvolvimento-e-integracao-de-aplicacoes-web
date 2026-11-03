import APP_CONFIG from "../../config/appConfig";
import { formatNumero } from "../../utils/format";
import Carta from "../Carta/Carta";
import "./LegendaPontos.css";

const { REGRAS } = APP_CONFIG;
const V = REGRAS.VALOR_CARTA;

const CARTAS = [
  { nome: "Ás (A)", pontos: V.A, cartas: [["A", "espadas"]] },
  { nome: "2 (curinga)", pontos: V[2], cartas: [["2", "copas"]] },
  { nome: "3 a 7", pontos: V[3], cartas: [["3", "paus"], ["7", "ouros"]] },
  { nome: "8 a Rei (K)", pontos: V[8], cartas: [["8", "espadas"], ["K", "copas"]] },
  { nome: "Coringa (Joker)", pontos: V.JOKER, cartas: [["JOKER", null]] },
];

const JOGADAS = [
  { nome: "Batida", detalhe: "Quem bate e encerra a rodada.", pontos: `+${REGRAS.BATIDA}` },
  {
    nome: "Canastra limpa",
    detalhe: `${REGRAS.TAMANHO_CANASTRA} cartas ou mais em sequência, sem curinga.`,
    pontos: `+${REGRAS.CANASTRA_LIMPA}`,
  },
  {
    nome: "Canastra suja",
    detalhe: `${REGRAS.TAMANHO_CANASTRA} cartas ou mais com curinga (2 ou Coringa).`,
    pontos: `+${REGRAS.CANASTRA_SUJA}`,
  },
  {
    nome: "Canastra real, de Ás a Ás",
    detalhe: `Limpa e completa: A, 2, 3 ... K, A do mesmo naipe. Vale ${formatNumero(REGRAS.CANASTRA_REAL)} no lugar dos ${REGRAS.CANASTRA_LIMPA}.`,
    pontos: `+${formatNumero(REGRAS.CANASTRA_REAL)}`,
    destaque: true,
  },
  {
    nome: "Cartas na mão",
    detalhe: "O que sobrou na mão é descontado. Terminou com 30 pontos na mão: −30.",
    pontos: "−valor",
    negativo: true,
  },
];

/**
 * A tabela de quanto vale cada coisa. Fica na Home e, compacta, no lançamento
 * da rodada. Os números vêm do appConfig (REGRAS).
 */
function LegendaPontos({ compacta = false }) {
  return (
    <div className={`legenda${compacta ? " legenda--compacta" : ""}`}>
      <section className="legenda__bloco" aria-labelledby="legenda-cartas">
        <h3 id="legenda-cartas">Cada carta na mesa</h3>
        <table className="legenda__tabela">
          <thead className="visualmente-oculto">
            <tr>
              <th scope="col">Carta</th>
              <th scope="col">Pontos</th>
            </tr>
          </thead>
          <tbody>
            {CARTAS.map((c) => (
              <tr key={c.nome}>
                <th scope="row">
                  <span className="legenda__cartas" aria-hidden="true">
                    {c.cartas.map(([valor, naipe]) => (
                      <Carta key={valor} valor={valor} naipe={naipe} tamanho={compacta ? "mini" : "pequena"} decorativa />
                    ))}
                  </span>
                  {c.nome}
                </th>
                <td>{c.pontos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="legenda__bloco" aria-labelledby="legenda-jogadas">
        <h3 id="legenda-jogadas">Bônus e descontos</h3>
        <ul className="legenda__jogadas">
          {JOGADAS.map((j) => (
            <li
              key={j.nome}
              className={[j.destaque && "legenda__jogada--real", j.negativo && "legenda__jogada--negativa"]
                .filter(Boolean)
                .join(" ")}
            >
              <span>
                <strong>{j.nome}</strong>
                {!compacta && <small>{j.detalhe}</small>}
              </span>
              <b>{j.pontos}</b>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default LegendaPontos;
