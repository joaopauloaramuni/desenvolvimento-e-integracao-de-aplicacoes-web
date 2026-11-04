import { useState } from 'react';
import { Link } from 'react-router-dom';
import ParticipanteCard from '../components/ParticipanteCard';
import {
  listarNaRoca,
  listarForaDaRoca,
  registrarVoto,
} from '../services/votacaoService';

function Votacao() {
  const naRoca = listarNaRoca();
  const foraDaRoca = listarForaDaRoca();

  // Último participante que recebeu voto (para a mensagem de confirmação)
  const [ultimoVoto, setUltimoVoto] = useState(null);
  // Quantos votos este usuário deu desde que abriu a página
  const [votosNaSessao, setVotosNaSessao] = useState(0);

  function handleVotar(participante) {
    registrarVoto(participante.id);
    setUltimoVoto(participante);
    setVotosNaSessao((qtd) => qtd + 1);
  }

  return (
    <main className="pagina">
      <header className="pagina-cabecalho">
        <h1>Quem você quer eliminar?</h1>
        <p>Cada clique conta um voto para tirar o peão da fazenda.</p>
      </header>

      {ultimoVoto && (
        <div className="aviso" role="status">
          <p>
            Voto registrado para eliminar <strong>{ultimoVoto.nome}</strong>.
            Você já votou {votosNaSessao} {votosNaSessao === 1 ? 'vez' : 'vezes'}.
          </p>
          <Link to="/resultado">Ver resultado</Link>
        </div>
      )}

      <section className="grade-roca">
        {naRoca.map((p) => (
          <ParticipanteCard key={p.id} participante={p} onVotar={handleVotar} />
        ))}
      </section>

      <section className="demais">
        <h2>Demais peões</h2>
        <p className="demais-legenda">Fora da roça nesta semana, não podem receber votos.</p>
        <div className="grade-participantes">
          {foraDaRoca.map((p) => (
            <ParticipanteCard key={p.id} participante={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Votacao;
