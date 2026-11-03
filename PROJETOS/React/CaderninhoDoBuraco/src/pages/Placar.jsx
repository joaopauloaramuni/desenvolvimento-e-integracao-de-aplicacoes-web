import Aviso, { AvisoSupabase } from "../components/Aviso/Aviso";
import EstadoVazio from "../components/EstadoVazio/EstadoVazio";
import FiltroPeriodo from "../components/FiltroPeriodo/FiltroPeriodo";
import RankingTabela from "../components/RankingTabela/RankingTabela";
import useEstatisticas from "../hooks/useEstatisticas";
import useJogadores from "../hooks/useJogadores";
import usePeriodo from "../hooks/usePeriodo";
import { plural } from "../utils/format";
import { descreverPeriodo } from "../utils/periodo";
import "./Placar.css";

/**
 * O total geral: vitórias (rodadas ganhas) de cada jogador no período,
 * com pontos, batidas e canastras.
 */
function Placar() {
  const [periodo, setPeriodo] = usePeriodo();
  const { jogadores, carregando: carregandoJogadores } = useJogadores();
  const { estatisticas, carregando, erro } = useEstatisticas(periodo, jogadores, carregandoJogadores);
  const { ranking, totais } = estatisticas;
  const descricao = descreverPeriodo(periodo);

  return (
    <div className="conteudo">
      <title>Placar - Caderninho do Buraco</title>
      <AvisoSupabase />

      <header className="cabecalho-pagina">
        <div>
          <h1>Placar geral</h1>
          <p>Cada rodada ganha conta uma vitória. Empate em pontos fica com quem bateu.</p>
        </div>
      </header>

      <FiltroPeriodo periodo={periodo} onChange={setPeriodo} />

      {erro && <Aviso>Não foi possível carregar o placar. {erro.message}</Aviso>}

      <section className="folha folha--espiral placar" aria-labelledby="titulo-placar" aria-busy={carregando}>
        <header className="placar__topo">
          <h2 id="titulo-placar" className="manuscrito">
            Total geral, {descricao}
          </h2>
          {ranking.length > 0 && (
            <p>
              {plural(totais.partidas, "partida")}, {plural(totais.rodadas, "rodada")}
            </p>
          )}
        </header>

        {!carregando && ranking.length === 0 ? (
          <EstadoVazio titulo="Nenhuma rodada nesse período">Escolha outro período ou lance as rodadas de hoje.</EstadoVazio>
        ) : (
          <RankingTabela ranking={ranking} />
        )}
      </section>
    </div>
  );
}

export default Placar;
