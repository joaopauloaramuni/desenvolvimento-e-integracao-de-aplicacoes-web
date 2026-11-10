# Projeto PixGenerator (React + Vite) 💠

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://pix-generator.vercel.app/)

👉 **[pix-generator.vercel.app](https://pix-generator.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

Gerador de **Pix** feito com **React**, **Vite** e [**qrcode.react**](https://github.com/zpao/qrcode.react). Você informa a chave, o nome e a cidade de quem recebe (e, se quiser, o valor) e recebe o **QR Code** e o **Pix copia e cola**, prontos para qualquer app de banco.

O código é o **BR Code** do Banco Central, montado **campo a campo** no próprio navegador, com o **CRC16** no final. A página mostra cada campo pintado de uma cor, para você entender exatamente o que está dentro do "copia e cola".

Este projeto **não usa API externa nem chave**: não precisa de `.env.local` nem de variável na Vercel. Nenhum dado sai do navegador.

- 🔑 Chaves **CPF**, **CNPJ** (inclusive o **CNPJ alfanumérico** de 2026), **e-mail**, **celular** e **aleatória**, com validação dos dígitos verificadores;
- 💰 **Valor fixo** ou **livre** (quem paga digita), **identificador** (txid), **descrição** e opção de **uso único**;
- 🔳 **QR Code** em três tamanhos, **Baixar PNG** (1024 × 1024) e **Baixar SVG**;
- 📋 **Copiar código** com um clique;
- 🔬 **Campos do código**: o BR Code colorido + tabela ID · tamanho · nome · valor (passe o mouse para destacar);
- 🔍 **Leitor**: cole um Pix copia e cola, confira o **CRC16** e veja os campos (com botão **Corrigir CRC**).

| Componente | O que mostra |
| --- | --- |
| `<PixForm />` | Tipo e chave Pix, nome, cidade, valor, identificador, descrição e uso único |
| `<PixResult />` | QR Code, resumo do recebedor, Pix copia e cola, **Copiar**, **Baixar PNG** e **Baixar SVG** |
| `<PayloadBreakdown />` | O código dividido em campos (cores) + tabela com os subcampos |
| `<PixReader />` | Leitor de Pix copia e cola com conferência do CRC16 |
| `<PixGenerator />` | Todos os anteriores, nas abas **Gerar Pix** e **Ler código** |

## 🖼️ Capturas de Tela

| Início | Pix gerado |
| :---: | :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/PixGenerator/imgs/Home.png) | ![PixGerado](https://joaopauloaramuni.github.io/react-imgs/PixGenerator/imgs/PixGerado.png) |

| Campos do código | Validação |
| :---: | :---: |
| ![Campos](https://joaopauloaramuni.github.io/react-imgs/PixGenerator/imgs/Campos.png) | ![Validacao](https://joaopauloaramuni.github.io/react-imgs/PixGenerator/imgs/Validacao.png) |

| Leitor | CRC inválido |
| :---: | :---: |
| ![Leitor](https://joaopauloaramuni.github.io/react-imgs/PixGenerator/imgs/Leitor.png) | ![CRCInvalido](https://joaopauloaramuni.github.io/react-imgs/PixGenerator/imgs/CRCInvalido.png) |

| Celular | Celular (QR Code) |
| :---: | :---: |
| ![Mobile](https://joaopauloaramuni.github.io/react-imgs/PixGenerator/imgs/Mobile.png) | ![Mobile2](https://joaopauloaramuni.github.io/react-imgs/PixGenerator/imgs/Mobile2.png) |

> As capturas usam dados **fictícios** (botão **Preencher exemplo**) e o exemplo oficial do manual do Banco Central (botão **Usar exemplo do Banco Central**).

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`, clique em **Preencher exemplo** (ou digite os seus dados) e o QR Code aparece na hora.

> ⚠️ Antes de divulgar um QR Code, **pague R$ 0,01 para você mesmo** com ele. Se a chave estiver errada (mas for válida), o dinheiro vai para outra pessoa.

## ⚙️ Como funciona

### O BR Code

O Pix copia e cola é uma sequência de campos no padrão **EMV® QRCPS-MPM**. Cada campo é **ID** (2 dígitos) + **tamanho** (2 dígitos) + **valor**:

```text
00 02 01                       → Versão do payload ("01")
26 58                          → Conta do recebedor (tem subcampos dentro)
   00 14 br.gov.bcb.pix        →   Arranjo: sempre "br.gov.bcb.pix"
   01 36 123e4567-e12b-...     →   Chave Pix
52 04 0000                     → Categoria do estabelecimento (MCC)
53 03 986                      → Moeda: 986 = real
54 05 25.90                    → Valor (sem este campo, quem paga digita o valor)
58 02 BR                       → País
59 13 Fulano de Tal            → Nome do recebedor (até 25 caracteres)
60 08 BRASILIA                 → Cidade (até 15 caracteres)
62 07                          → Dados adicionais
   05 03 ***                   →   Identificador (txid): "***" quando não há
63 04 1D3D                     → CRC16
```

Tudo junto, sem espaços (o exemplo oficial do manual, sem o campo 54):

```text
00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D
```

### O CRC16

O campo **63** é um código de verificação: o **CRC16-CCITT** (polinômio `0x1021`, valor inicial `0xFFFF`) de todo o texto anterior, **incluindo** o `6304`. Se qualquer caractere mudar, o CRC não confere e o banco recusa o código.

```js
export function crc16(payload) {
  const bytes = new TextEncoder().encode(payload);
  let crc = 0xffff;
  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
```

### As chaves

A chave vai no código **no formato oficial**, não do jeito que foi digitada. O campo mostra embaixo como ela ficou:

| Tipo | Você digita | Vai no código |
| --- | --- | --- |
| CPF | `123.456.789-09` | `12345678909` |
| CNPJ | `12.ABC.345/01DE-35` | `12ABC34501DE35` |
| E-mail | `Fulano@Exemplo.com.br` | `fulano@exemplo.com.br` |
| Celular | `(31) 99999-9999` | `+5531999999999` |
| Aleatória | `123E4567-E12B-...` | `123e4567-e12b-...` |

- **CPF** e **CNPJ** têm os **dígitos verificadores** conferidos (módulo 11).
- **CNPJ alfanumérico**: desde julho de 2026 a Receita Federal emite CNPJ com letras nas 12 primeiras posições. No cálculo, cada caractere vale o **código ASCII − 48** (`"0"` a `"9"` continuam valendo 0 a 9, `"A"` vale 17, `"B"` 18...). O CNPJ só com números continua funcionando do mesmo jeito.
- **Nome** e **cidade** perdem os acentos e ficam em maiúsculas (`São João del-Rei` → `SAO JOAO DEL-RE`, cortado em 15 caracteres), como fazem os apps dos bancos.
- O **identificador** aceita só letras e números (até 25).
- O campo **26** inteiro (arranjo + chave + descrição) tem no máximo **99 caracteres**: o contador da descrição já desconta o tamanho da chave.

### Na página

- O código é refeito **a cada tecla** (`useMemo` no `usePixGenerator.js`); os erros só aparecem nos campos em que você já mexeu.
- O QR Code é um `<svg>` do `QRCodeSVG`, com correção de erro **M** e margem de **4 módulos** (a "zona de silêncio" da norma).
- **Baixar PNG** desenha esse SVG num `<canvas>` de 1024 × 1024 px; **Baixar SVG** salva o próprio `<svg>`.
- O **leitor** usa a mesma regra de negócio ao contrário (`parsePix`): lê os campos TLV, recalcula o CRC16 e compara com o que veio no código.

> 💡 Toda a regra de negócio fica em `src/core/`, **sem React**: dá para usar `buildPix` e `parsePix` em qualquer projeto JavaScript (Node, Express, outro framework...).

## 📘 Manual do Banco Central

Tudo o que este projeto monta (campos, tamanhos máximos, CRC16) vem do **Manual de Padrões para Iniciação do Pix**, publicado pelo Banco Central em **PDF**:

- 📄 **Link direto:** [II_ManualdePadroesparaIniciacaodoPix.pdf](https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix.pdf)
- 📁 **Cópia no projeto:** [`docs/ManualdePadroesparaIniciacaodoPix.pdf`](docs/ManualdePadroesparaIniciacaodoPix.pdf)

### Como encontrar o manual no site do Banco Central

O Banco Central publica uma nova versão do PDF quando o padrão muda, e às vezes o endereço do arquivo muda junto. Se o link direto não abrir:

1. Acesse [bcb.gov.br/estabilidadefinanceira/pix](https://www.bcb.gov.br/estabilidadefinanceira/pix).
2. Entre na área de **Regulamentação Pix**, onde ficam o regulamento e os seus anexos.
3. Procure o **Manual de Padrões para Iniciação do Pix** (ele é um dos anexos do Regulamento Pix) e baixe o PDF.
4. Salve o arquivo em `docs/ManualdePadroesparaIniciacaodoPix.pdf` e, se o endereço mudou, atualize o link direto acima.

### O que usar do manual

O manual explica as formas de iniciar um pagamento Pix (chave, QR Code estático, QR Code dinâmico...). Este projeto usa a parte do **QR Code estático**:

| No manual | No projeto |
| --- | --- |
| Lista de campos do BR Code (ID, nome, tamanho, se é obrigatório) | `src/core/pix.js` (`buildPix` e `FIELD_NAMES`) |
| Formato ID + tamanho + valor (padrão EMV) | `src/core/emv.js` (`tlv` e `parseTlv`) |
| Cálculo do CRC16 do campo 63 | `src/core/crc16.js` |
| Formato das chaves Pix | `src/core/keys.js` |
| Exemplo de BR Code completo | Botão **Usar exemplo do Banco Central**, na aba **Ler código** |

> 💡 Para estudar: abra o PDF ao lado da aba **Campos do código** e compare cada linha da tabela com a lista de campos do manual.

> O Pix **dinâmico** (QR Code com URL, gerado pelo banco a cada cobrança) usa a [API Pix](https://github.com/bacen/pix-api) e precisa de conta em uma instituição: ele não faz parte deste projeto. O leitor apenas reconhece quando um código é dinâmico.

## 🧩 Usando no seu projeto

```bash
npm install qrcode.react
```

Copie `src/core/`, `src/config/pixConfig.js` e, se quiser a interface, `src/components/PixGenerator/` e `src/utils/`:

```jsx
import { QRCodeSVG } from "qrcode.react";
import { buildPix } from "./core";

const { payload } = buildPix({
  keyType: "email",
  key: "pix@pucminas.br",
  name: "PUC Minas",
  city: "Belo Horizonte",
  amount: "25,90",       // opcional
  txid: "PEDIDO123",     // opcional
  description: "Lanche", // opcional
});

<QRCodeSVG value={payload} size={280} level="M" marginSize={4} />
<p>{payload}</p>  {/* Pix copia e cola */}
```

Ou o painel completo:

```jsx
import PixGenerator from "./components/PixGenerator/PixGenerator";

<PixGenerator />
```

## 🛠️ Configurações

Tudo fica em `src/config/pixConfig.js`:

```js
MAX_NAME: 25,             // campo 59
MAX_CITY: 15,             // campo 60
MAX_TXID: 25,             // campo 62-05
DEFAULT_QR_SIZE: 280,     // tamanho do QR Code na tela
QR_LEVEL: "M",            // correção de erro
QR_DOWNLOAD_SIZE: 1024,   // PNG baixado
EXAMPLE: { ... },         // dados do botão "Preencher exemplo"
```

## ☁️ Deploy na Vercel

Importe o repositório em [vercel.com/new](https://vercel.com/new) (preset **Vite**) e clique em **Deploy**. Não há variáveis de ambiente para configurar.

> Por ser um site **só estático**, ele também funciona no **GitHub Pages** ou em qualquer hospedagem de arquivos.

## 📂 Estrutura do Projeto

```text
📁 PixGenerator
│
├── 📁 docs
│   └── ManualdePadroesparaIniciacaodoPix.pdf └── Manual do Banco Central (BR Code)
│
├── 📁 imgs              └── Capturas de tela usadas neste README
├── 📁 public            └── pucminas-logo.png (favicon)
│
├── 📁 src
│   ├── 📁 assets/images └── pucminas-logo.png
│   │
│   ├── 🧩 components
│   │   ├── PageLayout/                     └── Card da página com a faixa azul (logo PUC + ícone do Pix)
│   │   └── PixGenerator/
│   │       ├── PixGenerator.jsx            └── Painel completo (abas Gerar Pix / Ler código)
│   │       ├── PixForm.jsx                 └── Formulário (tipo de chave, recebedor, valor...)
│   │       ├── PixResult.jsx               └── QR Code, copia e cola, copiar e baixar
│   │       ├── PayloadBreakdown.jsx        └── Campos do código (cores + tabela)
│   │       ├── PixReader.jsx               └── Leitor de Pix copia e cola + CRC16
│   │       ├── usePixGenerator.js          └── Hook: estado do formulário e código ao vivo
│   │       ├── format.js                   └── Formatação pt-BR e nome dos arquivos
│   │       └── PixGenerator.css
│   │
│   ├── 🧠 core                             └── Regra de negócio (sem React)
│   │   ├── pix.js         └── buildPix, parsePix, validatePix, explainPayload
│   │   ├── keys.js        └── Validação e formato das chaves (CPF, CNPJ alfanumérico, e-mail...)
│   │   ├── emv.js         └── Campos TLV: montar (tlv) e ler (parseTlv)
│   │   ├── crc16.js       └── CRC16-CCITT do campo 63
│   │   ├── text.js        └── Remove acentos, limpa o txid
│   │   ├── exceptions.js
│   │   └── index.js
│   │
│   ├── ⚙️ config/pixConfig.js              └── Limites do BR Code, tamanhos do QR e exemplo
│   ├── 🛠️ utils
│   │   ├── clipboard.js   └── Copiar (com alternativa para http://)
│   │   └── download.js    └── Baixar o QR Code em PNG ou SVG
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── 📄 index.html
├── 📄 vite.config.js
└── 📄 package.json
```

## 📦 Dependências

```json
"dependencies": {
  "qrcode.react": "^4.2.0",
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "react-icons": "^5.7.0"
}
```

- [`qrcode.react`](https://www.npmjs.com/package/qrcode.react): desenha o QR Code como `<svg>` (`QRCodeSVG`) ou `<canvas>` (`QRCodeCanvas`)
- [`react-icons`](https://react-icons.github.io/react-icons/): ícones (inclusive o logo do Pix na faixa azul, `FaPix`)
- Sem biblioteca de Pix: o BR Code e o CRC16 são feitos à mão em `src/core/`, para fins didáticos.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

## 📚 Documentação e Links Úteis

- 🏦 [Banco Central: Regulamentação do Pix (manuais e especificações)](https://www.bcb.gov.br/estabilidadefinanceira/pix)
- 📘 [Manual de Padrões para Iniciação do Pix (BR Code), PDF](https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix.pdf) · [cópia em `docs/`](docs/ManualdePadroesparaIniciacaodoPix.pdf)
- 🧾 [EMV® QR Code Specification for Payment Systems (Merchant-Presented Mode)](https://www.emvco.com/emv-technologies/qr-codes/)
- 🔢 [Receita Federal: CNPJ alfanumérico](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/cnpj-alfanumerico)
- 🔳 [qrcode.react](https://github.com/zpao/qrcode.react)
- ⚡ [Vite](https://vite.dev/) · ⚛️ [React](https://react.dev/)

## 📄 Licença
Este projeto está licenciado sob a MIT License.
