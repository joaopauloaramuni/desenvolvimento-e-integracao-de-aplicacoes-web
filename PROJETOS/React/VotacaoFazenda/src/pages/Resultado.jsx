import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  obterVotos,
  calcularResultado,
  calcularTotalVotos,
  zerarVotos,
} from '../services/votacaoService';

function formatarPercentual(valor) {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
}

function Resultado() {
  const [votos, setVotos] = useState(() => obterVotos());

  const total = calcularTotalVotos(votos);
  const resultado = calcularResultado(votos);

  function handleZerar() {
    if (window.confirm('Apagar todos os votos e reiniciar a votação?')) {
      zerarVotos();
      setVotos({});
    }
  }

  return (
    <main className="pagina">
      <header className="pagina-cabecalho">
        <h1>Parcial da eliminação</h1>
        <p className="total-votos">
          <strong>{total.toLocaleString('pt-BR')}</strong> {total === 1 ? 'voto computado' : 'votos computados'}
        </p>
      </header>

      {total === 0 ? (
        <div className="vazio">
          <p>Nenhum voto ainda. Escolha quem sai da roça para ver a parcial.</p>
          <Link to="/votacao" className="botao botao-principal">Ir para a votação</Link>
        </div>
      ) : (
        <ol className="placar">
          {resultado.map((p, indice) => (
            <li key={p.id} className={indice === 0 ? 'placar-item placar-lider' : 'placar-item'}>
              <img src={p.foto} alt={p.nome} className="placar-foto" />
              <div className="placar-info">
                <div className="placar-linha">
                  <span className="placar-nome">{p.nome}</span>
                  {indice === 0 && <span className="selo-lider">Sairia hoje</span>}
                </div>
                <div className="barra">
                  <div className="barra-preenchida" style={{ width: `${p.percentual}%` }} />
                </div>
                <span className="placar-numeros">
                  {formatarPercentual(p.percentual)} ({p.votos} {p.votos === 1 ? 'voto' : 'votos'})
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}

      {total > 0 && (
        <button type="button" className="botao botao-zerar" onClick={handleZerar}>
          Zerar votação
        </button>
      )}
    </main>
  );
}

export default Resultado;
