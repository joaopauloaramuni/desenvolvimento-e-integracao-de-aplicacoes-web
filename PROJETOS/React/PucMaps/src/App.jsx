import { lazy, Suspense } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import PageLayout from "./components/PageLayout/PageLayout";

// lazy(): o maplibre-gl (~800 KB) só é baixado quando o mapa aparece na tela
const MapExplorer = lazy(() => import("./components/MapExplorer/MapExplorer"));

const ORIGINAL_REPO = "https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti5-6904100-pucmaps";

function App() {
  return (
    <PageLayout
      icon={FaMapLocationDot}
      brand="PUCMaps"
      title="Mapa do Campus Coração Eucarístico"
      description="Prédios, cantinas, portarias e estacionamentos do campus, com o grafo de caminhos a pé e rotas calculadas no navegador com o algoritmo de Dijkstra."
    >
      <Suspense fallback={<p className="map-fallback">Carregando mapa...</p>}>
        <MapExplorer />
      </Suspense>

      <section className="credits">
        <p>
          Versão simplificada do <strong>PUCMaps</strong>, projeto vencedor do melhor trabalho interdisciplinar de{" "}
          <strong>TI5</strong> da Engenharia de Software da PUC Minas, campus Coração Eucarístico. Criado por Gabriel
          Assis de Souza, João Pedro Lezsi Fernandes, João Pedro Peres Barbosa, Luis Henrique Gonçalves Barbosa e
          Marcela Mendes Campos.
        </p>
        <a href={ORIGINAL_REPO} target="_blank" rel="noreferrer">
          <FiExternalLink aria-hidden="true" /> Repositório original
        </a>
      </section>
    </PageLayout>
  );
}

export default App;
