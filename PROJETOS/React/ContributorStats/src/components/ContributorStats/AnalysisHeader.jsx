import { FiBookOpen, FiExternalLink, FiPrinter } from "react-icons/fi";
import "./ContributorStats.css";

/**
 * Cabeçalho do resultado: título do trabalho (primeira linha do README.md do
 * repositório analisado), repositório e o botão "Exportar PDF".
 */
export default function AnalysisHeader({ result, onExportPdf, pdfState, disabled }) {
  if (!result) return null;
  const repoUrl = `https://github.com/${result.fullName}`;
  const generatedAt = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

  return (
    <section className="cs-card cs-work">
      <FiBookOpen className="cs-work-icon" aria-hidden="true" />
      <div className="cs-work-main">
        <h2 className="cs-work-title" title={result.title ?? undefined}>
          {result.title ?? result.repo}
        </h2>
        <p className="cs-work-repo">
          <a href={repoUrl} target="_blank" rel="noreferrer">
            {result.fullName} <FiExternalLink aria-hidden="true" />
          </a>
          <span> · {result.scopeLabel}</span>
          {!result.title && <span> · sem título no README.md</span>}
          <span className="cs-print-only"> · relatório gerado em {generatedAt}</span>
        </p>
      </div>
      <button
        type="button"
        className="cs-button cs-button-small cs-work-pdf"
        onClick={onExportPdf}
        disabled={disabled || pdfState !== null}
        title="Ranking, produtividade e tipos de arquivo (por aluno e por grupo) em um único PDF"
      >
        <FiPrinter aria-hidden="true" />
        {pdfState === "preparing" ? "Preparando PDF…" : "Exportar PDF"}
      </button>
    </section>
  );
}
