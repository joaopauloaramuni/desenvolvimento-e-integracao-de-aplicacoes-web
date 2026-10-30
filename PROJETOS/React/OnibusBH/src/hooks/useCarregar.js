import { useEffect, useState } from "react";

/**
 * Executa uma função assíncrona quando a "chave" muda e guarda o resultado.
 * const { dados, erro, carregando } = useCarregar(() => carregarLinha(id), id);
 */
export default function useCarregar(funcao, chave) {
  const [estado, setEstado] = useState({ chave: undefined, dados: null, erro: null });

  useEffect(() => {
    let ativo = true;
    funcao()
      .then((dados) => ativo && setEstado({ chave, dados, erro: null }))
      .catch((erro) => ativo && setEstado({ chave, dados: null, erro }));
    return () => {
      ativo = false;
    };
    // A função muda a cada render; quem decide quando recarregar é a chave
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  const atual = estado.chave === chave;
  return { dados: atual ? estado.dados : null, erro: atual ? estado.erro : null, carregando: !atual };
}
