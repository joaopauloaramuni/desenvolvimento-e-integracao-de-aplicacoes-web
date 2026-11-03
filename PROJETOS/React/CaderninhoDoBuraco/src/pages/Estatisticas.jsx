import Aviso, { AvisoSupabase } from "../components/Aviso/Aviso";
import EstadoVazio from "../components/EstadoVazio/EstadoVazio";
import FiltroPeriodo from "../components/FiltroPeriodo/FiltroPeriodo";
import BarrasPorJogador from "../components/Graficos/BarrasPorJogador";
import CanastrasGrafico from "../components/Graficos/CanastrasGrafico";
import DivisaoVitoriasGrafico from "../components/Graficos/DivisaoVitoriasGrafico";
import EvolucaoGrafico from "../components/Graficos/EvolucaoGrafico";
import GraficoPainel from "../components/Graficos/GraficoPainel";
import VitoriasPorMesGrafico from "../components/Graficos/VitoriasPorMesGrafico";
import useEstatisticas from "../hooks/useEstatisticas";
import useJogadores from "../hooks/useJogadores";
import usePeriodo from "../hooks/usePeriodo";
import { formatData, formatNumero, formatPontos } from "../utils/format";
import { descreverPeriodo } from "../utils/periodo";
import "./Estatisticas.css";

/** Dados para BarrasPorJogador a partir do ranking. */
const barras = (ranking, campo) => ranking.map((r) => ({ nome: r.jogador.nome, cor: r.jogador.cor, valor: r[campo] }));

/** Os números da mesa em cartinhas de marfim. */
function Numeros({ totais }) {
  const maior = totais.maiorRodada;
  const itens = [
    { valor: formatNumero(totais.partidas), nome: totais.partidas === 1 ? "partida" : "partidas" },
    { valor: formatNumero(totais.rodadas), nome: totais.rodadas === 1 ? "rodada" : "rodadas" },
    { valor: formatNumero(totais.canastras), nome: totais.canastras === 1 ? "canastra" : "canastras" },
    { valor: formatNumero(totais.canastrasReais), nome: "de Ás a Ás", vermelho: totais.canastrasReais > 0 },
  ];

  return (
    <div className="numeros">
      {itens.map((i) => (
        <div key={i.nome} className={`numeros__carta${i.vermelho ? " numeros__carta--vermelha" : ""}`}>
          <b>{i.valor}</b>
          <span>{i.nome}</span>
        </div>
      ))}
      {maior && (
        <div className="numeros__carta numeros__carta--larga">
          <b>{formatNumero(maior.total)}</b>
          <span>
            maior rodada: {maior.jogador.nome}, rodada {maior.rodada} de {formatData(maior.data)}
          </span>
        </div>
      )}
    </div>
  );
}

/** Dashboard: comparação entre os jogadores no período escolhido. */
function Estatisticas() {
  const [periodo, setPeriodo] = usePeriodo();
  const { jogadores, carregando: carregandoJogadores } = useJogadores();
  const { estatisticas, carregando, erro } = useEstatisticas(periodo, jogadores, carregandoJogadores);
  const { ranking, totais, evolucao, vitoriasPorMes } = estatisticas;

  return (
    <div className="conteudo">
      <title>Estatísticas - Caderninho do Buraco</title>
      <AvisoSupabase />

      <header className="cabecalho-pagina">
        <div>
          <h1>Estatísticas</h1>
          <p>Quem ganha mais, quem bate mais, quem fecha canastra e quem fica com a mão cheia. Em {descreverPeriodo(periodo)}.</p>
        </div>
      </header>

      <FiltroPeriodo periodo={periodo} onChange={setPeriodo} />

      {erro && <Aviso>Não foi possível carregar as estatísticas. {erro.message}</Aviso>}

      {!carregando && ranking.length === 0 ? (
        <EstadoVazio titulo="Sem rodadas nesse período">
          Os gráficos aparecem assim que houver rodadas lançadas. Escolha outro período ou jogue uma hoje.
        </EstadoVazio>
      ) : (
        <div aria-busy={carregando}>
          <Numeros totais={totais} />

          <div className="graficos">
            <GraficoPainel titulo="Vitórias" descricao="Rodadas ganhas por cada jogador.">
              <BarrasPorJogador dados={barras(ranking, "vitorias")} nomeValor="Vitórias" />
            </GraficoPainel>

            <GraficoPainel titulo="Divisão das vitórias" descricao="A fatia de cada um nas rodadas ganhas.">
              <DivisaoVitoriasGrafico ranking={ranking} />
            </GraficoPainel>

            <GraficoPainel largo titulo="Pontos acumulados" descricao="A soma dos pontos de cada jogador, dia de jogo a dia de jogo.">
              <EvolucaoGrafico evolucao={evolucao} jogadores={estatisticas.jogadores} />
            </GraficoPainel>

            <GraficoPainel titulo="Média por rodada" descricao="Pontos por rodada, descontada a mão.">
              <BarrasPorJogador dados={barras(ranking, "media")} nomeValor="Média" />
            </GraficoPainel>

            <GraficoPainel titulo="Batidas" descricao="Quantas vezes cada um bateu e fechou a rodada.">
              <BarrasPorJogador dados={barras(ranking, "batidas")} nomeValor="Batidas" />
            </GraficoPainel>

            <GraficoPainel titulo="Canastras" descricao="Limpas, sujas e reais (de Ás a Ás).">
              <CanastrasGrafico ranking={ranking} />
            </GraficoPainel>

            <GraficoPainel titulo="Pontos perdidos na mão" descricao="Soma das cartas que sobraram na mão.">
              <BarrasPorJogador
                dados={barras(ranking, "pontosMao").map((d) => ({ ...d, valor: Math.abs(d.valor) }))}
                nomeValor="Perdidos na mão"
                formatar={(v) => formatPontos(-v)}
              />
            </GraficoPainel>

            {vitoriasPorMes.length > 1 && (
              <GraficoPainel largo titulo="Vitórias por mês" descricao="Rodadas ganhas em cada mês do período.">
                <VitoriasPorMesGrafico vitoriasPorMes={vitoriasPorMes} jogadores={estatisticas.jogadores} />
              </GraficoPainel>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Estatisticas;
