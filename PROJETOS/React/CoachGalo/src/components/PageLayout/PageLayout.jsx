import escudo from "../../assets/images/atletico.svg";
import "./PageLayout.css";

/**
 * Moldura da página: faixa listrada em preto e branco (a camisa do Galo),
 * a placa com o escudo do Atlético e o nome do app, e o conteúdo embaixo.
 */
const PageLayout = ({ titulo, descricao, children }) => (
  <div className="page">
    <header className="page-hero">
      <div className="page-marca">
        <img src={escudo} alt="Escudo do Clube Atlético Mineiro" className="page-escudo" />
        <span>CoachGalo</span>
      </div>
    </header>

    <section className="page-intro">
      <h1>{titulo}</h1>
      {descricao && <p>{descricao}</p>}
    </section>

    <main className="page-conteudo">{children}</main>

    <footer className="page-rodape">
      Projeto didático, sem fins comerciais · React + Vite · Fotos e nomes pertencem aos seus titulares
    </footer>
  </div>
);

export default PageLayout;
