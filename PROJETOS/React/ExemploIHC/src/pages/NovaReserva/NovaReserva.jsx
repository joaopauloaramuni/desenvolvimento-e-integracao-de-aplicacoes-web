import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiEdit2, FiSave, FiSend } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import Alerta from "../../components/Alerta/Alerta";
import Button from "../../components/Button/Button";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina";
import { CampoAreaTexto, CampoTexto, LegendaObrigatorio } from "../../components/Campo/Campo";
import ResumoErros from "../../components/ResumoErros/ResumoErros";
import Skeleton from "../../components/Skeleton/Skeleton";
import Stepper from "../../components/Stepper/Stepper";
import { UNIDADES } from "../../data/seed";
import usePaginaTitulo from "../../hooks/usePaginaTitulo";
import useRascunho from "../../hooks/useRascunho";
import { listarRecursos } from "../../services/recursoService";
import { criarReserva } from "../../services/reservaService";
import { formatarData, formatarDataLonga, hojeISO } from "../../utils/datas";
import { iconeDoTipo } from "../../utils/icones";
import { LIMITES, validarEtapaReserva } from "../../utils/validacao";
import "./NovaReserva.css";

const ETAPAS = ["Recurso", "Data e horário", "Seus dados", "Revisão"];

// Padrões sensatos (Aula 18): hoje e o horário mais comum das aulas noturnas
const INICIAL = {
  codigoRecurso: "",
  data: hojeISO(),
  inicio: "19:00",
  fim: "20:40",
  aluno: "",
  matricula: "",
  motivo: "",
};

function duracao(inicio, fim) {
  if (!inicio || !fim || fim <= inicio) return null;
  const [h1, m1] = inicio.split(":").map(Number);
  const [h2, m2] = fim.split(":").map(Number);
  const total = h2 * 60 + m2 - (h1 * 60 + m1);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return [h && `${h} h`, m && `${m} min`].filter(Boolean).join(" ");
}

/**
 * Formulário de reserva em etapas.
 *
 * Aplica as recomendações de formulário mobile da Aula 18 (Shneiderman):
 *  - formulário longo quebrado em etapas, com indicador de progresso;
 *  - só os dados necessários, em ordem lógica;
 *  - padrões sensatos (data de hoje, horário comum);
 *  - rótulos acima dos campos e teclado certo para cada dado
 *    (type="date", type="time", inputMode="numeric");
 *  - rascunho salvo automaticamente (conexão instável);
 *  - revisão antes de enviar, com atalho para corrigir cada parte.
 *
 * A decomposição desta tarefa está no diagrama HTA de
 * docs/02-analise-de-tarefas.md.
 */
