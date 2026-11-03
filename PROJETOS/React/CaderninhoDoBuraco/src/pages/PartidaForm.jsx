import { useEffect, useState } from "react";
import { LuCheck } from "react-icons/lu";
import { Link, useNavigate, useParams } from "react-router-dom";
import Aviso, { AvisoSupabase } from "../components/Aviso/Aviso";
import EstadoVazio from "../components/EstadoVazio/EstadoVazio";
import JogadorAvatar from "../components/JogadorAvatar/JogadorAvatar";
import { supabaseConfigurado } from "../config/supabaseClient";
import useJogadores from "../hooks/useJogadores";
import usePartida from "../hooks/usePartida";
import { atualizarPartida, criarPartida } from "../services/partidaService";
import { hojeIso } from "../utils/format";
import "./PartidaForm.css";

/**
 * Nova partida (/partidas/nova) e edição (/partidas/:id/editar):
 * a data do jogo, quem está na mesa, e opcionalmente o local.
 */
function PartidaForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();
  const { jogadores, carregando, erro: erroJogadores } = useJogadores();
  const { partida } = usePartida(editando ? id : null);

  const [form, setForm] = useState({ data: hojeIso(), local: "", observacao: "", jogadorIds: [] });
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  // Na edição, preenche com a partida carregada
  useEffect(() => {
    if (editando && partida) {
      setForm({
        data: partida.data,
        local: partida.local ?? "",
        observacao: partida.observacao ?? "",
        jogadorIds: partida.jogadorIds,
      });
    }
  }, [editando, partida]);

  const disponiveis = jogadores.filter((j) => j.ativo || form.jogadorIds.includes(j.id));

  const alternar = (jogadorId) =>
    setForm((f) => ({
      ...f,
      jogadorIds: f.jogadorIds.includes(jogadorId)
        ? f.jogadorIds.filter((x) => x !== jogadorId)
        : [...f.jogadorIds, jogadorId],
    }));

  const enviar = async (e) => {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      if (editando) {
        await atualizarPartida(id, form);
        navigate(`/partidas/${id}`, { state: { mensagem: "Partida atualizada." } });
      } else {
        const novoId = await criarPartida(form);
        navigate(`/partidas/${novoId}`, { state: { mensagem: "Partida criada. Agora é só lançar a primeira rodada." } });
      }
    } catch (err) {
      setErro(err.message);
      setSalvando(false);
    }
  };

  if (!carregando && supabaseConfigurado && jogadores.length < 2 && !erroJogadores) {
    return (
      <div className="conteudo">
        <EstadoVazio
          titulo="Faltam jogadores na mesa"
          acao={
            <Link className="botao" to="/jogadores">
              Cadastrar jogadores
            </Link>
          }
        >
          Para criar uma partida, cadastre pelo menos dois jogadores.
        </EstadoVazio>
      </div>
    );
  }

  return (
    <div className="conteudo conteudo--estreito">
      <title>{editando ? "Editar partida" : "Nova partida"} - Caderninho do Buraco</title>
      <AvisoSupabase />

      <header className="cabecalho-pagina">
        <div>
          <h1>{editando ? "Editar partida" : "Nova partida"}</h1>
          <p>Escolha o dia e quem está na mesa. As rodadas são lançadas depois, uma de cada vez.</p>
        </div>
      </header>

      <form className="painel partida-form" onSubmit={enviar}>
        {erroJogadores && <Aviso>Não foi possível carregar os jogadores. {erroJogadores.message}</Aviso>}

        <div className="partida-form__linha">
          <label className="campo">
            <span>Data do jogo</span>
            <input
              type="date"
              className="entrada"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              required
            />
          </label>
          <label className="campo">
            <span>Local (opcional)</span>
            <input
              className="entrada"
              value={form.local}
              maxLength={80}
              placeholder="Casa da vó"
              onChange={(e) => setForm({ ...form, local: e.target.value })}
            />
          </label>
        </div>

        <fieldset className="campo">
          <legend>Quem está na mesa</legend>
          <small>Toque para escolher. A ordem de escolha é a ordem das folhas na rodada.</small>
          <div className="partida-form__jogadores">
            {disponiveis.map((j) => {
              const posicao = form.jogadorIds.indexOf(j.id);
              return (
                <label key={j.id} className="partida-form__jogador">
                  <input type="checkbox" checked={posicao >= 0} onChange={() => alternar(j.id)} />
                  <JogadorAvatar jogador={j} mostrarNome />
                  {posicao >= 0 && <span className="partida-form__ordem">{posicao + 1}</span>}
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="campo">
          <span>Observação (opcional)</span>
          <textarea
            className="entrada"
            rows={2}
            maxLength={500}
            value={form.observacao}
            onChange={(e) => setForm({ ...form, observacao: e.target.value })}
            placeholder="Valendo a sobremesa"
          />
        </label>

        {erro && <Aviso>{erro}</Aviso>}

        <div className="partida-form__acoes">
          <button className="botao" disabled={salvando || form.jogadorIds.length < 2 || !supabaseConfigurado}>
            <LuCheck aria-hidden="true" /> {editando ? "Salvar partida" : "Criar partida"}
          </button>
          <Link className="botao botao--fantasma" to={editando ? `/partidas/${id}` : "/partidas"}>
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

export default PartidaForm;
