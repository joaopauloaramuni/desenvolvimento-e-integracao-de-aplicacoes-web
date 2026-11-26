import { useState } from "react";
import { salvarTexto } from "../../utils/storage";

/**
 * Controle de tamanho do texto.
 * Aula 12: "Jakob Nielsen recomenda usar tamanho razoavelmente grande e
 * PERMITIR QUE OS USUÁRIOS ALTEREM O TAMANHO DA FONTE".
 *
 * Funciona porque TODO o CSS usa rem: mudar o font-size do <html>
 * escala textos, espaçamentos e componentes juntos.
 */
const NIVEIS = [87.5, 100, 112.5, 125, 150];

function nivelInicial() {
  const atual = parseFloat(document.documentElement.style.fontSize) || 100;
  const i = NIVEIS.indexOf(atual);
  return i === -1 ? 1 : i;
}

export default function ControleFonte() {
  const [indice, setIndice] = useState(nivelInicial);

  function aplicar(novo) {
    const valor = NIVEIS[novo];
    document.documentElement.style.fontSize = `${valor}%`;
    salvarTexto("fonte", String(valor));
    setIndice(novo);
  }

  return (
    <div className="controle-fonte" role="group" aria-label="Tamanho do texto">
      <button
        type="button"
        className="ferramenta"
        onClick={() => aplicar(indice - 1)}
        disabled={indice === 0}
        aria-label="Diminuir o texto"
        title="Diminuir o texto"
      >
        <span aria-hidden="true" className="fonte-menor">A−</span>
      </button>
      <button
        type="button"
        className="ferramenta"
        onClick={() => aplicar(1)}
        aria-label={`Texto em ${NIVEIS[indice]}%. Voltar ao tamanho padrão`}
        title="Tamanho padrão"
      >
        <span aria-hidden="true" className="fonte-valor">{NIVEIS[indice]}%</span>
      </button>
      <button
        type="button"
        className="ferramenta"
        onClick={() => aplicar(indice + 1)}
        disabled={indice === NIVEIS.length - 1}
        aria-label="Aumentar o texto"
        title="Aumentar o texto"
      >
        <span aria-hidden="true" className="fonte-maior">A+</span>
      </button>
    </div>
  );
}
