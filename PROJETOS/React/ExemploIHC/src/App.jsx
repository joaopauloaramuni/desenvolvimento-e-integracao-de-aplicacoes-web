import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import BoasPraticas from "./pages/BoasPraticas/BoasPraticas";
import CadastroRecurso from "./pages/CadastroRecurso/CadastroRecurso";
import ConfirmarReservas from "./pages/ConfirmarReservas/ConfirmarReservas";
import DetalhesReserva from "./pages/DetalhesReserva/DetalhesReserva";
import GuiaEstilo from "./pages/GuiaEstilo/GuiaEstilo";
import Home from "./pages/Home/Home";
import NaoEncontrada from "./pages/NaoEncontrada/NaoEncontrada";
import NovaReserva from "./pages/NovaReserva/NovaReserva";
import Recursos from "./pages/Recursos/Recursos";

// Ao trocar de página, volta para o topo (exceto links com âncora #)
function RolarParaTopo() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <RolarParaTopo />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recursos" element={<Recursos />} />
          <Route path="recursos/novo" element={<CadastroRecurso />} />
          <Route path="reservar" element={<NovaReserva />} />
          <Route path="reservas" element={<ConfirmarReservas />} />
          <Route path="reservas/:id" element={<DetalhesReserva />} />
          <Route path="guia-de-estilo" element={<GuiaEstilo />} />
          <Route path="boas-praticas" element={<BoasPraticas />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Route>
      </Routes>
    </>
  );
}
