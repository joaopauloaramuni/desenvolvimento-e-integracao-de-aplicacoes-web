import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  obterVotos,
  calcularResultado,
  desfazerUltimoVoto,
  zerarVotos,
} from '../services/votacaoService';

function formatarPercentual(valor) {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
}

function Resultado() {
  const [votos, setVotos] = useState(() => obterVotos());

  // Valores derivados do estado: recalculados a cada renderização
  const total = votos.length;
  const resultado = calcularResultado(votos);
  const ultimo = resultado.length - 1;
  const eliminado = resultado[ultimo];
  const penultimo = resultado[ultimo - 1];
  const diferenca = penultimo.votos - eliminado.votos;

  function classeDoItem(indice) {
    if (indice === ultimo) return 'placar-item placar-eliminado';
    if (indice === 0) return 'placar-item placar-salvo';
    return 'placar-item';
  }

  function handleDesfazer() {
    setVotos(desfazerUltimoVoto());
  }

  function handleZerar() {
    if (window.confirm('Apagar todos os votos e reiniciar a votação?')) {
      zerarVotos();
      setVotos([]);
    }
  }

  return (
    <main className="pagina">
      <header className="pagina-cabecalho">
        <h1>Parcial: voto para ficar</h1>
        <p className="total-votos">
          <strong>{total.toLocaleString('pt-BR')}</strong> {total === 1 ? 'voto computado' : 'votos computados'}
        </p>
      </header>

      {total === 0 ? (
        <div className="vazio">
          <p>Nenhum voto ainda. Escolha quem você quer salvar para ver a parcial.</p>
          <Link to="/votacao" className="botao botao-principal">Ir para a votação</Link>
        </div>
      ) : (
        <>
          <p className="zona-eliminacao">
            {diferenca === 0
              ? `Empate na zona de eliminação entre ${penultimo.nome} e ${eliminado.nome}!`
              : `${eliminado.nome} precisa de ${diferenca} ${diferenca === 1 ? 'voto' : 'votos'} para escapar.`}
          </p>

          <ol className="placar">
            {resultado.map((p, indice) => (
              <li key={p.id} className={classeDoItem(indice)}>
                <span className="placar-posicao">{indice + 1}º</span>
                <img src={p.foto} alt={p.nome} className="placar-foto" />
                <div className="placar-info">
                  <div className="placar-linha">
                    <span className="placar-nome">{p.nome}</span>
                    {indice === 0 && <span className="selo-placar selo-salvo">Mais salvo</span>}
                    {indice === ultimo && <span className="selo-placar selo-eliminado">Sairia hoje</span>}
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

          <div className="resultado-acoes">
            <button type="button" className="botao botao-desfazer" onClick={handleDesfazer}>
              Desfazer último voto
            </button>
            <button type="button" className="botao botao-zerar" onClick={handleZerar}>
              Zerar votação
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default Resultado;
