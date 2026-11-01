import { useCallback, useEffect, useState } from "react";
import { listarColecao, removerDaColecao, salvarNaColecao } from "../utils/imageDb";

/**
 * Coleção de tatuagens guardadas neste navegador (IndexedDB).
 * Devolve { itens, carregando, erro, guardar, remover, estaGuardado }.
 */
export default function useCollection() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    listarColecao()
      .then((lista) => ativo && setItens(lista))
      .catch(() => ativo && setErro("Não deu para abrir a coleção neste navegador."))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  const guardar = useCallback(async (item) => {
    try {
      await salvarNaColecao(item);
      setItens((atual) => [item, ...atual.filter((outro) => outro.id !== item.id)]);
      setErro("");
      return true;
    } catch {
      setErro("Não deu para guardar a imagem. O armazenamento do navegador pode estar cheio.");
      return false;
    }
  }, []);

  const remover = useCallback(async (id) => {
    try {
      await removerDaColecao(id);
      setItens((atual) => atual.filter((item) => item.id !== id));
    } catch {
      setErro("Não deu para excluir a imagem.");
    }
  }, []);

  const estaGuardado = useCallback((id) => itens.some((item) => item.id === id), [itens]);

  return { itens, carregando, erro, guardar, remover, estaGuardado };
}
