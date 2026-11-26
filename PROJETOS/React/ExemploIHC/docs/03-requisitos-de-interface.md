# 📋 Requisitos de interface (Aula 11)

> Estes quadros são o **protótipo dos requisitos**, não o desenho final da tela. O desenho final está no sistema e segue o [guia de estilo](../src/config/designSystem.js).

---

## Tela: Cadastro de Recursos Audiovisuais

**Requisito funcional:** o sistema deve permitir o cadastro dos recursos existentes.
**Como o usuário interage:** por uma tela tipo formulário, com os campos para preenchimento e os botões para salvar ou cancelar.
**Implementação:** `src/pages/CadastroRecurso/CadastroRecurso.jsx` · rota `/recursos/novo`

### Lista de campos

| # | Nome | Descrição | Valores válidos | Formato | Tipo | Restrições / Observações |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Código | Código do recurso audiovisual | Letras, números e hífen; único | Texto até 12 caracteres | Caixa de texto simples | Obrigatório. Convertido para maiúsculas |
| 2 | Nome | Nome do recurso audiovisual | Texto livre | Texto até 35 caracteres | Caixa de texto simples | Obrigatório |
| 3 | Unidade | Unidade da universidade a qual o recurso pertence | Unidades cadastradas no sistema | Lista limitada de opções | Caixa de seleção | Obrigatório |
| 4 | Categoria | Categoria do recurso | [Áudio, Visual] | Lista limitada de opções | Caixa de seleção | Obrigatório |
| 5 | Tipo Recurso | Tipo do recurso | Tipos da categoria escolhida (ex.: Data Show, Microfone) | Lista limitada de opções | Caixa de seleção | Obrigatório. Desabilitado até escolher a categoria |
| 6 | Observações | Informações adicionais sobre o recurso | Texto livre | Até 255 caracteres | Caixa de texto múltipla | Opcional. Contador de caracteres |

### Lista de comandos

| # | Nome | Descrição | Restrições / Observações |
| :-: | :--- | :--- | :--- |
| 7 | Cadastrar recurso | Salva os dados do recurso no sistema | Os dados devem estar corretos; senão, mostra o resumo de erros |
| 8 | Cancelar | Cancela o cadastro e volta para a lista | Se houver dados preenchidos, pede confirmação |

### Esboço

```
┌──────────────────────────────────────────────────────┐
│ Início › Recursos › Cadastrar recurso                 │
│ Cadastrar recurso                                     │
│ Campos marcados com * são obrigatórios.               │
│ ┌ Identificação ───────────────────────────────────┐ │
│ │ Código *            Nome *                        │ │
│ │ [____________]      [____________________]        │ │
│ └───────────────────────────────────────────────────┘ │
│ ┌ Classificação ───────────────────────────────────┐ │
│ │ Unidade *      Categoria *     Tipo do recurso *  │ │
│ │ [Selecione ▾]  [Selecione ▾]   [Escolha a cat. ▾] │ │
│ └───────────────────────────────────────────────────┘ │
│ ┌ Informações adicionais ──────────────────────────┐ │
│ │ Observações (opcional)                     0/255  │ │
│ │ [__________________________________________]      │ │
│ └───────────────────────────────────────────────────┘ │
│ [ Cadastrar recurso ]  [ Cancelar ]                   │
└──────────────────────────────────────────────────────┘
```

---

## Caso de uso: Confirmar Reserva de Alunos

**Cenário:** visualização, aprovação ou indeferimento de solicitações feitas por alunos.
**Como o usuário interage:** uma tela para pesquisar e visualizar as solicitações e outra para ver os detalhes de uma solicitação (2 telas para o mesmo caso de uso).

### Tela 1: Solicitações de alunos (`/reservas`)

| Campos | Comandos |
| :--- | :--- |
| Aluno (nome e matrícula) | Filtrar: Pendentes / Confirmadas / Rejeitadas |
| Recurso | Ver detalhes |
| Data e horário | Confirmar |
| Motivo da reserva | Rejeitar (com diálogo de confirmação) |
| Situação | Desfazer (no aviso, após confirmar ou rejeitar) |

### Tela 2: Detalhes de 1 reserva (`/reservas/:id`)

| Campos | Comandos |
| :--- | :--- |
| Aluno solicitante, Matrícula | Imprimir |
| Data da solicitação, Situação | Voltar para a lista |
| Data do empréstimo, Retirada, Devolução, Unidade | |
| Recurso solicitado | |
| Motivo da reserva | |

---

## Tela: Reservar recurso (`/reservar`)

| # | Nome | Etapa | Formato | Tipo | Restrições |
| :-: | :--- | :-: | :--- | :--- | :--- |
| 1 | Recurso | 1 | Um recurso cadastrado | Grupo de radios (cartões) | Obrigatório |
| 2 | Data | 2 | dd/mm/aaaa | Seletor de data nativo | Obrigatório. Não pode ser no passado. Padrão: hoje |
| 3 | Retirada | 2 | hh:mm | Seletor de hora nativo | Obrigatório. Padrão: 19:00 |
| 4 | Devolução | 2 | hh:mm | Seletor de hora nativo | Obrigatório. Depois da retirada. Padrão: 20:40 |
| 5 | Nome completo | 3 | Texto | Caixa de texto simples | Obrigatório. `autocomplete="name"` |
| 6 | Matrícula | 3 | 6 a 8 dígitos | Caixa de texto (teclado numérico) | Obrigatório. `inputmode="numeric"` |
| 7 | Motivo da reserva | 3 | Até 255 caracteres | Caixa de texto múltipla | Obrigatório |

| Comando | Descrição |
| :--- | :--- |
| Continuar | Valida a etapa atual e avança |
| Voltar | Volta à etapa anterior sem perder dados |
| Alterar | Na revisão, leva direto à etapa daquele bloco |
| Enviar solicitação | Envia e mostra o protocolo |
