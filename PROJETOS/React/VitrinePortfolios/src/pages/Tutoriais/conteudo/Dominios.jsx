import { Aviso, Ir, Link, Parte, Passo, Passos, Tabela } from "../blocos";

export default function Dominios() {
  return (
    <>
      <p className="tut-resumo">
        Com o selo <strong>GitHub Pro</strong> você registra <strong>de graça por 1 ano</strong> um domínio próprio, como{" "}
        <code>seunome.dev</code> no <strong>Name.com</strong> ou <code>seunome.me</code> na <strong>Namecheap</strong>, e aponta
        para o portfólio hospedado na Vercel. Domínio próprio deixa o portfólio e o currículo bem mais profissionais.
      </p>

      <Aviso tipo="info" titulo="Pré-requisito">
        <p>
          Sua conta do GitHub precisa estar com o selo <strong>GitHub Pro</strong> ativo. Se ainda não estiver, faça antes o
          tutorial do <Ir para="student">GitHub Student Developer Pack</Ir>. O portfólio também já precisa estar publicado na
          Vercel (tutorial <Ir para="vercel">Deploy na Vercel</Ir>).
        </p>
      </Aviso>

      <p>Escolha <strong>um</strong> dos dois registradores na Parte 1. As Partes 2 e 4 são iguais para os dois.</p>

      <Parte titulo="Parte 1, opção A: domínio .dev no Name.com">
        <Passos>
          <Passo titulo="Abra a página de parceria do GitHub">
            <p>
              Acesse <Link href="https://www.name.com/pt-br/partner/github-faculty" />.
            </p>
          </Passo>
          <Passo titulo="Entre com o GitHub">
            <p>
              Clique no login com o GitHub e <strong>autorize</strong> o Name.com a acessar sua conta. É assim que ele confirma
              o GitHub Pro. No primeiro acesso, complete o cadastro com seus dados.
            </p>
          </Passo>
          <Passo titulo="Pesquise o domínio">
            <p>
              Busque o nome desejado (ex.: <code>seunome</code>) e escolha a extensão <code>.dev</code>. Os domínios elegíveis
              aparecem com <strong>preço zerado</strong> no primeiro ano.
            </p>
          </Passo>
          <Passo titulo="Adicione ao carrinho e vá para o checkout" />
          <Passo titulo="Cadastre um cartão de crédito">
            <p>
              O Name.com exige um cartão cadastrado, <strong>mas o valor cobrado é zero</strong>. Antes de confirmar, confira
              se o total do pedido está zerado. Se aparecer algum valor, remova serviços extras opcionais (e-mail, proteção de
              privacidade paga etc.).
            </p>
          </Passo>
          <Passo titulo="Finalize o pedido">
            <p>
              O domínio aparece em <strong>My Domains / Meus Domínios</strong>.
            </p>
          </Passo>
          <Passo titulo="Desative a renovação automática">
            <p>
              Em <strong>My Domains</strong>, clique no domínio e desmarque <strong>Auto Renew / Renovação automática</strong>.
              Se quiser, remova também o cartão salvo na área de pagamentos.
            </p>
            <Aviso tipo="atencao" titulo="Evite a cobrança depois de 1 ano">
              <p>Com a renovação automática ligada, o domínio é renovado e o valor cheio é cobrado no seu cartão.</p>
            </Aviso>
          </Passo>
        </Passos>
      </Parte>

      <Parte titulo="Parte 1, opção B: domínio .me na Namecheap">
        <Passos>
          <Passo titulo="Abra a oferta da Namecheap">
            <p>
              Na página do <Link href="https://education.github.com/pack">GitHub Student Developer Pack</Link>, procure a
              oferta da <strong>Namecheap</strong> (domínio <code>.me</code> grátis por 1 ano) e clique para resgatar. Ela leva
              ao site da Namecheap para estudantes, <Link href="https://nc.me" />.
            </p>
          </Passo>
          <Passo titulo="Entre com o GitHub">
            <p>
              Autorize a Namecheap a acessar sua conta do GitHub para confirmar o GitHub Pro e crie (ou acesse) sua conta na
              Namecheap.
            </p>
          </Passo>
          <Passo titulo="Pesquise o domínio .me">
            <p>
              Busque o nome desejado (ex.: <code>seunome</code>). Os domínios <code>.me</code> elegíveis aparecem gratuitos no
              primeiro ano.
            </p>
          </Passo>
          <Passo titulo="Finalize o pedido com total zerado">
            <p>
              Antes de confirmar, verifique se o total está zerado e remova extras opcionais. O domínio aparece no{" "}
              <strong>Dashboard → Domain List</strong>.
            </p>
          </Passo>
          <Passo titulo="Desative a renovação automática">
            <p>
              Em <strong>Domain List</strong>, desligue a chave <strong>Auto-Renew</strong> do domínio para não haver cobrança
              após o primeiro ano.
            </p>
          </Passo>
        </Passos>
      </Parte>

      <Parte titulo="Parte 2: adicionando o domínio no projeto da Vercel">
        <Passos>
          <Passo titulo="Abra as configurações de domínio">
            <p>
              No <Link href="https://vercel.com/dashboard">painel da Vercel</Link>, abra o projeto do portfólio e vá em{" "}
              <strong>Settings → Domains</strong>.
            </p>
          </Passo>
          <Passo titulo="Adicione o domínio">
            <p>
              Clique em <strong>Add Domain</strong>, digite o domínio (ex.: <code>seunome.dev</code>) e confirme. A Vercel
              costuma sugerir também <code>www.seunome.dev</code> redirecionando para o principal; pode aceitar.
            </p>
          </Passo>
          <Passo titulo="Copie os registros DNS que a Vercel mostrar">
            <p>
              O domínio aparece como <strong>Invalid Configuration</strong> e a Vercel mostra os registros a criar, nas colunas{" "}
              <strong>Type</strong>, <strong>Name</strong> e <strong>Value</strong>. Por exemplo:
            </p>
            <Tabela
              cabecalho={["Type", "Name", "Value"]}
              linhas={[
                [<code key="t">A</code>, <code key="n">@</code>, <code key="v">216.198.79.1</code>],
                [<code key="t">CNAME</code>, <code key="n">www</code>, <code key="v">a1b2c3d4e5f6g7h8.vercel-dns-017.com</code>],
              ]}
            />
            <p>
              Na coluna <strong>Value</strong>, use o ícone de copiar ao lado de cada valor. São dois: o <strong>IP</strong> da
              linha <code>A</code> (domínio raiz) e o <strong>endereço</strong> da linha <code>CNAME</code> (o <code>www</code>).
              O endereço do CNAME é único para o seu projeto, então cole exatamente o que aparece, sem <code>https://</code>,
              sem <code>/</code> e sem espaços.
            </p>
            <Aviso tipo="dica" titulo="Valores ilustrativos">
              <p>Os valores da tabela acima são só exemplos. Use sempre os que a Vercel mostrar para o seu projeto.</p>
            </Aviso>
          </Passo>
        </Passos>
      </Parte>

      <Parte titulo="Parte 3: configurando o DNS no registrador">
        <p>
          Antes de criar os registros novos, <strong>apague os registros padrão</strong> que o registrador cria para a página de
          estacionamento (parking). Eles entram em conflito com os da Vercel.
        </p>

        <h5 className="tut-subtitulo">No Name.com (.dev)</h5>
        <p>
          Em <strong>My Domains</strong>, clique no domínio e entre em <strong>Manage DNS Records</strong>. Apague os registros{" "}
          <code>A</code>, <code>ANAME</code> ou <code>CNAME</code> de parking (com host vazio, <code>www</code> ou <code>*</code>)
          e crie:
        </p>
        <Tabela
          cabecalho={["Type", "Host", "Answer", "TTL"]}
          linhas={[
            [<code key="t">A</code>, <em key="h">(em branco)</em>, "IP copiado da Vercel", <code key="l">300</code>],
            [<code key="t">CNAME</code>, <code key="h">www</code>, "endereço copiado da Vercel", <code key="l">300</code>],
          ]}
        />
        <p>
          Clique em <strong>Add Record</strong> para salvar cada um. No Name.com, a raiz do domínio (o <code>@</code> da Vercel)
          é o campo <strong>Host em branco</strong>.
        </p>

        <h5 className="tut-subtitulo">Na Namecheap (.me)</h5>
        <p>
          Em <strong>Domain List</strong>, clique em <strong>Manage</strong> ao lado do domínio e abra a aba{" "}
          <strong>Advanced DNS</strong>. Apague os registros de parking (normalmente um <code>CNAME</code> do <code>www</code>{" "}
          para <code>parkingpage.namecheap.com</code> e um <code>URL Redirect</code> do <code>@</code>). Depois, em{" "}
          <strong>Add New Record</strong>, crie:
        </p>
        <Tabela
          cabecalho={["Type", "Host", "Value", "TTL"]}
          linhas={[
            [<code key="t">A Record</code>, <code key="h">@</code>, "IP copiado da Vercel", "Automatic"],
            [<code key="t">CNAME Record</code>, <code key="h">www</code>, "endereço copiado da Vercel", "Automatic"],
          ]}
        />
        <p>
          Salve cada registro no ícone de confirmação (✓). Na Namecheap, a raiz do domínio é escrita como <code>@</code>.
        </p>

        <h5 className="tut-subtitulo">Entendendo cada campo</h5>
        <dl className="tut-definicoes">
          <dt>Type</dt>
          <dd>
            <code>A</code> é o recomendado para o domínio raiz (<code>seunome.dev</code>): aponta direto para o IP da Vercel.{" "}
            <code>CNAME</code> é para subdomínios, como o <code>www</code>: diz que <code>www.seunome.dev</code> é um apelido do
            endereço da Vercel. O DNS não permite <code>CNAME</code> na raiz; o <code>ANAME</code> do Name.com é uma alternativa ao{" "}
            <code>A</code>, mas use <strong>ou</strong> <code>A</code> <strong>ou</strong> <code>ANAME</code> na raiz, nunca os
            dois.
          </dd>
          <dt>Host</dt>
          <dd>
            A parte que vem antes do domínio: raiz (em branco no Name.com, <code>@</code> na Namecheap) ou <code>www</code>.{" "}
            <strong>Não digite o domínio completo</strong>: o registrador completa sozinho, e <code>www.seunome.dev</code> viraria{" "}
            <code>www.seunome.dev.seunome.dev</code>.
          </dd>
          <dt>Answer / Value</dt>
          <dd>
            O destino do registro, copiado da Vercel: o IP no <code>A</code> e o endereço <code>xxxx.vercel-dns-0XX.com</code> no{" "}
            <code>CNAME</code>. Sem <code>https://</code> e sem barra no final.
          </dd>
          <dt>TTL</dt>
          <dd>Tempo, em segundos, que o registro fica em cache. Pode manter o padrão do registrador.</dd>
        </dl>
      </Parte>

      <Parte titulo="Parte 4: validando">
        <Passos>
          <Passo titulo="Atualize a página de domínios da Vercel">
            <p>
              Em <strong>Settings → Domains</strong>, clique em <strong>Refresh</strong>. A propagação do DNS costuma levar de
              alguns minutos a algumas horas (raramente até 48 h).
            </p>
          </Passo>
          <Passo titulo="Espere o Valid Configuration">
            <p>
              Quando estiver tudo certo, o status muda para <strong>Valid Configuration</strong> e a Vercel gera sozinha o
              certificado HTTPS. Domínios <code>.dev</code> só abrem com HTTPS (estão na lista HSTS dos navegadores), então o site
              só abre depois do certificado emitido.
            </p>
          </Passo>
          <Passo titulo="Acompanhe a propagação">
            <p>
              No <Link href="https://dnschecker.org/">DNS Checker</Link>, pesquise <code>seunome.dev</code> (tipo <code>A</code>) e{" "}
              <code>www.seunome.dev</code> (tipo <code>CNAME</code>).
            </p>
          </Passo>
        </Passos>
        <Aviso tipo="atencao" titulo="Lembrete final">
          <p>Confira se a renovação automática está desligada no registrador para não haver cobrança após o primeiro ano.</p>
        </Aviso>
      </Parte>
    </>
  );
}
