import Footer from "./components/Footer/Footer.jsx";
import GameSection from "./components/GameSection/GameSection.jsx";
import Header from "./components/Header/Header.jsx";
import HowItWorks from "./components/HowItWorks/HowItWorks.jsx";
import { GAMES } from "./data/games.js";
import { useTheme } from "./hooks/useTheme.js";
import "./App.css";

export default function App() {
  const { tema, alternar } = useTheme();

  return (
    <div className="pagina">
      <Header tema={tema} onAlternarTema={alternar} />
      <main>
        {GAMES.map((game, i) => (
          <GameSection key={game.pasta} game={game} primeiro={i === 0} />
        ))}
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
