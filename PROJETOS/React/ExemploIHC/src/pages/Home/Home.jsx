import { useEffect, useState } from "react";
import { FiBookOpen, FiCalendar, FiCheckSquare, FiLayers, FiPlusSquare } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import usePaginaTitulo from "../../hooks/usePaginaTitulo";
import { listarReservas } from "../../services/reservaService";
import "./Home.css";

/**
 * Início orientado a TAREFAS (Aula 9): em vez de listar funcionalidades,
 * a página leva direto à tarefa de cada perfil levantado na análise
 * (aluno, setor audiovisual, coordenação).
 *
 * Só existe UM botão na cor de destaque: a ação principal da tela
 * (regra 60-30-10 e "uma ação principal por tela" - Aulas 16 e 18).
 */
export default function Home() {
  const tituloRef = usePaginaTitulo("Início");
  const [pendentes, setPendentes] = useState(null);

  useEffect(() => {
    let ativo = true;
    listarReservas().then((lista) => {
      if (ativo) setPendentes(lista.filter((r) => r.status === "pendente").length);
    });
    return () => {
      ativo = false;
    };
  }, []);

  let textoPendentes = "Contando pedidos…";
  if (pendentes === 0) textoPendentes = "Nenhum pedido aguardando";
  else if (pendentes === 1) textoPendentes = "1 pedido aguardando";
  else if (pendentes > 1) textoPendentes = `${pendentes} pedidos aguardando`;

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-titulo">
        <div className="home-hero-texto">
          <h1 id="home-titulo" ref={tituloRef} tabIndex={-1}>
            Reserve data show, microfone e caixa de som para sua aula ou evento
          </h1>
          <p className="home-hero-sub">
            Escolha o equipamento, informe o dia e o horário e envie o pedido. O setor audiovisual da sua unidade
            responde em até 1 dia útil.
          </p>
          <div className="home-hero-acoes">
            <Button para="/reservar" variante="destaque" tamanho="lg" icone={FiCalendar}>
              Reservar um recurso
            </Button>
            <Button para="/recursos" variante="secundario" tamanho="lg">
              Ver recursos disponíveis
            </Button>
          </div>
        </div>

        <div className="home-passos-caixa">
          <h2 className="home-passos-titulo">Como funciona</h2>
          <ol className="home-passos">
            <li>
              <strong>Escolha o recurso</strong>
              <span>Filtre por unidade e categoria.</span>
            </li>
            <li>
              <strong>Informe data e horário</strong>
              <span>Retirada e devolução no mesmo dia.</span>
            </li>
            <li>
              <strong>Conte o motivo</strong>
              <span>Uma frase basta.</span>
            </li>
            <li>
              <strong>Revise e envie</strong>
              <span>Você recebe um número de protocolo.</span>
            </li>
          </ol>
        </div>
      </section>

      <section aria-labelledby="home-tarefas" className="home-secao">
        <h2 id="home-tarefas">Outras tarefas</h2>
        <ul className="home-tarefas">
          <li>
            <Link to="/reservas" className="home-tarefa">
              <FiCheckSquare aria-hidden="true" className="home-tarefa-icone" />
              <span className="home-tarefa-titulo">Confirmar reservas de alunos</span>
              <span className="home-tarefa-texto">Para o setor audiovisual: aprove ou rejeite os pedidos.</span>
              <span className="home-tarefa-meta">{textoPendentes}</span>
            </Link>
          </li>
          <li>
            <Link to="/recursos/novo" className="home-tarefa">
              <FiPlusSquare aria-hidden="true" className="home-tarefa-icone" />
              <span className="home-tarefa-titulo">Cadastrar recurso</span>
              <span className="home-tarefa-texto">Para a coordenação: inclua um equipamento novo no acervo.</span>
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="home-exemplo" className="home-exemplo">
        <h2 id="home-exemplo">Este sistema é um projeto exemplo de IHC</h2>
        <p>
          Cada tela aplica o conteúdo da disciplina: análise de tarefas, requisitos de interface, tipografia, cores,
          design system, acessibilidade e mobile. Use como ponto de partida para o seu trabalho.
        </p>
        <div className="home-exemplo-links">
          <Link to="/boas-praticas" className="home-exemplo-link">
            <FiBookOpen aria-hidden="true" />
            Ver as boas práticas e onde cada uma foi aplicada
          </Link>
          <Link to="/guia-de-estilo" className="home-exemplo-link">
            <FiLayers aria-hidden="true" />
            Abrir o guia de estilo
          </Link>
        </div>
      </section>
    </div>
  );
}
