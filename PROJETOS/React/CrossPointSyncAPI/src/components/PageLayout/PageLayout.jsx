import pucLogo from "../../assets/images/pucminas-logo.png";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./PageLayout.css";

/**
 * Card principal da página, no mesmo estilo dos outros projetos React:
 * faixa no topo com a logo da PUC Minas + a logo da API, e o conteúdo embaixo.
 * Aqui a faixa é verde de tecido de encadernação, com filete dourado.
 *
 * <PageLayout icon={LuBookOpenText} brand="CrossPoint Sync" title="..." description="...">
 *   ...conteúdo...
 * </PageLayout>
 */
const PageLayout = ({ icon: Icon, brand, title, description, children }) => (
  <div className="page-container">
    {/* =====================================================
        FAIXA VERDE: LOGO PUC MINAS + LOGO DA API
        ===================================================== */}
    <header className="page-hero">
      <img src={pucLogo} alt="Logo PUC Minas" className="page-hero-puc" />

      <span className="page-hero-divider" aria-hidden="true" />

      <div className="page-hero-brand">
        {Icon && <Icon className="page-hero-icon" aria-hidden="true" />}
        <span>{brand}</span>
      </div>

      <ThemeToggle />
    </header>

    {/* =====================================================
        TÍTULO
        ===================================================== */}
    <section className="page-intro">
      <span className="page-label">PUC Minas</span>
      <h1>{title}</h1>
      {description && <p className="page-description">{description}</p>}
      <div className="page-divider" aria-hidden="true" />
    </section>

    {/* =====================================================
        CONTEÚDO
        ===================================================== */}
    <main className="page-content">{children}</main>

    <footer className="page-footer">Projeto didático · PUC Minas · React + Vite + crosspoint-sync</footer>
  </div>
);

export default PageLayout;
