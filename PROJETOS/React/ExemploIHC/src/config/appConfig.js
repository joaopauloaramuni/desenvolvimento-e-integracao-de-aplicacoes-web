import {
  FiBookOpen,
  FiCalendar,
  FiCheckSquare,
  FiHome,
  FiLayers,
  FiMonitor,
} from "react-icons/fi";

/**
 * Configuração central da aplicação.
 *
 * O menu é definido UMA vez aqui e usado pelo cabeçalho (desktop) e pela
 * barra inferior (mobile). Mesma ordem, mesmos nomes e mesmos ícones nas
 * duas versões = consistência (Nielsen #4) e continuidade entre dispositivos
 * (Aula 18).
 */
export const APP = {
  nome: "Recursos Audiovisuais",
  instituicao: "PUC Minas",
  disciplina: "Interação Humano-Computador",
};

// emMobile: aparece na barra inferior do celular (máx. 5 itens, zona do polegar)
export const MENU = [
  { rota: "/", rotulo: "Início", icone: FiHome, emMobile: true },
  { rota: "/recursos", rotulo: "Recursos", icone: FiMonitor, emMobile: true },
  { rota: "/reservar", rotulo: "Reservar", icone: FiCalendar, emMobile: true },
  { rota: "/reservas", rotulo: "Confirmar reservas", rotuloCurto: "Aprovar", icone: FiCheckSquare, emMobile: true },
  { rota: "/guia-de-estilo", rotulo: "Guia de estilo", icone: FiLayers, emMobile: false },
  { rota: "/boas-praticas", rotulo: "Boas práticas", icone: FiBookOpen, emMobile: false },
];

// Tempo simulado de rede, para mostrar os estados de carregamento (skeleton)
export const LATENCIA_SIMULADA_MS = 450;

// Tempo que o aviso com "Desfazer" fica na tela (WCAG 2.2.1: tempo suficiente)
export const DURACAO_TOAST_MS = 8000;
