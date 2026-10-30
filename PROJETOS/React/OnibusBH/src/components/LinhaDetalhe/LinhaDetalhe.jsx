import { useMemo, useState } from "react";
import { FiArrowLeft, FiRepeat } from "react-icons/fi";
import { CAMPI, DADOS } from "../../config/appConfig";
import { distanciaM } from "../../core/geometria";
import useAgora from "../../hooks/useAgora";
import useCarregar from "../../hooks/useCarregar";
import useOnibusAoVivo from "../../hooks/useOnibusAoVivo";
import { irPara } from "../../hooks/useRota";
import { carregarLinha } from "../../services/dadosService";
import Letreiro from "../Letreiro/Letreiro";
import MapaLazy from "../Mapa/MapaLazy";
import QuadroHorarios from "../QuadroHorarios/QuadroHorarios";
import StatusAoVivo from "../StatusAoVivo/StatusAoVivo";
import "./LinhaDetalhe.css";

// [id, nome, lon, lat, minutos depois da saída] -> objeto
const comoObjeto = ([id, nome, lon, lat, apos]) => ({ id, nome, lon, lat, apos: apos ?? 0 });

function Conteudo({ linha, rota }) {
  const agora = useAgora();
  const [sentidoId, setSentidoId] = useState(
    linha.sentidos.some((s) => s.id === rota.sentido) ? rota.sentido : linha.sentidos[0]?.id
  );
  const [pontoId, setPontoId] = useState(rota.ponto);
  const [aba, setAba] = useState("horarios");

  const sentido = linha.sentidos.find((s) => s.id === sentidoId) ?? linha.sentidos[0];
  const paradas = useMemo(
    () => sentido.paradas.map(comoObjeto).map((p) => ({ ...p, detalhe: `${p.apos} min depois da saída` })),
    [sentido]
  );
  const ponto = paradas.find((p) => p.id === pontoId) ?? null;

  // Campi da PUC Minas que ficam perto do trajeto (aparecem no mapa)
  const campi = useMemo(
    () => CAMPI.filter((c) => paradas.some((p) => distanciaM(c.coords, [p.lon, p.lat]) <= DADOS.RAIO_CAMPUS_M)),
    [paradas]
  );

  const aoVivo = useOnibusAoVivo([linha.id]);
  // Se o feed informar o sentido (direction_id), mostra só os ônibus deste sentido
  const veiculos = useMemo(() => {
    const direcao = sentido.id.startsWith("d") ? Number(sentido.id.slice(1)) : null;
    const comSentido = aoVivo.veiculos.filter((v) => v.sentido !== null && v.sentido !== undefined);
    if (direcao === null || comSentido.length === 0) return aoVivo.veiculos;
    return aoVivo.veiculos.filter((v) => v.sentido === direcao);
  }, [aoVivo.veiculos, sentido]);

  const escolherSentido = (id) => {
    setSentidoId(id);
    setPontoId(null);
  };
  const escolherPonto = (id) => {
    setPontoId(id);
    setAba("horarios");
  };

  return (
    <article className="linha">
      <button type="button" className="linha-voltar" onClick={() => irPara()}>
        <FiArrowLeft aria-hidden="true" /> Todas as linhas
      </button>

      <header className="linha-cabecalho">
        <Letreiro codigo={linha.codigo} tamanho="grande" />
        <div>
          <h1>{linha.nome || `Linha ${linha.codigo}`}</h1>
          <p>
            {linha.sentidos.length === 1
              ? "Linha circular ou de sentido único"
              : `${linha.sentidos.length} sentidos`}
            , {sentido.paradas.length} pontos neste sentido
          </p>
        </div>
      </header>

      {linha.sentidos.length > 1 && (
        <div className="linha-sentidos" role="tablist" aria-label="Sentido">
          {linha.sentidos.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === sentido.id}
              className={s.id === sentido.id ? "ativo" : ""}
              onClick={() => escolherSentido(s.id)}
            >
              <FiRepeat aria-hidden="true" /> Para {s.destino}
            </button>
          ))}
        </div>
      )}

      <div className="linha-grade">
        <div className="linha-mapa">
          <StatusAoVivo {...aoVivo} veiculos={veiculos} />
          <MapaLazy
            rotulo={`Trajeto da linha ${linha.codigo} para ${sentido.destino}`}
            tracado={sentido.tracado}
            paradas={paradas}
            paradaSelecionada={pontoId}
            onSelecionarParada={escolherPonto}
            onibus={veiculos}
            campi={campi}
            enquadrar={`${linha.id}-${sentido.id}`}
          />
        </div>

        <aside className="linha-lateral">
          <div className="linha-abas" role="tablist" aria-label="Detalhes">
            <button type="button" role="tab" aria-selected={aba === "horarios"} className={aba === "horarios" ? "ativo" : ""} onClick={() => setAba("horarios")}>
              Horários
            </button>
            <button type="button" role="tab" aria-selected={aba === "pontos"} className={aba === "pontos" ? "ativo" : ""} onClick={() => setAba("pontos")}>
              Pontos ({paradas.length})
            </button>
          </div>

          {aba === "horarios" ? (
            <QuadroHorarios
              horarios={sentido.horarios}
              agora={agora}
              ponto={ponto}
              primeiroPonto={paradas[0]?.nome}
              onLimparPonto={() => setPontoId(null)}
            />
          ) : (
            <ol className="linha-pontos">
              {paradas.map((p) => (
                <li key={`${p.id}-${p.apos}`}>
                  <button type="button" className={p.id === pontoId ? "ativo" : ""} onClick={() => escolherPonto(p.id)}>
                    <span className="linha-pontos-marca" aria-hidden="true" />
                    <span className="linha-pontos-nome">{p.nome}</span>
                    <small>+{p.apos} min</small>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>
    </article>
  );
}

/** Página de uma linha: carrega o JSON dela e mostra mapa, ao vivo, horários e pontos. */
export default function LinhaDetalhe({ rota }) {
  const { dados: linha, erro, carregando } = useCarregar(() => carregarLinha(rota.arquivo), rota.arquivo);

  if (carregando) return <p className="estado">Carregando a linha...</p>;
  if (erro || !linha?.sentidos?.length) {
    return (
      <div className="estado estado-erro">
        <p>{erro?.message ?? "Linha não encontrada nos dados atuais."}</p>
        <button type="button" onClick={() => irPara()}>
          <FiArrowLeft aria-hidden="true" /> Voltar para a busca
        </button>
      </div>
    );
  }
  // key: ao trocar de linha, o estado (sentido, ponto, aba) recomeça
  return <Conteudo key={linha.id} linha={linha} rota={rota} />;
}
