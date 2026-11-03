import jokerImagem from "../../assets/images/joker-carta.webp";
import { NAIPES } from "../../services/contagemService";
import "./Carta.css";

const NOMES = { A: "Ás", J: "Valete", Q: "Dama", K: "Rei", JOKER: "Coringa" };

/** "Ás de copas", "7", "Coringa", "2 (curinga)" — para leitores de tela. */
export function nomeDaCarta(valor, naipe, curinga) {
  if (valor === "JOKER") return "Coringa";
  const base = NOMES[valor] ?? valor;
  const comNaipe = naipe ? `${base} de ${NAIPES[naipe].nome}` : base;
  return curinga ? `${comNaipe} (curinga)` : comNaipe;
}

/**
 * Uma carta de baralho desenhada em CSS (só o Coringa usa a ilustração).
 *   valor: "A", "2" ... "10", "J", "Q", "K" ou "JOKER"
 *   naipe: "copas" | "ouros" | "espadas" | "paus" | null (sem naipe: só o valor)
 *   curinga: mostra a estrela de curinga (o 2 fazendo papel de outra carta)
 *   tamanho: "mini" | "pequena" | "media" | "grande"
 */
function Carta({ valor, naipe = null, curinga = false, tamanho = "media", className = "", style, decorativa = false }) {
  const n = naipe ? NAIPES[naipe] : null;
  const classes = [
    "carta",
    `carta--${tamanho}`,
    n?.vermelho ? "carta--vermelha" : "",
    valor === "JOKER" ? "carta--joker" : "",
    curinga ? "carta--curinga" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const acessibilidade = decorativa
    ? { "aria-hidden": true }
    : { role: "img", "aria-label": nomeDaCarta(valor, naipe, curinga) };

  if (valor === "JOKER") {
    return (
      <span className={classes} style={style} {...acessibilidade}>
        <img src={jokerImagem} alt="" draggable="false" />
      </span>
    );
  }

  const figura = valor === "J" || valor === "Q" || valor === "K";
  const indice = (
    <>
      <b>{valor}</b>
      {n && <i>{n.simbolo}</i>}
    </>
  );

  return (
    <span className={classes} style={style} {...acessibilidade}>
      <span className="carta__canto carta__canto--topo">{indice}</span>
      <span className={`carta__centro${figura || !n ? " carta__centro--letra" : ""}`}>
        {figura || !n ? valor : n.simbolo}
      </span>
      <span className="carta__canto carta__canto--base">{indice}</span>
      {curinga && <span className="carta__estrela">★</span>}
    </span>
  );
}

export default Carta;
