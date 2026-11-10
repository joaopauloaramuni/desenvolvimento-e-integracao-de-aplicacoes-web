import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import BackgroundMusic from "./components/BackgroundMusic/BackgroundMusic";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { FavoritosProvider } from "./hooks/useFavoritos";
import CardPage from "./pages/CardPage";
import CardsPage from "./pages/CardsPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

/** Volta ao topo ao trocar de página (mas não ao mudar só os filtros). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * HashRouter (#/cartas) funciona no GitHub Pages e na Vercel sem configurar
 * redirecionamentos no servidor.
 */
const App = () => {
  const { t } = useTranslation();
  return (
    <FavoritosProvider>
      <HashRouter>
        <ScrollToTop />
        <a href="#conteudo" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById("conteudo")?.focus(); }}>
          {t("skipLink")}
        </a>
        <Header />
        <main id="conteudo" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cartas" element={<CardsPage />} />
            <Route path="/cartas/:id" element={<CardPage />} />
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <BackgroundMusic />
      </HashRouter>
    </FavoritosProvider>
  );
};

export default App;
