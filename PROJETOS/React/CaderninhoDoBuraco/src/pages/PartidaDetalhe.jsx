import { useState } from "react";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Aviso, { AvisoSupabase } from "../components/Aviso/Aviso";
import EstadoVazio from "../components/EstadoVazio/EstadoVazio";
import JogadorAvatar from "../components/JogadorAvatar/JogadorAvatar";
import RodadaFolha from "../components/RodadaFolha/RodadaFolha";
import { NaoEncontradoException } from "../core/exceptions";
import useJogadores from "../hooks/useJogadores";
import usePartida from "../hooks/usePartida";
import { excluirPartida } from "../services/partidaService";
import { excluirRodada } from "../services/rodadaService";
import { formatData, formatDataExtensa, formatNumero, plural } from "../utils/format";
import "./PartidaDetalhe.css";

/**
 * Uma partida: o placar do dia e as rodadas, como folhas do caderninho.
 */
function PartidaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { partida, carregando, erro, recarregar } = usePartida(id);
  const { porId } = useJogadores();
  const [mensagem, setMensagem] = useState(location.state?.mensagem ?? null);
  const [erroAcao, setErroAcao] = useState(null);
  const [excluindo, setExcluindo] = useState(null);

  if (erro instanceof NaoEncontradoException) {
    return (
      <div className="conteudo">
        <EstadoVazio titulo="Partida não encontrada" acao={<Link className="botao" to="/partidas">Ver as partidas</Link>}>
          {erro.message}
        </EstadoVazio>
      </div>
    );
  }

  if (!partida) {
    return (
      <div className="conteudo">
        <AvisoSupabase />
        {erro && <Aviso>Não foi possível carregar a partida. {erro.message}</Aviso>}
        {carregando && <p className="carregando">Embaralhando...</p>}
      </div>
    );
  }

  const totais = partida.totais;
  const vitorias = partida.vitorias;
  const placar = [...partida.jogadorIds].sort((a, b) => vitorias[b] - vitorias[a] || totais[b] - totais[a]);
  const proxima = partida.rodadas.length + 1;

  const apagarRodada = async (rodada) => {
    if (!window.confirm(`Excluir a rodada ${rodada.numero}? As rodadas seguintes são renumeradas.`)) return;
    setExcluindo(rodada.id);
    setErroAcao(null);
    try {
      await excluirRodada(rodada.id);
      setMensagem(`Rodada ${rodada.numero} excluída.`);
      await recarregar();
    } catch (e) {
      setErroAcao(`Não foi possível excluir a rodada. ${e.message}`);
    } finally {
      setExcluindo(null);
    }
  };

  const apagarPartida = async () => {
    const aviso = partida.rodadas.length
      ? `Excluir a partida de ${formatData(partida.data)} e as ${partida.rodadas.length} rodadas dela?`
      : `Excluir a partida de ${formatData(partida.data)}?`;
    if (!window.confirm(aviso)) return;
    try {
      await excluirPartida(partida.id);
      navigate("/partidas", { replace: true });
    } catch (e) {
      setErroAcao(`Não foi possível excluir a partida. ${e.message}`);
    }
  };

  return (
    <div className="conteudo">
      <title>{`Partida de ${formatData(partida.data)} - Caderninho do Buraco`}</title>

      <header className="cabecalho-pagina">
        <div>
          <h1 className="partida__titulo">{formatDataExtensa(partida.data)}</h1>
          <p>
            {plural(partida.rodadas.length, "rodada")}
            {partida.local && <>, em {partida.local}</>}
            {partida.observacao && <>. {partida.observacao}</>}
          </p>
        </div>
        <div className="cabecalho-pagina__acoes">
          <Link className="botao" to={`/partidas/${partida.id}/rodadas/nova`}>
            <LuPlus aria-hidden="true" /> Lançar rodada {proxima}
          </Link>
          <Link className="botao botao--fantasma" to={`/partidas/${partida.id}/editar`}>
            <LuPencil aria-hidden="true" /> Editar
          </Link>
          <button type="button" className="botao botao--perigo botao--icone" onClick={apagarPartida} aria-label="Excluir a partida">
            <LuTrash2 aria-hidden="true" />
          </button>
        </div>
      </header>

      {mensagem && <Aviso tipo="sucesso">{mensagem}</Aviso>}
      {erroAcao && <Aviso>{erroAcao}</Aviso>}

      <section className="painel placar-dia" aria-label="Placar do dia">
        {placar.map((jid, i) => (
          <div key={jid} className={`placar-dia__jogador${i === 0 && vitorias[jid] > 0 ? " placar-dia__jogador--lider" : ""}`}>
            <JogadorAvatar jogador={porId.get(jid)} tamanho="grande" />
            <div>
              <span className="placar-dia__nome">{porId.get(jid)?.nome ?? "..."}</span>
              <span className="placar-dia__numeros">
                <b>{vitorias[jid]}</b> {vitorias[jid] === 1 ? "vitória" : "vitórias"}
                <span>{formatNumero(totais[jid])} pontos no dia</span>
              </span>
            </div>
          </div>
        ))}
      </section>

      {partida.rodadas.length === 0 ? (
        <EstadoVazio
          titulo="Nenhuma rodada ainda"
          acao={
            <Link className="botao" to={`/partidas/${partida.id}/rodadas/nova`}>
              <LuPlus aria-hidden="true" /> Lançar rodada 1
            </Link>
          }
        >
          Quando alguém bater, lance a rodada: digite os jogos de cada um e a conta sai sozinha.
        </EstadoVazio>
      ) : (
        <div className="partida__rodadas">
          {partida.rodadas.map((r) => (
            <RodadaFolha
              key={r.id}
              rodada={r}
              partidaId={partida.id}
              jogadoresPorId={porId}
              onExcluir={apagarRodada}
              excluindo={excluindo === r.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PartidaDetalhe;