export default function NovaReserva() {
  const tituloRef = usePaginaTitulo("Reservar recurso");
  const [params] = useSearchParams();
  const codigoDaUrl = params.get("recurso");

  const [dados, setDados, descartarRascunho] = useRascunho("rascunho-reserva", INICIAL);
  const [etapa, setEtapa] = useState(() => (codigoDaUrl ? 1 : 0));
  const [recursos, setRecursos] = useState(null);
  const [unidadeFiltro, setUnidadeFiltro] = useState("");
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [protocolo, setProtocolo] = useState(null);

  // O rascunho foi recuperado de outra visita?
  const [recuperouRascunho] = useState(
    () => JSON.stringify({ ...INICIAL, ...dados, data: INICIAL.data }) !== JSON.stringify(INICIAL)
  );

  const tituloEtapaRef = useRef(null);
  const resumoRef = useRef(null);
  const sucessoRef = useRef(null);
  const primeiraRenderizacao = useRef(true);

  useEffect(() => {
    if (codigoDaUrl) setDados((d) => ({ ...d, codigoRecurso: codigoDaUrl }));
  }, [codigoDaUrl, setDados]);

  useEffect(() => {
    let ativo = true;
    listarRecursos().then((lista) => ativo && setRecursos(lista));
    return () => {
      ativo = false;
    };
  }, []);

  // A cada troca de etapa, o foco vai para o título da etapa (leitor de tela anuncia)
  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }
    tituloEtapaRef.current?.focus();
  }, [etapa]);

  useEffect(() => {
    if (protocolo) sucessoRef.current?.focus();
  }, [protocolo]);

  const recursoEscolhido = recursos?.find((r) => r.codigo === dados.codigoRecurso);
  const listaFiltrada = useMemo(
    () => (recursos ?? []).filter((r) => !unidadeFiltro || r.unidade === unidadeFiltro),
    [recursos, unidadeFiltro]
  );

  function alterar(e) {
    const { name, value } = e.target;
    setDados((d) => ({ ...d, [name]: name === "matricula" ? value.replace(/\D/g, "") : value }));
    if (erros[name]) setErros((atual) => ({ ...atual, [name]: undefined }));
  }

  function validarEAvancar(proxima) {
    const novos = validarEtapaReserva(etapa, dados, hojeISO());
    if (Object.keys(novos).length > 0) {
      setErros(novos);
      requestAnimationFrame(() => resumoRef.current?.focus());
      return;
    }
    setErros({});
    setEtapa(proxima);
  }

  async function enviar() {
    if (enviando) return;
    // revalida tudo antes de enviar (o rascunho pode ter ficado velho)
    for (let i = 0; i < 3; i++) {
      const errosEtapa = validarEtapaReserva(i, dados, hojeISO());
      if (Object.keys(errosEtapa).length > 0) {
        setErros(errosEtapa);
        setEtapa(i);
        return;
      }
    }
    setEnviando(true);
    const reserva = await criarReserva(dados);
    descartarRascunho();
    setProtocolo(reserva.id);
  }

  function recomecar() {
    descartarRascunho();
    setProtocolo(null);
    setErros({});
    setEtapa(0);
    setEnviando(false);
  }

  const errosVisiveis = Object.fromEntries(Object.entries(erros).filter(([, v]) => v));

  // ------------------------------------------------------------------ sucesso
  if (protocolo) {
    return (
      <>
        <CabecalhoPagina ref={tituloRef} titulo="Reservar recurso" trilha={[{ rotulo: "Reservar recurso" }]} />
        <section className="reserva-sucesso" aria-labelledby="sucesso-titulo">
          <FiCheckCircle className="reserva-sucesso-icone" aria-hidden="true" />
          <h2 id="sucesso-titulo" ref={sucessoRef} tabIndex={-1}>
            Solicitação enviada
          </h2>
          <p>
            Seu protocolo é <strong className="reserva-protocolo">{protocolo}</strong>. O setor audiovisual da unidade vai
            analisar o pedido em até 1 dia útil.
          </p>
          <div className="reserva-sucesso-acoes">
            <Button para={`/reservas/${protocolo}`} variante="primario">
              Ver a solicitação
            </Button>
            <Button variante="secundario" onClick={recomecar}>
              Fazer outra reserva
            </Button>
          </div>
        </section>
      </>
    );
  }

  // ---------------------------------------------------------------- etapas
  return (
    <>
      <CabecalhoPagina
        ref={tituloRef}
        titulo="Reservar recurso"
        descricao="Leva cerca de 2 minutos. O que você preencher fica salvo neste navegador até o envio."
        trilha={[{ rotulo: "Reservar recurso" }]}
      />

      <div className="reserva">
        <Stepper etapas={ETAPAS} atual={etapa} />

        {recuperouRascunho && etapa === 0 && (
          <Alerta tipo="info" titulo="Continuamos de onde você parou">
            <p>Recuperamos o rascunho da sua última visita.</p>
            <button type="button" className="reserva-link-botao" onClick={recomecar}>
              Começar de novo
            </button>
          </Alerta>
        )}

        <ResumoErros ref={resumoRef} erros={errosVisiveis} />

        <section className="reserva-etapa" aria-labelledby="titulo-etapa">
          <h2 id="titulo-etapa" ref={tituloEtapaRef} tabIndex={-1} className="reserva-etapa-titulo">
            {["Qual recurso você precisa?", "Quando você vai usar?", "Seus dados e o motivo", "Confira antes de enviar"][etapa]}
          </h2>

          {/* -------- Etapa 1: Recurso -------- */}
          {etapa === 0 && (
            <>
              <div className="reserva-filtro">
                <label htmlFor="filtro-unidade" className="campo-rotulo">
                  Unidade
                </label>
                <select
                  id="filtro-unidade"
                  className="campo-controle campo-select"
                  value={unidadeFiltro}
                  onChange={(e) => setUnidadeFiltro(e.target.value)}
                >
                  <option value="">Todas as unidades</option>
                  {UNIDADES.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>

              {recursos === null ? (
                <Skeleton quantidade={4} linhas={2} rotulo="Carregando recursos…" />
              ) : (
                <fieldset className="reserva-opcoes" aria-invalid={erros.codigoRecurso ? true : undefined}>
                  <legend className="sr-only">Recurso</legend>
                  {listaFiltrada.length === 0 && <p className="muted">Nenhum recurso nesta unidade.</p>}
                  {listaFiltrada.map((r) => {
                    const Icone = iconeDoTipo(r.tipo);
                    return (
                      <label key={r.codigo} className="reserva-opcao">
                        <input
                          type="radio"
                          name="codigoRecurso"
                          value={r.codigo}
                          checked={dados.codigoRecurso === r.codigo}
                          onChange={alterar}
                        />
                        <span className="reserva-opcao-caixa">
                          <Icone aria-hidden="true" className="reserva-opcao-icone" />
                          <span>
                            <span className="reserva-opcao-nome">{r.nome}</span>
                            <span className="reserva-opcao-meta">
                              {r.tipo}, {r.unidade}
                            </span>
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </fieldset>
              )}
            </>
          )}

          {/* -------- Etapa 2: Data e horário -------- */}
          {etapa === 1 && (
            <>
              {recursoEscolhido && (
                <p className="reserva-escolhido">
                  Recurso: <strong>{recursoEscolhido.nome}</strong> ({recursoEscolhido.unidade}).{" "}
                  <button type="button" className="reserva-link-botao" onClick={() => setEtapa(0)}>
                    Trocar recurso
                  </button>
                </p>
              )}
              <LegendaObrigatorio />
              <div className="formulario-grade formulario-grade-3">
                <CampoTexto
                  rotulo="Data"
                  name="data"
                  type="date"
                  min={hojeISO()}
                  value={dados.data}
                  onChange={alterar}
                  erro={erros.data}
                  obrigatorio
                />
                <CampoTexto
                  rotulo="Retirada"
                  name="inicio"
                  type="time"
                  step="600"
                  value={dados.inicio}
                  onChange={alterar}
                  erro={erros.inicio}
                  obrigatorio
                />
                <CampoTexto
                  rotulo="Devolução"
                  name="fim"
                  type="time"
                  step="600"
                  value={dados.fim}
                  onChange={alterar}
                  erro={erros.fim}
                  obrigatorio
                />
              </div>
              {duracao(dados.inicio, dados.fim) && (
                <p className="reserva-duracao">
                  {formatarDataLonga(dados.data)}, por {duracao(dados.inicio, dados.fim)}.
                </p>
              )}
            </>
          )}

          {/* -------- Etapa 3: Seus dados -------- */}
          {etapa === 2 && (
            <>
              <LegendaObrigatorio />
              <div className="formulario-grade">
                <CampoTexto
                  rotulo="Nome completo"
                  name="aluno"
                  value={dados.aluno}
                  onChange={alterar}
                  erro={erros.aluno}
                  obrigatorio
                  autoComplete="name"
                />
                <CampoTexto
                  rotulo="Matrícula"
                  name="matricula"
                  dica="Só números, como no seu cartão de estudante."
                  value={dados.matricula}
                  onChange={alterar}
                  erro={erros.matricula}
                  obrigatorio
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={8}
                />
              </div>
              <CampoAreaTexto
                rotulo="Motivo da reserva"
                name="motivo"
                dica="Ex.: Apresentação do trabalho de IHC para a turma."
                value={dados.motivo}
                onChange={alterar}
                erro={erros.motivo}
                obrigatorio
                limite={LIMITES.motivo}
              />
            </>
          )}

          {/* -------- Etapa 4: Revisão -------- */}
          {etapa === 3 && (
            <div className="reserva-revisao">
              {[
                {
                  titulo: "Recurso",
                  alvo: 0,
                  itens: [
                    ["Recurso", recursoEscolhido?.nome ?? dados.codigoRecurso],
                    ["Unidade", recursoEscolhido?.unidade],
                  ],
                },
                {
                  titulo: "Data e horário",
                  alvo: 1,
                  itens: [
                    ["Data", formatarData(dados.data)],
                    ["Horário", `${dados.inicio} às ${dados.fim}`],
                  ],
                },
                {
                  titulo: "Seus dados",
                  alvo: 2,
                  itens: [
                    ["Nome", dados.aluno],
                    ["Matrícula", dados.matricula],
                    ["Motivo", dados.motivo],
                  ],
                },
              ].map((bloco) => (
                <div key={bloco.titulo} className="reserva-revisao-bloco">
                  <div className="reserva-revisao-topo">
                    <h3>{bloco.titulo}</h3>
                    <Button variante="fantasma" tamanho="sm" icone={FiEdit2} onClick={() => setEtapa(bloco.alvo)}>
                      Alterar<span className="sr-only"> {bloco.titulo.toLowerCase()}</span>
                    </Button>
                  </div>
                  <dl>
                    {bloco.itens.map(([rotulo, valor]) => (
                      <div key={rotulo} className="reserva-revisao-item">
                        <dt>{rotulo}</dt>
                        <dd>{valor}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* -------- Navegação entre etapas -------- */}
        <div className="reserva-navegacao">
          {etapa > 0 ? (
            <Button variante="secundario" icone={FiArrowLeft} onClick={() => { setErros({}); setEtapa(etapa - 1); }}>
              Voltar
            </Button>
          ) : (
            <Link to="/" className="btn btn-fantasma btn-md">
              Cancelar
            </Link>
          )}

          {etapa < 3 ? (
            <Button variante="primario" iconeFinal={FiArrowRight} onClick={() => validarEAvancar(etapa + 1)}>
              Continuar
            </Button>
          ) : (
            <Button variante="destaque" icone={FiSend} carregando={enviando} textoCarregando="Enviando…" onClick={enviar}>
              Enviar solicitação
            </Button>
          )}
        </div>

        <p className="reserva-rascunho" aria-hidden="true">
          <FiSave /> Rascunho salvo automaticamente
        </p>
      </div>
    </>
  );
}
