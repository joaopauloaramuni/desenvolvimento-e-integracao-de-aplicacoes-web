import { useMemo, useState } from "react";
import { FaPersonWalking } from "react-icons/fa6";
import { FiMapPin } from "react-icons/fi";
import { minutosAPe } from "../../core/geometria";
import { formatarEspera, formatarHora, proximasPartidas } from "../../core/horarios";
import useAgora from "../../hooks/useAgora";
import { irPara } from "../../hooks/useRota";
import Letreiro from "../Letreiro/Letreiro";
import MapaLazy from "../Mapa/MapaLazy";
import "./CampusProximos.css";

function Proximas({ linha, agora }) {
  const proximas = proximasPartidas(linha.horarios, { agora, apos: linha.apos, quantidade: 3 });
  if (!proximas.length) return <span className="campus-sem">Sem mais partidas hoje</span>;
  return (
    <span className="campus-proximas">
      <strong>{formatarEspera(proximas[0].espera)}</strong>
      <span>{proximas.map((p) => formatarHora(p.minutos)).join("  ")}</span>
    </span>
  );
}

/** Linhas que passam a até X metros de cada campus da PUC Minas, com mapa dos pontos. */
export default function CampusProximos({ dados }) {
  const [campusId, setCampusId] = useState(dados.campus[0]?.id);
  const [pontoId, setPontoId] = useState(null);
  const agora = useAgora();

  const campus = dados.campus.find((c) => c.id === campusId) ?? dados.campus[0];
  const ponto = campus.pontos.find((p) => p.id === pontoId) ?? null;

  const linhas = useMemo(
    () => (ponto ? campus.linhas.filter((l) => ponto.linhas.includes(l.codigo)) : campus.linhas),
    [campus, ponto]
  );

  const paradas = useMemo(
    () =>
      campus.pontos.map((p) => ({
        ...p,
        detalhe: `${p.dist} m do campus, ${p.linhas.length} ${p.linhas.length === 1 ? "linha" : "linhas"}: ${p.linhas.join(", ")}`,
      })),
    [campus]
  );
  const campi = useMemo(() => [campus], [campus]);

  const trocarCampus = (id) => {
    setCampusId(id);
    setPontoId(null);
  };

  return (
    <section className="campus" aria-labelledby="campus-titulo">
      <h2 id="campus-titulo">Linhas perto da PUC Minas</h2>

      <div className="campus-abas" role="tablist" aria-label="Campus">
        {dados.campus.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={c.id === campus.id}
            className={c.id === campus.id ? "ativo" : ""}
            onClick={() => trocarCampus(c.id)}
          >
            {c.nome}
            <small>{c.linhas.length} linhas</small>
          </button>
        ))}
      </div>

      <div className="campus-grade">
        <div className="campus-lista">
          <p className="campus-endereco">
            <FiMapPin aria-hidden="true" /> {campus.endereco}. Pontos a até {dados.raio} m.
          </p>

          {ponto && (
            <div className="campus-filtro">
              <span>
                Só as linhas do ponto <strong>{ponto.nome}</strong>
              </span>
              <button type="button" onClick={() => setPontoId(null)}>
                Ver todas
              </button>
            </div>
          )}

          {linhas.length === 0 ? (
            <p className="campus-vazio">Nenhuma linha passa a até {dados.raio} m deste campus nos dados atuais.</p>
          ) : (
            <ul>
              {linhas.map((l) => (
                <li key={l.id}>
                  <button type="button" onClick={() => irPara("linha", l.arquivo, l.sentido, l.pontoId)}>
                    <Letreiro codigo={l.codigo} tamanho="pequeno" />
                    <span className="campus-texto">
                      <strong>Para {l.destino}</strong>
                      <small>
                        <FaPersonWalking aria-hidden="true" /> {l.ponto}, {l.dist} m ({minutosAPe(l.dist)} min a pé)
                      </small>
                    </span>
                    <Proximas linha={l} agora={agora} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="campus-nota">
            Horários previstos no ponto, pelo quadro da BHTrans. Toque numa linha para ver o mapa e os ônibus ao vivo.
          </p>
        </div>

        <div className="campus-mapa">
          <MapaLazy
            rotulo={`Pontos de ônibus perto do campus ${campus.nome}`}
            paradas={paradas}
            paradaSelecionada={pontoId}
            onSelecionarParada={setPontoId}
            campi={campi}
            raioCampus={dados.raio}
            enquadrar={campus.id}
          />
        </div>
      </div>
    </section>
  );
}
