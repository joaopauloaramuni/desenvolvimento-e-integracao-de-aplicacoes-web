import { Link } from 'react-router-dom';
import { listarPorSituacao, obterFazendeiro } from '../services/votacaoService';

function Home() {
  const naRoca = listarPorSituacao('roca');
  const fazendeiroDaSemana = obterFazendeiro();

  return (
    <main className="home">
      <section className="home-hero">
        <figure className="fazendeiro">
          <img src="/fazendeiro.jpg" alt="Fazendeiro João Paulo Aramuni de chapéu" />
          <figcaption>Fazendeiro João Paulo</figcaption>
        </figure>

        <div className="balao">
          <h1>Ô de casa! Esta semana a roça tá lotada.</h1>
          <p>
            Quatro peões foram parar na roça e agora o voto é para <strong>salvar</strong>:
            escolha quem você quer que <strong>fique</strong> na fazenda. O menos votado
            arruma a mala e volta pra casa. Pode votar quantas vezes quiser.
          </p>
          <div className="home-acoes">
            <Link to="/votacao" className="botao botao-principal">Salvar um peão</Link>
            <Link to="/resultado" className="botao botao-secundario">Ver parcial</Link>
          </div>
        </div>
      </section>

      <section className="home-roca">
        <h2>Na roça desta semana</h2>
        <ul className="home-roca-lista">
          {naRoca.map((p) => (
            <li key={p.id}>
              <img src={p.foto} alt={p.nome} />
              <span>{p.nome}</span>
            </li>
          ))}
        </ul>

        {fazendeiroDaSemana && (
          <p className="home-imune">
            Imune nesta semana: <strong>{fazendeiroDaSemana.nome}</strong>, o Fazendeiro da semana.
          </p>
        )}
      </section>
    </main>
  );
}

export default Home;
