import { getFormacao } from "../../config/formacoes";
import { POSICOES } from "../../config/posicoes";
import { sinal } from "../../utils/texto";
import { getJogador } from "../../services/elencoService";
import CartaJogador from "../CartaJogador/CartaJogador";
import "./Campo.css";

// Faixas do campo (y em %), de cima para baixo
const ZONAS = [
  { id: "ataque", nome: "Ataque", topo: 0, altura: 30 },
  { id: "meio", nome: "Meio-campo", topo: 30, altura: 30 },
  { id: "defesa", nome: "Defesa", topo: 60, altura: 40 },
];

const tendencia = (d) => (d > 0 ? "sobe" : d < 0 ? "desce" : "igual");

/**
 * Campo de pé (ataque para cima) com as 11 vagas do esquema.
 * Cada vaga é um alvo de arrasto (data-alvo="titular:i") e também aceita clique.
 * As faixas de ataque, meio e defesa ficam verdes ou vermelhas
 * quando aquele setor melhorou ou piorou na última mudança.
 */
export default function Campo({ formacao, titulares, forca, antes, selecionado, arrasto, onIniciar, onClicarVaga }) {
  const { vagas } = getFormacao(formacao);

  return (
    <div className="campo" aria-label={`Campo no ${formacao}`}>
      <svg className="campo-linhas" viewBox="0 0 68 80" preserveAspectRatio="none" aria-hidden="true">
        <rect x="2" y="2" width="64" height="76" />
        <line x1="2" y1="40" x2="66" y2="40" />
        <ellipse cx="34" cy="40" rx="8" ry="7" />
        <rect x="15" y="2" width="38" height="13" />
        <rect x="25" y="2" width="18" height="5" />
        <path d="M28 15 A7 6 0 0 0 40 15" />
        <rect x="15" y="65" width="38" height="13" />
        <rect x="25" y="73" width="18" height="5" />
        <path d="M28 65 A7 6 0 0 1 40 65" />
      </svg>

      {forca && (
        <div className="zonas" aria-hidden="true">
          {ZONAS.map((z) => {
            const d = antes ? forca[z.id] - antes[z.id] : 0;
            return (
              <div key={z.id} className={`zona zona--${tendencia(d)}`} style={{ top: `${z.topo}%`, height: `${z.altura}%` }}>
                <span className="zona-rotulo">
                  {z.nome} {forca[z.id]}
                  {d !== 0 && ` (${sinal(d)})`}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {vagas.map((vaga, i) => {
        const jogador = getJogador(titulares[i]);
        const chave = `titular:${i}`;
        const emArrasto = arrasto?.id && jogador?.id === arrasto.id;
        return (
          <button
            type="button"
            key={`${formacao}-${i}`}
            className={`vaga ${arrasto?.alvo?.chave === chave ? "is-alvo" : ""} ${emArrasto ? "is-origem" : ""}`}
            style={{ left: `${vaga.x}%`, top: `${vaga.y}%` }}
            data-alvo={chave}
            aria-label={jogador ? `${POSICOES[vaga.pos].nome}: ${jogador.nome}` : `${POSICOES[vaga.pos].nome}: vaga livre`}
            onPointerDown={jogador ? (e) => onIniciar(e, jogador.id) : undefined}
            onClick={() => onClicarVaga({ tipo: "titular", i }, jogador?.id ?? null)}
          >
            {jogador ? (
              <CartaJogador jogador={jogador} pos={vaga.pos} selecionada={selecionado === jogador.id} />
            ) : (
              <span className="vaga-livre">{vaga.pos}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
