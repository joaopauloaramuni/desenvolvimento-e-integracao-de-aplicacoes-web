import { useId } from "react";
import { LuCrown } from "react-icons/lu";
import { formatNumero, formatPontos, plural } from "../../utils/format";
import Carta from "../Carta/Carta";
import JogadorAvatar from "../JogadorAvatar/JogadorAvatar";
import MaoEditor from "../MaoEditor/MaoEditor";
import "./PontuacaoForm.css";

/** As parcelas da conta, na ordem da folha. */
function parcelas(c) {
  const canastras = [
    c.canastrasReais && plural(c.canastrasReais, "real", "reais"),
    c.canastrasLimpas && plural(c.canastrasLimpas, "limpa"),
    c.canastrasSujas && plural(c.canastrasSujas, "suja"),
  ].filter(Boolean);

  return [
    { nome: "Cartas na mesa", valor: c.pontosCartas },
    { nome: canastras.length ? `Canastras (${canastras.join(", ")})` : "Canastras", valor: c.pontosCanastras },
    { nome: "Batida", valor: c.pontosBatida },
    { nome: "Cartas na mão", valor: c.pontosMao },
    ...(c.ajuste ? [{ nome: "Outros acertos", valor: c.ajuste }] : []),
  ];
}

/**
 * A folha de um jogador no lançamento da rodada: os jogos baixados, as cartas
 * que sobraram na mão, se bateu, e a conta feita na hora.
 */
function PontuacaoForm({ jogador, formulario, contagem, lider, onChange }) {
  const id = useId();
  const f = formulario;
  const c = contagem;

  return (
    <article className={`folha pontuacao${lider ? " pontuacao--lider" : ""}`} aria-labelledby={`${id}-nome`}>
      <header className="pontuacao__topo">
        <JogadorAvatar jogador={jogador} tamanho="grande" />
        <h3 id={`${id}-nome`} className="manuscrito pontuacao__nome">
          {jogador.nome}
        </h3>
        <div className="pontuacao__total" aria-live="polite">
          {lider && (
            <span className="pontuacao__coroa">
              <LuCrown aria-hidden="true" /> na frente
            </span>
          )}
          <strong>{formatNumero(c.total)}</strong>
          <span>pontos</span>
        </div>
      </header>

      <div className="pontuacao__modo" role="radiogroup" aria-label={`Como lançar os pontos de ${jogador.nome}`}>
        <label>
          <input type="radio" name={`${id}-modo`} checked={f.modo === "cartas"} onChange={() => onChange({ modo: "cartas" })} />
          Contar pelas cartas
        </label>
        <label>
          <input type="radio" name={`${id}-modo`} checked={f.modo === "total"} onChange={() => onChange({ modo: "total" })} />
          Só o total
        </label>
      </div>

      {f.modo === "cartas" ? (
        <>
          <MaoEditor
            valor={f.jogosTexto}
            onChange={(jogosTexto) => onChange({ jogosTexto })}
            jogos={c.jogos}
            erros={c.erros.filter((e) => !e.startsWith("Cartas na mão"))}
          />

          <div className="pontuacao__linha">
            <label className="campo pontuacao__mao">
              <span>Cartas que sobraram na mão</span>
              <input
                className="entrada"
                value={f.maoTexto}
                onChange={(e) => onChange({ maoTexto: e.target.value })}
                placeholder="30  ou  K, 7, coringa"
                spellCheck="false"
              />
              <small>
                {c.erros.find((e) => e.startsWith("Cartas na mão")) ??
                  (c.pontosMao ? `Desconta ${formatPontos(c.pontosMao)} pontos.` : "O número de pontos ou as cartas.")}
              </small>
              {c.maoCartas.length > 0 && (
                <span className="pontuacao__mao-cartas" aria-hidden="true">
                  {c.maoCartas.map((carta, i) => (
                    <Carta key={i} valor={carta.valor} tamanho="mini" decorativa />
                  ))}
                </span>
              )}
            </label>

            <label className="campo pontuacao__ajuste">
              <span>Outros acertos</span>
              <input
                className="entrada"
                inputMode="numeric"
                value={f.ajuste}
                onChange={(e) => onChange({ ajuste: e.target.value.replace(/[^\d−-]/g, "") })}
                placeholder="0"
              />
              <small>Ex.: −100 do morto.</small>
            </label>
          </div>
        </>
      ) : (
        <label className="campo">
          <span>Total da rodada (já com tudo)</span>
          <input
            className="entrada pontuacao__total-manual"
            inputMode="numeric"
            value={f.totalManual}
            onChange={(e) => onChange({ totalManual: e.target.value.replace(/[^\d−-]/g, "") })}
            placeholder="500"
          />
          {c.erros.length > 0 && <small>{c.erros[0]}</small>}
        </label>
      )}

      <label className="pontuacao__bateu">
        <input type="checkbox" checked={f.bateu} onChange={(e) => onChange({ bateu: e.target.checked })} />
        <span>
          <strong>Bateu nesta rodada</strong>
          {f.modo === "cartas" && <small>soma +100</small>}
        </span>
      </label>

      {f.modo === "cartas" && (
        <dl className="pontuacao__conta">
          {parcelas(c).map((p) => (
            <div key={p.nome}>
              <dt>{p.nome}</dt>
              <dd>{p.nome === "Cartas na mesa" ? formatNumero(p.valor) : formatPontos(p.valor)}</dd>
            </div>
          ))}
          <div className="pontuacao__conta-total">
            <dt>Total</dt>
            <dd>{formatNumero(c.total)}</dd>
          </div>
        </dl>
      )}
    </article>
  );
}

export default PontuacaoForm;
