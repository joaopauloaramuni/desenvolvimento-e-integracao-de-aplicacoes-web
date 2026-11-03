import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Jogadores from "./pages/Jogadores";
import NotFound from "./pages/NotFound";
import PartidaDetalhe from "./pages/PartidaDetalhe";
import PartidaForm from "./pages/PartidaForm";
import Partidas from "./pages/Partidas";
import Placar from "./pages/Placar";
import RodadaEditor from "./pages/RodadaEditor";

// O dashboard carrega o Recharts: fica num arquivo à parte, baixado só quando abre
const Estatisticas = lazy(() => import("./pages/Estatisticas"));

/** Ao trocar de página, volta para o topo (o filtro do placar não conta). */
function VoltarAoTopo() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Layout>
      <VoltarAoTopo />
      <Suspense fallback={<p className="conteudo carregando">Embaralhando...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jogadores" element={<Jogadores />} />
          <Route path="/partidas" element={<Partidas />} />
          <Route path="/partidas/nova" element={<PartidaForm />} />
          <Route path="/partidas/:id" element={<PartidaDetalhe />} />
          <Route path="/partidas/:id/editar" element={<PartidaForm />} />
          <Route path="/partidas/:id/rodadas/nova" element={<RodadaEditor />} />
          <Route path="/partidas/:id/rodadas/:rodadaId" element={<RodadaEditor />} />
          <Route path="/placar" element={<Placar />} />
          <Route path="/estatisticas" element={<Estatisticas />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
