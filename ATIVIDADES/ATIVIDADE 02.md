# 🔐 Atividade 02 - Tela de Login com Spring Boot + Thymeleaf

## 📊 Valor: 2,5 pts (Em dupla)

👥 A atividade deverá ser realizada **em dupla**, utilizando a metodologia de **Pair Programming**.

💻 Os dois integrantes deverão participar ativamente do desenvolvimento da solução.

📤 **Ambos os integrantes da dupla devem realizar a entrega no Canvas do link do repositório no GitHub.**

---

## 🖼️ Exemplo de Tela de Login:

<div align="center">
 <img width="1280" alt="Login_PUC" src="https://github.com/user-attachments/assets/cc9603f7-b4fb-4439-9b83-6d2c29fd9b3d" />
</div>

---

## 🎯 Objetivo

Desenvolva uma aplicação web utilizando **Spring Boot + Thymeleaf**, implementando um sistema completo de **autenticação e cadastro de usuários**.

A aplicação deverá possuir uma interface gráfica desenvolvida com **Thymeleaf**, permitindo que o usuário realize login, cadastro e, opcionalmente, recuperação de senha por meio do envio de email.

A atividade tem como objetivo praticar conceitos de:

* ☕ Spring Boot
* 🎨 Thymeleaf
* 🔐 Autenticação
* 👤 Cadastro de usuários
* 🌐 Endpoints HTTP
* 🧩 Controllers
* 🔑 Criptografia/segurança de senhas
* 📧 Integração com APIs ou serviços externos de email

---

## 📚 Projetos de referência

Para o desenvolvimento da atividade, utilize como base de consulta os seguintes projetos desenvolvidos na disciplina:

### 🔐 SecureLoginPUC

[**SecureLoginPUC - GitHub**](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/SpringBoot/SecureLoginPUC)

### 🔐 SecureLoginPUC_2

[**SecureLoginPUC_2 - GitHub**](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/SpringBoot/SecureLoginPUC_2)

> 💡 Os projetos deverão ser utilizados **como referência para estudo e compreensão da implementação**. A solução entregue pela dupla deverá possuir identidade visual e implementação próprias.

---

# 🎨 Tela de Login

A aplicação deverá possuir uma tela de login acessível pelo endpoint:

```text
/login
```

A tela deverá permitir que o usuário informe suas credenciais para acessar a aplicação.

### 🔑 A tela deverá possuir, no mínimo:

* 👤 Campo para usuário ou email.
* 🔒 Campo para senha.
* 🚪 Botão para realizar login.
* 📝 Link ou botão para realizar cadastro.
* 🔑 Link ou botão para recuperação de senha.
* ⚠️ Exibição de mensagens de erro quando as credenciais forem inválidas.

### 🎨 Layout

A dupla deverá utilizar a **criatividade para desenvolver a interface da tela de login**.

É permitido utilizar:

* 🖼️ Imagens.
* 🎨 Logos.
* 🌈 Gradientes.
* ✨ Animações.
* 🎬 Vídeos de fundo.
* 💫 Efeitos visuais.
* 📱 Layout responsivo.
* 🎭 Ícones e elementos gráficos.

Se desejar, utilize as imagens e logos disponíveis no `README.md` do repositório da disciplina:

[**Repositório da disciplina - GitHub**](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web)

> 💡 **Dica:** uma tela de login com vídeo de fundo, animações ou elementos visuais interativos pode deixar a aplicação mais interessante.

---

# 👤 Tela de Registro

A aplicação deverá possuir uma tela para **registro de novos usuários**, acessível pelo endpoint:

```text
/register
```

A tela de registro deverá seguir **o mesmo padrão visual da tela de login**, mantendo a identidade visual da aplicação.

### 📝 A tela deverá permitir, no mínimo:

* 👤 Nome ou usuário.
* 📧 Email.
* 🔒 Senha.
* 🔒 Confirmação da senha.
* 📝 Botão para realizar o cadastro.
* 🔙 Link para retornar à tela de login.

A aplicação deverá realizar as validações necessárias para impedir, por exemplo:

* ❌ Cadastro com campos obrigatórios vazios.
* ❌ Emails inválidos.
* ❌ Senhas incompatíveis.
* ❌ Usuários ou emails duplicados.
* ❌ Senhas que não atendam aos requisitos definidos pela aplicação.

---

# 🔐 Autenticação

A aplicação deverá implementar um mecanismo de autenticação utilizando os recursos disponíveis no **Spring Boot**.

O sistema deverá:

* 🔑 Validar as credenciais informadas pelo usuário.
* 👤 Identificar o usuário autenticado.
* 🚫 Impedir o acesso de usuários não autenticados às áreas protegidas.
* 🔒 Armazenar senhas de forma segura.
* 🚪 Permitir que o usuário encerre sua sessão.

> ⚠️ **Importante:** senhas de usuários não devem ser armazenadas em texto puro no banco de dados. Utilize mecanismos adequados de criptografia/hash disponibilizados pelo ecossistema Spring.

---

# 🌐 Endpoints obrigatórios

A aplicação deverá possuir, no mínimo, os seguintes endpoints:

