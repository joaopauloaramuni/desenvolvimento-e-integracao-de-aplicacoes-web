import { useEffect, useState } from "react";
import { FiActivity, FiAward, FiClock, FiExternalLink, FiSun, FiCode } from "react-icons/fi";
import WAKATIME_CONFIG from "../../config/wakatimeConfig";
import { fetchWakaTimeStats } from "../../services/wakatimeService";
import CodingNow from "./CodingNow";
import { formatDate, formatDuration, formatNumber, formatPercent } from "./format";
import { languageColor } from "./languageColors";
import "./WakaTimeStats.css";

/**
 * Painel com as estatísticas do WakaTime (tempo programando, linguagens,
 * editores, sistemas, categorias, projetos e bibliotecas) e o cartão "Codando agora"
 * (em que projeto você está mexendo no editor neste momento).
 *
 * Para usar no seu projeto, copie:
 *   • a pasta components/WakaTimeStats
 *   • services/wakatimeService.js e config/wakatimeConfig.js
 *   • api/_wakatime.js, api/wakatime.js, api/_codando.js, api/codando.js
 *     e o plugin do vite.config.js
 *
 * <WakaTimeStats />
 * <WakaTimeStats initialRange="all_time" showProjects={false} />
 * <WakaTimeStats showCodingNow={false} />
 * <WakaTimeStats showLibraries={false} />
 */

// Nomes que o WakaTime manda em inglês → português
const CATEGORY_NAMES = {
  Coding: "Programando",
  "AI Coding": "Programando com IA",
  "Writing Docs": "Escrevendo documentação",
  "Writing Tests": "Escrevendo testes",
  Debugging: "Depurando",
  Building: "Compilando",
  Browsing: "Navegando",
  "Code Reviewing": "Revisando código",
  Designing: "Design",
  Meeting: "Reuniões",
  Researching: "Pesquisando",
  Learning: "Aprendendo",
  Planning: "Planejando",
};
const OS_NAMES = { Mac: "macOS" };

const { RANGES, DEFAULT_RANGE, PROFILE_URL, MAX_LANGUAGES, HIDDEN_LANGUAGES } =
  WAKATIME_CONFIG;

function useWakaTime(range) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  useEffect(() => {
    let active = true;
    // Mantém os dados antigos na tela enquanto o novo período carrega
    setState((old) => ({ ...old, status: "loading", error: null }));

    fetchWakaTimeStats(range)
      .then((data) => active && setState({ status: "ready", data, error: null }))
      .catch(
        (error) => active && setState((old) => ({ status: "error", data: old.data, error }))
      );

    return () => {
      active = false;
    };
  }, [range]);

  return state;
}

/* =====================================================================
   Pedaços da tela
   ===================================================================== */

function Kpi({ icon: Icon, label, value, note }) {
  return (
    <li className="waka-kpi">
      <span className="waka-kpi-label">
        <Icon aria-hidden="true" />
        {label}
      </span>
      <span className="waka-kpi-value">{value}</span>
      {note && <span className="waka-kpi-note">{note}</span>}
    </li>
  );
}

// Barra única dividida por linguagem (parte do todo)
function LanguageStack({ languages }) {
  return (
    <div className="waka-stack" aria-hidden="true">
      {languages.map((lang) => (
        <span
          key={lang.name}
          className="waka-stack-seg"
          style={{ flexGrow: lang.seconds, background: lang.color }}
          title={`${lang.name} · ${formatDuration(lang.seconds)} · ${formatPercent(lang.percent)}`}
        />
      ))}
    </div>
  );
}

