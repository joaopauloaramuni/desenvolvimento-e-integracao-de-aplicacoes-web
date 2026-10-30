import "./Letreiro.css";

/**
 * Número da linha no estilo do letreiro eletrônico dos ônibus de BH
 * (fonte de matriz de pontos, âmbar sobre fundo escuro).
 * <Letreiro codigo="9206" tamanho="grande" />
 */
const Letreiro = ({ codigo, tamanho = "medio" }) => (
  <span className={`letreiro letreiro-${tamanho}`} aria-label={`Linha ${codigo}`}>
    {codigo}
  </span>
);

export default Letreiro;
