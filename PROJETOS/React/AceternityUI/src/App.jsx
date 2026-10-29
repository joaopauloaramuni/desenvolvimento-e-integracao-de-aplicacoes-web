import { useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import { TbSparkles } from "react-icons/tb";
import PageLayout from "./components/PageLayout/PageLayout";
import ComponentPicker from "./components/ComponentPicker/ComponentPicker";
import ComponentDetails from "./components/ComponentDetails/ComponentDetails";
import COMPONENTS from "./data/components";

// Lê o componente do endereço (ex.: http://localhost:5173/#card-3d)
const componentFromHash = () => {
  const id = window.location.hash.slice(1);
  return COMPONENTS.some((component) => component.id === id) ? id : COMPONENTS[0].id;
};

function App() {
  const [componentId, setComponentId] = useState(componentFromHash);

  const component = COMPONENTS.find(({ id }) => id === componentId);

  // Mantém o #componente no endereço, para poder compartilhar o link
  useEffect(() => {
    window.history.replaceState(null, "", `#${componentId}`);
  }, [componentId]);

  // Se o usuário trocar o # na barra de endereço, troca o componente
  useEffect(() => {
    const onHash = () => setComponentId(componentFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    // reducedMotion="user": quem pediu "menos movimento" no sistema vê as animações do Motion desligadas
    <MotionConfig reducedMotion="user">
      <PageLayout
        icon={TbSparkles}
        brand="Aceternity UI"
        title="Componentes animados para o seu portfólio"
        description="Oito componentes da Aceternity UI prontos para copiar, feitos com Tailwind CSS e Motion. Escolha um, teste na demonstração e leve o código para o seu projeto."
      >
        <ComponentPicker items={COMPONENTS} value={componentId} onChange={setComponentId} />
        {/* key: trocar de componente = desmonta o antigo e monta o novo do zero */}
        <ComponentDetails key={component.id} component={component} />
      </PageLayout>
    </MotionConfig>
  );
}

export default App;
