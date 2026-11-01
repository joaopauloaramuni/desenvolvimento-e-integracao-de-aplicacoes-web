import pucLogo from "../../assets/images/pucminas-logo.png";
import AraInkLogo from "../AraInkLogo/AraInkLogo";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./PageLayout.css";

/**
 * Card principal da página, no mesmo estilo dos outros projetos React:
 * faixa no topo com a logo da PUC Minas + a marca AraInk, e o conteúdo embaixo.
 * Aqui a faixa é roxa, da cor da tinta de stencil usada pelos tatuadores.
 *
 * <PageLayout label="..." description="...">
 *   ...conteúdo...
 * </PageLayout>
 */
const PageLayout = ({ label, description, children }) => (
  <div className="page-container">
    {/* =====================================================
        FAIXA ROXA: LOGO PUC MINAS + ARAINK
        ===================================================== */}
    <header className="page-hero">
      <img src={pucLogo} alt="Logo PUC Minas" className="page-hero-puc" />

      <span className="page-hero-divider" aria-hidden="true" />

      <div className="page-hero-brand">
        <AraInkLogo className="page-hero-icon" />
        <span>AraInk</span>
      </div>

      <ThemeToggle />
    </header>

    {/* =====================================================
        TÍTULO
        ===================================================== */}
    <section className="page-intro">
      {label && <span className="page-label">{label}</span>}
      <h1 className="page-title">AraInk</h1>
      {description && <p className="page-description">{description}</p>}
      <div className="page-divider" aria-hidden="true" />
    </section>

    {/* =====================================================
        CONTEÚDO
        ===================================================== */}
    <main className="page-content">{children}</main>

    <footer className="page-footer">AraInk · João Paulo Aramuni · React + Vite + IA</footer>
  </div>
);

export default PageLayout;
