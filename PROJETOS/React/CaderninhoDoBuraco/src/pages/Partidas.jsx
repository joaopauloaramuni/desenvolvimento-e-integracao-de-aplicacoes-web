import { LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";
import Aviso, { AvisoSupabase } from "../components/Aviso/Aviso";
import EstadoVazio from "../components/EstadoVazio/EstadoVazio";
import JogadorAvatar from "../components/JogadorAvatar/JogadorAvatar";
import useJogadores from "../hooks/useJogadores";
import usePartidas from "../hooks/usePartidas";
import { dataLocal, formatMesAno, formatNumero, plural } from "../utils/format";
import "./Partidas.css";

const DIA_SEMANA = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });

/** Agrupa as partidas por mês ("2026-11"), mantendo a ordem (mais novas primeiro). */
function porMes(partidas) {
  const grupos = new Map();
  for (const p of partidas) {
    const mes = p.data.slice(0, 7);
    if (!grupos.has(mes)) grupos.set(mes, []);
    grupos.get(mes).push(p);
  }
  return [...grupos.entries()];
}

/** Página Partidas: os dias de jogo, mês a mês. */
function Partidas() {
  const { partidas, carregando, erro } = usePartidas();
  const { porId } = useJogadores();

  return (
    <div className="conteudo">
      <title>Partidas - Caderninho do Buraco</title>
      <AvisoSupabase />

      <header className="cabecalho-pagina">
        <div>
          <h1>Partidas</h1>
          <p>Cada dia de jogo, com as rodadas e quem ganhou mais vezes.</p>
        </div>
        <div className="cabecalho-pagina__acoes">
          <Link className="botao" to="/partidas/nova">
            <LuPlus aria-hidden="true" /> Nova partida
          </Link>
        </div>
      </header>

      {erro && <Aviso>Não foi possível carregar as partidas. {erro.message}</Aviso>}
      {carregando && <p className="carregando">Embaralhando...</p>}

      {!carregando && !erro && partidas.length === 0 && (
        <EstadoVazio
          titulo="Nenhuma partida anotada"
          acao={
            <Link className="botao" to="/partidas/nova">
              <LuPlus aria-hidden="true" /> Nova partida
            </Link>
          }
        >
          Crie a partida do dia, escolha quem está na mesa e lance as rodadas conforme forem acabando.
        </EstadoVazio>
      )}

      {porMes(partidas).map(([mes, lista]) => (
        <section key={mes} className="partidas-mes" aria-labelledby={`mes-${mes}`}>
          <h2 id={`mes-${mes}`}>{formatMesAno(mes)}</h2>
          <ul className="partidas-lista">
            {lista.map((p) => {
              const d = dataLocal(p.data);
              const vitorias = p.vitorias;
              const totais = p.totais;
              const ordem = [...p.jogadorIds].sort((a, b) => vitorias[b] - vitorias[a] || totais[b] - totais[a]);
              return (
                <li key={p.id}>
                  <Link to={`/partidas/${p.id}`} className="partida-item">
                    <span className="partida-item__dia" aria-hidden="true">
                      <b>{d.getDate()}</b>
                      <span>{DIA_SEMANA.format(d).replace(".", "")}</span>
                    </span>
                    <span className="partida-item__corpo">
                      <span className="partida-item__titulo">
                        {plural(p.rodadas.length, "rodada")}
                        {p.local && <span className="partida-item__local">{p.local}</span>}
                      </span>
                      <span className="partida-item__placar">
                        {ordem.map((id) => (
                          <span key={id} className="partida-item__jogador">
                            <JogadorAvatar jogador={porId.get(id)} tamanho="pequena" mostrarNome />
                            <span>
                              {plural(vitorias[id] ?? 0, "vitória")}, {formatNumero(totais[id] ?? 0)} pts
                            </span>
                          </span>
                        ))}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default Partidas;
