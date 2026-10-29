import { SiWakatime } from "react-icons/si";
import PageLayout from "./components/PageLayout/PageLayout";
import WakaTimeStats from "./components/WakaTimeStats/WakaTimeStats";

function App() {
  return (
    <PageLayout
      icon={SiWakatime}
      brand="WakaTime API"
      title="Meu tempo programando"
      description="Estatísticas lidas da API do WakaTime: quanto tempo passei programando, em quais linguagens, editores e projetos."
    >
      {/* showProjects={false} esconde os nomes dos projetos (ex.: projetos de cliente) */}
      <WakaTimeStats initialRange="last_7_days" showProjects />
    </PageLayout>
  );
}

export default App;
