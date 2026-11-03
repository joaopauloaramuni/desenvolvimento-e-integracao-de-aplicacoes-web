import { useId, useRef } from "react";
import { LuCornerDownLeft, LuDelete } from "react-icons/lu";
import Carta from "../Carta/Carta";
import { textoDoSelo } from "./tiposDeJogo";
import "./MaoEditor.css";

const TECLAS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const ROTULO_TECLA = { J: "J", Q: "Q", K: "K" };

/** Junta uma carta no fim do texto: na mesma linha com ", " ou começando a linha. */
function juntar(texto, carta) {
  if (!texto || texto.endsWith("\n")) return texto + carta;
  return `${texto.replace(/[,\s]+$/, "")}, ${carta}`;
}

/** Tira a última carta digitada (ou a última quebra de linha). */
function apagarUltima(texto) {
  if (texto.endsWith("\n")) return texto.slice(0, -1);
  const semFim = texto.replace(/[,\s]+$/, "");
  const corte = Math.max(semFim.lastIndexOf(","), semFim.lastIndexOf("\n"));
  if (corte < 0) return "";
  return semFim[corte] === "\n" ? semFim.slice(0, corte + 1) : semFim.slice(0, corte);
}

/**
 * Onde se digita a mesa de um jogador: um jogo por linha.
 * Dá para escrever ("Ás, 2, 3") ou tocar nas cartas do teclado (bom no celular).
 * Embaixo, a prévia mostra as cartas lidas, os curingas e as canastras.
 */
function MaoEditor({ valor, onChange, jogos, erros, rotulo = "Jogos baixados na mesa" }) {
  const id = useId();
  const caixa = useRef(null);

  const aplicar = (novo) => {
    onChange(novo);
    // devolve o foco para a caixa e o cursor para o fim (no celular não abre o teclado)
    requestAnimationFrame(() => {
      const el = caixa.current;
      if (el && window.matchMedia("(pointer: fine)").matches) {
        el.focus();
        el.setSelectionRange(novo.length, novo.length);
      }
    });
  };

  return (
    <div className="mao">
      <label className="campo" htmlFor={id}>
        <span>{rotulo}</span>
        <small>Um jogo por linha. Escreva “Ás, 2, 3” e “8, coringa, 10”; o 2 fora do lugar vira curinga sozinho (ou escreva “2*”).</small>
      </label>
      <textarea
        id={id}
        ref={caixa}
        className="entrada mao__texto"
        rows={4}
        value={valor}
        spellCheck="false"
        autoCapitalize="characters"
        placeholder={"2, 3, 4\n7, 8, 9, 10\nÁs, 2, 3\n8, coringa, 10"}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={erros.length ? `${id}-erros` : undefined}
      />

      <div className="mao__teclado" role="group" aria-label="Teclado de cartas">
        {TECLAS.map((t) => (
          <button key={t} type="button" className="mao__tecla" onClick={() => aplicar(juntar(valor, t === "A" ? "Ás" : t))}>
            {ROTULO_TECLA[t] ?? t}
          </button>
        ))}
        <button type="button" className="mao__tecla mao__tecla--joker" onClick={() => aplicar(juntar(valor, "coringa"))}>
          Coringa
        </button>
        <button
          type="button"
          className="mao__tecla mao__tecla--curinga"
          onClick={() => aplicar(juntar(valor, "2*"))}
          title="Um 2 fazendo papel de curinga"
        >
          2 curinga
        </button>
        <button type="button" className="mao__tecla mao__tecla--acao" onClick={() => aplicar(`${valor.replace(/[,\s]+$/, "")}\n`)}>
          <LuCornerDownLeft aria-hidden="true" /> Novo jogo
        </button>
        <button type="button" className="mao__tecla mao__tecla--acao" onClick={() => aplicar(apagarUltima(valor))} aria-label="Apagar a última carta">
          <LuDelete aria-hidden="true" />
        </button>
      </div>

      {erros.length > 0 && (
        <ul className="mao__erros" id={`${id}-erros`}>
          {erros.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {jogos.length > 0 && (
        <ol className="mao__previa" aria-label="Jogos lidos">
          {jogos.map((jogo, i) => (
            <li key={i} className="mao__jogo">
              <span className="mao__cartas">
                {jogo.cartas.map((c, j) => (
                  <Carta key={j} valor={c.valor} naipe={jogo.naipe} curinga={c.curinga && c.valor !== "JOKER"} tamanho="mini" />
                ))}
              </span>
              <span className="mao__resumo">
                {jogo.tipo !== "jogo" && <span className={`selo selo--${jogo.tipo}`}>{textoDoSelo(jogo.tipo)}</span>}
                <b>{jogo.pontos}</b>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default MaoEditor;
