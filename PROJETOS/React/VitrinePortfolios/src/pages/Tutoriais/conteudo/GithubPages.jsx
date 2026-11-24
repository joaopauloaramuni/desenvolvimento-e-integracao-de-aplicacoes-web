import { Aviso, Codigo, Ir, Link, Parte, Passo, Passos, Tabela } from "../blocos";

export default function GithubPages() {
  return (
    <>
      <p className="tut-resumo">
        O <strong>GitHub Pages</strong> é um serviço gratuito do GitHub que publica um site direto de um repositório. É ótimo
        para portfólios, páginas de projetos e documentação feitos com <strong>HTML, CSS e JavaScript puros</strong>, sem
        servidor. O endereço fica no formato <code>https://usuario.github.io/repositorio/</code>.
      </p>

      <Aviso tipo="atencao" titulo="Projetos React/Vite não vão no GitHub Pages">
        <p>
          O GitHub Pages publica os arquivos do repositório do jeito que estão. Um projeto <strong>React/Vite</strong> precisa
          ser compilado (<code>npm run build</code>) antes de ir ao ar, então não funciona publicado direto no Pages. Para React/Vite,
          use a Vercel: veja o tutorial <Ir para="vercel">Deploy na Vercel</Ir>.
        </p>
      </Aviso>

      <Parte titulo="Publicando o site">
        <Passos>
          <Passo titulo="Organize o repositório">
            <p>
              O arquivo <code>index.html</code> precisa estar na raiz do repositório. Uma estrutura típica:
            </p>
            <Codigo>{`meu-site/
├── index.html
├── about.html
├── images/
│   └── foto-perfil.png
├── css/
│   └── estilo.css
└── CNAME   (opcional, só para domínio próprio)`}</Codigo>
          </Passo>
          <Passo titulo="Ative o Pages">
            <p>
              No repositório, vá em <strong>Settings → Pages</strong>. Em <strong>Source</strong>, escolha{" "}
              <strong>Deploy from a branch</strong>, selecione a branch <code>main</code> e a pasta <code>/ (root)</code> e clique em{" "}
              <strong>Save</strong>.
            </p>
          </Passo>
          <Passo titulo="Abra o endereço publicado">
            <p>
              Em alguns minutos, o endereço aparece no topo da mesma página. A cada <code>push</code> na branch, o site é
              atualizado sozinho.
            </p>
          </Passo>
        </Passos>
        <Aviso tipo="dica" titulo="Endereço mais curto">
          <p>
            Um repositório chamado exatamente <code>usuario.github.io</code> é publicado na raiz:{" "}
            <code>https://usuario.github.io/</code>, sem o nome do repositório no final.
          </p>
        </Aviso>
      </Parte>

      <Parte titulo="Usando um domínio próprio">
        <Passos>
          <Passo titulo="Crie o arquivo CNAME">
            <p>
              Na raiz do repositório, crie um arquivo chamado <code>CNAME</code> (sem extensão) contendo só o domínio:
            </p>
            <Codigo>www.seusite.com</Codigo>
            <p>
              Também dá para preencher o campo <strong>Custom domain</strong> em <strong>Settings → Pages</strong>, que cria esse
              arquivo para você.
            </p>
          </Passo>
          <Passo titulo="Configure o DNS no registrador">
            <p>
              No painel do seu domínio (Name.com, Namecheap, Registro.br, Cloudflare etc.), crie o <code>CNAME</code> do{" "}
              <code>www</code> apontando para o seu usuário. Para o domínio raiz, use registros <code>A</code> com os IPs do
              GitHub Pages:
            </p>
            <Tabela
              cabecalho={["Tipo", "Nome", "Valor"]}
              linhas={[
                [<code key="t">CNAME</code>, <code key="n">www</code>, <code key="v">usuario.github.io</code>],
                [<code key="t">A</code>, <code key="n">@</code>, <code key="v">185.199.108.153</code>],
                [<code key="t">A</code>, <code key="n">@</code>, <code key="v">185.199.109.153</code>],
                [<code key="t">A</code>, <code key="n">@</code>, <code key="v">185.199.110.153</code>],
                [<code key="t">A</code>, <code key="n">@</code>, <code key="v">185.199.111.153</code>],
              ]}
            />
            <p>
              O preenchimento de cada campo (Host em branco ou <code>@</code>, sem digitar o domínio completo) segue as mesmas
              regras explicadas no tutorial de <Ir para="dominios">Domínios .dev e .me</Ir>.
            </p>
          </Passo>
          <Passo titulo="Ative o HTTPS">
            <p>
              Depois que o DNS propagar (pode levar algumas horas), marque <strong>Enforce HTTPS</strong> em{" "}
              <strong>Settings → Pages</strong>. O certificado é gratuito, emitido pelo Let&apos;s Encrypt.
            </p>
          </Passo>
        </Passos>
      </Parte>

      <Parte titulo="Dica: hospedando imagens no Pages">
        <p>
          Imagens guardadas num repositório comum são exibidas por URLs feitas para visualização e controle de versão, que podem
          mudar e não são otimizadas para sites. Publicadas pelo Pages, elas ganham uma URL limpa e permanente, servida pela CDN
          do GitHub (uma rede de servidores que entrega o arquivo a partir do ponto mais próximo de quem acessa):
        </p>
        <Codigo>{`![Descrição da imagem](https://usuario.github.io/repositorio/images/nome-da-imagem.png)`}</Codigo>
      </Parte>

      <p className="tut-referencias">
        Documentação oficial: <Link href="https://docs.github.com/pt/pages">GitHub Pages</Link>,{" "}
        <Link href="https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site">domínio personalizado</Link>{" "}
        e <Link href="https://docs.github.com/pt/pages/setting-up-a-github-pages-site-with-jekyll">sites com Jekyll</Link>.
      </p>
    </>
  );
}
