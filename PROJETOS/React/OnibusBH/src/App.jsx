import { FaBusSimple } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import BuscaLinhas from "./components/BuscaLinhas/BuscaLinhas";
import CampusProximos from "./components/CampusProximos/CampusProximos";
import LinhaDetalhe from "./components/LinhaDetalhe/LinhaDetalhe";
import PageLayout from "./components/PageLayout/PageLayout";
import useCarregar from "./hooks/useCarregar";
import useRota from "./hooks/useRota";
import { carregarCampus, carregarIndice } from "./services/dadosService";

const PORTAL = "https://dados.pbh.gov.br/dataset/gtfs-rt";

const dataBR = (iso) => (iso ? new Date(iso).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "");

function FonteDados({ meta }) {
  return (
    <section className="fonte-dados">
      <p>
        Linhas, pontos, trajetos e horários do <strong>GTFS da BHTrans</strong>
        {meta?.geradoEm && `, baixado em ${dataBR(meta.geradoEm)}`}
        {meta?.totais && ` (${meta.totais.linhas.toLocaleString("pt-BR")} linhas)`}. Posição dos ônibus pelo{" "}
        <strong>GTFS-Realtime da Prefeitura de Belo Horizonte</strong>, atualizado a cada 20 segundos.
      </p>
      <a href={PORTAL} target="_blank" rel="noreferrer">
        <FiExternalLink aria-hidden="true" /> Dados abertos PBH
      </a>
    </section>
  );
}

function Inicio() {
  const indice = useCarregar(carregarIndice, "indice");
  const campus = useCarregar(carregarCampus, "campus");
  const erro = indice.erro ?? campus.erro;

  if (erro) {
    return (
      <div className="estado estado-erro">
        <p>{erro.message}</p>
      </div>
    );
  }
  if (indice.carregando || campus.carregando) return <p className="estado">Carregando as linhas de BH...</p>;

  return (
    <>
      <BuscaLinhas linhas={indice.dados.linhas} />
      <CampusProximos dados={campus.dados} />
      <FonteDados meta={indice.dados.meta} />
    </>
  );
}

function App() {
  const rota = useRota();
  const naLinha = rota.pagina === "linha";

  return (
    <PageLayout
      icon={FaBusSimple}
      brand="Ônibus BH"
      title={naLinha ? null : "Horários e ônibus ao vivo em BH"}
      description="Procure uma linha pelo número ou pelo nome, veja o trajeto no mapa, o quadro de horários da BHTrans e onde os ônibus estão agora. Ou comece pelas linhas que passam perto dos campi da PUC Minas."
    >
      {naLinha ? <LinhaDetalhe rota={rota} /> : <Inicio />}
    </PageLayout>
  );
}

export default App;
