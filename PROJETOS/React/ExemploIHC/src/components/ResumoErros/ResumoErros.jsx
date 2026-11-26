import { forwardRef } from "react";
import Alerta from "../Alerta/Alerta";
import "./ResumoErros.css";

/**
 * Resumo de erros no topo do formulário (padrão do GOV.UK Design System).
 *
 * Ao enviar com erro, o foco vai para este resumo: o leitor de tela anuncia
 * quantos problemas existem e cada item é um link que leva direto ao campo.
 * Recebe { nomeDoCampo: "mensagem" } e um mapa { nomeDoCampo: idDoCampo }.
 */
const ResumoErros = forwardRef(function ResumoErros({ erros, idsCampos = {} }, ref) {
  const lista = Object.entries(erros);
  if (lista.length === 0) return null;

  const irParaCampo = (e, nome) => {
    e.preventDefault();
    const campo = document.getElementById(idsCampos[nome]) ?? document.querySelector(`[name="${nome}"]`);
    campo?.focus();
  };

  return (
    <div ref={ref} tabIndex={-1} className="resumo-erros" role="alert">
      <Alerta tipo="erro" titulo={lista.length === 1 ? "Corrija 1 campo para continuar" : `Corrija ${lista.length} campos para continuar`}>
        <ul>
          {lista.map(([nome, mensagem]) => (
            <li key={nome}>
              <a href={`#${idsCampos[nome] ?? nome}`} onClick={(e) => irParaCampo(e, nome)}>
                {mensagem}
              </a>
            </li>
          ))}
        </ul>
      </Alerta>
    </div>
  );
});

export default ResumoErros;
