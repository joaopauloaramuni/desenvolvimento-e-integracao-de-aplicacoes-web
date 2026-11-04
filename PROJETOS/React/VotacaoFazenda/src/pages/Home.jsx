import { Link } from 'react-router-dom';
import { listarNaRoca } from '../services/votacaoService';

function Home() {
  const naRoca = listarNaRoca();

  return (
    <main className="home">
      <section className="home-hero">
        <figure className="fazendeiro">
          <img src="/fazendeiro.jpg" alt="Fazendeiro João Paulo Aramuni de chapéu" />
          <figcaption>Fazendeiro João Paulo</figcaption>
        </figure>

        <div className="balao">
          <h1>Ô de casa! Aqui quem manda é o fazendeiro.</h1>
          <p>
            Três peões foram parar na roça esta semana. Só um volta pra casa,
            e quem decide é você. Pode votar quantas vezes quiser.
          </p>
          <div className="home-acoes">
            <Link to="/votacao" className="botao botao-principal">Votar agora</Link>
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
      </section>
    </main>
  );
}

export default Home;
