# ♿ Acessibilidade: checklist e como testar (Aula 17)

Baseado na **WCAG 2.2, nível AA**, organizado pelos princípios **POUR**.

## Checklist

### Perceptível
- [x] Texto alternativo em imagens com conteúdo (`alt="PUC Minas"`); `aria-hidden` em ícones decorativos.
- [x] Contraste de texto ≥ 4,5:1 e de componentes ≥ 3:1 (medido em `/guia-de-estilo#contraste`).
- [x] Nenhuma informação só por cor: status, erro e seleção têm ícone e texto.
- [x] Funciona com zoom de 200% e com o texto em 150% (controle A+).
- [x] Respeita `prefers-reduced-motion` e `prefers-color-scheme`.

### Operável
- [x] Tudo funciona só com teclado (Tab, Shift+Tab, Enter, Espaço, setas nos radios, Esc no diálogo).
- [x] Link “Pular para o conteúdo” como primeiro item focável.
- [x] Foco sempre visível (anel duplo que funciona no claro e no escuro).
- [x] Alvos de toque com pelo menos 44 × 44px.
- [x] Avisos automáticos pausam com mouse ou foco em cima.
- [x] Títulos de página únicos (`document.title`) a cada rota.

### Compreensível
- [x] `lang="pt-BR"` no `<html>`.
- [x] Rótulos visíveis em todos os campos; dicas ligadas por `aria-describedby`.
- [x] Erros dizem o que fazer, com resumo no topo e link para cada campo.
- [x] Navegação e componentes consistentes em todas as telas.
- [x] Confirmação antes de ações destrutivas, e “Desfazer” depois.

### Robusto
- [x] HTML semântico: `header`, `nav`, `main`, `footer`, `section`, `dl`, `table` com `caption` e `th scope`.
- [x] ARIA só onde o HTML não basta: `aria-current`, `aria-live`, `aria-invalid`, `aria-pressed`.
- [x] Diálogo com o elemento nativo `<dialog>`.

## Como testar

| Teste | Ferramenta | O que observar |
| :--- | :--- | :--- |
| Automático | Lighthouse (DevTools › Lighthouse › Acessibilidade) | Pontuação e itens reprovados |
| Automático | [WAVE](https://wave.webaim.org/extension/) ou [axe DevTools](https://www.deque.com/axe/devtools/) | Erros de contraste, rótulos, ARIA |
| Automático (governo BR) | [ASES](https://asesweb.governoeletronico.gov.br/) | Avaliação pelo eMAG |
| Teclado | Só o teclado, sem mouse | Dá para concluir todas as tarefas? O foco aparece sempre? |
| Leitor de tela | NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android) | Títulos, rótulos e avisos são anunciados? |
| Zoom | Ctrl + até 200% e controle A+ | Nada corta nem sobrepõe |
| Daltonismo | DevTools › Rendering › Emulate vision deficiencies | Status e erros continuam compreensíveis |

> Testes automáticos encontram só parte dos problemas. O teste com teclado e leitor de tela é obrigatório.
