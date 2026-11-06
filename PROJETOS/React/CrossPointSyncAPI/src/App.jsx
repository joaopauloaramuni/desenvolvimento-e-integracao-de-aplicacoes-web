import { LuBookOpenText } from "react-icons/lu";
import Bookshelf from "./components/Bookshelf/Bookshelf";
import LoginForm from "./components/LoginForm/LoginForm";
import PageLayout from "./components/PageLayout/PageLayout";
import useLibrary from "./hooks/useLibrary";
import useSession from "./hooks/useSession";

function App() {
  const conta = useSession();
  const biblioteca = useLibrary(conta.sessao);

  return (
    <PageLayout
      icon={LuBookOpenText}
      brand="CrossPoint Sync"
      title="O que estou lendo"
      description="Sua estante a partir do crosspoint-sync: o progresso de cada livro no CrossPoint, no KOReader e no Kindle, juntos em um lugar só."
    >
      {conta.sessao ? (
        <Bookshelf sessao={conta.sessao} biblioteca={biblioteca} onSair={conta.sair} />
      ) : (
        <LoginForm onEntrar={conta.entrar} onDemo={conta.entrarDemo} entrando={conta.entrando} erro={conta.erro} />
      )}
    </PageLayout>
  );
}

export default App;
