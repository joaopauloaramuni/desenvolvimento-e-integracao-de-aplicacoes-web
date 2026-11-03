import { useCallback, useMemo } from "react";
import {
  atualizarJogador,
  cadastrarJogador,
  excluirJogador,
  listarJogadores,
} from "../services/jogadorService";
import useCarregar from "./useCarregar";

/**
 * Os jogadores cadastrados, com cadastrar / atualizar / excluir que já
 * atualizam a lista na tela (sem buscar tudo de novo).
 */
export default function useJogadores() {
  const { dados: jogadores, carregando, erro, recarregar, setDados } = useCarregar(listarJogadores, []);

  const porId = useMemo(() => new Map(jogadores.map((j) => [j.id, j])), [jogadores]);
  const ordenar = (lista) => [...lista].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  const cadastrar = useCallback(
    async (dados) => {
      const novo = await cadastrarJogador(dados);
      setDados((lista) => ordenar([...lista, novo]));
      return novo;
    },
    [setDados]
  );

  const atualizar = useCallback(
    async (id, dados) => {
      const atualizado = await atualizarJogador(id, dados);
      setDados((lista) => ordenar(lista.map((j) => (j.id === id ? atualizado : j))));
      return atualizado;
    },
    [setDados]
  );

  const excluir = useCallback(
    async (jogador) => {
      await excluirJogador(jogador);
      setDados((lista) => lista.filter((j) => j.id !== jogador.id));
    },
    [setDados]
  );

  return { jogadores, porId, carregando, erro, recarregar, cadastrar, atualizar, excluir };
}
