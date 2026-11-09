import { NIVEIS_FORCA, SETORES_FORCA, nivelDaForca } from "../../config/appConfig";
import { percentual } from "../../services/escalacaoService";
import { sinal } from "../../utils/texto";
import "./ForcaTime.css";

const tendencia = (d) => (d > 0 ? "sobe" : d < 0 ? "desce" : "igual");

const Delta = ({ valor }) =>
  valor ? (
    <span className={`delta delta--${tendencia(valor)}`}>
      <span aria-hidden="true">{valor > 0 ? "▲" : "▼"}</span> {sinal(valor)}
    </span>
  ) : null;

/**
 * Gráfico da força do time por setor.
 * - A cor da barra mostra o nível: verde (forte), amarelo (regular), vermelho (fraco).
 * - A linha do setor que mudou fica verde (melhorou) ou vermelha (piorou), com a seta e o valor.
 * - A marca fina na barra mostra onde ela estava antes da última mudança.
 */
export default function ForcaTime({ forca, antes, ultima }) {
  const mudancas = antes
    ? SETORES_FORCA.map((s) => ({ ...s, d: forca[s.id] - antes[s.id] })).filter((s) => s.d)
    : [];
  const melhorou = mudancas.filter((s) => s.d > 0).sort((a, b) => b.d - a.d);
  const piorou = mudancas.filter((s) => s.d < 0).sort((a, b) => a.d - b.d);

  return (
    <section className="forca" aria-labelledby="forca-titulo">
      <h2 id="forca-titulo" className="secao-titulo">
        Força do time
      </h2>

      <div className="forca-destaques">
        <div className="forca-numero">
          <strong className={`nivel-texto--${nivelDaForca(forca.geral)}`}>{forca.geral}</strong>
          <span>
            Geral <Delta valor={antes && forca.geral - antes.geral} />
          </span>
        </div>
        <div className="forca-numero">
          <strong>{forca.entrosamento}%</strong>
          <span>
            Entrosamento <Delta valor={antes && forca.entrosamento - antes.entrosamento} />
          </span>
        </div>
      </div>

      <ul className="forca-barras">
        {SETORES_FORCA.map(({ id, nome }) => {
          const d = antes ? forca[id] - antes[id] : 0;
          return (
            <li key={id} className={`forca-barra mudou--${tendencia(d)}`}>
              <span className="forca-nome">{nome}</span>
              <span className="forca-trilho">
                <span
                  className={`forca-valor nivel--${nivelDaForca(forca[id])}`}
                  style={{ width: `${percentual(forca[id])}%` }}
                />
                {d !== 0 && (
                  <span className="forca-antes" style={{ left: `${percentual(antes[id])}%` }} title={`Antes: ${antes[id]}`} />
                )}
              </span>
              <span className="forca-num">{forca[id]}</span>
              <span className="forca-delta">
                <Delta valor={d} />
              </span>
            </li>
          );
        })}
      </ul>

      <ul className="forca-legenda" aria-label="Legenda das cores">
        {NIVEIS_FORCA.map((n) => (
          <li key={n.id}>
            <span className={`legenda-cor nivel--${n.id}`} aria-hidden="true" />
            {n.nome}
            {n.min ? ` (${n.min}+)` : ` (até ${NIVEIS_FORCA[1].min - 1})`}
          </li>
        ))}
      </ul>

      <div className="forca-veredito" aria-live="polite">
        {ultima ? (
          <>
            <p className="forca-ultima">{ultima}.</p>
            {mudancas.length === 0 && <p className="forca-ultima">Nenhum setor mudou.</p>}
            {melhorou.length > 0 && (
              <p className="veredito veredito--sobe">
                <span aria-hidden="true">▲</span> Melhorou: {melhorou.map((s) => `${s.nome.toLowerCase()} ${sinal(s.d)}`).join(", ")}
              </p>
            )}
            {piorou.length > 0 && (
              <p className="veredito veredito--desce">
                <span aria-hidden="true">▼</span> Piorou: {piorou.map((s) => `${s.nome.toLowerCase()} ${sinal(s.d)}`).join(", ")}
              </p>
            )}
          </>
        ) : (
          <p className="forca-ultima">Mexa no time: o setor que melhorar fica verde, o que piorar fica vermelho.</p>
        )}
      </div>
      {forca.escalados < 11 && <p className="forca-aviso">Faltam {11 - forca.escalados} titulares: vaga vazia derruba a nota.</p>}
    </section>
  );
}
