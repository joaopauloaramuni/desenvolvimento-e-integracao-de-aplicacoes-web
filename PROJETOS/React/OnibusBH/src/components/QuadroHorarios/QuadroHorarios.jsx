import { useEffect, useMemo, useRef, useState } from "react";
import { FiClock, FiX } from "react-icons/fi";
import { agruparPorHora, formatarEspera, formatarHora, proximasPartidas, TIPOS_DE_DIA, tipoDoDia } from "../../core/horarios";
import "./QuadroHorarios.css";

/**
 * Quadro de horários de um sentido, no formato do quadro impresso:
 * uma linha por hora, com os minutos de cada partida.
 * Com um ponto escolhido, os horários são somados ao tempo até aquele ponto.
 */
export default function QuadroHorarios({ horarios, agora, ponto, primeiroPonto, onLimparPonto }) {
  const hoje = tipoDoDia(agora);
  const [tipo, setTipo] = useState(hoje);
  const apos = ponto?.apos ?? 0;
  const corpo = useRef(null);

  const tabela = useMemo(() => (horarios[tipo] ?? []).map((h) => h + apos), [horarios, tipo, apos]);
  const grupos = useMemo(() => agruparPorHora(tabela), [tabela]);
  const proximas = tipo === hoje ? proximasPartidas(horarios, { agora, apos, quantidade: 3 }) : [];
  const proxima = proximas[0]?.minutos ?? null;
  const ehHoje = tipo === hoje;

  // Rola até a hora atual quando o quadro de hoje aparece
  useEffect(() => {
    const caixa = corpo.current;
    const alvo = caixa?.querySelector("[data-agora='true']");
    if (!caixa) return;
    // Distância real entre a linha da hora atual e o topo da caixa que rola
    caixa.scrollTop = alvo
      ? caixa.scrollTop + alvo.getBoundingClientRect().top - caixa.getBoundingClientRect().top - 4
      : 0;
  }, [tipo, apos, horarios]);

  return (
    <div className="quadro">
      <div className="quadro-ponto">
        <FiClock aria-hidden="true" />
        {ponto ? (
          <>
            <span>
              Previsto no ponto <strong>{ponto.nome}</strong> ({apos} min depois da saída)
            </span>
            <button type="button" onClick={onLimparPonto} aria-label="Ver horários de saída">
              <FiX aria-hidden="true" />
            </button>
          </>
        ) : (
          <span>
            Saídas de <strong>{primeiroPonto ?? "ponto inicial"}</strong>. Escolha um ponto no mapa ou na lista para ver a
            previsão nele.
          </span>
        )}
      </div>

      {ehHoje && (
        <div className="quadro-proximas" aria-live="polite">
          {proximas.length ? (
            proximas.map((p, i) => (
              <div key={p.minutos} className={i === 0 ? "quadro-proxima principal" : "quadro-proxima"}>
                <strong>{formatarHora(p.minutos)}</strong>
                <span>{formatarEspera(p.espera)}</span>
              </div>
            ))
          ) : (
            <p>Não há mais partidas hoje neste sentido.</p>
          )}
        </div>
      )}

      <div className="quadro-tipos" role="tablist" aria-label="Tipo de dia">
        {TIPOS_DE_DIA.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tipo === t.id}
            className={tipo === t.id ? "ativo" : ""}
            onClick={() => setTipo(t.id)}
          >
            {t.nome}
            {t.id === hoje && <small>hoje</small>}
          </button>
        ))}
      </div>

      <div className="quadro-corpo" ref={corpo}>
        {grupos.length === 0 ? (
          <p className="quadro-vazio">Esta linha não roda neste tipo de dia.</p>
        ) : (
          <table>
            <caption className="visualmente-oculto">Horários por hora</caption>
            <tbody>
              {grupos.map(([horaDoDia, lista]) => {
                const atual = ehHoje && Math.floor(agora.minutos / 60) === horaDoDia % 24 && horaDoDia < 24;
                return (
                  <tr key={horaDoDia} data-agora={atual}>
                    <th scope="row">{String(horaDoDia % 24).padStart(2, "0")}</th>
                    <td>
                      {lista.map((h) => {
                        const passou = ehHoje && h < agora.minutos;
                        const classe = h === proxima ? "proxima" : passou ? "passou" : "";
                        return (
                          <span key={h} className={classe} title={formatarHora(h)}>
                            {String(h % 60).padStart(2, "0")}
                          </span>
                        );
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <p className="quadro-nota">
        {tabela.length} partidas. Horário programado da BHTrans: o trânsito pode adiantar ou atrasar a passagem. Feriados
        usam a tabela de domingo.
      </p>
    </div>
  );
}
