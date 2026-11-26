import { FiArrowLeft, FiPrinter, FiSearch } from "react-icons/fi";
import { useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina";
import EstadoVazio from "../../components/EstadoVazio/EstadoVazio";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import usePaginaTitulo from "../../hooks/usePaginaTitulo";
import { buscarRecurso } from "../../services/recursoService";
import { buscarReserva } from "../../services/reservaService";
import { formatarData } from "../../utils/datas";
import "./DetalhesReserva.css";

/**
 * Tela "Detalhes de 1 Reserva" (Aula 11 - Tela 2 do caso de uso).
 * Campos: Aluno, Data da solicitação, Horário da reserva...
 * Comandos: Imprimir, Voltar
 *
 * Dados em lista de definições (<dl>): rótulo e valor ligados
 * semanticamente, e agrupados por assunto (Gestalt: proximidade).
 * Há um CSS de impressão: menus e botões somem no papel.
 */
export default function DetalhesReserva() {
  const { id } = useParams();
  const reserva = buscarReserva(id);
  const tituloRef = usePaginaTitulo(reserva ? `Reserva ${id}` : "Reserva não encontrada");
  const trilha = [{ rotulo: "Confirmar reservas", para: "/reservas" }, { rotulo: `Reserva ${id}` }];

  if (!reserva) {
    return (
      <>
        <CabecalhoPagina ref={tituloRef} titulo="Reserva não encontrada" trilha={trilha} />
        <EstadoVazio
          icone={FiSearch}
          titulo={`Não existe reserva com o protocolo ${id}`}
          acao={<Button para="/reservas">Ver todas as reservas</Button>}
        >
          <p>Confira se o número está certo. Protocolos têm o formato R-0000.</p>
        </EstadoVazio>
      </>
    );
  }

  const recurso = buscarRecurso(reserva.codigoRecurso);

  return (
    <>
      <CabecalhoPagina
        ref={tituloRef}
        titulo={`Reserva ${reserva.id}`}
        trilha={trilha}
        acoes={
          <>
            <Button variante="secundario" icone={FiPrinter} onClick={() => window.print()}>
              Imprimir
            </Button>
            <Button para="/reservas" variante="fantasma" icone={FiArrowLeft}>
              Voltar para a lista
            </Button>
          </>
        }
      />

      <article className="detalhes">
        <div className="detalhes-status">
          <StatusBadge status={reserva.status} />
          <span className="muted">Solicitada em {formatarData(reserva.solicitadaEm)}</span>
        </div>

        <section aria-labelledby="sec-aluno" className="detalhes-secao">
          <h2 id="sec-aluno">Aluno solicitante</h2>
          <dl className="detalhes-lista">
            <div>
              <dt>Nome</dt>
              <dd>{reserva.aluno}</dd>
            </div>
            <div>
              <dt>Matrícula</dt>
              <dd>{reserva.matricula}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="sec-emprestimo" className="detalhes-secao">
          <h2 id="sec-emprestimo">Empréstimo</h2>
          <dl className="detalhes-lista">
            <div>
              <dt>Data do empréstimo</dt>
              <dd>{formatarData(reserva.data)}</dd>
            </div>
            <div>
              <dt>Retirada</dt>
              <dd>{reserva.inicio}</dd>
            </div>
            <div>
              <dt>Devolução</dt>
              <dd>{reserva.fim}</dd>
            </div>
            <div>
              <dt>Unidade</dt>
              <dd>{recurso?.unidade ?? "Não informada"}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="sec-recurso" className="detalhes-secao">
          <h2 id="sec-recurso">Recurso solicitado</h2>
          <dl className="detalhes-lista">
            <div>
              <dt>{recurso?.categoria ?? "Recurso"}</dt>
              <dd>
                {recurso?.nome ?? reserva.codigoRecurso}
                {recurso && <span className="muted"> ({recurso.codigo})</span>}
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="sec-motivo" className="detalhes-secao">
          <h2 id="sec-motivo">Motivo da reserva</h2>
          <p>{reserva.motivo}</p>
        </section>
      </article>
    </>
  );
}
