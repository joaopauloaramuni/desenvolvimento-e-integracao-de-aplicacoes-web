import { SiGithub } from "react-icons/si";
import ContributorStats from "./components/ContributorStats/ContributorStats";
import PageLayout from "./components/PageLayout/PageLayout";

function App() {
  return (
    <PageLayout
      icon={SiGithub}
      brand="Contributor Stats"
      title="Ranking de colaboradores"
      description="Quem mais contribuiu para um repositório do GitHub: commits, linhas inseridas e deletadas e impacto líquido, considerando todas as branches (não só a main)."
    >
      <ContributorStats />
    </PageLayout>
  );
}

export default App;
