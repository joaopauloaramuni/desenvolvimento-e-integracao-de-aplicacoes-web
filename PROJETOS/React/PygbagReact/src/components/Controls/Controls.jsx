import "./Controls.css";

// Lista de controles do jogo (vem do games.js).
export default function Controls({ controles }) {
  return (
    <dl className="controles">
      {controles.map(({ teclas, acao }) => (
        <div key={acao} className="controles-item">
          <dt>
            {teclas.map((tecla) => (
              <kbd key={tecla}>{tecla}</kbd>
            ))}
          </dt>
          <dd>{acao}</dd>
        </div>
      ))}
    </dl>
  );
}
