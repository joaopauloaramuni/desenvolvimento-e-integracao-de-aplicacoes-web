import { useState } from 'react';
import { Link } from 'react-router-dom';
import JogadorCard from '../components/JogadorCard';
import {
  listarPorSituacao,
  obterSuspenso,
  registrarVoto,
} from '../services/votacaoService';

function Votacao() {
  const indicados = listarPorSituacao('indicado');
  const elenco = listarPorSituacao('elenco');
  const suspenso = obterSuspenso();

  // Jogador escolhido, mas que ainda não teve o voto confirmado
  const [selecionado, setSelecionado] = useState(null);
  // Nomes dos jogadores votados desde que o usuário abriu a página (na ordem dos votos)
  const [historico, setHistorico] = useState([]);

  function handleConfirmar() {
    registrarVoto(selecionado.id);
    setHistorico([...historico, selecionado.nome]);
    setSelecionado(null);
  }

  return (
    <main className="pagina">
      <header className="pagina-cabecalho">
        <h1>Quem foi o craque do jogo?</h1>
        <p>Selecione um dos indicados e confirme o seu voto.</p>
      </header>

      <section className="grade-indicados">
        {indicados.map((j) => (
          <JogadorCard
            key={j.id}
            jogador={j}
            selecionado={selecionado?.id === j.id}
            onSelecionar={setSelecionado}
          />
        ))}
      </section>

      <div className="confirmacao">
        <p>
          {selecionado
            ? <>Seu voto vai para <strong>{selecionado.nome}</strong>.</>
            : 'Nenhum jogador selecionado.'}
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

      {suspenso && (
        <section className="demais">
          <h2>Suspenso</h2>
          <p className="demais-legenda">Não entrou em campo e não pode receber votos.</p>
          <div className="grade-elenco">
            <JogadorCard jogador={suspenso} />
          </div>
        </section>
      )}

      <section className="demais">
        <h2>Demais jogadores do elenco</h2>
        <p className="demais-legenda">Não foram indicados ao prêmio neste jogo.</p>
        <div className="grade-elenco">
          {elenco.map((j) => (
            <JogadorCard key={j.id} jogador={j} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Votacao;
