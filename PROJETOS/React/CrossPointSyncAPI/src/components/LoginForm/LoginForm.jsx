import { useState } from "react";
import { FaAmazon } from "react-icons/fa";
import { LuBookOpen, LuLogIn } from "react-icons/lu";
import CROSSPOINT_CONFIG from "../../config/crosspointConfig";
import "./LoginForm.css";

/**
 * Entrada com a mesma conta do leitor (CrossPoint ou KOReader).
 * O servidor pode ser o hospedado ou um self-hosted.
 */
function LoginForm({ onEntrar, onDemo, entrando, erro }) {
  const [form, setForm] = useState({
    servidor: CROSSPOINT_CONFIG.DEFAULT_SERVER,
    usuario: "",
    senha: "",
    lembrar: false,
  });

  const mudar = (evento) => {
    const { name, value, type, checked } = evento.target;
    setForm((atual) => ({ ...atual, [name]: type === "checkbox" ? checked : value }));
  };

  const enviar = (evento) => {
    evento.preventDefault();
    if (!entrando) onEntrar(form);
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={enviar} aria-labelledby="login-titulo">
        <h2 className="section-title" id="login-titulo">
          Entrar na sua conta de sincronização
        </h2>
        <p className="login-hint">Use o mesmo usuário e senha configurados no CrossPoint ou no KOReader.</p>

        <label className="field">
          <span>Servidor</span>
          <input
            name="servidor"
            type="url"
            inputMode="url"
            autoComplete="url"
            required
            value={form.servidor}
            onChange={mudar}
            placeholder="https://sync.crosspointreader.com"
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Usuário</span>
            <input
              name="usuario"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck="false"
              required
              value={form.usuario}
              onChange={mudar}
            />
          </label>

          <label className="field">
            <span>Senha</span>
            <input
              name="senha"
              type="password"
              autoComplete="current-password"
              required
              value={form.senha}
              onChange={mudar}
            />
          </label>
        </div>

        <label className="check">
          <input name="lembrar" type="checkbox" checked={form.lembrar} onChange={mudar} />
          <span>Lembrar neste navegador</span>
        </label>

        {erro && (
          <p className="alert alert-error" role="alert">
            {erro}
          </p>
        )}

        <div className="login-actions">
          <button type="submit" className="btn btn-primary" disabled={entrando}>
            <LuLogIn aria-hidden="true" />
            {entrando ? "Entrando…" : "Entrar"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onDemo} disabled={entrando}>
            <LuBookOpen aria-hidden="true" />
            Ver demonstração
          </button>
        </div>
      </form>

      <aside className="login-aside" aria-labelledby="kindle-titulo">
        <h3 id="kindle-titulo">
          <FaAmazon aria-hidden="true" /> E os livros do Kindle?
        </h3>
        <p>
          O crosspoint-sync tem um conector <strong>Amazon Kindle</strong> (beta, só leitura). Depois de vinculá-lo no
          site do servidor, em <em>Connected services</em>, ele puxa a sua posição do Whispersync e atualiza os livros que
          também estão no seu leitor.
        </p>
        <p>
          Aqui, esses livros ganham o selo <span className="kindle-chip">Kindle</span> quando a leitura mais recente
          veio de lá.
        </p>
        <p className="login-aside-note">
          O app manda ao servidor o MD5 da senha, exatamente como o KOReader faz. Com “Lembrar”, esse MD5 fica no
          localStorage deste navegador.
        </p>
      </aside>
    </div>
  );
}

export default LoginForm;
