import pucLogo from "../../assets/images/pucminas-logo.png";
import "./PageLayout.css";

/**
 * Card principal da página, no mesmo estilo do SecureLoginPUC_React:
 * faixa azul com a logo da PUC Minas + a logo da API, e o conteúdo embaixo.
 *
 * <PageLayout icon={FaBusSimple} brand="Ônibus BH" title="..." description="...">
 * (sem title, o bloco do título não aparece: usado na página de uma linha)
 *   ...conteúdo...
 * </PageLayout>
 */
const PageLayout = ({ icon: Icon, brand, title, description, children }) => (
  <div className="page-container">
    {/* =====================================================
        FAIXA AZUL: LOGO PUC MINAS + LOGO DA API
        ===================================================== */}
    <header className="page-hero">
      <img src={pucLogo} alt="Logo PUC Minas" className="page-hero-puc" />

      <span className="page-hero-divider" aria-hidden="true" />

      <div className="page-hero-brand">
        {Icon && <Icon className="page-hero-icon" aria-hidden="true" />}
        <span>{brand}</span>
      </div>
    </header>

    {/* =====================================================
        TÍTULO
        ===================================================== */}
    {title && (
      <section className="page-intro">
        <span className="page-label">PUC MINAS</span>
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
        <div className="page-divider" />
      </section>
    )}

    {/* =====================================================
        CONTEÚDO
        ===================================================== */}
    <main className="page-content">{children}</main>

    <footer className="page-footer">
      Projeto didático · PUC Minas · React + Vite
    </footer>
  </div>
);

export default PageLayout;
