import { lazy, Suspense } from "react";
import LocationIqLogo from "./components/LocationIqLogo/LocationIqLogo";
import PageLayout from "./components/PageLayout/PageLayout";
import PLACES from "./data/places";

// lazy(): o maplibre-gl (~800 KB) só é baixado quando o mapa aparece na tela,
// e não junto com o resto do site
const LocationExplorer = lazy(() => import("./components/LocationExplorer/LocationExplorer"));

function App() {
  return (
    <PageLayout
      icon={LocationIqLogo}
      brand="LocationIQ API"
      title="Endereços, lugares e rotas"
      description="Busca com autocomplete, endereço de qualquer ponto do mapa, fuso horário, lugares por perto e rotas, tudo com a API do LocationIQ sobre o mapa do OpenStreetMap."
    >
      <Suspense fallback={<p className="map-fallback">Carregando mapa...</p>}>
        <LocationExplorer places={PLACES} />
      </Suspense>
    </PageLayout>
  );
}

export default App;
