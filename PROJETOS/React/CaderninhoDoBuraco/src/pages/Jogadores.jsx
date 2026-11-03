import { useState } from "react";
import { LuCheck, LuPencil, LuTrash2, LuUserPlus, LuX } from "react-icons/lu";
import Aviso, { AvisoSupabase } from "../components/Aviso/Aviso";
import EstadoVazio from "../components/EstadoVazio/EstadoVazio";
import JogadorAvatar from "../components/JogadorAvatar/JogadorAvatar";
import { imagemDaCarta } from "../components/JogadorAvatar/imagens";
import APP_CONFIG from "../config/appConfig";
import { supabaseConfigurado } from "../config/supabaseClient";
import useJogadores from "../hooks/useJogadores";
import { proximaCarta, proximaCor } from "../services/jogadorService";
import "./Jogadores.css";

/** Escolha da figura e da cor (usada no cadastro e na edição). */
function EscolhaVisual({ carta, cor, onChange, prefixo }) {
  return (
    <>
      <fieldset className="campo">
        <legend>Figura</legend>
        <div className="escolha-figura">
          {APP_CONFIG.CARTAS_AVATAR.map((c) => (
            <label key={c.id} className="escolha-figura__opcao" title={c.nome}>
              <input
                type="radio"
                name={`${prefixo}-carta`}
                value={c.id}
                checked={carta === c.id}
                onChange={() => onChange({ carta: c.id })}
              />
              <img src={imagemDaCarta(c.id)} alt={c.nome} />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="campo">
        <legend>Cor nos gráficos</legend>
        <div className="escolha-cor">
          {APP_CONFIG.CORES_JOGADOR.map((c) => (
            <label key={c} className="escolha-cor__opcao" style={{ "--cor": c }}>
              <input
                type="radio"
                name={`${prefixo}-cor`}
                value={c}
                checked={cor === c}
                onChange={() => onChange({ cor: c })}
              />
              <span className="visualmente-oculto">{c}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

/** Uma linha da lista, que vira formulário ao clicar em Editar. */
function LinhaJogador({ jogador, onAtualizar, onExcluir }) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(null);
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const abrir = () => {
    setForm({ nome: jogador.nome, carta: jogador.carta, cor: jogador.cor });
    setErro(null);
    setEditando(true);
  };

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await onAtualizar(jogador.id, { ...form, ativo: jogador.ativo });
      setEditando(false);
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const alternarAtivo = async () => {
    setErro(null);
    try {
      await onAtualizar(jogador.id, { carta: jogador.carta, cor: jogador.cor, ativo: !jogador.ativo });
    } catch (err) {
      setErro(err.message);
    }
  };

  const excluir = async () => {
    if (!window.confirm(`Excluir ${jogador.nome}? Isso não pode ser desfeito.`)) return;
    setErro(null);
    try {
      await onExcluir(jogador);
    } catch (err) {
      setErro(err.message);
    }
  };

  if (editando) {
    return (
      <li className="jogador jogador--editando">
        <form onSubmit={salvar} className="jogador__form">
          <label className="campo">
            <span>Nome</span>
            <input
              className="entrada"
              value={form.nome}
              maxLength={40}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              autoFocus
            />
          </label>
          <EscolhaVisual carta={form.carta} cor={form.cor} prefixo={jogador.id} onChange={(m) => setForm({ ...form, ...m })} />
          {erro && <Aviso>{erro}</Aviso>}
          <div className="jogador__acoes">
            <button className="botao" disabled={salvando}>
              <LuCheck aria-hidden="true" /> Salvar
            </button>
            <button type="button" className="botao botao--tinta" onClick={() => setEditando(false)}>
              <LuX aria-hidden="true" /> Cancelar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`jogador${jogador.ativo ? "" : " jogador--inativo"}`}>
      <JogadorAvatar jogador={jogador} tamanho="grande" />
      <div className="jogador__dados">
        <span className="manuscrito jogador__nome">{jogador.nome}</span>
        {!jogador.ativo && <small>Desativado: não aparece nas partidas novas.</small>}
        {erro && <small className="jogador__erro">{erro}</small>}
      </div>
      <div className="jogador__acoes">
        <button type="button" className="botao botao--tinta botao--pequeno" onClick={abrir}>
          <LuPencil aria-hidden="true" /> Editar
        </button>
        <button type="button" className="botao botao--tinta botao--pequeno" onClick={alternarAtivo}>
          {jogador.ativo ? "Desativar" : "Ativar"}
        </button>
        <button type="button" className="botao botao--perigo botao--icone" onClick={excluir} aria-label={`Excluir ${jogador.nome}`}>
          <LuTrash2 aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

/** Página Jogadores: cadastrar, editar, desativar e excluir. */
function Jogadores() {
  const { jogadores, carregando, erro, cadastrar, atualizar, excluir } = useJogadores();
  const [form, setForm] = useState({ nome: "", carta: null, cor: null });
  const [mensagem, setMensagem] = useState(null);
  const [salvando, setSalvando] = useState(false);

  // Enquanto a pessoa não escolhe, sugere uma figura e uma cor que ninguém usa
  const carta = form.carta ?? proximaCarta(jogadores);
  const cor = form.cor ?? proximaCor(jogadores);

  const enviar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem(null);
    try {
      const novo = await cadastrar({ nome: form.nome, carta, cor });
      setMensagem({ tipo: "sucesso", texto: `${novo.nome} entrou na mesa.` });
      setForm({ nome: "", carta: null, cor: null });
    } catch (err) {
      setMensagem({ tipo: "erro", texto: err.message });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="conteudo">
      <title>Jogadores - Caderninho do Buraco</title>
      <AvisoSupabase />

      <header className="cabecalho-pagina">
        <div>
          <h1>Jogadores</h1>
          <p>Quem senta na mesa. Cada um escolhe uma figura e uma cor, que aparecem no placar e nos gráficos.</p>
        </div>
      </header>

      <div className="jogadores">
        <form className="painel jogadores__novo" onSubmit={enviar}>
          <h2>Novo jogador</h2>
          <label className="campo">
            <span>Nome</span>
            <input
              className="entrada"
              value={form.nome}
              maxLength={40}
              placeholder="Mariana"
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </label>
          <EscolhaVisual carta={carta} cor={cor} prefixo="novo" onChange={(m) => setForm({ ...form, ...m })} />
          {mensagem && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}
          <button className="botao" disabled={salvando || !supabaseConfigurado}>
            <LuUserPlus aria-hidden="true" /> Cadastrar jogador
          </button>
        </form>

        <section className="jogadores__lista" aria-label="Jogadores cadastrados">
          {erro && <Aviso>Não foi possível carregar os jogadores. {erro.message}</Aviso>}
          {carregando && <p className="carregando">Embaralhando...</p>}
          {!carregando && jogadores.length === 0 && !erro && (
            <EstadoVazio titulo="Mesa vazia">Cadastre quem joga com vocês. Com dois jogadores já dá para começar.</EstadoVazio>
          )}
          {jogadores.length > 0 && (
            <ul className="folha jogadores__folha">
              {jogadores.map((j) => (
                <LinhaJogador key={j.id} jogador={j} onAtualizar={atualizar} onExcluir={excluir} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default Jogadores;
