import { useCallback, useEffect, useRef, useState } from "react";
import { FORMATS, findById } from "../config/tattooOptions";
import { ERROS_GERAIS, ImageError } from "../services/imageErrors";
import { PROVIDER, editar, gerar as gerarImagem } from "../services/imageService";
import { buildRefinePrompt, buildTattooPrompt, withVariation } from "../services/promptBuilder";
import { novoId } from "../utils/download";

/**
 * Estado da "bancada": as variações geradas, os ajustes e os erros.
 *
 * Cada cartão (card):
 *   { id, numero, status: "loading" | "done" | "error", naFila, erro,
 *     versoes: [{ id, src, prompt }], refinando, erroAjuste }
 *
 * src é um data URL (PNG em base64). A versão exibida é sempre a última;
 * "Desfazer ajuste" remove a última versão.
 */
export default function useTattooGenerator() {
  const [cards, setCards] = useState([]);
  const [sessao, setSessao] = useState(null); // { settings, prompt, provedor, criadoEm }
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState("");
  const controllerRef = useRef(null);

  // Cancela as chamadas pendentes se o componente sair da tela
  useEffect(() => () => controllerRef.current?.abort(), []);

  const atualizarCard = useCallback((id, mudanca) => {
    setCards((atual) =>
      atual.map((card) =>
        card.id === id ? { ...card, ...(typeof mudanca === "function" ? mudanca(card) : mudanca) } : card
      )
    );
  }, []);

  /**
   * Gera N variações, no máximo PROVIDER.simultaneos ao mesmo tempo
   * (contas novas da OpenAI têm limite baixo de imagens por minuto).
   */
  const gerar = useCallback(
    async (settings) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      const prompt = buildTattooPrompt(settings);
      const formato = findById(FORMATS, settings.formato);
      const total = settings.variacoes;

      const novos = Array.from({ length: total }, (_, indice) => ({
        id: novoId(),
        numero: indice + 1,
        status: "loading",
        naFila: indice >= PROVIDER.simultaneos,
        erro: "",
        versoes: [],
        refinando: false,
        erroAjuste: "",
      }));

      setErro("");
      setSessao({ settings: { ...settings }, prompt, provedor: PROVIDER.id, criadoEm: Date.now() });
      setCards(novos);
      setGerando(true);

      const fila = [...novos];
      let pararTudo = false;

      const trabalhar = async () => {
        while (fila.length && !controller.signal.aborted && !pararTudo) {
          const card = fila.shift();
          atualizarCard(card.id, { naFila: false });
          const promptVariacao = withVariation(prompt, card.numero, total);
          try {
            const src = await gerarImagem({ prompt: promptVariacao, formato, signal: controller.signal });
            atualizarCard(card.id, { status: "done", versoes: [{ id: novoId(), src, prompt: promptVariacao }] });
          } catch (error) {
            if (error?.name === "AbortError") return;
            atualizarCard(card.id, { status: "error", erro: error.message });
            // Sem chave, chave errada, sem crédito...: as outras vão falhar igual
            if (error instanceof ImageError && ERROS_GERAIS.includes(error.code)) {
              pararTudo = true;
              setErro(error.message);
            }
          }
        }
      };

      await Promise.allSettled(Array.from({ length: Math.min(PROVIDER.simultaneos, total) }, trabalhar));

      if (pararTudo) {
        // Tira os cartões que nem chegaram a ser pedidos
        setCards((atual) => atual.filter((card) => card.status !== "loading"));
      }

      if (controllerRef.current === controller) {
        setGerando(false);
        controllerRef.current = null;
      }
    },
    [atualizarCard]
  );

  /** Botão "Parar": cancela o que ainda está desenhando. */
  const parar = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setGerando(false);
    setCards((atual) => atual.filter((card) => card.status !== "loading"));
  }, []);

  /** Ajusta uma variação: manda a imagem atual + o pedido (os dois provedores editam de verdade). */
  const refinar = useCallback(
    async (cardId, instrucao) => {
      const card = cards.find((item) => item.id === cardId);
      const versao = card?.versoes.at(-1);
      if (!versao || card.refinando || !sessao) return false;

      atualizarCard(cardId, { refinando: true, erroAjuste: "" });
      const prompt = buildRefinePrompt(instrucao);
      try {
        const src = await editar({
          src: versao.src,
          prompt,
          formato: findById(FORMATS, sessao.settings.formato),
        });
        atualizarCard(cardId, (atual) => ({
          refinando: false,
          versoes: [...atual.versoes, { id: novoId(), src, prompt, ajuste: instrucao }],
        }));
        return true;
      } catch (error) {
        atualizarCard(cardId, { refinando: false, erroAjuste: error.message });
        return false;
      }
    },
    [cards, sessao, atualizarCard]
  );

  const desfazerAjuste = useCallback(
    (cardId) =>
      atualizarCard(cardId, (atual) => ({
        versoes: atual.versoes.length > 1 ? atual.versoes.slice(0, -1) : atual.versoes,
        erroAjuste: "",
      })),
    [atualizarCard]
  );

  const limpar = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setGerando(false);
    setCards([]);
    setSessao(null);
    setErro("");
  }, []);

  return { cards, sessao, gerando, erro, gerar, parar, refinar, desfazerAjuste, limpar };
}
