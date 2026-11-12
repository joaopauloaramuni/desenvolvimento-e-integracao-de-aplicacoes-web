import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        Jogo feito com <a href="https://pyga.me/" target="_blank" rel="noreferrer">pygame-ce</a> e
        convertido para o navegador com o{" "}
        <a href="https://github.com/pygame-web/pygbag" target="_blank" rel="noreferrer">pygbag</a>.
        Site em React + Vite.
      </p>
    </footer>
  );
}