function LanguageList({ languages, rest }) {
  const max = languages[0]?.seconds || 1;
  return (
    <ul className="waka-list">
      {languages.map((lang) => (
        <li key={lang.name} className="waka-row" style={{ "--lang": lang.color }}>
          <div className="waka-row-head">
            <span className="waka-dot" aria-hidden="true" />
            <span className="waka-name">{lang.name}</span>
            <span className="waka-time">{formatDuration(lang.seconds)}</span>
            <span className="waka-pct">{formatPercent(lang.percent)}</span>
          </div>
          <div className="waka-bar" aria-hidden="true">
            <span style={{ width: `${(lang.seconds / max) * 100}%` }} />
          </div>
        </li>
      ))}
      {rest && (
        <li className="waka-row waka-row-rest">
          + {rest.count} {rest.count === 1 ? "outra" : "outras"} ·{" "}
          {formatDuration(rest.seconds)} · {formatPercent(rest.percent)}
        </li>
      )}
    </ul>
  );
}

function MiniList({ title, items, rename = {} }) {
  if (!items?.length) return null;
  return (
    <section className="waka-mini">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item.name}>
            <span className="waka-mini-name">{rename[item.name] ?? item.name}</span>
            <span className="waka-mini-bar" aria-hidden="true">
              <span style={{ width: `${Math.max(item.percent, 2)}%` }} />
            </span>
            <span className="waka-mini-pct">{formatPercent(item.percent)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Bibliotecas mais importadas nos arquivos que você editou
function LibraryList({ libraries }) {
  const max = libraries[0]?.seconds || 1;
  return (
    <ul className="waka-libs">
      {libraries.map((lib, index) => (
        <li key={lib.name}>
          <span className="waka-libs-rank" aria-hidden="true">
            {index + 1}
          </span>
          <span className="waka-libs-name" title={lib.name}>
            {lib.name}
          </span>
          <span className="waka-mini-bar" aria-hidden="true">
            <span style={{ width: `${Math.max((lib.seconds / max) * 100, 2)}%` }} />
          </span>
          <span className="waka-libs-time">{formatDuration(lib.seconds)}</span>
          <span className="waka-mini-pct">{formatPercent(lib.percent)}</span>
        </li>
      ))}
    </ul>
  );
}

function ErrorBox({ error }) {
  const hint = {
    missing_config:
      "Crie o .env.local com o WAKATIME_ACCESS_TOKEN (npm run wakatime:oauth) e reinicie o npm run dev.",
    invalid_token:
      "Gere um token novo com npm run wakatime:oauth (ou configure o refresh token para a renovação automática).",
    pending: "O WakaTime está calculando este período. Tente de novo em alguns segundos.",
  }[error?.code];

  return (
    <div className={`waka-message ${error?.code === "pending" ? "warning" : "error"}`} role="alert">
      <strong>{error?.message ?? "Não foi possível carregar o WakaTime."}</strong>
      {hint && <span>{hint}</span>}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="waka-skeleton" aria-hidden="true">
      <div className="waka-skeleton-kpis">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} />
        ))}
      </div>
      <span className="waka-skeleton-bar" />
      <span className="waka-skeleton-block" />
    </div>
  );
}

/* =====================================================================
   Componente principal
   ===================================================================== */

