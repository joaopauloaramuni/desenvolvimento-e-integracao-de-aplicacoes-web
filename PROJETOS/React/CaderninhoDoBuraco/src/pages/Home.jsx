import { useMemo } from "react";
import { LuArrowRight, LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";
import asesLeque from "../assets/images/ases-leque.webp";
import mesa1200 from "../assets/images/mesa-buraco-1200.webp";
import mesa from "../assets/images/mesa-buraco.webp";
import Aviso, { AvisoSupabase } from "../components/Aviso/Aviso";
import CanastraLeque from "../components/CanastraLeque/CanastraLeque";
import JogadorAvatar from "../components/JogadorAvatar/JogadorAvatar";
import LegendaPontos from "../components/LegendaPontos/LegendaPontos";
import RankingTabela from "../components/RankingTabela/RankingTabela";
import useEstatisticas from "../hooks/useEstatisticas";
import useJogadores from "../hooks/useJogadores";
import usePartidas from "../hooks/usePartidas";
import { formatDataExtensa, formatMesAno, hojeIso, plural } from "../utils/format";
import { periodoPadrao } from "../utils/periodo";
import "./Home.css";

/**
 * Home: a mesa com a canastra real se abrindo, a legenda de pontos,
 * o placar do mês e as últimas partidas.
 */
function Home() {
  const { jogadores, porId, carregando: carregandoJogadores } = useJogadores();
  const periodo = useMemo(() => periodoPadrao(), []);
  const { estatisticas, erro } = useEstatisticas(periodo, jogadores, carregandoJogadores);
  const { partidas } = usePartidas();
  const ultimas = partidas.slice(0, 3);

  return (
    <>
      <title>Caderninho do Buraco</title>

      <section className="abertura">
        <img
          className="abertura__mesa"
          src={mesa}
          srcSet={`${mesa1200} 1200w, ${mesa} 2400w`}
          sizes="100vw"
          alt="Mesa de feltro verde com o Coringa saltando da carta e um Ás de espadas"
          fetchPriority="high"
        />
        <div className="abertura__conteudo">
          <div className="abertura__texto">
            <h1>Caderninho do Buraco</h1>
            <p>
              O placar das nossas partidas. Lance cada rodada pelas cartas baixadas, que a conta sai sozinha,
              e veja quem está ganhando no mês, no ano ou desde sempre.
            </p>
            <div className="abertura__acoes">
              <Link className="botao" to="/partidas/nova">
                <LuPlus aria-hidden="true" /> Nova partida
              </Link>
              <Link className="botao botao--fantasma" to="/placar">
                Ver o placar
              </Link>
            </div>
          </div>
          <CanastraLeque />
        </div>
      </section>

      <div className="conteudo">
        <AvisoSupabase />

        <section className="home-legenda" aria-labelledby="titulo-legenda">
          <h2 id="titulo-legenda">Quanto vale cada coisa</h2>
          <div className="folha home-legenda__folha">
            <img src={asesLeque} alt="" className="home-legenda__ases" />
            <LegendaPontos />
          </div>
        </section>

        <div className="home-resumo">
          <section className="folha" aria-labelledby="titulo-mes">
            <h2 id="titulo-mes" className="manuscrito home-resumo__titulo">
              Placar de {formatMesAno(hojeIso().slice(0, 7))}
            </h2>
            {erro && <Aviso>Não foi possível carregar o placar. {erro.message}</Aviso>}
            {estatisticas.ranking.length > 0 ? (
              <RankingTabela ranking={estatisticas.ranking} compacta />
            ) : (
              <p className="home-resumo__vazio">Ninguém jogou este mês ainda. A primeira rodada pode ser hoje.</p>
            )}
            <Link to="/placar" className="home-resumo__link">
              Placar completo <LuArrowRight aria-hidden="true" />
            </Link>
          </section>

          <section className="folha" aria-labelledby="titulo-ultimas">
            <h2 id="titulo-ultimas" className="manuscrito home-resumo__titulo">
              Últimas partidas
            </h2>
            {ultimas.length === 0 ? (
              <p className="home-resumo__vazio">
                Nenhuma partida ainda. Cadastre os <Link to="/jogadores">jogadores</Link> e crie a primeira.
              </p>
            ) : (
              <ul className="home-ultimas">
                {ultimas.map((p) => {
                  const vitorias = p.vitorias;
                  const melhor = Math.max(0, ...Object.values(vitorias));
                  const lideres = p.jogadorIds.filter((id) => melhor > 0 && vitorias[id] === melhor);
                  return (
                    <li key={p.id}>
                      <Link to={`/partidas/${p.id}`}>
                        <span className="home-ultimas__data">{formatDataExtensa(p.data)}</span>
                        <span className="home-ultimas__info">
                          {plural(p.rodadas.length, "rodada")}
                          {lideres.length > 0 && (
                            <>
                              {", "}
                              {lideres.map((id) => porId.get(id)?.nome).join(" e ")} na frente
                            </>
                          )}
                        </span>
                        <span className="home-ultimas__jogadores">
                          {p.jogadorIds.map((id) => (
                            <JogadorAvatar key={id} jogador={porId.get(id)} tamanho="pequena" />
                          ))}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            <Link to="/partidas" className="home-resumo__link">
              Todas as partidas <LuArrowRight aria-hidden="true" />
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}

export default Home;
