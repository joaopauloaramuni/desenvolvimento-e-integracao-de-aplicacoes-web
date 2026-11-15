import { Aviso, Ir, Link, Parte, Passo, Passos, Tabela } from "../blocos";

export default function Vercel() {
  return (
    <>
      <p className="tut-resumo">
        A <strong>Vercel</strong> publica projetos React/Vite de graça direto do GitHub: ela roda o <code>npm run build</code>,
        coloca o site no ar num endereço <code>.vercel.app</code> e refaz o deploy a cada <code>push</code>.
      </p>

      <Parte titulo="Publicando o projeto">
        <Passos>
          <Passo titulo="Crie a conta na Vercel">
            <p>
              Acesse <Link href="https://vercel.com/signup" />, escolha o plano gratuito (<strong>Hobby</strong>) e clique em{" "}
              <strong>Continue with GitHub</strong>.
            </p>
          </Passo>
          <Passo titulo="Crie um projeto novo">
            <p>
              No painel, clique em <strong>Add New… → Project</strong>.
            </p>
          </Passo>
          <Passo titulo="Importe o repositório pela URL do GitHub">
            <p>
              Na tela <strong>Import Git Repository</strong>, escolha o repositório na lista ou, em{" "}
              <strong>Import Third-Party Git Repository</strong>, cole a URL do GitHub, por exemplo{" "}
              <code>https://github.com/usuario/meu-portfolio</code>, e clique em <strong>Continue</strong>.
            </p>
            <Aviso tipo="dica" titulo="Repositório não aparece na lista?">
              <p>
                Clique em <strong>Adjust GitHub App Permissions</strong> e libere o acesso da Vercel ao repositório.
              </p>
            </Aviso>
          </Passo>
          <Passo titulo="Escolha o template Vite">
            <p>
              Em <strong>Framework Preset</strong>, selecione <strong>Vite</strong> para projetos React/Vite. Ele já preenche os
              comandos certos:
            </p>
            <Tabela
              cabecalho={["Campo", "Valor"]}
              linhas={[
                ["Build Command", <code key="b">npm run build</code>],
                ["Output Directory", <code key="o">dist</code>],
                ["Install Command", <code key="i">npm install</code>],
              ]}
            />
          </Passo>
          <Passo titulo="Confira a pasta do projeto">
            <p>
              Se o projeto estiver dentro de uma pasta do repositório (e não na raiz), clique em <strong>Edit</strong> ao lado de{" "}
              <strong>Root Directory</strong> e selecione a pasta onde fica o <code>package.json</code>.
            </p>
          </Passo>
          <Passo titulo="Adicione as variáveis de ambiente, se houver">
            <p>
              Se o projeto usa um arquivo <code>.env.local</code> (chaves de API, por exemplo), copie cada variável para{" "}
              <strong>Environment Variables</strong>. O <code>.env.local</code> não vai para o GitHub, então a Vercel não o enxerga.
            </p>
          </Passo>
          <Passo titulo="Clique em Deploy">
            <p>
              Em um ou dois minutos o site fica no ar num endereço como <code>meu-portfolio.vercel.app</code>. A partir daí,
              cada <code>push</code> na branch <code>main</code> gera um deploy novo sozinho.
            </p>
          </Passo>
        </Passos>
      </Parte>

      <Parte titulo="Trocando para o seu domínio">
        <Passos>
          <Passo titulo="Abra a aba Domains">
            <p>
              No projeto, vá em <strong>Settings → Domains</strong> e clique em <strong>Add Domain</strong>.
            </p>
          </Passo>
          <Passo titulo="Adicione o domínio e configure o DNS">
            <p>
              Digite o seu domínio (ex.: <code>seunome.dev</code>), copie os registros que a Vercel mostrar e crie-os no
              registrador. O passo a passo completo, para Name.com e Namecheap, está no tutorial de{" "}
              <Ir para="dominios">Domínios .dev e .me</Ir>.
            </p>
          </Passo>
        </Passos>
        <Aviso tipo="info" titulo="Um .vercel.app mais curto">
          <p>
            Na mesma aba <strong>Domains</strong>, você também pode adicionar outro endereço <code>.vercel.app</code>, como{" "}
            <code>seunome.vercel.app</code>, se ele estiver livre.
          </p>
        </Aviso>
      </Parte>
    </>
  );
}
