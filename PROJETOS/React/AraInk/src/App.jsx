import { useCallback, useRef, useState } from "react";
import Collection from "./components/Collection/Collection";
import ExampleGallery from "./components/ExampleGallery/ExampleGallery";
import PageLayout from "./components/PageLayout/PageLayout";
import ResultStage from "./components/ResultStage/ResultStage";
import TattooForm from "./components/TattooForm/TattooForm";
import { DEFAULT_SETTINGS } from "./config/tattooOptions";
import useCollection from "./hooks/useCollection";
import useTattooGenerator from "./hooks/useTattooGenerator";

function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const gerador = useTattooGenerator();
  const colecao = useCollection();
  const estudioRef = useRef(null);
  const ideiaRef = useRef(null);
  const bancadaRef = useRef(null);

  const mudar = useCallback((mudanca) => setSettings((atual) => ({ ...atual, ...mudanca })), []);

  const gerar = () => {
    gerador.gerar(settings);
    // No celular a bancada fica embaixo do formulário: rola até ela
    if (window.matchMedia("(max-width: 900px)").matches) {
      bancadaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const usarExemplo = (exemplo) => {
    const { ideia, estilo, linha, acabamento, detalhe, formato } = exemplo;
    mudar({ ideia, estilo, linha, acabamento, detalhe, formato });
    estudioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    ideiaRef.current?.focus({ preventScroll: true });
  };

  return (
    <PageLayout
      label="Estúdio de tatuagem com IA"
      description="Descreva uma ideia, escolha o estilo e o traço, e o AraInk desenha tatuagens inéditas com o GPT Image ou o Gemini. Ajuste, compare variações e guarde as melhores."
    >
      <div className="studio" ref={estudioRef}>
        <section className="studio-form" aria-labelledby="estudio-titulo">
          <h2 className="section-title" id="estudio-titulo">
            Estúdio
          </h2>
          <TattooForm
            settings={settings}
            onChange={mudar}
            onSubmit={gerar}
            onStop={gerador.parar}
            gerando={gerador.gerando}
            ideaRef={ideiaRef}
          />
        </section>

        <div className="studio-stage" ref={bancadaRef}>
          <ResultStage
            cards={gerador.cards}
            sessao={gerador.sessao}
            erro={gerador.erro}
            estaGuardado={colecao.estaGuardado}
            onGuardar={colecao.guardar}
            onRefinar={gerador.refinar}
            onDesfazer={gerador.desfazerAjuste}
            onLimpar={gerador.limpar}
          />
        </div>
      </div>

      <ExampleGallery onUsar={usarExemplo} />

      <Collection
        itens={colecao.itens}
        carregando={colecao.carregando}
        erro={colecao.erro}
        onRemover={colecao.remover}
      />
    </PageLayout>
  );
}

export default App;
