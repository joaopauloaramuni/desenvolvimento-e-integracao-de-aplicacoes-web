import { lazy, Suspense } from "react";

// lazy(): o maplibre-gl (~800 KB) só é baixado quando um mapa aparece na tela
const Mapa = lazy(() => import("./Mapa"));

const MapaLazy = (props) => (
  <Suspense fallback={<div className="mapa-carregando">Carregando mapa...</div>}>
    <Mapa {...props} />
  </Suspense>
);

export default MapaLazy;
