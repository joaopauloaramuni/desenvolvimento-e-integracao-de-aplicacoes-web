import { useState } from 'react';
import { Link } from 'react-router-dom';
import ParticipanteCard from '../components/ParticipanteCard';
import {
  listarPorSituacao,
  obterFazendeiro,
  registrarVoto,
} from '../services/votacaoService';

function Votacao() {
  const naRoca = listarPorSituacao('roca');
  const peoes = listarPorSituacao('peao');
  const fazendeiroDaSemana = obterFazendeiro();

  // Participante escolhido, mas que ainda não teve o voto confirmado
  const [selecionado, setSelecionado] = useState(null);
  // Nomes de quem o usuário salvou desde que abriu a página (na ordem dos votos)
  const [historico, setHistorico] = useState([]);

  function handleConfirmar() {
    registrarVoto(selecionado.id);
    setHistorico([...historico, selecionado.nome]);
    setSelecionado(null);
  }

  return (
    <main className="pagina">
      <header className="pagina-cabecalho">
        <h1>Quem você quer salvar?</h1>
        <p>Selecione um peão da roça e confirme o voto para ele ficar na fazenda.</p>
      </header>

      <section className="grade-roca">
        {naRoca.map((p) => (
          <ParticipanteCard
            key={p.id}
            participante={p}
            selecionado={selecionado?.id === p.id}
            onSelecionar={setSelecionado}
          />
        ))}
      </section>

      <div className="confirmacao">
        <p>
          {selecionado
            ? <>Seu voto vai para <strong>{selecionado.nome}</strong> ficar.</>
            : 'Nenhum peão selecionado.'}
        </p>
        <button
          type="button"
          className="botao botao-principal"
          disabled={!selecionado}
          onClick={handleConfirmar}
        >
          Confirmar voto
        </button>
      </div>

      {historico.length > 0 && (
        <section className="historico" aria-live="polite">
          <h2>
            Seus votos nesta sessão: {historico.length} {historico.length === 1 ? 'voto' : 'votos'}
          </h2>
          <ol className="historico-lista">
            {historico.map((nome, indice) => (
              <li key={indice}>{nome}</li>
            ))}
          </ol>
          <Link to="/resultado">Ver parcial</Link>
        </section>
      )}

      {fazendeiroDaSemana && (
        <section className="demais">
          <h2>Fazendeiro da semana</h2>
          <p className="demais-legenda">Está imune e não pode receber votos.</p>
          <div className="grade-participantes">
            <ParticipanteCard participante={fazendeiroDaSemana} />
          </div>
        </section>
      )}

      <section className="demais">
        <h2>Demais peões</h2>
        <p className="demais-legenda">Fora da roça nesta semana, não podem receber votos.</p>
        <div className="grade-participantes">
          {peoes.map((p) => (
            <ParticipanteCard key={p.id} participante={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Votacao;
