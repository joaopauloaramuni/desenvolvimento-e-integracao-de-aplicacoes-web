import { useEffect, useMemo, useState } from "react";
import { LuCheck, LuCrown } from "react-icons/lu";
import { Link, useNavigate, useParams } from "react-router-dom";
import Aviso, { AvisoSupabase } from "../components/Aviso/Aviso";
import EstadoVazio from "../components/EstadoVazio/EstadoVazio";
import JogadorAvatar from "../components/JogadorAvatar/JogadorAvatar";
import LegendaPontos from "../components/LegendaPontos/LegendaPontos";
import PontuacaoForm from "../components/PontuacaoForm/PontuacaoForm";
import { supabaseConfigurado } from "../config/supabaseClient";
import useJogadores from "../hooks/useJogadores";
import usePartida from "../hooks/usePartida";
import { contarRodada, formularioInicial, salvarRodada } from "../services/rodadaService";
import { formatData, formatNumero } from "../utils/format";
import "./RodadaEditor.css";

/**
 * Lançar (/partidas/:id/rodadas/nova) ou editar (/partidas/:id/rodadas/:rodadaId)
 * uma rodada: uma folha por jogador, com a conta feita enquanto digita.
 */
function RodadaEditor() {
  const { id: partidaId, rodadaId } = useParams();
  const navigate = useNavigate();
  const { partida, erro: erroPartida } = usePartida(partidaId);
  const { porId, carregando: carregandoJogadores } = useJogadores();
  const [formularios, setFormularios] = useState(null);
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const rodada = rodadaId ? partida?.rodadas.find((r) => r.id === rodadaId) : null;
  const numero = rodada ? rodada.numero : (partida?.rodadas.length ?? 0) + 1;
  const jogadores = useMemo(
    () => (partida ? partida.jogadorIds.map((id) => porId.get(id)).filter(Boolean) : []),
    [partida, porId]
  );

  // Monta os formulários quando a partida chega (em branco, ou com a rodada editada)
  useEffect(() => {
    if (!partida || formularios) return;
    const r = rodadaId ? partida.rodadas.find((x) => x.id === rodadaId) : null;
    setFormularios(Object.fromEntries(partida.jogadorIds.map((id) => [id, formularioInicial(r?.de(id))])));
  }, [partida, rodadaId, formularios]);

  const conta = useMemo(
    () => (formularios && jogadores.length ? contarRodada(jogadores.map((j) => j.id), formularios) : null),
    [formularios, jogadores]
  );

  const mudar = (jogadorId, patch) =>
    setFormularios((atual) => {
      const novo = { ...atual, [jogadorId]: { ...atual[jogadorId], ...patch } };
      // Só uma pessoa bate: marcar uma desmarca as outras
      if (patch.bateu) {
        for (const id of Object.keys(novo)) if (id !== jogadorId) novo[id] = { ...novo[id], bateu: false };
      }
      return novo;
    });

  const salvar = async (e) => {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await salvarRodada({ partidaId, rodadaId: rodada?.id ?? null, jogadores, formularios });
      navigate(`/partidas/${partidaId}`, { state: { mensagem: `Rodada ${numero} salva.` } });
    } catch (err) {
      setErro(err.message);
      setSalvando(false);
    }
  };

  if (erroPartida) {
    return (
      <div className="conteudo">
        <EstadoVazio titulo="Partida não encontrada" acao={<Link className="botao" to="/partidas">Ver as partidas</Link>}>
          {erroPartida.message}
        </EstadoVazio>
      </div>
    );
  }

  if (partida && rodadaId && !rodada) {
    return (
      <div className="conteudo">
        <EstadoVazio titulo="Rodada não encontrada" acao={<Link className="botao" to={`/partidas/${partidaId}`}>Voltar à partida</Link>}>
          Ela pode ter sido excluída.
        </EstadoVazio>
      </div>
    );
  }

  if (!partida || !formularios || carregandoJogadores || !conta) {
    return (
      <div className="conteudo">
        <AvisoSupabase />
        <p className="carregando">Embaralhando...</p>
      </div>
    );
  }

  const temErro = jogadores.some((j) => conta.contagens[j.id].erros.length > 0);

  return (
    <form className="conteudo rodada-editor" onSubmit={salvar}>
      <title>{`Rodada ${numero} - Caderninho do Buraco`}</title>

      <header className="cabecalho-pagina">
        <div>
          <h1>
            {rodada ? "Editar" : "Lançar"} rodada {numero}
          </h1>
          <p>
            Partida de {formatData(partida.data)}. Digite os jogos que cada um baixou e as cartas que sobraram na mão:
            a conta sai sozinha, e ganha a rodada quem fizer mais pontos.
          </p>
        </div>
      </header>

      <details className="painel rodada-editor__ajuda">
        <summary>Quanto vale cada coisa</summary>
        <div className="folha rodada-editor__legenda">
          <LegendaPontos compacta />
        </div>
      </details>

      <div className="rodada-editor__folhas">
        {jogadores.map((j) => (
          <PontuacaoForm
            key={j.id}
            jogador={j}
            formulario={formularios[j.id]}
            contagem={conta.contagens[j.id]}
            lider={conta.vencedores.has(j.id) && conta.contagens[j.id].total > 0}
            onChange={(patch) => mudar(j.id, patch)}
          />
        ))}
      </div>

      {/* Barra fixa embaixo: o placar da rodada e o botão de salvar */}
      <div className="rodada-editor__barra">
        <ol className="rodada-editor__placar" aria-label="Placar da rodada">
          {[...jogadores]
            .sort((a, b) => conta.contagens[b.id].total - conta.contagens[a.id].total)
            .map((j) => (
              <li key={j.id}>
                <JogadorAvatar jogador={j} tamanho="pequena" />
                <span className="rodada-editor__nome">{j.nome}</span>
                <b>{formatNumero(conta.contagens[j.id].total)}</b>
                {conta.vencedores.has(j.id) && conta.contagens[j.id].total > 0 && (
                  <LuCrown className="rodada-editor__coroa" aria-label="ganhando" />
                )}
              </li>
            ))}
        </ol>
        <div className="rodada-editor__acoes">
          {erro && <Aviso>{erro}</Aviso>}
          <Link className="botao botao--fantasma rodada-editor__cancelar" to={`/partidas/${partidaId}`}>
            Cancelar
          </Link>
          <button className="botao" disabled={salvando || temErro || !supabaseConfigurado}>
            <LuCheck aria-hidden="true" /> Salvar<span className="rodada-editor__so-largo"> rodada {numero}</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default RodadaEditor;
