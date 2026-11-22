import { Aviso, Ir, Link, Passo, Passos } from "../blocos";

export default function StudentPack() {
  return (
    <>
      <p className="tut-resumo">
        Com o <strong>GitHub Student Developer Pack</strong> você ganha o selo <strong>GitHub Pro</strong> e acesso gratuito a
        dezenas de ferramentas e serviços de parceiros, como domínios próprios e hospedagem, tudo sem custo enquanto for
        estudante.
      </p>

      <Passos>
        <Passo titulo="Cadastre o e-mail institucional">
          <p>
            Adicione seu e-mail da PUC Minas (terminado em <code>@pucminas.edu.br</code>) como <strong>e-mail secundário</strong>{" "}
            na sua conta do GitHub, em <Link href="https://github.com/settings/emails" />.
          </p>
        </Passo>
        <Passo titulo="Confirme o e-mail">
          <p>Abra a caixa de entrada do e-mail institucional e clique no link de confirmação enviado pelo GitHub.</p>
        </Passo>
        <Passo titulo="Ative a autenticação de dois fatores (2FA)">
          <p>
            Em <Link href="https://github.com/settings/security" />. Este passo é <strong>obrigatório</strong> antes de pedir o
            Student Developer Pack. Use um app autenticador, como Google Authenticator, Microsoft Authenticator ou Authy.
          </p>
          <Aviso tipo="atencao" titulo="Guarde os códigos de recuperação">
            <p>Salve os códigos de recuperação em um lugar seguro. Sem eles, perder o celular pode significar perder a conta.</p>
          </Aviso>
        </Passo>
        <Passo titulo="Abra o Student Developer Pack e libere a localização">
          <p>
            Acesse <Link href="https://education.github.com/pack" /> e <strong>permita que o navegador compartilhe sua localização</strong>.
          </p>
          <Aviso tipo="atencao" titulo="Não use os computadores dos laboratórios">
            <p>
              Os computadores dos laboratórios da PUC não permitem compartilhar a localização. Faça a solicitação pelo seu
              próprio computador ou celular.
            </p>
          </Aviso>
        </Passo>
        <Passo titulo="Envie o comprovante e aguarde">
          <p>
            Selecione <strong>PUC Minas</strong> como instituição e envie um print da <strong>carteirinha digital do app PUC Mobile</strong>{" "}
            ou um <strong>comprovante de matrícula recente</strong>. A análise leva até <strong>2 dias úteis</strong>; quando
            aprovada, o selo <strong>GitHub Pro</strong> aparece na sua conta.
          </p>
        </Passo>
      </Passos>

      <h4 className="tut-parte-titulo">O que você ganha com o GitHub Pro</h4>
      <ul className="tut-lista">
        <li>Repositórios privados ilimitados.</li>
        <li>
          <strong>GitHub Copilot</strong>, com sugestões de código por IA (com testes gratuitos por tempo limitado).
        </li>
        <li>Insights avançados de contribuições, métricas e estatísticas dos seus projetos.</li>
        <li>Mais recursos de CI/CD com GitHub Actions.</li>
        <li>
          Ofertas de parceiros, como um <strong>domínio .dev ou .me grátis por 1 ano</strong> (veja o tutorial de{" "}
          <Ir para="dominios">Domínios .dev e .me</Ir>).
        </li>
      </ul>

      <Aviso tipo="dica" titulo="Detalhes do plano">
        <p>
          Todos os benefícios do GitHub Pro estão em{" "}
          <Link href="https://docs.github.com/pt/get-started/learning-about-github/githubs-plans#github-pro">
            documentação dos planos do GitHub
          </Link>
          .
        </p>
      </Aviso>
    </>
  );
}
