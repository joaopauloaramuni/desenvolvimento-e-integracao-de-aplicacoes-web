import { FiAlertTriangle, FiExternalLink } from "react-icons/fi";

// Aparece no lugar do mapa enquanto o VITE_LOCATIONIQ_TOKEN não estiver configurado
export default function TokenMissing() {
  return (
    <div className="liq-token-missing" role="alert">
      <FiAlertTriangle className="liq-token-icon" aria-hidden="true" />
      <h3>Configure o token do LocationIQ</h3>
      <p>O mapa e as buscas precisam de um token de acesso do LocationIQ para funcionar.</p>

      <ol>
        <li>
          Crie sua conta gratuita em{" "}
          <a href="https://my.locationiq.com/" target="_blank" rel="noopener noreferrer">
            my.locationiq.com <FiExternalLink aria-hidden="true" />
          </a>{" "}
          e confirme o e-mail.
        </li>
        <li>
          No painel, abra <strong>Access Tokens</strong> e copie o token (começa com <code>pk.</code>).
        </li>
        <li>
          Crie o arquivo <code>.env.local</code> na raiz do projeto com:
          <pre>VITE_LOCATIONIQ_TOKEN=pk.seu_token_aqui</pre>
        </li>
        <li>
          Pare e rode de novo o <code>npm run dev</code>.
        </li>
      </ol>
    </div>
  );
}
