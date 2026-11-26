import { useMemo, useRef, useState } from "react";
import { FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina";
import { CampoAreaTexto, CampoSelecao, CampoTexto, LegendaObrigatorio } from "../../components/Campo/Campo";
import DialogoConfirmacao from "../../components/DialogoConfirmacao/DialogoConfirmacao";
import ResumoErros from "../../components/ResumoErros/ResumoErros";
import { useToast } from "../../context/toastContext";
import { CATEGORIAS, TIPOS, UNIDADES } from "../../data/seed";
import useAvisoAoSair from "../../hooks/useAvisoAoSair";
import usePaginaTitulo from "../../hooks/usePaginaTitulo";
import { cadastrarRecurso, codigosCadastrados } from "../../services/recursoService";
import { LIMITES, validarRecurso } from "../../utils/validacao";
import "./CadastroRecurso.css";

const VAZIO = { codigo: "", nome: "", unidade: "", categoria: "", tipo: "", observacoes: "" };

/**
 * Tela "Cadastro de Recursos Audiovisuais" (Aula 11 - Requisitos de Interface).
 *
 * Implementa exatamente a Lista de Campos e a Lista de Comandos do slide:
 *   Campos:   Código, Nome, Unidade, Categoria, Tipo Recurso, Observações
 *   Comandos: Cadastrar, Cancelar
 * (a especificação completa está em docs/03-requisitos-de-interface.md)
 *
 * Boas práticas aplicadas:
 *  - Validação ao sair do campo e no envio, com resumo de erros focado.
 *  - "Tipo" só mostra os tipos da categoria escolhida (restringe entradas
 *    inválidas - prevenção de erros, Nielsen #5).
 *  - Cancelar com dados preenchidos pede confirmação.
 *  - Botão mostra "Cadastrando…" e não aceita clique duplo.
 */
export default function CadastroRecurso() {
  const tituloRef = usePaginaTitulo("Cadastrar recurso");
  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const resumoRef = useRef(null);

  const [dados, setDados] = useState(VAZIO);
  const [tocados, setTocados] = useState({});
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [confirmandoSaida, setConfirmandoSaida] = useState(false);

  const sujo = JSON.stringify(dados) !== JSON.stringify(VAZIO);
  useAvisoAoSair(sujo && !salvando);

  const todosErros = useMemo(() => validarRecurso(dados, codigosCadastrados()), [dados]);
  // Só mostra o erro de um campo depois que a pessoa passou por ele (ou tentou enviar)
  const erroDe = (campo) => (tentouEnviar || tocados[campo] ? todosErros[campo] : undefined);

  const tiposDaCategoria = TIPOS.filter((t) => t.categoria === dados.categoria).map((t) => t.nome);

  function alterar(e) {
    const { name, value } = e.target;
    setDados((d) => {
      const novo = { ...d, [name]: name === "codigo" ? value.toUpperCase() : value };
      // trocou a categoria: o tipo antigo pode não valer mais
      if (name === "categoria" && !TIPOS.some((t) => t.nome === d.tipo && t.categoria === value)) {
        novo.tipo = "";
      }
      return novo;
    });
  }

  const marcarTocado = (e) => setTocados((t) => ({ ...t, [e.target.name]: true }));

  async function enviar(e) {
    e.preventDefault();
    if (salvando) return;

    if (Object.keys(todosErros).length > 0) {
      setTentouEnviar(true);
      // espera o resumo aparecer para mover o foco até ele
      requestAnimationFrame(() => resumoRef.current?.focus());
      return;
    }

    setSalvando(true);
    const recurso = await cadastrarRecurso(dados);
    mostrarToast({ tipo: "sucesso", mensagem: `Recurso ${recurso.codigo} cadastrado.` });
    navigate("/recursos");
  }

  function cancelar() {
    if (sujo) setConfirmandoSaida(true);
    else navigate("/recursos");
  }

  return (
    <>
      <CabecalhoPagina
        ref={tituloRef}
        titulo="Cadastrar recurso"
        descricao="Inclua um equipamento no acervo para que alunos e professores possam reservá-lo."
        trilha={[{ rotulo: "Recursos", para: "/recursos" }, { rotulo: "Cadastrar recurso" }]}
      />

      <form className="formulario" onSubmit={enviar} noValidate>
        {tentouEnviar && <ResumoErros ref={resumoRef} erros={todosErros} />}

        <LegendaObrigatorio />

        <fieldset className="formulario-grupo">
          <legend>Identificação</legend>
          <div className="formulario-grade">
            <CampoTexto
              rotulo="Código"
              name="codigo"
              dica="Letras, números e hífen. Ex.: DS-CE-003"
              value={dados.codigo}
              onChange={alterar}
              onBlur={marcarTocado}
              erro={erroDe("codigo")}
              obrigatorio
              limite={LIMITES.codigo}
              autoComplete="off"
              spellCheck="false"
            />
            <CampoTexto
              rotulo="Nome"
              name="nome"
              dica="Como o recurso aparece para quem vai reservar."
              value={dados.nome}
              onChange={alterar}
              onBlur={marcarTocado}
              erro={erroDe("nome")}
              obrigatorio
              limite={LIMITES.nome}
              autoComplete="off"
            />
          </div>
        </fieldset>

        <fieldset className="formulario-grupo">
          <legend>Classificação</legend>
          <div className="formulario-grade formulario-grade-3">
            <CampoSelecao
              rotulo="Unidade"
              name="unidade"
              opcoes={UNIDADES}
              value={dados.unidade}
              onChange={alterar}
              onBlur={marcarTocado}
              erro={erroDe("unidade")}
              obrigatorio
            />
            <CampoSelecao
              rotulo="Categoria"
              name="categoria"
              opcoes={CATEGORIAS}
              value={dados.categoria}
              onChange={alterar}
              onBlur={marcarTocado}
              erro={erroDe("categoria")}
              obrigatorio
            />
            <CampoSelecao
              rotulo="Tipo do recurso"
              name="tipo"
              opcoes={tiposDaCategoria}
              textoVazio={dados.categoria ? "Selecione" : "Escolha a categoria"}
              value={dados.tipo}
              onChange={alterar}
              onBlur={marcarTocado}
              erro={erroDe("tipo")}
              obrigatorio
              disabled={!dados.categoria}
            />
          </div>
        </fieldset>

        <fieldset className="formulario-grupo">
          <legend>Informações adicionais</legend>
          <CampoAreaTexto
            rotulo="Observações (opcional)"
            name="observacoes"
            dica="Acessórios, cuidados no uso ou onde retirar."
            value={dados.observacoes}
            onChange={alterar}
            onBlur={marcarTocado}
            erro={erroDe("observacoes")}
            limite={LIMITES.observacoes}
          />
        </fieldset>

        {/* Ordem dos botões: ação principal primeiro, alinhados à esquerda,
            colados ao fim do formulário (proximidade) */}
        <div className="formulario-acoes">
          <Button type="submit" variante="primario" icone={FiSave} carregando={salvando} textoCarregando="Cadastrando…">
            Cadastrar recurso
          </Button>
          <Button variante="secundario" onClick={cancelar} disabled={salvando}>
            Cancelar
          </Button>
        </div>
      </form>

      <DialogoConfirmacao
        aberto={confirmandoSaida}
        titulo="Descartar o cadastro?"
        rotuloConfirmar="Descartar"
        rotuloCancelar="Continuar editando"
        onConfirmar={() => navigate("/recursos")}
        onCancelar={() => setConfirmandoSaida(false)}
      >
        <p>Os dados que você preencheu serão perdidos.</p>
      </DialogoConfirmacao>
    </>
  );
}
