import { useEffect, useState } from "react";
import { FiCheck, FiInbox, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina";
import DialogoConfirmacao from "../../components/DialogoConfirmacao/DialogoConfirmacao";
import EstadoVazio from "../../components/EstadoVazio/EstadoVazio";
import Skeleton from "../../components/Skeleton/Skeleton";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { useToast } from "../../context/toastContext";
import usePaginaTitulo from "../../hooks/usePaginaTitulo";
import { buscarRecurso } from "../../services/recursoService";
import { alterarStatus, listarReservas } from "../../services/reservaService";
import { formatarData } from "../../utils/datas";
import "./ConfirmarReservas.css";

const FILTROS = [
  { valor: "pendente", rotulo: "Pendentes" },
  { valor: "confirmada", rotulo: "Confirmadas" },
  { valor: "rejeitada", rotulo: "Rejeitadas" },
];

/**
 * Caso de uso "Confirmar Reserva de Alunos" (Aula 11).
 *
 * Campos: Aluno, Recurso, Motivo da Reserva
 * Comandos: Visualizar, Confirmar, Rejeitar
 *
 * Melhorias de IHC em relação ao protótipo do slide:
 *  - Os comandos têm TEXTO e ícone (no slide eram só ✓ e ✗, ambíguos e
 *    sem nome para o leitor de tela).
 *  - Rejeitar pede confirmação (ação com impacto para o aluno).
 *  - Confirmar e rejeitar podem ser DESFEITOS pelo aviso (Nielsen #3).
 *  - Tabela com <caption> e cabeçalhos <th scope>: o leitor de tela diz
 *    "Aluno: Ismael" ao navegar pelas células.
 *  - No celular, cada linha vira um cartão (tabela larga não cabe).
 */
export default function ConfirmarReservas() {
  const tituloRef = usePaginaTitulo("Confirmar reservas");
  const { mostrarToast } = useToast();
  const [reservas, setReservas] = useState(null);
  const [filtro, setFiltro] = useState("pendente");
  const [rejeitando, setRejeitando] = useState(null);

  useEffect(() => {
    let ativo = true;
    listarReservas().then((lista) => ativo && setReservas(lista));
    return () => {
      ativo = false;
    };
  }, []);

  function mudarStatus(reserva, status) {
    const anterior = alterarStatus(reserva.id, status);
    setReservas((lista) => lista.map((r) => (r.id === reserva.id ? { ...r, status } : r)));

    mostrarToast({
      tipo: status === "confirmada" ? "sucesso" : "info",
      mensagem: `Reserva de ${reserva.aluno.split(" ")[0]} ${status}.`,
      acao: {
        rotulo: "Desfazer",
        onClick: () => {
          alterarStatus(reserva.id, anterior);
          setReservas((lista) => lista.map((r) => (r.id === reserva.id ? { ...r, status: anterior } : r)));
        },
      },
    });
  }

  const contagem = (status) => reservas?.filter((r) => r.status === status).length ?? 0;
  const visiveis = (reservas ?? []).filter((r) => r.status === filtro);

  return (
    <>
      <CabecalhoPagina
        ref={tituloRef}
        titulo="Confirmar reservas de alunos"
        descricao="Analise os pedidos e confirme ou rejeite cada um. O aluno é avisado na hora."
        trilha={[{ rotulo: "Confirmar reservas" }]}
      />

      <fieldset className="reservas-filtro">
        <legend className="sr-only">Mostrar reservas</legend>
        <div className="segmentado">
          {FILTROS.map((f) => (
            <label key={f.valor} className="segmentado-opcao">
              <input
                type="radio"
                name="filtro-status"
                value={f.valor}
                checked={filtro === f.valor}
                onChange={() => setFiltro(f.valor)}
              />
              <span>
                {f.rotulo}
                {reservas && <span className="reservas-contador">{contagem(f.valor)}</span>}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {reservas === null && <Skeleton quantidade={3} linhas={2} rotulo="Carregando reservas…" />}

      {reservas && visiveis.length === 0 && (
        <EstadoVazio
          icone={FiInbox}
          titulo={filtro === "pendente" ? "Tudo em dia" : `Nenhuma reserva ${FILTROS.find((f) => f.valor === filtro).rotulo.toLowerCase()}`}
        >
          <p>
            {filtro === "pendente"
              ? "Não há pedidos aguardando confirmação. Novos pedidos aparecem aqui."
              : "As reservas que você analisar aparecem aqui."}
          </p>
        </EstadoVazio>
      )}

      {visiveis.length > 0 && (
        <div className="tabela-rolagem">
          <table className="tabela">
            <caption className="sr-only">
              Reservas {FILTROS.find((f) => f.valor === filtro).rotulo.toLowerCase()}: {visiveis.length}
            </caption>
            <thead>
              <tr>
                <th scope="col">Aluno</th>
                <th scope="col">Recurso</th>
                <th scope="col">Data e horário</th>
                <th scope="col">Motivo da reserva</th>
                <th scope="col">Situação</th>
                <th scope="col">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((r) => (
                <tr key={r.id}>
                  <th scope="row" data-rotulo="Aluno">
                    {r.aluno}
                    <span className="tabela-sub">Matrícula {r.matricula}</span>
                  </th>
                  <td data-rotulo="Recurso">{buscarRecurso(r.codigoRecurso)?.nome ?? r.codigoRecurso}</td>
                  <td data-rotulo="Data e horário">
                    {formatarData(r.data)}
                    <span className="tabela-sub">
                      {r.inicio} às {r.fim}
                    </span>
                  </td>
                  <td data-rotulo="Motivo" className="tabela-motivo">
                    {r.motivo}
                  </td>
                  <td data-rotulo="Situação">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="tabela-acoes">
                    <Link to={`/reservas/${r.id}`} className="btn btn-fantasma btn-sm">
                      Ver detalhes<span className="sr-only"> da reserva de {r.aluno}</span>
                    </Link>
                    {r.status === "pendente" && (
                      <>
                        <Button tamanho="sm" icone={FiCheck} onClick={() => mudarStatus(r, "confirmada")}>
                          Confirmar<span className="sr-only"> reserva de {r.aluno}</span>
                        </Button>
                        <Button tamanho="sm" variante="perigo" icone={FiX} onClick={() => setRejeitando(r)}>
                          Rejeitar<span className="sr-only"> reserva de {r.aluno}</span>
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DialogoConfirmacao
        aberto={Boolean(rejeitando)}
        titulo={`Rejeitar a reserva de ${rejeitando?.aluno ?? ""}?`}
        rotuloConfirmar="Rejeitar reserva"
        onCancelar={() => setRejeitando(null)}
        onConfirmar={() => {
          mudarStatus(rejeitando, "rejeitada");
          setRejeitando(null);
        }}
      >
        <p>O aluno será avisado de que o pedido não foi aceito e precisará fazer uma nova solicitação.</p>
      </DialogoConfirmacao>
    </>
  );
}
