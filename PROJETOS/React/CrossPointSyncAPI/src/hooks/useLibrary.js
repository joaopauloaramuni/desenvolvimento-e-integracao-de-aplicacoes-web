import { useCallback, useEffect, useState } from "react";
import { DEMO_ACTIVITY, DEMO_DEVICES, DEMO_ITEMS } from "../data/demoLibrary";
import { buscarAtividade, listarAparelhos, listarLivros } from "../services/crosspointService";

/**
 * Carrega a estante (GET /api/v1/progress) e as estatísticas (GET /api/v1/stats/activity).
 * As estatísticas são opcionais: se falharem, a estante aparece mesmo assim.
 */
export default function useLibrary(sessao) {
  const [livros, setLivros] = useState([]);
  const [atividade, setAtividade] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [atualizadoEm, setAtualizadoEm] = useState(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    if (!sessao) return undefined;
    const controle = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        if (sessao.demo) {
          await new Promise((r) => setTimeout(r, 350)); // só para ver o carregamento
          setLivros(DEMO_ITEMS);
          setAtividade(DEMO_ACTIVITY);
        } else {
          const opcoes = { signal: controle.signal };
          const [itens, stats] = await Promise.all([
            listarLivros(sessao, opcoes),
            buscarAtividade(sessao, opcoes).catch(() => null),
          ]);
          setLivros(itens);
          setAtividade(stats);
        }
        setAtualizadoEm(new Date());
      } catch (e) {
        if (!controle.signal.aborted) setErro(e.message);
      } finally {
        if (!controle.signal.aborted) setCarregando(false);
      }
    }

    carregar();
    return () => controle.abort();
  }, [sessao, versao]);

  const atualizar = useCallback(() => setVersao((v) => v + 1), []);

  /** Posição salva por cada aparelho (para o painel de detalhes). */
  const aparelhosDe = useCallback(
    (documento, opcoes) =>
      sessao?.demo
        ? Promise.resolve(DEMO_DEVICES[documento] ?? [])
        : listarAparelhos(sessao, documento, opcoes),
    [sessao]
  );

  return { livros, atividade, carregando, erro, atualizadoEm, atualizar, aparelhosDe };
}
