# 💡 Design Thinking (Aula 8)

Registro das fases de Design Thinking que deram origem ao sistema. Use este arquivo como **modelo** para o seu projeto: troque o conteúdo, mantenha as seções.

## 1. Desafio inicial

> Como podemos facilitar a reserva de equipamentos audiovisuais na PUC Minas?

## 2. Entendimento (perguntas iniciais)

- Como alunos e professores reservam equipamento hoje?
- Quem aprova e como fica sabendo dos pedidos?
- O que acontece quando o equipamento não está disponível?
- Em que momento do dia as reservas acontecem? Pelo celular ou computador?

## 3. Observação (pesquisa)

Entrevistas com roteiro (não questionário), em duplas (entrevistador + documentarista), falando 20% e ouvindo 80%.

| Perfil | Quem | Principal dor |
| :--- | :--- | :--- |
| Aluno | Graduação, noturno | Pede por e-mail, não sabe se foi aceito, descobre na hora da aula |
| Professor | Docente de várias unidades | Não sabe quais equipamentos cada unidade tem |
| Setor audiovisual | Funcionário da unidade | Pedidos espalhados em e-mail, WhatsApp e papel |
| Coordenação | Coordenador de núcleo | Acervo desatualizado, sem código padronizado |

### Mapa de empatia: aluno

| Quadrante | Respostas |
| :--- | :--- |
| **O que pensa e sente?** | “Vou apresentar amanhã e não sei se vou ter data show.” Ansiedade com a nota. |
| **O que escuta?** | Colegas dizem que “é só chegar cedo e pedir no balcão”. |
| **O que vê?** | Fila no setor, avisos em papel, e-mails sem resposta. |
| **O que fala e faz?** | Manda e-mail, pergunta no grupo da turma, leva o próprio projetor. |
| **Fraquezas (dores)** | Incerteza, retrabalho, depende do horário do setor. |
| **Ganhos** | Saber na hora se deu certo; ter um número de protocolo. |

## 4. Ponto de vista (desafio redefinido)

> **Alunos do noturno** precisam **saber com antecedência se terão o equipamento**, porque **a apresentação vale nota e não há tempo de resolver na hora**.

## 5. Ideação

Brainstorm com as 7 regras (uma conversa por vez, quantidade importa, construa sobre a ideia dos outros, encoraje ideias doidas, seja visual, mantenha o foco, não critique). Ideias selecionadas:

1. Reserva on-line em poucos passos, com protocolo.
2. Lista única de pedidos pendentes para o setor, com aprovar/rejeitar em um clique.
3. Cadastro padronizado de recursos por unidade.

## 6. Prototipagem

- Baixa fidelidade: [lista de campos e comandos](03-requisitos-de-interface.md).
- Alta fidelidade: este sistema React.

## 7. Teste e iteração

Roteiro sugerido para o teste de usabilidade com 5 usuários:

| # | Tarefa | Sucesso quando |
| :-: | :--- | :--- |
| 1 | Reserve um microfone para amanhã às 10h. | Chega na tela “Solicitação enviada”. |
| 2 | Descubra quantos recursos de áudio existem em Contagem. | Responde “1”. |
| 3 | (Setor) Rejeite o pedido do Cezar e depois desfaça. | Pedido volta a “Pendente”. |
| 4 | (Coordenação) Cadastre um data show na unidade Betim. | Recurso aparece na lista. |

Meça: taxa de sucesso, tempo, erros e satisfação (ex.: SUS). Volte às fases anteriores conforme os resultados.