export default function WakaTimeStats({
  initialRange = DEFAULT_RANGE,
  showRangePicker = true,
  showProjects = true,
  showCodingNow = true,
  showLibraries = true,
}) {
  const [range, setRange] = useState(initialRange);
  const { status, data, error } = useWakaTime(range);

  const hidden = new Set(HIDDEN_LANGUAGES);
  const languages = (data?.languages ?? [])
    .filter((lang) => !hidden.has(lang.name))
    .map((lang) => ({ ...lang, color: languageColor(lang.name) }));
  const top = languages.slice(0, MAX_LANGUAGES);
  const others = languages.slice(MAX_LANGUAGES);
  const rest = others.length
    ? {
        count: others.length,
        seconds: others.reduce((sum, l) => sum + l.seconds, 0),
        percent: others.reduce((sum, l) => sum + l.percent, 0),
      }
    : null;

  const topEditor = data?.editors?.[0];

  return (
    <div className="waka" aria-busy={status === "loading"}>
      {/* ---------- Codando agora (não depende do período) ---------- */}
      {showCodingNow && <CodingNow showProject={showProjects} />}

      {/* ---------- Período + link do perfil ---------- */}
      <div className="waka-toolbar">
        {showRangePicker && (
          <div className="waka-ranges" role="group" aria-label="Período">
            {RANGES.map((option) => (
              <button
                key={option.value}
                type="button"
                className={option.value === range ? "active" : ""}
                aria-pressed={option.value === range}
                onClick={() => setRange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {PROFILE_URL && (
          <a className="waka-profile" href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
            Ver perfil no WakaTime <FiExternalLink aria-hidden="true" />
          </a>
        )}
      </div>

      {status === "error" && <ErrorBox error={error} />}
      {status === "loading" && !data && <Skeleton />}

      {data && (
        <div className={status === "loading" ? "waka-body updating" : "waka-body"}>
          {/* ---------- Indicadores ---------- */}
          <ul className="waka-kpis">
            <Kpi
              icon={FiClock}
              label="Tempo total"
              value={formatDuration(data.totalSeconds)}
              note={
                data.range === "all_time" && data.start
                  ? `desde ${formatDate(data.start)}`
                  : `${formatNumber(languages.length)} linguagens`
              }
            />
            <Kpi
              icon={FiActivity}
              label="Média diária"
              value={formatDuration(data.dailyAverage)}
              note={data.activeDays != null ? `${formatNumber(data.activeDays)} dias ativos` : null}
            />
            {data.today ? (
              <Kpi icon={FiSun} label="Hoje" value={formatDuration(data.today.seconds)} note="até agora" />
            ) : (
              <Kpi
                icon={FiCode}
                label="Editor principal"
                value={topEditor?.name ?? "—"}
                note={topEditor ? `${formatPercent(topEditor.percent)} do tempo` : null}
              />
            )}
            <Kpi
              icon={FiAward}
              label="Melhor dia"
              value={data.bestDay ? formatDuration(data.bestDay.seconds) : "—"}
              note={data.bestDay ? formatDate(data.bestDay.date) : "sem dados no período"}
            />
          </ul>

          {/* ---------- Linguagens ---------- */}
          {languages.length > 0 ? (
            <>
              <LanguageStack languages={languages} />
              <div className="waka-grid">
                <section className="waka-card">
                  <h3>Linguagens</h3>
                  <LanguageList languages={top} rest={rest} />
                </section>

                <aside className="waka-card waka-side">
                  <MiniList title="Editores" items={data.editors} />
                  <MiniList title="Sistemas operacionais" items={data.operatingSystems} rename={OS_NAMES} />
                  <MiniList title="Categorias" items={data.categories} rename={CATEGORY_NAMES} />
                </aside>
              </div>
            </>
          ) : (
            <p className="waka-empty">Nenhuma atividade registrada neste período.</p>
          )}

          {/* ---------- Projetos ---------- */}
          {showProjects && data.projects?.length > 0 && (
            <section className="waka-card waka-projects">
              <h3>Projetos</h3>
              <ul>
                {data.projects.map((project) => (
                  <li key={project.name}>
                    <span>{project.name}</span>
                    <strong>{formatDuration(project.seconds)}</strong>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ---------- Bibliotecas (só com o token) ---------- */}
          {showLibraries && data.libraries?.length > 0 && (
            <section className="waka-card waka-libraries">
              <h3>Bibliotecas</h3>
              <LibraryList libraries={data.libraries} />
              <p className="waka-libs-note">
                Pacotes importados nos arquivos que você editou no período. Um arquivo
                importa várias bibliotecas ao mesmo tempo, então a porcentagem é a fatia
                entre as bibliotecas, não do tempo total.
              </p>
            </section>
          )}

          <p className="waka-source">
            Dados do WakaTime ·{" "}
            {data.mode === "oauth" ? "lidos com o seu token OAuth" : "perfil público"}
          </p>
        </div>
      )}
    </div>
  );
}
