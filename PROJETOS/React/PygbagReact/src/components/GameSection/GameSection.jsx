import Controls from "../Controls/Controls.jsx";
import GamePlayer from "../GamePlayer/GamePlayer.jsx";
import "./GameSection.css";

// Um jogo do portfólio: título, descrição, a tela do jogo e os controles.
export default function GameSection({ game, primeiro }) {
  const Titulo = primeiro ? "h1" : "h2";
  return (
    <section className="jogo" aria-labelledby={`jogo-${game.pasta}`}>
      <div className="jogo-cabecalho">
        <Titulo id={`jogo-${game.pasta}`} className="jogo-titulo">
          {game.titulo}
        </Titulo>
        <p className="jogo-descricao">{game.descricao}</p>
        <ul className="jogo-tecnologias" aria-label="Tecnologias">
          {game.tecnologias.map((tec) => (
            <li key={tec}>{tec}</li>
          ))}
        </ul>
      </div>

      <div className="jogo-grade">
        <GamePlayer game={game} />

        <aside className="jogo-lateral">
          <h3>Como jogar</h3>
          <Controls controles={game.controles} />

          <h3>Sobre o projeto</h3>
          <p>
            Feito por <strong>{game.autor}</strong>
            <br />
            {game.disciplina}
          </p>
          {game.codigoFonte && (
            <a href={game.codigoFonte} target="_blank" rel="noreferrer">
              Ver o código Python do jogo
            </a>
          )}
        </aside>
      </div>
    </section>
  );
}
