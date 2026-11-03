import { useState } from "react";
import { LuRotateCcw } from "react-icons/lu";
import APP_CONFIG from "../../config/appConfig";
import { ORDEM_VALORES } from "../../services/contagemService";
import { formatNumero } from "../../utils/format";
import Carta from "../Carta/Carta";
import "./CanastraLeque.css";

// A canastra real: Ás, 2, 3 ... K, Ás, todas de copas
const CARTAS = [...ORDEM_VALORES, "A"];
const ABERTURA = 112; // graus entre a primeira e a última carta

/**
 * O monte se abre em leque, de Ás a Ás, ao entrar na Home.
 * A animação é só CSS: cada carta gira do monte até o ângulo dela, uma depois
 * da outra (--i). "Abrir de novo" remonta o leque e a animação recomeça.
 */
function CanastraLeque({ naipe = "copas" }) {
  const [rodada, setRodada] = useState(0);
  const passo = ABERTURA / (CARTAS.length - 1);

  return (
    <figure className="leque" aria-label="Canastra real: Ás, 2, 3, 4, 5, 6, 7, 8, 9, 10, Valete, Dama, Rei e Ás de copas">
      <div className="leque__mesa" key={rodada}>
        {CARTAS.map((valor, i) => (
          <Carta
            key={`${valor}-${i}`}
            valor={valor}
            naipe={naipe}
            tamanho="grande"
            decorativa
            className="leque__carta"
            style={{ "--i": i, "--angulo": `${-ABERTURA / 2 + i * passo}deg` }}
          />
        ))}
      </div>

      <figcaption className="leque__legenda" key={`legenda-${rodada}`}>
        <span className="leque__nome">Canastra real, de Ás a Ás</span>
        <strong className="leque__pontos">{formatNumero(APP_CONFIG.REGRAS.CANASTRA_REAL)} pontos</strong>
        <button type="button" className="leque__repetir" onClick={() => setRodada((r) => r + 1)}>
          <LuRotateCcw aria-hidden="true" />
          Abrir de novo
        </button>
      </figcaption>
    </figure>
  );
}

export default CanastraLeque;
