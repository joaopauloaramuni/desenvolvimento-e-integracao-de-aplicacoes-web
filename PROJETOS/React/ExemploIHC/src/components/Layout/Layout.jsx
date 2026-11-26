import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import MenuMobile from "../MenuMobile/MenuMobile";
import "./Layout.css";

/**
 * Estrutura comum a todas as páginas, com HTML semântico (Aula 17):
 * <header>, <nav>, <main> e <footer> viram "regiões" que o leitor de tela
 * lista e permite pular direto.
 *
 * O link "Pular para o conteúdo" é o primeiro item focável: quem navega
 * pelo teclado não precisa passar pelo menu inteiro em toda página.
 */
export default function Layout() {
  return (
    <>
      <a href="#conteudo" className="pular-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="conteudo" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <MenuMobile />
    </>
  );
}
