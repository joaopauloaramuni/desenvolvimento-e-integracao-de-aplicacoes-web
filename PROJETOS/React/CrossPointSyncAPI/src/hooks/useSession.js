import { useCallback, useState } from "react";
import { autenticar, criarSessao } from "../services/crosspointService";
import { getSavedSession, saveSession } from "../utils/storage";

/**
 * Login no crosspoint-sync.
 * - a senha vira MD5 na hora (é o que o protocolo KOSync usa) e é descartada;
 * - com "Lembrar neste navegador", a sessão vai para o localStorage;
 * - modo demonstração: { demo: true }, sem servidor nenhum.
 */
export default function useSession() {
  const [sessao, setSessao] = useState(getSavedSession);
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState(null);

  const entrar = useCallback(async ({ servidor, usuario, senha, lembrar }) => {
    setEntrando(true);
    setErro(null);
    try {
      const nova = criarSessao({ servidor, usuario, senha });
      await autenticar(nova);
      saveSession(lembrar ? nova : null);
      setSessao(nova);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEntrando(false);
    }
  }, []);

  const entrarDemo = useCallback(() => {
    setErro(null);
    setSessao({ demo: true, user: "demonstração", server: "dados de exemplo" });
  }, []);

  const sair = useCallback(() => {
    saveSession(null);
    setSessao(null);
  }, []);

  return { sessao, entrando, erro, entrar, entrarDemo, sair };
}
