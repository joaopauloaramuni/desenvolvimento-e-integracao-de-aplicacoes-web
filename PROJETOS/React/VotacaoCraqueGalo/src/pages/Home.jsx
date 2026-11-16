import { Link } from 'react-router-dom';
import { listarPorSituacao, obterSuspenso } from '../services/votacaoService';

function Home() {
  const indicados = listarPorSituacao('indicado');
  const suspenso = obterSuspenso();

  return (
    <main className="home">
      <section className="home-hero">
        <figure className="escudo">
          <img src="/escudo-galo.svg" alt="Escudo do Atlético Mineiro" />
          <figcaption>Arena MRV</figcaption>
        </figure>

        <div className="balao">
          <p className="placar-jogo" aria-label="Placar final: Atlético 3, Cruzeiro 1">
            <span>Atlético</span>
            <strong>3 x 1</strong>
            <span>Cruzeiro</span>
          </p>
          <h1>Fim de jogo! Quem foi o craque?</h1>
          <p>
            O Galo venceu o clássico e quatro jogadores foram <strong>indicados</strong> ao prêmio de
            <strong> Craque do Jogo</strong>. Agora é com você, Massa: escolha quem jogou mais. O mais
            votado leva o troféu. Pode votar quantas vezes quiser.
          </p>
          <div className="home-acoes">
            <Link to="/votacao" className="botao botao-principal">Votar no craque</Link>
            <Link to="/resultado" className="botao botao-secundario">Ver parcial</Link>
          </div>
        </div>
      </section>

      <section className="home-indicados">
        <h2>Indicados ao Craque do Jogo</h2>
        <ul className="home-indicados-lista">
          {indicados.map((j) => (
            <li key={j.id}>
              <img src={j.foto} alt={j.nome} />
              <span className="home-numero">{j.numero}</span>
              <span>{j.nome}</span>
            </li>
          ))}
        </ul>

        {suspenso && (
          <p className="home-suspenso">
            Fora deste jogo: <strong>{suspenso.nome}</strong>, que cumpriu suspensão pelo terceiro cartão amarelo.
          </p>
        )}
      </section>
    </main>
  );
}

export default Home;