| Método | Endpoint           | Descrição                                      |
| ------ | ------------------ | ---------------------------------------------- |
| `GET`  | `/login`           | Exibe a tela de login                          |
| `GET`  | `/register`        | Exibe a tela de cadastro                       |
| `POST` | `/register`        | Processa os dados do cadastro                  |
| `GET`  | `/recoverpassword` | Exibe a tela de recuperação de senha           |
| `POST` | `/recoverpassword` | Processa a solicitação de recuperação de senha |

> 🔐 **Importante:** o endpoint `POST /login` **não é obrigatório**. Quando utilizado o **Spring Security**, o processamento da autenticação pode ser realizado pelo próprio framework, conforme a configuração de segurança da aplicação. Nesse caso, o Controller precisa apenas disponibilizar a página `GET /login`.

---

# 🖥️ Thymeleaf

As páginas da aplicação deverão utilizar **Thymeleaf** para integração entre o backend desenvolvido em Spring Boot e as interfaces HTML.

As páginas deverão ser organizadas adequadamente dentro do projeto.

Uma estrutura sugerida:

```text
src/
└── main/
    ├── java/
    │   └── .../
    │       ├── application/
    │       ├── controller/
    │       └── config/
    │
    └── resources/
        ├── static/
        │   ├── css/
        │   ├── images/
        │   └── videos/
        │
        └── templates/
            ├── login.html
            ├── register.html
            ├── recoverpassword.html
            └── ...
```

> 💡 A estrutura poderá ser modificada conforme a arquitetura adotada pela dupla.

---

# 🏆 Desafios opcionais - Recuperação de senha

Como **desafio**, implemente uma funcionalidade de recuperação de senha através do envio de email.

A funcionalidade deverá estar disponível no endpoint:

```text
/recoverpassword
```

A tela deverá permitir que o usuário informe seu email para solicitar a recuperação da senha.

### 📚 Projeto de referência

Utilize como referência o projeto de envio de emails disponibilizado na disciplina:

[**SendEmail - Projeto de exemplo**](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/SpringBoot/SendEmail)

> ⭐ **Obs:** a implementação da recuperação de senha com envio de email será considerada como funcionalidade adicional à atividade principal.

---

# 📋 Requisitos técnicos

A aplicação deverá:

* ☕ Utilizar **Java + Spring Boot**.
* 🎨 Utilizar **Thymeleaf** para as páginas HTML.
* 🔐 Implementar autenticação de usuários.
* 👤 Possuir cadastro de usuários.
* 🔒 Armazenar senhas de maneira segura.
* 🌐 Implementar os endpoints solicitados.
* 🎨 Desenvolver uma interface visual própria.
* 📱 Preferencialmente possuir layout responsivo.
* ⚠️ Implementar validações básicas nos formulários.
* ❌ Exibir mensagens adequadas para erros de autenticação ou cadastro.
* 🧩 Organizar o projeto utilizando uma estrutura adequada do Spring Boot.

---

# 🎨 Requisitos visuais

A interface será parte importante da atividade.

A dupla deverá desenvolver uma identidade visual própria para a aplicação.

### Exemplos de elementos que podem ser utilizados:

* 🌌 Vídeo de fundo.
* 🖼️ Imagens.
* 🏷️ Logo da aplicação.
* 🎨 Gradientes.
* ✨ Animações CSS.
* 🪄 Transições.
* 🔘 Botões personalizados.
* 📱 Responsividade.
* 🌙 Tema escuro.
* 💡 Efeitos de hover.
* 🎭 Ícones.

> 💡 **Use a criatividade!** O objetivo não é apenas reproduzir uma tela de login funcional, mas também desenvolver uma interface visualmente interessante e integrada ao sistema.

---

# 🔑 Configurações e credenciais

Caso sejam utilizadas credenciais externas, como:

* 📧 Senha de email.
* 🔑 API Key.
* 🗄️ Credenciais do banco.
* 🔐 Tokens.
* ⚙️ Outras informações sensíveis.

Essas informações **não deverão ser publicadas diretamente no código-fonte**.

Utilize preferencialmente:

```text
application.properties
```

com variáveis de ambiente quando necessário.

> ⚠️ **Importante:** não publique senhas, tokens ou outras credenciais reais em um repositório público do GitHub.

---

# 📋 Entrega

O projeto deverá ser disponibilizado em um repositório do **GitHub** contendo:

* 💻 Código-fonte completo da aplicação.
* 🎨 Interfaces HTML desenvolvidas com Thymeleaf.
* 🔐 Sistema de autenticação.
* 👤 Sistema de cadastro.
* 📄 `README.md` com documentação do projeto.
* 🌐 Lista dos endpoints disponíveis.
* ▶️ Instruções para executar a aplicação.
* ⚙️ Instruções para configurar o ambiente.
* 🔑 Orientações sobre configurações e credenciais necessárias.
* 🖼️ Imagens da aplicação no `README.md`, se desejado.

---

# 🏆 Resultado esperado

Ao final da atividade, a dupla deverá ter desenvolvido uma **aplicação web completa utilizando Spring Boot e Thymeleaf**, contendo um sistema funcional de **login e cadastro de usuários**, com interface gráfica personalizada.

A atividade deverá demonstrar conhecimentos de **Spring Boot, Thymeleaf, autenticação, formulários HTML, segurança de senhas, Controllers, integração entre frontend e backend e organização de aplicações web**.

Como funcionalidade adicional, a dupla poderá implementar um sistema de **recuperação de senha por email**, utilizando um serviço externo de envio de mensagens.
